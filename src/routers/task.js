const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    var task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        const createdTask = await task.save()
        res.status(201).send(createdTask)
    } catch(e){
        res.status(400).send(e)
    }
    
})


router.get('/tasks', auth, async (req, res) => {

    try{
        const user = await req.user.populate('tasks')
        res.send(user.tasks)
    } catch(e){
        res.status(500).send()
    }
    
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id 

    try{
        const task = await Task.findOne( {_id, owner: req.user._id})
        if (!task) res.status(404).send()
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
    
})


router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid update!'})

    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id}) 
        if (!task) return res.status(404).send({ error: 'Could not find task!' })

        updates.forEach( update => task[update] = req.body[update])
        res.send(task)
    } catch(e){
        res.status(400).send()
    }

})


router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
})

module.exports = router