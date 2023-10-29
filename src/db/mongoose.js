const mongoose = require('mongoose')

const serverURL = "mongodb://127.0.0.1:27017"


async function main(){
    await mongoose.connect(serverURL + '/task-manager-api')

    const User = mongoose.model('User', {
        name: {
            type: String
        },
        age: {
            type: Number
        }
    })

    const Task = mongoose.model('Task', {
        description: {
            type: String
        },
        completed: {
            type: Boolean
        }
    })

    var user_inst = new User({ name: 'Rishabh', age: 19})
    var task_inst = new Task({ description: 'Completing Software Engineering Project', completed: false})
    await task_inst.save()
}

main().catch(err => {console.log(err)})