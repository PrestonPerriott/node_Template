'use strict'

const express = require('express')
const validator = require('express-validator')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session =  require('express-session')
const passport = require('passport')
const monk = require('monk')
var dotenv = require('dotenv')

var app = express()

dotenv.config()

var uri = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DBNAME
mongoose.connect(uri, { useNewUrlParser: true })
var db = mongoose.connection

app.use(validator())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
//app.use(cookieParser)

//MKaing our db accessible to the router 
app.use(function(req, res, next) {
    req.db = db
    next()
})

app.use(session({
    secret: (process.env.secret || 'secretKey'),
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(require('./middleware'))
app.use(require('./controllers'))

/// Truthy vs Falsey values
/// If it has a value it is a truthy value
app.set('port', (process.env.PORT || 8080))
app.listen(app.get('port'), function() {
    console.log('App was started on port: ' + app.get('port'))
})