const ObjectUtil = {
  name: 'ObjectUtil',
  or() {
    const list = Object.values(arguments)
    // console.log('ObjectUtil.or', typeof list)
    if (ObjectUtil.isEmpty(list)) {
      return null
    }
    const noEmptys = list.filter(ObjectUtil.noEmpty)
    return noEmptys.length ? noEmptys[0] : list[list.length - 1]
  },
  isEmpty(o) {
    return ObjectUtil.isNull(o) || o.length === 0
  },
  noEmpty(o) {
    return !ObjectUtil.isEmpty(o)
  },
  copyNew(entity) {
    return { ...entity, id: null, createTime: null, updateTime: null }
  },
  isNull(o) {
    return o == null || typeof o === 'undefined' || o === 'undefined'
  },
  mergeObjects(...objects) {
    // 深度合并函数
    // 初始化结果对象
    const result = {}
    // 遍历所有输入对象
    for (const obj of objects) {
      console.log('deep merge', obj)
      // 深度合并到结果对象中
      ObjectUtil.deepMerge(result, obj)
    }
    return result
  },
  deepMerge(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
          // 如果属性是对象并且已存在于目标对象中，则递归深度合并
          ObjectUtil.deepMerge(target[key], source[key])
        } else {
          // 否则直接赋值
          target[key] = source[key]
        }
      }
    }
  },
  readProp(obj, propPath) {
    if (!propPath) {
      return null
    }
    // Split the property path into an array of individual property names
    const props = propPath.split('.')
    // Use Array.reduce to iterate over the properties and access the nested values
    return props.reduce((currentObj, currentProp) => {
      // Return undefined if the current property is not found
      if (currentObj && currentObj.hasOwnProperty(currentProp)) {
        return currentObj[currentProp]
      } else {
        return null
      }
    }, obj)
  },
  readContextPathObject(context, renameFun = (name) => {
    return name
  }) {
    const result = {}
    context.keys().forEach((file) => {
      const fileModule = context(file).default || context(file)
      const fileName = file.replace('./', '')
      result[renameFun(fileName)] = fileModule
    })
    return result
  },
  async loadComponents(componentContexts, nameAppendLength) {
    const objMap = {}
    // const promises = []
    for (const context of componentContexts) {
      const keys = context.keys()
      for (const name of keys) {
        // const component = {}
        // const component = await ObjectUtil.loadComponent(context, name);
        // const componentName = name.substring(0, name.length - nameAppendLength);
        objMap[name] = context(name)
        // promises.push(component);
      }
    }
    // await Promise.all(promises);
    return objMap
  },
  loadComponent(context, name) {
    return new Promise((resolve, reject) => {
      try {
        context(name, (component) => {
          if (component) {
            resolve(component.default || component)
          } else {
            // 如果组件未加载成功，您可以选择返回一个自定义错误值或抛出异常
            // 例如，您可以返回一个默认组件，或者返回一个占位符
            reject(new Error('Component not loaded'))
          }
        })
      } catch (error) {
        // 捕获异步加载组件过程中的异常
        reject(error)
      }
    })
  },
  deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true
    }
    if (typeof obj1 !== typeof obj2) {
      return false
    }
    if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
      return obj1 === obj2
    }
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false
      }
      for (let i = 0; i < obj1.length; i++) {
        if (!ObjectUtil.deepEqual(obj1[i], obj2[i])) {
          return false
        }
      }
      return true
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false
    }
    for (const key of Object.keys(obj1)) {
      if (!ObjectUtil.deepEqual(obj1[key], obj2[key])) {
        return false
      }
    }
    return true
  },
  recursivelyMergeObjects(...objects) {
    const baseTypes = ['Number', 'String', 'Boolean', 'Undefined', 'Null', 'Symbol', 'BigInt', 'Function', 'Array', 'Date']
    const mergedObject = {}

    // Set 用于跟踪已经合并过的对象
    const mergedSet = new Set()

    // 辅助函数，用于判断对象是否已经被合并过
    function hasBeenMerged(obj) {
      for (const merged of mergedSet) {
        if (obj === merged) {
          return true
        }
      }
      return false
    }

    for (const obj of objects) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const objValue = obj[key]
          if (baseTypes.includes(typeof objValue) || objValue === null) {
            // 基本类型或 null，直接赋值给 mergedObject
            mergedObject[key] = objValue
          } else if (!hasBeenMerged(objValue)) {
            // 如果属性值是一个对象，并且尚未被合并
            if (mergedObject.hasOwnProperty(key) && typeof mergedObject[key] === 'object' && !Array.isArray(mergedObject[key])) {
              // 如果 mergedObject 中已经有这个属性，并且是一个对象，递归合并
              mergedSet.add(objValue)
              mergedObject[key] = ObjectUtil.recursivelyMergeObjects(mergedObject[key], objValue)
            } else {
              // 否则，直接赋值
              mergedObject[key] = objValue
            }
          }
        }
      }
    }
    return mergedObject
  },
  /**
   * 异步加载模块
   * 例如: const context = require.context('./modules', true, /\.js$/)
   *      const modules = await loadModules(context)
   * @param context
   * @param prop
   * @returns {Promise<{}>}
   */
  async loadModules(context, prop = 'default') {
    const modules = {}
    const importPromises = context.keys().map(async(modulePath) => {
      const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
      const module = await context(modulePath)
      modules[moduleName] = module[prop]
    })
    await Promise.all(importPromises)
    return modules
  }
}
export default ObjectUtil
// export default new ObjectUtil()
