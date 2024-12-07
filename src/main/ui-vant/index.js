import zfield from './zfield.vue'
import './index.scss'
// import {ObjectUtil} from './utils/ObjectUtil'

export default {
    install(Vue) {
        Vue.component(zfield.name, zfield)
        // let utilMap = ObjectUtil.readObject(require.context('./utils', true, /\.js$/), name => name.substring(0, name.length - 3));
        // for (let key of Object.keys(utilMap)) {
        //     window[key] = utilMap[key]
        // }
        // let mixinMap = ObjectUtil.readObject(require.context('./mixin', true, /\.js$/), name => name.substring(0, name.length - 3));
        // for (let key of Object.keys(mixinMap)) {
        //     Vue.mixin(mixinMap)
        // }
    },
};



