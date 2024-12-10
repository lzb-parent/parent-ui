/**
 * 登录,权限 相关全局方法
 * @type {string[]}
 */

export default {
  props: {},
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  computed: {},
  methods: {
    hasPerm(entity, opts) {
      const permissions = this.$store.get('permissions') || []
      if (Array.isArray(opts)) {
        for (const opt of opts) {
          if (permissions.includes(`/commonData/${opt}/${entity}`)) {
            return true
          }
        }
      } else {
        return permissions.includes(`/commonData/${opts}/${entity}`)
      }
    }
  }
}
