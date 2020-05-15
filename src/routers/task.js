const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication')

const router = new express.Router()

// Fetch all tasks created by a specific user
router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// Fetch a specific task, by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // You can only fetch a task that was created by the authorised user
        const task = await  Task.findOne({_id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

// Update a task by id
router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['completed', 'description']
    const receivedUpdates = Object.keys(req.body)
    const isValidOperation = receivedUpdates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        // The user can only update a task that they created
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        receivedUpdates.forEach((update) => task[update] = req.body[update])
        await task.save()
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

// Delete a task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // A user can only delete a task that they created
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router