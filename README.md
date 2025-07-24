# CollabSphere Backend

This is the backend service for CollabSphere, a collaborative platform. The service is built with Node.js, Express, and TypeScript, following a Clean Architecture pattern.

## Features

-   **User Registration:** New users can register, which also creates a new organization.
-   **Clean Architecture:** The codebase is structured into `core` (domain logic), `infrastructure` (frameworks, databases), and `application` layers.
-   **TypeScript:** Fully typed codebase for better maintainability and developer experience.
-   **MongoDB:** Uses Mongoose for object data modeling with MongoDB.

## Project Structure

```
/
├── dist/                          # Compiled JavaScript output
├── src/
│   ├── core/                      # Core business logic (domain, use-cases, ports)
│   │   ├── domain/                # - Domain entities (User, Organization)
│   │   ├── use-cases/             # - Application-specific business rules
│   │   └── ports/                 # - Interfaces for repositories (driven ports)
│   ├── infrastructure/
│   │   ├── adapters/              # Adapters for driving (HTTP) and driven (database) ports
│   │   │   ├── driving/           # - Input adapters (e.g., Express controllers, routes)
│   │   │   └── driven/            # - Output adapters (e.g., Mongoose repository implementation)
│   │   ├── config/                # - Database connection logic
│   │   └── webserver/             # - Express server setup
│   └── index.ts                   # Application entry point
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16.20.1 or higher)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/) (A running instance, local or cloud-based like MongoDB Atlas)

## Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/Dy-Rongrath/ExpressWithRongRath.git](https://github.com/Dy-Rongrath/ExpressWithRongRath.git)
cd ExpressWithRongRath
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following variables.

```env
# The port the server will run on
PORT=3000

# Your MongoDB connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

Replace the `MONGO_URI` with your actual MongoDB connection string.

### 4. Running the Application

-   **Development Mode:**
    This command uses `nodemon` and `ts-node` to automatically restart the server on file changes.

    ```bash
    npm run dev
    ```

-   **Production Mode:**
    This first builds the TypeScript code into JavaScript in the `dist/` directory and then starts the server.

    ```bash
    # Step 1: Build the project
    npm run build

    # Step 2: Start the server
    npm start
    ```

The server will start, and you should see the following message in your console:
`🚀 Server is running on port 3000`

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health Check

-   **GET** `/health`
    -   Checks the operational status of the service.
    -   **Success Response (200 OK):**
        ```json
        {
          "status": "UP"
        }
        ```

### User Registration

-   **POST** `/users/register`
    -   Registers a new user and creates an associated organization.
    -   **Request Body:**
        ```json
        {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "password": "a-strong-password",
          "organizationName": "Doe Inc."
        }
        ```
    -   **Success Response (201 Created):**
        ```json
        {
            "id": "60d0fe4f5311236168a109ca",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "organizationId": "60d0fe4f5311236168a109cb",
            "roles": ["Org Admin"],
            "createdAt": "2023-10-27T10:00:00.000Z"
        }
        ```
    -   **Error Response (400 Bad Request):**
        If a user with the same email already exists.
        ```json
        {
          "message": "User with this email already exists."
        }
        ```
