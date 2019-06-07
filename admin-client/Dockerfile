FROM node:alpine as builder
COPY . /app
WORKDIR /app
RUN npm i
RUN npm run build
RUN ls
CMD ["node", "server.js"]