var listFile = [];

async function loadAProduct() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id != null) {
        var url = 'http://localhost:8080/api/product/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        var result = await response.json();
        console.log(result)
        document.getElementById("manhinh").value = result.screen
        document.getElementById("tensp").value = result.name
        document.getElementById("hedieuhanh").value = result.operaSystem
        document.getElementById("price").value = result.price
        linkbanner = result.imageBanner
        document.getElementById("imgpreview").src = result.imageBanner
        tinyMCE.get('editor').setContent(result.description)
        document.getElementById("khesim").value = result.sim
        document.getElementById("masp").value = result.code
        document.getElementById("camtruoc").value = result.frontCamera
        document.getElementById("cpu").value = result.cpu
        document.getElementById("danhmucsp").value = result.category.id
        document.getElementById("baomat").value = result.securityInfor
        document.getElementById("oldprice").value = result.oldPrice
        document.getElementById("hangsx").value = result.tradeMark.id
        document.getElementById("camsau").value = result.backCamera
        document.getElementById("chatlieu").value = result.material
        document.getElementById("tinhnangdacbiet").value = result.specialFeature
        document.getElementById("mangdd").value = result.mobileNetwork
        var phukien = result.accessory.split(",");
        console.log(phukien);
        $("#listdpar").val(phukien).change();;
        var main = ''
        for (i = 0; i < result.productImages.length; i++) {
            main += `<div id="imgdathem${result.productImages[i].id}" class="col-md-2 col-sm-4 col-6">
                        <img src="${result.productImages[i].linkImage}" class="image-uploaded">
                        <button onclick="deleteProductImage(${result.productImages[i].id})" class="btn btn-danger form-control">Xóa ảnh</button>
                    </div>`
        }
        document.getElementById("preview").innerHTML = main
        

        var maincol = ''
        for (i = 0; i < result.productColors.length; i++) {
              maincol += 
              `<tr id="tranhdathem${result.productColors[i].id}">
                    <td><input id="tenmaudathem${result.productColors[i].id}" value="${result.productColors[i].name}" class="form-control"></td>
                    <td><input id="giamaudathem${result.productColors[i].id}" value="${result.productColors[i].price}" class="form-control"></td>
                    <td><input id="soluongmaudathem${result.productColors[i].id}" value="${result.productColors[i].quantity}" class="form-control"></td>
                    <td class="colanhdathem">
                        <img id="anhmaudathem${result.productColors[i].id}" src="${result.productColors[i].image}" class="imgcolordathem">
                        <input id="filemaudathem${result.productColors[i].id}" type="file">
                        <input value="${result.productColors[i].image}" id="linkmaudathem${result.productColors[i].id}" type="hidden">
                    </td>
                    <td class="sticky-col">
                        <i onclick="deleteProductColor(${result.productColors[i].id})" class="fa fa-trash pointer"></i>
                        <i onclick="updateMauSac(${result.productColors[i].id})" class="fa fa-edit pointer"></i>
                    </td>
                </tr>`
        }
        document.getElementById("tablemausacdathem").innerHTML = maincol
    }
}

async function updateMauSac(id) {
    var con = confirm("Xác nhận xóa màu này?")
    if (con == false) {
        return;
    }
    var img = document.getElementById("linkmaudathem"+id).value
    var anhtam = await uploadFile(document.getElementById("filemaudathem"+id))
    if(anhtam != null){
        img = anhtam;
    }
    var obj = {
        "id":id,
        "name":document.getElementById("tenmaudathem"+id).value,
        "price":document.getElementById("giamaudathem"+id).value,
        "quantity":document.getElementById("soluongmaudathem"+id).value,
        "image":img,
    }
    var res = await fetch('http://localhost:8080/api/product-color/admin/update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(obj)
    });
    if(res.status < 300){
        toastr.success("Cập nhật màu sắc thành công");
        document.getElementById("anhmaudathem"+id).src = img
    }
}

var linkbanner = '';
async function saveProduct() {

    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");

    var url = 'http://localhost:8080/api/product/admin/create';
    if (id != null) {
        url = 'http://localhost:8080/api/product/admin/update';
    }

    document.getElementById("loading").style.display = 'block'
    var colorStorage = await loadMauSacVaAnh();

    if(price == null || price == ""){
        alert("giá tiền không được bỏ trống")
        return;
    }


    await uploadFile(document.getElementById("anhdaidien"));
    var listLinkImg = await uploadMultipleFileNotResp();
    var product = {
        "id": id,
        "code": document.getElementById("masp").value,
        "name": document.getElementById("tensp").value,
        "price": document.getElementById("price").value,
        "oldPrice": document.getElementById("oldprice").value,
        "imageBanner": linkbanner,
        "description": tinyMCE.get('editor').getContent(),
        "screen": document.getElementById("manhinh").value,
        "frontCamera": document.getElementById("camtruoc").value,
        "backCamera": document.getElementById("camsau").value,
        "operaSystem": document.getElementById("hedieuhanh").value,
        "cpu": document.getElementById("cpu").value,
        "material": document.getElementById("chatlieu").value,
        "accessory": $("#listdpar").val().toString(),
        "specialFeature": document.getElementById("tinhnangdacbiet").value,
        "sim": document.getElementById("khesim").value,
        "securityInfor": document.getElementById("baomat").value,
        "mobileNetwork": document.getElementById("mangdd").value,
        "tradeMarkId": document.getElementById("hangsx").value,
        "categoryId": document.getElementById("danhmucsp").value,
        "linkLinkImages": listLinkImg,
        "color": colorStorage,
    }
    console.log(product)
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(product)
    });
    var result = await response.json();
    console.log(result)

    if (response.status < 300) {
        swal({ title: "Thông báo", text: "thêm/sửa sản phẩm thành công", type: "success" },
            function() { window.location.href = 'product' });
    } else {
        swal({title: "Thông báo",text: "thêm/sửa sản phẩm thất bại",type: "error"},
            function() { document.getElementById("loading").style.display = 'none' });
    }
}




async function loadAllCategorySelect() {
    var url = 'http://localhost:8080/api/category/public/findAll';
    const response = await fetch(url, {
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("danhmucsp").innerHTML = main
}
async function loadAllTradeMarkSelect() {
    var url = 'http://localhost:8080/api/trademark/public/findAll';
    const response = await fetch(url, {
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("hangsx").innerHTML = main
}




async function deleteProductColor(id) {
    var con = confirm("Xác nhận xóa màu này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product-color/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa thành công!");
        document.getElementById("tranhdathem"+id).remove();
    }
    else{
        toastr.error("Không thể xóa!");
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}



var size = 8;
async function loadProduct(page, param) {
    param == null?param="":param=param
    var category = document.getElementById("danhmuc").value
    var trademark = document.getElementById("thuonghieu").value
    var url = 'http://localhost:8080/api/product/public/find-all-by-admin?page=' + page + '&size=' + size + '&search=' + param;
    if(category != "" && category != null){
        url += '&category='+category
    }
    if(trademark != "" && trademark != null){
        url += '&trademark='+trademark
    }
    const response = await fetch(url, {
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>#${list[i].id}</td>
                    <td><img src="${list[i].imageBanner}" style="width: 100px;"></td>
                    <td>${list[i].code}</td>
                    <td>${list[i].name}</td>
                    <td>${list[i].category.name}</td>
                    <td>${list[i].tradeMark.name}</td>
                    <td>${formatmoney(list[i].price)}</td>
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].quantitySold}</td>
                    <td class="sticky-col">
                        <i onclick="deleteProduct(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a href="addproduct?id=${list[i].id}"><i class="fa fa-edit iconaction"></i><br></a>
                        <br><i onclick="loadProductComment(${list[i].id})" data-bs-toggle="modal" data-bs-target="#modalcomment" class="fa fa-comments iconaction"></i>
                    </td>
                </tr>`
    }
    document.getElementById("listproduct").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadProduct(${(Number(i) - 1)},${param})" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}


async function deleteProduct(id) {
    var con = confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa sản phẩm thành công!");
        loadProduct(0,"")
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteProductImage(id) {
    var con = confirm("Bạn chắc chắn muốn xóa ảnh sản phẩm này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product-image/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa ảnh sản phẩm thành công!");
        document.getElementById("imgdathem"+id).style.display = 'none'
    }

}

async function loadMauSacVaAnh() {
    var tablemausac = document.getElementById("tablemausac");
    var listtr = tablemausac.getElementsByTagName("tr");
    var listobj = [];
    var listfileinput = []
    for(var i=0; i<listtr.length; i++){
        var listinput = listtr[i].getElementsByTagName("input");
        var obj = {}
        for(var j=0; j<listinput.length; j++){
            obj.name = listinput[0].value
            obj.price = listinput[1].value
            obj.quantity = listinput[2].value
        }
        listfileinput.push(listinput[3]);
        listobj.push(obj);
    }
    var listImg = await uploadMultipleFile(listfileinput);
    for(var k=0; k < listobj.length; k++){
        listobj[k].image = listImg[k].link;
    }
    return listobj;
}


function previewMauSac(){
    var tablemausac = document.getElementById("tablemausac");
    var tr = document.createElement('tr'); 
    const tdtenmau = document.createElement('td'); 
    const tdgiaban = document.createElement('td'); 
    const tdsoluong = document.createElement('td'); 
    const tdanh = document.createElement('td'); 
    const thaction = document.createElement('td');

    const inputtenmau = document.createElement('input');
    inputtenmau.classList.add('form-control') 
    tdtenmau.appendChild(inputtenmau)

    const inputgiaban = document.createElement('input'); 
    inputgiaban.classList.add('form-control') 
    inputgiaban.value = document.getElementById("price").value
    tdgiaban.appendChild(inputgiaban)

    const inputsoluong = document.createElement('input'); 
    inputsoluong.classList.add('form-control') 
    tdsoluong.appendChild(inputsoluong)

    const inputanh = document.createElement('input'); 
    inputanh.type = 'file'
    tdanh.appendChild(inputanh)


    const iconxoa = document.createElement('i'); 
    iconxoa.classList.add('fa','fa-trash','iconaction')
    thaction.appendChild(iconxoa)
    iconxoa.onclick = function(){
        tr.remove();
    }

    tr.appendChild(tdtenmau)
    tr.appendChild(tdgiaban)
    tr.appendChild(tdsoluong)
    tr.appendChild(tdanh)
    tr.appendChild(thaction)
    tablemausac.appendChild(tr)

}


async function uploadMultipleFile(listF) {
    
    const formData = new FormData()
    for (i = 0; i < listF.length; i++) {
        formData.append("file", listF[i].files[0])
    }
    var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file-order-response';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    return await res.json();
}

async function uploadMultipleFileNotResp() {
    const formData = new FormData()
    for (i = 0; i < listFile.length; i++) {
        formData.append("file", listFile[i])
    }
    var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        return await res.json();
    } else {
        return [];
    }
}


async function uploadFile(filePath) {
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        linkbanner = await res.text();
    }
}

function loadInit() {
    $('input#choosefile').change(function() {
        var files = $(this)[0].files;
    });
    document.querySelector('#choosefile').addEventListener("change", previewImages);

    function previewImages() {
        var files = $(this)[0].files;
        for (i = 0; i < files.length; i++) {
            listFile.push(files[i]);
        }

        var preview = document.querySelector('#preview');

        for (i = 0; i < files.length; i++) {
            readAndPreview(files[i]);
        }

        function readAndPreview(file) {

            // if (!/\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
            //     return alert(file.name + " is not an image");
            // }

            var reader = new FileReader(file);

            reader.addEventListener("load", function() {
                var div = document.createElement('div');
                div.className = 'col-lg-2 col-md-3 col-sm-6 col-6';
                div.style.height = '120px';
                div.style.paddingTop = '5px';
                div.marginTop = '100px';
                preview.appendChild(div);

                var img = document.createElement('img');
                img.src = this.result;
                img.style.height = '85px';
                img.style.width = '90%';
                img.className = 'image-upload';
                img.style.marginTop = '5px';
                div.appendChild(img);

                var button = document.createElement('button');
                button.style.height = '30px';
                button.style.width = '90%';
                button.innerHTML = 'xóa'
                button.className = 'btn btn-warning';
                div.appendChild(button);

                button.addEventListener("click", function() {
                    div.remove();
                    console.log(listFile.length)
                    for (i = 0; i < listFile.length; i++) {
                        if (listFile[i] === file) {
                            listFile.splice(i, 1);
                        }
                    }
                    console.log(listFile.length)
                });
            });

            reader.readAsDataURL(file);

        }

    }

}

async function uploadFileResponse(filePath) {
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        var linkbannesr = await res.text();
        return linkbannesr;
    }
    return "";
}