# SkyBox - File Storage Application

A Dropbox-like file storage application built with Spring Boot backend and React frontend.

## Features

- File upload and storage
- File metadata management
- RESTful API for file operations
- Modern React frontend with Vite
- PostgreSQL database for metadata storage

## Prerequisites

- Java 21 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd skybox
```

### 2. Start the Database

The application uses PostgreSQL as the database. Start it using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start a PostgreSQL container on port 5432 with the following credentials:
- Database: `skybox`
- Username: `skybox_user`
- Password: `skybox_pass`

### 3. Run the Backend

The backend is a Spring Boot application. Make sure you're in the backend directory:

```bash
cd backend
./gradlew bootRun
```

The backend will start on `http://localhost:8080`.

### 4. Run the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Upload files using the upload button
3. View your uploaded files in the file list
4. Files are stored in the `backend/uploads` directory

## API Endpoints

- `GET /api/files` - Get all files metadata
- `GET /api/files/{id}` - Get specific file metadata
- `POST /api/files/upload` - Upload a new file

## Project Structure

```
skybox/
├── backend/          # Spring Boot application
│   ├── src/main/java/com/skybox/backend/
│   │   ├── controller/    # REST controllers
│   │   ├── entity/        # JPA entities
│   │   ├── repository/    # Data repositories
│   │   ├── service/       # Business logic
│   │   └── exception/     # Exception handlers
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── uploads/       # File storage directory
│   └── docker-compose.yml # Database setup
└── frontend/         # React application
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Application pages
    │   └── services/      # API services
    └── public/            # Static assets
```

## Development

### Backend

- Uses Spring Boot 3.5.9
- Java 21
- PostgreSQL database
- JPA/Hibernate for ORM
- File upload with multipart support (max 20MB per file)

### Frontend

- React 19 with Vite
- Axios for HTTP requests
- React Router for navigation
- ESLint for code linting

## Building for Production

### Backend

```bash
cd backend
./gradlew build
```

### Frontend

```bash
cd frontend
npm run build
```

## Testing

### Backend

```bash
cd backend
./gradlew test
```

### Frontend

```bash
cd frontend
npm run lint
```

## Stopping the Application

1. Stop the frontend: `Ctrl+C` in the frontend terminal
2. Stop the backend: `Ctrl+C` in the backend terminal
3. Stop the database: `docker-compose down` in the backend directory
