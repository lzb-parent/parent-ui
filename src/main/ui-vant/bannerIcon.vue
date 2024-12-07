<template>
  <div v-if="banner.pic" class="bannerIcon">
    <img :src="getFileViewUrl(banner.pic)" style="width: 1rem;">
  </div>
  <div class="bannerIcon" v-else-if="banner.icon">
    <van-icon v-if="vanIcon" :name="banner.icon"/>
    <svg-icon v-if="svgIcon" :icon-class="banner.icon"/>
  </div>
</template>

<script>


export default {
  name: 'bannerIcon',
  props: {
    banner: {},
    vanIcon: {default: () => false},
    svgIcon: {default: () => true},
  },
}
</script>
