<template>
  <el-switch
       v-if="computedIsEdit(true)"
       v-bind="$attrs"
       v-model="returnValue"
       :disabled="disabled"
       v-on="$listeners"
   />
   <span v-else-if="returnValue" style="color: green;" v-on="$listeners">{{ trueLabel }}</span>
   <span v-else-if="!returnValue" style="color: #ee7777;" v-on="$listeners">{{ falseLabel }}</span>
</template>
<script>

import mixinDiv from '../../main/js/mixin/MixinDiv'

export default {
  name: 'Zswitch',
  mixins: [mixinDiv],
  props: {
    disabled: {type: Boolean, default: false},
    trueLabelInput: { type: String, default: '' },
    falseLabelInput: { type: String, default: '' },
  },
  data() {
    return {
      returnValue: this.value,
      init: false,
      trueLabel: '',
      falseLabel: '',
    }
  },
  watch: {
    value(newVal) {
      this.returnValue = newVal
    },
    returnValue(newVal, oldVal) {
      this.$emit('input', newVal)
      if (this.init) {
        this.$emit('change', newVal, oldVal)
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init = true
    })
    this.trueLabel = this.trueLabelInput || this.$t('是');
    this.falseLabel = this.falseLabelInput || this.$t('否');
  },
  methods: {}
}
</script>
<style scoped>
</style>
