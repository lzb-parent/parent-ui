<template>
  <van-swipe ref="zswipe" v-if="datasInner.length" class="my-swipe" :autoplay="autoplay">
    <van-swipe-item v-for="(item, index) in datasInner" :key="index">
      <zuserfile v-if="item.pic" :key="item.pic" v-model="item.pic" @click.native="jump(item.url)"
                 :autoPlay="item.autoPlay" :poster="item.picSelect"></zuserfile>
      <div v-if="item.content" :key="item.id"
           v-html="FileUtil.getFileViewContent(StrUtil.parseAndReplace(item.content,{}))"></div>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import StrUtil from "../js/utils/StrUtil";
import FileUtil from "../js/utils/FileUtil";
import Zuserfile from "../../main/ui-vant/zuserfile.vue";

export default {
  name: 'zswipe',
  components: {Zuserfile},
  computed: {},
  props: {
    show: {},
    datas: {},
    pics: {},
    autoplay: {
      default() {
        return 3000
      }
    },
  },
  watch: {
    datas: {
      handler(newVal, oldVal) {
        this.datasInner = newVal || []
      },
      deep: true
    },
    show(newVal) {
      if (newVal && this.$refs.zswipe) {
        this.$nextTick(() => {
          this.$refs.zswipe.resize()
        })
      }
    }
  },
  data() {
    return {
      // 开始转动的角度
      startRotateDegree: 0,
      rotateAngle: 0,
      rotateTransition: '',
      StrUtil,
      FileUtil,
      datasInner: [],
    }
  },
  created() {
    let list = this.datas || [];
    if (list.length === 0 && this.pics) {
      list = this.pics.map(pic => {
        return {pic}
      }) || []
    }
    this.datasInner = list
  },
  methods:{
    resize(){
      this.$refs.zswipe.resize();
    }
  }
}
</script>
