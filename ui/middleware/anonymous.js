export default function ({
  store,
  redirect
}) {
  if (this.$store.getters['auth/isAuthenticated']) {
    return redirect('/')
  }
}
