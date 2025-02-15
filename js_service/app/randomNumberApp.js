const express = require('express');
const { json } = require('body-parser');
const { sendRandomNumbers, getAverage } = require('../routes/routes')

const app = express()

app.use(express.json())

app.post('/random-numbers', sendRandomNumbers)
app.get('/averages', getAverage)


module.exports = app ;
