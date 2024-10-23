package com.web.repository;

import com.web.entity.ProductColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductColorRepository extends JpaRepository<ProductColor,Long> {

    @Query("select p from ProductColor p where p.product.id = ?1")
    List<ProductColor> findByProduct(Long storage);
}
