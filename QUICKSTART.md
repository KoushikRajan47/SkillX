# QUICK START GUIDE

## 🚀 Get Backend Running in 3 Steps

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Ensure MongoDB is Running
MongoDB must be running locally or you need to update the connection string in `.env`

**Windows/Mac/Linux:**
```bash
mongod
```

Or use MongoDB Atlas (cloud): Update `MONGO_URI` in `.env` to your Atlas connection string

### Step 3: Start Backend Server
```bash
python app.py
```

✅ Backend is now running at `http://127.0.0.1:5000`

---

## 📡 API Response Format

All endpoints return JSON:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "error": "Error description"
}
```

---

## 🔗 Frontend Integration Examples

### Example 1: Login (Add to your HTML/JS)

```html
<!-- Add to HTML -->
<form id="loginForm">
  <input id="username" placeholder="Username" />
  <input id="password" type="password" placeholder="Password" />
  <button type="submit">Login</button>
</form>

<script src="/path/to/api-integration.js"></script>
<script>
  const api = new SkillXAPI();
  
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await api.login(username, password);
      if (response.success) {
        console.log('Login successful:', response);
        // Store user data
        localStorage.setItem('user', JSON.stringify(response));
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  });
</script>
```

### Example 2: Get All Skills

```javascript
const api = new SkillXAPI();

api.getAllSkills()
  .then(response => {
    console.log('Skills:', response.skills);
    // Populate UI with skills
    response.skills.forEach(skill => {
      console.log(`${skill.name} (${skill.category})`);
    });
  })
  .catch(error => console.error('Failed to fetch skills:', error));
```

### Example 3: Create Project

```javascript
const api = new SkillXAPI();

api.createProject(
  'My Epic Project',           // title
  'Building something amazing', // description
  'In Progress',                // status
  'alice',                       // created_by (username)
  ['Python', 'React']           // required_skills
)
  .then(response => {
    console.log('Project created:', response.project_id);
  })
  .catch(error => console.error('Failed to create project:', error));
```

### Example 4: Request Skill Exchange

```javascript
const api = new SkillXAPI();

api.requestExchange(
  'alice',        // requester username
  'Python',       // skill_offered
  'JavaScript'    // skill_requested
)
  .then(response => {
    console.log('Exchange requested:', response.exchange_id);
  })
  .catch(error => console.error('Failed to request exchange:', error));
```

---

## 📊 Sample Data (Seeded on First Run)

### Users
- **alice** | email: alice@example.com | skills: Python, JavaScript, React
- **bob** | email: bob@example.com | skills: Java, Spring Boot, MongoDB
- **charlie** | email: charlie@example.com | skills: UI/UX Design, Figma, CSS

### Projects
- E-commerce Platform (alice, bob)
- Social Media App (bob, charlie)

Use these for testing API calls!

---

## 🔑 Sample API Calls (cURL / Postman)

### Login
```bash
curl -X POST http://127.0.0.1:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'
```

### Get All Skills
```bash
curl http://127.0.0.1:5000/skills/all
```

### Get All Projects
```bash
curl http://127.0.0.1:5000/projects/all
```

### Create Skill
```bash
curl -X POST http://127.0.0.1:5000/skills/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vue.js",
    "category": "Frontend",
    "difficulty": "Intermediate",
    "description": "Vue JavaScript framework",
    "added_by": "alice"
  }'
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused on 127.0.0.1:5000` | Ensure backend is running with `python app.py` |
| `MongoDB connection error` | Start MongoDB with `mongod` or update `MONGO_URI` in `.env` |
| `CORS error in frontend` | CORS is enabled - ensure frontend uses `http://127.0.0.1:5000` |
| `Port 5000 already in use` | Change port in `app.py` or kill process using port 5000 |
| `Module not found errors` | Run `pip install -r requirements.txt` |

---

## 📁 Backend Structure Reference

```
backend/
├── app.py                    # Main Flask application - RUN THIS
├── config.py                 # Configuration
├── requirements.txt          # Dependencies - pip install -r requirements.txt
├── .env                      # Environment variables
├── api-integration.js        # Frontend helper class
├── database/
│   ├── __init__.py
│   └── db.py                 # MongoDB connection & seeding
├── routes/
│   ├── __init__.py
│   ├── auth.py               # /auth endpoints
│   ├── skills.py             # /skills endpoints
│   ├── projects.py           # /projects endpoints
│   └── exchange.py           # /exchange endpoints
└── README.md                 # Detailed documentation
```

---

## ✨ Next Steps

1. ✅ Start backend: `python app.py`
2. ✅ Copy `api-integration.js` to your frontend folder (optional but recommended)
3. ✅ Add API calls to your HTML/JS files
4. ✅ Test with sample users: alice, bob, charlie
5. ✅ Build out your frontend logic!

Good luck! 🎉
