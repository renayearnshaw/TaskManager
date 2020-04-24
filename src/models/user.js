const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, unique: true, required: true, trim: true, lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email is invalid')
        }
    },
    age: {
        type: Number, default: 0,
        validate(value) {
            if (value < 0) throw new Error('Age must be positive')
        }
    },
    password: {
        type: String, required: true, trim: true, minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) throw new Error('Password cannot contain the string \'password\'')
        }
    },
    tokens: [{
        token: {
            type: String, required: true
        }
    }]
})

// An instance method
userSchema.methods.generateAuthToken = async function() {
    const user = this
    // Create a JWT that contains the id of the user, and is signed with a secret
    const token = jwt.sign({ _id: user._id.toString()}, 'RenaysSecret')

    // Add the new token to the token array stored with the user data
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// A static method that is available on the model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Login unsuccessful')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Login unsuccessful')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
