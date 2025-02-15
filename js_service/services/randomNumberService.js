const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../proto/random_numbers.proto'));
const randomNumbersProto = grpc.loadPackageDefinition(packageDefinition).random_numbers;

const client = new randomNumbersProto.RandomNumbersService('server:50051', grpc.credentials.createInsecure());


module.exports = client;