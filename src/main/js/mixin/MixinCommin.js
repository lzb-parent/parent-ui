import FileUtil from '../../../main/js/utils/FileUtil'
import StrUtil from "../../../main/js/utils/StrUtil";

/**
 * 登录,权限 相关全局方法
 * @type {string[]}
 */
const isProd = process.env.NODE_ENV === 'production'

export default {
  props: {},
  computed: {
    // 这边添加了，在ui中mixin_common就不要加
    ...Vuex.mapState([
      'authDictMap',
      'siteTitle',
      'countryList',
      'country',
    ]),
  },
  data() {
    return {
      mixin: {
        isProd,
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // $$t(code){
    //   return this.$t(StrUtil.replaceSpecialStr(code))
    // },
    // getFileViewUrl: FileUtil.getFileViewUrl,
    getFileViewUrl: FileUtil.getFileViewUrl,
    jump(url, newPage = false) {
      if (newPage) {
        window.open(url, '_blank')
        return
      }
      url && (url.indexOf('http') > -1 && (location.href = url) || (this.$router.push({path: url})))
    },
    onCopySuccess() {
      this.$message.success('复制成功')
    },
  }
}
