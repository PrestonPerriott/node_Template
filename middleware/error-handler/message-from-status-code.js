'use strict' 

var errorCodes = require('./default-codes')

module.exports = function (statusCode) {
    /// If we have errorCodes in our static file then use that
    if (errorCodes[statusCode]) {
        return errorCodes[statusCode]
    }
    ///Otherwise switch between first digit
    switch (String(statusCode)[0]) {
        case '4':
            return 'Bad Req'
        case '5':
        default:
            return 'Server Error'
    }

}