<script>
import zselect from '../../ui-element/zselect'
import zselectAppend from '../../ui-element/zselectAppend'
import Tinymce from '../../ui-element/Tinymce'
import zinput from '../../ui-element/zinput'
import zupload from '../../ui-element/zupload'
import zradio from '../../ui-element/zradio'
import zbool from '../../ui-element/zbool'
import zswitch from '../../ui-element/zswitch'
import zdatetime from '../../ui-element/zdatetime'
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
    if (this.fieldConfig.fieldName === 'isOnline') {
      // debugger
    }
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

    const attrs = {
      placeholder: this.area === Areas.form ? this.fieldConfig.label : this.fieldConfig.simpleLabel,
      ...(this.fieldConfig.extendProp && JSON.parse(this.fieldConfig.extendProp) || {}),
      ...this.fieldConfig,
      ...this.$attrs,
      notNull: this.fieldConfig.notNull === 'not_null',
      onChange: function (newVal, oldVal) {
        // console.log('baseField onChange')
        This.fieldConfig.onChange && This.fieldConfig.onChange(newVal, oldVal, This.entity)
      },
      ...this.params,
    }
    const render = this.fieldConfig.render
    if (render && this.entityInner) {
      // console.log(`baseField Value ${this.fieldConfig.fieldName} area=${This.area}`)
      return render.call(this, h, this.entityInner, attrs, This.area)
    }
    if (this.option === Option.insert) {
      attrs.disabled = false
      // return <div>{attrs.disabled}</div>
    }
    if (attrs.disabled) {
      attrs.placeholder = ''
    }
    attrs.size = attrs.size || (this.area === Areas.search ? 'small' : null)
    // console.log('attrs', attrs)
    let listCode
    let listLabel
    delete attrs['type']
    let content = {}
    let uiType = attrs.uiType || 'text'
    // uiType = 'text'
    switch (uiType) {
      case 'textarea':
      case 'password':
      case 'text':
      case 'number':
        const mainLength = parseInt(this.area === Areas.search ? 200 : (this.fieldConfig.mainLength || 200))
        if (mainLength > 200) {
          uiType = 'textarea'
          attrs.autosize = {minRows: mainLength / 200}
          attrs.w = '100%'
        }
        if (uiType === 'password') {
          attrs.autocomplete = 'new-password'
        }
        content = <zinput v-model={this.innerValue} {...{attrs}} type={uiType} parent={this.parent}/>
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
                                   classname={this.fieldConfig.javaTypeEnumClassName} {...{attrs}} {...{on: This.$listeners}}
                                   onInput={attrs.onChange}/>
        } else {
          content = <zselect v-model={this.innerValue} listCode={listCode} listLabel={listLabel}
                             classname={this.fieldConfig.javaTypeEnumClassName} {...{attrs}} {...{on: This.$listeners}}
                             onInput={attrs.onChange}/>
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
      case 'image':
      case 'images':
        content = <zupload v-model={this.innerValue} module={this.tableConfig.module} w={100} h={100} {...{attrs}} />
        break
      case 'radio':
        // content = <zradio v-model={this.innerValue} {...{ attrs }} />
        if (this.fieldConfig.entityName) {
          listCode = this.fieldConfig.entityClassKey || 'code'
          listLabel = this.fieldConfig.entityClassLabel || 'label'
        }
        content = <zradio v-model={this.innerValue} listCode={listCode} listLabel={listLabel}
                          classname={this.fieldConfig.javaTypeEnumClassName} {...{attrs}} {...{on: This.$listeners}}
                          onInput={attrs.onChange}/>
        break
      case 'tinyint':
        content = <zradio v-model={this.innerValue} {...{attrs}} />
        break
      case 'richText':
        content = <Tinymce v-model={this.innerValue} module={this.tableConfig.module} height='500' {...{attrs}} />
        break
      case 'none':
        content = {}
        break
      default:
        content = this.innerValue
    }
    // console.log('content',content)
    return content
  }
}
</script>
