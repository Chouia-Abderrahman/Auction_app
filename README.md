# Auction App

This README provides instructions for launching an Auction App with a Django REST backend and a React frontend. The application can be launched using Docker or manually by following the steps below.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Python 3.10**
- **Node.js** (with npm)
- **Docker** (for Docker-based setup)

## Quick Start with Docker

To quickly set up the application using Docker, simply run the following command in the root directory of the project:

```bash
docker-compose up --build
```
This will build the Docker images and start both the frontend (accessible on port 5173) and the backend (accessible on port 8000).

## Manual Setup

If you prefer to set up the application manually, follow the steps below.

### Backend Setup (Django REST API)

- **Create and Activate a Virtual Environment**

Open a terminal and navigate to the django_api folder. Create and activate a virtual environment using Python 3.10:
```bash
python3.10 -m venv venv
source venv/bin/activate
```

- **Install Dependencies**

Install the required Python packages listed in requirements.txt:
```bash
cd django_api
pip install -r requirements.txt
```
- **Run Migrations**

Apply migrations to set up the database schema:
```bash
python manage.py makemigrations backend
python manage.py migrate
```

- **Run Server**
Start the Django development server:
```bash
python manage.py runserver
```
The backend should now be running and accessible on http://localhost:8000.

### Frontend Setup (React)

1. **Navigate to the Frontend Directory**

    Open a new terminal and navigate to the `auction_front` folder:

    ```bash
    cd auction_front
    ```

2. **Install Dependencies**

    Install the necessary npm packages:

    ```bash
    npm install
    ```

3. **Start the Development Server**

    Start the React development server:

    ```bash
    npm run dev
    ```

    The frontend should now be running and accessible on `http://localhost:5173`.


