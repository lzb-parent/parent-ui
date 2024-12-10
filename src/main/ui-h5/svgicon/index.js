// import Vue from 'vue'
import SvgIcon from './SvgIcon' // svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svgs', true, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)
