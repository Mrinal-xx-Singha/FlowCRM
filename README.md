# FlowCRM

FlowCRM is a premium, minimalist Customer Relationship Management (CRM) platform built specifically for small businesses. It strips away the confusing corporate bloat to give you a tool that feels lightweight, fast, and incredibly intuitive.

The UI is heavily inspired by modern, high-end SaaS platforms (like Cal.com) featuring a high-contrast monochrome aesthetic, sharp geometric typography, and a massive emphasis on usability.

## Images 
<img width="1839" height="902" alt="Screenshot (19)" src="https://github.com/user-attachments/assets/d3a6bf57-cf28-4c19-989c-3cfb761ac944" />
<img width="1862" height="897" alt="Screenshot (21)" src="https://github.com/user-attachments/assets/c96970db-ce5e-4e00-93da-9c1f02bdaf3d" />
<img width="1846" height="896" alt="Screenshot (23)" src="https://github.com/user-attachments/assets/ea1b8dbf-326f-4e6c-92b1-1e8cbc670b44" />
<img width="1866" height="892" alt="Screenshot (22)" src="https://github.com/user-attachments/assets/5c4573ec-c4ec-4738-8e89-3efefc6acb09" />
<img width="1860" height="891" alt="Screenshot (24)" src="https://github.com/user-attachments/assets/9df2bb3d-4c9d-4d87-a26d-c09264e05880" />



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

## ⚠️ Challenges & Learnings

**Express `IncomingMessage` Getter Issue During Validation**
While implementing a centralized Zod validation middleware, we encountered a tricky `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`. This occurred when attempting to cleanly overwrite `req.query` with the sanitized data returned by Zod.

* **The Cause:** Express dynamically defines `req.query` (and sometimes `req.params`) as a read-only "getter" property on the request object under the hood to lazily evaluate the query string. Because it lacks a setter, directly assigning to it (`req.query = ...`) throws an error.
* **The Solution:** We bypassed the getter completely by utilizing `Object.defineProperty(req, "query", { value: parsedData.query, writable: true })`. This forcefully overwrites the property at a lower level, injecting the validated and sanitized Zod data into the request pipeline seamlessly without breaking Express's internal architecture.

## 📄 License
This project is licensed under the MIT License.
