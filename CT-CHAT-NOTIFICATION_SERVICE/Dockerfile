FROM node:18.10.0

WORKDIR /usr/src/app

COPY ./package*.json ./


RUN yarn set version 1.22.17 && yarn install


COPY . .


RUN yarn build


RUN yarn global add pm2



CMD ["pm2-runtime", "dist/main.js"]
