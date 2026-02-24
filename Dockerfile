ARG NODE_VERSION=24

# ─── Builder ─────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS builder

ARG PNPM_VERSION=10

WORKDIR /app

RUN npm install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# ─── Runner ──────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS runner

ARG VERSION=dev

WORKDIR /app

ENV NODE_ENV=production

ENV PORT=3000

ENV HOSTNAME=0.0.0.0

LABEL org.opencontainers.image.version="${VERSION}"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Mount point for travel photos (images/ is gitignored and user-supplied)
RUN mkdir -p images && chown nextjs:nodejs images

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
