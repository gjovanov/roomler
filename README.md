# Roomler

> Roomler.Live - Live video collaboration tool using WebRTC (Janus Gateway)

# Install packages
``` bash
# install dependencies
$ npm i
```

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
