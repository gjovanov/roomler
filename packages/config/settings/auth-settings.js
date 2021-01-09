module.exports = {
  superAdminEmails: process.env.SUPER_ADMIN_EMAILS ? JSON.parse(process.env.SUPER_ADMIN_EMAILS) : [],
  codeValidityInMinutes: 5,
  userActivationPage: '/-/auth/activate',
  updatePasswordPage: '/-/update/password',
  updateUsernamePage: '/-/update/username',
  inviteAcceptPage: '/-/invite/accept',
  inviteRejectPage: '/-/invite/reject'
}
