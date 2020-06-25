const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

const userOneId = mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Barney',
    email: 'barney@example.com',
    password: 'woof8888',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    // Clear the database
    await User.deleteMany()
    // Add a user for testing purposes
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setupDatabase
}

