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
ios系统是调用微信h5支付：返回时刷新当前页面；安卓系统不刷新。只有配置了支付回调页面才会刷新。（小米6内置浏览器：flex布局时，自带的导航会遮住底部的一部分页面）