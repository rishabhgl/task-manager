const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    var user = new User(req.body)
    
    user.save().then( user => {
        res.status(201).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.post('/tasks', (req, res) => {
    var task = new Task(req.body)
    
    task.save().then( task => {
        res.status(201).send(task)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then(users => { 
        if (!users){
            res.status(404).send('No user found!!')
            return
        }
        res.send(users) 
    }).catch(err => {
        res.status(500).send(err)
    }) 
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id 
    User.findById(_id).then(user => { 
        if (!user){
            res.status(404).send('No task found!!')
            return
        }
        res.send(user) 
    }).catch(err => {
        res.status(500).send(err)
    }) 
})

app.get('/tasks', (req, res) => {
    Task.find({}).then(tasks => { 
        if (!tasks){
            res.status(404).send('No task found!!')
            return
        }
        res.send(tasks) 
    }).catch(err => {
        res.status(500).send(err)
    }) 
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id 
    Task.findById(_id).then(task => { 
        if (!task){
            res.status(404).send('No task found!!')
            return
        }
        res.send(task) 
    }).catch(err => {
        res.status(500).send(err)
    }) 
})

app.listen(port, () => {
    console.log('Server running on port ' + port + '!!')
})