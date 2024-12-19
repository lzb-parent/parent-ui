import ObjectUtil from '../utils/ObjectUtil'

/**
 * mixin_区域转值
 */
export default {
  props: {
    value: {},
    defaultValue: {},
    clearToEmpty: { type: Boolean, default: false },
  },
  data() {
    return {
      scope: {
        value: this.$outToInFun(this.value)
      }
    }
  },
  watch: {
    'scope.value': {
      handler(newValIn, oldVal) {
        if (this.clearToEmpty && newValIn === '') {
          this.$emit('input', '')
          this.$emit('select', '')
          return
        }
        // debugger
        // console.log('MixinScope watch scope.value new '+this.$options.name,newValIn)
        // console.log('MixinScope watch scope.value old '+this.$options.name,oldVal)
        const inToOut = this.$inToOutFun(newValIn)
        let out = this.value;
        if (!ObjectUtil.deepEqual(out, inToOut)) {
          // console.log('error1----- '+this.$options.name,newValIn)
          // console.log('error2------ '+this.$options.name,inToOut)
          // debugger
          this.$emit('input', inToOut)
          this.$emit('select', newValIn)
        }
      },
      deep: true
    },
    value: {
      handler(newValOut, oldVal) {
        // console.log('MixinScope watch value '+this.$options.name,newValOut)
        if (this.clearToEmpty && newValOut === '') {
          this.scope.value = ''
          return
        }
        const innerVal = this.$outToInFun(newValOut || this.defaultValue)
        if (!ObjectUtil.deepEqual(this.scope.value, innerVal)) {
          this.scope.value = innerVal
          // console.log('MixinScope watch value update'+this.$options.name,newValOut)
        }
      },
      deep: true
    }
  },
  async created() {
    // console.log('MixinScope created value0= '+this.$options.name, this.value)
    // console.log('MixinScope created scope.value0= '+this.$options.name, this.scope.value)
    await this.$load()
    // if (this.init) {
    //   return
    // }
    // this.init = true
    if (this.value || this.defaultValue) {
      this.scope.value = this.$outToInFun(this.value || this.defaultValue)
      // console.log('MixinScope created value update'+this.$options.name,this.scope.value )
    }
    // console.log('MixinScope created value1= '+this.$options.name, this.value)
    // console.log('MixinScope created scope.value1= '+this.$options.name, this.scope.value)
    // if (this.classname === 'EnumRegisterProps') {
    //      console.log(this.$options.name+'MixinScope.js this.value',this.value)
    //      console.log(this.$options.name+'MixinScope.js this.scope.value',this.scope.value)
    //    }
  },
  methods: {
    $load(){},
    /**
     * 外部值,转,内部值
     */
    $outToInFun(outside){
      return outside
    },
    /**
     * 内部值,转,外部值
     */
    $inToOutFun(inside){
      return inside
    },
  }
}
