<template>
  <el-dialog v-if="scope.value" append-to-body :visible.sync="scope.value" width="80%" v-bind="$attrs"  :close-on-click-modal="formDataOption!=='insert'" :title="(formDataOption==='insert'?$t('新增'):$t('修改')) + ' ' + tableConfig.label">
    <areaForm v-bind="$attrs" :tableConfigUnit="tableConfigUnit" :form-data-option="formDataOption" :form-data.sync="formDataInner" @hideForm="scope.value=false" @saveSuccess="e=>$emit('saveSuccess',e)" >
      <template v-for="(slotFn, slotName) in $slots" :slot="slotName">
        <slot :name="slotName" />
      </template>
    </areaForm>
  </el-dialog>
</template>

<script>

import MixinScope from '../../../main/js/mixin/MixinScope'
import ObjectUtil from '../../../main/js/utils/ObjectUtil'
import area, {Areas} from "../../../main/ui-element/autotable/area";

export default {
  name: 'AreaFormDialog',
  mixins: [MixinScope],
  extends: area,
  props: {
    formData: {},
    formDataOption: null,
  },
  data() {
    return {
      area: Areas.form,
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
