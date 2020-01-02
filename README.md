# WARNING
THIS PROJECT IS STILL HEAVILY IN DEVELOPMENT. USE ONLY IF U HAVE THE BALLS (PARDON MY FRENCH LADIES) AND DARE TO DIVE INTO THE UNKNOWN :)

# Roomler

> Roomler.Live - Live video collaboration tool using WebRTC (Janus Gateway)



# Install packages
``` bash
# install dependencies
$ npm i
```

# Prerequisites
Before you run the app either in DEVELOPMENT, PRODUCTION mode or even run any of the TESTS, you need to setup couple of environment variables used in `/config/index.js`:

## Email setting
You have the following options to configure your app to send emails e.g. Activation link, Welcome email, Password change email etc.
1. SENDGRID account: `SENDGRID_API_KEY`
2. GMAIL account: `GMAIL_USER` and `GMAIL_PASSWORD`, but before sending your email using gmail you have to allow non secure apps to access gmail you can do this by going to your gmail settings [here](https://myaccount.google.com/lesssecureapps).
3. SMTP server you have access to: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER` and `SMTP_PASSWORD`

Please note that only one of those 3 options is needed to be properly setup in the exact order as above.

## Database setting
For running on localhost and you have MongodDB server instance also stared on localhost, this is not needed, otherwise your will need to provide the DB URL in the env variable `DB_CONN`

## DNS settings
Since you have the options to run two separate Fastify servers:
1. UI server (for rendering UI app using NuxtJS)
2. API server (for API calls)

then you might want to configure the environment variables `URL` for the UI and `API_URL` for the API server respectively.

On localhost, the default setting for these env variables is `URL=http://localhost:3000` and `API_URL=http://localhost:3001`


# Development
## Start in development mode

``` bash
# Start API server (localhost:3001)
$ npm run dev:api

# Start UI server (localhost:3000)
$ npm run dev:ui
```

# Production
## Start in production mode

``` bash
# build for production and launch server
$ npm run build
$ npm start
```

## Start using docker
```
docker run -d --name roomler \
    --hostname roomler \
    --restart always \
    -e API_URL=https://roomler.live \
    -p 8082:3000 \
    -e DB_CONN=YOUR_DB_CONN \
    -e SENDGRID_API_KEY=YOUR_SEND_GRID_KEY \
    -e FACEBOOK_ID=YOUR_FACEBOOK_ID \
    -e FACEBOOK_SECRET=YOUR_FACEBOOK_SECRET \
    -e GITHUB_ID=YOUR_GITHUB_ID \
    -e GITHUB_SECRET=YOUR_GITHUB_SECRET \
    -e LINKEDIN_ID=YOUR_LINKEDIN_ID \
    -e LINKEDIN_SECRET=YOUR_LINKEDIN_SECRET \
    -e TURN_URL=YOUR_TURN_URL \
    -e TURN_USERNAME=YOUR_TURN_USERNAME \
    -e TURN_PASSWORD=YOUR_TURN_PASSWORD \
    gjovanov/roomler
```


# Testing
## Run API tests

``` bash
# makes sure MongoDB is reachable based on /config/index.js (dbSettings)
$ npm run test:api
```

## Run E2E tests

``` bash
# makes sure MongoDB is reachable based on /config/index.js (dbSettings)
# first start the API and UI servers in TEST envrionment
$ npm run start:test-e2e
# then run all E2E test
$ npm run test:e2e

```
