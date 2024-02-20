FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json /app
COPY .env /app
RUN npm ci

# Start a new build stage
FROM node:20-slim AS production
ENV NODE_ENV production

USER node
WORKDIR /app
COPY --chown=node:node --from=builder /app/package.json /app/package.json
COPY --chown=node:node --from=builder /app/.env /app/.env
COPY --chown=node:node . /app

RUN ls -la

# Start the server
CMD ["npm", "run", "start"]