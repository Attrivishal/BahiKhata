# ShopPulse SaaS Platform

A modern SaaS platform designed for small shop owners (grocery stores, cafes, boutiques) to manage their daily business operations.

## Features

- **Landing Page**: Modern, responsive, high-converting React landing page.
- **Authentication**: JWT-based secure user registration and login.
- **Dashboard**: Real-time insights, interactive charts (Recharts), and KPI metrics.
- **Sales & Expenses Tracking**: Quick REST APIs to log and manage revenue streams and costs.
- **Inventory Management**: Track product stock and get low stock alerts.
- **Modern UI**: Built with Tailwind CSS, Lucide Icons, and React Router.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Recharts, Lucide React
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), JWT Auth, bcryptjs
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally or a running MongoDB URI.

### 1. Database & Backend Setup
1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running on `127.0.0.1:27017` or configure the `.env` file with your own `MONGODB_URI`.
4. Start the Express server:
   ```bash
   npm run dev
   # or node server.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

> **Note**: The frontend runs on `localhost:5173` and maps backend API calls to `localhost:5000/api` natively through the Axios service base URL configuration.

## Folder Structure

```
shop-pulse/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                 # Backend Node/Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── README.md
```
