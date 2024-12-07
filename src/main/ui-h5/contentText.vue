<template>
  <div class="contentText">
    <span class="mr-2"><span v-if="label">{{ $t(label) }}：</span><span :class="`${true?'text-primary':'text-white'}`">{{ value }}</span></span>
    <div>
    </div>
  </div>
</template>

<script>

export default {
  name: "contentText",
  props: {
    label: { },
    value: { },
  },
  components: {},
  computed: {},
  data() {
    return {}
  },
  created() {

  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
