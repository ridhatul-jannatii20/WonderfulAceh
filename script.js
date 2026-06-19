/* =============================================
   WONDERFUL ACEH - Main JavaScript
   Author: Ridhatul Jannati
   ============================================= */

/* === LOADING SCREEN — only on index.html, only first visit per session === */
(function initLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  // Only show on index.html
  const page = location.pathname.split('/').pop() || 'index.html';
  const isHome = page === '' || page === 'index.html';

  if (!isHome || sessionStorage.getItem('wa_loaded')) {
    loader.style.display = 'none';
    return;
  }

  // Show loader, hide after animation
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      sessionStorage.setItem('wa_loaded', '1');
    }, 2000);
  });
})();

/* === AUTH SYSTEM === */
const Auth = {
  KEY: 'wa_user',

  getUser() {
    try { return JSON.parse(sessionStorage.getItem(this.KEY)); } catch { return null; }
  },

  login(username) {
    sessionStorage.setItem(this.KEY, JSON.stringify({ username }));
  },

  logout() {
    sessionStorage.removeItem(this.KEY);
  },

  isLoggedIn() { return !!this.getUser(); }
};

/* Helper: get initials from username */
function getInitials(name) {
  return name.split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

/* === RENDER NAVBAR AUTH STATE === */
function renderNavAuth() {
  const loginSlot = document.getElementById('nav-auth-slot');
  if (!loginSlot) return;

  const user = Auth.getUser();

  if (!user) {
    loginSlot.innerHTML = `
      <a href="login.html" class="btn-login-nav">
        <i class="bi bi-person-fill"></i> Login
      </a>`;
  } else {
    const initials = getInitials(user.username);
    loginSlot.innerHTML = `
      <div class="navbar-user-menu" id="user-menu">
        <button class="navbar-user-btn" id="user-menu-toggle" type="button" aria-expanded="false">
          <span class="navbar-user-avatar">${initials}</span>
          ${user.username}
          <i class="bi bi-chevron-down" style="font-size:0.7rem;margin-left:2px;"></i>
        </button>
        <div class="navbar-user-dropdown" id="user-dropdown">
          <div class="navbar-user-dropdown-header">
            <span class="navbar-user-dropdown-name">${user.username}</span>
            <span class="navbar-user-dropdown-sub">Logged in</span>
          </div>
          <button class="navbar-user-dropdown-item logout" id="logout-btn" type="button">
            <i class="bi bi-box-arrow-right"></i> Keluar
          </button>
        </div>
      </div>`;

    // Toggle dropdown
    document.getElementById('user-menu-toggle')?.addEventListener('click', function(e) {
      e.stopPropagation();
      const dd = document.getElementById('user-dropdown');
      dd.classList.toggle('open');
      this.setAttribute('aria-expanded', dd.classList.contains('open'));
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Auth.logout();
      renderNavAuth();
    });

    // Close on outside click
    document.addEventListener('click', function closeDropdown(e) {
      const menu = document.getElementById('user-menu');
      if (menu && !menu.contains(e.target)) {
        document.getElementById('user-dropdown')?.classList.remove('open');
        document.removeEventListener('click', closeDropdown);
      }
    });
  }
}

/* === LOGIN PAGE LOGIC === */
function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  // If already logged in, redirect back
  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    if (!username || !password) {
      errorEl.textContent = 'Username dan password wajib diisi.';
      errorEl.classList.add('show');
      return;
    }

    // Simple demo auth — any non-empty username/password works
    errorEl.classList.remove('show');
    Auth.login(username);

    // Return to previous page or index
    const returnTo = sessionStorage.getItem('wa_return') || 'index.html';
    sessionStorage.removeItem('wa_return');
    window.location.href = returnTo;
  });
}

/* === NAVBAR SCROLL EFFECT === */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  toggleBackToTop();
});

/* === SET ACTIVE NAV LINK === */
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* === HERO SLIDESHOW === */
(function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 7000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  const leftBtn = document.querySelector('.hero-arrow-left');
  const rightBtn = document.querySelector('.hero-arrow-right');
  if (leftBtn) leftBtn.addEventListener('click', () => { prev(); startAuto(); });
  if (rightBtn) rightBtn.addEventListener('click', () => { next(); startAuto(); });

  // Touch support
  let touchStartX = 0;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
    }, { passive: true });
  }

  startAuto();
})();

/* === SCROLL REVEAL === */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

/* === BACK TO TOP === */
const backToTopBtn = document.getElementById('back-to-top');
function toggleBackToTop() {
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
}
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* === NEWSLETTER FORM === */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (input && input.value.trim()) {
      const btn = form.querySelector('.newsletter-btn');
      const orig = btn.textContent;
      btn.textContent = '✓ Berhasil!';
      btn.style.background = '#16a34a';
      input.value = '';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 3000);
    }
  });
});

/* === COUNTER ANIMATION === */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* === LAZY LOADING IMAGES === */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* === INIT ON DOM READY === */
document.addEventListener('DOMContentLoaded', () => {
  renderNavAuth();
  initLoginPage();
});

/* === DESTINATION FILTER === */
function initDestinationFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destCards = document.querySelectorAll('.dest-card');

  if (!filterBtns.length || !destCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Reset style semua tombol
      filterBtns.forEach(f => {
        f.classList.remove('active');
        f.style.background = '';
        f.style.color = '';
        f.style.borderColor = '';
      });

      // 2. Set style tombol yang di-klik
      btn.classList.add('active');
      btn.style.background = 'var(--primary)';
      btn.style.color = 'white';
      btn.style.borderColor = 'var(--primary)';

      // 3. Logika Filter
      const filterValue = btn.getAttribute('data-filter');

      destCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'Semua' || category === filterValue) {
          card.style.display = 'block';
          // Animasi fade-in ringan
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
        }
      });
    });
  });
}
/* === INIT ON DOM READY === */
document.addEventListener('DOMContentLoaded', () => {
  renderNavAuth();
  initLoginPage();
  initDestinationFilter(); // Tambahkan baris ini
});