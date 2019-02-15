'use strict'

var messageFromStatus = require('./message-from-status-code')
var parseForPromise = require('./parse-for-promise')

module.exports = function (err, req, res, next) {

    var parsedError = err

    if (err.message) {
        parsedError = parseForPromise(err)
    }

    ///If headers have already been sent
    if (req.headersSent) {
        return next(parsedError)
    }

    ///Build response to send to user
    var errCode = parsedError.statusCode || 500
    var resp = {
        message: parsedError.message || messageFromStatus(errCode)
    }

    if (parsedError.detail) {
        resp.detail = parsedError.detail
    }

    return res
        .status(errCode)
        .send(resp)
}