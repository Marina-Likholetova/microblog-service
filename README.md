# Microblog Service

This is a learning project that implements a microblogging service using Node.js, Express, Prisma, and MongoDB & deploying the project on Render.com.

## Features

- User authentication and authorization
- CRUD operations for blog posts
- Image and video uploads
- User profile management
- Comments and likes on posts

## Technologies Used

- Node.js
- Express.js
- Prisma ORM
- MongoDB
- Multer (for handling file uploads)
- Express-session + connect-mongo (for authentication)
- Yup (for validation)
- Pug (template engine)
- dotenv (for environment variable management)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/Marina-Likholetova/microblog-service.git
    cd microblog-service
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Set up your environment variables. Create a `.env` file in the root of your project and add the following variables:

    ```sh
    DATABASE_URL="your_mongo_db_connection_string"
    SESSION_SECRET="your_session_secret"
    ```

4. Generate the Prisma client:

    ```sh
    npx prisma generate
    ```

### Running the Application

1. To start the server in development mode:

    ```sh
    npm run server:dev
    ```

2. To start the server in production mode:

    ```sh
    npm run server
    ```