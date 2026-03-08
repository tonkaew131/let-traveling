# syntax=docker/dockerfile:1.7

FROM oven/bun:1.1.43 AS build

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile
RUN bun run --filter @let-traveling/www build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /app/apps/www/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
