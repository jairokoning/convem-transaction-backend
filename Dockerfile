#FROM node:lts-alpine3.9
FROM node:20-alpine

WORKDIR /usr/app
COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "./dist/src/server.js"]