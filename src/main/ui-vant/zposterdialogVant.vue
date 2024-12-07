<template>
  <div v-if="poster" class="zposterdialog">
    <slot :datas="poster">
      <!--      <span v-if="poster" @click="showInner = true">{{poster.title}}</span>-->
    </slot>
    <van-overlay :show="showLoading">
      <div class="wrapper" @click.stop>
        <van-loading/>
      </div>
    </van-overlay>
    <van-dialog
        v-if="poster && showInner"
        v-model="showInner"
        :title="poster.title"
        :class="`zposterdialog poster-dialog  ${poster.cancelButtonUrl?'cancelButtonPrimary':''} ${poster.overflowFlag?'overflowContent':''}`"
        :close-on-click-overlay="1000000!==poster.closeDelaySecond"
        :close="()=>showInner = false"
        allow-html
        :theme="poster.parentStyle?'round-button':null"
        :show-confirm-button="!!poster.confirmButtonText"
        :show-cancel-button="!!poster.cancelButtonText || poster.noReminder"
        :confirm-button-text="$t && $t(poster.confirmButtonText)"
        :cancel-button-text="$t && $t(poster.cancelButtonText)"
        :style="poster.parentStyle"
        :before-close="close"
        @dialog-message-max-height="'200vh'"
        @confirm="jump(StrUtil.parseAndReplace(poster.url||poster.confirmButtonUrl,datas))"
        @cancel="poster.noReminder?setNoReminder(poster.id):jump(poster.cancelButtonUrl)"
        getContainer="#app"
    >
      <template #default>
        <div class="pa-2 rich-text"
             v-html="FileUtil.getFileViewContent(StrUtil.parseAndReplace(poster.content,{...datas})) "/>
        <slot name="contentEnd"></slot>
      </template>
    </van-dialog>
  </div>
</template>

<script>

import StrUtil from "../js/utils/StrUtil";
import FileUtil from "../js/utils/FileUtil";
import RequestUtil from "../js/utils/RequestUtil";

export default {
  name: 'zposterdialogVant',
  computed: {
  },
  components: {},
  props: {
    show: {default: true},
    posterCode: {},
    datas: {},
    confirmFun: {},
  },
  data() {
    return {
      showLoading: false,
      showInner: false,
      poster: null,
      FileUtil,
      RequestUtil,
      StrUtil,
    }
  },
  watch: {
    showInner(val) {
      this.$emit('update:show', val)
    },
    posterCode(val) {
      this.init()
    },
  },
  async created() {
    this.init()
  },
  methods: {
    async init() {
      console.log('zposterdialogVant posterCode', this.posterCode)
      this.poster = await this.getPoster(this.posterCode)
      if (this.poster && this.show) {
        const anyone = this.poster.delaySecondStart || this.poster.delaySecondEnd
        if (anyone) {
          let time = anyone
          if (this.poster.delaySecondStart && this.poster.delaySecondEnd) {
            time = Math.random() * (this.poster.delaySecondEnd - this.poster.delaySecondStart) + this.poster.delaySecondStart
          }
          this.showLoading = true
          setTimeout(() => {
            this.showLoading = false
            this.showInner = true
          }, time * 1000)
        } else {
          this.showInner = true
        }
      } else {
        this.$emit('posterNoConfig')
      }
      if (this.poster && this.poster.id) {
        this.$emit('posterConfig', this.poster)
      }
    },
    async getPoster(code) {
      return await RequestUtil.$$get(`/commonData/selectOne/poster`,{code})
    },
    async close(action, done) {
      if (this.confirmFun) {
        let flag = await this.confirmFun();
        if (!flag) {
          done(false)
          return
        }
      }
      if (action === 'overlay') {
        done()
      } else if (action === 'confirm') {
        this.$emit('confirm')
        const url = this.poster.confirmButtonUrl
        if (url) {
          if (url.indexOf('http') === 0) {
            window.open(url)
          } else {
            // this.jump(customerUrl)
            this.$router.push({path: url})
          }
        }
        done(true)
      } else if (action === 'cancel') {
        const url = this.poster.cancelButtonUrl
        if (url) {
          if (url.indexOf('http') === 0) {
            window.open(url)
          } else {
            this.$router.push({path: url})
          }
        }
        done(true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .van-dialog__header {
    padding: 16px;

  }

  .van-dialog__footer {
    //border-radius: 16px;
    //padding: 16px !important;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.zposterdialog {
  //.overflowContent ::v-deep .van-dialog__content {
  //  overflow: visible;
  //}
  //.poster-dialog{
  //  overflow: visible;
  //}
  //
  //::v-deep .van-dialog__content {
  //  overflow-y: scroll;
  //}
  //::v-deep .van-dialog__footer{
  //  position: relative; margin-top: auto;
  //}
}
</style>
