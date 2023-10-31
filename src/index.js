const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    var user = new User(req.body)

    try{
        const createdUser = await user.save()
        res.status(201).send(createdUser)
    } catch (e){
        res.status(400).send(e)
    }

})

app.post('/tasks', async (req, res) => {
    var task = new Task(req.body)

    try{
        const createdTask = await task.save()
        res.status(201).send(createdTask)
    } catch(e){
        res.status(400).send(e)
    }
    
})

app.get('/users', async (req, res) => {

    try{
        const users = await User.find({})
        res.send(users)
    } catch(e){
        res.status(500).send(e)
    }
    
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id 

    try{
        const user = await User.findById(_id)
        if (!user) res.status(404).send()
        res.send(user)
    } catch(e){
        res.status(500).send()
    }

})

app.get('/tasks', async (req, res) => {

    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e){
        res.status(500).send()
    }
    
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id 

    try{
        const task = await Task.findById(_id)
        if (!task) res.status(404).send()
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
    
})

app.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid update!'})

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}) 
        if (!updatedUser) return res.status(404).send({ error: 'Could not find user!' })
        res.send(updatedUser)
    } catch(e){
        res.status(400).send(e)
        console.log(e)
    }

})

app.patch('/tasks/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid update!'})

    try{
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}) 
        if (!updatedTask) return res.status(404).send({ error: 'Could not find task!' })
        res.send(updatedTask)
    } catch(e){
        res.status(400).send(e)
    }

})

app.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) res.status(404).send({ error: 'User not found!'})
        res.send(user)
    } catch(e){
        res.status(500).send()
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) res.status(404).send({ error: 'Task not found!'})
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log('Server running on port ' + port + '!!')
})