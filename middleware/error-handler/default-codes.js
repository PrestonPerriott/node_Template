'use strict'

var errors = {}

errors[400] = 'Bad Request'
errors[401] = 'Invalid Auth'
errors[403] = 'Forbidden'
errors[404] = 'Item not found'
errors[405] = 'Method not found'
errors[406] = 'Unacceptable'
errors[422] = 'Failed Validation'

errors[500] = 'Internal Server Error'
errors[501] = 'Not implemented'
errors[502] = 'Bad gateway'
errors[503] = 'Unavailable'
errors[504] = 'Timeout'

module.exports = errors