/**
 * lineheight 1.1v
 * The tinymce-plugins is used to set the line spacing
 *
 * https://github.com/Five-great/tinymce-plugins
 *
 * Copyright 2020, Five(Li Hailong) The Chengdu, China https://www.fivecc.cn/
 *
 * Licensed under MIT
 */
tinymce.PluginManager.add('paddingRight', function(editor, url) {
  var pluginName = '设置右边距'
  var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')
  var lineheight_val = editor.getParam('lineheight_val', '0 4px 8px 12px 16px 20px 24px 28px 32px 36px 40px')
  editor.on('init', function() {
    editor.formatter.register({
      paddingRight: {
        // inline: 'span',
        selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table',
        styles: { 'padding-right': '%value' }
      }
    })
  })
  var doAct = function(value) {
    editor.undoManager.transact(function() {
      editor.focus()
      console.log('do paddingRight')
      editor.formatter.apply('paddingRight', { value: value })
      // editor.formatter.apply('paddingRight', { value: parseInt(value) * 4 });
    })
  }
  editor.ui.registry.getAll().icons.lineheight || editor.ui.registry.addIcon('paddingRight', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.984 12.984v-1.969h12v1.969h-12zM9.984 18.984v-1.969h12v1.969h-12zM9.984 5.016h12v1.969h-12v-1.969zM6 6.984v10.031h2.484l-3.469 3.469-3.516-3.469h2.484v-10.031h-2.484l3.516-3.469 3.469 3.469h-2.484z"></path></svg>')
  editor.ui.registry.addMenuButton('paddingRight', {
    // icon: 'paddingRight',
    text: 'paddingRight',
    tooltip: pluginName,
    fetch: function(callback) {
      var dom = editor.dom
      var blocks = editor.selection.getSelectedBlocks()
      var lhv = 0
      global$1.each(blocks, function(block) {
        if (lhv == 0) {
          lhv = dom.getStyle(block, 'padding-right') ? dom.getStyle(block, 'padding-right') : 0
        }
      })
      var items = lineheight_val.split(' ').map(function(item) {
        var text = item
        var value = item
        return {
          type: 'togglemenuitem',
          text: text,
          active: lhv == value,
          onAction: function() {
            doAct(value)
          }
        }
      })
      callback(items)
    }
  })
  return {
    getMetadata: function() {
      return {
        name: pluginName,
        url: 'https://github.com/Five-great/tinymce-plugins'
      }
    }
  }
})
