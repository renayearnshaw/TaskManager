const jwt = require('jsonwebtoken')
const User = require('../models/user')

// This method is used as Middleware - it is run between the request coming in and the route running
const auth = async (req, res, next) => {
    try {
        // Get the JWToken passed in Authorization header
        const token = req.header('Authorization').replace('Bearer ', '')
        // Validate the JWT
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        // The JWT contains the id of the user as a property. This is used to find a user
        // with the required id, but that also has a token that matches the one passed in.
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        // Give the route access to the user we just fetched, rather than doing it again
        req.user = user
        // Return the validated token too
        req.token = token

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.'})
    }
}

module.exports = auth