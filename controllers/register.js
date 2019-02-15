'use strict'

var express =  require('express')
var router = express.Router()

//include our UserSchema
var User = require('../models/user')
var Auth = require('../microservices/jwt-auth')

///temp
var Recipe = require('../microservices/recipe-handler.js')

router.get ('/', async function(req, res, next) {
    res.send('This stuff')
    console.log('hit get register')
    let recipes = await Recipe.fetchRecipesFromCategory('kosher')
    recipes.forEach(function(recipe){
        console.log(recipe)
    })
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
    
    req.checkBody('username', 'Name is required').notEmpty(); 
	req.checkBody('password', 'A password is required').notEmpty(); 
	//req.checkBody('repPass', 'The Passwords do not match').equals(req.body.password);
	req.checkBody('email', 'An email is required').notEmpty();
	req.checkBody('email', 'A valid email is required').isEmail();

    try {
        existingUsername = await User.userByUserName(username)
        existingEmail = await User.userByEmail(email)
    } catch (err) {
        console.log('There was an error connecting with the db for searching')
        next(err)
        // res.status(500).send(err)
        // throw err
    }

    if (existingUsername != null) {
        console.log(existingUsername.username + ' Already exists as a username\n' )
        var err = new Error()
        err.statusCode = 401
        err.message = 'Username already exists'
        return next(err)
        // res.status(501).send('Username exists')
        // throw 'Error name exists'
    } else if (existingEmail != null) {
        console.log(existingEmail.email + ' Already exists as an email\n')
        var err = new Error()
        err.statusCode = 401
        err.message = 'Email Already exists'
        return next(err)
        // res.status(501).send('Email exists')
        // throw 'Error email exists'
    }

    var valErrors = req.validationErrors()
    var newValErr = await req.getValidationResult()

    if (valErrors || newValErr) {
        console.log('There were validation errors')
        console.log('Stemming from the request : ' + JSON.stringify(req.body) + '\n')
        console.log('The validation errors are : ' + valErrors + '\n')
        console.log('Getting Validation result : ' + newValErr.array() + '\n')
        next(valErrors)
    } else {
        console.log('Creating User...')
        var newUser = new User({
            username: username,
            password: password,
            email: email,
            previousCategory: '',
            date: Date.now(),
            accessToken: ''
        })

        try {
            let user = await User.createUser(newUser)
            validUser = await User.userByUserName(user.username)
            matched = await User.comparePassword(req.body.password, validUser.password)
        } catch (err) {
            next(err)
            //res.status(400).send('Interaction error with the db')
        }

        if (matched) {
            var token = null
            token = await Auth.tokenize(validUser)
            validUser.accessToken = token
            await validUser.save()
            let returnedUser = await User.stripToJSON(validUser)
            res.send(returnedUser)
        }
    }

})

module.exports = router