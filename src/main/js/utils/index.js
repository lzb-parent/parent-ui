import RequestUtil from './RequestUtil.js'
import StrUtil from './StrUtil.js'
import FileUtil from './FileUtil.js'
import ObjectUtil from './ObjectUtil.js'
import DateUtil from './DateUtil.js'
import CollUtil from './CollUtil.js'
import NumUtil from './NumUtil.js'
import HtmlUtil from './HtmlUtil.js'
export default {
    install(Vue,
            axiosInstance,
            fileServer,
            i18n,
            ) {
        [
            ObjectUtil,
            RequestUtil,
            StrUtil,
            FileUtil,
            ObjectUtil,
            DateUtil,
            CollUtil,
            NumUtil,
            HtmlUtil
        ].forEach(util => {
            window[util.name] = util
        })

        // 需要额外初始化
        RequestUtil.install(axiosInstance)
        FileUtil.install(fileServer)
        HtmlUtil.install(i18n)
    },
};
