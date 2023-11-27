#RUN IMAGE FROM AUTH DIRECTORY
FROM node:20

WORKDIR /usr/src/auth

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x docker_env_setup.sh
RUN ./docker_env_setup.sh

EXPOSE 8000

CMD [ "npm", "start"]
