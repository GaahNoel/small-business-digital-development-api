#Dockerfile
# PROD CONFIG
FROM node:16 as prod

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

ENV NODE_ENV=production

RUN yarn build

RUN yarn prisma generate

CMD [ "yarn", "start" ]