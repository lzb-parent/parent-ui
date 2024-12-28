<template>
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
    :format="valueFormat"
    :value-format="valueFormat"
    :disabled="disabled"
    v-bind="$props"
    :default-time="defaultTime"
    @change="handleChange"
    @clear="dateRange=[]"
    v-on="$listeners"
  />
</template>

<script>
import mixinDiv from '../../main/js/mixin/MixinDiv'

export default {
  name: 'Zdatepicker2',
  mixins: [mixinDiv],
  props: {
    start: {
      type: String,
      default: () => ''
    },
    end: {
      type: String,
      default: () => ''
    },
    pickerType: { type: String, default: 'daterange' },
    valueFormat: { type: String, default: 'yyyy-MM-dd' },
    defaultTime: { },
    startPlaceholderInput: { type: String, default: '' },
    endPlaceholderInput: { type: String, default: '' },
    align: { type: String, default: 'right' },
    separator: { type: String, default: '-' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      startPlaceholder: '',
      endPlaceholder: '',
      dateRange: [this.start || '', this.end || ''],
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
  created() {
    this.startPlaceholder = this.startPlaceholderInput || this.$t('开始日期');
    this.endPlaceholder = this.startPlaceholderInput || this.$t('结束日期');
  },
  watch: {
    start(newVal) {
      this.dateRange && this.$set(this.dateRange, 0, newVal)
    },
    end(newVal) {
      this.dateRange && this.$set(this.dateRange, 1, newVal)
    },
    dateRange(newVal) {
      this.$emit('update:start', newVal && newVal[0] || '')
      this.$emit('update:end', newVal && newVal[1] || '')
    }
  },
  methods: {
    handleChange() {
      this.$emit('change', this.dateRange)
    }
  }
}
</script>

<style scoped>
/* 你可以在这里添加样式 */
</style>
