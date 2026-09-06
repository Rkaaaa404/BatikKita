# Stage 1: Base Alpine image
FROM node:20-alpine AS base

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Stage 3: Source builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile Next.js standalone application
RUN npm run build

# Stage 4: Minimal production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets (including /models and /wasm)
COPY --from=builder /app/public ./public

# Set up runtime permissions for Next.js cache and standalone output
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone server and pre-rendered pages
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
