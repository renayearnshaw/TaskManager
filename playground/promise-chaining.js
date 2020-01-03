require('../src/db/mongoose')
const User = require('../src/models/user')

// 5ddd57e9d81e316165170fd6

// User.findByIdAndUpdate('5ddd57e9d81e316165170fd6', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((count) => {
//     console.log(count)
// }).catch((error) => {
//     console.log(error)
// })

const updateAgeAndCount =  async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return { age, count }
}

updateAgeAndCount('5ddd57e9d81e316165170fd6', 2).then((props) => {
    console.log(`There are ${props.count} users with an age of ${props.age}`)
}).catch((error) => {
    console.log(error)
})
