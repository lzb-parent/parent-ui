<template>
  <div v-if="!tableConfig.hide" class="areaSearch" v-bind="tableConfig">
    <slot name="before" />
    <template v-if="adminButtons.includes('query') && hasPerm(`${tableConfig.tableName}`,'selectPage')">
      <template v-for="(fieldName,index) in fieldNames">
        <template v-if="true !== getFieldConfig(fieldName).hide">
          <!--        ObjectUtil.or(getFieldConfig(fieldName).javaTypeEnumClassMultiple, true)-->
          <baseField
            :key="`areaSearch_${fieldName}`"
            v-model="pageParamsInner[fieldName]"
            :table-config="tableConfig"
            :field-config="getFieldConfig(fieldName)"
            :entity.sync="pageParamsInner"
            :area="area"
            :params="getFieldConfig(fieldName).uiType==='select'?{javaTypeEnumClassMultiple : true,valuePrefix:'#in#',disabled:false,defaultFirst:false}:{defaultFirst:false,disabled:false}"
            @keyup.enter.native="$emit('getPage',{curPage:1})"
          />
        </template>
      </template>
    </template>
    <slot name="after" />
    <zdatepicker2 :valueFormat="tableConfig.startEndValueFormat" :defaultTime="tableConfig.startEndDefaultTime" v-if="adminButtons.includes('query') && hasPerm(`${tableConfig.tableName}`,'selectPage')" size="small" :start.sync="pageParamsInner.start" :end.sync="pageParamsInner.end" />
    <el-checkbox v-if="tableConfig.showTableColumnNoGroup" v-model="pageParamsInner.showTableColumnNoGroup" class="ml-4">{{$t('平铺排序')}}</el-checkbox>
    <area-search-extend
        style="margin-right: 20px;"
      v-model="pageParamsInner.whereDataUnits"
      :default-value="[]"
      :table-config-unit="tableConfigUnit"
    />
    <slot name="buttonBefore" />
    <el-button
      v-if="adminButtons.includes('query') && hasPerm(`${tableConfig.tableName}`,'selectPage')"
      size="small"
      type="primary"
      icon="el-icon-search"
      @click="$emit('getPage',{curPage:1})"
    >{{$t('查询')}}
    </el-button>
    <el-button
      v-if="adminButtons.includes('add') && hasPerm(`${tableConfig.tableName}`,'insert')"
      size="small"
      type="primary"
      icon="el-icon-plus"
      @click="()=>$emit('showForm',{entity:{},option:Option.insert})"
    >{{$t('添加')}}
    </el-button>
    <el-button
      v-if="adminButtons.includes('export') && hasPerm(`${tableConfig.tableName}`,'export')"
      size="small"
      type="warning"
      icon="el-icon-export"
      @click="handleExport"
    >{{$t('导出')}}
    </el-button>
    <slot name="buttonAfter" />
  </div>
</template>

<script>
import area from './area.js'
import { Areas, Option } from './area.js'
import AreaSearchExtend from './areaSearchExtend.vue'
import zdatepicker2 from '../../ui-element/zdatepicker2.vue'
import ObjectUtil from '../../../main/js/utils/ObjectUtil'
import * as axios from '@/axios/request'

export default {
  name: 'AreaSearch',
  components: { AreaSearchExtend, zdatepicker2 },
  extends: area,
  props: {
    pageParams: {}
  },
  data() {
    return {
      area: Areas.search,
      pageParamsInner: this.pageParams,
      Option,
      ObjectUtil,
    }
  },
  computed: {},
  watch: {
    pageParamsInner: {
      handler(newVal) {
        // console.log('areaSearch pageParamsInner', this.pageParamsInner)
        this.$emit('update:pageParams', newVal)
      },
      deep: true
    },
    pageParams: {
      handler(newVal) {
        this.pageParamsInner = newVal
        // console.log('areaSearch pageParams', this.pageParamsInner)
        // for (const key of Object.keys(newVal)) {
        //   this.$set(this.pageParamsInner, key, newVal[key])
        // }
      },
      deep: true
    },
  },
  created() {
    // this.pageParams
  },
  methods: {
    handleExport() {
      const option = 'export'
      const url = this.tableConfig[option + 'Url']
      // window.open(url)
      //     , { responseType: 'blob' }
      axios.get(url)
        .then(response => {
          // console.log('response', response)
          const blob = new Blob([response.data], { type: response.headers['content-type'] })
          const fileName = (response.headers['content-disposition'] || 'filename=exported_file.csv')
            .split('filename=')[1]
            .replace(/"/g, '')

          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = decodeURIComponent(fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(link.href)
        })
        .catch(error => console.error('Error downloading file:', error))
    }
  }
}
</script>
