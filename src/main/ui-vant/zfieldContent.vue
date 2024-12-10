<template>
  <zfield v-model="scope.value" v-bind="$attrs" v-on="$listeners"
          style="border:none;background: inherit;color: inherit;padding: 0;height: inherit;"
  >
    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
  </zfield>
</template>
<script>

import mixinScope from "../js/mixin/MixinScope";
import zfield from "../..//main/ui-vant/zfield.vue";

export default {
  name: 'zfieldContent',
  computed: {},
  mixins: [mixinScope],
  components: {zfield},
  props: {},
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>
