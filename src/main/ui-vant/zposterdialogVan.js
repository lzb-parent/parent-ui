import ZPosterDialogVant from './zposterdialogVant.vue';
import HtmlUtil from "../js/utils/HtmlUtil";
// export let dialogInstance = null
// export function zposterdialogVantInstall(){
//   // 创建一个Vue实例并挂载到body中
//    dialogInstance = new Vue({
//     render: (h) => h(ZPosterDialogVant),
//   }).$mount();
//   document.body.appendChild(dialogInstance.$el);
// }
// HtmlUtil
//
// // import Vue from 'vue';
// // import MyComponent from './MyComponent.vue';
//
// // 创建一个构造函数，用于创建组件实例
// const MyComponentConstructor = Vue.extend(MyComponent);
//
// // 封装一个函数，用于全局调用组件
// const createMyComponent = (propsData) => {
//   // 创建组件实例
//   const instance = new MyComponentConstructor({
//     propsData,
//     el: document.createElement('div'),
//   });
//
//   // 将组件实例挂载到body上
//   document.body.appendChild(instance.$el);
//
//   // 返回组件实例，以便进行其他操作
//   return instance;
// };
export default {
    create(props, slots) {
        let vueInstance = HtmlUtil.createVueInstance(ZPosterDialogVant, props, 'div', slots);
        vueInstance.showInner = true;
        return vueInstance
    }
}
