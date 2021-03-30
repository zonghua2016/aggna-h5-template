<!--
 * @Author       : tongzonghua
 * @Date         : 2020-11-12 19:54:24
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2021-03-30 16:06:02
 * @Email        : tongzonghua@360.cn
 * @Description  : 入口文件
 * @FilePath     : /cli/aggna-h5-template/src/App.vue
-->
<template>
  <div id="app">
    <v-touch v-on:swiperight="onSwipeRight" tag="div" v-if="isInAndroid">
      <router-view />
    </v-touch>
    <div v-if="!isInAndroid">
      <router-view />
    </div>
  </div>
</template>

<script>
import { jsCallNative, openInWebview, judgeClientType } from "tools/utils";
export default {
  name: "App",
  data() {
    return {
      isInAndroid: false,
      isOpenInWebview: true
    };
  },
  computed: {
  },
  methods: {
    onSwipeRight() {
      console.info("左右滑动了");
      if (this.isOpenInWebview) {
        jsCallNative({
          method: "finishWeb"
        });
      }
    }
  },
  beforeCreate() {
    // 是否在Android中打开
    
  },
  created() {
    this.isInAndroid = judgeClientType() === "Android";
    console.info(judgeClientType(),this.isInAndroid)
  },
  mounted() {
    window.callWebViewFunction = data => {
      if (data.biz == "clickShare") {
        // this.chgClickShare(true);
      }
    };

    setupWKWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler("callWebViewFunction", function(
        dataJsonString,
        responseCallback
      ) {
        window.callWebViewFunction(dataJsonString);
      });
    });

    function setupWKWebViewJavascriptBridge(callback) {
      if (window.WKWebViewJavascriptBridge) {
        return callback(window.WKWebViewJavascriptBridge);
      }
      if (window.WKWVJBCallbacks) {
        return window.WKWVJBCallbacks.push(callback);
      }
      window.WKWVJBCallbacks = [callback];
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.iOS_Native_InjectJavascript
      ) {
        window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(
          null
        );
      }
    }
  }
};
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.24rem;
  max-width: 800px;
  margin: 0 auto;
  touch-action: pan-y !important;
  v-touch {
    touch-action: pan-y !important;
  }
}
* {
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y !important;
}
</style>
