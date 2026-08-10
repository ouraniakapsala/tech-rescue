# Tech Rescue ♻️

A full-stack application built to facilitate the redistribution of surplus corporate tech hardware to schools, bootcamps, and community centers.

## Tech Stack
* **Frontend:** Angular, Tailwind/Material 
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

## How to Run This Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running on your machine.

### 1. Clone the repository
`git clone https://github.com/YOUR_USERNAME/tech-rescue.git`
`cd tech-rescue`

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
`cd "Tech Rescue BE"`
`npm install`

**Environment Variables:**
Create a `.env` file in the `Tech Rescue BE` folder and add the following:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tech_rescue
JWT_SECRET=your_super_secret_jwt_key

**Start the Server:**
`npm run dev`

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend folder, and install dependencies:
`cd "Tech Rescue FE"`
`npm install`

**Start the Client:**
`npm start` (or `ng serve`)
