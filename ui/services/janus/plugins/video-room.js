import Handle from '@/services/janus/handle'

export default class VideoRoom extends Handle {
  // HANDLERS - START
  onmessage (msg, jsep) {
    super.onmessage(msg, jsep)
  }

  joinedHandler (msg) {
    const self = this
    if (msg.videoroom === 'joined') {
      self.myid = msg.id
      self.myprivateid = parseInt(msg.private_id)
      self.createOffer()
    }
  }

  publishersHandler (msg) {
    const self = this
    if (msg.publishers !== undefined && msg.publishers !== null) {
      const publishers = msg.publishers
      // Play sound when someone join the room
      if (publishers.length > 0) {
        // document.getElementById('joinSound').play() // TODO: move to the UI side
        for (const p in publishers) {
          const id = publishers[p].id
          const display = publishers[p].display
          const args = {
            plugin: self.plugin,
            roomid: self.roomid,
            display,
            ptype: 'subscriber',
            id,
            myprivateid: self.myprivateid,

            sendAudio: self.sendAudio,
            sendVideo: self.sendVideo,
            sendData: self.sendData,
            sendScreen: self.sendScreen,

            receiveAudio: self.receiveAudio,
            receiveVideo: self.receiveVideo,
            receiveData: self.receiveData
          }
          console.log(`Subscribing to handle: display=${display}, plugin=${self.plugin}, id=${id}`)
          self.session.attach(args)
        }
      }
    }
  }

  configuredHandler (msg) {
    if (msg.configured === 'ok') {
      console.log(`Configuration has finished: display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    }
  }

  leavingHandler (msg) {
    if (msg.leaving !== undefined && msg.leaving !== null) {
      console.log(`Handle left: leaving=${msg.leaving}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    }
  }

  unpublishedHandler (msg) {
    const self = this
    if (msg.unpublished !== undefined && msg.unpublished !== null) {
      const unpublished = msg.unpublished
      console.log(`Handle unpublished: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
      if (unpublished === 'ok') {
        // That's us
        self.streamUrl = null
      } else {
        const remoteHandle = self.session.handles.find((handle) => {
          return handle.subscriberId === unpublished
        })
        if (remoteHandle) {
          return remoteHandle.detach().then(() => {
            const index = self.session.handles.indexOf(remoteHandle)
            self.session.handles.splice(index, 1)
          })
        }
      }
    }
  }

  attachedHandler (msg) {
    if (msg.videoroom === 'attached') {
      console.log(`Handle attached: display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
      this.subscriberId = msg.id
    }
  }

  jsepHandler (jsep) {
    const self = this
    if (self.handle && jsep) {
      console.log(`Handling JSEP: JSEP=${jsep}, display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
      self.createAnswer(jsep)
    }
  }

  destroyedHandler (msg) {
    if (msg.videoroom === 'destroyed') {
      console.log(`Handle destroyed: display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    }
  }

  errorHandler (msg) {
    if (msg.error !== undefined && msg.error !== null) {
      console.log(`Handle error: message=${msg.error}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    }
  }

  // HANDLERS - END

  createRoom (room) {
    const self = this
    console.log(`Creating room has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    return new Promise((resolve, reject) => {
      self.handle.send({
        message: room,
        success: (data) => {
          self.room = data
          resolve(self)
          console.log(`Creating room has finished: room=${data}, display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  existingRoom (roomid) {
    const self = this
    console.log(`Checking existing room has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    return new Promise((resolve, reject) => {
      const data = {
        request: 'exists',
        room: parseInt(roomid)
      }
      self.handle.send({
        message: data,
        success: (data) => {
          resolve(data)
          console.log(`Checking existing room has finished: result=${data}, display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  listRooms () {
    const self = this
    console.log(`Listing rooms has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    return new Promise((resolve, reject) => {
      const data = {
        request: 'list'
      }
      self.handle.send({
        message: data,
        success: (rooms) => {
          resolve(rooms)
          console.log(`Listing rooms has finished: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  destroyRoom (roomid, secret) {
    const self = this
    console.log(`Destroying room has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    return new Promise((resolve, reject) => {
      const data = {
        request: 'destroy',
        room: parseInt(roomid),
        secret
      }
      self.handle.send({
        message: data,
        success: () => {
          resolve(self)
          console.log(`Destroying room has finished: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  joinRoom (options, stream) {
    const self = this
    console.log(`Joining room has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    self.desktopStream = stream || null
    return new Promise((resolve, reject) => {
      self.handle.send({
        message: {
          request: 'join',
          room: self.roomid,
          ptype: options.ptype,
          display: self.display,
          private_id: self.private_id,
          feed: self.feedId
        },
        success: () => {
          resolve(self)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  createOffer () {
    const self = this
    console.log(`Creating offer has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    return new Promise((resolve, reject) => {
      console.log('Creating offer...')
      self.handle.createOffer({
        iceRestart: self.iceRestart,
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: self.sendAudio,
          videoSend: self.sendVideo,
          data: self.sendData
        },
        simulcast: self.simulcast,
        trickle: self.trickle,
        stream: self.stream ? self.stream : null,
        success: (jsep) => {
          console.log(`Creating offer has started: JSEP=${jsep}, display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
          self.handle.send({
            message: {
              request: 'configure',
              audio: self.sendAudio,
              video: self.sendVideo,
              data: self.sendData
            },
            jsep
          })
          resolve(self)
        },
        error: (error) => {
          console.log('Create Offer error:', error)
          reject(error)
        }
      })
    })
  }

  createAnswer (jsep) {
    const self = this
    console.log(`Creating answer has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    return new Promise((resolve, reject) => {
      self.handle.createAnswer({
        jsep,
        media: {
          audioSend: false,
          videoSend: false,
          audioRecv: self.receiveAudio,
          videoRecv: self.receiveVideo,
          data: self.receiveData
        },

        success: (jsep) => {
          console.log(`Creating answer has finished: JSEP=${jsep}, display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
          self.handle.send({
            message: {
              request: 'start',
              room: self.roomid
            },
            jsep
          })
          resolve(self)
        },
        error: (error) => {
          console.log('Create Answer error:', error)
          reject(error)
        }
      })
    })
  }

  unpublish () {
    const self = this
    console.log(`Unpublishing has started: display=${self.display}, plugin=${self.plugin}, id=${self.id}`)
    return new Promise((resolve, reject) => {
      const unpublish = {
        request: 'unpublish'
      }

      self.handle.send({
        message: unpublish,
        success: () => {
          resolve(self)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }
}
