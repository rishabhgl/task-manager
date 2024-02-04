const request = require('supertest')
const app = require("../src/app")
const User = require("../src/models/user")
const utils = require('./fixtures/db')

const userOne = utils.userOne
const userOneId = utils.userOneId
// const userTwo = utils.userTwo

beforeEach(utils.seedDatabase)

test("Check creation of user using valid data", async () => {

    const response = await request(app).post("/users")
        .send({
            name: "Rishabh",
            email: "rishabh@example.com",
            password: "hellofriends"
        }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user.password).not.toBe('hellofriends')

})

test("Check login of user using valid credentials", async () => {

    const response = await request(app).post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })

})

test("Check for login fail when using invalid credentials", async () => {
    await request(app).post("/users/login")
        .send({
            email: "hemant1@example.com",
            password: userOne.password
        }).expect(400)
})

test("Checking for profile fetch for authenticated user", async () => {
    await request(app).get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Check for profile fetch fail for unauthenticated user", async () => {
    await request(app).get("/users/me")
        .send()
        .expect(401)
})

test("Check for deletion of authenticated user", async () => {
    await request(app).delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test("Check deletion of unathenticated user", async () => {
    await request(app).delete("/users/me")
        .send()
        .expect(401)
})

test('Check for profile picture upload', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Check for valid updates to profile', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Rishabh'
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Rishabh')
})

test('Check for invalid updates to profile', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Philly'
        }).expect(400)
})