export default function ({
  store,
  redirect
}) {
  if (!store.getters['api/auth/isAuthenticated']) {
    return redirect('/-/auth/login')
  }
}
