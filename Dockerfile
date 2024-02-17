FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build


COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
# Start the server
CMD ["npm", "run", "start"]