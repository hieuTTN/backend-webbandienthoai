async function loadAllTrademark(){
    var url = 'http://localhost:8080/api/trademark/public/findAll';
    const res = await fetch(url, {});
    var list = await res.json();
    var main = '<option value="">Tất cả hãng</option>'
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].name}">${list[i].name}</option>`
    }
    document.getElementById("thuonghieu").innerHTML = main;
}


async function loadAllTrademarkMenuLeft(){
    var url = 'http://localhost:8080/api/trademark/public/find-quantity';
    const res = await fetch(url, {});
    var list = await res.json();
    var main = ''
    for (i = 0; i < list.length; i++) {
        main += `<span class="spdanhmucleft">
                    <a href="product?thuonghieu=${list[i].id}" class="danhmucnameleft">${list[i].name}
                        <span class="slsanphamdanhmuc">(${list[i].quantity})</span>
                        <i class="fa fa-chevron-right iconmuitenphai"></i>
                    </a>
                </span>`
    }
    document.getElementById("danhmucleft").innerHTML = main;
}

async function loadTrademarkCheckBox(){
    var url = 'http://localhost:8080/api/trademark/public/find-quantity';
    const res = await fetch(url, {});
    var list = await res.json();
    var main = ''
    for (i = 0; i < list.length; i++) {
        main += `<div class="singlelistmenu">
                    <label class="checkbox-custom cateparent">${list[i].name}</i>
                        <input name="trademarkIds" value="${list[i].id}" type="checkbox">
                        <span class="checkmark-checkbox"></span>
                    </label>
                </div>`
    }
    document.getElementById("listthuonghieu").innerHTML = main;
}
