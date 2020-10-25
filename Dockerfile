#!/bin/bash

FROM arm32v7/node:12

WORKDIR /app

COPY server/package.json .

RUN npm install

COPY server/ .

ENV PORT=5000
EXPOSE 5000

ENV consumer_key=""
ENV consumer_secret=""
ENV access_token=""
ENV access_token_secret=""

CMD ["npm", "start"]