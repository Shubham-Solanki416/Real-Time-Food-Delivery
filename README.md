# Real Time Food Delivery App

A comprehensive full-stack food delivery application built with React, Node.js, Express, and MongoDB.

## Features

- **Real-time Order Tracking**: Interactive maps with live route updates.
- **Restaurant Management**: Admin panel for restaurants to manage menus and orders.
- **Secure Authentication**: JWT-based auth with password reset functionality.
- **Notification System**: Real-time notifications for order status updates.

## Tech Stack

- **Frontend**: React, Vite, CSS, Leaflet/Mapbox (maps).
- **Backend**: Node.js, Express, MongoDB/Mongoose.
- **Authentication**: JWT, bcryptjs.
- **Others**: Cloudinary (image uploads), Nodemailer (emails).

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository.
2. Install dependencies for both frontend and backend.
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Set up environment variables in `backend/config/config.env` and `frontend/.env`.

### Running the App

1. Start the backend:
   ```bash
   cd backend && npm run dev
   ```
2. Start the frontend:
   ```bash
   cd frontend && npm run dev
   ```
