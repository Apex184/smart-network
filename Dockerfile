# Stage 1: Build
FROM node:20-alpine AS builder

RUN addgroup -S app && adduser -S -G app -s /bin/false app
ENV HOME=/home/app

WORKDIR $HOME/node

COPY --chown=app:app package.json ./
RUN npm install

COPY --chown=app:app . ./
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

RUN apk --no-cache add ca-certificates

RUN addgroup -S app && adduser -S -G app -s /bin/false app
ENV HOME=/home/app

WORKDIR $HOME/node

COPY --from=builder --chown=app:app $HOME/node/ $HOME/node/

USER app

RUN npm rebuild bcrypt --build-from-source



RUN npm install --production

EXPOSE 3333


CMD ["npx", "cross-env", "NODE_ENV=production", "node", "dist/index.js"]
