# Chore Masters

A gamified household task management system designed to help parents assign chores to children and incentivize task completion through a reward/prize system.

## Live Demo

[View Live Application](#) <!-- Add your deployment URL here -->

## Features

- **Dual Role System**: Separate authenticated interfaces for parents and children
- **Task Management**: Parents create tasks with point values and images
- **Gamification**: Children earn points by completing tasks toward prizes
- **Prize System**: Parents set reward prizes with point thresholds
- **Progress Tracking**: Visual progress bars showing children's advancement toward goals
- **Image Support**: Attach before/after photos to task completions
- **Celebrations**: Confetti animations when children achieve their prize goals
- **Secure Authentication**: JWT token-based authentication with bcrypt password hashing

## Tech Stack

### Frontend
- **React** 19.0.0 - UI library
- **TypeScript** 5.7.2 - Type-safe JavaScript
- **Vite** 6.2.0 - Build tool and dev server
- **TailwindCSS** 4.1.4 - Utility-first CSS framework
- **React Router** 7.5.3 - Client-side routing
- **TanStack React Query** 5.74.11 - Data fetching and state management
- **React Confetti** 6.4.0 - Celebration animations

### Backend
- **Express** 4.21.2 - Web framework
- **TypeScript** 5.8.2 - Type-safe JavaScript
- **MongoDB/Mongoose** 8.12.1 - NoSQL database & ODM
- **JWT** (jsonwebtoken 9.0.2) - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Testing
- **Vitest** - Unit testing framework
- **Supertest** - HTTP assertion library
- **Testing Library** - React component testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (or MongoDB Compass)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeByNikita/Chore_Masters_Makers_April_2025.git
   cd Chore_Masters_Makers_April_2025
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URL="mongodb://0.0.0.0/chore_masters"
   JWT_SECRET="your-secret-key-here"
   ```

5. **Set up MongoDB**
   - Install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
   - Connect to `mongodb://localhost:27017`
   - The database will be created automatically when you seed it

### Running the Application

1. **Seed the database** (from the backend directory)
   ```bash
   cd backend
   npm run seed
   ```

2. **Start the backend server** (runs on port 8000)
   ```bash
   npm run dev
   ```

3. **Start the frontend** (runs on port 5173) - in a new terminal
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Test Credentials

After seeding the database, you can use these credentials to test the app:

### Parent Account
- **Username**: `Loving Mama`
- **Password**: `Password3`

### Child Accounts
- **Username**: `Cheeky Boy` | **Password**: `Password1`
- **Username**: `Princess Girl` | **Password**: `Password2`

## API Endpoints

### Authentication
- `POST /token` - Login and get JWT token

### Parent Routes
- `GET /parent` - Get parent data (protected)
- `POST /parent/task` - Add new task
- `PUT /parent/task` - Edit task
- `DELETE /parent/task` - Remove task
- `POST /parent/prize` - Add prize
- `DELETE /parent/prize` - Delete prize
- `POST /child` - Add new child

### Child Routes
- `GET /child` - Get child data (protected)
- `PUT /child` - Complete/uncomplete task

## Project Structure

```
chore-masters/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── models/         # Mongoose schemas
│   │   ├── middleware/     # JWT authentication
│   │   ├── db/             # Database connection & seeding
│   │   ├── types/          # TypeScript types
│   │   └── errorHandlers/  # Error handling
│   ├── tests/              # Backend tests
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── services/       # API calls
    │   ├── types/          # TypeScript interfaces
    │   └── utils/          # Utility functions
    ├── tests/              # Frontend tests
    └── package.json
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with tsx
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests
- `npm run coverage` - Run tests with coverage

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run coverage` - Run tests with coverage

## Development

This project uses TypeScript for both frontend and backend to ensure type safety and better developer experience.

### Code Quality
- ESLint for code linting
- TypeScript for type checking
- Vitest for testing

## Contributing

This was a group project developed during the Makers Academy bootcamp (April 2025 cohort).

## License

This project is open source and available under the MIT License.

## Acknowledgments

Built as a final project at Makers Academy to demonstrate full-stack development skills with modern technologies.
