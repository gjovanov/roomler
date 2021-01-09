module.exports = {
  contact: process.env.WEB_PUSH_CONTACT || undefined,
  publicKey: process.env.WEB_PUSH_PUBLISH_KEY || undefined,
  privateKey: process.env.WEB_PUSH_PRIVATE_KEY || undefined
}
