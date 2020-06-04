# TaskManager
This project contains code I wrote while following [The Complete Node.js Developer](https://www.udemy.com/the-complete-nodejs-developer-course-2) course by Andrew Mead

### Description
The __TaskManager__ project is written using ES6/7 `JavaScript` and uses `Express` to create a simple `Node` web server that allows users to create, store and delete tasks.
<br><br>The project creates a simple REST API that consists of the following endpoints:
1. `/tasks`. This is used to:
   - create a task via a `POST` method. The id of the user who created the task is stored in the task.
   - list all tasks via a `GET` method. A user can only view tasks that they created.
    Query parameters can be supplied to :
       - filter tasks according to whether they have been completed or not
       - limit how many tasks are displayed (pagination)
       - skip a number of pages (pagination)
       - sort by fields in an ascending or descending order
2. `/tasks/:id`. This is used to:
   - get a single task via a `GET` method. A user can only view a task if they created it.
   - update a task via a `PATCH` method. A user can only update a task if they created it.
   - delete a task via a `DELETE` method. A user can only delete a task if they created it.
3. `/users` to create a user via a `POST` method (sign-up).\
The body of the request contains the user's credentials. 
The password is hashed before being stored in the database.
If a user is successfully signed up, an authentication token is returned.
4. `/users/login` to log a user in via a `POST` method (sign-in).\
The user's credentials are validated with this API. 
If successfully authenticated, an authentication token is returned.
5. `/users/logout` to log a user out via a `POST` method (sign-out).
6. `/users/logoutAll` to log a user out of all their sessions via a `POST` method (sign-out).
7. `/users/me`. This is used to:
   - display a user profile via a `GET` method.
   - update a user profile via a `PATCH` method.\
    If the password field is updated it is hashed before being stored in the database.
   - delete a user account via a `DELETE` method.
8. `/users/me/avatar`. This is used to:
   - upload a user's avatar image via a `POST` method. This can be used to create a new image or overwrite an existing one.
   - delete a user's avatar image via a `DELETE` method.
9. `/users/:id/avatar` to serve up the avatar image for a specific user.

Only **sign-up** or **sign-in** are public API's, and thus accessible to anyone.
All the other API's require authentication before they can be called. So, for example, only the user who created a particular task has the authority to delete it.

When a user signs in or signs up the request returns an authentication token - in this case, a Jason Web Token. 
Any subsequent requests must provide this token as an `Authorization` header in the request.

All the tokens issued to a user are stored as part of the user's data.
When a user logs out the token is deleted.
When a user provides a token in a request, we check the token provided against those registered to the user.

<br>The application uses:
1. The `Express` module to create a server that provides the REST API's.
2. A `MondoDB` NoSQL database, using the native `Node.js` driver.
3. `Mongoose` to:
   - model users and tasks
   - validate and sanitise data
   - create a bi-directional relationship between a user and the tasks they have created
   - paginate and sort returned data
3. The `bcrypt` library to store passwords securely by hashing them. 
4. `JSON Web Tokens` to authenticate users who attempt to use any of the non-public API's 
(everything expect signing up or logging in). The tokens are generated using the `jsonwebtoken` library.
5. `Express` middleware to:
   - hash passwords
   - delete any tasks belonging to a user when a user is deleted
   - check that authentication tokens are valid
6. `multer` for uploading and validating image files.
7. `sharp` for resizing avatar images and converting common formats to `PNG`
8. `SendGrid` for sending emails
