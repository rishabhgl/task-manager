const { MongoClient, ObjectId } = require("mongodb")

const dbURL = "mongodb://127.0.0.1:27017"
const client = new MongoClient(dbURL)

async function insertDocs(){
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log('Connection established and tested')  
    
    const db = client.db('task-manager')
    const users = db.collection('users')

    const id = new ObjectId()
    console.log(id)
    console.log(id.getTimestamp())
    console.log(id.id)
    console.log(id.id.length)
    console.log(id.toHexString().length)

    var resultUsers = await users.insertMany([{ name: 'Isha', age: 15 }, { name: 'Akshita', age: 15}])
    console.log(resultUsers)

    const tasks = db.collection('tasks')
    var resultTasks = await tasks.insertMany([ 
        {description: 'Machine Learning Project', completed: false}, 
        {description: 'Solve 3 LeetCode Problems', completed: true}, 
        {description: 'Take a Node.js refresher', completed: false}
    ])
    console.log(resultTasks) 
    

    await client.close()
}

async function findDocs(){
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log('Connection established and tested')  
    
    const db = client.db('task-manager')
    const users = db.collection('users')
    const tasks = db.collection('tasks')

    var user = await users.findOne({ age: 15 })
    var userData = await users.find({ age: 20 }).toArray()

    var userAge20Count = await users.countDocuments({ age:20 })
    var userCount = await users.estimatedDocumentCount()

    var task = await tasks.findOne({ _id: new ObjectId("653bea02afb2b8e8a6e6188c")})
    console.log("Last task: ", task)

    var tasksNotCompleted = await tasks.find({ completed: false}).toArray()
    console.log("Tasks that are not completed: ", tasksNotCompleted)

    await client.close()
}

//insertDocs().catch( error => {console.log('Insertion failed', error)})

findDocs().catch( error => {console.log('Fetching failed', error)})


