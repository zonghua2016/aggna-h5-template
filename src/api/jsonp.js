/*
 * @Author       : tongzonghua
 * @Date         : 2020-07-03 14:37:26
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 15:56:00
 * @Email        : tongzonghua@360.cn
 * @Description  : jsonp 封装
 * @FilePath     : /cli/aggna-h5-template/src/api/jsonp.js
 */
import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    })
  })
}

function param(data) {
  let url = '';
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}
