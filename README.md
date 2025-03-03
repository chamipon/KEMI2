# Kent & Essex Mutual Insurance Coding Exercise
## Project Setup
This project is implemented using MongoDB, Node.js and Express. REDIS and BullMQ are used for asynchronous processing. Tests are written using Mocha and Chai.js. I selected this tech stack because it is both relevant to Kent & Essex and includes a blend of technologies that I am both familiar with and ones that I am excited to learn. 

### Docker Setup
1. Clone this git repository `git clone https://github.com/chamipon/KEMI2.git`
2. Navigate to the root of the project, and run `docker compose up --build`
3. When this command is done running, the api will be available on port 2222

## Documentation
### Database Schema
Since this project uses MongoDB without Mongoose, there is no clearly defined schema. Below is a sample schema for what I believe would make sense. The endpoint documentation assumes the data is in this format.

| Name | Type |
| --- | --- |
| `id` | ObjectId |
| `Title` | string |
| `Description` | string |
| `Status` | string |
### API Endpoints

> [!IMPORTANT]
> All endpoints require an Access Token to be included in the Authorization header. This token can be retrieved from the GET /auth endpoint

#### GET /auth
Seting a GET request to the /auth endpoint will return an Access Token that can be used to access the other enpoints.

**Request:** The request body requires a `username` value.

**Reponse:** The response will contain the access token, if one is generated.

200 - Successful query

500 - Error executing query

<details>
<summary>Sample Request Body</summary>

```
{
    "username":"username",
}
```
</details>
<details>
<summary>Sample Response</summary>

```
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDA5NzA0MTQsImV4cCI6MTc0MDk3MjIxNH0.f9mELNjf8b63BdJCTE--Qwf2GvQHSREd7bC2eybYklI"
```
</details>

#### POST /tasks
Sending a POST request to the /tasks endpoint will create a new task. 

**Request:** Should contain a `title`, `description` and `status`. The `id` value will be automatically set.

**Reponse:** The response will contain the number of created objects.

201 - Successfully created task

400 - Invalid request

401 - Unauthorized

500 - Error executing query

<details>
<summary>Sample Request Body</summary>

```
{
    "title":"Task Title",
    "description": "Task Description",
    "status": "Pending"
}
```
</details>
<details>
<summary>Sample Response</summary>

```
   1
```
</details>

#### GET /tasks
Sending a GET request to the /tasks endpoint will return a list of all tasks.

**Request:** This requires no request body.

**Reponse:** The response will contain all of the tasks in the database.

200 - Successful query

401 - Unauthorized

500 - Error executing query

<details>
<summary>Sample Response</summary>

```
   [
    {
        "_id": 6,
        "title": "Title",
        "description": "Task Description",
        "status": "pending",
    },
    {
        "id": 7,
        "title": "Title",
        "description": null,
        "status": "pending",

    },
    {
        "id": 1,
        "title": "test",
        "description": "Task Description!",
        "status": "in progress",
    }
   ]   
```
</details>

#### GET /tasks/:id
Sending a GET request to the /tasks/:id endpoint will return the task with the supplied id.

**Request:** This requires no request body.

**Reponse:** The response will contain the task with the matching id, if there is one.

200 - Successful query

401 - Unauthorized

404 - No task found with supplied ID

500 - Error executing query

<details>
<summary>Sample Response</summary>
   
```
    {
        "_id": "67c124cd42777010fc3a9928",
        "title": "Title",
        "description": "Task Description",
        "status": "pending",
    }  
```
</details>

#### PUT /tasks/:id
Sending a PUT request to the /tasks/:id endpoint will update the task with the respective id.

**Request:** The request body should contain whatever fields need to be updated, with their new values.

**Reponse:** The response will contain the number of updated items.

200 - Successful query

401 - Unauthorized

404 - No task found with supplied ID

500 - Error executing query

<details>
<summary>Sample Request Body</summary>

```
{
    "title":"Updated Title",
}
```
</details>

<details>
<summary>Sample Response</summary>
   
   ```
    {
        "id": "67c124cd42777010fc3a9928",
        "title": "Updated Title",
        "description": "Task Description",
        "status": "pending",
    }  
   ```
</details>

#### DELETE /tasks/:id
Sending a Delete request to the /tasks/:id endpoint will delete the task with the respective id.

**Request:** This requires no request body.

**Reponse:** The response will contain the updated task.

204 - Successfully deleted task

401 - Unauthorized

404 - No task found with supplied ID

500 - Error executing query

### Running Tests
The tests are implemented with [Mocha](https://mochajs.org/) and [Chai.js](https://www.chaijs.com/). The tests are found in the `/test/task.js` file. 
> [!NOTE]
> The tests will need an Access Token to hit the endpoints. Generate one using the /auth enpoint and update the `token` variable on line 12 in `/test/task.js`

To run the tests, run `npm test` in the root of the project while the server is running.
