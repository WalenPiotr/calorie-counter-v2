FROM node:alpine as builder
COPY . /app
WORKDIR /app
RUN npm i
RUN npm run build
WORKDIR /app/dist
RUN ls
CMD ["node", "index.js"]