
FROM node:12.18

WORKDIR /usr/src/app

COPY . /usr/src/app
COPY .env.staging .env
RUN npm install
RUN npm run build

ENV NODE_ENV production

EXPOSE 80

CMD ["npm", "run", "server"]
