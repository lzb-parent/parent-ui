<template>
  <el-select
    v-if="computedIsEdit(true)"
    v-model="scope.value"
    :multiple="multiple"
    :clearable="clearable"
    :filterable="filterable"
    v-bind="$attrs"
    v-on="$listeners"
    @clear="$emit('clear')"
  >
    <template v-for="(option,i) in dictListInner"><!-- 对象list形式的数据 -->
      <el-option
        :key="i"
        :value="getCode(option)"
        :label="getLabel(option,i)"
        :disabled="option.disabled"
      />
    </template>
    <slot />
  </el-select>
  <span v-else  v-on="$listeners">
    <template v-if="multiple">
      <div v-for="(code,i) in scope.value" :key="i" class="subValue" :style="`color:${colorMapInner[code]||''}`">{{ getLabel(dictMap[code], null) }} </div>
    </template>
    <span v-else :style="`color:${colorMapInner[scope.value]||''}`">{{ getLabel(dictMap[scope.value], null) }}</span>
  </span>
<!--  <template v-else-if="colorMapInner && Object.keys(colorMapInner).length">-->
<!--    <div :style="`color:${colorMapInner[returnValue]||''}`">{{ $t(getValue(returnValue)) }}</div></template>-->
<!--  <template v-else>{{ $t(getValue(returnValue)) }}</template>-->
</template>

<script>
import MixinScope from '../../main/js/mixin/MixinScope'
import MixinDiv from '../../main/js/mixin/MixinDiv'
import CollUtil from '../../main/js/utils/CollUtil'
import ObjectUtil from '../../main/js/utils/ObjectUtil'
const baseColorMap = {
  1: '#006363', // 青绿色
  2: '#2673cc', // 蓝色
  3: '#3e4d23', // 橄榄绿
  4: '#ccad00', // 金色
  5: '#004c00', // 绿色
  6: '#660000', // 红色
  7: '#666600', // 黄色
  8: '#663300', // 橙色
  9: '#380062', // 紫色
  10: '#4d4d4d', // 灰色
  11: '#1a1a1a', // 黑色
  12: '#cc0f7a', // 粉红色
  13: '#663319', // 棕色
  14: '#006363', // 青色
  15: '#660066', // 洋红色
  16: '#29a329', // 酸橙色
  17: '#999999', // 银色
  18: '#000066', // 海军蓝
  19: '#660000', // 栗色
  green: '#356944', // 绿色
  blue: '#2c73b1', // 蓝色
  orange: '#d46946', // 橙色
  purple: '#6d4898', // 紫色
  red: '#bf3b6a', // 红色
  yellow: '#cc9300', // 黄色
  gray: '#666666' // 灰色
}

/**
 * 快捷的el-select选择框
 */
export default {
  name: 'Zselect',
  mixins: [MixinScope, MixinDiv],
  props: {
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
    multiple: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: null },
    /**
     * 字典类名simpleClassName    v-model不能传boolean
     */
    classname: { type: String },
    entityName: { type: String },
    defaultFirst: { type: Boolean, default: null },
    // notExistReturnValue: {type: Boolean, default: false},
    dictList: {
      default: () => {
        return []
      }
    },
    listCode: { default: 'code' },
    listLabel: { default: 'label' },
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
    colorMap: {},
    colorFlag: { type: Boolean, default: true },
  },
  data() {
    return {
      init: false,
      dictListInner: [],
      values: ['username'],
      dictMap: {},
      colorMapInner: null,
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
    dictListEntity(values) {
      // console.log(`dictListEntity watch ${this.entityName||''} ${this.classname||''}`,values)
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
      // console.log('Zselect created value2= ' , this.value)
      this.dictListInner = ObjectUtil.or(this.dictList, this.dictListEntity, this.dictListEnum, [])
      // console.log('this.dictListInner',this.dictListInner)
      this.dictListInner = this.reloadList(this.dictListInner.filter(this.filter))
      this.dictMap = CollUtil.listToMapFun(this.dictListInner, this.getCode)

      // if (this.init) {
      //   return
      // }
      // this.init = true
      // console.log('zselect defaultFirst'+this.$options.name, this.defaultFirst )
      if (ObjectUtil.isEmpty(this.value) && this.listLength && (this.defaultFirst || (this.defaultFirst == null && this.listLength === 1 && !this.multiple))) {
        const firstOption = this.dictListInner[0]
        const code = this.getCode(firstOption)
        this.scope.value = this.multiple ? [code] : code
        // console.log('zselect $load value update'+this.$options.name,this.scope.value )
        this.$emit('selectOption', firstOption)
      } else {
        this.$emit('selectOption', this.dictMap[this.scope.value])
      }
      this.$emit('afterLoad', this.dictListInner)

      // 初始化颜色
      if (!this.computedIsEdit(true) && this.colorFlag) {
        // debugger
        this.colorMapInner = this.colorMap ? { ...this.colorMap } : null
        if (!this.colorMapInner) {
          const colorMap = {}
          for (let i = 0; i < this.dictListInner.length; i++) {
            const d = this.dictListInner[i]
            colorMap[this.getCode(d)] = baseColorMap[d.color] || baseColorMap[i + 1] || 'blue'
          }
          this.colorMapInner = colorMap
        }
      }
      // console.log('Zselect created value3= ' , this.value)
    },
    getCode(option) {
      return option && (this.codeFun(option) || option[this.listCode])
    },
    getLabel(option, index) {
      return option && (this.labelFun({ ...option, $index: index }) || option[this.listLabel])
    },
    $outToInFun(outside) {
      // debugger
      // console.log('outside',outside)
      // console.log('outside',outside.indexOf(',')>=0)
      // if (this.multiple && outside.indexOf(',')>=0) {
      //   return outside.split(',')
      //   // return outside ? outside.map(optionCode => this.dictMap[optionCode]) : []
      // }
      // return this.dictMap[outside]
      // console.log('zselect $outToInFun', outside)
      return outside
    },
    $inToOutFun(inside) {
      // console.log('zselect $inToOutFun', inside)
      if (this.multiple) {
        // debugger
        inside = Array.isArray(inside) ? inside : [inside]
        // debugger
        return inside || []
        // return inside ? inside.map(option => this.getCode(option)) : []
      }
      return inside
    },
  }
}
</script>
<style scoped>
</style>

