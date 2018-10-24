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
    },

    accessToken: {
        type: String,
        default: '',
    }
})

//Export our schema as User
var User = module.exports = mongoose.model('User', UserSchema)

///create user func 
module.exports.createUser = async (newUser) => {

    var user = null
    console.log('Attempting to save user...')

    let encryption = await bcrypt.genSalt(10) 
    let hash = await bcrypt.hash(newUser.password, encryption)
    newUser.password = hash
    user = await newUser.save()
    console.log('User successfully saved')
    return user
}

module.exports.userByUserName = async function(username) { 

    var search = {username : username}
    var foundUser = null
    foundUser = await User.findOne(search)
    return foundUser
}

module.exports.userByEmail = async function(email) {

    var search = {email : email}
    var foundUser = null
    foundUser = await User.findOne(search)
    return foundUser
}

module.exports.comparePassword = async function(password, hash) {

    let comparison = await bcrypt.compare(password, hash)
    return comparison
}

module.exports.stripToJSON = async function(user) {
    var obj = user.toObject()
    await delete obj['password']
    return obj
}