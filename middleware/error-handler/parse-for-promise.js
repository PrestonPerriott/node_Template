'use strict'

module.exports = function (error) {

    ///Duplicating so the original error parameter isn't mutated
    var parsedError = {
        message: error.message,
        statusCode: error.statusCode
    }

    if (error.detail) {
        parsedError.detail = error.detail
    }

    var searchString = parsedError.statusCode + ' - {"message":"'
    if (parsedError.message.indexOf(searchString) === 0) {
    var errorObj = parsedError.message.split(' - ')[1]
    parsedError.message = JSON.parse(errorObj).message
  }

  return parsedError
} 
