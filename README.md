# Roomler

> Roomler.Live - Live video conferencing & collaboration tool using WebRTC (Janus Gateway)

It's like Slack on Crack and Microsoft Teams on Steroids.
All that fully free and open source. 


[![Roomler Intro](https://img.youtube.com/vi/lzHeRwVDfPQ/0.jpg)](https://www.youtube.com/watch?v=lzHeRwVDfPQ)

# Features

| MULTI PARTY CALLS       | POWERFUL CHAT           | ORGANIZED ROOMS         |
|-------------------------|-------------------------|-------------------------|
| <ul><li>[x] Video</li><li>[x] Audio</li><li>[x] Screen share</li><li>[x] Encrypted</li><li>[ ] Recording (soon...)</li></ul> | <ul><li>[x] Rich-text</li><li>[x] File sharing</li><li>[x] Emojis & Giphy's</li><li>[x] Mentions</li><li>[x] Reactions</li></ul> | <ul><li>[x] Public Rooms</li><li>[x] Private Rooms</li><li>[x] Hierarchy of Rooms</li><li>[x] User roles (moderator, member)</li><li>[x] Secure communication</li></ul> |

# Technology stack
- [Janus Gateway](https://github.com/meetecho/janus-gateway)
- [Fastify](https://github.com/fastify/fastify)
- [PM2](https://github.com/Unitech/pm2)
- [MongoDB](https://github.com/mongodb/mongo)
- [Redis](https://github.com/antirez/redis)
- [VueJS](https://github.com/vuejs/vue)
- [NuxtJS](https://github.com/nuxt/nuxt.js/)    
- [VuetifyJS](https://github.com/vuetifyjs/vuetify)
- [Docker](https://github.com/docker)

# Architecture
![Architecture](./ui/static/architecture.png)

# Prerequisites

## Docker network
Besides the default `host` Docker network, we need to create two addition bridge networks:
1. `docker network create frontend` (used by containers `roomler`, `nginx`, `janus`)
2. `docker network create backend` (used by containers `roomler`, `mongo`, `redis`)
3. on the existing `host` network `janus` and `coturn` will be attached


## Janus Gateway
Video conferences are implemented using Janus's VideoRoom plugin. Hence we will use this [Janus Docker Image](https://github.com/gjovanov/docker/tree/master/janus-slim) of Janus.

It's recommendad that Janus is attached directly to the Dockers `host` network, to avoid issues with ICE Candidates gathering and the Docker Port mapping.
``` bash
docker run -d \
  --name="janus" \
  --restart="always" \
  --network="host" \
  gjovanov/janus-slim

# attach janus container to frontend network
docker network connect frontend janus
```

## Coturn
For enabling peers, that are behind NAT (Private LANs), to create WebRTC PeerConnections with Janus, it's recommended to setup a TURN server. It's also recommended that your TURN server is running on the Docker `host` network. 

Hence we will your Instrumentos docker images:

``` bash
docker run -d \
  --name="coturn" \
  --restart="always" \
  --net=host \
       instrumentisto/coturn -n \
         --lt-cred-mech --fingerprint \
         --no-multicast-peers \
         --cli-password=MyTopSecret \
         --no-tlsv1 \
         --no-tlsv1_1 \
         --fingerprint \
         --lt-cred-mech \
         --verbose \
         --user=SuperUser:MyTopSecret \
         --server-name=your_domain \
         --realm=your_domain \
         --listening-ip='$(detect-external-ip)' \
         --min-port=10200 \
         --max-port=49200
```

To test your TURN server, check [this](https://stackoverflow.com/questions/28772212/stun-turn-server-connectivity-test) post.

## MongoDB
As a storage of `users`, `rooms`, `messages`, `calls` etc, we will be using MongoDB.

We will rely on the official MongoDB Docker image:

``` bash
docker run -d --name mongo \
    --restart=always \
    -p 27017:27017 \
    -v mongo_data:/data/db \
    mongo

# attach mongo container to backend network
docker network connect backend mongo
```
Make sure you create a db user for your mongodb e.g.

```javascript
db.createUser(
  {
    user: "roomler",
    pwd: "super_secret",
    roles: [ { role: "readWrite", db: "roomlerdb" } ]
  }
)
```

## Redis
Since Roomler app is started in a Cluster mode using `pm.js` (there will be as many Web API processes the number of CPU cores on the machine), in order for these processes to be able to communicate with each other, we will rely on Redis PUB/SUB mechanism.

``` bash
docker run -d --name redis `
    -e ALLOW_EMPTY_PASSWORD=yes `
	--restart=always `
	-p 6379:6379 `
    bitnami/redis:latest

# attach redis container to backend network
docker network connect backend redis
```

## Nginx

``` bash
docker run -d --name nginx \
    --hostname nginx \
    --restart always \
    -v /your_path/nginx.conf:/etc/nginx/nginx.conf \
    -v /your_path/conf.d/:/etc/nginx/conf.d/ \
    -v /your_path/cert/:/etc/nginx/cert/ \
    -v /your_path/logs/:/etc/nginx/logs/ \
    --net=host \
    nginx

# attach nginx container to frontend network
docker network connect frontend nginx
```

You can a basic `conf` file for `roomler` container e.g. in `/your_path/conf.d/roomler.live.conf`:
``` conf
server {
       listen         80;
       listen         [::]:80;
       server_name    roomler.live; # replace it with your roomler domain
       return         301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name roomler.live; # replace it with your roomler domain
    client_max_body_size 0;

    ssl_certificate /etc/nginx/cert/your_cert.pem;
    ssl_certificate_key /etc/nginx/cert/your_cert.key;

    ssl_protocols TLSv1.2;

    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://roomler_container:3000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 1800;
        proxy_connect_timeout 1800;
        proxy_send_timeout 1800;
        send_timeout 1800;
    }
}
```

As well a basic `conf` file for `janus` container e.g. in `/your_path/conf.d/janus.roomler.live.conf`:

``` conf
server {
       listen         80;
       listen         [::]:80;
       server_name    janus.roomler.live; # replace it with your janus domain
       return         301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name janus.roomler.live;  # replace it with your janus domain
    client_max_body_size 0;

    ssl_certificate /etc/nginx/cert/your_cert.pem;
    ssl_certificate_key /etc/nginx/cert/your_cert.key;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_redirect off;

        proxy_pass http://janus:8080;
    }
    location /janus_ws {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_redirect off;

        proxy_pass http://janus:8188;
    }

    location /janus_http {
        proxy_pass http://janus:8088/janus;
    }

    location /janus_admin {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_pass http://janus:7188;
    }

    location /janus_admin_http {
        proxy_pass http://janus:7088/admin;
    }
}

```

## Environment variables of Roomler

Before you run the app either in DEVELOPMENT, PRODUCTION mode or even run any of the TESTS, you need to setup couple of environment variables used in `/config/index.js`:

```
API_URL=YOUR_DOMAIN
DB_CONN=YOUR_DB_CONN
WS_SCALEOUT_ENABLED=true
WS_SCALEOUT_HOST=redis
SENDGRID_API_KEY=YOUR_SEND_GRID_KEY
FACEBOOK_ID=YOUR_FACEBOOK_ID
FACEBOOK_SECRET=YOUR_FACEBOOK_SECRET
GOOGLE_ID=YOUR_GOOGLE_ID
GOOGLE_SECRET=YOUR_GOOGLE_SECRET
GITHUB_ID=YOUR_GITHUB_ID
GITHUB_SECRET=YOUR_GITHUB_SECRET
LINKEDIN_ID=YOUR_LINKEDIN_ID
LINKEDIN_SECRET=YOUR_LINKEDIN_SECRET
TURN_URL=YOUR_TURN_URL
TURN_USERNAME=YOUR_TURN_USERNAME
TURN_PASSWORD=YOUR_TURN_PASSWORD
GIPHY_API_KEY=YOUR_GIPHY_KEY
```


### Email setting
You have the following options to configure your app to send emails e.g. Activation link, Welcome email, Password change email etc.
1. SENDGRID account: `SENDGRID_API_KEY`
2. GMAIL account: `GMAIL_USER` and `GMAIL_PASSWORD`, but before sending your email using gmail you have to allow non secure apps to access gmail you can do this by going to your gmail settings [here](https://myaccount.google.com/lesssecureapps).
3. SMTP server you have access to: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER` and `SMTP_PASSWORD`

Please note that only one of those 3 options is needed to be properly setup in the exact order as above.

### Database setting
For running on localhost and you have MongodDB server instance also stared on localhost, this is not needed, otherwise your will need to provide the DB URL in the env variable `DB_CONN`

## DNS settings
Since you have the options to run two separate Fastify servers:
1. UI server (for rendering UI app using NuxtJS)
2. API server (for API calls and WS connections)

then you might want to configure the environment variables `URL` for the UI and `API_URL` for the API server respectively.

On localhost, the default setting for these env variables is `URL=http://localhost:3000` and `API_URL=http://localhost:3001`


# Development

## Environment variables
Create `.env` file in the root folder: `roomler/.env`

```
HOST=localhost
JANUS_URL=wss://YOUR_JANUS_URL/janus_ws
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
FACEBOOK_ID=YOUR_FACEBOOK_ID
FACEBOOK_SECRET=YOUR_FACEBOOK_SECRET
GOOGLE_ID=YOUR_GOOGLE_ID
GOOGLE_SECRET=YOUR_GOOGLE_SECRET
GITHUB_ID=YOUR_GITHUB_ID
GITHUB_SECRET=YOUR_GITHUB_SECRET
LINKEDIN_ID=YOUR_LINKEDIN_ID
LINKEDIN_SECRET=YOUR_LINKED_SECRET
TURN_URL=turn:YOUR_TURN_URL?transport=udp
TURN_USERNAME=YOUR_TURN_USERNAME
TURN_PASSWORD=YOUR_TURN_PASSWORD
GIPHY_API_KEY=YOUR_GIPHY_KEY
```

## Start in development mode

``` bash
# install dependencies
$ npm i

# Start API server (localhost:3001)
$ npm run dev:api

# Start UI server (localhost:3000)
$ npm run dev:ui
```

# Production
## Start in production mode

``` bash
# install dependencies
$ npm i

# build for production and launch server
$ npm run build
$ npm start
```

## Start using docker
``` bash
docker run -d --name roomler \
    --hostname roomler \
    --restart always \
    -e API_URL=https://roomler.live \
    -p 8082:3000 \
    -e DB_CONN=YOUR_DB_CONN \
    -e WS_SCALEOUT_ENABLED=true \
    -e WS_SCALEOUT_HOST=redis \
    -e SENDGRID_API_KEY=YOUR_SEND_GRID_KEY \
    -e FACEBOOK_ID=YOUR_FACEBOOK_ID \
    -e FACEBOOK_SECRET=YOUR_FACEBOOK_SECRET \
    -e GOOGLE_ID=YOUR_GOOGLE_ID \
    -e GOOGLE_SECRET=YOUR_GOOGLE_SECRET \
    -e GITHUB_ID=YOUR_GITHUB_ID \
    -e GITHUB_SECRET=YOUR_GITHUB_SECRET \
    -e LINKEDIN_ID=YOUR_LINKEDIN_ID \
    -e LINKEDIN_SECRET=YOUR_LINKEDIN_SECRET \
    -e TURN_URL=YOUR_TURN_URL \
    -e TURN_USERNAME=YOUR_TURN_USERNAME \
    -e TURN_PASSWORD=YOUR_TURN_PASSWORD \
    -e GIPHY_API_KEY=YOUR_GIPHY_KEY \
    gjovanov/roomler

# attach roomler container to frontend & backend networks
docker network connect frontend roomler
docker network connect backend roomler
```


# Testing
## Run API tests

``` bash
# makes sure MongoDB is reachable based on /config/index.js (dbSettings)
$ npm run test:api
```

## Run E2E tests (TODO)

``` bash
# makes sure MongoDB is reachable based on /config/index.js (dbSettings)
# first start the API and UI servers in TEST envrionment
$ npm run start:test-e2e
# then run all E2E test
$ npm run test:e2e

```
