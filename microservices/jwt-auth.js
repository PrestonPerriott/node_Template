'use strict'

var jwt = require('jsonwebtoken')
var passportJWT = require('passport-jwt')
var dotenv = require('dotenv').config()
var User = require('../models/user')
var strategyJWT = passportJWT.Strategy

var jwtOptions = {}
jwtOptions.secretOrKey = process.env.JWT_SECRET
jwtOptions.jwtFromRequest = function(req) {
    console.log('Fetching token...')
    var token = null
    try {
        token = req.get('authorization') 
    } catch (err) {
        console.log('Error getting token from Headers')
        throw err
    }
    return token
}

module.exports.tokenize = async function(user) {
    var token = await jwt.sign({'id' : user.id, 'name' : user.username}, jwtOptions.secretOrKey, {
        expiresIn: 604800
    })
    return token
}

module.exports.jwtStrategy = new strategyJWT(jwtOptions, async function(jwtRes, next) {
    console.log('***Strategy*** The Json web token is :', jwtRes)
    try {
        let authUser = await User.userByUserName(jwtRes.name)
        return next(null, authUser)
    } catch (err) {
        console.log('Error from the stratgey is : ' + err)
        return next(err, null)
    }
})