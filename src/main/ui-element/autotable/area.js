import CollUtil from '../../../main/js/utils/CollUtil'
import ObjectUtil from '../../../main/js/utils/ObjectUtil'

export const Areas = {
  base: 'base', // 公共
  form: 'form', // 新增/修改表单
  table: 'table', // 表格头部
  search: 'search' // 搜索表单
}
export const Option = {
  getPage: 'getPage',
  view: 'view',
  insert: 'insert',
  update: 'update',
  delete: 'delete'
}
export default {
  name: 'BaseArea',
  props: {
    tableConfigUnit: {},
  },
  data() {
    return {
      Areas,
      area: null,
    }
  },
  computed: {
    tableConfig() {
      return this.tableConfigUnit && this.tableConfigUnit.tableConfigs && this.tableConfigUnit.tableConfigs[this.area]
    },
    fieldConfigMap() {
      if (this.tableConfigUnit) {
        const transformKey = key => key
        const transformValue = value => {
          return value[this.area]
        }
        const map = new Map(Object.entries(this.tableConfigUnit.fieldConfigsMap))
        const mapNew = new Map(Array.from(map, ([key, value]) => [transformKey(key), transformValue(value)]))
        return Object.fromEntries(mapNew)
      }
      return {}
    },
    adminButtons() {
      if (this.tableConfig) {
        let list = [...this.tableConfig.adminButtons]
        for (const button of (this.tableConfig.addAdminButtons || [])) {
          list.push(button)
        }
        for (const button of (this.tableConfig.removeAdminButtons || [])) {
          list = list.filter(f => f !== button)
        }
        return list
      }
      return []
    },
    fieldNames() {
      if (this.tableConfig) {
        let list = [...this.tableConfig.fieldNames]
        const addFieldNames = this.tableConfig.addFieldNames || []
        if (Array.isArray(addFieldNames)) {
          for (const fieldName of addFieldNames) {
            list.push(fieldName)
          }
        } else {
          for (const i of Object.keys(addFieldNames)) {
            list.splice(i, 0, addFieldNames[i])
          }
        }
        for (const fieldName of (this.tableConfig.removeFieldNames || [])) {
          list = list.filter(f => f !== fieldName)
        }
        return list
      }
      return []
    },
    fieldNamesGroupBy() {
      if (this.pageParams && this.pageParams.showTableColumnNoGroup) {
        return { '': this.fieldNames }
      }
      if (this.fieldNames.length) {
        const fields = this.fieldNames.map(fieldName => this.getFieldConfig(fieldName)).filter(f => !f.hide)
        return CollUtil.listToListMap(fields, 'group', field => field.fieldName)
      }
      return {}
    },
  },
  created() {
    this.innerValue = this.value
  },
  methods: {
    getFieldConfig(fieldName) {
      return this.fieldConfigMap[fieldName] || {}
    },
    getGroup(groupCode) {
      return this.tableConfig.groupMap && this.tableConfig.groupMap[groupCode] || {}
    },
    getAreaFieldConfigMap(area) {
      const transformKey = key => key
      const transformValue = value => {
        return value[area]
      }
      const map = new Map(Object.entries(this.tableConfigUnitInner.fieldConfigsMap))
      const mapNew = new Map(Array.from(map, ([key, value]) => [transformKey(key), transformValue(value)]))
      return Object.fromEntries(mapNew)
    },
    mergeBaseToOther(areas, parent) {
      const configBase = parent.base
      for (const area of areas) {
        if (area !== 'base') {
          const configOther = parent[area]
          // console.log('configBase',JSON.stringify(configBase))
          // console.log('configOther', JSON.stringify(configOther))
          parent[area] = ObjectUtil.recursivelyMergeObjects(configBase, configOther)
        }
      }
    }
  }
}
