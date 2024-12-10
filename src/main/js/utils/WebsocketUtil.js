// import * as Stomp from 'webstomp-client'

const URL = '/api/websocket/server'
// 是否开启websocket
const webSocketClose = false // 开关

// 负责连接的客户端
let stompClient = null
let connecting = false// 与java连接的期间,并发调用connect方法时,连接成功后只成功订阅其中一份方法
// 已经订阅的
const subscriberMap = {}

// 连接 [并订阅subscribers]
const connect = async(token, subscribers) => {
  if (webSocketClose) return
  if (!connecting) {
    if (!stompClient) {
      // heartbeat 心跳, 配置2秒,但超时要7/8秒才会能重连并收到通知
      stompClient = Stomp.over(new SockJS(URL + '?token=' + token), { debug: false, heartbeat: { outgoing: 2000, incoming: 2000 }})
      stompClient.debug = null
      // stompClient.reconnect_delay = 5000;
    }
    if (connected()) {
      return subscribes(subscribers)
    } else {
      return await new Promise((resolve) => {
        connecting = true
        // 定义客户端的认证信息,按需求配置
        // const headers = {
        //   Authorization: token
        // }

        stompClient.connect({}, function() {
          connecting = false
          console.log('websocket连接成功.' + URL)
          resolve(subscribes(subscribers))
        }, function errorCallBack(error) {
          // 连接失败时（服务器响应 ERROR 帧）的回调方法
          console.error('socket连接失败', error)
          // 重连
          setTimeout(function() {
            connecting = false
            disconnect()
            connect(subscribers)
          }, 2000)
        })
      })
    }
  } else {
    setTimeout(function() {
      connect(subscribers)
    }, 1000)
  }
}
// 断开连接(≈刷新页面)
const disconnect = () => {
  if (webSocketClose) return
  if (connected()) {
    for (const key in subscriberMap) {
      unsubscribe(key)
    }
    stompClient.disconnect()
    stompClient = null
    console.info('websocket断开连接.')
  }
}
// 订阅
const subscribes = (newSubscribers) => {
  if (webSocketClose) return
  if (newSubscribers) {
    if (stompClient == null || !stompClient.connected) {
      return connect(newSubscribers)
    } else {
      const list = []
      for (const sub of newSubscribers) {
        const topic = sub.topic
        const keys = Object.keys(subscriberMap)
        if (keys.indexOf(topic) < 0) {
          const result = stompClient.subscribe(topic, sub.topicFn)
          console.log('订阅' + topic)
          subscriberMap[topic] = result
          list.push(result)
        }
      }

      return list
    }
  }
}
// 取消订阅
const unsubscribe = (topic) => {
  if (webSocketClose) return
  const sub = subscriberMap[topic]
  if (sub && stompClient && stompClient.connected) {
    console.log('取消订阅' + topic)
    stompClient.unsubscribe(sub.id)
    delete subscriberMap[topic]
  }
}
export function connected() {
  return stompClient && stompClient.connected
}
export default {
  methods: {
    connect,
    disconnect,
    subscribes,
    unsubscribe
  }
}
export const eventBus = new Vue()

