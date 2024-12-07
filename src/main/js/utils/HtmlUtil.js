let i18n
export default {
  name: 'HtmlUtil',
  install(i18nInstant) {
    i18n = i18nInstant
  },
  createVueInstance(component, propsData, elTag = 'div') {
    const ComponentConstructor = Vue.extend(component);
    const instance = new ComponentConstructor({
      propsData,
      i18n,
      el: document.createElement(elTag),
    });
    // debugger
    document.body.appendChild(instance.$el);
    return instance;
  },
  convertStringSlotsToObject(slots) {
    const actualSlots = {};
    for (const slotName in slots) {
      if (typeof slots[slotName] === 'string') {
        // console.log('convertStringSlotsToObject',h)
        actualSlots[slotName] = (h) => h('div', { domProps: { innerHTML: slots[slotName] } });
      } else {
        actualSlots[slotName] = slots[slotName];
      }
    }
    return actualSlots;
  },
  callAllVueMethod(selector, methodName, ...params) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const vueInstance = element.__vue__;
      if (vueInstance && typeof vueInstance[methodName] === 'function') {
        vueInstance[methodName](...params);
      }
    });
  },
  /**
   * css字符串转对象
   * @param styleString
   * @returns {{}}
   */
  parseStyleString(styleString) {
    const styleObj = {};

    // 分割字符串成数组，每个元素是一个样式声明
    const declarations = styleString.split(';');

    // 遍历样式声明数组，解析成对象的键值对
    for (const declaration of declarations) {
      if (declaration.trim() !== '') {
        const [property, value] = declaration.split(':');
        if (property && value) {
          // 将连字符形式的属性转换为驼峰格式
          const camelCaseProperty = property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
          // 移除多余的空格并将样式添加到对象中
          styleObj[camelCaseProperty] = value.trim();
        }
      }
    }

    return styleObj;
  }
}
