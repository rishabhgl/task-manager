const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Hemant",
    email: "hemant@example.com",
    password: "hellofriends",
    tokens: [{
        token: jwt.sign({ _id: userOneId.toString() }, process.env.JWT_PHRASE)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Himani",
    email: "himani@example.com",
    password: "hellofriends",
    tokens: [{
        token: jwt.sign({ _id: userTwoId.toString() }, process.env.JWT_PHRASE)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userOneId,
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: userOneId,
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: true,
    owner: userTwoId,
}

const seedDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    seedDatabase
}