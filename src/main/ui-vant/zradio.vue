<template>
  <div class="zradio">
    <div v-if="title" :class="`zradioTitle ${titleClass}`">{{ title }}</div>
<!--    <van-row>-->
      <van-radio-group v-model="scope.value" v-bind="{...$attrs,...$props}" @change="(p1,p2)=>{$emit('change',p1,p2)}">
        <van-row class="van-radios full-width" :column-num="Math.min(size,4)" center>
          <template v-for="(data,index) in datas">
            <!--              <van-grid-item :key="index">-->
            <van-col class="pa-1 flex-column" :key="index" :span="span">
              <van-radio v-bind="{...$attrs,...$props}" :name="getKey(data)"
                         :class="`van-radio full-width ${getKey(scope.value)===getKey(data)?'checked':''}`"
                         style="margin-bottom: 0; margin-right: 0">

                <template #default>
                  {{ $t(getLabel(data)) }}
                </template>
                <template #icon="{checked}">
                  <svg-icon v-if="getKey(scope.value)===getKey(data)" class="ft-22" icon-class="circle_main"/>
                  <svg-icon v-else class="ft-22" icon-class="circle"/>
                </template>
              </van-radio>
            </van-col>
            <!--              </van-grid-item>-->
          </template>
        </van-row>
      </van-radio-group>
<!--    </van-row>-->
  </div>
</template>
<script>

import mixinScope from "../js/mixin/MixinScope";

export default {
  name: 'zradio',
  computed: {
    size() {
      return this.datas && this.datas.length
    },
  },
  mixins: [mixinScope],
  components: {},
  props: {
    span: {default: 12},
    titleClass: {default: ''},
    labelPosition: {default: 'left'},
    title: {},
    datas: {},
    keyProp: {default: ''},
    labelProp: {default: 'name'},
    selectFirst: {},
    keyFun: {
      default() {
        return d => null
      }
    },
    labelFun: {
      default() {
        return d => null
      }
    },
  },
  data() {
    return {
      dataMap: {},
    }
  },
  created() {
    if (!this.value && (this.size === 1 || (this.size > 1 && this.selectFirst))) {
      this.scope.value = this.datas[0]
    }
  },
  methods: {
    $load() {
      for (let data of this.datas) {
        this.dataMap[this.getKey(data)] = data
      }
    },
    // 重写内外部值转换方法
    $inToOutFun(inside) {
      return this.getKey(inside)
    },
    $outToInFun(outside) {
      return this.dataMap[outside]
    },
    getKey(data) {
      return data && (this.keyFun(data) || data[this.keyProp] || data)
    },
    getLabel(data) {
      return this.labelFun(data) || data[this.labelProp]
    },


  }
}
</script>
