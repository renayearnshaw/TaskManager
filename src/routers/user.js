const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')

const router = new express.Router()

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

// Log out of a session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // Remove the token from list registered to the user
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Log out of all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // Remove all tokens registered to the user
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
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

// Get a user profile.
// Register the Middleware function auth, that is run between the request coming in and the route running
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Update your profile details
router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const receivedUpdates = Object.keys(req.body)
    const isValidOperation = receivedUpdates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        // Authentication returns the user to us - now update it
        receivedUpdates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete your profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        // Authentication returns the user to us - now remove it
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router