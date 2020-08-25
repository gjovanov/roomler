// Listen to Push
self.addEventListener('push', (e) => {
  let data = ''
  if (!e.data) {
    return
  }
  data = e.data.text()
  const options = {
    body: data,
    vibrate: [300, 200, 300]
  }
  e.waitUntil(self.registration.showNotification('Roomler: New notification', options))
})
