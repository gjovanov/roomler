FROM gjovanov/node-alpine-edge:13.11.0
LABEL maintainer="Goran Jovanov <goran.jovanov@gmail.com>"

# Version
ADD VERSION .

# Environment variables
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 3000

# Install packages & git clone source code and build the application
RUN apk add --update --no-cache --virtual .build-deps \
  gcc g++ make git python && \
  apk add --no-cache vips vips-dev fftw-dev libc6-compat \
  --repository http://nl.alpinelinux.org/alpine/edge/testing/ \
  --repository http://nl.alpinelinux.org/alpine/edge/main && \
  cd / && \
  git clone https://github.com/gjovanov/roomler.git && \
  cd /roomler && \
  npm i && \
  npm run build && \
  apk del .build-deps vips-dev fftw-dev && \
  rm -rf /var/cache/apk/*

# Volumes
VOLUME /roomler/ui/static/uploads
WORKDIR /roomler

EXPOSE 3000

# Define the Run command
CMD ["npm", "run", "start:ui"]
