
// https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
class HistoryPatch {
  constructor () {
    history.pushState = (f => function pushState () {
      const ret = f.apply(this, arguments)
      window.dispatchEvent(new Event('pushstate'))
      window.dispatchEvent(new Event('locationchange'))
      return ret
    })(history.pushState)

    history.replaceState = (f => function replaceState () {
      const ret = f.apply(this, arguments)
      window.dispatchEvent(new Event('replacestate'))
      window.dispatchEvent(new Event('locationchange'))
      return ret
    })(history.replaceState)

    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'))
    })
  }
}

export default HistoryPatch
