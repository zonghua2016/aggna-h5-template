/*
 * @Author: KevinZhou
 * @Date: 2020-08-17 10:33:09
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2020-12-22 11:32:20
 * @FilePath     : /workspace/tank_box_h5/src/components/Toast/index.js
 * @Description: 
 */
/*
    自定义 toast 组件
    调用: this.$toast('hello world~', {duration: 1500})
*/
let _TOAST = {
  show: false, // Boolean toast显示状态
  component: null // Object toast组件
};
export default {
  install(Vue) {
    /*
      text: String*
      opts: Object {}
  */
    Vue.prototype.$toast = function(text, opts) {
      let defaultOpts = {
        position: "center", // String
        duration: 2000, // Number
        wordWrap: false // Boolean
        // width: '90%'     // String/Number
      };
      opts = Object.assign(defaultOpts, opts);
      let wordWrap = opts.wordWrap ? "zh-word-wrap" : "",
        style = opts.width ? `style="width: ${opts.width}"` : "";
      if (_TOAST.show) {
        return;
      }
      if (!_TOAST.component) {
        let ToastComponent = Vue.extend({
          data: function() {
            return {
              show: _TOAST.show,
              text: text,
              position: `zh-toast-${opts.position}`,
              type: `zh-toast-${opts.type}`,
            };
          },
          template: `<div v-show="show" :class="[position,type]" class="zh-toast ${wordWrap}" ${style}>{{text}}</div>`
        });
        _TOAST.component = new ToastComponent();
        let element = _TOAST.component.$mount().$el;
        document.body.appendChild(element);
      }
      _TOAST.component.position = `zh-toast-${opts.position}`;
      _TOAST.component.text = text;
      _TOAST.component.show = _TOAST.show = true;
      _TOAST.component.type = `zh-toast-${opts.type}`;
      setTimeout(function() {
        _TOAST.component.show = _TOAST.show = false;
      }, opts.duration);
    };
  }
};
