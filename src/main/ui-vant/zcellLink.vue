<template>
  <div>
    <template v-for="data in datas">
      <van-cell :key="data.id" :title="$t(data.title)" :to="data.url" :icon="data.pic" is-link>
        <template #icon>
          <slot name="icon">
            <banner-icon class="ml-2 mr-2" :banner="data"></banner-icon>
          </slot>
        </template>
      </van-cell>
    </template>
  </div>
</template>

<script>

import mixinScope from "../js/mixin/MixinScope";
import BannerIcon from "../ui-vant/bannerIcon.vue";

export default {
  name: 'zcellLink',
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
