'use strict'

const http = require('http')
var dotenv = require('dotenv')
dotenv.config()

const port = process.env.PORT || 3000
const app =  require('./index')

const server = http.createServer(app)
server.listen(port)
