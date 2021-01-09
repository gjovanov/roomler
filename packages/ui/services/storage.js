class Storage {
  constructor () {
    this.localStorage = {}
    this.sessionStorage = {}
    this.cookieStorage = {
      cookie: ''
    }
    if (typeof window !== 'undefined') {
      this.localStorage = window.localStorage
      this.sessionStorage = window.sessionStorage
    }
    if (typeof document !== 'undefined') {
      this.cookieStorage = document
    }
  }

  get (key) {
    let cookieValue = this.cookieStorage.cookie.split(';').filter(function (item) {
      return item.includes(`${key}=`)
    })
    if (cookieValue) {
      cookieValue = cookieValue.toString().replace(`${key}=`, '').trim()
    }
    return cookieValue || this.sessionStorage[key] || this.localStorage[key]
  }

  getSession (key) {
    return this.sessionStorage[key]
  }

  getLocal (key) {
    return this.localStorage[key]
  }

  removeSession (key) {
    this.sessionStorage.removeItem(key)
  }

  removeLocal (key) {
    this.localStorage.removeItem(key)
  }

  setSession (key, value) {
    this.sessionStorage[key] = value
  }

  setLocal (key, value) {
    this.localStorage[key] = value
  }

  setCookie (key, value, expiration) {
    const expire = new Date(new Date().getTime() + expiration * 24 * 60 * 60 * 1000)
    this.cookieStorage.cookie = `${key}=${value};expires= ${expire};path=/`
  }

  removeCookie (key) {
    this.setCookie(key, '', -2)
  }

  set (key, value, rememberMe) {
    this.setCookie(key, value, 14)
    if (rememberMe) {
      this.localStorage[key] = value
    } else {
      this.sessionStorage[key] = value
    }
  }

  clear (key) {
    this.removeCookie(key)
    if (this.localStorage.removeItem) {
      this.localStorage.removeItem(key)
    }
    if (this.sessionStorage.removeItem) {
      this.sessionStorage.removeItem(key)
    }
    return true
  }
}

export const storage = new Storage()
