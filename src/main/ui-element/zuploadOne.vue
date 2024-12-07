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
    >
      <template>
        <div style="position: relative">
          <div v-for="(img,i) in valueNews" :key="i" class="ma-1">
            <div v-if="computedIsEdit(true)" class="del" @click.stop="$delete(valueNews,i)">{{$t('删除')}}</div>
            <!--            <template v-if="computedIsEdit && placeholder">-->
            <!--              <div style="padding:30px;">{{ placeholder }}</div>-->
            <!--            </template>-->
            <video v-if="videoTypes.indexOf(fileType(img))>=0" :src="getFileViewUrl(img)" class="avatar" :style="getStyle" />
            <img v-else :src="getFileViewUrl(img)" class="avatar" :style="picStyle || getStyle">
          </div>
        </div>
      </template>
      <i v-if="computedIsEdit(true)" class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-input v-if="computedIsEdit(true)" v-model="valueNew" class="zuploadInput" :placeholder="$t('图片路径')"/>
<!--    <el-input v-if="computedIsEdit(true)" v-model="valueNew" class="zuploadInput" type="textarea" :autosize="{ minRows: 1 }" placeholder="图片路径"/>-->
  </div>
</template>
<script>

import mixinDiv from "../../main/js/mixin/MixinDiv";

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
      valueNew: this.value, // 最后上传返回的path
      valueNews: [],
      fileName: null,
      loading: false,
      videoTypes: ['avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', 'rm', '3gp', 'vob']// ...
    }
  },
  computed: {
  },
  watch: {
    'value'(val) {
      this.valueNews = val ? val.split(',') : []
    },
    valueNews: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.valueNew = newVal.join(',')
        }
      },
      deep: true
      // immediate: true
    },
    'valueNew'(newVal, oldVal) {
      this.$emit('change', newVal, oldVal)
      this.$emit('input', newVal)
    }
  },
  created() {
    this.uploadUrl = this.getUploadPath(this.module)
    this.valueNew = this.value
    if (this.valueNew) {
      this.valueNews = this.valueNew.split(',')
    }
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
    handleSuccess(rs) {
      if (rs.code === 500) {
        console.log('上传失败', rs.msg)
        this.$message.error(this.$t('上传失败') + ' ' + rs.msg)
      } else {
        console.log('上传成功', rs[0])
        this.valueNews.push(rs[0])
      }
      this.loading = false
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    deletePic() {
      if (!this.computedIsEdit) {
        return
      }
      this.valueNew = ''
      this.$emit('input', this.valueNew)
      this.$emit('change', this.valueNew)
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
