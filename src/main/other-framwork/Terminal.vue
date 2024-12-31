<template>
  <div ref="terminalContainer" class="terminal-container" @scroll="handleScroll">
    {{contentFile}}
    <template v-for="content in contentsWebsocket">
      {{content}}<br/>
    </template>
  </div>
</template>

<script>
import MixinScope from "../../main/js/mixin/MixinScope";
import websocketUtil from "../../main/js/utils/WebsocketUtil";

export default {
  mixins: [MixinScope],
  props: {
    subscribeGet: {},
  },
  data() {
    return {
      contentFile: 'Loading logs...\n',                     // 用来保存文件内容
      contentsWebsocket: [],               // 用来保存websocket推送内容
      isUserScrolling: false,              // 用户是否正在手动滚动
    };
  },
  mounted() {
  },
  created() {
    this.init();
  },
  destroyed() {
    if (this.subscribeGet) {
      websocketUtil.methods.unsubscribe(this.subscribeGet.topic);
    }
  },
  methods: {
    init() {
      if (this.subscribeGet) {
        websocketUtil.methods.unsubscribe(this.subscribeGet.topic);
        websocketUtil.methods.subscribes([this.subscribeGet]);
      }
      this.initTerminal();
    },
    initTerminal() {
      this.$nextTick(() => {
        const container = this.$refs.terminalContainer;
        container.style.overflowY = container.style.overflowY || 'auto';
        container.style.whiteSpace = container.style.whiteSpace || 'pre-wrap';
      })

      if (this.scope.value) {
        fetch(this.scope.value)
            .then((response) => response.text())
            .then((data) => {
              if (data) {
                this.contentFile = data;
                this.$nextTick(() => {
                  this.scrollToBottom();
                })
              }
            });
      }
    },
    // 滚动事件处理，判断用户是否手动滚动
    handleScroll() {
      const container = this.$refs.terminalContainer;
      if (!container) return;

      const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight <= 10;

      // 如果滚动条位置不在底部，设置用户正在手动滚动
      this.isUserScrolling = !isNearBottom;
    },
    // 向终端写入内容
    writeToTerminalWebsocket(content) {
      this.contentsWebsocket.push(content);

      // 限制最大日志条数
      if (this.contentsWebsocket.length > 500) {
        this.contentsWebsocket.shift();
      }

      // 更新日志后自动滚动
      if (!this.isUserScrolling) {
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.terminalContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
.terminal-container {
  background-color: #0e0e0e;
  color: #f9f9f9;
  padding: 10px;
  border: 1px solid #333;
  font-size: 14px;
  max-height: 400px; /* 限制高度 */
  overflow-y: auto; /* 滚动条 */
  line-height: 1.3;
}
</style>
