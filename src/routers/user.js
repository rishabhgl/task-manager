const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async (req, res) => {
    var user = new User(req.body)

    try{
        const createdUser = await user.save()
        const token = await user.genAuthTokenAndSave()
        res.status(201).send( {createdUser, token} )
    } catch (e){
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.genAuthTokenAndSave()
        res.send({user, token})
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    
})

router.get('/users/:id', async (req, res) => {
    console.log("Here")
    const _id = req.params.id 

    try{
        const user = await User.findById(_id)
        if (!user) res.status(404).send()
        res.send(user)
    } catch(e){
        res.status(500).send()
    }

})

router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid update!'})

    try{

        var updatedUser = await User.findById(req.params.id)

        if (!updatedUser) return res.status(404).send({ error: 'Could not find user!' })

        updates.forEach( update => updatedUser[update] = req.body[update])
        updatedUser = await updatedUser.save()

        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}) 
        res.send(updatedUser)
    } catch(e){
        res.status(400).send(e)
        console.log(e)
    }

})

router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) res.status(404).send({ error: 'User not found!'})
        res.send(user)
    } catch(e){
        res.status(500).send()
    }
})

module.exports = router