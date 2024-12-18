<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <!--搜索-->
    <areaSearch
      :table-config-unit="tableConfigUnitInner"
      :page-params.sync="pageParams"
      @getPage="getPage"
      @showForm="showForm"
    />
    <!--表格-->
    <areaTable
      ref="table"
      :table-config-unit="tableConfigUnitInner"
      :page-params="pageParams"
      @showForm="showForm"
    />
    <!--编辑弹窗-->
    <areaFormDialog
      v-model="dialogFormVisible"
      :table-config-unit="tableConfigUnitInner"
      :form-data="formData"
      :form-data-option="formDataOption"
      @saveSuccess="getPage();dialogFormVisible=false"
    />
  </div>
</template>
<script>
import areaTableUnitExtend from '../../../main/ui-element/autotable/areaTableUnitExtend.js'

/**
 * 用户表格组件
 */
export default {
  name: 'ConfigEntity',
  extends: areaTableUnitExtend,
  props: {
    params: {},
  },
  data() {
    return {
      formData: {},
      formDataOption: null,
      pageParams: {},
      dialogFormVisible: false,
      tableConfigUnit: {
        // entityName: 'configEntity',
        tableConfigs: {
          base: {
            adminButtons: ['query', 'add', 'edit', 'copy', 'delete'],
            // removeAdminButtons: this.params && this.params.userId ? [] : ['add'],
            // removeFieldNames: this.params && this.params.userId ? ['userId', 'username'] : [],
          },
        },
      }
    }
  },
  watch: {},
  created() {
    this.pageParams = { ...this.pageParams, ...this.params }
    this.formData = { ...this.formData, ...this.params }
    const This = this
    if (this.tableConfigUnit.entityName) {
      this.getTableConfigDb()
    }
  },
  methods: {
    showForm(data) {
      this.formData = { ...data.entity, ...this.params }
      this.formDataOption = data.option
      this.dialogFormVisible = true
    },
    async getTableConfigDbShowAdmin(entityName) {
      // this.tableConfigUnit = {
      //   entityName: entityName,
      //   tableConfigs: {
      //     base: {
      //       removeAdminButtons: this.isDeveloper ? [] : ['add'],
      //       removeFieldNames: this.isDeveloper ? [] : ['showAdmin'],
      //     },
      //   },
      // }
      this.tableConfigUnit.entityName = entityName || this.tableConfigUnit.entityName
      this.tableConfigUnit.tableConfigs.base = this.tableConfigUnit.tableConfigs.base || {}
      this.tableConfigUnit.tableConfigs.table = this.tableConfigUnit.tableConfigs.table || {}
      this.tableConfigUnit.tableConfigs.base.removeAdminButtons = this.tableConfigUnit.tableConfigs.base.removeAdminButtons || []
      this.tableConfigUnit.tableConfigs.base.removeFieldNames = this.tableConfigUnit.tableConfigs.base.removeFieldNames || []
      this.tableConfigUnit.tableConfigs.table.removeFieldNames = this.tableConfigUnit.tableConfigs.table.removeFieldNames || []
      if (!this.isDeveloper) {
        this.tableConfigUnit.tableConfigs.base.removeAdminButtons.push('add')
        this.tableConfigUnit.tableConfigs.base.removeFieldNames.push('showAdmin')
        this.tableConfigUnit.tableConfigs.table.removeFieldNames.push('showAdmin')
      }
      this.pageParams.showAdmin = this.isDeveloper ? null : true
      await this.getTableConfigDb()
    }
  }
}
</script>
