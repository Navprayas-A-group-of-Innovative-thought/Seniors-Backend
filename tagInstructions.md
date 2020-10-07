# Instructions for Tags

## 1. Create a Tag

* This route(POST) is open to all and can be accessed at {{URL}}**/api/tag/create**.
* Follwing info is passed in the body :
    ```json
    {
        "name" : "IIT Guwahati"
    }
    ```
* The incoming field is validated against [validations](#validation)
* If the tag is already there, backend responds with status code and errorDetails.
* If it's not there, it is created and backend responds with :
    ```json
    {
        "_id": "5f7daa23ee4dbe0b5cc50eb0",
        "name": "IIT Guwahati",
        "slug": "iit-guwahati",
        "createdAt": "2020-10-07T11:44:35.706Z",
        "updatedAt": "2020-10-07T11:44:35.706Z",
        "__v": 0
    }
    ```

## 2. Get all tags

* This route(GET) is open to all and can be accessed at {{URL}}**/api/tag/all**.
* No data is to be passed from the frontend.
* If there is any error, backend responds with status code and errorDetails.
* If it's not there, backend responds with :
    ```json
    [
        {
            "_id": "5f7da809e2fbbf83f499ba65",
            "name": "IIT Bombay",
            "slug": "iit-bombay",
            "createdAt": "2020-10-07T11:35:37.746Z",
            "updatedAt": "2020-10-07T11:35:37.746Z",
            "__v": 0
        },
        {
            "_id": "5f7da82ce2fbbf83f499ba67",
            "name": "IIT Kanpur",
            "slug": "iit-kanpur",
            "createdAt": "2020-10-07T11:36:12.395Z",
            "updatedAt": "2020-10-07T11:36:12.395Z",
            "__v": 0
        },
        {
            "_id": "5f7daa23ee4dbe0b5cc50eb0",
            "name": "IIT Guwahati",
            "slug": "iit-guwahati",
            "createdAt": "2020-10-07T11:44:35.706Z",
            "updatedAt": "2020-10-07T11:44:35.706Z",
            "__v": 0
        }
    ]
    ```

## 3. Get a single tag

* This route(GET) is open to all and can be accessed at {{URL}}**/api/tag/:slug** where slug is to be passed from the frontend.
* If there is any error or no such tag is found, backend responds with status code and errorDetails.
* If there is no error, backend responds with :
    ```json
    {
        "_id": "5f7daa23ee4dbe0b5cc50eb0",
        "name": "IIT Guwahati",
        "slug": "iit-guwahati",
        "createdAt": "2020-10-07T11:44:35.706Z",
        "updatedAt": "2020-10-07T11:44:35.706Z",
        "__v": 0
    }
    ```

## 4. Delete a tag

* This route(DELETE) is **Admin-Protected** and can be accessed at {{URL}}**/api/tag/:slug** where slug is to be passed from the frontend.
* If there is any error or no such tag is found, backend responds with status code and errorDetails.
* If there is no error, backend responds with :
    ```json
    {
        "responseData": "Tag deleted successfully!"
    }
    ```


### Validation

* _name_ is **required** and must be a **string**.