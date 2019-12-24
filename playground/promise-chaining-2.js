require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('5ddd5845d81e316165170fd7').then((task) => {
    console.log(task)
    return Task.countDocuments({ completed: false })
}).then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})