export const actions = {
  register ({
    commit
  }, { handleDto, payload }) {
    payload.request = 'register'
    return new Promise((resolve, reject) => {
      handleDto.handle.send({
        message: payload,
        success: (data) => {
          if (data && data.error) {
            reject(data.error)
          } else {
            resolve(data)
          }
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  },

  call ({
    commit
  }, { handleDto, jsep }) {
    return new Promise((resolve, reject) => {
      const request = {
        request: 'call',
        uri: handleDto.sip.call.uri
      }
      handleDto.handle.send({
        jsep,
        message: request,
        success: (data) => {
          if (data && data.error) {
            reject(data.error)
          } else {
            resolve()
          }
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }
}
