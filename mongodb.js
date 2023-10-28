const MongoClient = require("mongodb").MongoClient

const dbURL = "mongodb://127.0.0.1:27017"
const client = new MongoClient(dbURL)
const dbName = 'task-manager'

async function connectToDBServer(){
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log('Connection established and tested')  
    
    const db = client.db(dbName)
    const users = db.collection('users')

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

connectToDBServer().catch( error => {console.log('Insertion failed', error)})


