package com.web.dto.request;

import com.web.enums.PayType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceRequest {

    private PayType payType;

    private String requestIdMomo;

    private String orderIdMomo;

    private String vnpOrderInfo;

    private String voucherCode;

    private String receiverName;

    private String phone;

    private String address;

    private String urlVnpay;

    private String note;

    private Long wardId;

}
