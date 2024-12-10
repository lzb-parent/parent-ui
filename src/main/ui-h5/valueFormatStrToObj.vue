<template>
  <div>
    <slot :scope="scope"/>
  </div>
</template>
<script>
import MixinScope from '../js/mixin/MixinScope'

export default {
  name: 'ValueFormatStrToObj',
  mixins: [MixinScope],
  // props: {
  // },
  data() {
    return {}
  },
  created() {

  },
  methods: {
    $outToInFun(value) {
      return value && JSON.parse(value) || this.defaultValue
    },
    $inToOutFun(value) {
      return JSON.stringify(value)
    },
  },
}
</script>
