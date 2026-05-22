# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app ./

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
