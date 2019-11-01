export default function ({ route, redirect }) {
  if (route.params.roomname && route.name === 'roomname') {
    return redirect(`/${route.params.roomname}/messages`)
  }
}
