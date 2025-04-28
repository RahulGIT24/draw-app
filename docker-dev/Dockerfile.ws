FROM node:23.8.0-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY ../package.json ../pnpm-lock.yaml ../pnpm-workspace.yaml ../turbo.json ./

COPY ../packages ./packages

COPY ../apps/ws-backend ./websocketbackend

RUN pnpm install

RUN pnpm generate

CMD [ "pnpm","run", "dev"]