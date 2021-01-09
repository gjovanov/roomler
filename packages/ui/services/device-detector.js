/* eslint-disable no-useless-escape */

class DeviceDetector {
  constructor () {
    this.isMobileDevice = !!(/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent || ''))
    this.isEdge = navigator.userAgent.includes('Edg')// && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob)
    this.isOpera = !!window.opera || navigator.userAgent.includes(' OPR/')
    this.isFirefox = navigator.userAgent.toLowerCase().includes('firefox') && ('netscape' in window) && / rv:/.test(navigator.userAgent)
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    this.isChrome = !!window.chrome && !this.isOpera
    this.isIE = typeof document !== 'undefined' && !!document.documentMode && !this.isEdge
  }

  getBrowser () {
    // const nVer = navigator.appVersion
    const nAgt = navigator.userAgent
    let browserName = navigator.appName
    let fullVersion = '' + parseFloat(navigator.appVersion)
    let majorVersion = parseInt(navigator.appVersion, 10)
    let nameOffset, verOffset, ix

    // In Opera, the true version is after 'Opera' or after 'Version'
    if (this.isOpera) {
      browserName = 'Opera'
      try {
        fullVersion = navigator.userAgent.split('OPR/')[1].split(' ')[0]
        majorVersion = fullVersion.split('.')[0]
      } catch (e) {
        fullVersion = '0.0.0.0'
        majorVersion = 0
      }
    } else if (this.isIE) {
      // In MSIE version <=10, the true version is after 'MSIE' in userAgent
      // In IE 11, look for the string after 'rv:'
      verOffset = nAgt.indexOf('rv:')
      if (verOffset > 0) { // IE 11
        fullVersion = nAgt.substring(verOffset + 3)
      } else { // IE 10 or earlier
        verOffset = nAgt.indexOf('MSIE')
        fullVersion = nAgt.substring(verOffset + 5)
      }
      browserName = 'IE'
    } else if (this.isChrome) {
      // In Chrome, the true version is after 'Chrome'
      verOffset = nAgt.indexOf('Chrome')
      browserName = 'Chrome'
      fullVersion = nAgt.substring(verOffset + 7)
    } else if (this.isSafari) {
      // In Safari, the true version is after 'Safari' or after 'Version'
      // both and safri and chrome has same userAgent
      if (nAgt.includes('CriOS')) {
        verOffset = nAgt.indexOf('CriOS')
        browserName = 'Chrome'
        fullVersion = nAgt.substring(verOffset + 6)
      } else if (nAgt.includes('FxiOS')) {
        verOffset = nAgt.indexOf('FxiOS')
        browserName = 'Firefox'
        fullVersion = nAgt.substring(verOffset + 6)
      } else {
        verOffset = nAgt.indexOf('Safari')

        browserName = 'Safari'
        fullVersion = nAgt.substring(verOffset + 7)

        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
          fullVersion = nAgt.substring(verOffset + 8)
        }

        if (navigator.userAgent.includes('Version/')) {
          fullVersion = navigator.userAgent.split('Version/')[1].split(' ')[0]
        }
      }
    } else if (this.isFirefox) {
      // In Firefox, the true version is after 'Firefox'
      verOffset = nAgt.indexOf('Firefox')
      browserName = 'Firefox'
      fullVersion = nAgt.substring(verOffset + 8)
    } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
      // In most other browsers, 'name/version' is at the end of userAgent
      browserName = nAgt.substring(nameOffset, verOffset)
      fullVersion = nAgt.substring(verOffset + 1)

      if (browserName.toLowerCase() === browserName.toUpperCase()) {
        browserName = navigator.appName
      }
    }

    if (this.isEdge) {
      browserName = 'Edge'
      const delimiter = navigator.userAgent.includes('Edge/') ? 'Edge/' : 'Edg/'
      fullVersion = navigator.userAgent.split(delimiter)[1]
      // fullVersion = parseInt(navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)[2], 10).toString();
    }

    // trim the fullVersion string at semicolon/space/bracket if present
    if ((ix = fullVersion.search(/[; \)]/)) !== -1) {
      fullVersion = fullVersion.substring(0, ix)
    }

    majorVersion = parseInt('' + fullVersion, 10)

    if (isNaN(majorVersion)) {
      fullVersion = '' + parseFloat(navigator.appVersion)
      majorVersion = parseInt(navigator.appVersion, 10)
    }

    return {
      fullVersion,
      version: majorVersion,
      name: browserName,
      isPrivateBrowsing: false
    }
  }

  getOs () {
    const unknown = '-'

    const nVer = navigator.appVersion
    const nAgt = navigator.userAgent

    let name = unknown
    const clientStrings = [{
      s: 'Chrome OS',
      r: /CrOS/
    }, {
      s: 'Windows 10',
      r: /(Windows 10.0|Windows NT 10.0)/
    }, {
      s: 'Windows 8.1',
      r: /(Windows 8.1|Windows NT 6.3)/
    }, {
      s: 'Windows 8',
      r: /(Windows 8|Windows NT 6.2)/
    }, {
      s: 'Windows 7',
      r: /(Windows 7|Windows NT 6.1)/
    }, {
      s: 'Windows Vista',
      r: /Windows NT 6.0/
    }, {
      s: 'Windows Server 2003',
      r: /Windows NT 5.2/
    }, {
      s: 'Windows XP',
      r: /(Windows NT 5.1|Windows XP)/
    }, {
      s: 'Windows 2000',
      r: /(Windows NT 5.0|Windows 2000)/
    }, {
      s: 'Windows ME',
      r: /(Win 9x 4.90|Windows ME)/
    }, {
      s: 'Windows 98',
      r: /(Windows 98|Win98)/
    }, {
      s: 'Windows 95',
      r: /(Windows 95|Win95|Windows_95)/
    }, {
      s: 'Windows NT 4.0',
      r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
    }, {
      s: 'Windows CE',
      r: /Windows CE/
    }, {
      s: 'Windows 3.11',
      r: /Win16/
    }, {
      s: 'Android',
      r: /Android/
    }, {
      s: 'Open BSD',
      r: /OpenBSD/
    }, {
      s: 'Sun OS',
      r: /SunOS/
    }, {
      s: 'Linux',
      r: /(Linux|X11)/
    }, {
      s: 'iOS',
      r: /(iPhone|iPad|iPod)/
    }, {
      s: 'Mac OS X',
      r: /Mac OS X/
    }, {
      s: 'Mac OS',
      r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
    }, {
      s: 'QNX',
      r: /QNX/
    }, {
      s: 'UNIX',
      r: /UNIX/
    }, {
      s: 'BeOS',
      r: /BeOS/
    }, {
      s: 'OS/2',
      r: /OS\/2/
    }, {
      s: 'Search Bot',
      r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
    }]
    for (let i = 0; i < clientStrings.length; i++) {
      const cs = clientStrings[i]
      if (cs.r.test(nAgt)) {
        name = cs.s
        break
      }
    }

    let version = unknown

    if (/Windows/.test(name)) {
      if (/Windows (.*)/.test(name)) {
        version = /Windows (.*)/.exec(name)[1]
      }
      name = 'Windows'
    }

    switch (name) {
      case 'Mac OS X':
        if (/Mac OS X (10[\.\_\d]+)/.test(nAgt)) {
          version = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1]
        }
        break
      case 'Android':
        if (/Android ([\.\_\d]+)/.test(nAgt)) {
          version = /Android ([\.\_\d]+)/.exec(nAgt)[1]
        }
        break
      case 'iOS':
        if (/OS (\d+)_(\d+)_?(\d+)?/.test(nAgt)) {
          version = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer)
          version = version[1] + '.' + version[2] + '.' + (version[3] | 0)
        }
        break
    }

    return {
      name,
      version
    }
  }
}

export default DeviceDetector
