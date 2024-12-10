<template>
  <el-dialog v-if="scope.value" append-to-body :visible.sync="scope.value" width="80%" v-bind="$attrs">
    <areaForm v-bind="$attrs" :form-data-option="formDataOption" :form-data.sync="formDataInner" @hideForm="scope.value=false" @saveSuccess="e=>$emit('saveSuccess',e)" />
  </el-dialog>
</template>

<script>

import MixinScope from '../../../main/js/mixin/MixinScope'
import ObjectUtil from '../../../main/js/utils/ObjectUtil'

export default {
  name: 'AreaFormDialog',
  mixins: [MixinScope],
  props: {
    formData: {},
    formDataOption: null,
  },
  data() {
    return {
      formDataInner: { ...this.formData },
    }
  },
  watch: {
    formDataInner: {
      handler(newVal) {
        if (!ObjectUtil.deepEqual(this.formData, newVal)) {
          // this.entityInner = { ...this.formData }
          this.$emit('update:formData', this.formDataInner)
        }
      },
      deep: true
    },
    formData: {
      handler() {
        this.formDataInner = { ...this.formData }
      },
      deep: true
    },
  },
  // data() {
  // return {
  //   scope: {
  //     value: false
  //   }
  // }
  // },
}
</script>
