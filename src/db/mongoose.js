const mongoose = require('mongoose')
const validator = require('validator')

const serverURL = "mongodb://127.0.0.1:27017"


async function main(){
    await mongoose.connect(serverURL + '/task-manager-api')

    const User = mongoose.model('User', {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value){
                if (!validator.isEmail(value)) throw new Error('Email is invalid!!')
            }
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
            trim: true,
            validate(value){
                if (value.toLowerCase().includes("password")) throw new Error('Please enter a stronger password!')
            }
        },
        age: {
            type: Number,
            default: 0,
            min: 0
        }
    })

    const Task = mongoose.model('Task', {
        description: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    })

    var user_inst = new User({ name: 'Varun  ', email: 'IRHSJIC@NIC.ORG', password: ' sword', age: 19})

    const result = await user_inst.save()
    console.log(result)

    var task_inst = new Task({ description: 'Completing Software Engineering Project'})

}

main().catch(err => {console.log(err)})