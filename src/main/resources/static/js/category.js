async function loadAllCategory(){
    var url = 'http://localhost:8080/api/category/public/findAll';
    const res = await fetch(url, {});
    var list = await res.json();
    var main = '<option value="">Tất cả danh mục</option>'
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("danhmuc").innerHTML = main;
}


async function loadCategoryCheckBox(){
    var url = 'http://localhost:8080/api/category/public/findAll';
    const res = await fetch(url, {});
    var list = await res.json();
    var main = ''
    for (i = 0; i < list.length; i++) {
        main += `<div class="singlelistmenu">
                    <label class="checkbox-custom cateparent">${list[i].name}</i>
                        <input name="categoryIds" value="${list[i].id}" type="checkbox">
                        <span class="checkmark-checkbox"></span>
                    </label>
                </div>`
    }
    document.getElementById("listsearchCategory").innerHTML = main;
}
