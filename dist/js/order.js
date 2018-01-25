$(function() {
    //点击返回
    $('header').on('touchend', '.iconfont', function() {
        window.history.back();
    })


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
    function shop(flag) {
        if (flag > 0) {
            num++
        } else if (num >= 2) {
            num--
        }
        if (num == 1) {
            $('.shop-num .price').text('￥' + 1288.00);
            $('.discount .discount-info').text('无优惠');
            $('.price .total-price').text('￥' + 1288.00);
            $('footer .total-price').text('￥' + 1288.00);
        } else {
            $('.shop-num .price').text('￥' + (num * 1288).toFixed(2));
            $('.discount .discount-info').text('￥' + (num * 1288 * 0.2).toFixed(2));
            $('.price .total-price').text('￥' + (num * 1288 * 0.8).toFixed(2));
            $('footer .total-price').text('￥' + (num * 1288 * 0.8).toFixed(2));
        }
        $('.goods-num').text(num);
        $('.shop-num .num').text(num);
    }

    $('.shopping').on('touchend', '.iconfont', function() {
        var flag = $(this).attr('data-num');
        shop(flag);
    })


    $('footer').on('click', '.account', function() {
        if (url == undefined) {
            layer.msg('请填写收货人地址')
        } else {
            create_order();
        }
    })

    //呈現支付提示框
    function flag_shade() {
        $('.shade').show();
        $('.shade_wrapper').show();
    }

    //刷新頁面
    function reurl() {
        var curUrl = location.href;
        var times = curUrl.split("#");
        if (times[1] != 1) {
            curUrl += "#1";
            self.location.href = curUrl;
        }
    }
    //判断安卓手机  刷新页面
    // var u = navigator.userAgent;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // if (isAndroid) {
    //     alert(2222)
    //     reurl()
    // }

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
        orderStatus(orderId);
    })

    //点击未支付支付
    $('.shade_wrapper').on('touchend', '.pay_fail', function() {
        console.log('未支付');
        var payInfo = sessionStorage.getItem('payInfo');
        payInfo = JSON.parse(payInfo);
        var orderId = payInfo.orderId;
        orderStatus(orderId);
    })

    //确认下单
    function create_order() {
        $.ajax({
            url: '/api/create_order.php',
            type: 'post',
            async: false,
            dataType: "JSON",
            data: {
                productId: '',
                price: 1288,
                name: name,
                cell: cell,
                address: pro + address,
                num: num,
                remark: '',
                device: '',
                sign: '',
                sign: ''
            },
            success: function(data) {
                window.orderId = data.data.orderId;
                console.log(orderId);
                getUrl(orderId);
            },
            error: function() {
                console.log('下单api获取失败')
            }
        })
    }
    //获取支付url
    function getUrl(orderId) {
        $.ajax({
            url: '/api/prepay.php',
            type: 'post',
            dataType: "JSON",
            async: false,
            data: {
                orderId: orderId
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
    function orderStatus(orderId) {
        $.ajax({
            url: '/api/query_order.php',
            type: 'get',
            async: false,
            dataType: "JSON",
            data: {
                orderId: orderId,
                sign: ''
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