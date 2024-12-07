<template>
  <div class="ztab d-flex justify-around">
    <template v-for="dict in dictList"><!-- 对象list形式的数据 -->
      <ztab-item :key="dict[listCode]" :selected="value === dict[listCode]" :code="dict[listCode]" :label="dict[listLabel]" @click.native="returnValue = dict[listCode]"></ztab-item>
    </template>
    <template v-for="(label,code) in map">
      <template v-if="(!filterPre || filterPre.indexOf(code) > -1) && (!excludePre || excludePre.indexOf(code) === -1)">
        <ztab-item :key="code" :selected="value === code" :code="code" :label="label" @click.native="returnValue = code"></ztab-item>
      </template>
    </template>
  </div>
</template>
<script>
import ZtabItem from "./ztabItem.vue";

/**
   * 快捷的el-select选择框
   */
export default {
  name: 'ztab',
  components: {ZtabItem},
  mixins: [],
  props: {
    /**
       * 字典类名simpleClassName    v-model不能传boolean
       */
    value: { },
    classname: { type: String },
    placeholder: { type: String, default: 'Please Choose' },
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
    isUseCodeAsName: { type: Boolean, default: false },
    notNull: { type: Boolean, default: false },
    parentStack: { type: Number, default: 5 }, // 获取父节点属性，只向上找5层（不然太影响性能）
    param: {}, // 额外参数,用于触发事件时的额外信息 例如表格中的 scope.row
    dictMap: {},
    dictList: {},
    listCode: { default: 'code' },
    listLabel: { default: 'name' },
    filterPre: { type: String, default: '' },
    excludePre: { type: String, default: '' }
  },
  data() {
    return {
      tempDictList: [],
      returnValue: this.value,
      map: this.dictMap,
      oldKey: null// 修改事件 修改前的值
    }
  },
  computed: {
    getClearable() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.returnValue = null
      const proFromParent = getProFromParent(this, 'clearable', false, this.parentStack)
      return proFromParent
    }
  },
  watch: {
    value(newVal) {
      if (this.returnValue !== newVal) {
        this.returnValue = newVal
      }
    },
    returnValue(newVal) {
      this.$emit('input', newVal)
    }
  },
  mounted() {
    this.returnValue = this.value
  },
  created() {
    this.oldKey = this.value
    if (this.classname) {
      this.map = this.$store.state.common.dictEnumMapAll ? this.$store.state.common.dictEnumMapAll[this.classname] : {}
    }
  },
  methods: {
    emitChange(val) {
      val = val || null
      this.dispatch('ElFormItem', 'el.form.change', val)
      this.$emit('input', val)
      // (newKey,newValue,oldKey,oldValue,param)
      this.$emit('change', val, this.getValue(val), this.oldKey, this.getValue(this.oldKey), this.param)
      this.oldKey = this.value
    },
    getValue(key) {
      if (this.map) {
        return this.map[key]
      }
      if (this.dictList) {
        for (const o of this.dictList) {
          if (o[this.listCode] === key) {
            return o[this.listLabel]
          }
        }
      }
      return null
    },
  }
}
</script>
<style scoped>
</style>

