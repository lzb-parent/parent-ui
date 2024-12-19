
import { Areas } from './area.js'
import ObjectUtil from '../../../main/js/utils/ObjectUtil'
import {getUrlTemplate, tableConfigUnit} from '../../../main/ui-element/autotable/index'
import MixinRouteView from '../../../main/js/mixin/MixinRouteView'

const commonProps = {
  show: null,
  hide: null,
  'isEdit': false
}
const tableConfigUnitDefault = {
  loaded: false,
  tableConfigs: {
    base: {
      showTableColumnNoGroup: true,
      ...commonProps,
      fieldNames: [],
      addFieldNames: [],
      removeFieldNames: [],
    },
    search: {},
    tableColumn: {
      fieldName: null,
      label: null,
      uiType: null
    },
    form: {
      labelWidth: '200px'
    },
    table: {
      page:{},
    }
  },
  fieldConfigsMap: {
    id: { // 拿id字段的配置举例
      base: {
        ...commonProps
      },
      search: {},
      tableColumn: {},
      form: {}
    }
  }
}

export default {
  name: 'areaTableUnit',
  mixins: [MixinRouteView],
  filters: {},
  props: {
    // moduleCode: String,
    // authRouteId: String,
    tableConfigUnitParams: {},
  },
  data() {
    return {
      tableConfigUnit: {},
      formData: {},
      areaList: Object.keys(Areas),
      tableConfigUnitInner: {},
      tableConfigDb: {},
      pageParams: {},
      dialogFormVisible: false,
    }
  },
  watch: {
  },
  created() {
    this.tableConfigUnit = {...this.tableConfigUnit,...this.tableConfigUnitParams}
  },
  activated() {
    this.reloadEntitys()
  },
  methods: {
    getPage(obj = {}) {
      this.$nextTick(() => {
        this.$refs.table.getPage(obj)
      })
    },
    async getTableConfigDb() {
      if (!this.tableConfigUnit.entityName) {
        return
      }
      this.tableConfigUnitInner.loaded = false
      const urlTemplate = getUrlTemplate(this.tableConfigUnit.entityName)
      this.tableConfigDb = await $$get(`/commonTable/info/${this.tableConfigUnit.entityName}`, { urlTemplate })
      if (this.tableConfigDb) {
        await this.reloadConfig()
        this.tableConfigUnitInner.loaded = true
      }
    },
    async reloadConfig() {
      // 合并 后端配置 前端公共配置 前端定制配置
      const tableConfigUnitInner = ObjectUtil.recursivelyMergeObjects(
        this.tableConfigDb, // 后端配置
        tableConfigUnitDefault, // 前端公共配置
        tableConfigUnit,        // 前端定制全局配置
        this.tableConfigUnit,   // 前端定制单页面配置
      )
      // console.log('reloadConfig combine', tableConfigUnitInner)

      // 合并 base区域 到 其他区域
      this.mergeBaseToOther(this.areaList, tableConfigUnitInner.tableConfigs)
      for (const fieldConfigs of Object.values(tableConfigUnitInner.fieldConfigsMap)) {
        this.mergeBaseToOther(this.areaList, fieldConfigs)
      }
      this.tableConfigUnitInner = tableConfigUnitInner

      // console.log('reloadConfig after', JSON.stringify(tableConfigUnitInner))

      // 查询枚举
      await this.reloadEntitys()
      // this.tableConfigUnitInner.loaded = true
      if (this.moduleCode) {
        const entityName = this.tableConfigUnitInner.entityName
        const tableConfigs = Object.values(this.tableConfigUnitInner.tableConfigs)
        // const module = (tableConfigs.find(c => c.module) || {}).module
        const label = (tableConfigs.find(c => c.label) || {}).label
        const entityId = (tableConfigs.find(c => c.entityId) || {}).entityId
        const sql =
  `delete from auth_route where id in (${entityId}01,${entityId}02,${entityId}03,${entityId}04);
  INSERT INTO auth_route (id, parent_id, type, name, url, regular, perms, icon, component_path, view_path, ext, sort, enabled) VALUES
  (${entityId}01, ${this.authRouteId}, 2, '${label}', '/${this.moduleCode}/${entityName}', '', 'selectPage:${entityName};selectList:${entityName};selectOne:${entityName}', '', '', '', '', 1, 1),
  (${entityId}02, ${this.authRouteId}, 3, '${label}新增', '', '', 'insert:${entityName}', '', '', '', '', 10, 1),
  (${entityId}03, ${this.authRouteId}, 3, '${label}更新', '', '', 'update:${entityName}', '', '', '', '', 10, 1),
  (${entityId}04, ${this.authRouteId}, 4, '${label}删除', '', '', 'delete:${entityName}', '', '', '', '', 10, 1)
  ;`
        console.log('reloadConfig sql\n\n', sql)
        console.log('\n\n')
      }
      // console.log('afterLoad', this.tableConfigUnitInner)

      this.$emit('afterLoad', this.tableConfigUnitInner)
    },
    // 从
    // {
    //  name:{
    //    form:{propType:'text',isEdit:true},
    //    table:{propType:'text',isEdit:false},
    //  },
    //  age:{
    //    form:{propType:'number'}...
    //  },
    // }
    // 读取出
    // {
    //   name:{propType:'text',isEdit:true},
    //   age:{propType:'number'}...
    // },
    async reloadEntitys() {
      // 查询枚举
      if (this.$store) {
        const fieldAll = Object.values(this.tableConfigUnitInner.fieldConfigsMap).flatMap(obj => Object.values(obj))

        const entityNames = [...new Set(fieldAll.map(f => f.entityName).filter(o => o))]
        const dataEntitys = entityNames
        dataEntitys.length && await this.$store.dispatch('loadDataMapEntity', dataEntitys)

        const javaTypeEnumClassNames = [...new Set(fieldAll.map(f => f.javaTypeEnumClassName).filter(o => o))]
        const dataEnums = javaTypeEnumClassNames
        dataEnums.length && await this.$store.dispatch('loadDataMapEnum', dataEnums)
      }
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
