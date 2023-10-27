const MongoClient = require("mongodb").MongoClient

const dbURL = "mongodb://127.0.0.1:27017"
const client = new MongoClient(dbURL)
const dbName = 'task-manager'

async function connectToDBServer(){
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log('Connection established and tested')
}

connectToDBServer().catch(() => {console.log('Connection failed')})

const db = client.db(dbName)
db.collection('users').insertOne({
    name: 'Rishabh',
    age: 19
})