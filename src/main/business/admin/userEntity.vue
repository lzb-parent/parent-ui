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
  name: 'UserEntity',
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
        // entityName: 'userEntity',
        tableConfigs: {
          base: {
            // adminButtons: ['query'],
            removeAdminButtons: this.params && this.params.userId ? [] : ['add'],
            removeFieldNames: this.params && this.params.userId ? ['userId', 'username'] : [],
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
    this.getTableConfigDb()
  },
  methods: {
    showForm(data) {
      this.formData = { ...data.entity, ...this.params }
      this.formDataOption = data.option
      this.dialogFormVisible = true
    },
  }
}
</script>
