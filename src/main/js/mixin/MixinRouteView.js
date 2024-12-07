/**
 * 路由页面
 * @type {string[]}
 */

export default {
  $dataEntitys: [], // 例如 UserLevelConfig
  $dataEnums: [], // 例如 EnumSex
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      // console.log('MixinRouteView ' + vm.$options.name)
      await vm.$store.dispatch('loadDataMapEntity', vm.$options.$dataEntitys)
      await vm.$store.dispatch('loadDataMapEnum', vm.$options.$dataEnums.concat('WhereOptEnum'))
      // console.log('MixinRouteView ' + vm.$options.name, vm.$store.get('dataMapEnum')['EnumRegisterProps'])
    })
  },
  // async beforeCreate() {
  //   console.log('MixinRouteView ' + this.$options.name)
  //   await this.$store.dispatch('loadDataMapEntity', this.$options.$dataEntitys)
  //   await this.$store.dispatch('loadDataMapEnum', this.$options.$dataEnums.concat('WhereOptEnum'))
  // },
  data() {
    return {
    }
  },
  computed: {
    isDeveloper() {
      return this.$route.fullPath.endsWith('2')
    }
  },
  mounted() {
  },
  methods: {}
}
