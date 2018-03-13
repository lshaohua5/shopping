$(function() {


    // 调用微信支付接口
    var appId = "";
    var timeStamp = "";
    var nonceStr = "";
    var package = "";
    var signType = "";
    var paySign = "";

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
    var sign = $.md5(stringSignTemp).toUpperCase();
    console.log(sign);
    getProduct(ts, sign);
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
                $('.money .price .total-price').text('￥' + data.data.price);
                $('.money .shop-num .price').text('￥' + data.data.price);
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
            $('.discount .discount-info').text('￥' + (num * price * 0).toFixed(2));
            $('.price .total-price').text('￥' + (num * price * 1).toFixed(2));
            $('footer .total-price').text('￥' + (num * price * 1).toFixed(2));
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
            console.log(ts_create);
            var name = userInfo.name;
            var cell = userInfo.cell;
            var address = userInfo.pro + userInfo.address;
            var pr = 1;
            var pr_sign = 'productId=1';
            var num = $('.shop-num .num').text();
            var num_sign = 'num=' + num;
            var time_sign = 'ts=' + ts_create;
            console.log(time_sign);
            var price_sign = 'price=' + price;
            var name_sign = 'name=' + name;
            var cell_sign = 'cell=' + cell;
            var address_sign = 'address=' + address;
            var arr1 = [address_sign, cell_sign, num_sign, name_sign, price_sign, time_sign, pr_sign];
            arr1 = arr1.sort();
            var str1 = arr1.join('&') + '&key=innergluta@2018';
            sign1 = $.md5(str1).toUpperCase();
            $('footer .pay_shade').addClass('pay_show_shade');
            create_order(price, pr, name, cell, address, num, ts_create, sign1);
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
        var arr_status = [orderId_status, time_status];
        arr_status = arr_status.sort();
        var str_status = arr_status.join('&') + '&key=innergluta@2018';
        sign_status = $.md5(str_status).toUpperCase();
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
        var arr_status = [orderId_status, time_status];
        arr_status = arr_status.sort();
        var str_status = arr_status.join('&') + '&key=innergluta@2018';
        sign_status = $.md5(str_status).toUpperCase();
        orderStatus(orderId, ts_status, sign_status);
    })

    //确认下单
    function create_order(price, pr, name, cell, address, num, ts, sign) {
        $.ajax({
            url: '/api/create_order.php',
            type: 'post',
            async: false,
            dataType: "JSON",
            data: {
                productId: pr,
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
                console.log(data);
                if (data.code == 200) {
                    window.orderId = data.data.orderId;
                    var orderId_s = 'orderId=' + orderId;
                    var ts_s = new Date().getTime();
                    var time_s = 'ts=' + ts_s;
                    var arr_s = [orderId_s, time_s];
                    arr_s = arr_s.sort();
                    var str_s = arr_s.join('&') + '&key=innergluta@2018';
                    console.log(str_s);
                    sign_s = $.md5(str_s).toUpperCase();
                    console.log(sign_s);
                    weixinPay(orderId, ts_s, sign_s);
                } else {
                    layer.msg('下单失败。请重新下单')
                }

            },
            error: function() {
                console.log('下单api获取失败')
            }
        })
    }

    //微信支付api接口
    function weixinPay(orderId, ts, sign) {
        $.ajax({
            url: '/api/prepay_weixin.php',
            type: 'post',
            dataType: "JSON",
            async: false,
            data: {
                orderId: orderId,
                ts: ts,
                sign: sign
            },
            success: function(data) {
                console.log(data);
                var orderId = data.data.orderId;
                var charge = data.data.charge;
                console.log(charge);
                console.log(charge.appId);
                appId = charge.appId;
                timeStamp = charge.timeStamp;
                nonceStr = charge.nonceStr;
                package = charge.package;
                signType = charge.signType;
                paySign = charge.paySign;
                //唤起微信支付
                // if (appId != '') {
                //     pay();
                // }
                weixinConfig(appId, timeStamp, nonceStr, paySign);
                wxPay(timeStamp, nonceStr, package, signType, paySign);
                var pay_info = {};
                pay_info.orderId = orderId;
                pay_info.charge = charge;
                payInfo = JSON.stringify(pay_info);
                sessionStorage.removeItem('payInfo');
                sessionStorage.setItem('payInfo', payInfo);
                $('footer .pay_shade').removeClass('pay_show_shade').addClass('pay_hide_shade');
            },
            error: function() {
                console.log('下单api获取失败')
            }
        })
    }






    //唤起微信支付
    // function pay() {
    //     if (typeof WeixinJSBridge == "undefined") {
    //         if (document.addEventListener) {
    //             document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    //         } else if (document.attachEvent) {
    //             document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
    //             document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    //         }
    //     } else {
    //         onBridgeReady();
    //     }
    // }

    // //开始支付
    // function onBridgeReady() {
    //     WeixinJSBridge.invoke(
    //         'getBrandWCPayRequest', {
    //             "appId": appId, //公众号名称，由商户传入
    //             "timeStamp": timeStamp, //时间戳，自1970年以来的秒数
    //             "nonceStr": nonceStr, //随机串
    //             "package": package,
    //             "signType": signType, //微信签名方式:
    //             "paySign": paySign //微信签名
    //         },
    //         function(res) {
    //             console.log("支付成功"); // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
    //             if (res.err_msg == "get_brand_wcpay_request:ok") {
    //                 if (typeof WeixinJSBridge == "undefined") {
    //                     if (document.addEventListener) {
    //                         document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    //                     } else if (document.attachEvent) {
    //                         document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
    //                         document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    //                     }
    //                 } else {
    //                     //支付成功
    //                     //WeixinJSBridge.call('closeWindow');
    //                     window.location.href = 'pay_success.html'
    //                 }
    //             } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
    //                 console.log("支付过程中用户取消");
    //                 window.location.href = 'pay_fail_weixin.html'
    //             } else {
    //                 //支付失败
    //                 console.log(res.err_msg)
    //             }
    //         }
    //     );
    // }

    //微信JS-SDK配置
    function weixinConfig(appId, timestamp, nonceStr, paySign) {
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: paySign, // 必填，签名，见附录1
            jsApiList: [
                    'chooseWXPay'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    }
    //调起微信支付
    function wxPay(timestamp, nonceStr, package, signType, paySign) {
        wx.ready(function() {
            wx.chooseWXPay({
                timestamp: timestamp,
                nonceStr: nonceStr,
                package: package,
                signType: signType, // 注意：新版支付接口使用 MD5 加密
                paySign: paySign,
                success: function(res) {
                    console.log(res);
                    // 支付成功后的回调函数  
                    if (res.errMsg == "chooseWXPay:ok") {
                        //支付成功  
                        alert('支付成功');
                        window.location.href = 'pay_success.html'
                    } else if (res.errMsg == "chooseWXPay:fail") {
                        alert(res.errMsg);
                        window.location.href = 'pay_fail_weixin.html'
                    }
                },
                cancel: function(res) {
                    //支付取消  
                    alert('支付取消');
                }
            })
        });
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
                console.log(data);
                var orderStatu = data.data.orderStatus;
                if (orderStatu == 0) {
                    window.location.href = 'pay_fail_weixin.html';
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