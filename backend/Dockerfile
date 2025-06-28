# Dockerfile for Colyseus + Elysia + Bun backend

FROM oven/bun:1.2-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy backend source code only
COPY . .

# Expose port
EXPOSE 2567

# Start the server
CMD ["bun", "src/server.ts"]