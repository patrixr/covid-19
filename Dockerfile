
FROM node:12-alpine AS base

ENV NODE_ENV production

WORKDIR /app

COPY . /app

RUN npm install --production
