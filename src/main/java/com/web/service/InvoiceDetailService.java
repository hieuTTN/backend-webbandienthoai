package com.web.service;

import com.web.dto.response.InvoiceDetailResponse;
import com.web.entity.InvoiceDetail;
import com.web.mapper.InvoiceDetailMapper;
import com.web.repository.InvoiceDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class InvoiceDetailService {

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private InvoiceDetailMapper invoiceDetailMapper;

    
    public List<InvoiceDetailResponse> findByInvoice(Long idInvoice) {
        List<InvoiceDetail> list = invoiceDetailRepository.findByInvoiceId(idInvoice);
        List<InvoiceDetailResponse> result = new ArrayList<>();
        for(InvoiceDetail d : list){
            result.add(invoiceDetailMapper.invoiceDetailToResponse(d));
        }
        return result;
    }
}
