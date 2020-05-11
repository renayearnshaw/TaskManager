const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication')

const router = new express.Router()

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = ['completed', 'description']
    const receivedUpdates = Object.keys(req.body)
    const isValidOperation = receivedUpdates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        const task = await Task.findById(req.params.id)
        receivedUpdates.forEach((update) => task[update] = req.body[update])
        await task.save()
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Create a task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        // Use the object spread syntax to get all the properties of req.body into our task
        ...req.body,
        // Add the user that we just authenticated via middleware
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router