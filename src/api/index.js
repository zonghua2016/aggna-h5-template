/*
 * @Author       : tongzonghua
 * @Date         : 2020-11-12 17:38:50
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 15:55:24
 * @Email        : tongzonghua@360.cn
 * @Description  : 汇聚 API(支持jsonp、native、axios 三种调用方式)
 * @FilePath     : /cli/aggna-h5-template/src/api/index.js
 */
import axios from "./axios";
import jsonp from "./jsonp";
import { jsCallNative } from "tools/utils";
const options = { param: "jcb", timeout: 5000 };
const BASEURL = process.env.VUE_APP_BASE_URL;
const H5BASEURL = process.env.VUE_APP_H5_BASE_URL

const callApiByNative = async url =>
  jsCallNative({
    method: "encodeCallUrlSync",
    url
  });

///////////////////////////////////////
// -------------- 军团 ----------------
///////////////////////////////////////

// native 调用
export const getUserDataFlushDate = async (accountId = '') =>
  await callApiByNative(`${BASEURL}/tank/userStat?accountId=${accountId}`);

// jsonp 调用
export const getLiveInfo = async (rid) =>
  await jsonp(`${BASEURL}/cms/getdyplay`, { rid }, { param: "callback", timeout: 5000 });

// axios get请求
export const getLegionData = async clanId => axios.get(`${BASEURL}/WotClan/clanInfo`, { clanId })

// axios post 请求
export const updateLegionRecruit = async (clanId, content, tags) => axios.post(`${BASEURL}/WotClan/editclandesc`, { clanId, content, tags });
