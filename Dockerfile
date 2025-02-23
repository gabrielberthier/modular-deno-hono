# Build stage
FROM denoland/deno:alpine AS builder
WORKDIR /app
COPY . .
RUN deno cache main.ts

# Production stage
FROM denoland/deno:alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-net", "main.ts"]