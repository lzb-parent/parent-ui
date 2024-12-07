import utils from './utils'
import mixin from './mixin'
// import {ObjectUtil} from './utils/ObjectUtil'

export default {
    install(Vue,
            axiosInstance,
            fileServer,
            i18n,
            ) {
        utils.install(
            Vue,
            axiosInstance,
            fileServer,
            i18n,
        )
        mixin.install(Vue)
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
