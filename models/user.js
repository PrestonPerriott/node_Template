var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var UserSchema = mongoose.Schema({

    username: {
        type: String,
        index: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: false
    },

    date: {
        type: Date,
        default: Date.now,
        require: true
    }
})

//Export our schema as User
var User = module.exports = mongoose.model('User', UserSchema)

///create user func 
module.exports.createUser = function(newUser, cb) {

    ///hash pword
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            ///store pword
            newUser.password = hash
            newUser.save(cb)
        }) 
    })
}