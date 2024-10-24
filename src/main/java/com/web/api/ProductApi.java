package com.web.api;

import com.web.dto.request.ProductRequest;
import com.web.dto.request.ProductSearch;
import com.web.entity.Product;
import com.web.mapper.ProductMapper;
import com.web.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product")
@CrossOrigin
public class ProductApi {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductMapper productMapper;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody ProductRequest productRequest) {
        Product response = productService.save(productRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> update(@RequestBody ProductRequest productRequest) {

        Product response = productService.update(productRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findByIdForAdmin(@RequestParam("id") Long id) {
        Product response = productService.findByIdForAdmin(id);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/findById")
    public ResponseEntity<?> findByIdForUser(@RequestParam("id") Long id) {
        Product response = productService.findByIdForAdmin(id);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/find-all-by-admin")
    public ResponseEntity<?> findByAdmin(@RequestParam(value = "category", required = false) Long category,
                                         @RequestParam(value = "trademark", required = false) Long trademark,
                                         @RequestParam(value = "search", required = false) String search, Pageable pageable) {
        Page<Product> response = productService.searchByAdmin(search, category, trademark, pageable);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id) {
        productService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/new-product")
    public ResponseEntity<?> findByAdmin(Pageable pageable) {
        Page<Product> response = productService.newProduct(pageable);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/phu-kien")
    public ResponseEntity<?> phuKien(Pageable pageable) {
        Page<Product> response = productService.phuKien(pageable);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/best-saler")
    public ResponseEntity<?> bestSaler(Pageable pageable) {
        Page<Product> response = productService.bestsaler(pageable);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/san-pham-lienquan")
    public ResponseEntity<?> sanPhamLienQuan(@RequestParam("id") Long idproduct,
                                             @RequestParam(value = "idtrademark", required = false) Long idtrademark,
                                             @RequestParam(value = "idcategory", required = false) Long idcategory, Pageable pageable) {
        Page<Product> response = productService.sanPhamLienQuan(pageable, idtrademark, idcategory, idproduct);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public/san-pham-by-thuong-hieu-hoac-search")
    public ResponseEntity<?> locSanPham(@RequestParam(value = "trademark", required = false) Long trademark,
                                        @RequestParam(value = "search", required = false) String search,
                                        Pageable pageable) {
        Page<Product> response = null;
        if(trademark != null){
            response = productService.sanPhamByThuongHieu(trademark, pageable);
        }
        if(search != null){
            response = productService.sanPhamByParam(search, pageable);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/public/search-full")
    public Page<Product> getProductsByCriteria(@RequestBody ProductSearch search, Pageable pageable) {
        return productService.findProductsByCriteria(search.getCategoryIds(), search.getTrademarkIds(), search.getMinPrice(), search.getMaxPrice(), pageable);
    }
}
