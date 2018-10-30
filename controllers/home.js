'use strict'

var express = require('express')
var router = express.Router()

var Recipe = require('../microservices/recipe-handler.js')

router.get('/', async function(req, res, next){

    console.log('successfully hit home endpoint')
    ///How to do we expect to pass the category from the front-end?
    let category = req.body.category
    let recipes = await Recipe.fetchRecipesFromCategory(category)
    res.status(200).json(recipes)
})

module.exports = router 