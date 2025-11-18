# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install postgresql-client for psql command
RUN apk add --no-cache postgresql-client
COPY --from=builder /app ./
COPY --from=deps /app/node_modules ./node_modules
COPY entrypoint.sh ./entrypoint.sh
COPY seed.sql ./seed.sql
RUN chmod +x ./entrypoint.sh
EXPOSE 4000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/server.js"]
