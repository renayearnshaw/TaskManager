const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')

const router = new express.Router()

// Get a user profile.
// Register the Middleware function auth, that is run between the request coming in and the route running
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Log in an existing user - i.e. sign in
router.post('/users/login', async (req, res) => {
    try {
        // Authenticate the user
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // Create a JWT and return it to the user
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// Create a user - i.e. sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        // Create a new user
        await user.save()
        // Create a JWT and return it to the user
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const receivedUpdates = Object.keys(req.body)
    const isValidOperation = receivedUpdates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        const user = await User.findById(req.params.id)
        receivedUpdates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router