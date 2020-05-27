FROM node:latest

WORKDIR /home/src/app

COPY . /home/src/app

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
