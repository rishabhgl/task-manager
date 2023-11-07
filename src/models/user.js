const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jsonwebtoken  = require('jsonwebtoken')
const Task  = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) throw new Error('Email is invalid!!')
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if (value.toLowerCase().includes("password")) throw new Error('Please enter a stronger password!')
        }
    },
    age: {
        type: Number,
        default: 0,
        min: 0
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.genAuthTokenAndSave = async function(){
    const user = this
    const token = await jsonwebtoken.sign( {_id: user._id.toString()}, 'hellofriends' )

    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne( { email } )
    if (!user) throw new Error('Unable to login!')
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login!')

    return user
}

userSchema.pre('save', async function(next){
    const user = this
     
    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8)

    next()
})

userSchema.pre('deleteOne', async function(next){
    const query = this
    console.log(query._conditions._id)
    await Task.deleteMany( {owner: query._conditions._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User