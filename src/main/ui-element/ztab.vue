<template>
  <el-tabs v-model="scope.value" v-bind="$attrs" v-on="{...$listeners,input:(val)=>{scope.value=val}}">
    <el-tab-pane :label="$t(`全部`)" :name="'0'"></el-tab-pane>
    <template v-for="(option,i) in dictListInner"><!-- 对象list形式的数据 -->
      <el-tab-pane :key="i" :disabled="option.disabled" :label="getLabel(option,i)"
                   :name="getCode(option,i)"></el-tab-pane>
    </template>
    <slot/>
  </el-tabs>
</template>

<script>
import MixinScope from '../../main/js/mixin/MixinScope'
import MixinDiv from '../../main/js/mixin/MixinDiv'
import CollUtil from '../../main/js/utils/CollUtil'
import ObjectUtil from '../../main/js/utils/ObjectUtil'

/**
 * 快捷的el-select选择框
 */
export default {
  name: 'ztab',
  mixins: [MixinScope, MixinDiv],
  props: {
    filterable: {type: Boolean, default: true},
    clearable: {type: Boolean, default: true},
    /**
     * 字典类名simpleClassName    v-model不能传boolean
     */
    classname: {type: String},
    entityName: {type: String},
    defaultFirst: {type: Boolean, default: null},
    dictList: {
      default: () => {
        return []
      }
    },
    listCode: {default: 'code'},
    listLabel: {default: 'label'},
    filter: {
      type: Function, default(obj) {
        return true
      }
    },
    reloadList: {
      type: Function, default(list) {
        return list
      }
    },
    codeFun: {
      type: Function, default(obj) {
        return null
      }
    },
    labelFun: {
      type: Function, default(obj) {
        return null
      }
    },
  },
  data() {
    return {
      init: false,
      dictListInner: [],
      dictMap: {},
    }
  },
  computed: {
    listLength() {
      return this.dictListInner.length
    },
    dictListEntity() {
      if (this.entityName) {
        const list = this.$store.get('dataMapEntity')[this.entityName] || []
        list.forEach(o => {
          o.label = o.label || o.name
        })
        return list
      }
      return []
    },
    dictListEnum() {
      if (this.classname) {
        return this.$store.get('dataMapEnum')[this.classname] || []
      }
      return []
    },
  },
  watch: {
    dictList() {
      this.$load()
    },
    dictListEntity() {
      this.$load()
    },
    dictListEnum() {
      this.$load()
    },
  },
  async created() {
  },
  methods: {
    async $load() {
      this.dictListInner = ObjectUtil.or(this.dictList, this.dictListEntity, this.dictListEnum, [])
      this.dictListInner = this.reloadList(this.dictListInner.filter(this.filter))
      this.dictMap = CollUtil.listToMapFun(this.dictListInner, this.getCode)
      if (ObjectUtil.isEmpty(this.value) && this.listLength && (this.defaultFirst || (this.defaultFirst == null && this.listLength === 1))) {
        const firstOption = this.dictListInner[0]
        const code = this.getCode(firstOption)
        this.scope.value = code
        this.$emit('selectOption', firstOption)
      } else {
        this.$emit('selectOption', this.dictMap[this.scope.value])
      }
      this.$emit('afterLoad', this.dictListInner)
    },
    getCode(option) {
      return option && (this.codeFun(option) || option[this.listCode])
    },
    getLabel(option, index) {
      return option && (this.labelFun({...option, $index: index}) || option[this.listLabel])
    },
    $outToInFun(outside) {
      return ObjectUtil.isEmpty(outside) ? '0' : outside
    },
    $inToOutFun(inside) {
      return inside === '0' ? null : inside
    },
  }
}
</script>
<style scoped>
</style>

