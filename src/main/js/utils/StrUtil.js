export default {
  name: 'StrUtil',
  // 若末尾匹配,去掉末尾
  subStringEnd(s, end) {
    let rs = s
    if (s.lastIndexOf(end) === s.length - end.length) {
      rs = s.substring(0, s.length - end.length)
    }
    return rs
  },
  /**
   * 用对象属性,替换长句中的变量单词
   */
  parseAndReplace(strWithRegix, obj) {
    if (!strWithRegix || !obj) {
      return strWithRegix
    }

    // 匹配表达式，但排除包含'data:image'的部分
    const regexPattern = /\{\{([^{}]+)\}\}(?![^<]*base64)/g
    const matches = strWithRegix.match(regexPattern)

    if (!matches) {
      return strWithRegix // 没有匹配的表达式，返回原始字符串
    }

    for (const match of matches) {
      const expression = match.slice(2, -2) // 去掉{{和}}，得到表达式
      const result = this.evalExpression(expression, obj)
      strWithRegix = strWithRegix.replace(match, result)
    }

    return strWithRegix
  },
  /**
   * 用对象属性,替换变量单词
   */
  evalExpression(expression, obj) {
    const keys = Object.keys(obj)
    const values = Object.values(obj)

    try {
      // 创建一个匿名函数，使得表达式中的变量可用
      const func = new Function(...keys, `return ${expression}`)
      return func(...values)
    } catch (error) {
      console.error(`Error evaluating expression "${expression}": ${error.message}`)
      return null
    }
  },
  /**
   * 首字母小写
   */
  lowerFirst(s) {
    return s && typeof s === 'string' ? s.charAt(0).toLowerCase() + s.slice(1) : s
  },
  /**
   * 首字母大写
   */
  upperFirst(s) {
    return s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s
  },
}
