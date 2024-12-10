export default {
  name: 'CollUtil',
  /**
     * 排序
     */
  sort(objList, propFun, desc = false) {
    return objList.sort((a, b) => desc ? (propFun(b) - propFun(a)) : (propFun(a) - propFun(b)))
  },
  sortFirst(objList, propFun, desc = false, defVal) {
    if (objList && objList.length) {
      return this.sort(objList, propFun, desc)[0]
    }
    return defVal
  },
  listToMap: function(list, keyPropName, valuePropName) {
    const map = {}
    if (list) {
      for (const obj of list) {
        map[obj[keyPropName]] = valuePropName ? obj[valuePropName] : obj
      }
    }
    return map
  },
  listToMapFun: function(list, keyPropFun, valuePropFun) {
    const map = {}
    if (list) {
      for (const obj of list) {
        map[keyPropFun(obj)] = valuePropFun ? valuePropFun(obj) : obj
      }
    }
    return map
  },
  listToListMap: function(list = [], propName, valFun = o => o) {
    const map = {}
    if (list) {
      for (const obj of list) {
        const prop = obj[propName] || ''
        let list = map[prop]
        if (!list) {
          list = []
          map[prop] = list
        }
        list.push(valFun(obj))
      }
    }
    return map
  },
  contains: function(list, o) {
    return list.indexOf(o) > -1
  },
  listToTree(list, codeFun = (o) => o.code, parentCodeFun = (o) => o.pcode, childrenProp = 'children', leafSelectCodes) {
    const map = {}
    list.forEach((item) => {
      map[codeFun(item)] = { ...item, [childrenProp]: [] }
    })

    const roots = []
    list.forEach((item) => {
      const parentCode = parentCodeFun(item)
      if (parentCode === '') {
        roots.push(map[codeFun(item)])
      } else {
        const parent = map[parentCode]
        if (parent) {
          parent[childrenProp].push(map[codeFun(item)])
        }
      }
    })
    return this.getSubTree(roots, leafSelectCodes, codeFun, childrenProp)
  },
  getSubTree(tree, leafSelectCodes, codeFun = (o) => o.code, childrenProp = 'children') {
    // console.log('leafSelectCodes',leafSelectCodes)
    if (!leafSelectCodes) {
      return tree
    }
    if (leafSelectCodes.length === 0) {
      return []
    }
    const selectedMap = new Set(leafSelectCodes)
    const result = []
    const This = this
    function traverse(node) {
      if (!node) return null

      // 如果当前节点在选中的叶子节点中
      if (selectedMap.has(codeFun(node))) {
        return { ...node, [childrenProp]: This.getSubTree(node[childrenProp], leafSelectCodes, codeFun, childrenProp) }
      }

      // 递归处理子节点
      const children = node[childrenProp] || []
      const selectedChildren = children.map(traverse).filter(Boolean)

      // 如果有选中的子节点，当前节点也应该包含在结果中

      if (selectedChildren.length > 0) {
        return { ...node, [childrenProp]: selectedChildren }
      }

      return null
    }

    tree.forEach(node => {
      const subtree = traverse(node)
      if (subtree) {
        result.push(subtree)
      }
    })

    return result
  },
  treeToList(tree, childrenProp = 'children') {
    const list = []

    function traverse(node, parentCode = '') {
      list.push({
        ...node
      })

      if (node[childrenProp]) {
        node[childrenProp].forEach(child => traverse(child, node.code))
      }
    }

    tree.forEach(node => traverse(node))

    return list
  },
  groupBy(array, propertyFun) {
    return array.reduce((acc, obj) => {
      const key = propertyFun(obj)
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {})
  },
  // // 多维数组排列组合
  // doExchange(arr) {
  //   const len = arr.length
  //   // 当数组大于等于2个的时候
  //   if (len >= 2) {
  //     // 第一个数组的长度
  //     const len1 = arr[0].length
  //     // 第二个数组的长度
  //     const len2 = arr[1].length
  //     // 2个数组产生的组合数
  //     const lenBoth = len1 * len2
  //     //  申明一个新数组
  //     const items = new Array(lenBoth)
  //     // 申明新数组的索引
  //     let index = 0
  //     for (let i = 0; i < len1; i++) {
  //       for (let j = 0; j < len2; j++) {
  //         if (arr[0][i] instanceof Array) {
  //           items[index] = arr[0][i].concat(arr[1][j])
  //         } else {
  //           items[index] = [arr[0][i]].concat(arr[1][j])
  //         }
  //         index++
  //       }
  //     }
  //     const newArr = new Array(len - 1)
  //     for (let i = 2; i < arr.length; i++) {
  //       newArr[i - 1] = arr[i]
  //     }
  //     newArr[0] = items
  //     return doExchange(newArr)
  //   } else {
  //     return arr[0]
  //   }
  // }
  buildTree(data = [], getId = o => o.code, getPid = o => o.pcode, setChildren = (list, children) => list.children = children) {
    const map = {}

    // 建立一个映射表
    data.forEach(item => {
      map[getId(item)] = item
    })

    const treeData = []

    // 构建树形结构
    data.forEach(item => {
      const parent = map[getPid(item)]
      if (parent) {
        const children = parent.children || []
        children.push(item)
        setChildren(parent, children)
      } else {
        treeData.push(item)
      }
    })
    return treeData
  }

}
