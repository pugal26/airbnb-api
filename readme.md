# Airbnb Clone Backend

This repository contains the backend code for an Airbnb clone application. The backend is built using Node.js, Express.js, and MongoDB. It provides various endpoints for user authentication, place management, bookings, and image uploads.

## Getting Started

To run the backend locally, follow these steps:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up your MongoDB database and configure the connection URI in `app.js`.
4. Set up environment variables or modify the code to use hardcoded values for sensitive data (not recommended for production).
5. Run the server using `npm start`.

## Features

### Authentication

- **Register:** Users can register by providing a name, email, and password.
- **Login:** Registered users can log in using their email and password. Upon successful login, a JWT token is generated and stored as a cookie.
- **Logout:** Users can log out, which clears the JWT token from the cookie.

### User Profile

- **Profile Retrieval:** Users can retrieve their profile information if authenticated.

### Place Management

- **Create Place:** Authenticated users can create new listings for places to rent. They can provide various details such as title, address, description, amenities, etc.
- **Update Place:** Owners can update their existing listings.
- **Get User Places:** Users can retrieve all the places they have listed.

### Image Upload

- **Upload by Link:** Users can upload images by providing a direct link to the image.
- **Upload Image:** Users can upload images via multipart form data.

### Bookings

- **Create Booking:** Users can make bookings for places, providing details such as check-in/check-out dates, number of guests, contact information, etc.
- **Get All Bookings:** Users can retrieve all their bookings.

### Miscellaneous

- **Test Endpoint:** An endpoint `/test` is provided for testing purposes.

## API Documentation

- **Base URL:** [https://airbnb-api-sjve.onrender.com/](https://airbnb-api-sjve.onrender.com/)

For detailed API documentation, refer to the API endpoints listed in the source code comments or explore the endpoints directly via the provided base URL.

## Technologies Used

- **Node.js:** Backend JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **MongoDB:** NoSQL database for storing application data.
- **Mongoose:** MongoDB object modeling tool for Node.js.
- **bcryptjs:** Library for hashing passwords.
- **jsonwebtoken:** Library for generating and verifying JSON Web Tokens.
- **multer:** Middleware for handling multipart/form-data for file uploads.
- **cors:** Middleware for enabling Cross-Origin Resource Sharing.
- **dotenv:** Module for loading environment variables from a .env file.
- **cookie-parser:** Middleware for parsing cookies attached to the client request.
