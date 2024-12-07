<template>
  <div class="contentCopy">
    <span class="mr-2"><span v-if="label">{{ $t(label) }}：</span><span :class="`${true?'text-primary':'text-white'}`">{{ value }}</span></span>
<!--    <i :class="`fa-solid fa-copy copy ${true?'text-primary':'text-white'}`" v-clipboard:copy="value" v-clipboard:success="onCopySuccess" style=""></i>-->
    <div class="contentCopy_icon"  v-clipboard:copy="value" v-clipboard:success="onCopySuccess">
      {{$t('复制')}}
      <svg-icon class="" icon-class="copy" />
    </div>
  </div>
</template>

<script>

export default {
  name: "contentCopy",
  props: {
    label: { },
    value: { },
  },
  components: {},
  computed: {},
  data() {
    return {}
  },
  created() {

  },
  methods: {
    onCopySuccess() {
     this.$dialog.alert({
       message: this.$t('复制成功'),
     })
   },
  }
}
</script>
<style lang="scss" scoped>
</style>
