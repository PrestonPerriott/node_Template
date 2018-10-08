'use strict'

var express = require('express')
var router = express.Router()

router.use('/api', require('./authorization'))

module.exports = router