import VideoRoom from '@/services/janus/plugins/video-room'

export default class HandleFactory {
  static create (args) {
    if (!args || !args.plugin) {
      throw new Error('Plugin needs to be specified')
    }
    if (args.plugin === require('@@/config').janusSettings.plugins.videoroom) {
      return new VideoRoom(args)
    }
    // TODO: Add other plugins
  }
}
