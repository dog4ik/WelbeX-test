FROM node:20-alpine

WORKDIR /usr/scr/app

COPY package*.json ./

RUN npm install typescript
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx tsc

EXPOSE 6969

CMD [ "node", "./dest/index.js" ]
