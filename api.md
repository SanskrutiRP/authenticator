# Authenticator NestJS Application

This is a simple authentication API built with NestJS, providing endpoints for user login, fetching user profiles, and updating user details.

## API Endpoints

### 1. LOGIN API

**Endpoint:**
```
POST /auth/login
```

**Description:**
Authenticates a user and returns a JWT token.

**Request:**
```bash
curl --location 'http://localhost:3005/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "xyz@gmail.com",
    "password": "123456",
    "bio": "new user",
    "phoneNumber": "9730854342",
    "name": "sanskriti",
    "url": "base64: "
}'
```

**Response:**
Returns a JWT token upon successful authentication.

---

### 2. FETCH ALL USERS

**Endpoint:**
```
GET /users
```

**Description:**
Fetches all users in the system. Requires authorization.

**Request:**
```bash
curl --location 'http://localhost:3005/users?userId=77187c19-3ff4-4a6b-a753-83370d520719' \
--header 'Authorization: Bearer <JWT_TOKEN>'
```

**Response:**
Returns a list of users.

---

### 3. GET USER PROFILE

**Endpoint:**
```
GET /users/me
```

**Description:**
Fetches the profile of the currently authenticated user. Requires authorization.

**Request:**
```bash
curl --location 'http://localhost:3005/users/me?userId=77187c19-3ff4-4a6b-a753-83370d520719' \
--header 'Authorization: Bearer <JWT_TOKEN>'
```

**Response:**
Returns the profile details of the authenticated user.

---

### 4. UPDATE USER PROFILE

**Endpoint:**
``PUT /users/me``

**Description:**
Updates the profile of the currently authenticated user. Requires authorization.

**Request:**
```bash
curl --location 'http://localhost:3005/users/me?userId=77187c19-3ff4-4a6b-a753-83370d520719' \
--header 'Authorization: Bearer <JWT_TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "xyz@gmail.com",
    "bio": "updated bio",
    "phoneNumber": "1234567890",
    "name": "updated name",
    "url": "newBase64: "
}'
```

**Response:**
Returns the updated profile details of the authenticated user.

---

## Notes
- Replace `<JWT_TOKEN>` with the actual token received from the login endpoint.
- Ensure the server is running on `http://localhost:3005` or update the URLs accordingly if using a different host or port.
- Authorization headers must be included in requests that require authentication.

## Setup and Running the Application
To set up and run the application locally:
1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Execute DB migrations `npm run migrate`.
4. Start the NestJS application with `npm run start`.
5. The application will be available at `http://localhost:3005`.

For more detailed instructions, please refer to the NestJS documentation or the project-specific setup guide.
