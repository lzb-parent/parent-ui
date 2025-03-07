<template>
  <div class="bg-gray-900 rounded-sm relative">
    <!-- 复制按钮 -->
    <button
        v-clipboard:copy="value"
        v-clipboard:success="onCopySuccess"
        class="absolute top-1 right-1 p-1 bg-gray-700 text-white rounded-sm hover:bg-gray-600 transition-colors"
        title="复制代码"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </button>

    <!-- 使用 textarea 展示代码 -->
    <textarea
        :value="value"
        readonly
        class="w-full bg-transparent text-white font-mono resize-none whitespace-pre-wrap overflow-x-auto p-1"
        :rows="rows"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'CodeBlock',
  props: {
    value: {
      type: String,
      default: '', // 默认代码内容
    },
    rows: {
      type: Number,
      default: 16, // 默认行数
    },
  },
  // 假设 onCopySuccess 已经在 mixin 中定义
};
</script>

<style scoped>
/* 去除 textarea 的默认样式 */
textarea {
  outline: none; /* 去除焦点时的边框 */
  border: none; /* 去除边框 */
  line-height: 1.2; /* 调整行高，让内容更紧凑 */
  font-size: 0.875rem; /* 调整字体大小，默认 text-sm */
}

/* 复制按钮样式 */
button {
  z-index: 10; /* 确保按钮在 textarea 上方 */
}
</style>