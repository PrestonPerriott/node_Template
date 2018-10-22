'use strict'

var express =  require('express')
var router = express.Router()

//include our UserSchema
var User = require('../models/user')
var Auth = require('../microservices/jwt-auth')

router.get ('/', function(req, res, next) {
    res.send('This stuff')
    console.log('hit get register')
    next()
})

router.post('/', async function(req, res, next){ 
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email

    var validUser = null

    var existingUsername = ''
    var existingEmail = ''    

    var matched = false

    req.checkBody('username', 'Name Required').notEmpty()
    req.checkBody('password', 'Pass Required').notEmpty()
    req.checkBody('email', 'A valid email is required').isEmail()

    try {
        existingUsername = await User.userByUserName(username)
        existingEmail = await User.userByEmail(email)
    } catch (err) {
        console.log('There was an error connecting with the db for searching')
        res.status(500).send(err)
        throw err
    }

    if (existingUsername != null) {
        console.log('Our error from existing user is : ' + existingUsername)
        res.status(501).send('Username exists')
        throw 'Error name exists'
    } else if (existingEmail != null) {
        console.log('Our error from existing email is : ' + existingEmail)
        res.status(501).send('Email exists')
        throw 'Error email exists'
    }

    var valErrors = req.validationErrors()

    if (valErrors) {
        console.log('There were validation errors')
        throw valErrors
    } else {
        console.log('Creating User...')
        var newUser = new User({
            username: username,
            password: password,
            email: email,
            date: Date.now()
        })

        try {
            let user = await User.createUser(newUser)
            validUser = await User.userByUserName(user.username)
            matched = await User.comparePassword(req.body.password, validUser.password)
        } catch (err) {
            res.status(400).send('Interaction error with the db')
        }

        if (matched) {
            var token = null
            token = await Auth.tokenize(validUser)
            res.json({
               message : 'Logged in Successfully',
               token :  token
            })

        }
    }

})

module.exports = router