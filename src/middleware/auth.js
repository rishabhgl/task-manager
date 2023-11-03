const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const tokenData = jsonwebtoken.verify(token, 'hellofriends')
        const user = await User.findOne( {_id: tokenData._id, 'tokens.token': token} )
        if (!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch(e){
        res.status(401).send({ error: 'Please login!'})
    }
}

module.exports = auth