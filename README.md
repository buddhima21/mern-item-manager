# 🛒 MERN Item Manager

A simple full-stack Item Management system built using the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to add, view, and delete items with real-time data stored in MongoDB Atlas.

---

## 📌 Features

* Add new items with details
* View all items in a structured list
* Delete items
* REST API integration
* MongoDB Atlas cloud database connection
* Responsive frontend using React

---

## 🛠️ Tech Stack

**Frontend**

* React (Vite)
* Axios
* CSS

**Backend**

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

---

## 📁 Project Structure

```
mern-item-manager/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```
git clone https://github.com/YOUR_USERNAME/mern-item-manager.git
cd mern-item-manager
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

Open a new terminal:

```
cd frontend
npm install
npm run dev
```

---

## 🔗 API Endpoints

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| GET    | /api/items     | Get all items |
| POST   | /api/items     | Add new item  |
| DELETE | /api/items/:id | Delete item   |

---

## 🧪 Testing

* Add items using the form
* Check if data is stored in MongoDB Atlas
* Delete items and verify updates

---

## 🌐 Deployment (Optional)

* Backend: Render / Railway
* Frontend: Netlify / Vercel

---

## ⚠️ Environment Variables

Make sure to **never commit your `.env` file**.

Example:

```
MONGO_URI=your_secure_connection_string
PORT=5000
```

---

## 🎯 Learning Outcomes

* Understanding of MERN stack architecture
* CRUD operations with MongoDB
* REST API development using Express
* Connecting frontend and backend
* Basic deployment workflow

---

## 📄 License

This project is created for educational purposes.
