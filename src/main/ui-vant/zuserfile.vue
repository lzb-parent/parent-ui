<template>
  <video :id="innerId" @play="playVideo" v-if="videoTypes.indexOf(fileType)>=0" class="video-js vjs-default-skin" controls="false" preload="none" x5-playsinline="" webkit-playsinline="" playsinline="" :poster="getFileViewUrl(poster)" :muted="autoPlay?true:null" :autoplay="autoPlay?true:null" style="width: 100%; height: 100%; align-content: center;">
    <source :src="getFileViewUrl(value)">
  </video>
  <img v-else :src="getFileViewUrl(value)" v-bind="$attrs" style="width: 100%;display: block;"/>
</template>
<script>
import mixin_div from '@/mixin/mixin_div'

export default {
  name: 'Zuserfile',
  mixins: [mixin_div],
  props: {
    innerId: {},
    poster: {},
    autoPlay: {type: Boolean},
  },
  data() {
    return {
      videoTypes: ['avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', 'rm', '3gp', 'vob','AVI', 'WMV', 'MPEG', 'MP4', 'M4V', 'MOV', 'ASF', 'FLV', 'F4V', 'RMVB', 'RM', '3GP', 'VOB']
    }
  },
  watch: {},
  computed: {
    fileType() {
      if (this.value) {
        let index = this.value.lastIndexOf(".");
        if (index >= 0) {
          return this.value.substring(index + 1)
        }
      }
    },
  },
  created() {
  },
  methods: {
    playVideo() {
      // console.log('playVideo')
      // if (this.videoTypes.indexOf(this.fileType) >= 0) {
        this.$emit('playVideo');
      // }
    }
  }
}
</script>
<style scoped>
</style>
