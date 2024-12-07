<template>
  <div class="zprogress">
    <slot :percentage="percentage||0">
      <div class="zprogress__portion" :style="{ width: percentage + '%' }"></div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'zprogress',
  props: {
    percentage: Number,
    progressColor: String,
  },
  data() {
    return {
    };
  },
  methods: {},
};
</script>

<style scoped>

</style>
