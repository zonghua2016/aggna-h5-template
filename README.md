<!--
 * @Author       : tongzonghua
 * @Date         : 2020-12-04 14:05:02
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 15:47:50
 * @Email        : tongzonghua@360.cn
 * @Description  : README
 * @FilePath     : /cli/aggna-h5-template/README.md
-->

# aggna-h5-template

> aggna H5 模板
> 公司内部使用，其他网友使用的话，打包的时候不要运行 gulp.js 即可

## git分支管理

* 不允许直接在 master/beta 分支上开发，直接修改 master/beta 代码
* 每个人在自己的分支上开发，例如: tzh 对应的开发分支为 dev_tzh

  

``` js
  git checkout beta
  git pull origin beta
  git checkout -b dev_tzh
```

* 将开发分支 dev_tzh 和 beta 关联

  + `git branch --set-upstream-to=origin/beta`

* 每次修改代码时，或者提交代码时习惯性地将 beta 分支上的代码同步过来

  + `git pull --rebase origin beta`

* 提交代码

    

``` js
    git push origin dev_tzh
    git push origin dev_tzh --force
```

* 在 `GitLab 上创建 merge request`, 找人review代码，没有问题之后在上面直接 merge(保证代码可以自动合并)

* 然后再回到自己的本地代码(更新最新的代码)

   - `git pull --rebase origin beta`

_

## 打包

* 正式环境
    - `npm run build`
* 测试环境
    - `npm run test`

## 测试地址

http://www.xxx.com

## 线上地址

http://www.xxx.com/

#### 备注

``` 

1.静态图片上传静床。
2.js和css资源可使用插件上传静床
```
