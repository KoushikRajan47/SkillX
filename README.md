# Backend Setup Instructions

## Prerequisites
- Python 3.8+
- MongoDB (local or remote)
- pip (Python package manager)

## Installation Steps

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up MongoDB
Make sure MongoDB is running on your system:
- **Local MongoDB**: `mongodb://localhost:27017/skillx_db`
- **Remote MongoDB**: Update MONGO_URI in `.env` file

### 3. Start the Backend Server
```bash
python app.py
```

Expected output:
```
==================================================
🚀 SkillX Backend Server Starting...
==================================================
📍 Running on: http://127.0.0.1:5000
🔗 Frontend should connect to http://127.0.0.1:5000
==================================================
```

## Available Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/user/<username>` - Get user profile

### Skills (`/skills`)
- `POST /skills/add` - Add new skill
- `GET /skills/all` - Get all skills
- `GET /skills/category/<category>` - Filter skills by category
- `GET /skills/<skill_id>` - Get specific skill

### Projects (`/projects`)
- `POST /projects/create` - Create new project
- `GET /projects/all` - Get all projects
- `GET /projects/<project_id>` - Get specific project
- `POST /projects/join` - Join existing project
- `PUT /projects/<project_id>/status` - Update project status

### Exchange (`/exchange`)
- `POST /exchange/request` - Request skill exchange
- `POST /exchange/accept` - Accept skill exchange
- `GET /exchange/all` - Get all exchanges
- `GET /exchange/pending` - Get pending exchanges
- `GET /exchange/user/<username>` - Get user's exchanges

## Frontend Integration

### Example: Login API Call from Frontend
```javascript
fetch('http://127.0.0.1:5000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'alice',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Sample Data

On first run, the backend automatically seeds sample data:
- **Users**: alice, bob, charlie
- **Skills**: Python, React, MongoDB
- **Projects**: E-commerce Platform, Social Media App
- **Exchanges**: Sample skill exchange requests

## File Structure

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── database/
│   └── db.py          # Database connection & seeding
└── routes/
    ├── auth.py        # Authentication endpoints
    ├── skills.py      # Skills endpoints
    ├── projects.py    # Projects endpoints
    └── exchange.py    # Exchange endpoints
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in `.env` file matches your MongoDB server
- Windows: `mongodb://localhost:27017/skillx_db` (default)

### Port Already in Use
- Change PORT in `app.py` if 5000 is occupied
- Or stop the process using port 5000

### CORS Issues
CORS is already enabled for frontend access. If you get CORS errors:
- Make sure frontend is configured to use `http://127.0.0.1:5000`
- Not `localhost` or `127.0.0.1:3000` from different origin

## Notes
- Frontend and Backend run separately
- Frontend: HTML/CSS/JS (existing files)
- Backend: Flask API server on port 5000
- Ensure both are running for full functionality
