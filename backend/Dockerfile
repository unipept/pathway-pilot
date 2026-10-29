FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN cp .env.example .env && npm run build && npm prune --omit=dev

# KEGG_DATA=fixture uses the small test fixture instead of fetching KEGG.
FROM build AS data
ARG KEGG_DATA=fetch
RUN if [ "$KEGG_DATA" = fixture ]; then \
        apk add --no-cache bash && npm run fixture && mv .fixture data; \
    else \
        npm run refresh-data; \
    fi

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json /app/.env ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=data /app/data ./data
USER node
CMD ["node", "build/index.js"]
