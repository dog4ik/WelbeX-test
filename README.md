# User API Endpoints

This module contains API endpoints related to user management.

## Base URL

The base URL for all user endpoints is: `/user`

## GET /user/info

Retrieve user information.

### Headers

- `Authorization: Bearer YOUR_API_KEY` (required): The API key for authentication.

### Response

- `200 OK` on success, with the user information in the response body.
- `404 Not Found` if the user cannot be found.
- `500 Internal Server Error` if an error occurs on the server.

## POST /user/register

Register a new user.

### Request Body

- `username` (required): The username of the user.
- `password` (required): The password of the user.

### Response

- `200 OK` on success, with the access and refresh tokens in the response body.
- `400 Bad Request` if the username or password parameters are missing.
- `409 Conflict` if the username already exists.
- `500 Internal Server Error` if an error occurs on the server.

## POST /user/login

Authenticate and login a user.

### Request Body

- `username` (required): The username of the user.
- `password` (required): The password of the user.

### Response

- `200 OK` on success, with the access and refresh tokens in the response body.
- `400 Bad Request` if the username or password parameters are missing.
- `401 Unauthorized` if credentials are incorrect.
- `500 Internal Server Error` if an error occurs on the server.

## POST /user/refresh

Refresh an access token.

### Request Body

- `token` (required): The refresh token.

### Response

- `200 OK` on success, with the new access token in the response body.
- `401 Unauthorized` if no token is provided or it is invalid.
- `500 Internal Server Error` if an error occurs on the server.

# Posts API Endpoints

This module contains API endpoints related to posts.

### Base URL

The base URL for all posts endpoints is: `/posts`

## GET /posts

Retrieve a paginated list of posts.

### Query Parameters

- `page` (optional): The page number to retrieve. Defaults to 1 if not provided.

### Response

- `200 OK` on success, with an array of post objects in the response body.
- `400 Bad Request` if the `page` parameter is not a valid number or less than or equal to 0.
- `500 Internal Server Error` if an error occurs on the server.

## POST /posts/create

Create a new post.

### Request Body

- `message` (optional): The message of the post.
- `media` (optional): The media URL associated with the post.

### Headers

- Authorization: Bearer YOUR_API_KEY (required): The API key for authentication.

### Response

- `201 Created` on success.
- `400 Bad Request` if both message and media parameters are missing.
- `500 Internal Server Error` if an error occurs on the server.

## PUT /posts/edit

Edit an existing post.

### Request Body

- `postId` (required): The ID of the post to edit.
- `message` (optional): The updated message of the post.
- `media` (optional): The updated media URL associated with the post.

### Headers

- Authorization: Bearer YOUR_API_KEY (required): The API key for authentication.

### Response

- `204 No Content` on success.
- `400 Bad Request` if both message and media parameters are missing, or if the post is not found.
- `500 Internal Server Error` if an error occurs on the server.

## DELETE /posts/delete

Delete a post.

### Request Body

- `postId` (required): The ID of the post to delete.

### Headers

- Authorization: Bearer YOUR_API_KEY (required): The API key for authentication.

### Response

- `204 No Content` on success.
- `400 Bad Request` if the postId parameter is missing or the post is not found.
- `500 Internal Server Error` if an error occurs on the server.
