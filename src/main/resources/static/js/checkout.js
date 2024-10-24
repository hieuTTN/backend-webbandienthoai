var token = localStorage.getItem("token");
var exceptionCode = 417;
async function checkroleUser() {
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/user/check-role-user';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('login')
    }
}


var total = 0;

var voucherId = null;
var voucherCode = null;
var discountVou = 0;
async function loadVoucher() {
    var code = document.getElementById("codevoucher").value
    var url = 'http://localhost:8080/api/voucher/public/findByCode?code=' + code + '&amount=' + (total - Number(20000));
    const response = await fetch(url, {});
    var result = await response.json();
    if (response.status == exceptionCode) {
        var mess = result.defaultMessage
        document.getElementById("messerr").innerHTML = mess;
        document.getElementById("blockmessErr").style.display = 'block';
        document.getElementById("blockmess").style.display = 'none';
        voucherCode = null;
        voucherId = null;
        discountVou = 0;
        document.getElementById("moneyDiscount").innerHTML = formatmoneyCheck(0);
        document.getElementById("totalfi").innerHTML = formatmoneyCheck(total);
    }
    if (response.status < 300) {
        voucherId = result.id;
        voucherCode = result.code;
        discountVou = result.discount;
        document.getElementById("blockmessErr").style.display = 'none';
        document.getElementById("blockmess").style.display = 'block';
        document.getElementById("moneyDiscount").innerHTML = formatmoneyCheck(result.discount);
        document.getElementById("totalfi").innerHTML = formatmoneyCheck(total - result.discount);
    }

}

function checkout() {
    var con = confirm("Xác nhận đặt hàng!");
    if (con == false) {
        return;
    }
    var paytype = $('input[name=paytype]:checked').val()
    if (paytype == "momo") {
        requestPayMentMomo()
    }
    if (paytype == "cod") {
        paymentCod();
    }
    if (paytype == "vnpay") {
        requestPayMentVnpay();
    }
}

async function requestPayMentMomo() {
    var returnurl = 'http://localhost:5500/thanhcong';
    var urlinit = 'http://localhost:8080/api/urlpayment';
    var paymentDto = {
        "content": "Thanh toán điện thoại",
        "returnUrl": returnurl,
        "notifyUrl": returnurl,
        "codeVoucher": voucherCode,
    }
    var orderDto = {
        "payType": "MOMO",
        "voucherCode": voucherCode,
        "note": document.getElementById("ghichudonhang").value,
        "receiverName": document.getElementById("hoten").value,
        "phone": document.getElementById("sodienthoai").value,
        "address": document.getElementById("tenduong").value,
        "wardId": document.getElementById("xa").value,
    }
    localStorage.setItem("orderDto", JSON.stringify(orderDto));
    const res = await fetch(urlinit, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(paymentDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        window.open(result.url, '_blank');
    }
    if (res.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }

}

async function requestPayMentVnpay() {
    var returnurl = 'http://localhost:5500/thanhcong';
    var urlinit = 'http://localhost:8080/api/vnpay/urlpayment';
    var paymentDto = {
        "content": "Thanh toán điện thoại",
        "returnUrl": returnurl,
        "notifyUrl": returnurl,
        "codeVoucher": voucherCode,
    }
    var orderDto = {
        "payType": "VNPAY",
        "voucherCode": voucherCode,
        "note": document.getElementById("ghichudonhang").value,
        "receiverName": document.getElementById("hoten").value,
        "phone": document.getElementById("sodienthoai").value,
        "address": document.getElementById("tenduong").value,
        "wardId": document.getElementById("xa").value,
    }
    localStorage.setItem("orderDto", JSON.stringify(orderDto));
    const res = await fetch(urlinit, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(paymentDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        window.open(result.url, '_blank');
    }
    if (res.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }

}

async function paymentOnline() {
    var uls = new URL(document.URL)
    var orderId = uls.searchParams.get("orderId");
    var requestId = uls.searchParams.get("requestId");
    var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");

    var orderDto = localStorage.getItem("orderDto");
    orderDto = JSON.parse(orderDto);
    if(orderDto.payType == "MOMO"){
        orderDto.requestIdMomo = requestId
        orderDto.orderIdMomo = orderId
    }
    if(orderDto.payType == "VNPAY"){
        const currentUrl = window.location.href;
        const parsedUrl = new URL(currentUrl);
        const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
        orderDto.vnpOrderInfo = vnpOrderInfo
        orderDto.urlVnpay = queryStringWithoutQuestionMark
    }
    var url = 'http://localhost:8080/api/invoice/user/create';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(orderDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        document.getElementById("thanhcong").style.display = 'block'
    }
    if (res.status == exceptionCode) {
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
        document.getElementById("errormess").innerHTML = result.defaultMessage
    }

}



async function paymentCod() {
    var orderDto = {
        "payType": "COD",
        "voucherCode": voucherCode,
        "note": document.getElementById("ghichudonhang").value,
        "receiverName": document.getElementById("hoten").value,
        "phone": document.getElementById("sodienthoai").value,
        "address": document.getElementById("tenduong").value,
        "wardId": document.getElementById("xa").value,
    }
    var url = 'http://localhost:8080/api/invoice/user/create';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(orderDto)
    });
    if (res.status < 300) {
        swal({
                title: "Thông báo",
                text: "Đặt hàng thành công!",
                type: "success"
            },
            function() {
                window.location.replace("taikhoan#invoice")
            });
    }
}


function loadThongTinUser(){
    var user = localStorage.getItem("user");
    user = JSON.parse(user)
    document.getElementById("hoten").value = user.fullname
    document.getElementById("sodienthoai").value = user.phone
}