# FormFlow - Form Builder Application

This project is a web application for creating and managing online forms, similar to Google Forms. It allows users to register, log in, design forms with various question types, share forms for responses, and view collected data.

## Technologies Used

*   **Frontend:** React.js
*   **Backend:** Node.js with Express.js
*   **Database:** MySQL
*   **Containerization:** Docker & Docker Compose
*   **Authentication:** JWT (JSON Web Tokens)
*   **ORM:** Sequelize (for Node.js/MySQL interaction)
*   **Styling:** CSS Modules / Styled Components (adjust based on your choice)

## Prerequisites

*   Docker Desktop installed on your machine.
*   Git (optional, for version control)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine using Docker Compose.

### 1. Clone or Download the Project

Obtain the project source code and place it in a folder on your computer (e.g., `form-builder-app`).

### 2. Environment Configuration

*   Navigate to the `backend` directory.
*   Create a file named `.env`.
*   Add the following environment variables, adjusting values as needed:

    ```env
    # Database Configuration
    DB_HOST=mysql_db
    DB_PORT=3306
    DB_USER=your_mysql_user
    DB_PASS=your_mysql_password
    DB_NAME=form_builder

    # Backend Server Port (inside container)
    BACKEND_PORT=5000

    # JWT Secret Key (change this to a strong, random secret)
    JWT_SECRET=your_very_strong_secret_key_here
    ```

### 3. Running the Application with Docker Compose

1.  Open a terminal or command prompt.
2.  Navigate to the root directory of the project (where your `docker-compose.yml` file is located).
3.  Run the following command to build and start all services:

    ```bash
    docker-compose up --build
    ```

    This command will:
    *   Build the custom Docker images for the frontend and backend.
    *   Pull the official MySQL 8.0 image.
    *   Create and start containers for the database, backend API, and frontend web server.
    *   Set up the necessary network connections between containers.

4.  **Initial Setup:** The first time you run this, the database will be initialized. The backend application will wait for the database to be ready and then synchronize the database schema based on your Sequelize models.

### 4. Accessing the Application

Once the containers are running and the logs indicate the servers are started:

*   **Frontend:** Open your web browser and go to `http://localhost:3000`. You should see the landing page.
*   **Backend API:** The backend API will be accessible at `http://localhost:5000`.

## Features

*   **User Authentication:** Register new accounts and log in securely.
*   **Form Creation:**
    *   Create new forms with titles and descriptions.
    *   Configure whether unregistered users can respond.
    *   Add various question types:
        *   Short Text (up to 512 characters)
        *   Long Text (up to 4096 characters)
        *   Multiple Choice (Single Answer)
        *   Multiple Choice (Multiple Answers)
        *   Single Numeric Answer (with optional range/step)
        *   Date
        *   Time
    *   Mark questions as required or optional.
    *   Clone, edit, or delete questions.
    *   Re-order questions.
*   **Form Management:**
    *   View a list of forms created by the logged-in user.
    *   See the number of responses for each form.
    *   Edit existing forms.
    *   Share a unique link to allow others to fill out the form.
*   **User Profile:**
    *   View account details.
    *   Change password.
    *   Delete account.
    *   Toggle dark/light theme.
*   **Response Collection:** Allow users (registered or anonymous, based on form settings) to submit responses to forms.
*   **Response Viewing:** (Planned/Implemented) View individual responses and aggregated data for forms created by the user.

## Project Structure
<img width="470" height="227" alt="pisibp" src="https://github.com/user-attachments/assets/ca076365-1dd2-4ada-a63a-305bc6a88868" />

---

Feel free to adjust the technology list (like CSS Modules), project structure comments, or feature list based on the exact specifics of your implementation.
