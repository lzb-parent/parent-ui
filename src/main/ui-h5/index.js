import zcurrency from './zcurrency.vue'
import './common.scss'

export default {
    install(Vue) {
        Vue.component(zcurrency.name, zcurrency)

    },
};
