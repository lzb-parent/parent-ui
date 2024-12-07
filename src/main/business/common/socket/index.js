import WebsocketUtil from '../../../js/utils/WebsocketUtil'
import ObjectUtil from '../../../js/utils/ObjectUtil'
import { instance as socketBaseService } from './SocketBaseService'

// 加载所有service
let socketServices = {}

// 加载登录信息
export async function initSocket(store, subscribers = []) {
  socketServices = {
    ...await ObjectUtil.loadModules(require.context('@/parent-ui/src/main/business/common/socket/socket-service/', true, /\.js$/), 'instance'),
    ...await ObjectUtil.loadModules(require.context('@/socket/socket-service/', true, /\.js$/), 'instance'),
  }

  // 订阅websocket
  WebsocketUtil.methods.connect(store.get('token'), [
    {
      // 通用topic通道
      topic: '/defaultTopic',
      topicFn: (res) => {
        console.debug(`收到socket消息:${res.body}`)
        const data = JSON.parse(res.body)
        // 执行websocket接收
        executeEntity(data.dataClass, data.opt, data.data, store)
      }
    },
    ...subscribers
  ]
  )
}

function executeEntity(dataClass, opt, data, store) {
  // 3.socket-service 实现 (比如,弹窗,声音,小红点,累加等定制需求)
  const service = socketServices[dataClass] || socketBaseService
  if (service) {
    const fun = service[opt]
    if (fun) {
      return fun(dataClass, opt, data, store)
    }
  }
}
