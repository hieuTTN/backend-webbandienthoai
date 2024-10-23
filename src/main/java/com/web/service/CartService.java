package com.web.service;

import com.web.dto.response.CartResponse;
import com.web.entity.Cart;
import com.web.entity.ProductColor;
import com.web.entity.User;
import com.web.exception.MessageException;
import com.web.repository.CartRepository;
import com.web.repository.ProductColorRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private ProductColorRepository productColorRepository;

    
    public void addCart(Long productColorId) {
        Cart cart = new Cart();
        User user = userUtils.getUserWithAuthority();
        Optional<Cart> c = cartRepository.findByColorAndUser(user.getId(), productColorId);
        if(c.isPresent()){
            return;
        }
        Optional<ProductColor> productColor = productColorRepository.findById(productColorId);
        if (productColor.isEmpty()){
            throw new MessageException("Không tìm thấy color");
        }
        cart.setUser(user);
        cart.setQuantity(1);
        cart.setProductColor(productColor.get());
        cartRepository.save(cart);
    }

    
    public void remove(Long id) {
        cartRepository.deleteById(id);
    }

    
    public List<CartResponse> findByUser() {
        List<Cart> list = cartRepository.findByUser(userUtils.getUserWithAuthority().getId());
        List<CartResponse> responses = new ArrayList<>();
        for(Cart c : list){
            CartResponse cartResponse = new CartResponse();
            cartResponse.setProductColor(c.getProductColor());
            cartResponse.setQuantity(c.getQuantity());
            cartResponse.setProduct(c.getProductColor().getProduct());
            cartResponse.setId(c.getId());
            responses.add(cartResponse);
        }
        return responses;
    }

    
    public void upQuantity(Long id) {
        Cart cart = cartRepository.findById(id).get();
        cart.setQuantity(cart.getQuantity() + 1);
        cartRepository.save(cart);
    }

    
    public void downQuantity(Long id) {
        Cart cart = cartRepository.findById(id).get();
        cart.setQuantity(cart.getQuantity() - 1);
        if(cart.getQuantity() == 0){
            cartRepository.deleteById(id);
            return;
        }
        cartRepository.save(cart);
    }

    
    public void removeCart() {
        cartRepository.deleteByUser(userUtils.getUserWithAuthority().getId());
    }

    
    public Long countCart() {
        return cartRepository.countCart(userUtils.getUserWithAuthority().getId());
    }

    
    public Double totalAmountCart() {
        List<Cart> list = cartRepository.findByUser(userUtils.getUserWithAuthority().getId());
        Double total = 0D;
        for(Cart c : list){
            total += c.getQuantity() * c.getProductColor().getPrice();
        }
        return total;
    }
}
