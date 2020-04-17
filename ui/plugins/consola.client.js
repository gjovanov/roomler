import consola from 'consola'

export default ({
  app
}, inject) => {
  inject('consola', consola)
}
