package com.web.service;

import com.web.dto.response.TrademarkDto;
import com.web.entity.TradeMark;
import com.web.exception.MessageException;
import com.web.repository.TradeMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TradeMarkService {

    @Autowired
    private TradeMarkRepository tradeMarkRepository;

    
    public List<TradeMark> findAllList() {
        return tradeMarkRepository.findAll();
    }

    public List<TrademarkDto> findAllAndQuantity() {
        return tradeMarkRepository.getAndQuantity();
    }

    
    public Page<TradeMark> search(String param, Pageable pageable) {
        Page<TradeMark> tradeMarks = tradeMarkRepository.findByParam("%"+param+"%",pageable);
        return tradeMarks;
    }

    
    public TradeMark save(TradeMark tradeMark) {
        if(tradeMarkRepository.findByName(tradeMark.getName()).isPresent()){
            throw new MessageException("Tên thương hiệu đã tồn tại");
        }
        TradeMark result = tradeMarkRepository.save(tradeMark);
        return result;
    }

    
    public TradeMark update(TradeMark tradeMark) {
        if(tradeMarkRepository.findByNameAndId(tradeMark.getName(), tradeMark.getId()).isPresent()){
            throw new MessageException("Tên thương hiệu đã tồn tại");
        }
        TradeMark result = tradeMarkRepository.save(tradeMark);
        return result;
    }

    
    public void delete(Long id) {
        tradeMarkRepository.deleteById(id);
    }

    
    public TradeMark findById(Long id) {
        return tradeMarkRepository.findById(id).get();
    }
}
