const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
    name: 'Barney',
    email: 'barney@example.com',
    password: 'woof8888'
}

beforeEach(async () => {
    await User.deleteMany()
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
