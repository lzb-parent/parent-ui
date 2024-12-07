<template>
  <van-field v-bind="{...$attrs,...$props}" v-on="$listeners">
    <template #input="slotProps">
      <div @click="disabled?null:showPicker = true">
        <slot name="selected" :entity="scope.value">
          {{ getLabelFun(scope.value) }}
        </slot>
      </div>
    </template>
    <template #extra>
      <van-popup v-model="showPicker" close-icon-position="top-left" position="bottom">
        <van-picker :columns="selectEntitys" show-toolbar @confirm="onConfirm">
          <template #option="option">
            <slot name="option" :entity="option">
              {{ getLabelFun(option) }}
            </slot>
          </template>
        </van-picker>
      </van-popup>
    </template>
  </van-field>
</template>

<script>
import MixinScope from '../../main/js/mixin/MixinScope'
import ObjectUtil from '../../main/js/utils/ObjectUtil'

export default {
  name: 'ZfieldSelect',
  mixins: [MixinScope],
  props: {
    defaultFirst: Boolean,
    required: Boolean,
    disabled: Boolean,
    selectEntitys: {
      type: Array,
      default: () => []
    },
    getKeyFun: {
      type: Function,
      default(item) {
        return item ? item.id : null
      }
    },
    getLabelFun: {
      type: Function,
      default(item) {
        return item ? item.label : ''
      }
    },
  },
  data() {
    return {
      showPicker: false,
      scope: {
        value: null,
      },
      selectEntityMap: {},
    }
  },
  watch: {
    selectEntitys: {
      handler: '$load', // Watch for changes in selectEntitys and trigger buildSelectEntityMap
      immediate: true, // Trigger the handler immediately during component creation
    },
  },
  created() {
    this.$load()
  },
  methods: {
    $load() {
      // Build the selectEntityMap for easy lookup
      const list = this.selectEntitys
      this.selectEntityMap = list.reduce((map, entity) => {
        const key = this.getKeyFun(entity)
        map[key] = entity
        return map
      }, {})
      // this.scope.value = this.$outToInFun(this.value || this.defaultValue);
      if (ObjectUtil.isEmpty(this.value) && list.length && (this.defaultFirst || (this.defaultFirst == null && this.required && list.length === 1))) {
        this.scope.value = list[0]
      } else {
        this.scope.value = this.$outToInFun(this.value || this.defaultValue)
      }
    },
    $inToOutFun(inside) {
      return this.getKeyFun(inside)
    },
    $outToInFun(key) {
      // Retrieve an option from the map using the provided key
      return this.selectEntityMap[key] || null
    },
    onConfirm(selectEntity, index) {
      this.scope.value = selectEntity
      // console.log('zfieldSelect onConfirm', arguments)
      // const selectedKey = this.getKeyFun(this.scope.value);
      // const selectedEntity = this.$outToInFun(selectedKey); // Use the new method
      // this.$emit('input', selectedEntity);
      this.$emit('select', selectEntity, index)
      this.showPicker = false
    },
  },
}
</script>
