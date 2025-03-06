<template>
  <div>
    <el-upload
      v-loading="loading"
      :action="uploadUrl"
      :disabled="!computedIsEdit(true)"
      :show-file-list="false"
      :title="placeholder"
      :data="{
        module:module,
        fileName:fileName,
      }"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      with-credentials
      class="avatar-uploader"
      v-on="$listeners"
    >
      <template>
        <div style="position: relative">
          <div v-for="(img,i) in valueNews" :key="i" class="ma-1">
            <div
              v-if="computedIsEdit(true) && !isEmpty"
              class="del"
              @click.stop="valueNews.length===1?valueNews=['']:$delete(valueNews,i)"
            >
              {{$t('删除')}}
            </div>
            <!--            <template v-if="computedIsEdit && placeholder">-->
            <!--              <div style="padding:30px;">{{ placeholder }}</div>-->
            <!--            </template>-->
            <template v-if="img">
              <video
                v-if="videoTypes.indexOf(fileType(img))>=0"
                :src="FileUtil.getFileViewUrl(img)"
                class="avatar"
                :style="getStyle"
              />
              <img v-else :src="FileUtil.getFileViewUrl(img)" class="avatar" :style="picStyle || getStyle">
            </template>
          </div>
        </div>
      </template>
      <i v-if="computedIsEdit(true)" class="el-icon-plus avatar-uploader-icon"/>
    </el-upload>
    <template v-if="computedIsEdit(true)">
      <template v-for="(valueNew,i) in valueNews">
        <el-input
          :key="i"
          v-model="valueNews[i]"
          class="zuploadInput"
          :autosize="{ minRows: 1 }"
          size="mini"
          :placeholder="$t('图片路径')"
        />
      </template>
    </template>
  </div>
</template>
<script>

import mixinDiv from "../../main/js/mixin/MixinDiv";
import FileUtil from "../../main/js/utils/FileUtil";

export default {
  name: 'Zupload',
  mixins: [mixinDiv],
  props: {
    /**
     * 路径(相对)
     */
    picStyle: {},
    value: {},
    /**
     * 上传的目录(模块在yml中预先定义)
     */
    module: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: () => null
    },
    multiple: {}
  },
  data() {
    return {
      uploadUrl: null, // 上传请求地址
      // valueNew: this.value, // 最后上传返回的path
      valueNews: [''],
      fileName: null,
      loading: false,
      videoTypes: ['avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', 'rm', '3gp', 'vob']// ...
    }
  },
  computed: {
    isEmpty() {
      return this.valueNews.length === 1 && this.valueNews[0] === ''
    }
  },
  watch: {
    'value'(newVal) {
      const valueNewsStr = this.valueNews.join(',')
      if (valueNewsStr !== newVal) {
        this.valueNews = newVal ? newVal.split(',') : ['']
      }
    },
    valueNews: {
      handler(newVal, oldVal) {
        const valueNewsStr = newVal.join(',')
        if (valueNewsStr !== this.value) {
          this.$emit('change', valueNewsStr)
          this.$emit('input', valueNewsStr)
        }
      },
      deep: true
    }
  },
  created() {
    this.valueNews = this.value ? this.value.split(',') : ['']
    // this.uploadUrl = FileUtil.getUploadPath(this.module)
    this.uploadUrl = '/api/common/uploadAdmin'
  },
  methods: {
    fileType(path) {
      if (path) {
        const index = path.lastIndexOf('.')
        if (index >= 0) {
          return path.substring(index + 1)
        }
      }
    },
    beforeUpload(file) {
      this.loading = true
      console.log(file)
      this.fileName = file.name
      console.log('fileName', this.fileName)
    },
    handleError() {
      console.log('上传失败', arguments)
      this.loading = false
    },
    handleRemove() {
    },
    handleSuccess(rs) {
      if (rs.code === 500) {
        console.log('上传失败', rs.msg)
        this.$message.error(this.$t('上传失败') + ' ' + rs.msg)
      } else {
        console.log('上传成功', rs[0])
        if (this.isEmpty) {
          this.valueNews.shift()
        }
        console.log('[].shift()', [].shift())
        this.valueNews.push(rs[0])
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.del {
  width: 100%;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  background: #000000b3;
}
</style>
