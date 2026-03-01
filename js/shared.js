// ===== SHARED JS — Avantware =====
// Used by all pages (index.html, product pages, legal pages)

(function() {
  'use strict';

  // ===== THEME TOGGLE =====
  (function() {
    var saved = localStorage.getItem('avantware-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'light' ? 'dark' : 'light';
        if (next === 'dark') {
          document.documentElement.removeAttribute('data-theme');
        } else {
          document.documentElement.setAttribute('data-theme', next);
        }
        localStorage.setItem('avantware-theme', next);
      });
    }
  })();

  // ===== REDUCED MOTION CHECK =====
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
  }

  // ===== NAV SCROLL =====
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== MOBILE MENU =====
  var mobileToggle = document.getElementById('mobileToggle');
  var mobileOverlay = document.getElementById('mobileOverlay');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first focusable element
    var firstFocusable = mobileMenu.querySelector('a, button');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ===== MOBILE ACCORDION =====
  document.querySelectorAll('.mobile-accordion-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var isActive = this.classList.contains('active');
      // Close all
      document.querySelectorAll('.mobile-accordion-trigger').forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.mobile-accordion-content').forEach(function(c) {
        c.classList.remove('active');
      });
      // Toggle current
      if (!isActive) {
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        this.nextElementSibling.classList.add('active');
      }
    });
  });

  // ===== DROPDOWN ARIA =====
  document.querySelectorAll('.nav-item').forEach(function(item) {
    var trigger = item.querySelector('.nav-trigger');
    item.addEventListener('mouseenter', function() {
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', function() {
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    if (trigger) {
      trigger.addEventListener('focus', function() {
        trigger.setAttribute('aria-expanded', 'true');
      });
    }
    item.addEventListener('focusout', function(e) {
      if (!item.contains(e.relatedTarget)) {
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ===== SCROLL REVEAL =====
  if (!prefersReducedMotion) {
    var revealObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });

    // Section divider animation
    var dividerObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section-divider').forEach(function(el) { dividerObs.observe(el); });
  } else {
    // If reduced motion, make everything visible immediately
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
    document.querySelectorAll('.section-divider').forEach(function(el) { el.classList.add('visible'); });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var href = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== ESCAPE KEY =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
      if (mobileToggle) mobileToggle.focus();
    }
  });

  // ===== FOCUS TRAP (mobile menu) =====
  if (mobileMenu) {
    mobileMenu.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      var focusable = mobileMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ===== BACK-TO-TOP BUTTON =====
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== SCROLL PROGRESS BAR =====
  var scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    });
  }

  // ===== FAQ ACCORDION (product pages) =====
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var isActive = this.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-question').forEach(function(q) {
        q.classList.remove('active');
        q.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.faq-answer').forEach(function(a) {
        a.classList.remove('active');
      });
      // Toggle current
      if (!isActive) {
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        this.parentElement.querySelector('.faq-answer').classList.add('active');
      }
    });
  });

  // ===== CARD 3D TILT + CURSOR SPOTLIGHT =====
  if (!prefersReducedMotion) {
    var tiltCards = document.querySelectorAll('.featured-card, .product-card, .vertical-card');
    tiltCards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -3;
        var rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    });
  }

  // ===== SCROLL SPY (homepage only) =====
  var sections = document.querySelectorAll('main > section[id]');
  var navTriggers = document.querySelectorAll('.nav-trigger');
  if (sections.length > 3) {
    // Only on homepage (which has many sections)
    var sectionMap = {
      'hero': null,
      'verticals': 'Products',
      'featured': 'Products',
      'trading': 'Trading',
      'products': 'Products',
      'apps': 'Products',
      'hire': 'Services',
      'web-services': 'Services',
      'about': 'Company',
      'contact': 'Company'
    };

    window.addEventListener('scroll', function() {
      var scrollPos = window.scrollY + 200;
      var currentSection = null;
      sections.forEach(function(section) {
        if (section.offsetTop <= scrollPos) {
          currentSection = section.id;
        }
      });
      // Remove all active
      navTriggers.forEach(function(t) { t.classList.remove('active'); });
      // Set active
      if (currentSection && sectionMap[currentSection]) {
        navTriggers.forEach(function(t) {
          if (t.textContent.trim().replace(/\s+/g, ' ').startsWith(sectionMap[currentSection])) {
            t.classList.add('active');
          }
        });
      }
    });
  }

})();
