# Instructions for Forum

## 1. Create a Question

* This route(POST) is open to all and can be accessed at {{URL}}**/api/forum/create**.
* This route will accept only form-data as :
    ```json
        question
        college
        tags
    ```
* _question_ is a key whose value is a string.
* _college_ is a key whose value contains Object Id of any college(can be more than one(separated by comma)). e.g. : 5f7d8374d0a123607c8ed2c2
* _tags_ is a key whose value contains Object Id of any tag(can be more than one(separated by comma)). e.g. : 5f7da82ce2fbbf83f499ba67,5f7da809e2fbbf83f499ba65
* The incoming field is validated against [validations](#validation)
* If the tag is already there, backend responds with status code and errorDetails.
* If it's not there, it is created and backend responds with :
    ```json
    {
        "college": [
            "5f7d8374d0a123607c8ed2c2"
        ],
        "tags": [
            "5f7da82ce2fbbf83f499ba67",
            "5f7da809e2fbbf83f499ba65"
        ],
        "_id": "5f7dccc55870d04e8471fdd3",
        "question": "What is this?",
        "answers": [],
        "createdAt": "2020-10-07T14:12:21.257Z",
        "updatedAt": "2020-10-07T14:12:21.307Z",
        "__v": 0
    }
    ```

## 2. Get all questions

* This route(GET) is open to all and can be accessed at {{URL}}**/api/forum/questions**.
* No data is to be passed from the frontend.
* If there is any error, backend responds with status code and errorDetails.
* If it's not there, backend responds with :
    ```json
    [
        {
            "college": [
                {
                    "_id": "5f7d8374d0a123607c8ed2c2",
                    "name": "IIT Bombay",
                    "collegeID": "IITB"
                }
            ],
            "tags": [
                {
                    "_id": "5f7da82ce2fbbf83f499ba67",
                    "name": "IIT Kanpur",
                    "slug": "iit-kanpur"
                },
                {
                    "_id": "5f7da809e2fbbf83f499ba65",
                    "name": "IIT Bombay",
                    "slug": "iit-bombay"
                }
            ],
            "_id": "5f7dccc55870d04e8471fdd3",
            "question": "What is this?",
            "answers": [],
            "createdAt": "2020-10-07T14:12:21.257Z",
            "updatedAt": "2020-10-07T14:12:21.307Z"
        }
    ]
    ```

## 3. Get a single question

* This route(GET) is open to all and can be accessed at {{URL}}**/api/forum/question/:qid** where qid(Object Id of any question) is to be passed from the frontend.
* If there is any error or no such tag is found, backend responds with status code and errorDetails.
* If there is no error, backend responds with :
    ```json
    {
        "college": [
            {
                "_id": "5f7d8374d0a123607c8ed2c2",
                "name": "IIT Bombay",
                "collegeID": "IITB"
            }
        ],
        "tags": [
            {
                "_id": "5f7da82ce2fbbf83f499ba67",
                "name": "IIT Kanpur",
                "slug": "iit-kanpur"
            },
            {
                "_id": "5f7da809e2fbbf83f499ba65",
                "name": "IIT Bombay",
                "slug": "iit-bombay"
            }
        ],
        "_id": "5f7deb2618771b755c92388b",
        "question": "What is this?",
        "answers": [],
        "createdAt": "2020-10-07T16:21:58.833Z",
        "updatedAt": "2020-10-07T16:21:58.856Z"
    }
    ```

## 4. Delete a question

* This route(DELETE) is **User-Protected** and can be accessed at {{URL}}**/api/forum/question/:qid** where qid is to be passed from the frontend.
* If there is any error or no such tag is found, backend responds with status code and errorDetails.
* If there is no error, backend responds with :
    ```json
    {
        "responseData": "Question deleted successfully!"
    }
    ```

## 5. Add an answer

* The route(PUT) will be {{URL}}**/api/forum/question/:qid** where collegeID is a parameter and the route is **User-Protected**.
* Since, it is user-protected, Authorization token must be passed in the header.
* Frontend passes these info from the body : 
    ```json
    {
        "answer":"Very nice"
    }
    ```
* The incoming field is validated against [validations](#validations).
* The backend searches for the question using the qid.
    * If no such question is found, backend responds with status code and errorDetails.
    * If question is found, answer as well as answeredBy field is tried to be saved.
        * If there is any error while saving, backend responds with status code and errorDetails.
        * If no error is found, status 200 is passed as :
        ```json
        {
            "college": [
                "5f7d8374d0a123607c8ed2c2"
            ],
            "tags": [
                "5f7da82ce2fbbf83f499ba67",
                "5f7da809e2fbbf83f499ba65"
            ],
            "_id": "5f7deb2618771b755c92388b",
            "question": "What is this?",
            "answers": [
                {
                    "_id": "5f7dec6a66df2a673455325c",
                    "answer": "This is my answer 2",
                    "answeredBy": "XYZ Kumar"
                }
            ],
            "createdAt": "2020-10-07T16:21:58.833Z",
            "updatedAt": "2020-10-07T16:27:22.314Z",
            "__v": 1
        }
        ```

### Validation

* _question_ is **required** and must be a **string**.
* _answer_ is **required** and must be a **string**.