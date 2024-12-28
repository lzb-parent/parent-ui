<template>
  <el-select
    v-if="computedIsEdit(true)"
    v-model="returnValue"
    :placeholder="placeholder"
    :title="placeholder"
    :clearable="clearable"
    :style="getStyle"
    :size="computedSize"
    :disabled="disabled"
    @blur="onBlur"
    v-on="$listeners"
  >
    <el-option :label="trueLabel" :value="true" />
    <el-option :label="falseLabel" :value="false" />
  </el-select>
  <span v-else-if="returnValue" style="color: green;">{{ trueLabel }}</span>
  <span v-else-if="!returnValue" style="color: #ee7777;">{{ falseLabel }}</span>
</template>
<script>
import mixinDiv from "../../main/js/mixin/MixinDiv";

export default {
  name: 'Zbool',
  mixins: [mixinDiv],
  props: {
    clearable: { type: [Boolean, Number, String], default: true },
    disabled: { type: Boolean, default: false },
    w: { type: [Number, String], default: '200' },
    placeholder: { type: String, default: () => '' },
    trueLabelInput: { type: String, default: '' },
    falseLabelInput: { type: String, default: '' },
  },
  data() {
    return {
      returnValue: this.value,
      trueLabel: '',
      falseLabel: '',
    }
  },
  watch: {
    value(newVal) {
      this.returnValue = newVal
    },
    returnValue(newVal, oldVal) {
      if (newVal === '') {
        newVal = null
      }
      this.$emit('input', newVal)
      if (newVal !== oldVal) {
        this.$emit('change', newVal, oldVal)
      }
    }
  },
  created() {
    this.trueLabel = this.trueLabelInput || this.$t('是');
    this.falseLabel = this.falseLabelInput || this.$t('否');
  },
  methods: {
    onBlur() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('blur', this.returnValue)
        }, 200)
      })
    }
  }
}
</script>
<style scoped>
</style>
