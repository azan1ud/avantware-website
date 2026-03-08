// ===== SHARED JS — Avantware =====
// Used by all pages (index, product, legal, blog, etc.)

(function () {
  'use strict';

  // ===== THEME TOGGLE =====
  const saved = localStorage.getItem('avantware-theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('avantware-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('avantware-theme', 'light');
      }
    });
  }

  // ===== MOBILE MENU =====
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileClose = document.getElementById('mobileClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = mobileMenu.querySelector('a, button');
    if (first) first.focus();
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Mobile accordion
  document.querySelectorAll('.mobile-accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', function () {
      const wasActive = this.classList.contains('active');

      // Close all
      document.querySelectorAll('.mobile-accordion-trigger').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.mobile-accordion-content').forEach((c) => {
        c.classList.remove('active');
      });

      // Toggle current
      if (!wasActive) {
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        const content = this.nextElementSibling;
        if (content) content.classList.add('active');
      }
    });
  });

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
      if (mobileToggle) mobileToggle.focus();
    }
  });

  // Focus trap within mobile menu
  if (mobileMenu) {
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = mobileMenu.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // ===== HEADER SCROLL =====
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== SCROLL PROGRESS BAR =====
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = `${pct}%`;
    });
  }

  // ===== BACK-TO-TOP BUTTON =====
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== REVEAL ANIMATION =====
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', function () {
      const wasActive = this.classList.contains('active');
      const answer = this.parentElement.querySelector('.faq-answer');

      // Close all
      document.querySelectorAll('.faq-question').forEach((q) => {
        q.classList.remove('active');
        q.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.faq-answer').forEach((a) => {
        a.classList.remove('active');
        a.style.maxHeight = null;
      });

      // Toggle current
      if (!wasActive) {
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        if (answer) {
          answer.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  // ===== SMOOTH SCROLL FOR HASH LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
      }
    });
  });

  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const msgEl = newsletterForm.querySelector('.newsletter-msg');
      const btn = newsletterForm.querySelector('button');
      if (!emailInput || !emailInput.value) return;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData();
      formData.append('access_key', '20e5fd94-1fee-4ed5-ad57-d8d2a498302e');
      formData.append('subject', 'Newsletter Signup — avantware.uk');
      formData.append('email', emailInput.value);
      formData.append('from_name', 'Newsletter Subscriber');

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (msgEl) {
              msgEl.textContent = "Subscribed! We'll be in touch.";
              msgEl.style.color = 'var(--cyan)';
            }
            emailInput.value = '';
          } else {
            if (msgEl) {
              msgEl.textContent = 'Something went wrong. Try again.';
              msgEl.style.color = 'var(--rose)';
            }
          }
          btn.textContent = 'Subscribe';
          btn.disabled = false;
        })
        .catch(() => {
          if (msgEl) {
            msgEl.textContent = 'Network error. Try again.';
            msgEl.style.color = 'var(--rose)';
          }
          btn.textContent = 'Subscribe';
          btn.disabled = false;
        });
    });
  }

  // ===== COOKIE BANNER =====
  (() => {
    if (localStorage.getItem('avantware-cookie-consent')) return;
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    setTimeout(() => banner.classList.add('show'), 1500);

    const accept = document.getElementById('cookie-accept');
    const decline = document.getElementById('cookie-decline');

    if (accept) {
      accept.addEventListener('click', () => {
        localStorage.setItem('avantware-cookie-consent', 'accepted');
        banner.classList.remove('show');
      });
    }
    if (decline) {
      decline.addEventListener('click', () => {
        localStorage.setItem('avantware-cookie-consent', 'declined');
        banner.classList.remove('show');
      });
    }
  })();

  // ===== HIRE FORM (homepage) =====
  const hireForm = document.getElementById('hireForm');
  if (hireForm) {
    hireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = hireForm.querySelector('button[type="submit"]');
      const success = document.getElementById('formSuccess');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }

      const formData = new FormData(hireForm);

      fetch(hireForm.action, { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && success) {
            hireForm.style.display = 'none';
            success.style.display = 'block';
          } else {
            if (btn) {
              btn.textContent = 'Send';
              btn.disabled = false;
            }
          }
        })
        .catch(() => {
          if (btn) {
            btn.textContent = 'Send';
            btn.disabled = false;
          }
        });
    });
  }

  // ===== DROPDOWN ARIA (desktop nav) =====
  document.querySelectorAll('.nav-item').forEach((item) => {
    const trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;

    item.addEventListener('mouseenter', () => trigger.setAttribute('aria-expanded', 'true'));
    item.addEventListener('mouseleave', () => trigger.setAttribute('aria-expanded', 'false'));
    trigger.addEventListener('focus', () => trigger.setAttribute('aria-expanded', 'true'));
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) trigger.setAttribute('aria-expanded', 'false');
    });
  });

})();
