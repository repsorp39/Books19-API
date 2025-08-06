# 📚 Books19 API

Books19 is a RESTful API that allows users to authenticate, read books, track their reading progress, and manage their bookmarked and starred books.

---

## 🚀 Features

- ✅ User authentication (login/register)
- 📖 Access and read books
- 📊 Track reading progress
- 🔖 Bookmark books to check later
- ⭐ Star books for quick access

---

## 🛠️ Tech Stack

- Node.js / Express.js
- MongoDB
- JWT (JSON Web Tokens) for authentication
- Swagger for API documentation

## 🔐 Authentication

Books19 uses **JWT** for authentication. After login or registration, you'll receive a token to include in your headers:

```js
  Authorization: Bearer <your-token>
```


## 📂 Project Structure
``` test
books19-api/
├──/src  
      ├── controllers/
      ├── models/
      ├── routes/
      ├── middleware/
      ├── config/
      ├── utils/
      ├── swagger/
      ├── app.js
└── server.js
```

---

## 📄 API Documentation

Swagger UI is available at: [Swagger](https://books19-api.onrender.com/api-docs)

## 👉 Frontend Overview

[https://books19-frontend.vercel.app/](https://books19-frontend.vercel.app/)

---

## 🧪 Running Locally

```bash
# Clone the repo
git clone https://github.com/repsorp39/books19-api.git

# Navigate into the directory
cd books19-api

# Install dependencies
npm install

# Create a .env file (example below)
cp .env.example .env

# Start the development server
npm run dev
```
