require('../src/db/mongoose')
const User = require('../src/models/user')

// 5ddd57e9d81e316165170fd6

User.findByIdAndUpdate('5ddd57e9d81e316165170fd6', { age: 1 }).then((user) => {
    console.log(user)
    return User.countDocuments({ age: 1 })
}).then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})