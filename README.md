# TaskManager
This project contains code I wrote while following [The Complete Node.js Developer](https://www.udemy.com/the-complete-nodejs-developer-course-2) course by Andrew Mead

### Description
The __TaskManager__ project is written using ES6/7 `JavaScript` and uses `Express` to create a simple `Node` web server that allows users to create, store and delete tasks.
<br><br>The project creates a simple REST API that consists of the following:
1. `/tasks` to create a task via a `POST` method.
2. `/tasks` to list all the tasks for a user via a `GET` method.
3. `/tasks/:id` to get a single task via a `GET` method.
4. `/tasks/:id` to update a task via a `PATCH` method.
5. `/tasks/:id` to delete a task via a `DELETE` method.
6. `/users` to list all the users via a `GET` method.
7. `/users/login` to log a user in via a `POST` method (sign-in).\
The user's credentials are validated with this API. 
If successfully authenticated, an authentication token is returned.
8. `/users` to create a user via a `POST` method (sign-up).\
The body of the request contains the user's credentials.\
The password is hashed before being stored in the database.
9. `/users/:id` to get a single user via a `GET` method.
10. `/users/:id` to update a user via a `PATCH` method.\
If the password field is updated it is hashed before being stored in the database.
11. `/users/:id` to delete a user via a `DELETE` method.

Only **sign-up** or **sign-in** are public API's, and accessible to anyone.
All the other API's require authentication before they can be called.\
So, for example, only the user who created a particular task has the authority to delete it.

<br>The application uses:
1. The `Express` module to create a server that provides the REST API's.
2. A `MondoDB` NoSQL database, using the native `Node.js` driver.
3. `Mongoose` to model users and tasks and to validate and sanitise data.
3. The `bcrypt` library to store passwords securely by hashing them. 
4. `JSON Web Tokens` to authenticate users who attempt to use any of the non-public API's 
(everything expect signing up or logging in). The tokens are generated using the `jsonwebtoken` library.
5. `Express` middleware to hash passwords and to check that authentication tokens are valid.
