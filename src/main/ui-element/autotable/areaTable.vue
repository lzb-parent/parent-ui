<template>
  <div>
    <!--    tableConfigUnit={{tableConfigUnit}}-->
    <!--    tableConfig={{tableConfig['is-edit']}}-->
    <el-table
      :size="tableConfig.size"
      ref="table"
      v-loading="pageLoading"
      :is-edit="false"
      v-bind="{...$attrs,...tableConfig}"
      :data="pageResponse.records"
      :header-cell-style="handleTheadStyle"
      highlight-current-row
      @sort="handleChangeSort"
      @sort-change="handleChangeSort"
      :border="ObjectUtil.isEmpty(tableConfig.border)?true:tableConfig.border"
    >
      <el-table-column v-if="tableColumnPrependCfg" v-bind="tableColumnPrependCfg">
        <template slot-scope="scope">
          <slot name="tableColumnPrepend" v-bind="scope"/>
        </template>
      </el-table-column>
      <template v-for="(fieldNames,indexGroup) in fieldNamesGroupBy">
        <el-table-column
          v-if="indexGroup"
          :key="'indexGroup_'+ indexGroup"
          :prop="fieldNames[0]"
          :label="indexGroup"
          :sortable="(['number', 'datetime'].includes(getFieldConfig(fieldName).uiType) || getFieldConfig(fieldName).sortable)?'custom':null"
          :width="getGroup(indexGroup).width || 230"
          :show-overflow-tooltip="getFieldConfig(fieldNames[0]).mainLength>400"
        >
          <template slot-scope="scope">
            <div :key="indexGroup">
              <template v-for="(fieldName,index) in fieldNames">
                <template v-if="true !== getFieldConfig(fieldName).hide && ObjectUtil.noEmpty(scope.row[fieldName])">
                  <div :key="indexGroup+'_'+index" class="areaTableColumnField">
                    <div>{{ getFieldConfig(fieldName).label }}</div>
                    <div>
                      <baseField
                        :key="`tableColumn_field_${indexGroup}_${fieldName}`"
                        v-model="scope.row[fieldName]"
                        :area="area"
                        :is-edit="hasPerm(tableConfig.tableName,'update')&&isEdit(fieldName)"
                        :entity.sync="scope.row"
                        :table-config="tableConfig"
                        :field-config="getFieldConfig(fieldName)"
                        @change="isEdit(fieldName)?saveOrUpdate(scope.row,fieldName):null"
                      />
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </el-table-column>
        <template v-else>
          <template v-for="fieldName in fieldNames">
            <el-table-column
              :key="`tableColumn_${fieldName}`"
              :prop="fieldName"
              :label="getFieldConfig(fieldName).label"
              :width="getFieldConfig(fieldName).width"
              :align="getFieldConfig(fieldName).align"
              :sortable="(['number', 'datetime'].includes(getFieldConfig(fieldName).uiType) || getFieldConfig(fieldName).sortable)?'custom':null"
              :show-overflow-tooltip="getFieldConfig(fieldName).mainLength>400"
            >
              <template slot-scope="scope">
                <!--                {{scope.row}}-->
                <baseField
                  :key="`tableColumn_${fieldName}`"
                  v-model="scope.row[fieldName]"
                  :area="area"
                  :is-edit="hasPerm(tableConfig.tableName,'update')&&isEdit(fieldName)"
                  :entity.sync="scope.row"
                  :table-config="tableConfig"
                  :field-config="getFieldConfig(fieldName)"
                  @change="isEdit(fieldName)?saveOrUpdate(scope.row,fieldName):null"
                />
              </template>
            </el-table-column>
          </template>
        </template>
      </template>
      <el-table-column v-if="tableColumnAppendCfg" v-bind="tableColumnAppendCfg">
        <template slot-scope="scope">
          <slot name="tableColumnAppend" :scope="scope"/>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasPerm(`${tableConfig.tableName}`,'insert') || hasPerm(`${tableConfig.tableName}`,'update') || hasPerm(`${tableConfig.tableName}`,'delete')"
        :label="$t('操作')"
        :width="tableConfig.opt.size || 210"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <slot name="tableOptionPrepend" v-bind="scope"/>
          <el-button-group>
            <el-button
              v-if="adminButtons.includes('edit') && hasPerm(`${tableConfig.tableName}`,'update') && tableConfig.filterButton('update', scope)"
              :size="tableConfig.size"
              @click="handleUpdate(scope.row)"
            >{{$t('编辑')}}
            </el-button>
            <el-button
              v-if="adminButtons.includes('copy') && hasPerm(`${tableConfig.tableName}`,'insert') && tableConfig.filterButton('copy', scope)"
              :size="tableConfig.size"
              type="primary"
              plain
              @click="handleUpdate({...scope.row,id:null,createTime:null,updateTime:null},Option.insert)"
            >{{$t('复制')}}
            </el-button>
            <el-button
              v-if="adminButtons.includes('delete') && hasPerm(`${tableConfig.tableName}`,'delete') && tableConfig.filterButton('delete', scope)"
              :size="tableConfig.size"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{$t('删除')}}
            </el-button>
          </el-button-group>
          <slot name="tableOptionAppend" v-bind="scope" />
<!--          {{Object.keys(getFieldConfig('lastOrderState')['_listeners'])}}-->
        </template>
      </el-table-column>
      <el-table-column
        v-else
        :label="$t('操作')"
        width="210"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
            <slot name="tableOptionAppend" v-bind="scope" />
        </template>
      </el-table-column>
      <!--      </slot>-->
    </el-table>
    <el-pagination
        v-if="!tableConfig.page.hide"
      class="pa-4 mt-2"
      :total="parseInt(pageResponse.total)"
      :current-page.sync="pageRequestParams.curPage"
      :page-size.sync="pageRequestParams.pageSize"
      :page-sizes="pageRequestParams.pageSizes || [10,20,50,100,500]"
      align="center"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="getPage"
      @current-change="getPage"
    />
  </div>
</template>

<script>

import { Areas, Option } from './area.js'
import area from './area.js'
import ObjectUtil from '../../../main/js/utils/ObjectUtil'

export default {
  name: 'AreaTable',
  extends: area,
  props: {
    pageParams: {},
    tableColumnPrependCfg:{},
    tableColumnAppendCfg:{},
  },
  data() {
    return {
      Option,
      area: Areas.table,
      pageLoading: false,
      sortMap: {},
      pageRequestParams: {
        curPage: 1,
        pageSize: 10
      },
      pageResponse: {
        total: 0,
        records: []
      }
    }
  },
  computed: {
    ObjectUtil() {
      return ObjectUtil
    }
  },
  watch: {
    pageParams: {
      handler(newVal, oldVal) {
        this.pageRequestParams = { ...this.pageRequestParams, ...newVal }
      },
      deep: true
    }
  },
  created() {
    this.pageRequestParams = { ...this.pageRequestParams, ...this.pageParams }
    this.getPage()
  },
  methods: {
    isEdit(fieldName) {
      return this.getFieldConfig(fieldName).uiType === 'bool' && !this.getFieldConfig(fieldName).disabled
    },
    async getPage(obj) {
      if (obj) {
        this.pageRequestParams = { ...this.pageRequestParams, ...obj }
      }
      this.pageRequestParams.orders = Object.entries(this.sortMap).filter(([key, value]) => value).map(([key, value]) => ({
        column: key,
        asc: value === 'ascending'
      }))
      this.pageLoading = true
      const getPageUrl = this.tableConfig['getPageUrl']
      const afterPage = this.tableConfig.afterPage
      // this.pageResponse.records = []
      this.$nextTick(async() => {
        let page = await $$get(getPageUrl, this.pageRequestParams)
        if (afterPage) {
          page = afterPage(page)
        }
        this.pageResponse = page
        await this.$emit('getPage', this.pageResponse)
        this.$nextTick(async() => {
          this.pageLoading = false
        })
      })
    },
    /**
     * 设置表头排序
     */
    handleTheadStyle({ row, column, rowIndex, columnIndex }) {
      const props = Object.keys(this.sortMap)
      for (const prop of props) {
        if (prop === column.property) {
          column.order = this.sortMap[prop]
        }
      }
    },
    handleChangeSort(e) {
      if (e.order) {
        this.sortMap[e.prop] = e.order
      } else {
        delete this.sortMap[e.prop]
      }
      this.getPage()
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('确认删除')} ${this.tableConfig.label}?`, this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const option = Option.delete
        const url = this.tableConfig[option + 'Url']
        $$post(url, { id: row.id }).then(() => {
          this.$message.success(this.$t('删除成功'))
          this.getPage()
          this.$store.dispatch('clearDataMapEntity', [this.tableConfig.tableName])
        })
      })
    },
    handleUpdate(row, option = Option.update) {
      this.$emit('showForm',
        {
          option: option,
          entity: { ...row }
        }
      )
    },
    saveOrUpdate(entity, propName) {
      if (this.pageLoading) {
        return
      }
      // // $a.b再加左括号,会velocity模板语法错误
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      this.$nextTick(() => {
        const url = this.tableConfig['updateUrl']
        const id = entity.id
        const propValue = entity[propName]
        const update = { id }
        update[propName] = propValue
        $$post(url, update).then(() => {
          this.$message.success(this.$t('保存成功'))
          this.$store.dispatch('clearDataMapEntity', [this.tableConfig.tableName])
        })
      })
    },
    async saveOrUpdateFun(entity) {
      const url = this.tableConfig[this.formDataOption === Option.insert ? 'insertUrl' : 'updateUrl']
      return $$post(url, entity)
    },
  }
}
</script>
