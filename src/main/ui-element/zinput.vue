<template>
  <span v-if="!computedIsEdit(true)">
    <span v-if="viewSplitNumIsView">{{ viewSplitNumNumValue }}</span>
    <span v-else>{{ returnValue }}</span>
  </span>
  <!-- 中间存放空格 -->
  <el-input
    v-else-if="viewSplitNumIsView"
    :value="viewSplitNumNumValue"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :title="placeholder"
    :style="getStyle"
    :size="computedSize"
    :disabled="disabled"
    :clearable="true"
    :readonly="true"
    :type="type"
  >

    <el-button slot="append" icon="el-icon-edit" @click="viewSplitNumIsView=false" />
  </el-input>
  <el-input
    v-else
    v-model="returnValue"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :title="placeholder"
    :style="getStyle"
    :size="computedSize"
    :disabled="disabled"
    :clearable="clearable"
    :autosize="autosize||autosize2"
    :readonly="readonly"
    :type="type"
    @blur="$emit('blur')"
    @keyup.enter.native="$emit('enter')"
  >
    <template v-if="viewSplitNum">
      <el-button slot="append" icon="el-icon-view" @click="viewSplitNumIsView=true" />
    </template>
  </el-input>
</template>
<script>

import mixinDiv from '../../main/js/mixin/MixinDiv'

export default  {
  name: 'zinput',
  mixins: [mixinDiv],
  props: {
    clearable: { type: [Boolean, Number, String], default: true },
    w: { type: String, default: '250' },
    placeholder: { type: String, default: () => '' },
    type: {},
    disabled: {},
    autosize: {},
    readonly: {},
    viewSplitNum: {},
    autocomplete: {},
  },
  data() {
    return {
      returnValue: this.value,
      autosize2: null,
      viewSplitNumNums: [],
      // viewSplitNumNumValue: null,
      viewSplitNumIsView: false
    }
  },
  computed: {
    viewSplitNumNumValue() {
      const value = this.returnValue
      const length = value.length
      let val = ''
      let from = 0
      let to = 0
      if (value) {
        for (const num of this.viewSplitNumNums) {
          to = Math.min(from + num, length)
          val += value.substring(from, to) + ' '
          from = to
          if (from >= length) {
            break
          }
        }
        val += value.substring(to, length)
        return val
      }
    }
  },
  watch: {
    value(newVal) {
      this.returnValue = newVal
    },
    returnValue(newVal, oldVal) {
      this.$emit('input', newVal)
      this.$emit('change', newVal)
    }
  },
  created() {
    if (this.viewSplitNum) {
      this.viewSplitNumNums = this.viewSplitNum.split(',').map(n => parseInt(n))
      this.viewSplitNumIsView = true
    }
    if (this.type === 'textarea' && !this.autosize) {
      this.autosize2 = { minRows: 2 }
    }
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
