<template>
  <van-checkbox v-model="scope.value" v-bind="{...$attrs,...$props}" :class="`${scope.value?'checked':''}`">
<!--    {{ $t(getLabel(data)) }}-->
    <template #icon="{checked}">
      <svg-icon v-if="scope.value" class="ft-20" icon-class="circle_main"/>
      <svg-icon v-else class="ft-20" icon-class="circle"/>
    </template>
  </van-checkbox>
</template>
<script>

import mixinScope from "../js/mixin/MixinScope";

export default {
  name: 'checkbox',
  computed: {
  },
  mixins: [mixinScope],
  components: {},
  props: {
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
