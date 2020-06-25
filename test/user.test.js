const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Frederica',
        email: 'fred@example.com',
        password: 'MyPass777!'
    }).expect(201)

    // Assert tht the user was correctly created in the database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Frederica',
            email: 'fred@example.com'
        },
        token: user.tokens[0].token
    })

    // Assert that the password is not stored in plain text
    expect(user.password).not.toBe('MyPass777!')
})

test('Should log in an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // The token returned by sign in should match the new token in the database
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[0].token)
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

    // We shouldn't fined the user in the database
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Shouldn\'t delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    // toBe() uses ===, so it can't be used to compare two different objects
    // Check that an avatar exists and is of type Buffer
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update a valid user field', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Freddy'
        })
        .expect(200)

    // Check that the new name is stored in the database
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Freddy')
})

test('Should not update an invalid user field', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            address: 'North Leeds'
        })
        .expect(400)
})
