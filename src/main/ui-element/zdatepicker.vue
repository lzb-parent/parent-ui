<template>
  <div>
    <el-date-picker
      v-model="dateRange"
      :type="pickerType"
      :size="computedSize"
      :align="align"
      unlink-panels
      clearable
      :range-separator="separator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :picker-options="pickerOptions"
      :value-format="valueFormat"
      :disabled="disabled"
      v-on="$listeners"
    />
  </div>
</template>
<script>
import mixinDiv from '../../main/js/mixin/MixinDiv'
const EMPTY_OUT_VALUE = [null, null]
const EMPTY_INNER_VALUE = []
export default {
  name: 'Zdatepicker',
  mixins: [mixinDiv],
  props: {
    value: { type: Array, default: () => [] },
    pickerType: { type: String, default: 'daterange' },
    valueFormat: { type: String, default: 'yyyy-MM-dd' },
    startPlaceholderInput: { type: String, default: '' },
    endPlaceholderInput: { type: String, default: '' },
    align: { type: String, default: 'right' },
    separator: { type: String, default: '-' },
    disabled: { type: Boolean, default: false }
  },
  data: function() {
    return {
      dateRange: this.value,
      startPlaceholder: '',
      endPlaceholder: '',
      pickerOptions: {
        shortcuts: [{
          text: this.$t('最近一周'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('最近一个月'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('最近三个月'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal && newVal.length === 2 && newVal[0] && newVal[1]) {
        } else {
          newVal = []
        }
        if (this.dateRange) {
          for (const key of Object.keys(newVal)) {
            if (!this.dateRange[key] && this.dateRange[key] !== newVal[key]) {
              this.$set(this.dateRange, key, newVal[key])
            }
          }
        } else {
          this.dateRange = newVal
        }
      },
      // immediate: true,
      deep: true
    },
    dateRange: {
      handler(newVal, oldVal) {
        if (!newVal) {
          newVal = []
        }
        const val = (EMPTY_INNER_VALUE === newVal || !newVal) ? EMPTY_OUT_VALUE : newVal
        this.$emit('input', val)
        this.$emit('change', val)
      },
      // immediate: true,
      deep: true
    }
  },
  created() {
    this.startPlaceholder = this.startPlaceholderInput || this.$t('开始日期');
    this.endPlaceholder = this.startPlaceholderInput || this.$t('结束日期');
  },
  methods: {
    // emitChange(val) {
    //   console.log('emitChange')
    //   this.dateRange = val
    //   this.$emit('input', val)
    //   this.$emit('change', val)
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-range-editor.el-input__inner {
  width: auto;
}
::v-deep {
  .el-range-input {
    width: 100px;
  }
}
</style>
_
