#RUN IMAGE FROM AUTH DIRECTORY
FROM node:20

WORKDIR /usr/src/auth

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start"]
