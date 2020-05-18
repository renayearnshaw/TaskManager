const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

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
}, {
    // Add createdAt and updatedAt timestamps
    timestamps: true
})

// Set up a virtual property to define a relationship between a user and their tasks.
// This is not stored in the database.
userSchema.virtual('tasks', {
    ref: 'Task',
    // The field in the 'local' object (user) that defines the relationship
    localField: '_id',
    // The field in the 'foreign' object (task) that defines the relationship
    foreignField: 'owner'
})

// An instance method that gets called whenever a user object is "stringified" with JSON.stringify().
// This is what Express does when we pass an object back in the response.
userSchema.methods.toJSON = function () {
    const user = this
    // Convert the Mongoose document into a plain JavaScript object
    const userObject = user.toObject()

    // Remove data that you want to remain private
    delete userObject.password
    delete userObject.tokens

    return userObject
}

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

// Delete a user's tasks when removing the user
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
