import areaTableUnit from './areaTableUnit.vue'
import areaSearch from './areaSearch.vue'
import areaTable from './areaTable.vue'
import areaForm from './areaForm.vue'
import areaFormDialog from './areaFormDialog.vue'
import baseField from './baseField.vue'
import './areaTableUnit.scss'

export default {
  install(vue, config = {}) {
    getUrlTemplate = config.getUrlTemplate || function(entityName) { return '/commonData/{option}/{entityName}' }
    tableConfigUnit = config.tableConfigUnit
    vue.component(areaTableUnit.name, areaTableUnit)
    vue.component(areaSearch.name, areaSearch)
    vue.component(areaTable.name, areaTable)
    vue.component(areaForm.name, areaForm)
    vue.component(areaFormDialog.name, areaFormDialog)
    vue.component(baseField.name, baseField)
  }
}
export let getUrlTemplate
export let tableConfigUnit
