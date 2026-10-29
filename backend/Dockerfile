FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN cp .env.example .env && npm run build && npm prune --omit=dev

FROM build AS data
RUN npm run refresh-data

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json /app/.env ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=data /app/data ./data
USER node
CMD ["node", "build/index.js"]
