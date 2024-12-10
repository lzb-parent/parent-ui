<template>
  <div>
    <slot :datas="datas"></slot>
  </div>
</template>
<script>
export default {
  name: 'bannerDatas',
  props: {
    typeCode: {},
  },
  data() {
    return {
      datas: [],
    }
  },
  async created() {
    this.datas = await $$get(`/banner/${this.typeCode}/list`)
  },
}
</script>
