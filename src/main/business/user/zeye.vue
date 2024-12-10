<template>
  <svg-icon :icon-class="scope.value?'eye_close':'eye_open'" class="ft-16" @click="scope.value=!scope.value"/>
</template>
<script>
import MixinScope from "../../../main/js/mixin/MixinScope";

export default {
  name: 'zeye',
  mixins: [MixinScope],
  props: {
  },
  watch: {
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods:{
  }
}
</script>
