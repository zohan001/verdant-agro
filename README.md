<<<<<<< HEAD
# verdant-agro
=======
# ============================================
# Verdant Agro - Full Stack Application
# ============================================
# Climate Smart Agriculture & Trade Initiative
# Promoting sustainable economic growth through
# climate-smart agricultural practices and
# equitable trade partnerships.
# ============================================

## 🚀 Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (no frameworks)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose ODM) with managed cloud hosting
- **Security:** Helmet, CORS, express-rate-limit, server-side validation
- **Deployment:** Docker Compose (local), Render (production via Blueprint)

## 📁 Project Structure

```
climate-smart-ag/
├── public/                    # Frontend static files
│   └── index.html            # Main single-page application
├── server/                    # Backend code
│   ├── index.js              # Main server entry point
│   ├── app.js                # Express app factory (testable)
│   ├── config/               # Configuration files
│   │   └── index.js
│   ├── controllers/          # Request handlers
│   │   ├── contactController.js
│   │   └── newsletterController.js
│   ├── db/                   # Database layer
│   │   └── database.js       # MongoDB connection (Mongoose)
│   ├── middleware/           # Custom middleware
│   │   └── validation.js
│   ├── models/               # Mongoose data models
│   │   ├── ContactMessage.js
│   │   ├── NewsletterSubscriber.js
│   │   └── AuditLog.js
│   └── routes/               # API route definitions
│       └── api.js
├── scripts/                  # Utility scripts
│   ├── init-db.js           # Verify DB connection & indexes
│   └── test-api.js          # API integration tests
├── data/                     # SQLite database files (generated)
├── index.html                 # Development copy of frontend
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Container build file
├── docker-compose.yml         # Container orchestration
├── nginx.conf                 # Reverse proxy config
└── package.json               # Node.js dependencies & scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- (Optional) Docker & Docker Compose for containerized deployment

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables (adjust as needed)
cp .env.example .env
#    Set MONGO_URI to your MongoDB connection string.
#    Local example: mongodb://127.0.0.1:27017/verdant
#    Atlas example:  mongodb+srv://<user>:<password>@cluster.mongodb.net/verdant

# 3. Verify the database connection
npm run init-db

# 4. Start in development mode (with auto-reload)
npm run dev

# OR start in production mode
npm start
```

The application will be available at `http://localhost:3000`.

### Running Tests

```bash
# Requires a running MongoDB (e.g. docker run -p 27017:27017 mongo)
npm test
```

The test script starts the server on a test port, verifies every API
endpoint (health, contact, newsletter, 404, static files), and exits
cleanly.

## 🔌 API Endpoints

| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| GET    | `/api/health`       | Service health check                 |
| POST   | `/api/contact`      | Submit a contact message             |
| GET    | `/api/contact`      | Get all contact messages (admin)     |
| POST   | `/api/newsletter`   | Subscribe to newsletter              |
| GET    | `/api/newsletter`   | Get all subscribers (admin)          |

### Example: Contact Form Submission

```json
// POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "organization": "Green Farms",
  "subject": "partnership",
  "message": "I'd like to discuss a partnership opportunity."
}
```

## 🐳 Docker Deployment (Local)

```bash
# Start the full stack (web + MongoDB) with Docker Compose
docker-compose up --build -d

# Check logs
docker-compose logs -f

# Stop the services
docker-compose down
```

To build a standalone image:

```bash
docker build -t verdant-agro .
docker run -p 3000:3000 -e MONGO_URI=mongodb://host.docker.internal:27017/verdant verdant-agro
```

## ☁️ Production Deployment on Render

This project includes a `render.yaml` **Blueprint** that provisions both a
managed MongoDB database and the web service automatically.

### Quick Deploy (Blueprint)

1. Create a **public GitHub repository** and push this project (see below).
2. Sign up/log in at [render.com](https://render.com).
3. From the dashboard, click **New** → **Blueprint**.
4. Select your GitHub repository.
5. Review the two resources (`verdant-agro-db` MongoDB and `verdant-agro` web service) and click **Apply**.
6. Render builds and deploys automatically. The `MONGO_URI` is wired to your database via the blueprint, and the health check runs against `/api/health`.

### Pushing to GitHub

```bash
# From the project root
git init
git add .
git commit -m "Initial commit: Verdant Agro full-stack app"
git branch -M main
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/verdant-agro.git
git push -u origin main
```

### Manual Deploy (if you prefer the dashboard)

1. **Database:** In Render, create a **MongoDB** instance.
2. **Web Service:** Create a **Web Service**, connect your repo.
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Health check path:** `/api/health`
   - **Environment variable:** `MONGO_URI` = your MongoDB connection string (from the database service under "External connection string" or internal).

> **Note:** The free Render plan may suspend idle services; a paid plan keeps the database online continuously. MongoDB data is fully persistent on Render, unlike an on-disk database.

## 🔒 Security Features

- **Helmet** - Sets security-related HTTP headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents abuse of API endpoints
- **Input Validation** - Server-side validation of all user input
- **NoSQL Injection Prevention** - Mongoose schema validation & sanitization
- **Error Sanitization** - No internals leaked in production errors
- **Non-root Container User** - Docker container runs as `node` user

## ♿ Accessibility

- Semantic HTML5 tags (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`)
- ARIA labels on interactive elements
- Skip-to-content link
- Proper form labels
- WCAG-compliant color contrast
- Keyboard navigable

## 📄 License

MIT

## 👥 Author

Verdant Agro Team

---

© 2026 Verdant Agro. All rights reserved.
>>>>>>> 0120540 (Initial commit: Verdant Agro full-stack climate-smart agriculture & trade website)
