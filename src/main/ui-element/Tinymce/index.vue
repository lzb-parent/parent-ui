<template>
  <div v-if="computedIsEdit(true)" :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" ref="tinymceIdContent" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" :module="module" @successCBK="imageSuccessCBK" />
      <!--      <el-button icon="el-icon-upload" size="mini" type="primary" @click="imageFullSize">-->
      <!--        图片自适应-->
      <!--      </el-button>-->
    </div>
  </div>
  <div v-else-if="value && value.length >= 300" v-html="$t('富文本')" />
  <div v-else-if="value && value.length < 300" v-html="value">{{$t('富文本')}}</div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import './dynamicLoadScript'
import './plugin_paddingLeft'
import './plugin_paddingRight'
import mixinDiv from '../../../main/js/mixin/MixinDiv'
import FileUtil from '../../../main/js/utils/FileUtil'

// const tinymceCDN = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.0/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { editorImage },
  mixins: [mixinDiv],
  props: {
    module: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 300
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    id(val, oldVal) {
      if (val !== oldVal) {
        // this.tinymceId = this.id
        // this.initTinymce()
        window.tinymce.get(this.tinymceId).setContent(this.value || '')
      }
    },
    value(val, oldVal) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      // load(tinymceCDN, (err) => {
      //   if (err) {
      //     this.$message.error(err.message)
      //     return
      //   }
      // console.log('getFileServer()', getFileServer())
      this.initTinymce()
      // })
    },
    initTinymce() {
      this.hasChange = false
      this.hasInit = false
      const _this = this
      window.tinymce.init({
        // lineheight_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 36pt",
        language_url: '/static/tinymce/zh_CN.js',
        language: 'zh_CN',
        convert_urls: false,
        relative_urls: true,
        document_base_url: FileUtil.getFileServer()+'/',
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        image_dimensions: false,
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
      // window.tinymce.get(this.tinymceId).setContent(this.replaceContent(value))
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      console.log('imageSuccessCBK', arr)
      const _this = this
      if (arr.length === 2) {
        const videos = arr.filter(f => ['mp4', 'rmvb'].indexOf(f.fileType) >= 0)
        if (videos.length === 1) {
          const fileVideo = videos[0]
          const filePoster = arr.filter(f => f !== fileVideo)[0]
          const content = `<video class="video-js vjs-default-skin" poster="${this.getFileViewUrl(filePoster.url)}" controls preload="none" x5-playsinline="" webkit-playsinline="" playsinline="" style="width: 100%; height: 100%; align-content: center;">
    <source src="${this.getFileViewUrl(fileVideo.url)}">
  </video>`
          window.tinymce.get(_this.tinymceId).insertContent(content)
          return
        }
      }
      arr.forEach(v => {
        let picUrl = v.url
        const fileType = v.fileType
        // const img = isVideo ? new Audio(_URL.createObjectURL(file)) : new Image()
        picUrl = picUrl.replace('{host}/', '') // 富文本内用相对路径(受tinymce插件约束)
        // const picUrl = this.replaceContent(v.url)
        const isVideo = ['mp4', 'rmvb'].indexOf(fileType) >= 0
        let content
        // debugger
        if (isVideo) {
          content = `<video class="video-js vjs-default-skin" poster="${this.getFileViewUrl(picUrl)}" controls preload="none" x5-playsinline="" webkit-playsinline="" playsinline="" autoplay style="width: 100%; height: 100%; align-content: center;">
    <source src="${this.getFileViewUrl(picUrl)}">
  </video>`
          //         content = `<video :id="innerId" @play="playVideo" v-if="videoTypes.indexOf(fileType)>=0" class="video-js vjs-default-skin" controls preload="none" x5-playsinline="" webkit-playsinline="" playsinline="" :poster="getFileViewUrl(poster)" :muted="autoPlay?true:null" :autoplay="autoPlay?true:null" style="width: 100%; height: 100%; align-content: center;">
          //   <source :src="${getFileViewUrl(picUrl)}">
          // </video>`;
          // content = `<video class="wscnph" src="${picUrl}" style="max-width: 100%;">`;
        } else {
          content = `<img class="wscnph" src="${picUrl}" style="max-width: 100%;">`
        }
        window.tinymce.get(_this.tinymceId).insertContent(content)
      })
    },
    // replaceContent(value) {
    //   return this.getFileViewUrl(value)
    // },
    imageFullSize(value) {
      this.setContent(this.getContent())
    },
    getFileType(fileName) {
      if (fileName) {
        const index = fileName.lastIndexOf('.')
        if (index >= 0) {
          return fileName.substring(index + 1)
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 2005;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}

.tox-tinymce-aux {
  z-index: 3000 !important; // 添加到公共的css
}
</style>
