<template>
  <zselect v-model="scope.value" v-bind="$attrs" :multiple="multiple" :classname="classname" v-on="$listeners"/>
</template>

<script>
import Zselect from '../../main/ui-element/zselect.vue'
import MixinScope from '../../main/js/mixin/MixinScope'

/**
 * 快捷的el-select选择框
 */
export default {
  name: 'ZselectAppend',
  components: {Zselect},
  mixins: [MixinScope],
  props: {
    multiple: {default: true},
    valuePrefix: {default: ''},
    classname: String,
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  async created() {
    // if (this.classname === 'EnumRegisterProps') {
    // console.log('ZselectAppend this.value', this.value)
    // }
  },
  methods: {
    $outToInFun(outside) {
      // if (this.classname === 'EnumRegisterProps') {
      // console.log('ZselectAppend $outToInFun', outside)
      // }

      if (outside) {
        if (this.valuePrefix && outside.indexOf(this.valuePrefix) === 0) {
          outside = outside.substring(this.valuePrefix.length)
        }
        return outside.split(',')
      }
      return []
    },
    /**
     * 内部值,转,外部值
     */
    $inToOutFun(inside) {
      // console.log('ZselectAppend $inToOutFun', inside)
      // if (this.classname === 'EnumRegisterProps') {
      // debugger
      // console.log('ZselectAppend $inToOutFun', inside)
      // }
      inside = inside ? inside.filter(o => o) : []
      if (inside && inside.length) {
        return this.valuePrefix + inside.join(',')
      }
      return ''
    },
  }
}
</script>
<style scoped>
</style>

