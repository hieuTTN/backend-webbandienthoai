package com.web.service;

import com.web.entity.ProductColor;
import com.web.repository.ProductColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductColorService {

    @Autowired
    private ProductColorRepository productColorRepository;

    
    public ProductColor findById(Long id) {
        return productColorRepository.findById(id).get();
    }

    
    public ProductColor update(ProductColor productColor) {
        ProductColor ex = productColorRepository.findById(productColor.getId()).get();
        productColor.setProduct(ex.getProduct());
        return productColorRepository.save(productColor);
    }

    
    public List<ProductColor> findByStorage(Long storageId) {
        return productColorRepository.findByProduct(storageId);
    }
}
