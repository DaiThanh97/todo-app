FROM node:14-alpine AS build

RUN mkdir /todo-service
WORKDIR /todo-service

COPY package*.json ./ 

RUN npm install

COPY . .
RUN npm run build

#---------------------------

FROM node:14-alpine

RUN mkdir /todo-service
WORKDIR /todo-service

COPY package.json ./

RUN npm install --only=production

COPY . .

COPY --from=build /todo-service/dist ./dist

ENV NODE_ENV=production

CMD [ "npm", "run", "start:prod" ]