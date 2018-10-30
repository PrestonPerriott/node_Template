'use strict'

var express  = require('express')
var router = express.Router()
var passport = require('passport')
var Auth = require('../microservices/jwt-auth')
//TODO: Build Mongoose DB 

/// Routes we want to exclude 
var routeExclusion = [
    '/api/login',
    '/api/register',
    '/api/refresh',
    '/api/version'
]

/// What we wanna do for all paths
router.all('*', function(req, res, next) {
    var willExclude = false
    for (var x = 0; x <routeExclusion.length; x++) {
        var item = routeExclusion[x]
        /// if the route equals one of our exclusion urls
        if (item === req.originalUrl) {
            willExclude = true
            break
        }
    }

    if (willExclude === true) {
        console.log('Exclusion url hit')
        return next()
    }
    passport.use(Auth.jwtStrategy)
    passport.authenticate('jwt', {
        successRedirect: next(),
        failureRedirect: res.status(400).send({'error' : 'JWT Authentication failed'})
    })
    // /// If this value isn't in the request throw an error
    // /// TODO: Make custom Error Class
    // if (!req.get('Authorization')) {
    //     throw new Error("No Auth Token")
    // }
})

module.exports = router

