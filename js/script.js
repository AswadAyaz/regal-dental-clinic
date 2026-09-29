/* =========================================================
   Regal Dental Clinic by Dental Solutions — script.js
   Vanilla JS only. Edit the CLINIC object to change contact info.
   ========================================================= */

var CLINIC = {
  name: 'Regal Dental Clinic by Dental Solutions',
  // WhatsApp needs international format: 0345 9477068 -> 92 345 9477068
  whatsapp: '923459477068',

  // ---- Appointment form delivery -------------------------------------
  // OPTION A (email): get a free key at https://web3forms.com (use the
  // clinic's email), paste it below. The form will then send real emails.
  // OPTION B (default): leave the key empty. The form opens WhatsApp with
  // the inquiry pre-filled instead. Nothing is sent until the visitor
  // presses Send inside WhatsApp.
  web3formsKey: '',
};

document.addEventListener('DOMContentLoaded', function () {
  window.__ready = true; // tells the page's safety timer that scripts loaded

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  var overlay = document.getElementById('navOverlay');

  function setNav(open) {
    if (!toggle || !menu) return;
    toggle.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setNav(!menu.classList.contains('open'));
    });
  }
  if (overlay) overlay.addEventListener('click', function () { setNav(false); });
  document.querySelectorAll('#navMenu a').forEach(function (a) {
    a.addEventListener('click', function () { setNav(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setNav(false); closeLightbox(); }
  });

  /* ---------- Active nav link (matches current page) ---------- */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
    if (link.getAttribute('data-page') === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Header shadow + back-to-top ---------- */
  var header = document.querySelector('.floating-nav');
  var topBtn = document.querySelector('.fab-top');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Scroll reveal (staggered for card grids) ---------- */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  var STAGGER_MS = 90;

  // When a card has finished its entrance, drop the stagger delay so hover
  // lift responds instantly instead of waiting on the entrance delay.
  function settle(el, delay) {
    if (!el.classList.contains('service-card')) return;
    window.setTimeout(function () {
      el.style.transitionDelay = '';
      el.classList.add('is-done');
    }, delay + 700);
  }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); el.classList.add('is-done'); });
  } else {
    document.querySelectorAll('.services-grid, .process-grid').forEach(function (grid) {
      grid.querySelectorAll('.service-card').forEach(function (card, i) {
        card.style.transitionDelay = (i % 6) * STAGGER_MS + 'ms';
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var delay = parseInt(el.style.transitionDelay, 10) || 0;
        el.classList.add('is-visible');
        settle(el, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var was = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!was) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lb = document.querySelector('.lightbox');
  var lbImg = lb ? lb.querySelector('img') : null;
  var lbCap = lb ? lb.querySelector('.lightbox-cap') : null;

  function openLightbox(src, alt) {
    if (!lb) return;
    lbImg.src = src; lbImg.alt = alt || '';
    if (lbCap) lbCap.textContent = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lb || !lb.classList.contains('open')) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-lightbox]').forEach(function (el) {
    el.addEventListener('click', function () {
      var img = el.querySelector('img');
      if (img) openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
    });
  });
  if (lb) {
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox-close')) closeLightbox(); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Service-specific WhatsApp buttons ---------- */
  document.querySelectorAll('[data-wa-service]').forEach(function (a) {
    var svc = a.getAttribute('data-wa-service');
    var msg = 'Assalam-o-Alaikum, I would like to inquire about ' + svc + ' at ' + CLINIC.name + '.';
    a.href = 'https://wa.me/' + CLINIC.whatsapp + '?text=' + encodeURIComponent(msg);
  });

  /* ---------- Appointment inquiry form ---------- */
  var form = document.getElementById('inquiry-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var modeNote = document.getElementById('form-mode-note');
  var dateInput = form.querySelector('#date');
  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  var emailMode = !!CLINIC.web3formsKey;
  if (modeNote) {
    modeNote.textContent = emailMode
      ? 'Your inquiry will be emailed to the clinic. The clinic will contact you to confirm a time.'
      : 'This will open WhatsApp with your inquiry ready to send to the clinic.';
  }

  function showStatus(text, isError) {
    status.textContent = text;
    status.classList.add('show');
    status.classList.toggle('error', !!isError);
  }

  function setInvalid(id, bad) {
    var f = form.querySelector('#' + id);
    if (f && f.closest('.field')) f.closest('.field').classList.toggle('invalid', bad);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.classList.remove('show');

    var name = form.querySelector('#name').value.trim();
    var phone = form.querySelector('#phone').value.trim();
    var date = form.querySelector('#date').value;
    var message = form.querySelector('#message').value.trim();

    var okName = name.length >= 2;
    var okPhone = phone.replace(/\D/g, '').length >= 10;
    setInvalid('name', !okName);
    setInvalid('phone', !okPhone);
    if (!okName || !okPhone) return;

    var lines = [
      'Assalam-o-Alaikum, I would like to inquire about an appointment at ' + CLINIC.name + '.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
    ];
    if (date) lines.push('Preferred date: ' + date);
    if (message) lines.push('Message: ' + message);

    if (emailMode) {
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CLINIC.web3formsKey,
          subject: 'New appointment inquiry — ' + CLINIC.name,
          name: name, phone: phone, preferred_date: date || 'Not specified', message: message || 'None',
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            showStatus('Thank you. Your inquiry was sent. This is not a confirmed appointment; the clinic will contact you.', false);
          } else {
            showStatus('Something went wrong sending your inquiry. Please call or WhatsApp the clinic instead.', true);
          }
        })
        .catch(function () {
          showStatus('Could not send your inquiry. Please call or WhatsApp the clinic instead.', true);
        })
        .finally(function () { btn.disabled = false; });
    } else {
      var url = 'https://wa.me/' + CLINIC.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      showStatus('Opening WhatsApp. Press Send there to submit your inquiry. This is not a confirmed appointment.', false);
      window.open(url, '_blank', 'noopener');
    }
  });

  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      var f = el.closest('.field');
      if (f) f.classList.remove('invalid');
    });
  });
});
