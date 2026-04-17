/**
 * Frontend Integration Helper
 * Add this to your frontend JS files to easily connect to the backend API
 * 
 * Usage:
 *   const api = new SkillXAPI();
 *   api.login('username', 'password')
 *     .then(data => console.log(data))
 *     .catch(error => console.error(error));
 */

class SkillXAPI {
  constructor(baseURL = 'http://127.0.0.1:5000') {
    this.baseURL = baseURL;
  }

  // Helper method for API calls
  async request(endpoint, method = 'GET', data = null) {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  // AUTH ENDPOINTS
  
  /**
   * Register a new user
   * @param {string} username - Username
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {string} fullName - Full name
   */
  async register(username, email, password, fullName) {
    return this.request('/auth/register', 'POST', {
      username,
      email,
      password,
      full_name: fullName
    });
  }

  /**
   * Login user
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    return this.request('/auth/login', 'POST', {
      username,
      password
    });
  }

  /**
   * Get user profile
   * @param {string} username - Username
   */
  async getUser(username) {
    return this.request(`/auth/user/${username}`, 'GET');
  }

  // SKILLS ENDPOINTS

  /**
   * Add a new skill
   * @param {string} name - Skill name
   * @param {string} category - Category
   * @param {string} difficulty - Difficulty level
   * @param {string} description - Description
   * @param {string} addedBy - Username of adder
   */
  async addSkill(name, category, difficulty, description, addedBy) {
    return this.request('/skills/add', 'POST', {
      name,
      category,
      difficulty,
      description,
      added_by: addedBy
    });
  }

  /**
   * Get all skills
   */
  async getAllSkills() {
    return this.request('/skills/all', 'GET');
  }

  /**
   * Get skills by category
   * @param {string} category - Category name
   */
  async getSkillsByCategory(category) {
    return this.request(`/skills/category/${category}`, 'GET');
  }

  /**
   * Get specific skill
   * @param {string} skillId - Skill ID
   */
  async getSkill(skillId) {
    return this.request(`/skills/${skillId}`, 'GET');
  }

  // PROJECTS ENDPOINTS

  /**
   * Create a new project
   * @param {string} title - Project title
   * @param {string} description - Description
   * @param {string} status - Project status
   * @param {string} createdBy - Username of creator
   * @param {array} requiredSkills - Required skills array
   */
  async createProject(title, description, status, createdBy, requiredSkills = []) {
    return this.request('/projects/create', 'POST', {
      title,
      description,
      status,
      created_by: createdBy,
      required_skills: requiredSkills
    });
  }

  /**
   * Get all projects
   */
  async getAllProjects() {
    return this.request('/projects/all', 'GET');
  }

  /**
   * Get specific project
   * @param {string} projectId - Project ID
   */
  async getProject(projectId) {
    return this.request(`/projects/${projectId}`, 'GET');
  }

  /**
   * Join a project
   * @param {string} projectId - Project ID
   * @param {string} username - Username
   */
  async joinProject(projectId, username) {
    return this.request('/projects/join', 'POST', {
      project_id: projectId,
      username
    });
  }

  /**
   * Update project status
   * @param {string} projectId - Project ID
   * @param {string} status - New status
   */
  async updateProjectStatus(projectId, status) {
    return this.request(`/projects/${projectId}/status`, 'PUT', {
      status
    });
  }

  // EXCHANGE ENDPOINTS

  /**
   * Request a skill exchange
   * @param {string} requester - Username of requester
   * @param {string} skillOffered - Skill being offered
   * @param {string} skillRequested - Skill being requested
   */
  async requestExchange(requester, skillOffered, skillRequested) {
    return this.request('/exchange/request', 'POST', {
      requester,
      skill_offered: skillOffered,
      skill_requested: skillRequested
    });
  }

  /**
   * Accept a skill exchange
   * @param {string} exchangeId - Exchange ID
   * @param {string} acceptor - Username of acceptor
   */
  async acceptExchange(exchangeId, acceptor) {
    return this.request('/exchange/accept', 'POST', {
      exchange_id: exchangeId,
      acceptor
    });
  }

  /**
   * Get all exchanges
   */
  async getAllExchanges() {
    return this.request('/exchange/all', 'GET');
  }

  /**
   * Get pending exchanges
   */
  async getPendingExchanges() {
    return this.request('/exchange/pending', 'GET');
  }

  /**
   * Get user's exchanges
   * @param {string} username - Username
   */
  async getUserExchanges(username) {
    return this.request(`/exchange/user/${username}`, 'GET');
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillXAPI;
}
