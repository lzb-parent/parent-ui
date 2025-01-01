<script>
import areaTableUnit from "../../../main/ui-element/autotable/areaTableUnit.vue";

/**
 * 用户表格组件
 */
export default {
  name: 'ConfigEntity',
  extends: areaTableUnit,
  data() {
    return {

      tableConfigUnit: {
        // entityName: 'configEntity',
        tableConfigs: {
          base: {
            adminButtons: ['query', 'add', 'edit', 'copy', 'delete', 'export'],
            // removeAdminButtons: this.params && this.params.userId ? [] : ['add'],
            // removeFieldNames: this.params && this.params.userId ? ['userId', 'username'] : [],
          },
        },
      }
    }
  },
  watch: {},
  created() {
  },
  methods: {
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
