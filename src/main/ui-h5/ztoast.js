// ToastService.js

// import Vue from 'vue';

const ToastService = {
  show(message, duration = 3000) {
    const ToastComponent = Vue.extend({
      data() {
        return {
          isVisible: true,
          message: message,
        };
      },
      template: '<div class="custom-toast" v-show="isVisible" v-html="message"></div>',
      mounted() {
        setTimeout(() => {
          this.isVisible = false;
        }, duration);
      },
    });

    const vm = new ToastComponent().$mount();
    document.body.appendChild(vm.$el);
  },
};

export default ToastService;
