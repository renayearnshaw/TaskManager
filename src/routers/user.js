const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')
const multer = require('multer')
const sharp = require('sharp')

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

// Upload images and pass through for later processing
const upload = multer({
    // limit file size to 1MB
    limits: { fileSize: 1000000 },
    // only allow certain filetypes
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload one of jpg, jpeg or png'))
        }

        cb(null, true)
    }
})

// Upload a profile image for the user - an 'avatar'
router.post(
    '/users/me/avatar',
    auth,
    // The caller uses the key 'avatar' to specify the file containing the avatar image
    upload.single('avatar'),
    async (req, res) => {
        // The file uploaded via multer is stored in the 'file' property on the request
        // Use Sharp to resize the image and convert it to a png
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    })

// Delete the avatar for a user
router.delete(
    '/users/me/avatar',
    auth,
    async (req, res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    })

// Server up the avatar image for a particular user
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        // Set the response header
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router