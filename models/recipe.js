///Creating recipe mongoose obj becuase we might want to save it to user later
///Not a new collection perse, but a favorite recipes type thing. 
'use strict'
var mongoose = require('mongoose')

var RecipeSchema = mongoose.Schema({
    
    title: {
        type: String,
        index: true,
        required: true
    },

    category: {
        type: [String],
        index: true,
        required: true
    },

    url: {
        type: String,
        index: true,
        required: true
    },

    image: {
        type: String,
        index: true,
        required: true
    },

    ingredients: {
        type: [String],
        index: true,
        required: true
    },

    calories: {
        type: Number,
        index: true,
        required: false
    },

    totalTime: {
        type: Number,
        index: true,
        required: false
    }

})

var Recipe = module.exports = mongoose.model('Recipe', RecipeSchema)

///Once a day, there will be a random set of Recipes provided to user
///Param is random enum health val ie .com/search?q=randomHealthEnum
module.exports.fetchDailyRecipes = async function(randomHealthEnum) {

    ///Call Recipe service api with enum to return parsed objects to save or return
}

///Save a specifc Recipe to user
module.exports.LikedRecipe = async function(user) {
    
}