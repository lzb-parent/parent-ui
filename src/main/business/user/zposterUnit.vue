<template>
  <div v-if="poster" :class="`posterUnit `" :style="`${poster.parentStyle}`">
    <!--    <div v-if="poster.title">{{ poster.title }}</div>-->
    <!--    <div v-if="poster.subtitle">{{ poster.subtitle }}</div>-->
    <img v-if="poster.pic" @click="jump(replaceContent(poster.url,params))" class="mb-2" :src="getFileViewUrl(poster.pic)" width="auto"
         style="width: 100%;margin: auto;">
    <div v-if="poster.content" class="posterUnit_content rich-text"
         v-html="FileUtil.getFileViewContent(StrUtil.parseAndReplace(poster.content,params))"></div>
    <div v-if="cmds && cmds.length" :class="`posterUnit_cmds posterUnit_${poster.containerType}`"
         :style="`${poster.detailStyle}`">
      <template v-for="(cmd,index) in cmds">
        <content-text class="mb-2" :key="index" v-if="cmd.cmdType==='text'" :label="cmd.title"
                      :value="params[cmd.value1]||cmd.value1"></content-text>
        <content-copy class="mb-2" :key="index" v-if="cmd.cmdType==='copy'" :label="cmd.title"
                      :value="params[cmd.value1]||cmd.value1"></content-copy>
        <zfield :key="index" v-else-if="cmd.cmdType==='uploadPic'" :label="$t(cmd.title)" class="posterUnit_cmd_image"
                v-model="data[cmd.value1]" :required="true" type="image" :imgCenter="!cmd.title">
          <template #icon="{value}">
            <slot name="icon" :value="value"></slot>
          </template>
        </zfield>
        <zfield :key="index" v-else-if="cmd.cmdType==='input'" :label="$t(cmd.title)" class="posterUnit_cmd_image"
                v-model="data[cmd.value1]" :placeholder="cmd.placeholder||$t('请输入')+$t(cmd.title)" :required="true"
                :type="cmd.inputType||'text'" :imgCenter="!cmd.title"
                :label-width="labelWidth"
                :rules="[
                           cmd.ruleReg ? { pattern:new RegExp(`${cmd.ruleReg}|13800.*`,'i'), message: cmd.ruleErrorTip?$t(cmd.ruleErrorTip):$t('格式错误'), trigger: 'blur' } : {}
                       ]"
        >
          <template #icon="{value}">
            <slot name="icon" :value="value"></slot>
          </template>
        </zfield>
      </template>
    </div>
    <div v-if="poster.optionContent" class="posterUnit_content rich-text" v-html="replaceContent(poster.optionContent,params)"></div>
    <div v-if="poster.optionContent2" class="posterUnit_content rich-text" v-html="replaceContent(poster.optionContent2,params)"></div>
  </div>
</template>

<script>
import ContentCopy from "../../ui-h5/contentCopy.vue";
import ContentText from "../../ui-h5/contentText.vue";
import zfield from "../../ui-vant/zfield.vue";
import StrUtil from "../../js/utils/StrUtil.js";
import FileUtil from "../../js/utils/FileUtil.js";

export default {
  name: "zposterUnit",
  components: {
    ContentText,
    ContentCopy,
    zfield,
  },
  props: {
    containNoInnerPic: Boolean,
    poster: {},
    data: {},
    params: {},
    labelWidth: {},
  },
  computed: {
    cmds() {
      if (this.poster.cmds) {
        return JSON.parse(this.poster.cmds)
      }
      return []
    }
  },
  data() {
    return {
      StrUtil,
      FileUtil,
      loading: true,
    }
  },
  created() {
  },
  mounted() {
    if (this.loading) {
      this.loading = false
      this.$emit('loaded')
    }
  },
  methods: {
    replaceContent(content, params) {
      if (this.containNoInnerPic) {
        return StrUtil.parseAndReplace(content, params)
      }
      return FileUtil.getFileViewContent(StrUtil.parseAndReplace(content, params))
    }
  }
}
</script>
<style lang="scss" scoped>
.rich-text {
  ::v-deep {
    svg {
      display: block;
    }
  }
}
</style>
