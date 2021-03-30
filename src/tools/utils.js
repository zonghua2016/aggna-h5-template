/*
 * @Author       : tongzonghua
 * @Date         : 2020-11-12 10:23:37
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 16:12:10
 * @Email        : tongzonghua@360.cn
 * @Description  : 工具类
 * @FilePath     : /cli/aggna-h5-template/src/tools/utils.js
 */
// 持两位小数的数据 减法精度运算   传空值则默认为0
function delFloat2(data1, data2) {
  if (!data1) { data1 = 0; }
  if (!data2) { data2 = 0; }
  let r1 = data1.toString().split(".");
  let r2 = data2.toString().split(".");
  function trans(arr) {
    let new_arr = "";
    if (arr.length == 2) {
      if (arr[1].length == 0) {
        return parseInt(arr.join("") + "00");
      }
      if (arr[1].length == 1) {
        return parseInt(arr.join("") + "0");
      }
      if (arr[1].length >= 2) {
        arr[1] = arr[1].slice(0, 2);
        return parseInt(arr.join(""));
      }
    } else {
      return parseInt(arr.join("") + "00");
    }
  }
  return ((trans(r1) - trans(r2)) / 100);
}
// 替换图片尺寸  参数（原始路径，宽度，高度，质量）
function replaceUrlsize(imgUrl, w, h, q) {
  let reg = /(\w+:\/\/[^/:]+)([^# ]*)/,
    arr = imgUrl.match(reg);
  return `${arr[1]}/dr/${w}_${h}_${q}${arr[2]}`;
}
/**
 *公共方法：判断当前页面是否在webvie中打开
*/
function openInWebview(url = '') {
  if (url.indexOf('in_app=true') > -1) {
    return true;
  }
  return false;
}

/**
 * js 调用 客户端方法
 * @param {String} method 客户端提供的方法名
 * @param {Object} params 请求参数
 */
const jsCallNative = params => {
  const { method: biz, url } = params,
    data = getFuncData(params),
    nativeParams = {
      biz,
      data
    },
    clientType = judgeClientType();

  if (clientType === "Android") {
    // Android 调用 JS 方法
    return new Promise((resolve, reject) => {
      resolve(window.wargame.callClientFunction(JSON.stringify(nativeParams)))
    });
  } else if (clientType === "IOS") {
    return handleJSToIOS(nativeParams);
  }
};

/**
 * 格式化时间戳
 * @param {String} timeStamp 时间戳
 * @param {RegExp} fmt 日期正则
 */
const formatDate = (timeStamp, fmt = "YYYY-MM-dd HH:mm:ss") => {
  const date = new Date(timeStamp),
    dataReg = {
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "H+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };
  if (/(Y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in dataReg) {
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? dataReg[k]
          : ("00" + dataReg[k]).substr(("" + dataReg[k]).length)
      );
  }
  return fmt;
};

/**
 * 补零位
 * @param {Number} num
 * @param {Number}} digit 位数
 * @param {Number|String} prefix 补位字符
 */
const padZeroes = (num, digit = 2, prefix = 0) => {
  if (isNaN(Number(num))) throw new Error(`${num} is not a number`);
  return String(num).padStart(digit, prefix);
};

/**
 * 基础方法:
 *  JS 调用 IOS 方法
 * @param {Object} data 请求参数
 */
function handleJSToIOS(data) {
  return new Promise((resolve, reject) => {
    setupWKWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler("callClientFunction", data, function (response) {
        resolve(response);
      });
    });
  });
}

/**
 * 基础方法:
 * 连接 IOS bridge
 * @param {Function} callback 请求回调函数
 */
function setupWKWebViewJavascriptBridge(callback) {
  if (window.WKWebViewJavascriptBridge) {
    return callback(window.WKWebViewJavascriptBridge);
  }
  if (window.WKWVJBCallbacks) {
    return window.WKWVJBCallbacks.push(callback);
  }
  window.WKWVJBCallbacks = [callback];
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.iOS_Native_InjectJavascript) {
    window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
  }
}

/**
 * 判断客户端
 */
function judgeClientType() {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //判断是否是 android终端
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //判断是否是 iOS终端
  if (isAndroid) {
    return "Android";
  } else if (isIOS) {
    return "IOS";
  } else {
    return "PC";
  }
}
/**
 * 根据 url 解析出 调用客户端方法需要的参数
 * @param {String} url
 */
function getFuncParams(url) {
  // const params = new URL(`${DEVURL}${url}`),
  const params = new URL(url),
    { origin, pathname, search } = params,
    urlParam = search.substr(1),
    baseUrl = origin + pathname;
  return {
    baseUrl,
    urlParam
  };
}

/**
 * 根据传入参数解析 APP 需要的 data 参数
 * @param {Object} param 请求整体参数
 */
function getFuncData({
  method,
  title,
  url,
  downUrl,
  key3d,
  log,
  jump_type,
  jump_data,
  type,
  imageUrl,
  desc,
  iconUrl,
  bmpKey,
  bitmap,
  startColor,
  endColor,
  isShow,
  liveUid,
  setOrgentation,
  right_icon,
  show_back_icon,
  icon_is_white,
  hide_title_bar,
  status_bar_color,
  bg_color
}) {
  let data = {};
  switch (method) {
    case "showTitle":
      data = { title };
      break;
    case "encodeCallUrl": // 异步调用，扩展性差
    case "encodeCallUrlSync": {
      // 同步调用，可能会卡 APP UI，但在 H5 里卡个屁的 APP UI 啊~~，遇到卡的时候再想办法吧 ^_^ 估计是遇不到了 艹
      const { baseUrl, urlParam } = getFuncParams(url);

      data = {
        baseUrl,
        urlParam
      };
      break;
    }
    case "openH5Url":
      data = { url };
      break;
    case "downloadFile":
      data = { downUrl };
      break;
    case "getLocal3DFileDir":
      data = {};
      break;
    case "check3DFile":
      data = { "3dKey": key3d };
      break;
    case "download3DFile":
      data = { "3dKey": key3d, downUrl };
      break;
    case "get3DFileUrl":
      data = { "3dKey": key3d };
      break;
    case "openNewH5Url":
      data = { url };
      break;
    case "showH5Log":
      data = { log };
      break;
    case "getNetStatus":
      data = {};
      break;
    case "showNetErrorUi":
      data = {};
      break;
    case "jumpToUi":
      data = { jump_type, jump_data };
      break;
    case "showSubTitle":
      data = { title };
      break;
    case "jumpToShare":
      data = { type, imageUrl, title, desc, iconUrl, url, bmpKey, bitmap };
      break;
    case "jumpToRankFilter":
      data = { startColor, endColor };
      break;
    case "shareBtnIsShow":
      data = { isShow };
      break;
    case "getLiveRoomInfo":
      data = { liveUid };
      break;
    case "getLiveRoomList":
      data = {};
      break;
    case "setRequestedOrientation":
      data = { set: setOrgentation };
      break;
    case "getCurUserPlat":
      data = {};
      break;
    case "jumpToLogin":
      data = {};
      break;
    case "getCurVersion":
      data = {};
      break;
    case "titleBarStyleMotify":
      data = {
        right_icon,
        show_back_icon,
        icon_is_white,
        hide_title_bar,
        status_bar_color,
        bg_color
      };
      break;
    default:
      break;
  }
  return data;
}

const brands = {
  "IPHONE": "IPHONE|IPAD|IPOD|IOS",
  "OPPO": "OPPO|PACM00",
  "VIVO": "VIVO|V1962A",
  "HONOR": "HONOR",
  "HUAWEI": "HUAWEI",
  "XIAOMI": "XIAOMI|REDMI|MI|MIX|HM",
  "360": "1801-A01|1707-A01|1509-A00",
  "SAMSUNG": "SAMSUNG|GT-|SM-|SCH-"
},
  hasOwnProp = Object.prototype.hasOwnProperty,
  userAgent = window.navigator.userAgent.toUpperCase();
/**
 * 获取设备品牌
 */
function getBrand() {
  const result = [];
  for (const key in brands) {
    if (hasOwnProp.call(brands, key)) {
      if (new RegExp(brands[key]).test(userAgent)) {
        result.push(key);
      }
    }
  }
  return result[0];
}

/**
 * 获取终端类型并跳转对应应用市场
 */
async function getBrandDownloadUrl(downloadUrl = '') {
  const brand = getBrand(),
    appId = 'com.qihoo.wg.wotbox.an';

  // 华为/小米/oppo/vivo/360手机助手
  switch (brand) {
    case "HONOR":
      window.location.href = `intent://details?id=${appId}#Intent;package=com.huawei.appmarket;scheme=market;end;`;
      break;
    case "HUAWEI":
      window.location.href = `appmarket://details?id=${appId}`;
      break;
    case "OPPO":
      window.location.href = `market://details?id=${appId}`;
      break;
    case "XIAOMI":
      // 小米：M2001J2C 默认浏览器不能通过schema打开APP，只能通过应用市场打开
      window.location.href = `mimarket://details?id=${appId}`;
      break;
    case "VIVO":
      window.location.href = `intent://details?id=${appId}#Intent;package=com.bbk.appstore;scheme=market;end;`
      break;
    case "360":
      window.location.href = `intent://details?id=${appId}#Intent;package=com.qihoo.appstore;scheme=market;end;`;
      break;
    case "SAMSUNG":
      window.location.href = `samsungapps://ProductDetails/${appId}`;
      break;
    default:
      window.location.href = downloadUrl;
      break;
  }
}

/**
 * H5在微信中分享操作
 * @param {Object} shareConfig 分享参数
 */
async function getWxConfigData(shareConfig = { title: '坦克营地', desc: '坦克营地', link: 'https://camp.wot.360.cn', cover: 'https://p5.ssl.qhimg.com/t017dedd6063959bf11.png' }, wxconfig) {
  const { appId, nonceStr, signature, timestamp } = wxconfig,
    { title, link, cover: imgUrl, desc } = shareConfig;

  wx.config({
    debug: false, 							// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId, 							// 必填，公众号的唯一标识
    timestamp, 					// 必填，生成签名的时间戳
    nonceStr, 						// 必填，生成签名的随机串
    signature,					// 必填，签名
    jsApiList: [									// 必填，需要使用的JS接口列表
      'checkJsApi',
      'onMenuShareTimeline',						//分享到微信朋友圈
      'onMenuShareAppMessage',					//分享给微信朋友
      'onMenuShareQQ',							//分享到QQ
      'onMenuShareWeibo',							//分享到微博
      'onMenuShareQZone',							//分享到QQ空间
    ]
  });
  wx.ready(() => {
    wx.onMenuShareTimeline({
      title, 							// 分享标题
      link, 	// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl, 							// 分享图标
      success: function () { },
      cancel: function () { }
    });
    wx.onMenuShareAppMessage({
      title, 							// 分享标题
      desc, 							// 分享描述
      link, 	// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl, 							// 分享图标
      type: 'link', 								// 分享类型,[music、video或link，不填默认为link]
      success: function () { },
      cancel: function () { }
    });
    wx.onMenuShareQQ({
      title, 							// 分享标题
      desc, 							// 分享描述
      link, 			// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl, 							// 分享图标
      success: function () { }						// 设置成功回调
    });
    wx.onMenuShareWeibo({
      title, 							// 分享标题
      desc, 							// 分享描述
      link, 			// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl, 							// 分享图标
      success: function () { }						// 设置成功回调
    });
    wx.onMenuShareQZone({
      title, 							// 分享标题
      desc, 							// 分享描述
      link, 			// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl, 							// 分享图标
      success: function () { }						// 设置成功回调
    });
  });
}

/**
 * 转换数字为对应文案
 * @param {数字} num
 */
const num2txt = (num, txt) => {
  if (!num) {
    return txt;
  }
  num = parseInt(num);
  if (num == 0) {
    return txt;
  } else if (num <= 9999) {
    return num;
  } else {
    let n = saveFloat2((num / 10e3));
    return `${n}万+`;
  }
}
function changeTwoDecimal(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return false;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf(".");
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += ".";
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += "0";
  }
  return s_x;
}

/**
 * @description: 返回保留对应位数的小数
 * @param num {Number} 原始数据
 * @param pos {Number} 保留小数位数
 */
var fomatFloat = (num, pos = 2) => {
  return Math.floor(num * Math.pow(10, pos)) / Math.pow(10, pos);
};

module.exports = {
  replaceUrlsize,
  delFloat2,
  jsCallNative,
  formatDate,
  padZeroes,
  judgeClientType,
  openInWebview,
  getBrand,
  getBrandDownloadUrl,
  getWxConfigData,
  num2txt,
  fomatFloat,
  changeTwoDecimal
};
