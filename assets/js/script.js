/* ============================================================
   SAUDI RETURN HOUSE — script.js  v2.0
   Contact: +91 92083 15589
   WhatsApp: https://wa.me/919208315589
   ============================================================ */

(function () {
  'use strict';

  /* ── CONFIGURATION ─────────────────────────────────────── */
  var WA_NUMBER   = '919208315589';
  var CALL_NUMBER = '+919208315589';
  var WA_BASE     = 'https://wa.me/' + WA_NUMBER;
  var CALL_LINK   = 'tel:' + CALL_NUMBER;

  /* ── UTILITY ────────────────────────────────────────────── */
  function buildWaUrl(message) {
    var encoded = encodeURIComponent(message || 'Hello! I am interested in your driver services.');
    return WA_BASE + '?text=' + encoded;
  }

  /* ── WHATSAPP BUTTON LINKS (data-wa) ───────────────────── */
  function initWaLinks() {
    document.querySelectorAll('[data-wa]').forEach(function (btn) {
      var msg = btn.getAttribute('data-wa');
      btn.setAttribute('href', buildWaUrl(msg));
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ── CALL BUTTON LINKS (data-call) ────────────────────── */
  function initCallLinks() {
    document.querySelectorAll('[data-call]').forEach(function (btn) {
      btn.setAttribute('href', CALL_LINK);
    });
  }

  /* ── FLOATING WA BUTTON ────────────────────────────────── */
  function initFloatingWa() {
    var floatLink = document.getElementById('wa-float-link');
    if (!floatLink) return;
    floatLink.setAttribute(
      'href',
      buildWaUrl('Hello! I found you on your website. I am interested in your driver services. Please guide me.')
    );
    floatLink.setAttribute('target', '_blank');
    floatLink.setAttribute('rel', 'noopener noreferrer');
  }

  /* ── FLOATING CALL BUTTON ──────────────────────────────── */
  function initFloatingCall() {
    var callLink = document.getElementById('call-float-link');
    if (!callLink) return;
    callLink.setAttribute('href', CALL_LINK);
  }

  /* ── MOBILE MENU TOGGLE ────────────────────────────────── */
  function initMobileMenu() {
    var hamburger  = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* ── HEADER SCROLL EFFECT ──────────────────────────────── */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── SCROLL ANIMATIONS ─────────────────────────────────── */
  function initScrollAnimations() {
    var els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── CONTACT FORM → WHATSAPP ───────────────────────────── */
  function initContactForm() {
    var form      = document.getElementById('contact-form');
    var successEl = document.getElementById('form-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = (form.querySelector('#name')    || {}).value || '';
      var phone   = (form.querySelector('#phone')   || {}).value || '';
      var type    = (form.querySelector('#type')    || {}).value || '';
      var message = (form.querySelector('#message') || {}).value || '';

      if (!name.trim())  { showFieldError(form.querySelector('#name'),  'Please enter your full name.'); return; }
      if (!phone.trim()) { showFieldError(form.querySelector('#phone'), 'Please enter your phone number.'); return; }

      var waMsg =
        'Hello! I contacted you from your website.\n\n' +
        '*Name:* '    + name.trim()  + '\n' +
        '*Phone:* '   + phone.trim() + '\n' +
        (type          ? '*Enquiry:* ' + type          + '\n' : '') +
        (message.trim() ? '*Message:* ' + message.trim() + '\n' : '') +
        '\nPlease guide me. Thank you!';

      if (successEl) {
        form.style.display      = 'none';
        successEl.style.display = 'block';
      }

      setTimeout(function () {
        window.open(buildWaUrl(waMsg), '_blank', 'noopener,noreferrer');
      }, 350);
    });

    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () { clearFieldError(input); });
    });
  }

  /* ── CONTACT FORM RESET (back-forward cache) ───────────── */
  function resetContactForm() {
    var form      = document.getElementById('contact-form');
    var successEl = document.getElementById('form-success');
    if (!form) return;

    /* Show form, hide success */
    form.style.display           = '';
    if (successEl) successEl.style.display = 'none';

    /* Clear all field values */
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.value = '';
      clearFieldError(field);
    });

    /* Reset select back to disabled placeholder option */
    var select = form.querySelector('select');
    if (select) select.selectedIndex = 0;
  }

  /* pageshow fires on page load AND when restored from back-forward cache */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      /* Page restored from bfcache — reset form to clean state */
      resetContactForm();
    }
  });

  function showFieldError(field, message) {
    if (!field) return;
    clearFieldError(field);
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow   = '0 0 0 3px rgba(231,76,60,0.15)';
    var err = document.createElement('span');
    err.className  = 'field-error';
    err.style.cssText = 'display:block;color:#e74c3c;font-size:0.76rem;margin-top:0.3rem;';
    err.textContent = message;
    field.parentNode.appendChild(err);
    field.focus();
  }

  function clearFieldError(field) {
    if (!field) return;
    field.style.borderColor = '';
    field.style.boxShadow   = '';
    var prev = field.parentNode.querySelector('.field-error');
    if (prev) prev.remove();
  }

  /* ── SMOOTH SCROLL ─────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = anchor.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var hH  = (document.querySelector('.site-header') || {}).offsetHeight || 0;
        var top = target.getBoundingClientRect().top + window.scrollY - hH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── COUNTER ANIMATION ─────────────────────────────────── */
  function initCounters() {
    var counters = document.querySelectorAll('.hero-stat-num, .about-stat-num');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el     = entry.target;
        var raw    = el.textContent.trim();
        var suffix = raw.replace(/[0-9]/g, '');
        var num    = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        if (isNaN(num)) return;
        observer.unobserve(el);

        var duration  = 1400;
        var startTime = null;

        (function step(ts) {
          if (!startTime) startTime = ts;
          var prog  = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - prog, 3);
          el.textContent = Math.floor(eased * num) + suffix;
          if (prog < 1) requestAnimationFrame(step);
          else el.textContent = num + suffix;
        })(performance.now());
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ── TESTIMONIAL HIGHLIGHT ROTATION ───────────────────── */
  /* Cycles a .featured class across testimonial cards every 3s
     to draw attention to reviews one at a time. */
  function initTestimonials() {
    var cards = document.querySelectorAll('.testimonial-card');
    if (cards.length < 2) return;

    var current = 0;

    function highlight() {
      cards.forEach(function (c) { c.classList.remove('featured'); });
      cards[current].classList.add('featured');
      current = (current + 1) % cards.length;
    }

    highlight(); /* start immediately */
    setInterval(highlight, 3200);
  }

  /* ── COPYRIGHT YEAR AUTO-UPDATE ────────────────────────── */
  /* Targets all elements with class .copyright-year and sets
     their text to the current year. Runs in init(). */
  function initCopyrightYear() {
    var year = new Date().getFullYear().toString();
    document.querySelectorAll('.copyright-year').forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ── SCROLL INDICATOR CLICK ────────────────────────────── */
  function initScrollIndicator() {
    var indicator = document.querySelector('.hero-scroll');
    if (!indicator) return;
    indicator.addEventListener('click', function () {
      var servicesEl = document.getElementById('services');
      if (!servicesEl) return;
      var hH  = (document.querySelector('.site-header') || {}).offsetHeight || 0;
      var top = servicesEl.getBoundingClientRect().top + window.scrollY - hH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ── INIT ───────────────────────────────────────────────── */
  function init() {
    initWaLinks();
    initCallLinks();
    initFloatingWa();
    initFloatingCall();
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
    initCounters();
    initTestimonials();
    initCopyrightYear();
    initScrollIndicator();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
