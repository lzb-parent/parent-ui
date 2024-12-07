// import MixinScope from './MixinScope.js'
import MixinCommin from './MixinCommin.js'
import MixinUtil from './MixinUtil.js'
import MixinLogin from './MixinLogin.js'

export default {
    install(Vue) {
        Vue.mixin(MixinCommin)
        Vue.mixin(MixinUtil)
        Vue.mixin(MixinLogin)
    },
};
