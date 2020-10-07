# Authorisation and Authentication Instructions for Users


## 1. Sign Up

* From the frontend, request will be passed from the body as : 
```json
{
    "name" : "Ashutosh Krishna",
    "email" : "sekado1151@brosj.net",
    "password" : "Asdfghjkl1@",
    "confirmPassword" : "Asdfghjkl1@",
    "contact" : "9031XXXXXX",
    "college" : "IIT XYZ",
    "category" : "IIT",
    "batch" : "2022",
    "branch" : "CSE"
}
```
* The route for the signup will be {{URL}}**/api/signup**
* This will be a **Admin-Protected** route, hence only Admin can signup on behalf of users.
* All the fields will be validated as per the [validations](#validations).
* If the user already exists, error with status code of 400 will be sent to frontend with a message.
* The emailVerified will be set to true automatically and an email will be sent to the user with their login credentials.

## 3. Log In

* From the frontend, request will be passed from the body as :

```json
{
    "email" : "lednor@mailpoof.com",
    "password" : "Asdfghjkl1@"
}
```
* The route will be {{URL}}**/api/login**
* The email and password will be validated against the [validations](#validations).
* Once validated successfully, the email is checked if it exists or not.
    * If it doesn't exist, an error with status code of 400 will be sent to frontend.
    * If it exists, the password is compared against the hashed password in the database.
        * If it doesn't match, an error with status code of 400 will be sent to frontend.
        * If it matches, the user is signed in and a token(expiring in 7 days) is generated.

## 4. Forgot Password

* From the frontend, request will be passed from the body as :

```json
{
    "email" : "sekado1151@brosj.net"
}
```
* The route will be {{URL}}**/api/password/forgot**
* The email is matched in the database. If there's no user, an error with status code of 400 will be sent to frontend.
* If user is found, a password reset link(expires in 10 min) is sent to the email of the user. 
* Also, the resetPasswordLink field in the database is updated with the token generated.

## 5. Reset Password

* The route is {{URL}}**/api/password/reset**
* Once the user clicks on the email, if it's expired or there is any error, an error with status code of 400 will be sent to frontend.
* If there is no error, the token is matched with the resetPasswordLink field in the user's database.
* If it matches, the following parameter is received from the frontend:
```json
{
    "newPassword" : "kuchhBhi1_"
}
```
* This password in the database is now updated with the newPassword(hashed) and resetPasswordLink is again made empty.
* If there's any error in updating the password, an error with status code of 400 will be sent to frontend.

## 5. Change Password

* The route(PUT) will be {{URL}}**/api/password/change**.
* Only authorised requests will be accepted since the route has been protected else error will be passed with status code 401 and message Please sign in.
* Refer to [Protected Routes](https://github.com/Navprayas-A-group-of-Innovative-thought/Navprayas-Backend/blob/master/authInstructions.md#6-protected-routes) for instructions regarding authorised requests. 
* From the frontend, authorisation token will be passed in the header.
* Following fields have to be passed from the frontend in the body :
```json
{
    "oldPassword" : "kuchhbhi1_",
    "newchangePassword":"changeKiye1@",
    "confirmchangePassword":"changeKiye1@"
}
```
* The incoming fields are validated against the [validations](#validations).
    * If there is an error, error with status code 422 and errorDetails will be sent to frontend.
    * If there is no error, the user is searched in the database.
        * If the user is not found, error with status code 404 and errorDetails is passed to the frontend.
        * If user is found, the oldPassword coming from the body is compared with the password saved in the database.
            * If the passwords don't match, error with status code 401 and errorDetails is sent to frontend.
            * If they match, the incoming newchangePassword and confirmchangePassword is matched against each other.
                * If they don't match, error with status code of 401 and errorDetails is passed to frontend.
                * If they match, the password in the database is updated with the incoming newchangePassword.
                    * If there is any error in updating the password, error with status code 400 and errorDetails is sent to frontend.
                    * If there is no error, responseData with status code of 200 and message is passed to the frontend.


## 6. Account Delete

* The route(DELETE) will be {{URL}}**/api/account/delete**
* Only user-authorised requests will be accepted since the route has been protected else error will be passed with status code 401 and message Please sign in.
* Refer to [Protected Routes](https://github.com/Navprayas-A-group-of-Innovative-thought/Navprayas-Backend/blob/master/authInstructions.md#6-protected-routes) for instructions regarding authorised requests. 
* From the frontend, authorisation token will be passed in the header.
* The user is extracted from the token and its account is deleted.
    * If there is any error, an error with status 500 and errorDetails is sent to the frontend.
    * if no error, the request is processed successfully and status of 200 and responseData is sent to the frontend.

### Validations

* _name_ is **required**.
* _email_ is **required**.
* _password_ of **length 8-20** characters is **required** and it should contain:
    * atleast **one lowercase letter**
    * atleast **one uppercase letter**
    * atleast **one digit**
    * atleast **one special character** from **@,#,$,%,&,_**
* _confirmPassword_ is **required** and should **match** with password
* _contact_ is **required** and should be a **valid** phone number(without +91/0)
* _college_ is **required** and should be a **string**
* _category_ is **required** and should be either **IIT** , **NIT** or **IIIT**
* _batch_ is **required** and should be a **number**(20XX)
* _branch_ is **required** and should be a **string**
