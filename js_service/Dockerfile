FROM node:22.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y git protobuf-compiler

RUN mkdir proto

RUN wget -O proto/random_numbers.proto https://raw.githubusercontent.com/elValeron/contracts/refs/heads/main/random_numbers/random_numbers.proto

COPY . .

RUN npm test

CMD ["node", "startApp.js"]
