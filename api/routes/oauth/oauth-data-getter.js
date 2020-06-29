const getService = require('../../services/utils/get-service')
class OAuthDataGetter {
  async getFacebookData (access) {
    const result = {
      email: null,
      id: null,
      name: null,
      avatar_url: null
    }
    const data = await getService.get({
      url: 'https://graph.facebook.com/v6.0/me?fields=email,name,picture.type(large)',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access.access_token}`
      },
      json: true
    })
    result.id = data.id
    result.name = data.name
    result.email = data.email
    result.avatar_url = data.picture && data.picture.data ? data.picture.data.url : undefined
    return result
  }

  async getGoogleData (access) {
    const result = {
      email: null,
      id: null,
      name: null,
      avatar_url: null
    }
    const data = await getService.get({
      url: 'https://www.googleapis.com/userinfo/v2/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access.access_token}`
      },
      json: true
    })
    result.id = data.id
    result.name = `${data.given_name} ${data.family_name}`
    result.email = data.email
    result.avatar_url = data.picture ? data.picture : undefined
    return result
  }

  async getGithubData (access) {
    const result = {
      email: null,
      id: null,
      name: null,
      avatar_url: null
    }
    const data = await getService.get({
      url: 'https://api.github.com/user',
      method: 'GET',
      headers: {
        Authorization: `token ${access.access_token}`,
        'User-Agent': 'Roomler APP'
      },
      json: true
    })

    result.id = data.id
    result.email = data.email
    result.name = data.login
    result.avatar_url = data.avatar_url
    if (!result.email) {
      const emails = await getService.get({
        url: 'https://api.github.com/user/emails',
        method: 'GET',
        headers: {
          Authorization: `token ${access.access_token}`,
          'User-Agent': 'Roomler APP'
        },
        json: true
      })
      const email = emails.find((e) => {
        return e.primary === true
      })
      result.email = email.email
    }
    return result
  }

  async getLinkedinData (access) {
    const result = {
      email: null,
      id: null,
      name: null,
      avatar_url: null
    }
    const data = await getService.get({
      url: 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access.access_token}`
      },
      json: true
    })

    result.id = data.id
    result.name = `${data.firstName.localized.en_US} ${data.lastName.localized.en_US}`
    let image = null
    if (data.profilePicture['displayImage~'].elements.length) {
      image = data.profilePicture['displayImage~'].elements[0]
    }
    const image200 = data.profilePicture['displayImage~'].elements.find(e => e.data['com.linkedin.digitalmedia.mediaartifact.StillImage'].displaySize.width === 200)
    if (image200) {
      image = image200
    }
    if (image && image.identifiers[0]) {
      result.avatar_url = image.identifiers[0].identifier
    }
    const data2 = await getService.get({
      url: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access.access_token}`
      },
      json: true
    })
    result.email = data2.elements[0]['handle~'].emailAddress
    return result
  }
}

module.exports = new OAuthDataGetter()
