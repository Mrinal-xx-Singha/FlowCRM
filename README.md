# FlowCRM

FlowCRM is a premium, minimalist Customer Relationship Management (CRM) platform built specifically for small businesses. It strips away the confusing corporate bloat to give you a tool that feels lightweight, fast, and incredibly intuitive.

The UI is heavily inspired by modern, high-end SaaS platforms (like Cal.com) featuring a high-contrast monochrome aesthetic, sharp geometric typography, and a massive emphasis on usability.

## Images 


## ✨ Core Features

- **Visual Kanban Pipeline**: Drag and drop your jobs/projects across customizable stages (To Do, In Progress, Completed). Always know exactly where every project stands at a single glance.
- **Customer Hub**: A centralized database to securely track every customer interaction. Features real-time, client-side search for instantaneous filtering.
- **Automated Background Reminders**: Set it and forget it. Background workers actively monitor your database and trigger alerts for pending jobs and due dates.
- **Secure Authentication**: Built-in JWT authentication with encrypted passwords and 30-day "Remember Me" persistent sessions.
- **Fully Responsive**: Beautifully optimized for desktop and mobile, featuring a custom animated sliding drawer for mobile navigation.
- **Premium UI/UX**: Built with Tailwind v4 and Shadcn UI, customized to a stark, monochrome, minimalist aesthetic with subtle drop shadows and pixel-perfect padding.

## 🛠 Tech Stack

FlowCRM utilizes a separated Client/Server architecture for maximum scalability and performance.

**Frontend (Client)**
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI, Lucide Icons
- **Data Fetching**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form with Zod validation
- **Typography**: Inter (configured with negative tracking for a geometric display feel)
- **Drag & Drop**: @hello-pangea/dnd

**Backend (Server)**
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL
- **DB Driver**: `pg` (Node Postgres with connection pooling)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Testing**: Jest & Supertest (connected to isolated `crm_test` database)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### 1. Database Setup
Ensure you have a PostgreSQL server running. Create two databases (one for development, one for testing):
```bash
psql -U postgres
CREATE DATABASE crm;
CREATE DATABASE crm_test;
```

### 2. Backend Setup
Navigate to the server directory, install dependencies, and configure your environment.
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL=postgres://your_user:your_password@localhost:5432/crm
TEST_DATABASE_URL=postgres://your_user:your_password@localhost:5432/crm_test
JWT_SECRET=your_super_secret_jwt_key
```
Run the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the client directory, and install dependencies.
```bash
cd client
npm install
```
Run the Next.js development server:
```bash
npm run dev
```

### 4. Access the Application
The frontend will be running at `http://localhost:3000`. You can create a new account from the Sign Up page.

## 🧪 Testing
The backend is equipped with a full integration test suite utilizing Jest and Supertest. The tests automatically connect to the `crm_test` database, wipe the schema, and run fresh transactions to ensure data isolation.

To run the backend tests:
```bash
cd server
npm run test
```

## 📄 License
This project is licensed under the MIT License.
