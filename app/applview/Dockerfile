
FROM node:20

WORKDIR /usr/src/applview

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x docker_env_setup.sh
RUN ./docker_env_setup.sh

EXPOSE 8040

CMD [ "npm", "start"]