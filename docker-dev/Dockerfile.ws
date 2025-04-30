FROM node:23.8.0-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY ../package.json ../pnpm-lock.yaml ../pnpm-workspace.yaml ../turbo.json ./
COPY ../apps/ws-backend/package.json ./apps/ws-backend/package.json
COPY ../packages/common/package.json ./packages/common/package.json
COPY ../packages/cache/package.json ./packages/cache/package.json
COPY ../packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY ../packages/backend-common/package.json ./packages/backend-common/package.json
COPY ../packages/db/package.json ./packages/db/package.json
COPY ../packages/email/package.json ./packages/email/package.json
COPY ../packages/eslint-config/package.json ./packages/eslint-config/package.json

RUN pnpm install

COPY ../packages ./packages

COPY ../apps/ws-backend ./apps/ws-backend

RUN pnpm generate
RUN pnpm migrate
RUN pnpm build

CMD [ "pnpm","run", "start"]