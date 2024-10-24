package com.web.service;

import com.web.momo.Environment;
import com.web.dto.request.InvoiceRequest;
import com.web.dto.response.CartResponse;
import com.web.dto.response.InvoiceResponse;
import com.web.entity.*;
import com.web.enums.PayType;
import com.web.enums.StatusInvoice;
import com.web.exception.MessageException;
import com.web.mapper.InvoiceMapper;
import com.web.momo.models.QueryStatusTransactionResponse;
import com.web.momo.processor.QueryTransactionStatus;
import com.web.repository.*;
import com.web.utils.CommonPage;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

@Component
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private HistoryPayRepository historyPayRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private CommonPage commonPage;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductColorRepository productColorRepository;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Autowired
    private WardsRepository wardsRepository;

    @Autowired
    private VNPayService vnPayService;


    
    public InvoiceResponse create(InvoiceRequest invoiceRequest) {
        if(invoiceRequest.getPayType().equals(PayType.MOMO)){
            if(invoiceRequest.getRequestIdMomo() == null || invoiceRequest.getOrderIdMomo() == null){
                throw new MessageException("orderid and requestid require");
            }
            if(historyPayRepository.findByOrderIdAndRequestId(invoiceRequest.getOrderIdMomo(), invoiceRequest.getRequestIdMomo()).isPresent()){
                throw new MessageException("Đơn hàng đã được thanh toán");
            }
            Environment environment = Environment.selectEnv("dev");
            try {
                QueryStatusTransactionResponse queryStatusTransactionResponse = QueryTransactionStatus.process(environment, invoiceRequest.getOrderIdMomo(), invoiceRequest.getRequestIdMomo());
                System.out.println("qqqq-----------------------------------------------------------"+queryStatusTransactionResponse.getMessage());
                if(queryStatusTransactionResponse.getResultCode() != 0){
                    throw new MessageException("Đơn hàng chưa được thanh toán");
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new MessageException("Đơn hàng chưa được thanh toán");
            }
        }
        if(invoiceRequest.getPayType().equals(PayType.VNPAY)){
            if(invoiceRequest.getVnpOrderInfo() == null){
                throw new MessageException("vnpay order infor require");
            }
            if(historyPayRepository.findByOrderIdAndRequestId(invoiceRequest.getVnpOrderInfo(), invoiceRequest.getVnpOrderInfo()).isPresent()){
                throw new MessageException("Đơn hàng đã được thanh toán");
            }
            int paymentStatus = vnPayService.orderReturnByUrl(invoiceRequest.getUrlVnpay());
            if(paymentStatus != 1){
                throw new MessageException("Thanh toán thất bại");
            }
        }
        Double totalAmount = cartService.totalAmountCart();
        Wards wards = wardsRepository.findById(invoiceRequest.getWardId()).get();
        Invoice invoice = new Invoice();
        invoice.setCreatedDate(new Date(System.currentTimeMillis()));
        invoice.setCreatedTime(new Time(System.currentTimeMillis()));
        invoice.setNote(invoiceRequest.getNote());
        invoice.setPhone(invoiceRequest.getPhone());
        invoice.setAddress(invoiceRequest.getAddress());
        invoice.setReceiverName(invoiceRequest.getReceiverName());
        invoice.setPayType(invoiceRequest.getPayType());
        invoice.setStatusInvoice(StatusInvoice.DANG_CHO_XAC_NHAN);
        invoice.setWards(wards);
        invoice.setUser(userUtils.getUserWithAuthority());
        if(invoiceRequest.getVoucherCode() != null){
            if(!invoiceRequest.getVoucherCode().equals("null") && !invoiceRequest.getVoucherCode().equals("")){
                System.out.println("voucher use === "+invoiceRequest.getVoucherCode());
                Optional<Voucher> voucher = voucherService.findByCode(invoiceRequest.getVoucherCode(), totalAmount);
                if(voucher.isPresent()){
                    totalAmount = totalAmount - voucher.get().getDiscount();
                    invoice.setVoucher(voucher.get());
                }
            }
        }
        invoice.setTotalAmount(totalAmount);
        Invoice result = invoiceRepository.save(invoice);
        List<CartResponse> list = cartService.findByUser();
        for(CartResponse c : list){
            InvoiceDetail invoiceDetail = new InvoiceDetail();
            invoiceDetail.setInvoice(result);
            invoiceDetail.setPrice(c.getProductColor().getPrice());
            invoiceDetail.setQuantity(c.getQuantity());
            invoiceDetail.setProductColor(c.getProductColor());
            invoiceDetailRepository.save(invoiceDetail);
            c.getProductColor().setQuantity(c.getProductColor().getQuantity() - c.getQuantity());
            productColorRepository.save(c.getProductColor());
            try {
                c.getProduct().setQuantitySold(c.getProduct().getQuantitySold() + c.getQuantity());
                productRepository.save(c.getProduct());
            }catch (Exception e){}
        }

        if(invoiceRequest.getPayType().equals(PayType.MOMO) || invoiceRequest.getPayType().equals(PayType.VNPAY)){
            HistoryPay historyPay = new HistoryPay();
            historyPay.setInvoice(result);
            if(invoiceRequest.getPayType().equals(PayType.MOMO)){
                historyPay.setRequestId(invoiceRequest.getRequestIdMomo());
                historyPay.setOrderId(invoiceRequest.getOrderIdMomo());
            }
            if(invoiceRequest.getPayType().equals(PayType.VNPAY)){
                historyPay.setRequestId(invoiceRequest.getVnpOrderInfo());
                historyPay.setOrderId(invoiceRequest.getVnpOrderInfo());
            }
            historyPay.setCreatedTime(new Time(System.currentTimeMillis()));
            historyPay.setCreatedDate(new Date(System.currentTimeMillis()));
            historyPay.setTotalAmount(totalAmount);
            historyPayRepository.save(historyPay);
        }
        cartService.removeCart();
        return null;
    }

    
    public InvoiceResponse updateStatus(Long invoiceId, StatusInvoice statusInvoice) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
        invoice.get().setStatusInvoice(statusInvoice);
        Date d = new Date(System.currentTimeMillis());
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            java.util.Date parsedDate = dateFormat.parse(d.toString()+" 00:00:00");
            Timestamp timestamp = new Timestamp(parsedDate.getTime());
            invoice.get().setStatusUpdateDate(timestamp);
        } catch(Exception e) { //this generic but you can control another types of exception
            // look the origin of excption
        }

        invoiceRepository.save(invoice.get());
        return null;
    }

    
    public List<InvoiceResponse> findByUser() {
        User user = userUtils.getUserWithAuthority();
        List<Invoice> invoices = invoiceRepository.findByUser(user.getId());
        List<InvoiceResponse> list = invoiceMapper.invoiceListToInvoiceResponseList(invoices);
        return list;
    }

    
    public Page<InvoiceResponse> findAll(Date from, Date to, Pageable pageable) {
        if(from == null || to == null){
            from = Date.valueOf("2000-01-01");
            to = Date.valueOf("2200-01-01");
        }
        Page<Invoice> page = invoiceRepository.findByDate(from, to,pageable);
//        List<InvoiceResponse> list = invoiceMapper.invoiceListToInvoiceResponseList(page.getContent());
//        Page<InvoiceResponse> result = commonPage.restPage(page,list);
        return null;
    }

    
    public InvoiceResponse cancelInvoice(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
        if(!invoice.get().getPayType().equals(PayType.COD)){
            throw new MessageException("Đơn hàng đã được thanh toán, không thể hủy");
        }
        invoice.get().setStatusInvoice(StatusInvoice.DA_HUY);
        invoice.get().setStatusUpdateDate(new Timestamp(System.currentTimeMillis()));
        Invoice result = invoiceRepository.save(invoice.get());
        List<InvoiceDetail> list  = invoiceDetailRepository.findByInvoiceId(invoiceId);
        for(InvoiceDetail i : list){
            i.getProductColor().setQuantity(i.getQuantity() + i.getProductColor().getQuantity());
            productColorRepository.save(i.getProductColor());
        }
        return null;
    }

    
    public InvoiceResponse findById(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
//        if(invoice.get().getUserAddress().getUser().getId() != userUtils.getUserWithAuthority().getId()){
//            throw new MessageException("access denied");
//        }
        return invoiceMapper.invoiceToInvoiceResponse(invoice.get());
    }

    
    public InvoiceResponse findByIdForAdmin(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
        return null;
    }

    
    public InvoiceResponse timKiemDonHang(Long id, String phone) {
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        if(invoice.isEmpty()){
            throw new MessageException("Không tìm thấy đơn hàng");
        }
        return invoiceMapper.invoiceToInvoiceResponse(invoice.get());
    }

    
    public Page<InvoiceResponse> findAllFull(Date from, Date to, PayType payType, StatusInvoice statusInvoice, Pageable pageable) {
        if(from == null || to == null){
            from = Date.valueOf("2000-01-01");
            to = Date.valueOf("2200-01-01");
        }
        Page<Invoice> page = null;
        if(payType == null && statusInvoice == null){
            page = invoiceRepository.findByDate(from, to,pageable);
        }
        if(payType == null && statusInvoice != null){
            page = invoiceRepository.findByDateAndStatus(from, to, statusInvoice,pageable);
        }
        if(payType != null && statusInvoice == null){
            page = invoiceRepository.findByDateAndPaytype(from, to,payType,pageable);
        }
        if(payType != null && statusInvoice != null){
            page = invoiceRepository.findByDateAndPaytypeAndStatus(from, to,payType,statusInvoice,pageable);
        }

        List<InvoiceResponse> list = invoiceMapper.invoiceListToInvoiceResponseList(page.getContent());
        Page<InvoiceResponse> result = commonPage.restPage(page,list);
        return result;
    }
}
