FROM node:21

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3500

CMD [ "npm", "start" ]