<template>
  <van-tabbar class="ztabbar" route placeholder safe-area-inset-bottom fixed>
    <template v-for="banner in datas">
      <van-tabbar-item :key="banner.id" replace :to="banner.url" :icon="banner.icon">
        {{ $t(banner.title) }}
        <template #icon>
<!--          {{banner.icon}}-->
<!--          <svg-icon :icon-class="'home'" class="ft-22 text-secondary"/>-->
          <banner-icon :banner="banner"></banner-icon>
        </template>
      </van-tabbar-item>
    </template>
  </van-tabbar>
</template>
<script>

import mixinScope from "../js/mixin/MixinScope";
import BannerIcon from "../ui-vant/bannerIcon.vue";

export default {
  name: 'ztabbar',
  computed: {
    size() {
      return this.datas && this.datas.length
    }
  },
  mixins: [mixinScope],
  components: {BannerIcon},
  props: {
    datas: {}
  },
}
</script>
