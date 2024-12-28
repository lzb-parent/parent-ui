<template>
  <el-form ref="form" :rules="rules" v-bind="tableConfig" :model="entityInner" :validate-on-rule="true">
    <template v-for="(fieldNames,indexGroup) in fieldNamesGroupBy">
      <div :key="indexGroup" :class="`${indexGroup?'areaFormGroup':''}`" style="margin-bottom: 18px;">
        <div style="margin-top: -18px;background-color: white;padding: 0 4px;position: absolute;">{{ indexGroup }}</div>
        <template v-for="(fieldName,index) in fieldNames">
          <template
              v-if="formConfig.hideNullGroup && formConfig.hideNullGroup.includes(indexGroup) && !entityInner[fieldName]"/>
          <template v-else-if="true !== getFieldConfig(fieldName).hide">
            <el-form-item
                :key="indexGroup+'_'+index"
                :prop="fieldName"
                v-bind="{...getFieldConfig(fieldName),label:getFieldConfig(fieldName).label}"
            >
<!--                            getFieldConfig={{getFieldConfig(fieldName).notNull}}-->
              <baseField
                  :key="`pageQuery_${fieldName}`"
                  v-model="entityInner[fieldName]"
                  :area="area"
                  :entity.sync="entityInner"
                  :table-config="tableConfig"
                  :option="formDataOption"
                  :field-config="getFieldConfig(fieldName)"
                  @selectOption="option=>selectOption(fieldName,option)"
              />
            </el-form-item>
          </template>
        </template>
      </div>
    </template>
    <slot name="formAppend"></slot>
    <div class="text-center">
      <el-button @click="$emit('hideForm')">{{$t('取消')}}</el-button>
      <el-button
          v-if="(adminButtons.includes('add') || adminButtons.includes('edit')) && hasPerm(`${tableConfig.tableName}`,['insert','update'])"
          v-loading="loading"
          type="primary"
          @click="saveOrUpdate"
      >{{ formConfig.saveButtonLabel || $t('保存') }}
      </el-button>
    </div>
  </el-form>
</template>

<script>
import area from './area.js'
import {Areas, Option} from './area.js'
import ObjectUtil from '../../js/utils/ObjectUtil'
import Zinput from '../../../main/ui-element/zinput.vue'

export default {
  name: 'AreaForm',
  components: {Zinput},
  filters: {},
  extends: area,
  props: {
    formDataOption: null,
    formData: {},
    formConfig: {
      default: () => {
        return {
          saveButtonLabel: '',
          hideNullGroup: null,
        }
      }
    },
  },
  data() {
    return {
      area: Areas.form,
      entityInner: {},
      loading: false,
      // rules: {
      //   roleName: [{ required: true, message: '支付方式不能为空', trigger: 'blur' }],
      //   name: [{ required: true, message: '渠道名称不能为空', trigger: 'blur' }]
      // },
    }
  },
  computed: {
    rules() {
      const rules = {}
      for (const fieldName of this.fieldNames) {
        rules[fieldName] = this.rulesInner(this.getFieldConfig(fieldName))
      }
      return rules
    }
  },
  watch: {
    entityInner: {
      handler(newVal) {
        if (!ObjectUtil.deepEqual(this.formData, newVal)) {
          // this.entityInner = { ...this.formData }
          // console.log('update:formData', newVal)
          this.$emit('update:formData', this.entityInner)
        }
      },
      deep: true
    },
    formData: {
      handler() {
        this.entityInner = {...this.formData}
      },
      deep: true
    },
  },
  created() {
    this.entityInner = {...this.formData}
    if (this.tableConfig) {
      this.initEntity()
      this.$nextTick(() => {
        switch (this.formDataOption) {
          case Option.insert:
            for (const fieldName of this.fieldNames) {
              const defaultValue = this.getFieldConfig(fieldName).defaultValueObj
              if (!ObjectUtil.isNull(defaultValue) && ObjectUtil.isNull(this.entityInner[fieldName])) {
                this.$set(this.entityInner, fieldName, defaultValue)
              }
            }
            break
        }
      })
    }
  },
  methods: {
    async initEntity() {
      this.loading = true
      this.entityInner = {...this.formData}
      const getOneUrl = this.tableConfig.getOneUrl
      // debugger
      const id = this.formData.id
      if (getOneUrl && id) {
        const entity = await $$get(getOneUrl, {id})
        if (entity) {
          this.entityInner = entity
        }
      }
      this.loading = false
    },
    saveOrUpdate() {
      if (this.loading) {
        return
      }
      this.loading = true
      // $a.b再加左括号,会velocity模板语法错误
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const url = this.tableConfig[this.formDataOption === Option.insert ? 'insertUrl' : 'updateUrl']
          $$post(url, this.entityInner).then(() => {
            this.$message.success(this.$t('保存成功'))
            this.$emit('saveSuccess', this.entityInner)
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    rulesInner(field) {
      const required = field.notEmpty === 'not_empty'
      const pleaseInput = field.uiType === 'image' ? this.$t('请上传') : this.$t('请输入')
      let list = [{required, message: (pleaseInput + ` ` + (field.label || '')), trigger: 'blur'}]
      if (field.rules) {
        list = list.concat(field.rules)
      }
      return list
    },
    selectOption(fieldName, option) {
      if (option) {
        // debugger
        const fieldConfig = this.getFieldConfig(fieldName)
        const entityClass = fieldConfig.entityClass
        if (entityClass && (fieldConfig.entityClassTargetProp === 'id' || fieldConfig.entityClassTargetProp === 'code')) {
          for (const fieldConfigOther of Object.values(this.fieldConfigMap)) {
            const entityClassTargetProp = fieldConfigOther.entityClassTargetProp
            // console.log('other entityClass', fieldConfigOther.entityClass)
            // console.log('other entityClassTargetProp', fieldConfigOther.entityClassTargetProp)
            if (fieldConfigOther.entityClass === entityClass && entityClassTargetProp !== 'id' && entityClassTargetProp !== 'code') {
              const fieldNameOther = fieldConfigOther.fieldName
              this.entityInner[fieldNameOther] = option[entityClassTargetProp]
            }
          }
        }
      }
    }
  }
}
</script>
