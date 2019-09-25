module.exports = {
  invalidId: 'blabla',
  user1: {
    payload: {
      username: 'facebookuser1',
      email: 'facebookuser1@facebook.com',
      password: '12345678',
      passwordConfirm: '12345678'
    }
  },
  oauth1: {
    facebook: {
      me: {
        email: 'facebookuser1@facebook.com',
        name: 'Facebook User1',
        picture: {
          data: {
            height: 200,
            is_silhouette: false,
            url: 'https://facebook.com',
            width: 200
          }
        }
      },
      update: {
        email: 'facebookuser1_@facebook.com',
        name: 'Facebook User1_'
      }
    }
  },
  user2: {
    payload: {
      username: 'facebookuser2',
      email: 'facebookuser2@facebook.com',
      password: '12345678',
      passwordConfirm: '12345678'
    }
  },
  oauth2: {
    facebook: {
      me: {
        email: 'facebookuser2@facebook.com',
        name: 'Facebook User2',
        picture: {
          data: {
            height: 200,
            is_silhouette: false,
            url: 'https://facebook.com',
            width: 200
          }
        }
      }
    }
  },
  user3: {
    payload: {
      username: 'facebookuser3',
      email: 'facebookuser3@facebook.com',
      password: '12345678',
      passwordConfirm: '12345678'
    }
  },
  oauth3: {
    facebook: {
      me: {
        email: 'facebookuser3@facebook.com',
        name: 'Facebook User3',
        picture: {
          data: {
            height: 200,
            is_silhouette: false,
            url: 'https://facebook.com',
            width: 200
          }
        }
      }
    }
  },
  oauthInvalid: {
    facebook: {
      me: {
        name: 'Facebook User3'
      }
    }
  },
  oauthUnsupportedType: {
    unsupported: {
      me: {
        email: 'facebookuser4@unsupported.com',
        name: 'Unsupported User3'
      }
    }
  }
}
