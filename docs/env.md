## Environment variables

Roomler application is configured via the following set of variables. For the sake of clarity, we will group them per function they perform.

### Application
- **URL** - Public URL of the UI (frontend) application
- **API_URL** - Public URL of the API (backend) application. In production this value is the same as **URL**, but in development they differ e.g. `URL=http://localhost:3000` and `API_URL=http://localhost:3001`

### Web Sockets
- **WS_SCALEOUT_ENABLED** - in case it is set to `true`, then your redis service is required
- **WS_SCALEOUT_HOST** - redis host name (must be in the same docker network as roomler `backend`)

### Database
- **DB_CONN** - Mongo DB connection string

### Email sending
- **SENDGRID_API_KEY** - For sending Emails via your Sendgrid API key
- **GMAIL_USER** & **GMAIL_PASSWORD** - For sending eails via your GMAIL account
- **SMTP_HOST** & **SMTP_PORT** & **SMTP_SECURE** & **SMTP_USER** & **SMTP_PASSWORD** - For sending emails via your own SMTP server

### Authentication (OAuth)
- **FACEBOOK_ID** - OAuth Facebook ID
- **FACEBOOK_SECRET** -  - OAuth Facebook Secret
- **GOOGLE_ID** - OAuth Google ID
- **GOOGLE_SECRET** - OAuth Google Secret
- **GITHUB_ID** -  OAuth Github ID
- **GITHUB_SECRET** - OAuth Github Secret
- **LINKEDIN_ID** - OAuth LinkedIn ID
- **LINKEDIN_SECRET** - OAuth LinkedIn Secret

### Video Conferencing
- **JANUS_URL** - Your Janus server public URL e.g. `wss://janus.yourdomain.com/janus_ws`
- **TURN_URL**  - Your Coturn server public URL e.g. `wss://coturn.yourdomain.com`
- **TURN_USERNAME** - Coturn Username
- **TURN_PASSWORD** - Coturn Pasword

### Chat
- **GIPHY_API_KEY** - Your Giphy API key

### Admin
- **SUPER_ADMIN_EMAILS** - Email of the Roomler Super admin, that can look in to the analyitcs routes for user visits and reports


