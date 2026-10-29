<div align="center">
  <h1 align="center">⚡ FlowCRM</h1>
  <p align="center">
    <strong>A modern, full-stack B2B Customer Relationship Management platform engineered for simplicity, speed, and real-world scale.</strong>
  </p>

  <p align="center">
    <a href="https://github.com/Mrinal-xx-Singha/FlowCRM/actions"><img src="https://img.shields.io/badge/CI%2FCD-Passing-10b981?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI/CD Status"></a>
    <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16">
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Google_Gemini-8E75C4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini AI">
    <img src="https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge" alt="License MIT">
  </p>

  <p align="center">
    <a href="https://flow-crm-eight.vercel.app"><strong>🌐 Explore Live Production App »</strong></a>
  </p>
</div>

> [!NOTE]
> ⭐ **Enjoying FlowCRM? Please consider starring the repository on GitHub!** It supports open-source development and helps increase visibility. 🚀

---

## 🎨 Overview

**FlowCRM** is a production-ready sales and pipeline management platform engineered with modern SaaS architecture principles. Built with a Cal.com and Linear-inspired monochrome design system, it pairs frictionless drag-and-drop interactivity with deep backend reliability: concurrency-safe background cron processing, automated AI email drafting, strict schema boundaries, edge network routing, and continuous integration testing.

### 🖼️ Preview & UI Highlights

<p align="center">
  <img width="1839" height="902" alt="Dashboard View" src="https://github.com/user-attachments/assets/d3a6bf57-cf28-4c19-989c-3cfb761ac944" />
  <img width="1862" height="897" alt="Kanban Board View" src="https://github.com/user-attachments/assets/c96970db-ce5e-4e00-93da-9c1f02bdaf3d" />
  <img width="1846" height="896" alt="Customer Management Hub" src="https://github.com/user-attachments/assets/ea1b8dbf-326f-4e6c-92b1-1e8cbc670b44" />
  <img width="1866" height="892" alt="Reminders Tracker" src="https://github.com/user-attachments/assets/5c4573ec-c4ec-4738-8e89-3efefc6acb09" />
  <img width="1860" height="891" alt="Dark Mode & Profile settings" src="https://github.com/user-attachments/assets/9df2bb3d-4c9d-4d87-a26d-c09264e05880" />
</p>

---

## 🚀 Key Features

### 1. 🤖 AI-Powered Follow-up Email Drafter
- Integrated with **Google Gemini 2.5 Flash** (`gemini-2.5-flash`) via structured JSON schema generation.
- Analyzes individual customer notes, deal status, and deal values (₹ INR) to draft tailored, human-sounding sales follow-ups in seconds.
- Multi-tone customization (*Professional*, *Friendly*, *Urgent*) with one-click clipboard copying and direct mail client integration.

### 2. 🔐 Dual-Layer Authentication & Google OAuth 2.0
- **Email & Password**: Salted password hashing (Bcrypt, 10 rounds) with customizable JWT expirations (1-day standard, 30-day "Remember Me").
- **Google OAuth 2.0**: Backend token validation via `google-auth-library` (`verifyIdToken`) with automatic account provisioning, persistent `avatar_url` synchronization, and dynamic navbar profile image rendering.
- **Edge Route Protection**: Migrated to Next.js 16's modern **`proxy.ts`** network boundary convention to inspect session cookies and eliminate unauthenticated UI flashes.

### 3. 📊 Visual Kanban Pipeline & Revenue Tracking
- Drag-and-drop deal board powered by `@hello-pangea/dnd` across 3 active stages: *To Do*, *In Progress*, and *Completed*.
- **Optimistic UI Updates**: State changes reflect immediately in the interface and revert automatically if backend synchronization encounters an error.
- **Deal Value Tracking (₹ INR)**: Track flat Indian Rupee deal sizes per job, dynamically aggregated into pipeline revenue charts.
- 300ms debounced live search querying titles and customer relationships simultaneously.

### 4. ⏰ Concurrency-Safe Automated Reminders & Cron
- Scheduled client follow-up alerts with future date enforcement (`remind_at > NOW()`).
- **Race-Condition Prevention**: Database transactions utilize PostgreSQL's **`FOR UPDATE SKIP LOCKED`** to prevent concurrent worker instances from sending duplicate emails.
- **HTML Email Dispatch via Resend**: High-contrast, responsive HTML templates sent via Resend's REST API over port 443 (avoiding cloud SMTP port blocking).
- **Automated Keep-Alive Cron**: GitHub Actions workflow pings the secure cron endpoint every 10 minutes to process due reminders and prevent cloud instances from sleeping.

### 5. 📈 Analytics Dashboard & Spotlight Search
- **Visual Analytics**: Interactive Recharts widgets displaying a 6-month completed job productivity area chart (`DATE_TRUNC`), stage distribution bar charts, and total pipeline deal revenue in INR.
- **Global Command Menu (`⌘K` / `Ctrl+K`)**: Powered by `cmdk`. Instantly search across cached customers and deals, trigger theme toggles, and jump across dashboard routes without taking hands off the keyboard.
- **One-Click CSV Export**: Client-side RFC-compliant CSV exporter for your entire customer directory.

---

## 🛠 Tech Stack & Architecture

FlowCRM is designed as a decoupled, type-safe monorepo separating presentation from backend persistence.

### 🌐 Frontend (Client)
- **Framework**: Next.js 16.2 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4 & Next-Themes (Dark/Light mode with zero SSR flicker)
- **Components & Icons**: Radix UI primitives, Shadcn UI, Lucide Icons, Sonner (Toasts)
- **Visualizations**: Recharts (Responsive bar & area data series)
- **State & Data Fetching**: TanStack React Query v5 (cache invalidation & optimistic updates)
- **Forms & Validation**: React Hook Form + Zod v4
- **Drag & Drop**: `@hello-pangea/dnd`
- **Command Palette**: `cmdk`
- **OAuth**: `@react-oauth/google`

### ⚙️ Backend (Server)
- **Runtime & Framework**: Node.js & Express.js (TypeScript)
- **Database**: PostgreSQL (Raw SQL queries with connection pooling via `pg`)
- **LLM Engine**: Google Gemini 2.5 Flash API (Structured JSON output mode)
- **Email Delivery**: Resend REST API
- **Task Scheduling**: `node-cron` (local development) & GitHub Actions worker (production)
- **Security & Middlewares**: Dual rate limiters (`express-rate-limit`), CORS policies, Zod schema validation
- **Testing**: Jest & Supertest against an isolated PostgreSQL container (`--runInBand`)
- **Auto-Migrations**: Non-destructive `IF NOT EXISTS` database schema migrations on server boot

---

## 🌍 Production Architecture

```mermaid
flowchart LR
    User["Client Browser / Mobile"] --> CDN["Vercel Edge Network (Next.js 16)"]
    CDN --> Proxy["Edge Proxy Layer (proxy.ts)"]
    Proxy --> Frontend["Next.js App Router (React 19)"]
    Frontend -- "REST API (JWT Auth)" --> API["Express.js Server (Render)"]
    API -- "Pool Queries (SSL)" --> DB[("PostgreSQL Database (Neon)")]
    API -- "AI Prompts (JSON)" --> Gemini["Google Gemini 2.5 Flash"]
    API -- "HTTPS Port 443" --> Resend["Resend Email API"]
    GHA["GitHub Actions Cron"] -- "Bearer CRON_SECRET" --> API
```

---

## 🧪 Testing & CI/CD Pipeline

FlowCRM maintains automated integration testing and continuous deployment checks on every commit:

### 1. Isolated Integration Test Suite
Our backend uses Supertest and Jest to interact with a dedicated test database (`crm_test`), executing clean schema builds before each suite to guarantee idempotent results:
```bash
cd server
npm test
```
*Tests run sequentially with `--runInBand` to prevent database race conditions across test runners.*

### 2. GitHub Actions CI Pipeline (`ci.yml`)
Every push or pull-request triggers a workflow that:
1. Spins up a real **PostgreSQL 15 Alpine** service container with Docker health checks.
2. Runs the complete backend Jest + Supertest integration test suite against the container.
3. Performs strict `tsc` compiler checks across the backend codebase.
4. Validates package-lock integrity (`npm ci`) and builds the Next.js production bundle.

---

## ⚡ Getting Started Locally

Get a local copy running in under 5 minutes:

### Prerequisites
- **Node.js** (v20 or higher recommended)
- **PostgreSQL** running on port `5432`

### 1. Database Setup
Create your local development and test databases:
```bash
psql -U postgres
CREATE DATABASE crm;
CREATE DATABASE crm_test;
```

### 2. Backend Server Setup
```bash
cd server
npm install
```

Create a `.env` file inside `./server`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_test
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
RESEND_API_KEY=your_resend_api_key
CRON_SECRET=your_custom_cron_secret
```

Start the backend:
```bash
npm run dev
```
*(The server listens on `http://localhost:5000` and automatically runs schema migrations).*

### 3. Frontend Next.js Setup
Open a second terminal window:
```bash
cd client
npm install
```

Create a `.env` file inside `./client`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

Start the client:
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser! 🎉

---

## 🧠 Key Engineering Learnings

### 1. Concurrency Control with `FOR UPDATE SKIP LOCKED`
When multiple server workers or scheduled crons execute simultaneously, naive `SELECT ... WHERE remind_at <= NOW()` queries create race conditions, leading to duplicate customer emails.
* **Solution**: Handled reminder queries inside an explicit PostgreSQL transaction using `FOR UPDATE SKIP LOCKED`. This locks only the rows being processed by that worker and allows any concurrent threads to skip them without blocking.

### 2. Migrating to Next.js 16's Edge Network Proxy (`proxy.ts`)
In Next.js 16, the legacy `middleware.ts` convention was renamed to `proxy.ts` to establish a clearer distinction between Express-style request middleware and edge network routing proxies.
* **Solution**: Structured `client/proxy.ts` with `export function proxy(request: NextRequest)` and strict route matchers, verifying the `token` cookie before rendering private routes to eliminate client-side authentication flicker.

### 3. Google Avatar Cross-Origin Policy Resolution
Google's user profile photo CDN (`lh3.googleusercontent.com`) automatically rejects image requests with `403 Forbidden` if third-party referrer headers are transmitted.
* **Solution**: Injected `referrerPolicy="no-referrer"` on user avatar components across the application, guaranteeing Google profile photos load seamlessly without cross-origin rejection.

---

## 🤝 Contributing & Feedback

Contributions, feature requests, and suggestions are welcome! Feel free to fork the repository, open an issue, or submit a pull request.

## 📄 License
This project is open-source and released under the **[MIT License](LICENSE)**.

---
<p align="center">
  Built with ❤️ and Modern TypeScript. If you find this project valuable, please consider giving it a ⭐ star!
</p>
