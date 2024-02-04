const request = require('supertest')
const utils = require('./fixtures/db')
const app = require('../src/app')
const Task = require('../src/models/task')
const User = require('../src/models/user')

beforeEach(utils.seedDatabase)

test('Check for creation of tasks', async () => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${utils.userOne.tokens[0].token}`)
        .send({
            description: 'Fourth Task'
        }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Check for fetch of user tasks', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${utils.userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Check for delete task from another user', async () => {

    const response = await request(app).delete(`/tasks/${utils.taskOne._id}`)
        .set('Authorization', `Bearer ${utils.userTwo.tokens[0].token}`)
        .send()
        .expect(404)

})

test('Check for update of task', async () => {
    await request(app).patch(`/tasks/${utils.taskOne._id}`)
        .set('Authorization', `Bearer ${utils.userOne.tokens[0].token}`)
        .send({
            completed: true
        }).expect(200)

    const task = await Task.findById(utils.taskOne._id)
    expect(task.completed).toEqual(true)
})