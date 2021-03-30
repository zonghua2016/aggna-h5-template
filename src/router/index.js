/*
 * @Author       : tongzonghua
 * @Date         : 2020-11-12 10:23:37
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 15:51:26
 * @Email        : tongzonghua@360.cn
 * @Description  : 路由
 * @FilePath     : /cli/aggna-h5-template/src/router/index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
