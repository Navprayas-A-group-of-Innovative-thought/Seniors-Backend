# College Instructions

## 1. Create a college

* This route(POST) is **Admin-Protected** and will be {{URL}}**/api/college/create**.
* From frontend, following data will be passed as :
```json
{
    "name" : "IIT Delhi",
    "collegeID" : "IITD"
}
```
* The incoming fields are validated against the [validations](#validations).
* If the college already exists, error with status code and errorDetails will be sent to frontend.
* If not already there, the college is tried to be saved.
    * If there is error while saving, error with status code and errorDetails will be sent to the frontend.
    * If there is no error, the college details is saved and the response with status code 200 is sent to frontend which looks like :
        ```json
        {
            "college": {
                "_id": "5f7d856ad8f05a7394519389",
                "name": "IIT Delhi",
                "collegeID": "IITD",
                "reviews": [],
                "createdAt": "2020-10-07T09:07:54.665Z",
                "updatedAt": "2020-10-07T09:07:54.665Z",
                "__v": 0
            }
        }
        ```

## 2. Get All Colleges

* The route(GET) will be {{URL}}**/api/college/all** and open to all.
* Nothing is to be passed from the frontend.
* The backend will respond to the request as :
    * If there is any error while fetching data from the database, error with status code and errorDetails will be passed to the frontend.
    * If there is no error, respond with status 200 is sent to frontend which looks like :
    ```json
    [
        {
            "_id": "5f7d8374d0a123607c8ed2c2",
            "name": "IIT Bombay",
            "collegeID": "IITB",
            "reviews": [],
            "createdAt": "2020-10-07T08:59:32.801Z",
            "updatedAt": "2020-10-07T10:18:25.070Z",
            "__v": 1
        },
        {
            "_id": "5f7d856ad8f05a7394519389",
            "name": "IIT Delhi",
            "collegeID": "IITD",
            "reviews": [
                {
                    "_id": "5f7d8b04544123519c4f451c",
                    "review": "Very nice",
                    "postedBy": "XYZ Kumar",
                    "createdAt": "2020-10-07T09:31:48.513Z",
                    "updatedAt": "2020-10-07T09:31:48.513Z"
                }
            ],
            "createdAt": "2020-10-07T09:07:54.665Z",
            "updatedAt": "2020-10-07T09:31:48.514Z",
            "__v": 1
        }
    ]
    ```

## 3. Get A Single College

* The route(GET) will be {{URL}}**/api/college/:collegeID** where collegeID is a parameter and open to all.
* The backend searches for college ID in the database.
    * If there is any error or no such college is found, backend reponds with status code and errorDetails.
    * If no error, backend responds witn status code 200 and :
        ```json
        [
            {
                "_id": "5f7d8374d0a123607c8ed2c2",
                "name": "IIT Bombay",
                "collegeID": "IITB",
                "reviews": [],
                "createdAt": "2020-10-07T08:59:32.801Z",
                "updatedAt": "2020-10-07T10:18:25.070Z",
                "__v": 1
            }
        ]
        ```

## 4. Add a review

* The route(PUT) will be {{URL}}**/api/college/update/:collegeID** where collegeID is a parameter and the route is **User-Protected**.
* Since, it is user-protected, Authorization token must be passed in the header.
* Frontend passes these info from the body : 
    ```json
    {
        "review":"Very nice"
    }
    ```
* The incoming field is validated against [validations](#validations).
* The backend searches for the college using the collegeID.
    * If no such college is found, backend responds with status code and errorDetails.
    * If college is found, reviews as well as postedBy field is tried to be saved.
        * If there is any error while saving, backend responds with status code and errorDetails.
        * If no error is found, status 200 is passed as :
        ```json
        {
            "_id": "5f7d856ad8f05a7394519389",
            "name": "IIT Delhi",
            "collegeID": "IITD",
            "reviews": [
                {
                    "_id": "5f7d9faa766ebf82ac9317a3",
                    "review": "Very nice",
                    "postedBy": "XYZ Kumar",
                    "createdAt": "2020-10-07T10:59:54.237Z",
                    "updatedAt": "2020-10-07T10:59:54.237Z"
                }
            ],
            "createdAt": "2020-10-07T09:07:54.665Z",
            "updatedAt": "2020-10-07T10:59:54.237Z",
            "__v": 3
        }
        ```

## 5. Delete a college

* The route(DELETE) is **Admin-Protected** and will be {{URL}}**/api/college/:collegeID**.
* Backend searches for college using collegeID.
* If error or not found, backend responds with status code and errorDetails.
* If no error, the college is deleted and status 200 and responseData is passed to the frontend.
    ```json
    {
        "responseData": "College has been deleted successfully."
    }
    ```

## 6. Delete a review

* This route(DELETE) is **User-Protected** and will be {{URL}}**/api/college/:collegeID/review?id=ObjectIDOfReview**.
* If there is not collegeID or review id, backend responds with status code and errorDetails.
* If both are there, review is tried to be deleted from the specific college.
    * If there is any error, backend responds with error code and errorDetails.
    * If there is no error, status 200 is sent as :
        ```json
        {
            "responseData": "Review has been deleted."
        }
        ```


**Note** : **Authorization Token** must be passed in every **Admin-Protected** and **User-Protected** route.

### Validations

* _name_ is **required** and must be a **string**.
* _collegeID_ is **required** and must be a **string**.
* _review_ is **required**(in add review route) and must be a **string**.