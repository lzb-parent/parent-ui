<template>
  <zdata :url="url||`/poster/${code}/info`" @reload="datas=>$emit('reload',datas)">
      <template #default="{datas}">
        <slot v-if="$slots.default" :datas="datas"></slot>
        <zposter-unit v-else-if="!waitParamsLoad || params" :poster="datas" v-bind="{...$attrs,...$props}" @loaded="$emit('loaded')"></zposter-unit>
      </template>
  </zdata>
</template>
<script>


import ZposterUnit from "./zposterUnit.vue";
import Zdata from "@/parent-ui/src/main/ui-h5/zdata.vue";

export default {
  name: 'poster',
  components: {Zdata, ZposterUnit},
  props: {
    url:String,
    waitParamsLoad: Boolean, // 是否等参数数据到了才一起加载
    code: {},
    params: {},
  },
}
</script>
