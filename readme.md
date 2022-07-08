# Backend Project

REST api, which is somewhat similar to various popular apps, which tell you if a number is spam, or allow you to find a person’s name by searching for their phone number.

## Terminology and assumptions :
- Each registered user of the app can have zero or more personal “contacts”.
- The user’s phone contacts will be automatically imported into the app’s database.
- Registration and Profile
    - A user has to register with at least name and phone number, along with a password, before using the api's
    - Only one user can register on the app with a particular phone number.
    - A user needs to be logged in to do anything; there is no public access to anything.
- Spam:
    - A user should be able to mark a number as spam so that other users can identify spammers via the global database. 
    - The number may or may not belong to any registered user or contact - it could be a random number.
- Search 
    - A user can search for a person by name in the global database. Search results display the name, phone number and spam likelihood for each result matching that name completely or partially.


## Design : 
- MVC (Model, View, Controller) approach is followed to ensure the scalability of the application
- SQL Database is used in which there are 3 Tables : 
    1. Registered Users, The users in which data of the registered users would be stored.
    2. Global Database, In this all the users are stored with a their phone numbers, names in various contact lists, spam count.
    3. Spam Records. In this reported phone numbers are stored with the users who reported them. So that one user can not report the same user multiple time.




## API endpoints

auth - required | method-type | endpoints| Items expected in request object| response obj |
--- | --- | --- | --- | ---
no | post | /api/users/signup | phoneNumber : "", name:"", email:"", password:"" | data of the user added
no | get | /api/users/login  | phoneNumber : "", password:"" | jwt
yes | post | /api/users/search/:number | number:"true/false", true would search number as phoneNumber in the database, false would search the db with number as name | results of the users found in the array
yes | post | /api/users/report| phoneNumber:"" | 


