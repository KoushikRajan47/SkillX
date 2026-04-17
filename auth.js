// =============================================
//  SkillX — auth.js  |  Login / Register
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initAuthTabs();
  initLoginForm();
  initRegisterForm();
  initPasswordToggle();
  checkAlreadyLoggedIn();
  initFloatingLabels();
});

// ── Check if already logged in ──
function checkAlreadyLoggedIn() {
  const user = sessionStorage.getItem('skillx_user');
  if (user) {
    window.location.href = 'dashboard.html';
  }
}

// ── Tab switching between Login / Register ──
function initAuthTabs() {
  const tabs  = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t  => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`form-${target}`)?.classList.add('active');

      // Reset any existing errors
      document.querySelectorAll('.form-error').forEach(e => e.remove());
    });
  });

  // URL param handling — e.g. ?tab=register
  const params = new URLSearchParams(location.search);
  const tabParam = params.get('tab');
  if (tabParam) {
    const t = document.querySelector(`[data-tab="${tabParam}"]`);
    if (t) t.click();
  }
}

// ── Login Form ──
function initLoginForm() {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const email    = form.querySelector('#login-email').value.trim();
    const password = form.querySelector('#login-password').value;
    const btn      = form.querySelector('[type=submit]');

    // Basic validation
    let valid = true;
    if (!isValidEmail(email)) {
      showFieldError(form.querySelector('#login-email'), 'Enter a valid email address');
      valid = false;
    }
    if (password.length < 6) {
      showFieldError(form.querySelector('#login-password'), 'Password must be at least 6 characters');
      valid = false;
    }
    if (!valid) return;

    setLoadingBtn(btn, true);

    await API.delay(1200); // Simulated API

    // Mock: accept any valid email
    const userData = {
      ...MOCK_DATA.user,
      email,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem('skillx_user', JSON.stringify(userData));
    showToast('Welcome back, Alex! 👋', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  });
}

// ── Register Form ──
function initRegisterForm() {
  const form = document.getElementById('form-register');
  if (!form) return;

  // Password strength meter
  const pwInput = form.querySelector('#reg-password');
  const strengthBar = form.querySelector('#strength-bar');
  const strengthText = form.querySelector('#strength-text');

  pwInput?.addEventListener('input', () => {
    const score = getPasswordStrength(pwInput.value);
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ff2d78', '#ffaa00', '#00e5ff', '#00ff88'];
    const pct    = (score / 4) * 100;

    if (strengthBar) {
      strengthBar.style.width    = pct + '%';
      strengthBar.style.background = colors[score];
    }
    if (strengthText) {
      strengthText.textContent = score > 0 ? labels[score] : '';
      strengthText.style.color = colors[score];
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const name     = form.querySelector('#reg-name').value.trim();
    const email    = form.querySelector('#reg-email').value.trim();
    const role     = form.querySelector('#reg-role').value;
    const password = form.querySelector('#reg-password').value;
    const confirm  = form.querySelector('#reg-confirm').value;
    const terms    = form.querySelector('#reg-terms').checked;
    const btn      = form.querySelector('[type=submit]');

    let valid = true;

    if (name.length < 2) {
      showFieldError(form.querySelector('#reg-name'), 'Name must be at least 2 characters'); valid = false;
    }
    if (!isValidEmail(email)) {
      showFieldError(form.querySelector('#reg-email'), 'Enter a valid email address'); valid = false;
    }
    if (!role) {
      showFieldError(form.querySelector('#reg-role'), 'Please select your role'); valid = false;
    }
    if (password.length < 8) {
      showFieldError(form.querySelector('#reg-password'), 'Password must be at least 8 characters'); valid = false;
    }
    if (password !== confirm) {
      showFieldError(form.querySelector('#reg-confirm'), 'Passwords do not match'); valid = false;
    }
    if (!terms) {
      showToast('Please accept the Terms of Service', 'error'); valid = false;
    }
    if (!valid) return;

    setLoadingBtn(btn, true);
    await API.delay(1400);

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    const userData = {
      id: Date.now(), name, email, role,
      avatar: initials, level: 'Starter',
      xp: 0, tokens: 100,
      skills: [], joinedProjects: 0, completedProjects: 0,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem('skillx_user', JSON.stringify(userData));
    showToast(`Welcome to SkillX, ${name.split(' ')[0]}! 🚀`, 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 700);
  });
}

// ── Password visibility toggle ──
function initPasswordToggle() {
  document.querySelectorAll('.toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-icon-wrap').querySelector('input');
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.querySelector('i').className = isText ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
    });
  });
}

// ── Floating label animation ──
function initFloatingLabels() {
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group')?.querySelector('.form-label')?.classList.add('label-float');
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.closest('.form-group')?.querySelector('.form-label')?.classList.remove('label-float');
      }
    });
  });
}

// ── Helpers ──
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;
  return score;
}

function showFieldError(input, message) {
  if (!input) return;
  input.style.borderColor = 'var(--accent-pink)';
  const err = document.createElement('div');
  err.className = 'form-error';
  err.style.cssText = 'color: #ff6b9d; font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 5px;';
  err.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  input.parentNode.insertAdjacentElement('afterend', err);
  setTimeout(() => { input.style.borderColor = ''; }, 3000);
}

function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(e => e.remove());
  form.querySelectorAll('.form-input').forEach(i => i.style.borderColor = '');
}

function setLoadingBtn(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn._origText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Processing...`;
  } else {
    btn.innerHTML = btn._origText || btn.innerHTML;
    btn.disabled  = false;
  }
}

// ── Social auth simulation ──
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const provider = btn.dataset.provider || 'GitHub';
    showToast(`Connecting to ${provider}… (demo)`, 'info');
    await API.delay(1000);
    showToast(`${provider} OAuth not configured in demo mode`, 'warning');
  });
});
