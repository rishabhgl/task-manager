const express = require('express')
const User = require('../models/user')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const multer = require('multer')

const router = new express.Router()
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            cb(new Error('Please upload an image file!'))
        }

        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    var user = new User(req.body)

    try {
        const createdUser = await user.save()
        const token = await user.genAuthTokenAndSave()
        res.status(201).send({ user: createdUser, token })
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.genAuthTokenAndSave()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send({ error: 'Unable to log out!' })
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send({ error: 'Unable to log out!' })
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid update!' })

    try {

        updates.forEach(update => req.user[update] = req.body[update])
        req.user = await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }

})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.send(req.user)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({
        error: err.message
    })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        if (req.user.avatar) {
            req.user.avatar = undefined
            await req.user.save()
            res.status(200).send()
        }
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send({
            error: e.message
        })
    }

})
module.exports = router