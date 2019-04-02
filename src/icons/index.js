
import SvgIcon from '@/components/SvgIcon' // svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

// require.context 可以动态引入文件
// 我们可以通过正则匹配引入相应的文件模块
const requireAll = requireContext => requireContext.keys().map(requireContext)
// webpack 会创建一个 require.context，通过正则匹配到可能的文件，全部引入
// 否则需单个引入   import '@/src/icons/qq.svg; //引入图标
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
