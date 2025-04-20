# SkillKart - Personalized Learning Roadmap Platform

SkillKart is a web application designed to help users learn new skills by providing personalized learning roadmaps based on their interests, goals, and available time. It includes features for tracking progress, earning rewards, engaging in discussions, and managing roadmap content.

## Features

### User Features

-   **Authentication:** Secure user registration and login using JWT.
-   **Personalized Roadmap Generation:** Users can input their interests (e.g., "UI/UX Design"), goals (e.g., "Get a Job", "Learn for Fun"), and available weekly time to receive a tailored learning roadmap.
-   **Roadmap Following:** Users can follow generated or selected roadmaps.
-   **Interactive Roadmap View:** Visual representation of the roadmap modules (weeks) and topics.
-   **Topic Completion:** Mark topics as complete to track progress.
-   **Progress Tracking:**
    -   View overall roadmap completion percentage.
    -   Track progress per module/week.
    -   XP (Experience Points) awarded for completing topics.
    -   Leveling system based on XP.
-   **Gamification:**
    -   **Badges:** Earn badges for achieving milestones (e.g., "Trailblazer", "Knowledge Ninja").
    -   **Daily Streaks:** Maintain a streak for consecutive days of activity.
-   **User Dashboard:**
    -   Overview of current roadmap, progress, level, XP, and badges.
    -   **Activity Heatmap:** Visualizes learning activity over the past 90 days.
    -   Streak counter.
-   **Discussion Forum:**
    -   Create discussion threads related to roadmaps or topics.
    -   Reply to existing threads.
    -   View threads and replies.
-   **User Preferences:** Modal to set/update learning interests, goals, and time availability.

### Admin Features

-   **Admin Login:** Separate login for administrators.
-   **Roadmap Resource Management:**
    -   View all existing roadmap templates.
    -   Expand roadmaps to see modules and topics.
    -   Edit resources (Title, URL, Type - video, blog, quiz) associated with each topic within a roadmap template.
#### Admin credentials:
```
Email: admin@skillkart.com
Password: Qwerty
```

## Tech Stack

**Client (Frontend):**

-   **Framework/Library:** React.js
-   **Build Tool:** Vite
-   **UI Library:** Mantine UI
-   **Styling:** Tailwind CSS (integrated via PostCSS), Mantine's styling system
-   **Routing:** React Router DOM
-   **HTTP Client:** Axios
-   **Icons:** Tabler Icons

**Server (Backend):**

-   **Framework:** Node.js / Express.js
-   **Database:** MongoDB
-   **ODM:** Mongoose
-   **Authentication:** JSON Web Tokens (JWT)
-   **Password Hashing:** bcryptjs
-   **Middleware:** CORS

## Project Structure

```
/
├── client/         # React Frontend Application (Vite + Mantine)
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page-level components (Dashboard, Login, etc.)
│   │   └── routes/     # Application routing setup
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── vercel.json
│   └── vite.config.js
│
├── server/         # Node.js Backend Application (Express + MongoDB)
│   ├── config/       # Database connection, default settings
│   ├── controllers/  # Request handling logic
│   ├── middlewares/  # Custom middleware (auth, roles)
│   ├── models/       # Mongoose schemas and models
│   ├── routes/       # API endpoint definitions
│   ├── index.js      # Server entry point
│   └── package.json
│
└── README.md       # This file
```

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd misogiAi
    ```

2.  **Setup Backend:**

    -   Navigate to the server directory: `cd server`
    -   Install dependencies: `npm install`
    -   Create a `.env` file in the `server` directory based on `.env.example` (if provided) or add the following variables:
        ```env
        PORT=5000 # Or any port you prefer
        MONGO_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_jwt_secret_key>
        ```
    -   Run the backend server: `npm start` (or `npm run dev` if a dev script exists)

3.  **Setup Frontend:**

    -   Navigate to the client directory: `cd ../client`
    -   Install dependencies: `npm install`
    -   (Optional) Create a `.env` file in the `client` directory if needed, e.g., to specify the API URL:
        ```env
        VITE_API_URL=http://localhost:5000 # Match the backend port
        ```
        _Note: Ensure `src/app/config.js` uses this environment variable if applicable, otherwise update the API base URL there directly._
    -   Run the frontend development server: `npm run dev`

4.  **Access the application:** Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).
