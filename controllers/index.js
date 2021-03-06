'use strict'

var express = require('express')
var router = express.Router()


router.use('/api/register', require('./register'))

router.use('/api/version', require('./version'))

router.use('/api/login', require('./login'))
router.use('/api/refresh', require('./refresh'))
router.use('/api/home', require('./home'))


module.exports = router


