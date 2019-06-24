FROM node:alpine as builder
COPY . /app
WORKDIR /app
RUN npm i
RUN npm run build
WORKDIR /app
CMD ["node", "dist/index.js"]