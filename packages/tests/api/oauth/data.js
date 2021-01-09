module.exports = {
  invalidId: 'blabla',
  user1: {
    payload: {
      username: 'oauthuser1',
      email: 'oauthuser1@oauthtest.com',
      password: '12345678',
      passwordConfirm: '12345678'
    }
  },
  oauth1: {
    facebook: {
      me: {
        email: 'oauthuser1@oauthtest.com',
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
    },
    google: {
      me: {
        email: 'oauthuser1@oauthtest.com',
        name: 'Google User1',
        given_name: 'Google',
        family_name: 'User1',
        picture: 'https://google.com'
      }
    },
    github: {
      me: {
        email: 'oauthuser1@oauthtest.com',
        name: 'Github User1',
        login: 'Github User1',
        avatar_url: 'https://google.com'
      },
      email: [{
        email: 'oauthuser1@oauthtest.com',
        primary: true
      }]
    },
    linkedin: {
      me: {
        email: 'oauthuser1@oauthtest.com',
        name: 'Linkedin User1',
        firstName: {
          localized: {
            en_US: 'Linkedin'
          }
        },
        lastName: {
          localized: {
            en_US: 'User1'
          }
        },
        profilePicture: {
          'displayImage~': {
            elements: [
              {
                identifiers: [{ identifier: 'https://google.com' }],
                data: {
                  'com.linkedin.digitalmedia.mediaartifact.StillImage': {
                    displaySize: {
                      width: 200
                    }
                  }
                }
              }
            ]
          }
        }
      },
      email: {
        elements: [
          {
            'handle~': {
              emailAddress: 'oauthuser1@oauthtest.com'
            }
          }
        ]
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
