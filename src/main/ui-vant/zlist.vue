<template>
  <van-list
      v-model="loading"
      :finished="finished"
      @load="getPage"
  >
    <template v-for="(item,index) in list">
      <!--      :key="index" -->
      <slot :item="item" :index="index">
        <van-cell :key="index" :title="item.title"/>
      </slot>
    </template>
  </van-list>
</template>

<script>
export default {
  name: 'zlist',
  props: {
    entityName: {},
    pageUrl: {},
    pageParams: {},
  },
  data() {
    return {
      pageUrlInner: null,
      pageParamsInner: {
        pageSize: 10,      // 每页数据条数
        curPage: 1         // 当前页码
      },
      list: [],
      loading: false,
      finished: false,   // 是否已加载完所有数据
    };
  },
  watch: {
    pageParams: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.pageParamsInner = {...this.pageParamsInner, ...this.pageParams}
        })
      },
      deep: true
    },
  },
  created() {
    this.pageUrlInner = this.pageUrl || `/commonData/selectPage/${this.entityName}`
    this.pageParamsInner = {...this.pageParamsInner, ...this.pageParams}
    this.reload()
  },
  methods: {
    async reload() {
      this.list = []
      this.pageParamsInner.curPage = 1
      this.getPage()
    },
    async getPage() {
      if (this.loading) {
        return
      }
      this.loading = true
      console.log('this.pageParamsInner', this.pageParamsInner)
      const page = await $$get(this.pageUrlInner, this.pageParamsInner)
      // 获取数据
      const data = page.records
      const total = parseFloat(page.total)
      // this.list = [...this.list, ...data];
      this.$emit('getPageList', data)

      // 更新列表数据
      this.list = this.list.concat(data);

      // 更新页码
      this.pageParamsInner.curPage++;

      // 根据实际情况更新 finished 的值，判断是否加载完所有数据
      this.finished = (this.pageParamsInner.curPage * this.pageParamsInner.pageSize) > total;  // 假设总共有30条数据

      this.loading = false
      console.log('after page loading', this.loading)
      console.log('after page finished', this.finished)
    },
  }
};
</script>
