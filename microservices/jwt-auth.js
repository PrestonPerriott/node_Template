'use strict'

var jwt = require('jsonwebtoken')
var passportJWT = require('passport-jwt')
var dotenv = require('dotenv').config()
var User = require('../models/user')
var strategyJWT = passportJWT.Strategy

var jwtOptions = {}
jwtOptions.secretOrKey = process.env.JWT_SECRET
jwtOptions.jwtFromRequest = async function(req) {
    var token = null
    if (req && req.headers) {
        token = req.headers['Authorization']
    }
    return token
}

module.exports.tokenize = async function(user) {
    var token = await jwt.sign({'id' : user.id, 'name' : user.username}, jwtOptions.secretOrKey, {
        expiresIn: 604800
    })
    return token
}

module.exports.jwtStrategy = new strategyJWT(jwtOptions, function(jwtRes, next) {
    console.log('The Json web token is :', jwtRes)
    User.userByUserName(jwtRes.username, function(err, user){
        if (err) {
            return next(err, false)
        } 
        if (user) {
            next(null, user)
        } else {
            next(null, false)
        }
    })
})