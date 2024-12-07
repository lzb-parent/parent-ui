<template>
  <div :class="`d-flex ztabItem ${selected?'selected':''}`">
    <div class="mr-1">{{ label }}</div>
    <svg-icon v-show="!selected" icon-class="right"  />
    <svg-icon v-show="selected" icon-class="down" />
  </div>
</template>

<script>

export default {
  name: "ztabItem",
  props: {
    selected: {},
    label: {},
    code: {},
  },
  components: {},
  computed: {},
  data() {
    return {}
  },
  created() {

  },
  methods: {}
}
</script>
