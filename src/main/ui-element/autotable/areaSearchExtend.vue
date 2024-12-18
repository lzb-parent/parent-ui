<template>
  <el-checkbox v-if="!showExtend" v-model="showExtend" class="pa-2" @change="(newVal)=>newVal?null:scope.value=[]">{{$t('扩展条件')}}</el-checkbox>
  <div v-else class="pa-2" style="max-width: 600px;">
    <el-checkbox v-model="showExtend" @change="(newVal)=>newVal?null:scope.value=[]">{{$t('扩展条件')}}</el-checkbox>
    <el-button
        v-if="showExtend"
        class="ml-2"
        size="mini"
        type="primary"
        plain
        icon="el-icon-add"
        @click="()=>{ scope.value.push({
        propName:null,
        opt:null,
        values:null,
      }) }"
    >{{$t('添加')}}
    </el-button>
    <el-table
        v-if="showExtend"
        class=""
        :is-edit="true"
        :data="scope.value"
        highlight-current-row
    >
      <el-table-column
          :label="$t('属性名')"
          prop="username"
          align="center"
          :width="190"
      >
        <template slot-scope="scope">
          <zselect
              size="mini"
              v-model="scope.row.propName"
              :dict-list="fieldNames.map(n=>{return {...fieldConfigMap[n],disabled:false}})"
              list-code="fieldName"
              list-label="label"
              w="170"
          />
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('条件')"
          prop="username"
          align="center"
          :width="130"
      >
        <template slot-scope="scope">
          <zselect size="mini" v-model="scope.row.opt" classname="WhereOptEnum" w="100"/>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('数值')"
          prop="username"
          align="center"
          :width="120"
      >
        <template slot-scope="scope">
          <zinput size="mini" v-model="scope.row.values" w="100"/>
        </template>
      </el-table-column>
      <el-table-column
          :label="$t('操作')"
          prop="username"
          align="center"
          :width="90"
      >
        <template slot-scope="scopeInner">
          <i class="el-icon-delete" @click="scope.value.splice(scopeInner.$index, 1)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MixinScope from '../../js/mixin/MixinScope'
import area from './area.js'
import {Areas} from './area.js'
import zselect from '../../ui-element/zselect'
import Zinput from '../../../main/ui-element/zinput.vue'

export default {
  name: 'AreaSearchExtend',
  components: {
    Zinput,
    zselect,
  },
  extends: area,
  mixins: [MixinScope],
  props: {},
  data() {
    return {
      area: Areas.table,
      showExtend: false,
      scope: {
        value: [],
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  methods: {}
}
</script>
