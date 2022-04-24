# build stage
FROM node:lts-alpine as build-stage
RUN apk add --no-cache make build-base git
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
# docker buildx build -t hfbzzx/rethi-visualization --platform linux/arm64,linux/amd64 --push .

