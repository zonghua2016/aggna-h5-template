/*
 * @Author       : tongzonghua
 * @Date         : 2020-11-12 10:31:54
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 16:02:19
 * @Email        : tongzonghua@360.cn
 * @Description  : 资源静态化
 * @FilePath     : /cli/aggna-h5-template/gulpfile.js
 */
const gulp = require("gulp");
const path = require("path");
const runSequence = require("run-sequence");
const cdnImage = require("@q/gulp-cdn-image");
const cdnStatic = require("@q/gulp-cdn-static");
const replace = require("gulp-string-replace");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const clean = require("gulp-clean");

const pkg = require("./package.json");

const releasePath = path.join(__dirname, "/dist");


gulp.task("cdn_img", () => {
  return gulp
    .src([
      releasePath + "/static/css/*",
      "!" + releasePath + "/static/{images,img,fonts}/**",
      "!" + releasePath + "/**/*.{swf,map,gz,json,txt,png,jpg,jpeg,gif}"
    ])
    .pipe(
      cdnImage({
        host: {
          domain: "ssl.qhres.com",
          protocol: "https",
          max: 5,
          min: 1
        },
        notCssTypeExts: [".html", ".php"],
        relativePath: releasePath
      })
    )
    .pipe(gulp.dest(releasePath + "/static/css"));
});

gulp.task("cdn_html", () => {
  return gulp
    .src(releasePath + "/*.{html,php}")
    .pipe(
      cdnStatic({
        host: {
          domain: "ssl.qhres.com",
          protocol: "https",
          max: 5,
          min: 1
        },
        relativePath: releasePath,
        exts: [".html", ".php"]
      })
    )
    .pipe(
      htmlmin({
        removeAttributeQuotes: false,
        collapseWhitespace: true,
        html5: true,
        removeComments: true,
        removeEmptyAttributes: true,
        minifyJS: true,
        minifyCSS: true
      })
    )
    .pipe(replace("@version@", pkg.version))
    .pipe(gulp.dest(releasePath));
});

gulp.task("del_static", () => {
  // return gulp.src(releasePath + "/static").pipe(clean());
  // .pipe(del.sync([releasePath + "/static"]))
  // del.sync([releasePath + "/static",releasePath + "/static/**"]);
});
//发布任务 ["cdn_img"],
gulp.task("deploy", () => {
  return runSequence("cdn_img", "cdn_html", "del_static", () => {
    console.log("资源静态化完成！");
  });
});
gulp.task("default", ["deploy"]);
