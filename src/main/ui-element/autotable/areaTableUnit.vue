<template>
  <div v-if="tableConfigUnitInner.loaded" class="pa-4">
    <areaSearch
        :table-config-unit="tableConfigUnitInner"
        :page-params.sync="pageParams"
        @getPage="getPage"
        @showForm="showForm"
    />
    <areaTable
        ref="table"
        :table-config-unit="tableConfigUnitInner"
        :page-params="pageParams"
        @showForm="showForm"
    />
    <areaFormDialog
        v-model="dialogFormVisible"
        :table-config-unit="tableConfigUnitInner"
        :form-data="formData"
        :formDataOption="formDataOption"
        @saveSuccess="getPage();dialogFormVisible=false"
    />
  </div>
</template>

<script>
import areaTableUnitExtend from '@/parent-ui/src/main/ui-element/autotable/areaTableUnitExtend.js'

export default {
  name: 'areaTableUnit',
  filters: {},
  extends: areaTableUnitExtend,
  props: {
  },
  data() {
    return {
      formData: {},
      formDataOption: null,
      tableConfigUnitInner: {},
      pageParams: {},
      dialogFormVisible: false,
    }
  },
  watch: {},
  created() {
    if (this.tableConfigUnit.entityName) {
      this.getTableConfigDb()
    }
  },
  methods: {
    showForm(data) {
      this.formData = {...data.entity,...this.params}
      this.formDataOption = data.option
      this.dialogFormVisible = true
    },
  }
}
</script>
