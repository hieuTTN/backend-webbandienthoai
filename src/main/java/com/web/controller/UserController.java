package com.web.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class UserController {


    @RequestMapping(value = {"/baiviet"}, method = RequestMethod.GET)
    public String baiviet() {
        return "user/baiviet.html";
    }

    @RequestMapping(value = {"/chitietbaiviet"}, method = RequestMethod.GET)
    public String chitietbaiviet() {
        return "user/chitietbaiviet.html";
    }

    @RequestMapping(value = {"/dangky"}, method = RequestMethod.GET)
    public String dangky() {
        return "user/dangky.html";
    }

    @RequestMapping(value = {"/login"}, method = RequestMethod.GET)
    public String login() {
        return "user/login.html";
    }

    @RequestMapping(value = {"/datlaimatkhau"}, method = RequestMethod.GET)
    public String datlaimatkhau() {
        return "user/datlaimatkhau.html";
    }

    @RequestMapping(value = {"/detail"}, method = RequestMethod.GET)
    public String detail() {
        return "user/detail.html";
    }


    @RequestMapping(value = {"/giohang"}, method = RequestMethod.GET)
    public String giohang() {
        return "user/giohang.html";
    }

    @RequestMapping(value = {"/index"}, method = RequestMethod.GET)
    public String index() {
        return "user/index.html";
    }

    @RequestMapping(value = {"/"}, method = RequestMethod.GET)
    public String trangChu() {
        return "redirect:/index";
    }

    @RequestMapping(value = {"/product"}, method = RequestMethod.GET)
    public String product() {
        return "user/product.html";
    }

    @RequestMapping(value = {"/quenmatkhau"}, method = RequestMethod.GET)
    public String quenmatkhau() {
        return "user/quenmatkhau.html";
    }

    @RequestMapping(value = {"/taikhoan"}, method = RequestMethod.GET)
    public String taikhoan() {
        return "user/taikhoan.html";
    }

    @RequestMapping(value = {"/thanhcong"}, method = RequestMethod.GET)
    public String thanhcong() {
        return "user/thanhcong.html";
    }

    @RequestMapping(value = {"/xacnhan"}, method = RequestMethod.GET)
    public String xacnhan() {
        return "user/xacnhan.html";
    }


}
