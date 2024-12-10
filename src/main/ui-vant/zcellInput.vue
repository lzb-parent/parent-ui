<template>
  <van-cell v-if="!computedIsEdit(true)" v-bind="{...$attrs,...$slots}">
<!--    <div class="text-primary">{{ scope.value }}</div>-->

<!--    default	自定义右侧 value 的内容-->
<!--    title	自定义左侧 title 的内容-->
<!--    label	自定义标题下方 label 的内容-->
<!--    icon	自定义左侧图标-->
<!--    right-icon	自定义右侧按钮，默认为arrow-->
<!--    extra	自定义单元格最右侧的额外内容-->
  </van-cell>
</template>

<script>
import MixinScope from "../../main/js/mixin/MixinScope";
import MixinDiv from "../../main/js/mixin/MixinDiv";

export default {
  name: "zcellInput",
  mixins: [MixinScope, MixinDiv],
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {
  },
  created() {
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
::v-deep {
  .van-field__body {
    justify-content: center;
  }

  .van-uploader__upload {
    margin: initial;
    //width: 100%;
    //height: auto;
  }

  .van-field__control {
    //justify-content: center;
  }

  .imgCenter {
    margin: auto;
  }

  //.van-uploader__preview-image{
  //  width: initial;
  //  height: initial;
  //}
}
</style>
