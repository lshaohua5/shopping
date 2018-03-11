# shopping  简单的微商城，商品加减，地址管理（表单验证），flex、rem布局，本地储存

> A shopping project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
copy-index#编译index页面
gulp

#兼容性问题
1.ios系统是调用微信h5支付：返回时刷新当前页面；安卓系统不刷新。只有配置了支付回调页面才会刷新。
2.（小米6内置浏览器：flex布局时，自带的导航会遮住底部的一部分页面）；
3.window.history.go(-1);返回上一级历史，不刷新页面；而window.history.back();返回上一级，页面刷新；
表单验证：先写验证的方法，之后再事件调用。
4.本地储存：sessionStorage在夸克2.2版本（ios），无法储存。解决本法：获取浏览器的版本号，针对该本版用url传参；
