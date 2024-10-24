const exceptionCode = 417;
var token = localStorage.getItem("token");
$(document).ready(function() {
    checkroleAdmin();
    loadmenu();
    loadTopHeader();
    function loadmenu() {
        var content =
            `
            <div class="sidebar-header p-3 text-white">
                <h3>Admin <i class="fa fa-bars pointer" id="iconbaradmin" onclick="openclose()"></i></h3> 
            </div>
            <ul class="list-unstyled components">
                <li>
                    <a href="/index" class="text-white text-decoration-none">
                        <i class="fa fa-home"></i> Trang chủ
                    </a>
                </li>
                <li>
                    <a href="#coltaikhoan" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-user"></i> Tài khoản
                    </a>
                    <ul class="collapse list-unstyleds" id="coltaikhoan">
                        <li class="nav-item">
                            <a href="taikhoan" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách tài khoản</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm tài khoản</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#colbaiviet" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-newspaper"></i> Bài viết
                    </a>
                    <ul class="collapse list-unstyleds" id="colbaiviet">
                        <li class="nav-item">
                            <a href="blog" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách tin đăng</a>
                        </li>
                        <li class="nav-item">
                            <a href="addblog" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm bài viết</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="danhmuc" class="text-white text-decoration-none">
                        <i class="fa fa-list"></i> Danh mục
                    </a>
                </li>
                <li>
                    <a href="thuonghieu" class="text-white text-decoration-none">
                        <i class="fa-brands fa-apple"></i> Thương hiệu
                    </a>
                </li>
                <li>
                    <a href="banner" class="text-white text-decoration-none">
                        <i class="fa fa-image"></i> Banner
                    </a>
                </li>
                <li>
                    <a href="#colkhuyenmai" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-ticket"></i> Khuyến mại
                    </a>
                    <ul class="collapse list-unstyleds" id="colkhuyenmai">
                        <li class="nav-item">
                            <a href="voucher" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách khuyến mại</a>
                        </li>
                        <li class="nav-item">
                            <a href="addvoucher" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm khuyến mại</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#dashboardSubmenu" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-mobile-phone"></i> Sản phẩm
                    </a>
                    <ul class="collapse list-unstyleds" id="dashboardSubmenu">
                        <li class="nav-item">
                            <a href="product" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách sản phẩm</a>
                        </li>
                        <li class="nav-item">
                            <a href="addproduct" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm sản phẩm</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#dashboardSubmenu1" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa-solid fa-chart-line"></i> Thống kê
                    </a>
                    <ul class="collapse list-unstyleds" id="dashboardSubmenu1">
                        <li class="nav-item">
                            <a href="index" class="text-white text-decoration-none ps-4"><i class="fa fa-chart-line"></i> Thống kê</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="invoice" class="text-white text-decoration-none">
                        <i class="fa fa-list"></i> Đơn hàng
                    </a>
                </li>
                <li>
                    <a onclick="dangXuat()" href="#" class="text-white text-decoration-none">
                        <i class="fa fa-sign-out"></i> Đăng xuất
                    </a>
                </li>
            </ul>
           `
        document.getElementById("sidebar").innerHTML = content
    }

    function loadTopHeader(){
        var user = localStorage.getItem("user");
        var fullname = JSON.parse(user).fullname;
        var content =
        `<div class="container-fluid">
            <button class="btn btn-link" id="menu-toggle"><i class="fas fa-bars" onclick="openclose()"></i></button>
            <div class="dropdown ms-auto">
            </div>
    
            <div class="dropdown ms-3">
                <a class="dropdown-toggle d-flex align-items-center text-decoration-none" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="../image/avatar.png" class="rounded-circle avatarheader"/>    
                <span class="navbar-text me-2">Xin chào: ${fullname}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#">Update Info</a></li>
                    <li onclick="dangXuat()"><a class="dropdown-item" href="#">Logout</a></li>
                </ul>
            </div>
        </div>`
        document.getElementById("navbarmain").innerHTML = content
    }
});

async function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../logout')
}

function openclose(){
    document.getElementById("sidebar").classList.toggle("toggled");
    document.getElementById("page-content-wrapper").classList.toggle("toggled");
    document.getElementById("navbarmain").classList.toggle("navbarmainrom");
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

async function checkroleAdmin() {
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/admin/check-role-admin';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login')
    }
}







