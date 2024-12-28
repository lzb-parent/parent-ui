<template>
  <span v-if="!computedIsEdit(true)" v-on="$listeners">{{ returnValue }}</span>
  <el-date-picker
    v-else-if="type==='date'||type==='datetime'"
    v-model="returnValue"
    :placeholder="placeholder || this.$t('选择日期')"
    :style="getStyle"
    :size="computedSize"
    :disabled="disabled"
    :clearable="clearable"
    :default-value="defaultValue"
    :type="type"
    :value-format="type==='datetime'?'yyyy-MM-dd HH:mm:ss':null"
    :format="type==='datetime'?'yyyy-MM-dd HH:mm:ss':null"
    :default-time="defaultTime"
    :title="placeholder"
    @change="change"
    v-on="$listeners"
  />
  <el-time-select
    v-else-if="type==='time'"
    v-model="returnValue"
    :picker-options="{
      start: start,
      step: step,
      end: end
    }"
    :placeholder="placeholder || this.$t('选择时间')"
    :style="getStyle"
    :size="computedSize"
    :disabled="disabled"
    :clearable="clearable"
    :default-value="defaultValue"
    :type="'time'"
    :default-time="defaultTime"
    :value-format="'HH:mm:ss'"
    :format="'HH:mm:ss'"
    @change="change"
    v-on="$listeners"
  />
</template>
<script>
import mixinDiv from '../../main/js/mixin/MixinDiv'

export default {
  name: 'Zdatetime',
  mixins: [mixinDiv],
  props: {
    type: { default: 'datetime' },
    start: { default: '00:00' },
    end: { default: '24:00' },
    step: { default: '00:60' },
    clearable: { type: [Boolean, Number, String], default: true },
    w: { default: 200 },
    placeholder: {},
    disabled: {},
    defaultValue: {},
    nullToEmpty: {},
    prefixDate: { default: '2000-01-01' }, // time类型的时间的日期前缀
    defaultTime: { default: '00:00:00' },
    // defaultDateFromNow: { type: [String, Number] }// 为0位当天  为1位明天 -1为昨天  同理
  },
  data() {
    return {
      returnValue: null
    }
  },
  watch: {
    value(newVal) {
      this.readValue(newVal)
    },
    returnValue(newVal) {
      if (newVal == null && this.nullToEmpty) {
        this.$nextTick(() => {
          this.$emit('input', '')
        })
      } else {
        if (newVal) {
          if (newVal.length === '00:00'.length) {
            newVal = newVal + ':00'
          }
        }
      }
      this.$emit('input', newVal)
    }
  },
  created() {
    this.readValue(this.value)
    this.returnValue = this.returnValue || this.getDefault()
    if (!this.value && this.returnValue) {
      this.$emit('input', this.returnValue)
    }
  }, methods: {
    readValue(outValue) {
      this.returnValue = outValue
    },
    getDefault() {
      if (this.defaultValue) {
        return this.defaultValue
      }
      // if (this.defaultDateFromNow != null) {
      //   return parseTime(new Date().getTime() + 24 * 60 * 60 * 1000 * this.defaultDateFromNow)
      // }
      return null
    },
    change: function(newVal) {
      // this.$emit('change', newVal)
      this.returnValue = newVal
    }
  }
}
</script>
<style scoped>
</style>
