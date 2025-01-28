<template>
	<div class="pa-8">
	  <input id="url" placeholder="Turn URL" type="text" value="turn:fes1-secunet-coturn.roomler.live:3478?transport=tcp" style="width: 500px">
	  <br>
	  <input id="username" placeholder="Turn Username" type="text" value="neko" style="width: 500px">
	  <br>
	  <input id="credential" placeholder="Turn Credential" type="text" value="neko" style="width: 500px">
	  <br>
	  <button @click="validate()">
		validate
	  </button>
	  <p id="content">
		I'm the content
	  </p>
	</div>
  </template>
  
  <script>
  
  export default {
	mounted () {
	  this.checkTURNServer()
	},
	methods: {
	  checkTURNServer (turnConfig, timeout) {
		return new Promise(function (resolve, reject) {
		  setTimeout(function () {
			if (promiseResolved) return
			resolve(false)
			promiseResolved = true
		  }, timeout || 5000)
  
		  var promiseResolved = false
		  const myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection // compatibility for firefox and chrome
		  const pc = new myPeerConnection({ iceServers: [turnConfig] })
		  const noop = function () { }
		  pc.createDataChannel('') // create a bogus data channel
		  pc.createOffer(function (sdp) {
			if (sdp.sdp.includes('typ relay')) { // sometimes sdp contains the ice candidates...
			  promiseResolved = true
			  resolve(true)
			}
			pc.setLocalDescription(sdp, noop, noop)
		  }, noop) // create offer and set local description
		  pc.onicecandidate = function (ice) { // listen for candidate events
			// console.log(ice);
			if (promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.includes('typ relay'))) return
			promiseResolved = true
			resolve(true)
		  }
		})
	  },
	  validate () {
		const url = document.getElementById('url').value
		const username = document.getElementById('username').value
		const credential = document.getElementById('credential').value
  
		this.checkTURNServer({
		  urls: url,
		  username,
		  credential
		})
		.then(function (bool) {
		  document.getElementById('content').textContent = 'is TURN server active? ', bool ? 'yes' : 'no'
		  console.log('is TURN server active? ', bool ? 'yes' : 'no')
		}).catch(console.error.bind(console))
	  }
	}
  }
  </script>
  