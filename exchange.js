// =============================================
//  SkillX — exchange.js  |  Token Dashboard
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  initCounters();
});

// ── Render dashboard components ──
function renderDashboard() {
  renderWelcomeBanner();
  renderStats();
  renderActivity();
  renderTeammates();
}

// ── Welcome Banner ──
function renderWelcomeBanner() {
  const user = JSON.parse(sessionStorage.getItem('skillx_user') || 'null') || MOCK_DATA.user;
  const nameEl = document.getElementById('welcome-name');
  const xpEl   = document.getElementById('user-xp');
  const tokEl  = document.getElementById('user-tokens');

  if (nameEl)  nameEl.textContent = user.name?.split(' ')[0] || 'Alex';
  if (xpEl)    xpEl.textContent   = (user.xp || MOCK_DATA.user.xp).toLocaleString() + ' XP';
  if (tokEl)   tokEl.textContent  = (user.tokens || MOCK_DATA.user.tokens) + ' SKX';
}

// ── Stats Grid ──
function renderStats() {
  const s = MOCK_DATA.stats;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-skills',   s.skills);
  set('stat-projects', s.projects);
  set('stat-teammates', s.teammates);
  set('stat-tokens',   s.tokens);
  set('stat-rank',     '#' + s.rank);
  set('stat-score',    s.skillScore + '%');
}

// ── Activity Feed ──
function renderActivity() {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;

  feed.innerHTML = MOCK_DATA.activity.map(a => `
    <div class="activity-item fade-in">
      <div class="activity-dot" style="background:${a.color};box-shadow:0 0 6px ${a.color};"></div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${relativeTime(a.time)}</div>
      </div>
    </div>
  `).join('');
}

// ── Suggested Teammates ──
function renderTeammates() {
  const list = document.getElementById('teammates-list');
  if (!list) return;

  list.innerHTML = MOCK_DATA.teammates.map((tm, i) => `
    <div class="card teammate-card fade-in stagger-${i+1}">
      <div class="avatar" style="background:${avatarGrad(tm.id)};">${tm.avatar}</div>
      <div class="teammate-info">
        <div class="teammate-name">${tm.name}</div>
        <div class="teammate-skills">${tm.skills.slice(0,2).join(' · ')}</div>
      </div>
      <div>
        <div class="teammate-match">${tm.match}%</div>
        <div style="font-size:11px;color:var(--text-muted);text-align:right;">match</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="connectTeammate('${tm.name}')">
        Connect
      </button>
    </div>
  `).join('');
}

// ── Animated counters on page load ──
function initCounters() {
  const targets = {
    'stat-skills':    MOCK_DATA.stats.skills,
    'stat-projects':  MOCK_DATA.stats.projects,
    'stat-teammates': MOCK_DATA.stats.teammates,
    'stat-tokens':    MOCK_DATA.stats.tokens,
  };
  setTimeout(() => {
    Object.entries(targets).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) animateCounter(el, val, 1000);
    });
  }, 500);
}

window.connectTeammate = async (name) => {
  showToast(`Sending connection request to ${name}…`, 'info');
  await API.delay(900);
  showToast(`Request sent to ${name}! ✅`, 'success');
};

// ── Transactions (for token/exchange page sections) ──
window.renderTransactions = () => {
  const list = document.getElementById('transactions-list');
  if (!list) return;
  list.innerHTML = MOCK_DATA.transactions.map(tx => `
    <div class="exchange-row">
      <div class="exchange-direction ${tx.type}">
        <i class="fa-solid fa-arrow-${tx.type === 'in' ? 'down' : 'up'}"></i>
      </div>
      <div class="exchange-info">
        <div class="exchange-title">${tx.title}</div>
        <div class="exchange-sub">${tx.sub}</div>
      </div>
      <div>
        <div class="exchange-amount ${tx.type}">${tx.amount} SKX</div>
        <div style="font-size:11px;color:var(--text-muted);text-align:right;">${tx.date}</div>
      </div>
    </div>
  `).join('');
};
