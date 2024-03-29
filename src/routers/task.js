const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    var task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        const createdTask = await task.save()
        res.status(201).send(createdTask)
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }

})


router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        [field, order] = req.query.sortBy.split(':')
        sort[field] = order === 'asc' ? 1 : -1
    }

    try {
        const user = await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(user.tasks)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }

})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }

})


router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid update!' })

    try {
        var task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send({ error: 'Could not find task!' })

        updates.forEach(update => task[update] = req.body[update])
        task = await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }

})


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (task === null) res.status(404).send()
        else res.send(task)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})

module.exports = router