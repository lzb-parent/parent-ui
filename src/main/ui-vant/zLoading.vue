<template>
  <van-button v-bind="$attrs" class="zLoading" v-on="$listeners"
              style="background: inherit;color: inherit;padding: 0;height: inherit;">
    <template #icon>
      <slot></slot>
    </template>
  </van-button>
</template>
<script>

import mixinScope from "../js/mixin/MixinScope";

export default {
  name: 'zLoading',
  computed: {},
  mixins: [mixinScope],
  components: {},
  props: {
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
 .zLoading {
  > ::v-deep .van-button__content{
    display: block;
  }
}
</style>
