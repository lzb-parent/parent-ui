<script>
import zselect from '../../ui-element/zselect'
import zselectAppend from '../../ui-element/zselectAppend'
import Tinymce from '../../ui-element/Tinymce'
import CodeMirrorEditor from '../../other-framwork/CodeMirrorEditor'
import zinput from '../../ui-element/zinput'
import zupload from '../../ui-element/zupload'
import zradio from '../../ui-element/zradio'
import zbool from '../../ui-element/zbool'
import zswitch from '../../ui-element/zswitch'
import zdatetime from '../../ui-element/zdatetime'
import zuploadFile from '../../ui-element/zuploadFile'
import {Areas, Option} from './area.js'
import mixinDiv from '../../../main/js/mixin/MixinDiv'
import ObjectUtil from '../../../main/js/utils/ObjectUtil'

export default {
  name: 'BaseField',
  components: {
    zselect,
    zselectAppend,
    Tinymce,
    zinput,
    zupload,
    zradio,
    zbool,
    zswitch,
    zdatetime,
    zuploadFile,
  },
  mixins: [mixinDiv],
  props: {
    isEdit: {},
    value: {},
    area: {},
    entity: {},
    tableConfig: {},
    fieldConfig: {
      default: () => {
        return {}
      }
    },
    log: {},
    option: {},
    params: {},
  },
  data() {
    return {
      innerValue: null,
      entityInner: {},
      init: false,
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.innerValue = newVal
      },
      deep: true
    },
    innerValue: {
      handler(newVal, oldVal) {
        this.$emit('input', newVal)
        if (this.init) {
          this.$emit('change', newVal, oldVal)
        }
      },
      deep: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init = true
    })
  },
  render(h) {
    // console.log(`baseField render ${this.area} ${this.fieldConfig.fieldName}`, this.fieldConfig)
    // if (this.fieldConfig.fieldName === 'isOnline') {
    //   // debugger
    // }
    this.innerValue = this.value
    this.entityInner = this.entity
    const This = this

    // if (!this.fieldConfig) {
    //   return null
    // }
    // render 方法中的 this 都是当前这个this
    if (!ObjectUtil.isNull(this.log)) {
      console.log(`init ${this.$vnode.key}`, this.fieldConfig)
    }
    let listeners = {...this.fieldConfig._listeners, ...this.$listeners};
    for (let eventName of Object.keys(listeners)) {
      let fun = listeners[eventName]
      listeners[eventName] = function (newVal, oldVal) {
        // console.log('baseField ' + eventName)
        fun(newVal, oldVal, This.entity)
      }
    }
    let attrs = {
      placeholder: this.area === Areas.form ? this.fieldConfig.description : this.fieldConfig.label,
      clearToEmpty: this.area === Areas.form,
      ...(this.fieldConfig.extendProp && JSON.parse(this.fieldConfig.extendProp) || {}),
      ...this.fieldConfig,
      ...this.$attrs,
      notNull: this.fieldConfig.notNull === 'not_null',
      ...this.params,
    }

    if (this.option === Option.insert) {
      attrs.disabled = false
      // return <div>{attrs.disabled}</div>
    }
    if (attrs.disabled) {
      attrs.placeholder = ''
    }
    if (this.fieldConfig.changeAttrs) {
      attrs = this.fieldConfig.changeAttrs(attrs, this.entityInner)
    }
    // 搜索时,定制组件样式
    switch (this.area) {
      case Areas.search:
        attrs.size = attrs.size || 'small'
        attrs.mainLength = 200
        switch (attrs.uiType) {
          case 'textarea':
          case 'richText':
          case 'xml':
            attrs.uiType = 'text'
            break
          case 'bool':
            attrs.uiType = 'zbool'
            break
        }
        break
    //   case Areas.table:
    //     switch (attrs.uiType) {
    //       case 'file':
    //         attrs.uiType = 'none'
    //         break
    //     }
    }

    let listCode
    let listLabel
    delete attrs['type']
    const render = this.fieldConfig.render
    if (render && this.entityInner) {
      // console.log(`baseField Value ${this.fieldConfig.fieldName} area=${This.area}`)
      return render.call(this, h, this.entityInner, attrs, This.area)
    }
    let content = {}
    let uiType = attrs.uiType || 'text'
    // uiType = 'text'
    // console.log('fieldName', this.fieldConfig.fieldName)
    // if (this.fieldConfig.fieldName === 'value') {
    //   debugger
    //   console.log('uiType', uiType)
    //   console.log('attrs', attrs)
    //   console.log('this.fieldConfig', this.fieldConfig)
    // }
    switch (uiType) {
      case 'textarea':
      case 'password':
      case 'text':
      case 'number':
        const mainLength = parseInt(attrs.mainLength || 200)
        if (mainLength > 200) {
          uiType = 'textarea'
          attrs.autosize = {minRows: mainLength / 200}
          attrs.w = '100%'
        }
        if (uiType === 'password') {
          attrs.autocomplete = 'new-password'
        }
        content =
            <zinput v-model={this.innerValue} {...{attrs}} type={uiType} parent={this.parent} {...{on: listeners}} />
        break
      case 'select':
        if (this.fieldConfig.entityName) {
          listCode = this.fieldConfig.entityClassKey || 'code'
          listLabel = this.fieldConfig.entityClassLabel || 'label'
        }
        if (this.fieldConfig.notNull === 'can_null') {
          attrs.defaultFirst = false
        }
        if (attrs.javaTypeEnumClassMultiple) {
          // console.log('this.fieldConfig.valuePrefix',this.fieldConfig.valuePrefix)
          content = <zselectAppend v-model={this.innerValue} listCode={listCode} listLabel={listLabel}
                                   classname={this.fieldConfig.javaTypeEnumClassName} {...{attrs}} {...{on: listeners}}/>
        } else {
          content = <zselect v-model={this.innerValue} listCode={listCode} listLabel={listLabel}
                             classname={this.fieldConfig.javaTypeEnumClassName} {...{attrs}}{...{on: listeners}} />
        }
        break
      case 'datetime':
        content = <zdatetime v-model={this.innerValue} {...{attrs}}/>
        break
      case 'bool':
        // 搜索默认样式 zbool 下拉
        // 编辑默认样式 zswitch 下拉
        if (this.area === Areas.search) {
          content = <zbool v-model={this.innerValue} {...{attrs}} />
        } else {
          attrs.width = null
          content = <zswitch v-model={this.innerValue} {...{attrs}} />
        }
        break
      case 'file':
        content = <zuploadFile v-model={this.innerValue} module={this.tableConfig.module} w={100}
                           h={100} {...{attrs}} {...{on: listeners}} />
        break
      case 'image':
      case 'images':
        content = <zupload v-model={this.innerValue} module={this.tableConfig.module} w={100}
                           h={100} {...{attrs}} {...{on: listeners}} />
        break
      case 'radio':
        // content = <zradio v-model={this.innerValue} {...{ attrs }} />
        if (this.fieldConfig.entityName) {
          listCode = this.fieldConfig.entityClassKey || 'code'
          listLabel = this.fieldConfig.entityClassLabel || 'label'
        }
        content = <zradio v-model={this.innerValue} listCode={listCode} listLabel={listLabel}
                          classname={this.fieldConfig.javaTypeEnumClassName} {...{attrs}} {...{on: listeners}} />
        break
      case 'tinyint':
        content = <zradio v-model={this.innerValue} {...{attrs}} />
        break
      case 'richText':
        content = <Tinymce v-model={this.innerValue} module={this.tableConfig.module}
                           height='500' {...{attrs}} {...{on: listeners}} />
        break
      case 'xml':
        content = <CodeMirrorEditor v-model={this.innerValue} {...{attrs}} {...{on: listeners}} />
        break
      case 'none':
        content = {}
        break
      default:
        content = this.innerValue
    }
    // console.log('content',content)
    let changeResult = this.fieldConfig.changeResult || function (o){ return  o}
    return changeResult.call(this, content, h, this.entityInner, attrs, This.area)
  }
}
</script>
