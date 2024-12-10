<template>
  <div>
    <slot :datas="datas"></slot>
  </div>
</template>
<script>
import MixinScope from "../../../main/js/mixin/MixinScope";

/**
 * 对象选择
 */
export default {
  name: 'zobjSelect',
  mixin: [MixinScope],
  props: {
  },
  watch: {
  },
  data() {
    return {
      datas: null,
    }
  },
  created() {
    this.reload()
  },
  methods:{
    async reload(){
      this.datas = await $$get(this.url)
      // console.log(`zdata ${this.url} reloaded`)
    }
  }
}
</script>
