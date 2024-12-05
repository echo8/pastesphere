FROM node:22.12-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY src/client/package.json ./src/client/package.json
COPY src/server/package.json ./src/server/package.json

RUN npm ci

COPY . .

RUN npm run build

FROM node:22.12-slim

WORKDIR /app
VOLUME /data

ENV NODE_ENV=production
ENV DB_PATH=/data/db.sqlite
ENV PORT=443

COPY package*.json ./
COPY src/client/package.json ./src/client/package.json
COPY src/server/package.json ./src/server/package.json

RUN npm ci --omit=dev

COPY --from=builder /app/src/server/dist ./dist
COPY --from=builder /app/src/client/dist ./client/dist

EXPOSE 443
CMD [ "node", "dist/index.js" ]
