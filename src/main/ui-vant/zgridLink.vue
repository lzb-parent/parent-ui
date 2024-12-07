<template>
  <van-grid
      class="align-start"
      v-if="size"
      :column-num="Math.min(size,sizeMax)"
      :border="false"
  >
    <template v-for="banner in datas">
      <van-grid-item :key="banner.id" @click="jump(banner.url)">
        <div :key="banner.id" class="full-width d-flex flex-column align-center" :style="banner.style">
          <slot name="icon">
            <banner-icon :banner="banner"></banner-icon>
          </slot>
          <div v-if="banner.title" class="mt-2 item-title">{{ $t(banner.title) }}</div>
        </div>
      </van-grid-item>
    </template>
  </van-grid>
</template>

<script>

import mixinScope from "../js/mixin/MixinScope";
import BannerIcon from "../ui-vant/bannerIcon.vue";

export default {
  name: 'zgridLink',
  computed: {
    size() {
      return this.datas && this.datas.length
    }
  },
  mixins: [mixinScope],
  components: {BannerIcon},
  props: {
    datas: {},
    sizeMax: {default:4},
  },
}
</script>
