module.exports = {
  url: process.env.ASTERISK_URL || undefined,
  ariUrl: process.env.ASTERISK_ARI_URL || undefined,
  ariUsername: process.env.ASTERISK_ARI_USERNAME || undefined,
  ariPassword: process.env.ASTERISK_ARI_PASSWORD || undefined,
  ariApplication: process.env.ASTERISK_ARI_APP || 'roomler-app',
  ariGenerateAccounts: process.env.ASTERISK_ARI_GENERATE_ACCOUNTS === 'true' || false
}
