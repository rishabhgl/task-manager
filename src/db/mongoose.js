const mongoose = require('mongoose')

const serverURL = "mongodb://127.0.0.1:27017"

mongoose.connect(serverURL + '/task-manager-api')

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
