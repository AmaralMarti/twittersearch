const express = require('express')
const app = express()
const router = express.Router()
const routes = require('./routes')
const cors = require('cors')

app.use(cors())

app.use('/', routes)

module.exports = { app }
