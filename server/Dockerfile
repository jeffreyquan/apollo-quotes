FROM node:lts

WORKDIR /app

COPY package.json .

RUN npm install

EXPOSE 5000

ENV MONGO_URI mongodb://mongo:27017/apollo-quotes

CMD [ "npm", "run", "start:dev" ]