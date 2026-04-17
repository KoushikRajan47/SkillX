// =============================================
//  SkillX — skills.js  |  Skill Marketplace
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  renderSkillCards();
  initSkillFilters();
  initSkillSearch();
  initRequestModal();
});

// ── Render all skill cards ──
function renderSkillCards(filter = 'all', search = '') {
  const grid    = document.getElementById('skills-grid');
  const loading = document.getElementById('skills-loading');
  const empty   = document.getElementById('skills-empty');
  if (!grid) return;

  // Show skeleton loaders
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="card" style="padding:28px;">
      <div style="display:flex;gap:14px;margin-bottom:16px;">
        <div class="skeleton" style="width:56px;height:56px;border-radius:50%;flex-shrink:0;"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
          <div class="skeleton" style="height:16px;width:60%;border-radius:4px;"></div>
          <div class="skeleton" style="height:12px;width:40%;border-radius:4px;"></div>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:16px;">
        ${Array(3).fill(0).map(() => '<div class="skeleton" style="height:24px;width:64px;border-radius:12px;"></div>').join('')}
      </div>
      <div class="skeleton" style="height:36px;border-radius:10px;"></div>
    </div>
  `).join('');

  setTimeout(() => {
    let data = MOCK_DATA.skills;

    // Filter
    if (filter !== 'all') {
      const filterMap = {
        design:     s => s.skills.some(sk => ['Figma','Framer','CSS','UI','UX'].some(t => sk.includes(t))),
        dev:        s => s.skills.some(sk => ['React','Node','Python','Go','Rust','Java','Flutter','Swift','Kotlin'].some(t => sk.includes(t))),
        ml:         s => s.skills.some(sk => ['TensorFlow','PyTorch','Keras','ML','AI','Pandas'].some(t => sk.includes(t))),
        web3:       s => s.skills.some(sk => ['Solidity','Web3','Blockchain','Rust'].some(t => sk.includes(t))),
        devops:     s => s.skills.some(sk => ['Docker','K8s','AWS','Terraform','CI'].some(t => sk.includes(t))),
        security:   s => s.skills.some(sk => ['Pentesting','OWASP','CTF','Burp','Security'].some(t => sk.includes(t)))
      };
      data = data.filter(filterMap[filter] || (() => true));
    }

    // Search
    if (search.length > 1) {
      const q = search.toLowerCase();
      data = data.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.skills.some(sk => sk.toLowerCase().includes(q))
      );
    }

    if (data.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';

    const chipColors = ['cyan','violet','pink','amber','green'];
    grid.innerHTML = data.map((user, i) => `
      <div class="card user-skill-card fade-in stagger-${Math.min(i+1,6)}"
           style="--delay:${i*0.05}s;">
        <div class="user-skill-header">
          <div class="avatar avatar-lg" style="background:${avatarGrad(user.id)};">
            ${user.avatar}
          </div>
          <div class="user-skill-details">
            <div class="user-skill-name">${user.name}
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;
                background:${user.online ? 'var(--accent-green)' : 'var(--text-muted)'};
                box-shadow:${user.online ? '0 0 6px var(--accent-green)' : 'none'};
                margin-left:8px;"></span>
            </div>
            <div class="user-skill-title">${user.title}</div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
              <span style="color:var(--accent-amber);font-size:12px;">★ ${user.rating}</span>
              <span style="color:var(--text-muted);font-size:12px;">·</span>
              <span style="color:var(--text-muted);font-size:12px;">${user.exchanges} exchanges</span>
            </div>
          </div>
        </div>

        <div class="skills-wrap">
          ${user.skills.map((sk, j) => `<span class="skill-chip">${sk}</span>`).join('')}
        </div>

        <div class="user-skill-footer">
          <div class="user-stat">
            <i class="fa-solid fa-coins" style="color:var(--accent-amber);"></i>
            <strong>${user.tokens}</strong> SKX
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-ghost btn-sm" onclick="viewProfile(${user.id})">
              <i class="fa-regular fa-user"></i> Profile
            </button>
            <button class="btn btn-primary btn-sm"
                    onclick="openRequestModal(${user.id})"
                    data-user-id="${user.id}">
              <i class="fa-solid fa-arrow-right-arrow-left"></i> Request Exchange
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Update count
    const counter = document.getElementById('skills-count');
    if (counter) counter.textContent = `${data.length} developers`;

  }, 600);
}

// ── Avatar gradient helper ──
function avatarGrad(id) {
  const grads = [
    'linear-gradient(135deg,#7b2ff7,#00e5ff)',
    'linear-gradient(135deg,#ff2d78,#ff6b35)',
    'linear-gradient(135deg,#00ff88,#00d4aa)',
    'linear-gradient(135deg,#ffaa00,#ff6b35)',
    'linear-gradient(135deg,#00e5ff,#7b2ff7)',
    'linear-gradient(135deg,#ff2d78,#7b2ff7)',
    'linear-gradient(135deg,#00ff88,#00e5ff)',
    'linear-gradient(135deg,#7b2ff7,#ff2d78)'
  ];
  return grads[(id - 1) % grads.length];
}
window.avatarGrad = avatarGrad;

// ── Filter chips ──
function initSkillFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      const search = document.getElementById('skill-search')?.value || '';
      renderSkillCards(filter, search);
    });
  });
}

// ── Search ──
function initSkillSearch() {
  const input = document.getElementById('skill-search');
  if (!input) return;
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const filter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
      renderSkillCards(filter, input.value.trim());
    }, 350);
  });
}

// ── Request Exchange Modal ──
function initRequestModal() {
  const form = document.getElementById('exchange-request-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> Sending...';

    await API.delay(1200);
    closeAllModals();
    showToast('Exchange request sent! 🔄', 'success');
    btn.disabled = false;
    btn.innerHTML = 'Send Request';
    form.reset();
  });
}

window.openRequestModal = (userId) => {
  const user = MOCK_DATA.skills.find(u => u.id === userId);
  if (!user) return;

  const nameEl = document.getElementById('modal-user-name');
  const titleEl = document.getElementById('modal-user-title');
  const avatarEl = document.getElementById('modal-user-avatar');

  if (nameEl)   nameEl.textContent  = user.name;
  if (titleEl)  titleEl.textContent = user.title;
  if (avatarEl) {
    avatarEl.textContent = user.avatar;
    avatarEl.style.background = avatarGrad(user.id);
  }

  // Populate skills dropdown
  const offeredSkills = document.getElementById('offered-skill');
  if (offeredSkills) {
    offeredSkills.innerHTML = MOCK_DATA.user.skills.map(sk =>
      `<option value="${sk}">${sk}</option>`
    ).join('');
  }

  document.getElementById('modal-request-id').value = userId;
  openModal('request-modal');
};

window.viewProfile = (userId) => {
  const user = MOCK_DATA.skills.find(u => u.id === userId);
  if (!user) return;
  showToast(`Viewing ${user.name}'s profile (demo)`, 'info');
};
