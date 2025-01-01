import { eventBus } from '../../../js/utils/WebsocketUtil'
import FileUtil from '../../../js/utils/FileUtil'

export default class SocketBaseService {
  /**
   * 新增实体推送
   */
  doInsert = (dataEntity, opt, data, store) => {
    this.doSaveOrUpdate(dataEntity, opt, data, store)
  }

  /**
   * 修改实体推送
   */
  doUpdate = (dataEntity, opt, data, store) => {
    this.doSaveOrUpdate(dataEntity, opt, data, store)
  }

  /**
   * 删除实体推送
   */
  doDelete = (dataEntity, opt, data, store) => {
    this.doSaveOrUpdate(dataEntity, opt, data, store)
  }

  doSaveOrUpdate = (dataEntity, opt, data, store) => {
    // alert('common SocketBaseService doSaveOrUpdate')
    //   eventBus.$emit(`socket_${dataEntity}_${opt}`, data)
    // 推送消息给其他vue组件
    //   vue组件监听:
    //   mounted() {
    //     // 组件挂载时开始监听事件
    //     eventBus.$on(`get${dataEntity}Msg`, handleWebSocketMessage)
    //   },
    //   beforeDestroy() {
    //     // 组件卸载时移除事件监听器
    //     eventBus.$off(`get${dataEntity}Msg`, handleWebSocketMessage)
    //   }
    console.log(`doSaveOrUpdateMore ${dataEntity}`, data)
    this.doSaveOrUpdateMore(dataEntity, opt, data, store)
  }
  doSaveOrUpdateMore=(dataEntity, opt, data, store)=>{
    eventBus.$emit(`get${dataEntity}Msg`, data)
    switch (opt) {
      case 'doInsert':
      case 'doUpdate':
        store.commit('setState', { key: `${dataEntity}s`, value: data })
        break
      case 'doDelete':
        store.commit('setState', { key: `${dataEntity}s`, value: [] })
        break
      default:
    }
  }
}

export const instance = new SocketBaseService()
