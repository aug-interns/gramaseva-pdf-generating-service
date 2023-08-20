require('dotenv').config()
const express = require('express')
const app = express()
const pdfService = require('./routes/pdfController')
var bodyParser = require('body-parser');

// app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/pdf', pdfService)

app.listen(process.env.SERVER_PORT, () => {
  console.log(`PDF Generation started on port ${process.env.SERVER_PORT}`)
})