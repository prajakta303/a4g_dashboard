Admin Portal
Overview

The Admin Portal allows administrators to view, filter, and analyze all conference registrations. It connects to the backend database and displays the data in a structured dashboard.

Live URL

Admin Portal: <ADD LIVE URL HERE>

Features

Total registrations count

Student registrations count

Professional registrations count

Complete table of all registrations

Filter by: All / Student / Professional

Sort by newest registration date

Tech Stack

Frontend: React / Vite / Tailwind

Backend: Node.js + Express

Database: PostgreSQL

(Replace with what you actually used.)

Pages
Dashboard

Displays total counts

Real-time data from API

Registrations Table

Columns: Name, Email, Type, Company, Phone, Registration Date

Filter and sorting options included

API Endpoints Used
Method	Endpoint	Purpose
GET	/api/stats	Fetch counts for dashboard
GET	/api/registrations	Fetch all registrations

(Adjust if your routes differ.)

Local Setup
cd admin-portal
npm install
npm run dev

Environment Variables
VITE_API_URL=

Folder Structure
admin-portal/
 ├── src/
 │    ├── components/
 │    ├── pages/
 │    ├── api/
 │    └── App.jsx
 └── package.json
