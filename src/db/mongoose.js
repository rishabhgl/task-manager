const mongoose = require('mongoose')

const serverURL = "mongodb://127.0.0.1:27017"

mongoose.connect(serverURL + '/task-manager-api')


