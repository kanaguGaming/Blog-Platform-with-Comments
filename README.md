# BlogSpace - Full-Stack Blog Platform

A complete, functional, beginner-friendly blog platform with user authentication, roles, posts, and comments.

## 1. Project Overview
This project is a fully functional blog platform built from scratch. Users can register, log in, create blog posts, read others' posts, and leave comments. It features Role-Based Access Control (RBAC), where the first registered user becomes an ADMIN with elevated privileges.

## 2. Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API). No external UI frameworks.
- **Backend**: Python, FastAPI.
- **Database**: SQLite (managed with SQLAlchemy ORM).
- **Authentication**: JSON Web Tokens (JWT) & bcrypt for password hashing.

## 3. Folder Structure
```
blog-platform/
├── backend/
│   ├── main.py           # FastAPI application entry point & endpoints
│   ├── database.py       # SQLite connection setup
│   ├── models.py         # SQLAlchemy database models
│   ├── schemas.py        # Pydantic models for data validation
│   ├── auth.py           # JWT generation and password hashing
│   ├── dependencies.py   # FastAPI dependency injections (e.g. get_current_user)
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── index.html        # Home page showing all posts
│   ├── login.html        # User login
│   ├── register.html     # User registration
│   ├── create-post.html  # Create a new blog post
│   ├── post.html         # View a single post & comments
│   ├── edit-post.html    # Edit an existing post
│   ├── profile.html      # User profile showing their posts
│   ├── admin.html        # Admin dashboard
│   ├── css/
│   │   └── style.css     # Global styles
│   └── js/
│       ├── api.js        # Helper for Fetch API requests
│       ├── auth.js       # Authentication logic (login/register/logout)
│       ├── posts.js      # Fetching & displaying post lists
│       ├── post.js       # Handling single post view, create, edit, delete
│       ├── comments.js   # Comment system logic
│       ├── profile.js    # Fetching user profile data
│       └── admin.js      # Admin dashboard logic
└── README.md
```

## 4. How Frontend Works
The frontend is built using standard HTML, CSS, and Vanilla JavaScript. It communicates with the backend exclusively via the Fetch API. 
The UI is dynamic; JavaScript modifies the DOM based on API responses (e.g., showing user's name in navbar if logged in, hiding Edit/Delete buttons if not authorized).

## 5. How Backend Works
The backend is powered by **FastAPI**. It provides RESTful APIs for the frontend. It handles user authentication, data validation (via Pydantic), and database operations (via SQLAlchemy).

## 6. How REST APIs Work
The frontend makes HTTP requests (GET, POST, PUT, DELETE) to the FastAPI server. 
For example:
- `GET /api/posts` retrieves all posts.
- `POST /api/posts` creates a new post (requires auth token).

## 7. How Authentication Works
Users register with an email and password. The password is hashed using bcrypt before being saved to the database. When logging in, the server verifies the password and issues a **JWT Token**.

## 8. How JWT Works
JSON Web Tokens (JWT) are used for stateless authentication. The frontend stores the token in `localStorage` and sends it in the `Authorization: Bearer <token>` header with every protected API request. The backend decodes the token to identify the user.

## 9. Database Structure
We use **SQLite** with three main tables:
- `users`: id, name, email, password_hash, role
- `posts`: id, user_id, title, content, category
- `comments`: id, post_id, user_id, content

Relationships:
- A User has many Posts and Comments.
- A Post has many Comments.

## 10. How Posts are Created
1. User fills the form in `create-post.html`.
2. JS sends a `POST` request to `/api/posts` with the token.
3. Backend validates the token, gets the `user_id`, and saves the post in the DB.

## 11. How Comments Work
Similar to posts, authenticated users can submit a comment. The API `/api/posts/{id}/comments` handles both retrieving and adding comments for a specific post.

## 12. How Authorization Works
The backend has dependencies `get_current_active_user` and `get_current_admin_user`. Endpoints are protected by these. Normal users can only edit/delete their *own* posts/comments. Admins can delete *any* post or comment.

## 13. How to Install Dependencies
Open a terminal in the `backend` folder and run:
```bash
python -m venv venv
# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

## 14. How to Start FastAPI
In the `backend` folder with the virtual environment activated, run:
```bash
uvicorn main:app --reload
```
The API will run at `http://127.0.0.1:8000`. You can see auto-generated API docs at `http://127.0.0.1:8000/docs`.

## 15. How to Run the Frontend
You can open `index.html` directly in your browser, or better, serve it using Python's built-in server. Open a new terminal in the `frontend` folder and run:
```bash
python -m http.server 5500
```
Then visit `http://127.0.0.1:5500` in your browser.

## 16. API Endpoint List
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/auth/me` - Get current user profile
- `GET /api/posts` - Get all posts (supports ?search & ?category)
- `POST /api/posts` - Create a post
- `GET /api/posts/{id}` - Get single post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `GET /api/posts/{id}/comments` - Get comments for a post
- `POST /api/posts/{id}/comments` - Add a comment
- `PUT /api/comments/{id}` - Edit comment
- `DELETE /api/comments/{id}` - Delete comment
- `GET /api/users/{id}/posts` - Get user's posts
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
