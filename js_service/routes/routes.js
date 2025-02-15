const client = require('../services/randomNumberService')
const { FieldError, GRPCError } = require("../exceptions/exceptions")
const { checkGetAverangeField, checkRandomNumbersField } = require('../validators/fieldValidators')
const { parseDateToUnix } = require('../utils/formatDate')
const { checkGRPCErrors, checkResponseIsNotEmpty } = require('../validators/grpcValidators')
const { calculateAverages, createRandomNumbersArray } = require('../utils/numberServices')

const sendRandomNumbers = (req, res) => {
    const { len, maxNumber } = req.body;
    try {
        checkRandomNumbersField(req.body)
    
    } catch (error){
            if ((error instanceof FieldError) || (error instanceof GRPCError)) {
                return res.status(error.statusCode).send({error: error.message})
            }  
    }
    const randomNumbers = createRandomNumbersArray(len, maxNumber)
    const request = {
        maxNumber: maxNumber,
        randomNumbers: randomNumbers,
    };
    client.SendRandomNumbers(request, (error, response) => {
    try {
        
        checkGRPCErrors(error)
        return res.status(200).json(request);
    } catch (error) {
        if ((error instanceof FieldError) || (error instanceof GRPCError)) {
            return res.status(error.statusCode).send({error: error.message})
        }
    }
    })};

const getAverage = (req, res) => {
    const { limit = 100, offset = 0 } = req.query;
    const { startDate, endDate = new Date().toISOString() } = req.body;
    try {
        checkGetAverangeField(startDate, "startDate");
        checkGetAverangeField(endDate , "endDate");
    } catch (error) {
        if ((error instanceof FieldError) || (error instanceof GRPCError)) {
            return res.status(error.statusCode).send({error: error.message})
    }
    }
        const unixStartDate = parseDateToUnix(startDate);
        const unixEndDate = parseDateToUnix(endDate);
        const request = {
            startDate: unixStartDate,
            endDate: unixEndDate,
            limit: parseInt(limit),
            offset: parseInt(offset),
        };
        client.GetAverage(request, (error, response) => {
            try {
                checkGRPCErrors(error)
                checkResponseIsNotEmpty(response.averages)
                const result = calculateAverages(response.averages)
                return res.status(200).json(result);
            } catch (error) {
                if ((error instanceof FieldError) || (error instanceof GRPCError)) {
                    return res.status(error.statusCode).send({error: error.message})
                }
                return res.status(500).send("Internal server Error")
            };
        });
     };
    

module.exports = {sendRandomNumbers, getAverage}