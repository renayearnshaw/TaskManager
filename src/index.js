const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// Register a new Middleware function that gets run between the request coming in and
// the route running
// app.use((req, res, next) => {
//     res.status(503).send('This site is currently under maintenance. Please try again later.')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign( { _id: 'password123'}, 'RenaysSecret', { expiresIn: '7 days'})
    console.log(token)

    const data = jwt.verify(token, 'RenaysSecret')
    console.log(data)
}

myFunction()
