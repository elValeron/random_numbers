const request = require('supertest');
const { FieldError, GRPCError } = require('../exceptions/exceptions')
const app = require('../app/randomNumberApp');
const client = require('../services/randomNumberService')
const { json } = require('body-parser');

describe('Random Numbers API', () => {
    let server;
    beforeAll((done) => {
        server = app.listen(3000, done())
        client.SendRandomNumbers = jest.fn((request, callback) => {
            callback(null, { success: true });
        });
        
        client.GetAverage = jest.fn((request, callback) => {
            callback(null, {averages: [{ maxNumber: 10, value: [1, 5, 7, 2, 3] }]});
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll((done) => {
        server.close(done);
    });

    describe('POST /random-numbers', () => {
        const req = { len: 5, maxNumber: 10 }
        it('should send random numbers successfully', async () => {
            
            const response = await request(app)
                .post('/random-numbers')
                .send(req);
                
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                maxNumber: req.maxNumber,
                randomNumbers: response.body.randomNumbers
            });
            expect(client.SendRandomNumbers).toHaveBeenCalled();
        });
        
        it('should return an error if invalid field values', async () =>{
            const response = await request(app)
            .post('/random-numbers')
            .send({len: undefined, maxNumber: 100});
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(`Empty required field: len`)
        });
        
        it('should return an error if sendRandomNumbers fails', async () => {
            client.SendRandomNumbers.mockImplementation((request, callback) => {
                callback(new GRPCError(500, 'gRPC error'), null);
            });

            const response = await request(app)
                .post('/random-numbers')
                .send(req);
            
            expect(response.status).toBe(500);
            expect(response.text).toContain('GRPC Error');
        });
    });

    describe('GET /averages', () => {
        it('should return averages successfully', async () => {
            const response = await request(app)
                .get('/averages?limit=10&offset=0')
                .send({ startDate: "01.01.2024", endDate: "2024-08-09T18:31:42.201Z" });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "10": 3.6
            });
            expect(client.GetAverage).toHaveBeenCalled();
        });

        it('should return an error if startDate is missing', async () => {
            const response = await request(app)
                .get('/averages?limit=10&offset=0')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Empty required field: startDate");
        });
        
        it('should return an error if getAverage fails', async () => {
            client.GetAverage.mockImplementation((request, callback) => {
                callback(new GRPCError(500, 'gRPC error'), null);
            });

            const response = await request(app)
                .get('/averages?limit=10&offset=0')
                .send({ startDate: '20.01.2023', endDate: '30.01.2023' });
            
            expect(response.status).toBe(500);
            expect(response.text).toContain("GRPC Error");
        });
        
        it('should handle date validation errors', async () => {
            let fieldName = "startDate"
            const validateDateMock = jest.spyOn(require('../validators/fieldValidators'), 'checkGetAverangeField').mockImplementation((fieldName) => {
                throw new FieldError(400, `${fieldName}: Не правильный формат даты, введите в формате DD.MM.YYYY или ISO 8061`);
            });
            const response = await request(app)
                .get('/averages?limit=10&offset=0')
                .send(`${fieldName} date format is incorrect, please enter in DD.MM.YYYY or ISO8061 format` );
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(`Empty required field: ${fieldName}`);

            validateDateMock.mockRestore();
        });
    });
});
