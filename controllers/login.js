'use strict'

var express = require('express')
var router = express.Router()

//include our UserSchema
var User = require('../models/user')
var Auth = require('../microservices/jwt-auth')

router.get ('/', function(req, res, next) {
    res.send('This stuff')
    console.log('hit get login')
    next()
})

router.post('/', async function(req, res, next){ 
    var password = req.body.password
    var email = req.body.email

    var validUser = null
    var matched = false
    
	req.checkBody('password', 'A password is required').notEmpty(); 
	//req.checkBody('repPass', 'The Passwords do not match').equals(req.body.password);
	req.checkBody('email', 'An email is required').notEmpty();
    req.checkBody('email', 'A valid email is required').isEmail();
    
    var valErrors = req.validationErrors()
    
    if (valErrors) {
        console.log('There were validation errors \n')
        console.log('Stemming from the request : ' + JSON.stringify(req.body))
        throw valErrors
    } else {
        
        try {
            validUser = await User.userByEmail(email)
            if (validUser != null) {
                matched = await User.comparePassword(password, validUser.password)
                if (matched) {
                    var token = null
                    token = await Auth.tokenize(validUser)
                    validUser.accessToken = token
                    await validUser.save()
                    let returnedUser = await User.stripToJSON(validUser)
                    res.send(returnedUser)
                } else {
                    ///TODO: If the password doesn't match
                    console.log('password Mismatch')
                    res.status(401).send({'error': 'Mismatched Password'})
                }
            } else {
                console.log("Email Doesn't exist")
                res.status(401).send({'error':'There is no user with that email'})
            }
        } catch (err) {
            console.log('Failed to interact with DB')
            res.status(400).send({'error':'Interaction error with the db'})
        }
    }

})
module.exports = router