export default function ({ route, redirect }) {
  if (route.params.room && route.name === 'room') {
    return redirect(`/${route.params.room}/chat`)
  }
}
