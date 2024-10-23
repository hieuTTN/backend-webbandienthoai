package com.web.dto.response;

import com.web.entity.Invoice;
import com.web.entity.Product;
import com.web.entity.ProductColor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceDetailResponse {

    private Long id;

    private Integer quantity;

    private Double price;

    private ProductColor productColor;

    private Product product;

    private Invoice invoice;
}
