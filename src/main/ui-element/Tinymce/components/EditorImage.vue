<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      {{$t('上传图片')}}
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <el-upload v-if="uploadUrl"
        ref="upload"
        :multiple="true"
        :auto-upload="false"
        :data="{module:module}"
        :action="uploadUrl"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        list-type="picture-card"
        with-credentials
      >
        <!--        accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"-->
        <el-button slot="trigger" size="small" type="primary">{{$t('选取文件')}}</el-button>
        <div slot="tip" class="el-upload__tip" />
      </el-upload>
      <el-button size="small" @click="dialogVisible = false">{{$t('取消')}}</el-button>
      <el-button size="small" type="primary" @click="submitUpload">{{$t('立即上传')}}</el-button>
      <el-button size="small" type="primary" :disabled="!submited" @click="handleSubmit">{{$t('立即插入')}}</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EditorSlideUpload',
  props: {
    /**
     * 上传的目录(模块在IEnumUploadModule中预先定义)
     */
    module: {
      type: String,
      required: true
    },
    isQiniu: {
      type: Boolean,
      required: false
    },
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      uploadUrl: null, // 上传请求地址
      dialogVisible: false,
      submited: false,
      listObj: {},
      fileList: [],
      uploadHost: null
    }
  },
  created() {
    this.uploadUrl = '/api/common/uploadAdmin'
    // this.uploadUrl = this.isQiniu ? this.getQiniuUploadPath(this.module) : this.getUploadPath(this.module)
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    async handleSuccess(files, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = files[0]
          this.listObj[objKeyArr[i]].hasSuccess = true
        }
      }
      this.submited = true
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    async beforeUpload(file) {
      const _self = this
      console.log('file', file)
      const _URL = window.URL || window.webkitURL
      const fileId = file.uid
      const fileName = file.name
      this.listObj[fileId] = {}
      return new Promise((resolve, reject) => {
        const fileType = this.getFileType(fileName).toLowerCase()
        // console.log('fileType',fileType)
        const img = ['mp4', 'rmvb'].indexOf(fileType) >= 0 ? new Audio() : new Image()
        // console.log('img',img)
        img.src = _URL.createObjectURL(file)
        // img.onload = function() {
        // console.log('onload',file)
        _self.listObj[fileId] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height, fileType }
        // }
        resolve(true)
      })
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
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 150px;
    border: none;
    background: none;
  }
}
</style>
