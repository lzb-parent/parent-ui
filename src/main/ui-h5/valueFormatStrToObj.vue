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
      // console.log('$outToInFun value',value)
      return value && JSON.parse(value)
    },
    $inToOutFun(value) {
      return JSON.stringify(value)
    },
  },
}
</script>
