'use strict'

var express =  require('express')
var router = express.Router()

router.post('/', function(req, res, next){ 
    var username = req.body.username
    var password = req.body.password
    var repeatedPass = req.body.repeatedPass
    var email = ''

    try {
        email = req.body.email
    }
    catch(error) {
        /// No need to throw error, we just wont use the email var
        email = ''
    }

    req.checkBody('username', 'Name Required').notEmpty()
    req.checkBody('password', 'Pass Required').notEmpty()
    req.checkBody('repeatedPass', 'Repeated Pass Required').notEmpty()
    req.checkBody('repeatedPass', "Passwords don't match").equals(req.body.password)

    if (email.length) {
        req.checkBody('email', 'A valid email is required').isEmail()
    }

    var valErrors = req.validationErrors()
    if (valErrors) {

    } else {
        console.log('Creating User')

        /// TODO: Our User Model doesn't exist yet...
        var newUser = new User({

        })
    }

})