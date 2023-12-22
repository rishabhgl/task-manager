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

router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter( token => token.token !== req.token )
        await req.user.save()

        res.send(req.user)
    } catch (e){
        res.status(500).send({ error: 'Unable to log out!'})
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send(req.user)
    } catch (e){
        res.status(500).send({ error: 'Unable to log out!'})
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    
})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid update!'})

    try{

        updates.forEach( update => req.user[update] = req.body[update])
        req.user = await req.user.save()

        res.send(req.user)
    } catch(e){
        res.status(400).send(e)
        console.log(e)
    }

})

router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.deleteOne()
        res.send(req.user)
    } catch(e){
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router