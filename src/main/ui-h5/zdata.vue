<template>
  <div v-if="datas || nullShow">
    <slot :datas="datas" />
  </div>
</template>
<script>
import ObjectUtil from '../../main/js/utils/ObjectUtil'

export default {
  name: 'Zdata',
  props: {
    nullShow: Boolean,
    url: {},
    params: {},
    defaultData: {},
  },
  data() {
    return {
      ObjectUtil,
      datas: null,
      hasReloaded: false,
    }
  },
  watch: {
    url() {
      this.reload()
    },
    'params': {
      async handler(newVal, oldVal) {
        if (!ObjectUtil.deepEqual(newVal, oldVal)) {
          await this.reload()
        }
      },
      deep: true,
    },
  },
  async created() {
    this.reload()
  },
  methods: {
    async reload() {
      this.datas = await $$get(this.url, this.params) || this.defaultData
      this.$emit('reload', this.datas)
    }
  }
}
</script>
