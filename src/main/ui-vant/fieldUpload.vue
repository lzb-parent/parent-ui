<template>
  <van-field ref="img"
             :class="{fieldUpload:true,imgCenter}"
             :label="label"
             :placeholder="placeholder"
             :labelWidth="labelWidth"
             :rules="rulesInner"
             :clearable="clearable"
             v-model="innerValue"
             :required="required"
  >
    <template #input>
      <div>
        <div v-if="loadingInner" class="van-uploader__preview">
<!--          <div class="van-uploader__mask">-->
<!--            <div class="van-loading van-loading&#45;&#45;circular van-uploader__loading">-->
<!--              <span class="van-loading__spinner van-loading__spinner&#45;&#45;circular"><svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></span></div>-->
<!--          </div>-->
          <van-loading />
        </div>
        <img v-else-if="innerValue"  :src="getFileViewUrl(innerValue)" :width="width" @click="()=>$refs.file.click()" style="display: block;">
        <div v-else-if="slotInput" @click="()=>$refs.file.click()">
          <span v-if="requiredNew" style="position: absolute;color: red;">*</span>
          <slot :innerValue="innerValue">
          </slot>
        </div>
        <div v-else class="" @click="()=>$refs.file.click()">
<!--          <span v-if="requiredNew" style="position: absolute;color: red;">*</span>-->
          <slot name="icon" :innerValue="innerValue">
            <i class="van-icon van-icon-photograph van-uploader__upload-icon" style="font-size: 70px;padding:16px; border: 1px solid white;border-radius: 50%;"></i>
          </slot>
        </div>
        <input v-show="false" type="file" ref="file" name="file" @change="afterPicRead"/>
      </div>
    </template>
  </van-field>
</template>

<script>

export default {
  name: "fieldUpload",
  props: {
    slotInput: {default: false},
    slotShow: {default: false},
    imgCenter: {},
    module: {},
    title: {},
    type: {},
    value: {},
    label: {},
    rules: {},
    width: {type: String, default: () => "100%"},
    labelWidth: {},
    placeholder: {},
    required: {},
    disabled: {},
    clearable: {
      default: true
    },
    loading: {default: false},
  },
  data() {
    return {
      innerValue: null,
      innerValueUpload: [],
      loadingInner: false,
      show: false,
      file: null,
    }
  },
  computed: {
    requiredNew() {
      return null !== this.required && false !== this.required
    },
    rulesInner() {
      let pleaseInput = this.type === 'image' ? this.$t('请上传') : this.$t('请输入');
      let list = [{required: this.requiredNew, message: (pleaseInput + ` ` + (this.label || this.title || '')), trigger: 'blur'}]
      if (this.rules) {
        list = list.concat(this.rules)
      }
      return list
    },
  },
  watch: {
    value(newVal) {
      this.innerValue = newVal
    },
    loading(newVal) {
      this.loadingInner = newVal
    },
    innerValue: {
      handler(newVal, oldVal) {
        this.$emit('input', newVal)
        if (newVal !== oldVal) {
          this.$emit('change', newVal, oldVal)
        }
      },
      deep: true
    },
  },
  created() {
    // console.log('this.$attrs',this.$attrs)
    console.log('this.required',this.required)
    console.log('this.rulesInner',this.rulesInner)
    // this.loadingInner = this.loading
    this.innerValue = this.value
    // this.$nextTick(() => {
    //   console.log('$refs.file',this.$refs.file.click)
    // })

  },
  methods: {
    // formatter_number(value) {
    //   // 过滤输入的数字
    //   return value.replace(/\d/g, '');
    // },
    clickUpload(field) {
    },
    // keyup(field) {
    //   console.log('keyup')
    // },
    afterPicRead(event) {
      console.log('afterPicRead start')

      let files = event.target.files
      // this.file = file
      // file.status = 'uploading';
      // 此时可以自行将文件上传至服务器
      this.$emit('input:loading', true)
      this.loadingInner = true
      let formdata = new FormData()
      formdata.append('file', files[0])
      formdata.append('module', this.module || 'front')
      this.$store.dispatch('common/upload', formdata).then(res => {
        // this.$refs['img']
        this.innerValue = res[0]
        this.innerValueUpload = [{url: this.getFileViewUrl(this.innerValue), isImg: true, status: 'done'}]
        // file.status = 'done';
        // this.file = null
      }).catch(e => {
        // file.status = 'failed';
        // this.file = null
      }).finally(() => {
        this.$emit('input:loading', false)
        this.loadingInner = false
        console.log('afterPicRead finally')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .van-field__body {
    justify-content: center;
  }

  .van-uploader__upload {
    margin: initial;
  }
}
.imgCenter {
  ::v-deep .van-field__control{
    justify-content: center;
  }

  //margin: auto;
  //text-align: center;
}
.imgCenter::after {
  border-bottom: none !important;
}
</style>
