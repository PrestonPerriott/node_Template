'use strict'
require('dotenv').config()
var fetch = require("node-fetch");

var baseUrl = 'https://api.edamam.com/search?q='
var appID = '&app_id=' + process.env.FOOD_API_ID
var appKey = '&app_key=' + process.env.FOOD_API_KEY

module.exports = { 
    
    fetchRecipesFromCategory:  async function(categoryString) {

    var dailyRecipesUrl = baseUrl + categoryString + appID + appKey

    var categories = []    
    var ingredients = []
    
    /// Array of Objects
    var RecipesArray = []

    var obj = await fetch(dailyRecipesUrl)
    var json = await obj.json()
    var hits = json['hits']

    hits.forEach(function(hit){
        console.log('Our recipes labels inside our hit : ' + hit['recipe'].label)
        
        ///IngredientLines is an array inside recipe
        hit['recipe'].ingredientLines.forEach(function(ingredient){
            ingredients.push(ingredient)
        })

        hit['recipe'].healthLabels.forEach(function(category){
            categories.push(category)
        })

        RecipesArray.push({
            'title': hit['recipe'].label,
            'url': hit['recipe'].url,
            'image': hit['recipe'].image,
            'calories': hit['recipe'].calories,
            'totalTime': hit['recipe'].totalTime,
            'category': categories,
            'ingredients': ingredients
        })

        ingredients = []
        categories = []
    })
        return RecipesArray
    } 
}