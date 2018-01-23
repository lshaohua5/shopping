var gulp = require("gulp");
var plumber = require("gulp-plumber");//书写出现语法错误时 不至于终止gulp
var minify = require("gulp-minify-html"); //压缩html文件
var less = require("gulp-less"); //编译less文件
var mincss = require("gulp-minify-css");//压缩css文件
var minjs = require("gulp-uglify");//压缩js文件
var webpack = require("gulp-webpack");
var vinyl = require("vinyl-named"); //保证webpack生成的文件名能够和原文件名相同
var imagemin = require("gulp-imagemin"); //压缩img
var connect = require("gulp-connect"); //服务
/*1.创建任务   task
 * 2.找到需要操作的文件  src
 * 3.pipe()   管道   需要对文件的操作
 * 4.dest  把文件放到哪里
 */

/*编译index*/
gulp.task("copy-index", function () {
    gulp.src("*.html")
        .pipe(plumber())
        //.pipe(minify())//压缩html文件
        .pipe(gulp.dest("dist/"))
        .pipe(connect.reload())
});

/*编译less*/
gulp.task("less", function () {
    gulp.src("src/css/*.less")
        .pipe(plumber())
        .pipe(less())
        //.pipe(mincss())
        .pipe(gulp.dest("dist/css"))
        .pipe(connect.reload())
});


/*编译js*/
var entryjs = [
    "src/js/index.js",
    "src/js/order.js",
    "src/js/add_address.js"
];
gulp.task("copy-js", function () {
    gulp.src(entryjs)
        .pipe(plumber())
        .pipe(vinyl())
        .pipe(webpack({
            output: {
                filename: "[name].js"
            }
        }))
        .pipe(gulp.dest("dist/js"))
        .pipe(connect.reload())
});


/*编译img*/
gulp.task("img", function () {
    gulp.src("src/img/*.*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
        .pipe(connect.reload())
});


/*监听*/

gulp.task("watch", function () {
    gulp.watch("*.html", ["copy-index"])
    gulp.watch("src/css/*.less", ["copy-index"])
    gulp.watch(entryjs, ["copy-index"])
    gulp.watch("src/img/*.*", ["copy-index"])
});


/*服务器*/
gulp.task("server", function () {
    connect.server({
        root: 'dist',
        port: "8080",
        livereload: true
    })
});

gulp.task("default", ["watch", "server"]);