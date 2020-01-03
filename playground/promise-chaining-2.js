require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5ddd5845d81e316165170fd7').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((count) => {
//     console.log(count)
// }).catch((error) => {
//     console.log(error)
// })

const deleteAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteAndCount('5dfcfb6ae0a942e0ffd40fc2').then((count) => {
    console.log(`There are ${count} uncompleted tasks`)
}).catch((error) => {
    console.log(error)
})