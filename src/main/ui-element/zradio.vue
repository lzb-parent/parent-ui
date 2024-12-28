<template>
  <!--  v-on="$listeners"-->
  <!--  <el-select-->
  <!--    v-if="computedIsEdit(true)"-->
  <!--    v-model="scope.value"-->
  <!--    :multiple="multiple"-->
  <!--    :clearable="clearable"-->
  <!--    :filterable="filterable"-->
  <!--    v-bind="$attrs"-->
  <!--    @clear="$emit('clear')"-->
  <!--  >-->
  <!--    <template v-for="(option,i) in dictListInner">&lt;!&ndash; 对象list形式的数据 &ndash;&gt;-->
  <!--      <el-option-->
  <!--        :key="i"-->
  <!--        :value="getCode(option)"-->
  <!--        :label="getLabel(option,i)"-->
  <!--        :disabled="option.disabled"-->
  <!--      />-->
  <!--    </template>-->
  <!--    <slot/>-->
  <!--  </el-select>-->
<!--  <div>-->
<!--    dictListInner={{classname}}-->
    <el-radio-group v-if="computedIsEdit(true)" v-model="scope.value" v-bind="{...$attrs,...$props}" @input="(p1,p2)=>{$emit('change',p1,p2)}" v-on="$listeners">
        <template v-for="(data,index) in dictListInner">
          <el-radio
            :key="index"
            v-bind="{...$attrs,...$props}"
            :label="getCode(data)"
            :class="`u-m-r-10 ${scope.value===getCode(data)?'checked':''}`"
            style="margin-bottom: 0; margin-right: 0"
          >
            {{ getLabel(data) }}
          </el-radio>
        </template>
      </el-radio-group>
      <span v-else v-on="$listeners">
        <template v-if="multiple">
          <div v-for="(subVal,i) in scope.value" :key="i" class="subValue">{{ getLabel(dictMap[subVal], null) }} </div>
        </template>
        <template v-else>{{ getLabel(dictMap[scope.value], null) }}</template>
      </span>
<!--  </div>-->
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
  name: 'Zradio',
  mixins: [MixinScope, MixinDiv],
  props: {
    /**
     * 字典类名simpleClassName    v-model不能传boolean
     */
    multiple: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: null },
    classname: { type: String },
    entityName: { type: String },
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
    defaultFirst: { type: Boolean, default: null },
    // notExistReturnValue: {type: Boolean, default: false},
    param: {}, // 额外参数,用于触发事件时的额外信息 例如表格中的 scope.row
    dictList: {},
    listCode: { default: 'code' },
    listLabel: { default: 'label' },
    filter: {
      type: Function, default(obj) {
        return true
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
    }
  },
  data() {
    return {
      init: false,
      dictListInner: [],
      dictMap: {},
      selectOptions: [],
    }
  },
  computed: {
    listLength() {
      return this.dictListInner.length
    }
  },
  watch: {
    dictList(newVal) {
      this.dictListInner = newVal
      this.dictListChange()
    },
    'scope.value': {
      handler(newValIn, oldVal) {
        const inToOut = this.$inToOutFun(newValIn)
        this.$emit('change', inToOut)
        const option = this.multiple ? newValIn.map(subVal => this.dictMap[subVal]) : this.dictMap[newValIn]
        this.$emit('selectOption', option)
        // debugger
        // console.log('selectOption' + ' ' + inToOut+ ' ' + newValIn + ' ' + oldVal)
        if (this.init) {
          // this.$emit('input', inToOut) v-model默认会激活input事件?
        }
      },
      immediate: true,
      deep: true
    },
  },
  async created() {
    await this.reload()
    this.init = true
  },
  methods: {
    async reload() {
      // if (this.init) {
      //   debugger
      // }
      this.dictListInner = this.dictList || []
      if (this.entityName) {
        // protected long size = 10;
        // protected long current = 1;
        const list = this.$store.get('dataMapEntity')[this.entityName]
        // console.log('zselect reload this.entityName', this.entityName)
        // console.log('zselect reload list', list)
        list.forEach(o => {
          o.label = o.label || o.name
        })
        this.dictListInner = list
      }
      if (!this.listLength && this.classname) {
        this.dictListInner = this.$store.get('dataMapEnum')[this.classname] || []
      }
      // debugger
      this.dictListChange()
    },
    dictListChange() {
      // const outKey = this.value
      // this.$nextTick(() => {
      // console.log('dictListInner', this.dictListInner)
      this.dictListInner = this.dictListInner.filter(this.filter)
      this.dictMap = CollUtil.listToMapFun(this.dictListInner, this.getCode)
      if (ObjectUtil.isEmpty(this.value) && this.listLength && (this.defaultFirst || (this.defaultFirst == null && this.listLength === 1))) {
        this.scope.value = this.getCode(this.dictListInner[0])
        this.selectOptions = [this.dictListInner[0]]
        this.$emit('selectOption', this.selectOptions)
      }
      // })
    },
    getCode(option) {
      return option && (this.codeFun(option) || option[this.listCode])
    },
    getLabel(option, index) {
      return option && (this.labelFun({ ...option, $index: index }) || option[this.listLabel])
    },
  }
}
</script>
<style scoped>
</style>

