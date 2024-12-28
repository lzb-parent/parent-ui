<script>
import areaTableUnit from "../../../main/ui-element/autotable/areaTableUnit.vue";

/**
 * 用户表格组件
 */
export default {
  name: 'UserEntity',
  extends: areaTableUnit,
  data() {
    return {
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
    this.getTableConfigDb()
  },
  methods: {
  }
}
</script>
