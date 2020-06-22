const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

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

beforeEach(async () => {
    // Clear the database
    await User.deleteMany()
    // Add a user for testing purposes
    await new User(userOne).save()
})

test('Should sign up a new user', async () => {
    await request(app).post('/users').send({
        name: 'Frederica',
        email: 'fred@example.com',
        password: 'MyPass777!'
    }).expect(201)
})

test('Should log in an existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Shouldn\'t log an invalid user in', async () => {
    await request(app).post('/users/login').send({
        email: 'renay@example.com',
        password: 'anyOldPassword'
    }).expect(400)
})

test('Should get profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Shouldn\'t get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for authorized user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Shouldn\'t delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})
