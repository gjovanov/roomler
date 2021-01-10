FROM node:14.5.0-buster-slim as base

LABEL maintainer="Goran Jovanov <goran.jovanov@gmail.com>"
LABEL description="Roomler - Video Conferencing & Team Collaboration Tool"

ARG NODE_ENV=production
ARG HOST=0.0.0.0
ARG PORT=3000
ARG WS_SCALEOUT_ENABLED=true
ARG GOOGLE_ANALYTICS_ID=

# Environment variables
ENV NODE_ENV=${NODE_ENV}
ENV HOST=${HOST}
ENV PORT=${PORT}
ENV WS_SCALEOUT_ENABLED=${WS_SCALEOUT_ENABLED}
ENV GOOGLE_ANALYTICS_ID=${GOOGLE_ANALYTICS_ID}

ARG DEBIAN_FRONTEND=noninteractive

FROM base as build
# Install packages & git clone source code and build the application
RUN rm -rf /var/lib/apt/lists/* \
  && apt-get -y update \
  && apt-get install -yq apt-utils \
  && apt-get install -yq \
  build-essential \
  python \
  git \
  && cd / \
  && git clone --depth=1 https://github.com/gjovanov/roomler.git \
  && cd /roomler \
  && npx lerna bootstrap --scope roomler.ui -- --production --no-optional \
  && yarn run build \
# Cleanup
  && cd / \
  && rm -Rf /tmp/* \
  && apt-get purge -y \
  build-essential \
  python \
  git

FROM base as release
COPY --from=build /roomler /roomler

RUN yarn global add pm2
ADD VERSION .
VOLUME /roomler/packages/ui/static/uploads
WORKDIR /roomler
EXPOSE ${PORT}

# Define the Run command
CMD ["yarn", "run", "start"]

