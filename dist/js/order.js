$(function() {
    //点击返回
    $('header').on('touchend', '.iconfont', function() {
        window.history.back();
    })
    var ts = new Date().getTime();
    var time = new Date().getTime();
    console.log(time);
    time = 'ts=' + time;
    var pr = 'productId=1';
    var arr = [pr, time];
    arr = arr.sort();
    var stringA = arr.join('&');
    var stringSignTemp = stringA + '&key=innergluta@2018';
    var sign = hex_md5(stringSignTemp).toUpperCase();
    console.log(sign);
    //getProduct(ts, sign);
    //获取商品详情
    function getProduct(ts, sign) {
        $.ajax({
            url: '/api/product.php',
            type: 'get',
            dataType: "JSON",
            async: false,
            data: {
                productId: 1,
                device: '',
                ts: ts,
                sign: sign
            },
            success: function(data) {
                console.log(data)
                $('.shop-car .goods-price').text('￥' + data.data.price);
                $('.money .total-price').text('￥' + data.data.price);
                $('.money .price').text('￥' + data.data.price);
                $('footer .total-price').text('￥' + data.data.price);
            },
            error: function() {
                console.log('商品详情API获取失败')
            }
        })
    }

    //判断用户页面来源
    var url = window.location.href.split('?')[1];
    //添加地址
    if (url != undefined) {
        //获取用户地址
        var userInfo = sessionStorage.getItem('userInfo');
        userInfo = JSON.parse(userInfo);
        var name = userInfo.name;
        var cell = userInfo.cell;
        var pro = userInfo.pro;
        var address = userInfo.address;
        $('.addr-no').hide();
        $('.addr').show();
        $('.addr .userName').text(name);
        $('.addr .tell').text(cell);
        $('.addr .address-county').text(pro);
        $('.addr .location').text(address);
        var orderIscroll = new IScroll('#main-wrapper', {});
        $('.address-wrapper').on('touchend', function() {
            window.location.href = 'add_address.html'
        })
    } else { //用户未添加地址
        $('.addr').hide();
        $('.addr-no').show();
        var orderIscroll = new IScroll('#main-wrapper', {});
        $('.address-wrapper').on('touchend', function() {
            window.location.href = 'add_address.html'
        })
    }
    //商品加 减
    var num = 1; //初始化商品数量


    function shop(flag, price) {
        if (flag > 0) {
            num++
        } else if (num >= 2) {
            num--
        }
        if (num == 1) {
            $('.shop-num .price').text('￥' + price);
            $('.discount .discount-info').text('无优惠');
            $('.price .total-price').text('￥' + price);
            $('footer .total-price').text('￥' + price);
        } else {
            $('.shop-num .price').text('￥' + (num * price).toFixed(2));
            $('.discount .discount-info').text('￥' + (num * price * 0.2).toFixed(2));
            $('.price .total-price').text('￥' + (num * price * 0.8).toFixed(2));
            $('footer .total-price').text('￥' + (num * price * 0.8).toFixed(2));
        }
        $('.goods-num').text(num);
        $('.shop-num .num').text(num);
    }

    $('.shopping').on('touchend', '.iconfont', function() {
        var flag = $(this).attr('data-num');
        var price = $('.shop-car .goods-price').text(); //商品价格
        price = price.substring(1);
        console.log(price);
        shop(flag, price);
    })


    $('footer').on('click', '.account', function() {
        if (url == undefined) {
            layer.msg('请填写收货人地址')
        } else {
            var price = $('.shop-car .goods-price').text(); //商品价格
            price = price.substring(1);
            var userInfo = sessionStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            var ts_create = new Date().getTime();
            var name = userInfo.name;
            var cell = userInfo.cell;
            var address = userInfo.pro + userInfo.address;
            var num = $('.shop-num .num').text();
            var num_sign = 'num=' + num;
            var time_sign = time;
            var price_sign = 'price=' + price;
            var name_sign = 'name=' + name;
            var cell_sign = 'cell=' + cell;
            var address_sign = 'address=' + address;
            var arr1 = [price_sign, name_sign, cell_sign, address_sign, num_sign, time_sign];
            arr1 = arr1.sort();
            var str1 = arr1.join('&') + '&key=innergluta@2018';
            sign1 = hex_md5(str1).toUpperCase();
            create_order(price, name, cell, address, num, ts_create, sign1);
        }
    })

    //呈現支付提示框
    function flag_shade() {
        $('.shade').show();
        $('.shade_wrapper').show();
    }

    //判斷瀏覽器訪問的頁面
    if (sessionStorage.getItem('payInfo')) {
        flag_shade();
    }
    //点击支付完成
    $('.shade_wrapper').on('touchend', '.pay_success', function() {
        console.log('已支付');
        var payInfo = sessionStorage.getItem('payInfo');
        payInfo = JSON.parse(payInfo);
        var orderId = payInfo.orderId;
        var orderId_status = 'orderId=' + orderId;
        var ts_status = new Date().getTime();
        var time_status = 'ts=' + ts_status;
        var arr_status = [orderId_s, time_status];
        arr_status = arr_status.sort();
        var str_status = arr_status.join('&') + '&key=innergluta@2018';
        sign_status = hex_md5(str_status).toUpperCase();
        orderStatus(orderId, ts_status, sign_status);
    })

    //点击未支付支付
    $('.shade_wrapper').on('touchend', '.pay_fail', function() {
        console.log('未支付');
        var payInfo = sessionStorage.getItem('payInfo');
        payInfo = JSON.parse(payInfo);
        var orderId = payInfo.orderId;
        var orderId_status = 'orderId=' + orderId;
        var ts_status = new Date().getTime();
        var time_status = 'ts=' + ts_status;
        var arr_status = [orderId_s, time_status];
        arr_status = arr_status.sort();
        var str_status = arr_status.join('&') + '&key=innergluta@2018';
        sign_status = hex_md5(str_status).toUpperCase();
        orderStatus(orderId, ts_status, sign_status);
    })

    //确认下单
    function create_order(price, name, cell, address, num, ts, sign) {
        $.ajax({
            url: '/api/create_order.php',
            type: 'post',
            async: false,
            dataType: "JSON",
            data: {
                productId: 1,
                price: price,
                name: name,
                cell: cell,
                address: address,
                num: num,
                remark: '',
                device: '',
                ts: ts,
                sign: sign
            },
            success: function(data) {
                window.orderId = data.data.orderId;
                var orderId_s = 'orderId=' + orderId;
                var ts_s = new Date().getTime();
                var time_s = 'ts=' + ts_s;
                var arr_s = [orderId_s, time_s];
                arr_s = arr_s.sort();
                var str_s = arr_s.join('&') + '&key=innergluta@2018';
                sign_s = hex_md5(str_s).toUpperCase();
                getUrl(orderId, ts_s, sign_s);
            },
            error: function() {
                console.log('下单api获取失败')
            }
        })
    }
    //获取支付url
    function getUrl(orderId, ts, sign) {
        $.ajax({
            url: '/api/prepay.php',
            type: 'post',
            dataType: "JSON",
            async: false,
            data: {
                orderId: orderId,
                ts: ts,
                sign: sign
            },
            success: function(data) {
                var mweb_url = data.data.mweb_url;
                var pay_info = {};
                pay_info.orderId = orderId;
                pay_info.mweb_url = mweb_url;
                payInfo = JSON.stringify(pay_info);
                console.log(payInfo);
                sessionStorage.removeItem('payInfo');
                sessionStorage.setItem('payInfo', payInfo);
                window.location.assign(mweb_url);
            },
            error: function() {
                console.log('下单api获取失败')
            }
        })
    }
    //查询订单状态
    function orderStatus(orderId, ts, sign) {
        $.ajax({
            url: '/api/query_order.php',
            type: 'get',
            async: false,
            dataType: "JSON",
            data: {
                orderId: orderId,
                ts: ts,
                sign: sign
            },
            success: function(data) {
                var orderStatu = data.data.orderStatus;
                if (orderStatu == 0) {
                    window.location.href = 'pay_fail.html';
                }
                if (orderStatu == 1) {
                    window.location.href = 'pay_success.html';
                }
            },
            error: function() {
                console.log('下单api获取失败')
            }
        })
    }
})