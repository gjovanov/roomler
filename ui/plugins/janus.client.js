import Janus from '@/lib/janus'

export default ({
  app
}, inject) => {
  inject('Janus', Janus)
}
