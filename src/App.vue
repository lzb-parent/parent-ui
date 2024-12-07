<template>
  <div id="app">
    <div class="border pa-2 ma-2" v-for="(component, componentName) in components" :key="componentName">
      <h2>{{ componentName }}</h2>
      <component :is="component"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      components: {}, // 用于存储动态组件
    };
  },
  async created() {
    // 创建一个 require.context 上下文
    const componentContext = require.context('./main/ui-h5', true, /\.vue$/);
    // 遍历并动态导入组件
    for (const key of componentContext.keys()) {
      let componentContextOne = componentContext(key);
      this.$set(this.components, key, (await componentContextOne).default);
    }
  },
  methods: {
  },
};
</script>
