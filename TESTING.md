# API Testing Guide

This file contains ready-to-use code snippets for testing all backend endpoints.

## Testing with Postman

### 1. Create Postman Collection
- Open Postman
- Create new Collection: "SkillX Backend"
- Set base URL variable: `{{base_url}}` = `http://127.0.0.1:5000`

### 2. Import Requests
Use the examples below to create requests in Postman

---

## Testing with curl (Terminal/PowerShell)

### Authentication Endpoints

#### Register User
```bash
curl -X POST http://127.0.0.1:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

#### Login
```bash
curl -X POST http://127.0.0.1:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "password123"
  }'
```

#### Get User Profile
```bash
curl http://127.0.0.1:5000/auth/user/alice
```

---

### Skills Endpoints

#### Add Skill
```bash
curl -X POST http://127.0.0.1:5000/skills/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Go Programming",
    "category": "Backend",
    "difficulty": "Advanced",
    "description": "Go programming language",
    "added_by": "alice"
  }'
```

#### Get All Skills
```bash
curl http://127.0.0.1:5000/skills/all
```

#### Get Skills by Category
```bash
curl http://127.0.0.1:5000/skills/category/Frontend
```

#### Get Specific Skill (replace <skill_id>)
```bash
curl http://127.0.0.1:5000/skills/65a1b2c3d4e5f6789abcdef0
```

---

### Projects Endpoints

#### Create Project
```bash
curl -X POST http://127.0.0.1:5000/projects/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "A cool project",
    "status": "In Progress",
    "created_by": "alice",
    "required_skills": ["Python", "React"]
  }'
```

#### Get All Projects
```bash
curl http://127.0.0.1:5000/projects/all
```

#### Get Specific Project (replace <project_id>)
```bash
curl http://127.0.0.1:5000/projects/65a1b2c3d4e5f6789abcdef0
```

#### Join Project (replace <project_id>)
```bash
curl -X POST http://127.0.0.1:5000/projects/join \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "65a1b2c3d4e5f6789abcdef0",
    "username": "bob"
  }'
```

#### Update Project Status (replace <project_id>)
```bash
curl -X PUT http://127.0.0.1:5000/projects/65a1b2c3d4e5f6789abcdef0/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Completed"
  }'
```

---

### Exchange Endpoints

#### Request Exchange
```bash
curl -X POST http://127.0.0.1:5000/exchange/request \
  -H "Content-Type: application/json" \
  -d '{
    "requester": "alice",
    "skill_offered": "Python",
    "skill_requested": "Go"
  }'
```

#### Accept Exchange (replace <exchange_id>)
```bash
curl -X POST http://127.0.0.1:5000/exchange/accept \
  -H "Content-Type: application/json" \
  -d '{
    "exchange_id": "65a1b2c3d4e5f6789abcdef0",
    "acceptor": "bob"
  }'
```

#### Get All Exchanges
```bash
curl http://127.0.0.1:5000/exchange/all
```

#### Get Pending Exchanges
```bash
curl http://127.0.0.1:5000/exchange/pending
```

#### Get User's Exchanges
```bash
curl http://127.0.0.1:5000/exchange/user/alice
```

---

## Testing with Python

```python
import requests

BASE_URL = 'http://127.0.0.1:5000'

# Login
response = requests.post(f'{BASE_URL}/auth/login', json={
    'username': 'alice',
    'password': 'password123'
})
print(response.json())

# Get all skills
response = requests.get(f'{BASE_URL}/skills/all')
print(response.json())

# Create project
response = requests.post(f'{BASE_URL}/projects/create', json={
    'title': 'Test Project',
    'description': 'Testing',
    'status': 'In Progress',
    'created_by': 'alice'
})
print(response.json())

# Get all projects
response = requests.get(f'{BASE_URL}/projects/all')
print(response.json())
```

---

## Testing with JavaScript

```javascript
const BASE_URL = 'http://127.0.0.1:5000';

// Helper function
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (data) options.body = JSON.stringify(data);
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return response.json();
}

// Test login
apiCall('/auth/login', 'POST', {
  username: 'alice',
  password: 'password123'
}).then(data => console.log('Login:', data));

// Test get all skills
apiCall('/skills/all').then(data => console.log('Skills:', data));

// Test create project
apiCall('/projects/create', 'POST', {
  title: 'My Project',
  description: 'Test',
  status: 'In Progress',
  created_by: 'alice'
}).then(data => console.log('Created:', data));
```

---

## Using api-integration.js

```javascript
const api = new SkillXAPI();

// Login
api.login('alice', 'password123')
  .then(user => console.log('User:', user));

// Get skills
api.getAllSkills()
  .then(data => console.log('Skills:', data.skills));

// Create project
api.createProject(
  'My Project',
  'Description',
  'In Progress',
  'alice',
  ['Python', 'React']
).then(data => console.log('Project:', data));
```

---

## Response Examples

### Success Response (200/201)
```json
{
  "success": true,
  "message": "Operation successful",
  "user": {
    "user_id": "65a1b2c3d4e5f6789abcdef0",
    "username": "alice",
    "email": "alice@example.com",
    "full_name": "Alice Johnson",
    "skills": ["Python", "JavaScript"]
  }
}
```

### Error Response (400/404/500)
```json
{
  "error": "User not found"
}
```

---

## Test Data IDs (After Seeding)

Copy these IDs after seeding to test specific endpoints:

```bash
# Get sample skill ID
curl http://127.0.0.1:5000/skills/all | grep "_id" | head -1

# Get sample project ID
curl http://127.0.0.1:5000/projects/all | grep "_id" | head -1
```

Then replace `<skill_id>` or `<project_id>` in curl commands above.

---

## Testing Checklist

- [ ] Register new user
- [ ] Login with sample user (alice)
- [ ] Get all skills
- [ ] Add new skill
- [ ] Filter skills by category
- [ ] Get all projects
- [ ] Create new project
- [ ] Join project
- [ ] Update project status
- [ ] Request skill exchange
- [ ] Accept skill exchange
- [ ] Get all exchanges
- [ ] Get user profile

---

## Tips

- Replace `<id>` values with actual IDs from responses
- Always send `Content-Type: application/json` header
- Check backend console for DEBUG logs
- Use `http://127.0.0.1:5000/health` to verify server is running
- Use `http://127.0.0.1:5000/` to see API info
