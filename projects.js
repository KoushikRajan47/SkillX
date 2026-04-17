// =============================================
//  SkillX — projects.js  |  Project Hub
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initProjectTabs();
  initProjectModal();
  initCreateProject();
});

// ── Render projects by status ──
function renderProjects(tab = 'all') {
  const grids = {
    active:     document.getElementById('active-grid'),
    incomplete: document.getElementById('incomplete-grid'),
    all:        document.getElementById('all-grid')
  };

  const allData      = MOCK_DATA.projects;
  const activeData   = allData.filter(p => p.status === 'active');
  const incompleteData = allData.filter(p => p.status === 'incomplete');

  // Update counts
  const el = id => document.getElementById(id);
  if (el('active-count'))     el('active-count').textContent     = activeData.length;
  if (el('incomplete-count')) el('incomplete-count').textContent = incompleteData.length;
  if (el('total-count'))      el('total-count').textContent      = allData.length;

  const renderGrid = (container, data) => {
    if (!container) return;
    if (data.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-state-icon">📁</div>
          <h3>No Projects Here</h3>
          <p>There are no projects in this category yet. Create one to get started!</p>
          <button class="btn btn-primary btn-sm" onclick="openModal('create-project-modal')">
            <i class="fa-solid fa-plus"></i> Create Project
          </button>
        </div>`;
      return;
    }
    container.innerHTML = data.map((p, i) => buildProjectCard(p, i)).join('');
    // Animate progress bars after render
    setTimeout(() => {
      container.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 100);
  };

  renderGrid(grids.active, activeData);
  renderGrid(grids.incomplete, incompleteData);
  renderGrid(grids.all, allData);
}

function buildProjectCard(p, idx) {
  const statusBadge = p.status === 'active'
    ? `<span class="badge badge-green"><i class="fa-solid fa-circle" style="font-size:7px;"></i> Active</span>`
    : `<span class="badge badge-amber"><i class="fa-solid fa-circle" style="font-size:7px;"></i> In Progress</span>`;

  const actionBtn = p.status === 'active'
    ? `<button class="btn btn-primary btn-sm" onclick="joinProject(${p.id})">
         <i class="fa-solid fa-arrow-right-to-bracket"></i> Join
       </button>`
    : `<button class="btn btn-ghost btn-sm" onclick="continueProject(${p.id})">
         <i class="fa-solid fa-play"></i> Continue
       </button>`;

  const tagColors = ['cyan','violet','pink'];
  const tagHTML = p.tags.map((tag, j) =>
    `<span class="badge badge-${tagColors[j % tagColors.length]}">${tag}</span>`
  ).join('');

  const teamHTML = p.team.map((member, j) => `
    <div class="avatar avatar-sm" style="background:${avatarGradByStr(member)};font-size:11px;
         margin-left:${j > 0 ? '-10px' : '0'};border:2px solid var(--bg-surface);z-index:${10-j};">
      ${member}
    </div>
  `).join('');

  const progressColor = p.progress >= 70 ? 'var(--accent-green)' : p.progress >= 40 ? 'var(--accent-cyan)' : 'var(--accent-amber)';

  return `
    <div class="card project-card fade-in stagger-${Math.min(idx+1,6)}" style="cursor:pointer;"
         onclick="openProjectDetail(${p.id})">
      <div class="project-card-head">
        <div>
          <div class="project-title">${p.title}</div>
          <div style="margin-top:6px;">${statusBadge}</div>
        </div>
        <button class="icon-btn" onclick="event.stopPropagation();bookmarkProject(${p.id})" title="Bookmark">
          <i class="fa-regular fa-bookmark"></i>
        </button>
      </div>

      <p class="project-desc">${p.desc}</p>

      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">${tagHTML}</div>

      <div class="project-meta">
        <div class="project-meta-item">
          <i class="fa-regular fa-calendar" style="color:var(--accent-cyan);"></i>
          Due: <strong>${p.due}</strong>
        </div>
        <div class="project-meta-item">
          <i class="fa-solid fa-users" style="color:var(--accent-violet);"></i>
          <strong>${p.members}</strong> members
        </div>
        <div class="project-meta-item">
          <i class="fa-solid fa-chart-line" style="color:${progressColor};"></i>
          <strong style="color:${progressColor};">${p.progress}%</strong> done
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:12px;color:var(--text-muted);">Progress</span>
          <span style="font-size:12px;font-weight:600;color:${progressColor};">${p.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" data-width="${p.progress}" style="width:0%;background:linear-gradient(90deg,${progressColor},${progressColor}88);"></div>
        </div>
      </div>

      <div class="project-footer">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="display:flex;">${teamHTML}</div>
          ${p.members > p.team.length ? `<span class="project-team-more">+${p.members - p.team.length}</span>` : ''}
        </div>
        <div onclick="event.stopPropagation();">${actionBtn}</div>
      </div>
    </div>
  `;
}

function avatarGradByStr(str) {
  const grads = [
    'linear-gradient(135deg,#7b2ff7,#00e5ff)',
    'linear-gradient(135deg,#ff2d78,#ff6b35)',
    'linear-gradient(135deg,#00ff88,#00d4aa)',
    'linear-gradient(135deg,#ffaa00,#ff6b35)',
    'linear-gradient(135deg,#00e5ff,#7b2ff7)',
    'linear-gradient(135deg,#ff2d78,#7b2ff7)',
  ];
  const idx = str.charCodeAt(0) % grads.length;
  return grads[idx];
}

// ── Tabs ──
function initProjectTabs() {
  const tabs    = document.querySelectorAll('.tab[data-tab]');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t    => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      target?.classList.add('active');
      // Re-animate progress bars
      setTimeout(() => {
        target?.querySelectorAll('.progress-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }, 100);
    });
  });
}

// ── Create Project Modal ──
function initCreateProject() {
  const form = document.getElementById('create-project-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.querySelector('#proj-title').value.trim();
    const desc  = form.querySelector('#proj-desc').value.trim();
    const tag   = form.querySelector('#proj-tag').value;
    const btn   = form.querySelector('[type=submit]');

    if (!title || !desc) {
      showToast('Please fill in all required fields', 'error'); return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> Creating...';
    await API.delay(1200);

    // Add to mock data
    const newProject = {
      id: Date.now(), title, desc, status: 'incomplete',
      tags: [tag || 'Web', 'Open Source'],
      team: ['AR'], progress: 0, due: 'TBD', members: 1
    };
    MOCK_DATA.projects.push(newProject);
    closeAllModals();
    renderProjects();
    showToast(`Project "${title}" created! 🎉`, 'success');

    btn.disabled = false;
    btn.innerHTML = 'Create Project';
    form.reset();
  });
}

// ── Project Detail Modal ──
function initProjectModal() {
  // handled by openProjectDetail
}

window.openProjectDetail = (projectId) => {
  const p = MOCK_DATA.projects.find(pr => pr.id === projectId);
  if (!p) return;

  const modal = document.getElementById('project-detail-modal');
  if (!modal) return;

  modal.querySelector('#detail-title').textContent   = p.title;
  modal.querySelector('#detail-desc').textContent    = p.desc;
  modal.querySelector('#detail-progress').textContent = p.progress + '%';
  modal.querySelector('#detail-due').textContent     = p.due;
  modal.querySelector('#detail-members').textContent = p.members;

  const bar = modal.querySelector('#detail-progress-bar');
  if (bar) { bar.style.width = '0'; setTimeout(() => bar.style.width = p.progress + '%', 100); }

  const statusEl = modal.querySelector('#detail-status');
  if (statusEl) {
    statusEl.className = `badge badge-${p.status === 'active' ? 'green' : 'amber'}`;
    statusEl.innerHTML = p.status === 'active'
      ? '<i class="fa-solid fa-circle" style="font-size:7px;"></i> Active'
      : '<i class="fa-solid fa-circle" style="font-size:7px;"></i> In Progress';
  }

  const tagColors = ['cyan','violet','pink'];
  const tagsEl = modal.querySelector('#detail-tags');
  if (tagsEl) tagsEl.innerHTML = p.tags.map((t,i) => `<span class="badge badge-${tagColors[i%tagColors.length]}">${t}</span>`).join('');

  openModal('project-detail-modal');
};

window.joinProject = async (id) => {
  const p = MOCK_DATA.projects.find(pr => pr.id === id);
  if (!p) return;
  showToast(`Joining "${p.title}"…`, 'info');
  await API.delay(1000);
  p.members++;
  renderProjects();
  showToast(`You've joined "${p.title}"! 🚀`, 'success');
};

window.continueProject = (id) => {
  const p = MOCK_DATA.projects.find(pr => pr.id === id);
  if (!p) return;
  showToast(`Opening "${p.title}"… (demo)`, 'info');
};

window.bookmarkProject = (id) => {
  const p = MOCK_DATA.projects.find(pr => pr.id === id);
  if (!p) return;
  showToast(`Bookmarked "${p.title}" ✨`, 'success');
};
