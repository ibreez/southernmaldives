# Backend container for the Express SMTP + API server
FROM node:20-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --force

COPY backend ./backend
WORKDIR /app/backend

EXPOSE 5000
CMD ["node", "server.js"]
