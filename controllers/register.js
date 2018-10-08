'use strict'

var express =  require('express')
var router = express.Router()

//include our UserSchema
var User = require('../models/user')

router.get ('/', function(req, res, next) {
    res.send('This stuff')
    console.log('hit get register')
    next()
})

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
        console.log('Creating User...')
        var newUser = new User({
            username: username,
            password: password,
            email: email,
            date: Date.now()
        })

        User.createUser(newUser, function(err, user){
            if (err) throw err
            console.log('Finished creating user: ' + user)
        })
    }

})

module.exports = router