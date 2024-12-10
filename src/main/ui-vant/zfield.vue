<template>
  <van-cell v-if="!computedIsEdit(true)" :title="$t(title)">
    <!--    <template #right-icon>-->
    <div class="text-primary">{{ innerValue }}</div>
    <!--    </template>-->
  </van-cell>
  <fieldUpload
    v-else-if="type==='image'"
    ref="img"
    v-model="innerValue"
    :required="required"
    :img-center="imgCenter"
    v-bind="$props"
  >
    <template #icon="{value}">
      <slot name="icon" :value="value" />
    </template>
  </fieldUpload>
  <!--  <van-field v-else-if="type==='number'"-->
  <!--             :label="label"-->
  <!--             :placeholder="placeholder"-->
  <!--             v-model="innerValue"-->
  <!--             :formatter="formatter_number"-->
  <!--             :labelWidth="labelWidth"-->
  <!--             :rules="rulesInner"-->
  <!--             :required="required"-->
  <!--             :clearable="clearable"-->
  <!--  />-->
  <van-field
    v-else-if="type==='richText'"
    v-model="innerValue"
    :label="label"
    :placeholder="placeholder"
    rows="3"
    autosize
    type="textarea"
    maxlength="2000"
    show-word-limit
    :label-width="labelWidth"
    :rules="rulesInner"
    :required="required"
    :clearable="clearable"
  />
  <van-field
    v-else-if="type==='date'"
    v-model="innerValue"
    class="date"
    :label="label"
    :placeholder="placeholder"
    :label-width="labelWidth"
    :rules="rulesInner"
    :required="required"
    :clearable="clearable"
    :right-icon="(clearable && innerValue) ? 'close' : null"
    :style="{width}"
    @click-right-icon="innerValue=null"
  >
    <template #input>
      <input
        v-model="innerValue"
        class="full-width text-center"
        :placeholder="placeholder"
        style="background: none;border: none;"
        @click="show=true"
      />
      <!--      <van-field class="full-width" :style="`${innerValue?'textValue':'placeholder'} min-height:0.5rem;`" @click="show=true">{{ innerValue || placeholder}}</van-field>-->
    </template>
    <template #extra>
      <van-popup
        v-model="show"
        close-icon-position="top-left"
        position="bottom"
      >
        <!--          title="选择年月日"-->
        <van-datetime-picker
          v-model="date"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
          @cancel="show=false"
          @confirm="innerValue=DateUtil.formatDate(date);$emit('change',innerValue);show=false"
        />
      </van-popup>
    </template>
  </van-field>
  <zfield-select v-else-if="type==='select'" v-slot="$slots" v-bind="{...$attrs,...$props}" v-on="$listeners" />
  <!--  <van-field v-else-if="type==='select'"-->
  <!--             :label="label"-->
  <!--             :placeholder="placeholder"-->
  <!--             :labelWidth="labelWidth"-->
  <!--             v-model="innerValue"-->
  <!--             :rules="rulesInner"-->
  <!--             :required="required"-->
  <!--             :clearable="clearable"-->
  <!--             :right-icon="(clearable && innerValue) ? 'close' : null"-->
  <!--             @click-right-icon="innerValue=null"-->
  <!--  >-->
  <!--    &lt;!&ndash;    <template #input>&ndash;&gt;-->
  <!--    &lt;!&ndash;      <input type="text" @click="showPicker=true" @focus="showPicker=true" :value="columnsLabel"&ndash;&gt;-->
  <!--    &lt;!&ndash;             class="van-field__control" />&ndash;&gt;-->
  <!--    &lt;!&ndash;    </template>&ndash;&gt;-->
  <!--    <template #input="slotProps">-->
  <!--      <slot :name="'option'" v-bind="innerValue"></slot>-->
  <!--    </template>-->
  <!--    <template #extra>-->
  <!--      <van-popup-->
  <!--          v-model="showPicker"-->
  <!--          close-icon-position="top-left"-->
  <!--          position="bottom"-->
  <!--      >-->
  <!--        <van-picker-->
  <!--            :title="label"-->
  <!--            :columns="columns"-->
  <!--            show-toolbar-->
  <!--            @confirm="onConfirm"-->
  <!--            @cancel="showPicker = false"-->
  <!--            @change="(newVal,oldVal)=>$emit('change',newVal,oldVal)"-->
  <!--            :slots="$slots"-->
  <!--        >-->
  <!--          <template #option="option">-->
  <!--            <slot :name="'option'" v-bind="option"></slot>-->
  <!--          </template>-->
  <!--        </van-picker>-->
  <!--      </van-popup>-->
  <!--    </template>-->
  <!--  </van-field>-->
  <!--  全透传 -->
  <van-field
    v-else
    v-model="innerValue"
    v-bind="{...$attrs,...$props}"
    :rules="rulesInner"
    :required="required"
    :style="{width}"
    @keyup.enter.native="$emit('keyup',innerValue)"
  >

    <!--  插槽透传 -->
    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </van-field>
</template>

<script>
import fieldUpload from './fieldUpload.vue'
import mixinDiv from '../../main/js/mixin/MixinDiv'
import ObjectUtil from '../../main/js/utils/ObjectUtil'
import ZfieldSelect from '../../main/ui-vant/zfieldSelect.vue'
import DateUtil from '../../main/js/utils/DateUtil'

export default {
  name: 'Zfield',
  components: {
    ZfieldSelect,
    fieldUpload
  },
  mixins: [mixinDiv],
  props: {
    slotInput: { default: false },
    imgCenter: {},
    module: {},
    type: {},
    value: {},
    title: {},
    label: {},
    rules: {},
    width: { type: String, default: () => '100%' },
    labelWidth: {},
    placeholder: {},
    required: {},
    readonly: {},
    disabled: {},
    clearable: {
      default: true
    },
    minDate: { default: () => new Date(2020, 0, 1) },
    maxDate: { default: () => new Date(2050, 0, 1) },
    currentDate: { default: () => new Date() },
    columns: { type: Array, default: () => [] },
    columnsKeyFun: { type: Function, default: (o) => o },
    columnsLabelFun: { type: Function, default: (o) => o },
    loading: { default: false },
    defaultFirst: { default: false },
  },
  data() {
    return {
      DateUtil,
      innerValue: null,
      innerValueUpload: [],
      showPicker: null,
      loadingInner: false,
      date: this.currentDate,
      show: false,
      file: null
    }
  },
  computed: {
    rulesInner() {
      let list = this.rules || []
      const required = ObjectUtil.isNull(this.required) || !!this.required
      // debugger
      if (required) {
        const pleaseInput = this.type === 'image' ? this.$t('请上传') : this.$t('请输入')
        const requireRules = [{
          required: required,
          message: (pleaseInput + ` ` + (this.label || this.title || '')),
          trigger: 'blur'
        }]
        list = list.concat(requireRules)
      }
      return list
    },
    // columnsLabel() {
    //   let finds = this.columns.filter(c => this.columnsKeyFun(c) === this.innerValue);
    //   if (finds && finds.length) {
    //     return this.columnsLabelFun(finds[0]);
    //   }
    //   return ''
    // }
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
        // if (newVal !== oldVal) {
        //   this.$emit("change", newVal, oldVal);
        // }
      },
      deep: true
    }
  },
  mounted() {
  },
  created() {
    this.loadingInner = this.loading
    this.innerValue = this.value
    if (ObjectUtil.isEmpty(this.innerValue) && this.columns.length && (this.defaultFirst || (this.defaultFirst == null && this.required && this.columns.length === 1))) {
      this.innerValue = this.columns[0]
    }
    // console.log("this.rulesInner " + this.title, this.rulesInner);
    // console.log("this.this.required " + this.title, this.required);
  },
  methods: {
    formatter_number(value) {
      // 过滤输入的数字
      return value.replace(/\d/g, '')
    },
    clickUpload(field) {
    },
    keyup(field) {
      console.log('keyup')
    },
    onConfirm(obj) {
      this.$set(this, 'innerValue', this.columnsKeyFun(obj))
      // this.innerValue = this.columnsKeyFun(obj);
      this.showPicker = false
      // this.$emit("confirm", this.innerValue);
      console.log('onConfirm', this.innerValue)
    }
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
    //width: 100%;
    //height: auto;
  }

  .van-field__control {
    //justify-content: center;
  }

  .imgCenter {
    margin: auto;
  }

  //.van-uploader__preview-image{
  //  width: initial;
  //  height: initial;
  //}
}
</style>
