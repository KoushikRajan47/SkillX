// =============================================
//  SkillX — main.js  |  Core Utilities & UI
// =============================================

// ── Page Loader ──
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hiding');
      setTimeout(() => loader.remove(), 500);
    }, 700);
  }

  initMobileMenu();
  initModals();
  highlightActiveNav();
});

// ── Mobile Sidebar ──
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.sidebar-overlay');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}

// ── Active Nav Highlight ──
function highlightActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && current.includes(href)) link.classList.add('active');
  });
}

// ── Modal System ──
function initModals() {
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.dataset.modal;
      openModal(id);
    });
  });
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el) closeAllModals();
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });
}
window.openModal  = id => document.getElementById(id)?.classList.add('open');
window.closeAllModals = () =>
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));

// ── Toast System ──
let toastContainer = null;
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}
window.showToast = (message, type = 'info', duration = 3500) => {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  const container = getToastContainer();
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ── Simulated API ──
const API = {
  delay: (ms = 600) => new Promise(r => setTimeout(r, ms)),
  async fetch(endpoint) {
    await this.delay();
    return { ok: true, data: MOCK_DATA[endpoint] || null };
  }
};

// ── Animate number counter ──
window.animateCounter = (el, target, duration = 1200) => {
  const start = 0;
  const step  = timestamp => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value    = Math.floor(progress * (target - start) + start);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  let startTime = null;
  requestAnimationFrame(step);
};

// ── Intersection Observer for animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// ── Skill chips color rotation ──
const CHIP_COLORS = ['cyan','violet','pink','amber','green'];
window.colorizedChip = (text, idx = 0) => {
  const c = CHIP_COLORS[idx % CHIP_COLORS.length];
  return `<span class="badge badge-${c}">${text}</span>`;
};

// ── Format relative time ──
window.relativeTime = (dateStr) => {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// ── Mock Data Store ──
const MOCK_DATA = {
  user: {
    id: 1, name: 'Alex Rivera', role: 'Full-Stack Developer',
    avatar: 'AR', level: 'Pro', xp: 2480, tokens: 340,
    skills: ['React', 'Node.js', 'Python', 'AWS', 'GraphQL'],
    joinedProjects: 4, completedProjects: 12
  },
  stats: {
    skills: 5, projects: 4, teammates: 18, tokens: 340, rank: 23, skillScore: 87
  },
  activity: [
    { id:1, type:'exchange', text:'Skill exchange with <b>Maya Chen</b> completed', time:'2025-01-15T10:30:00Z', color:'var(--accent-cyan)' },
    { id:2, type:'project',  text:'Joined project <b>DeFi Dashboard</b>', time:'2025-01-15T08:00:00Z', color:'var(--accent-violet)' },
    { id:3, type:'token',    text:'Earned <b>+50 SKX</b> tokens for skill review', time:'2025-01-14T16:00:00Z', color:'var(--accent-amber)' },
    { id:4, type:'review',   text:'Received ⭐⭐⭐⭐⭐ from <b>James K.</b>', time:'2025-01-14T12:00:00Z', color:'var(--accent-green)' },
    { id:5, type:'badge',    text:'Earned <b>Top Contributor</b> badge', time:'2025-01-13T09:00:00Z', color:'var(--accent-pink)' }
  ],
  teammates: [
    { id:1, name:'Maya Chen',    avatar:'MC', role:'UI/UX Designer',       skills:['Figma','React','CSS'],          match:94 },
    { id:2, name:'James Keller', avatar:'JK', role:'ML Engineer',          skills:['Python','TensorFlow','PyTorch'], match:89 },
    { id:3, name:'Sofia Reyes',  avatar:'SR', role:'Blockchain Developer', skills:['Solidity','Web3','Rust'],        match:85 },
    { id:4, name:'Liam Patel',   avatar:'LP', role:'DevOps Engineer',      skills:['Kubernetes','Docker','AWS'],     match:82 }
  ],
  skills: [
    { id:1,  name:'Maya Chen',    avatar:'MC', title:'UI/UX Designer',         skills:['Figma','Framer','CSS','React'],          rating:4.9, exchanges:23, tokens:280, online:true  },
    { id:2,  name:'James Keller', avatar:'JK', title:'ML Engineer',            skills:['Python','TensorFlow','Keras','PyTorch'], rating:4.8, exchanges:17, tokens:420, online:true  },
    { id:3,  name:'Sofia Reyes',  avatar:'SR', title:'Blockchain Developer',   skills:['Solidity','Web3','Rust','Go'],           rating:4.7, exchanges:31, tokens:510, online:false },
    { id:4,  name:'Liam Patel',   avatar:'LP', title:'DevOps Engineer',        skills:['Docker','K8s','Terraform','AWS'],        rating:4.9, exchanges:44, tokens:390, online:true  },
    { id:5,  name:'Priya Nair',   avatar:'PN', title:'Data Scientist',         skills:['Pandas','Sklearn','SQL','Tableau'],      rating:4.6, exchanges:12, tokens:210, online:false },
    { id:6,  name:'Carlos Lima',  avatar:'CL', title:'Mobile Developer',       skills:['Flutter','Swift','Kotlin','Firebase'],   rating:4.8, exchanges:28, tokens:350, online:true  },
    { id:7,  name:'Zoe Walker',   avatar:'ZW', title:'Security Engineer',      skills:['Pentesting','OWASP','CTF','Burp'],       rating:4.7, exchanges:9,  tokens:490, online:false },
    { id:8,  name:'Arjun Singh',  avatar:'AS', title:'Game Developer',         skills:['Unity','C#','Blender','Godot'],          rating:4.5, exchanges:15, tokens:175, online:true  }
  ],
  projects: [
    { id:1, title:'DeFi Dashboard',         desc:'A real-time DeFi portfolio tracker with cross-chain analytics and yield farming insights.',   status:'active',     tags:['Web3','React','GraphQL'],           team:['AR','MC','JK'], progress:68, due:'Feb 28',  members:5  },
    { id:2, title:'AI Resume Builder',      desc:'An AI-powered resume generator that adapts to job descriptions and ATS requirements.',       status:'active',     tags:['Python','GPT','FastAPI'],           team:['SR','LP','PN'], progress:45, due:'Mar 15',  members:4  },
    { id:3, title:'SkillX Mobile App',      desc:'Native mobile companion for SkillX with push notifications and offline support.',            status:'active',     tags:['Flutter','Firebase','Dart'],        team:['CL','AS'],      progress:82, due:'Feb 10',  members:3  },
    { id:4, title:'Cybersecurity CTF Bot',  desc:'Automated CTF challenge solver with ML-based pattern recognition and writeup generator.',    status:'incomplete', tags:['Python','ML','Security'],          team:['ZW','AR'],      progress:22, due:'TBD',     members:2  },
    { id:5, title:'Open Source CMS',        desc:'A headless CMS with GraphQL API, built for developers who need full content control.',       status:'incomplete', tags:['Node.js','GraphQL','MongoDB'],      team:['JK','LP'],      progress:10, due:'TBD',     members:3  },
    { id:6, title:'AR Study Companion',     desc:'Augmented reality study companion that overlays notes and 3D models on physical textbooks.', status:'active',     tags:['Unity','C#','AR Foundation'],       team:['AS','MC','SR'], progress:55, due:'Apr 01',  members:6  }
  ],
  transactions: [
    { id:1, type:'in',  title:'Skill Exchange — Maya Chen',    sub:'React ↔ Figma',            amount:'+30', date:'Today 10:30' },
    { id:2, type:'out', title:'Project Stake — DeFi Dashboard',sub:'Team contribution lock',   amount:'-50', date:'Today 08:00' },
    { id:3, type:'in',  title:'Review Bonus',                  sub:'5-star rating received',   amount:'+20', date:'Yesterday'   },
    { id:4, type:'in',  title:'Completed Milestone',           sub:'SkillX Mobile App #3',     amount:'+80', date:'Jan 14'      },
    { id:5, type:'out', title:'Skill Request — James Keller',  sub:'ML mentorship session',    amount:'-15', date:'Jan 13'      },
    { id:6, type:'in',  title:'Top Contributor Badge',         sub:'January achievement',      amount:'+100','date':'Jan 12'    }
  ]
};

window.MOCK_DATA = MOCK_DATA;
window.API = API;
