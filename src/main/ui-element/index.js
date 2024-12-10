import './index.scss'
import autotable from './autotable'

export default {
    install(Vue, config = {}) {
        autotable.install(Vue, config.autotable)
    },
};
