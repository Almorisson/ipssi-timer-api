FROM node:latest

WORKDIR /home/src/app

COPY . /home/src/app

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
