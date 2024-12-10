const util = {
  name: 'OtherUtil',
// methods: {
  /**
   * 动态加载组件
   */
  load: async function (componentPath) {
    // 若不可加载返回null, 若可加载,返回 () => import(`@/views${componentPath}`)
    return !componentPath ? null : Promise.resolve(require(`@/views${componentPath}`))
  },
  async loadEnsure(componentPath) {
    try {
      await Promise.resolve(require(`@/views${componentPath}`))
      return true
    } catch (e) {
      console.error(`${componentPath}组件加载异常.`, e)
      return false
    }
  },
  /**
   * 从父组件中获取属性
   * @param vueComponent  vue组件
   * @param propName      属姓名
   * @param nullDefault   取了5(maxIn)层父级还是没取到时返回的默认值
   * @param maxIn         尝试取几层父级(向上)
   * @returns {*}         取到的属性值
   */
  getProFromParent: function (vueComponent, propName, nullDefault, maxIn = 5) {
    // 往上寻找5层div
    let parent = vueComponent
    for (let i = 0; i <= maxIn; i++) {
      const prop = getProperty(parent, propName)
      if (prop !== null) {
        return prop
      }
      parent = parent.$parent
      if (!parent) {
        return nullDefault
      }
    }
    return nullDefault
  },
  /**
   * 从对象中获取属性
   * @param obj     目标对象
   * @param proName 支持直接取多级 例如:'user.address.city'
   */
  getProperty: function (obj, proName) {
    const prodNames = proName.split('.')
    let subObj = obj
    for (const prodName of prodNames) {
      if (!subObj) {
        return null
      }
      subObj = subObj[prodName]
    }
    return subObj
  },
  /**
   * 是否是落后的浏览器
   */
  isOldIE() {
    return this.IEVersion() !== -1
  },

  /**
   * @return {number} IE 版本
   */
  IEVersion: function () {
    const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      const fIEVersion = parseFloat(RegExp['$1'])
      if (fIEVersion === 7) {
        return 7
      } else if (fIEVersion === 8) {
        return 8
      } else if (fIEVersion === 9) {
        return 9
      } else if (fIEVersion === 10) {
        return 10
      } else {
        return 6// IE版本<=7
      }
    } else if (isIE11) {
      return 11 // IE11
    } else {
      return -1// 不是ie浏览器
    }
  }
  // }
}
/**
 * 其他 零散 工具类
 //  */
export default util
//
// export const load = util.methods.load
// export const loadEnsure = util.methods.loadEnsure
// export const getProperty = util.methods.getProperty
// export const getProFromParent = util.methods.getProFromParent
// export const IEVersion = util.methods.IEVersion
// export const isOldIE = util.methods.isOldIE

