package com.web.repository;
import com.web.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product,Long>, JpaSpecificationExecutor<Product> {

    @Query("select p from Product p where " +
            "(p.name like ?1 or p.category.name like ?1 or p.tradeMark.name like ?1 or p.code like ?1) and p.deleted <> true")
    public Page<Product> findByParam(String s, Pageable pageable);

    @Query("select p from Product p where " +
            "(p.name like ?1 or p.category.name like ?1 or p.tradeMark.name like ?1 or p.code like ?1) " +
            "and p.category.id = ?2 and p.deleted <> true")
    public Page<Product> findByParamAndCate(String s, Long categoryId, Pageable pageable);

    @Query("select p from Product p where " +
            "(p.name like ?1 or p.category.name like ?1 or p.tradeMark.name like ?1 or p.code like ?1) " +
            "and p.tradeMark.id = ?2 and p.deleted <> true")
    public Page<Product> findByParamAndTrademark(String s, Long trademarkId, Pageable pageable);

    @Query("select p from Product p where " +
            "(p.name like ?1 or p.category.name like ?1 or p.tradeMark.name like ?1 or p.code like ?1) " +
            "and p.tradeMark.id = ?2 and p.category.id = ?3 and p.deleted <> true")
    public Page<Product> findByParamAndTrademarkAndCate(String s, Long trademarkId, Long categoryId, Pageable pageable);

    @Query("select p from Product p where p.deleted <> true")
    Page<Product> newProduct(Pageable pageable);

    @Query("select p from Product p where p.deleted <> true")
    Page<Product> phuKien(Pageable pageable);

    @Query("select p from Product p where p.deleted <> true")
    Page<Product> bestSaler( Pageable pageable);


    @Query("select p from Product p where p.deleted <> true and p.tradeMark.id = ?1 and p.id <> ?2")
    Page<Product> sanPhamLienQuan(Long idTrademark, Long idproduct, Pageable pageable);

    @Query("select p from Product p where p.deleted <> true and p.category.id = ?1 and p.id <> ?2")
    Page<Product> sanPhamLienQuanCate(Long idcategory, Long idproduct, Pageable pageable);


    @Query("select p from Product p where p.deleted <> true and p.name like ?1 and p.price >= ?2 and p.price <= ?3")
    Page<Product> locSanPham(String search, Double small, Double large,Pageable pageable);

    @Query("select p from Product p where p.deleted <> true and p.name like ?1 and p.price >= ?2 and p.price <= ?3 and p.category.id = ?4")
    Page<Product> locSanPham(String search, Double small, Double large, Long idcategory,Pageable pageable);

    @Query("select p from Product p where p.deleted <> true and p.name like ?1 and p.price >= ?2 and p.price <= ?3 and p.tradeMark.name = ?4")
    Page<Product> locSanPham(String search, Double small, Double large, String trademark,Pageable pageable);

    @Query("select p from Product p where p.deleted <> true and p.name like ?1 and p.price >= ?2 and p.price <= ?3 and " +
            "p.tradeMark.name = ?4 and p.category.id = ?5")
    Page<Product> locSanPham(String search, Double small, Double large, String trademark, Long idCategory,Pageable pageable);

    @Query("select p from Product p where p.tradeMark.id = ?1 and (p.deleted = false or p.deleted is null) ")
    Page<Product> sanPhamByThuongHieu(Long trademark, Pageable pageable);

    @Query("select p from Product p where (p.name like ?1 or p.tradeMark.name like ?1 or p.category.name like ?1) and (p.deleted = false or p.deleted is null) ")
    Page<Product> sanPhamByParam(String s, Pageable pageable);
}
