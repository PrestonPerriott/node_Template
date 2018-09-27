'use strict'

const express = require('express')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session =  require('express-session')
const passport = require('passport')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cookieParser)

app.use(session({
    secret: (process.env.secret || 'secretKey'),
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
    console.log('App was started on port: ' + app.get('port'))
})