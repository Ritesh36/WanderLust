FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy backend dependencies provided the build context is the project root
COPY backend/package*.json ./backend/

# Install dependencies in the backend directory
WORKDIR /app/backend
RUN npm install

# Copy backend code
COPY backend/ .

# Copy frontend code as a sibling directory so relative paths in app.js work
COPY frontend/ ../frontend/

EXPOSE 8080

CMD ["node", "app.js"]
