FROM node:13.14.0-buster-slim

LABEL maintainer="Goran Jovanov <goran.jovanov@gmail.com>"
LABEL description="Roomler - Video Conferencing & Team Collaboration Tool"

# Version
ADD VERSION .

# Environment variables
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 3000
ENV WS_SCALEOUT_ENABLED true

ARG DEBIAN_FRONTEND=noninteractive

# Install packages & git clone source code and build the application
RUN rm -rf /var/lib/apt/lists/* \
  && apt-get -y update \
  && apt-get install -yq apt-utils \
  && apt-get install -yq \
  build-essential \
  python \
  git \
  && cd / \
  && git clone https://github.com/gjovanov/roomler.git \
  && cd /roomler \
  && npm i pm2 -g \
  && npm i --only=prod \
  && npm run build \
# Cleanup
  && cd / \
  && rm -Rf /tmp/* \
  && apt-get purge -y \
  build-essential \
  python \
  git \
  && apt-get autoremove -y \
  && apt-get clean \
  && apt-get autoremove --purge shared-mime-info -y \
  && rm -rf /var/lib/apt/*

# Volumes
VOLUME /roomler/ui/static/uploads
WORKDIR /roomler

EXPOSE 3000

# Define the Run command
CMD ["npm", "run", "start"]

