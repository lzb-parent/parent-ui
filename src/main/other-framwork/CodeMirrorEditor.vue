<template>
  <div ref="editor" :style="editorStyle"></div>
<!--  <div v-else>{{value}}</div>-->
</template>

<script>
import mixinDiv from "../../main/js/mixin/MixinDiv";

export default {
  name: "CodeMirrorEditor",
  components: {},
  mixins: [mixinDiv],
  props: {
    value: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      // default: "400px",
    },
    readOnly: {
      // type: String,
      // default: "400px",
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  computed: {
    editorStyle() {
      return {
        // height: this.height,
        height: this.height,
        width: "100%",
      };
    },
  },
  watch: {
    value(newValue) {
      // 如果内容发生变化，更新 CodeMirror 编辑器的内容
      if (this.editor && this.editor.getValue() !== newValue) {
        this.editor.setValue(newValue);
      }
    },
  },
  mounted() {
    this.initCodeMirror();
  },
  beforeDestroy() {
    // if (this.editor) {
      // this.editor.toTextArea(); // Clean up
    // }
  },
  methods: {
    initCodeMirror() {
      this.editor = CodeMirror(this.$refs.editor, {
        value: this.value,
        mode: "xml", // 设置为 XML 模式
        lineNumbers: true,
        readOnly: !this.computedIsEdit(true),
        theme: "default", // 你可以改成其他主题
      });

      // 当编辑器内容改变时，触发 input 事件
      this.editor.on("change", (cm) => {
        this.$emit("input", cm.getValue());
      });
    },
  },

};
</script>

<style lang="scss" scoped>
::v-deep .CodeMirror {
  line-height: 1.1;
  font-size: 14px; /* 使用较小的字体 */
  padding: 4px;    /* 减少内边距 */
  height: auto !important;
}
::v-deep .CodeMirror-scroll {
  height: auto !important;
}
</style>
