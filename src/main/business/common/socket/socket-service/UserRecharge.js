import SocketBaseService from '../SocketBaseService'
import {eventBus} from "../../../../../main/js/utils/WebsocketUtil";
import FileUtil from "../../../../../main/js/utils/FileUtil";

export default class UserRecharge extends SocketBaseService {
  // doUpdate = (dataEntity, opt, data, store) => {
  //   alert('common/UserRecharge')
  // }
  doSaveOrUpdateMore = (dataEntity, opt, data, store) => {
      FileUtil.playAudio(`/static/wav/${dataEntity}.mp3`)
      eventBus.$emit(`socket_${dataEntity}_${opt}`, data)
  }
}

export const instance = new UserRecharge()
