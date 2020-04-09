# TaskManager
This project contains code I wrote while following [The Complete Node.js Developer](https://www.udemy.com/the-complete-nodejs-developer-course-2) course by Andrew Mead

### Description
The __TaskManager__ project is written using ES6/7 _JavaScript_ and uses _Express_ to create a simple _Node_ web server.
<br>The project contains a simple REST API that consists of the following API's:
1. /tasks to create a task via a POST method
2. /tasks to list all the tasks for a user via a GET method
3. /tasks/:id to get a single task via a GET method
4. /tasks/:id to update a task via a PATCH method
5. /tasks/:id to delete a task via a DELETE method
6. /users to list all the users via a GET method
7. /users/login to log a user in via a POST method
8. /users to create a user via a POST method (sign-up)
9. /users/:id to get a single user via a GET method
10. /users/:id to update a user via a PATCH method
11. /users/:id to delete a user via a DELETE method

<br>The application uses:
1. The _Express_ module to create a server that provides the REST API's
2. A _MondoDB_ NoSQL database, using the native Node.js driver
3. _Mongoose_ to model users and tasks and to validate and sanitise data
3. Stores passwords securely by hashing them with the `bcrypt` library
4. JSON Web Tokens to authenticate users who attempt to use any of the non-public API's 
(everything expect signing up or logging in). The tokens are generated using the `jsonwebtoken` library
5. Express middleware to check that authentication tokens are valid
