/* ══════════════════════════════════════════════
   BLUR-UP — photos fade + sharpen in as they load
══════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.classList.add('blur-up');
    // Already finished (cached success OR already errored) → reveal instantly,
    // so a broken image is never left permanently hidden.
    if (img.complete) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load',  () => img.classList.add('is-loaded'), { once: true });
      // On error, still clear the blur so a broken image isn't left invisible.
      img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
    }
  });
})();

/* ══════════════════════════════════════════════
   NAVBAR — Smart Scroll
══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;
// Inner pages have no hero — navbar must stay solid (dark) even at the top.
const solidNav = document.body.classList.contains('page--inner');

function updateNavbar() {
  if (document.body.style.position === 'fixed') return;

  const currentScrollY = window.scrollY;

  if (currentScrollY === 0) {
    navbar.className = solidNav
      ? 'navbar navbar--dark navbar--visible'
      : 'navbar navbar--transparent navbar--visible';
  } else if (currentScrollY < lastScrollY) {
    navbar.className = 'navbar navbar--dark navbar--visible';
  } else {
    navbar.className = 'navbar navbar--dark navbar--hidden';
  }

  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ══════════════════════════════════════════════
   HAMBURGER / DRAWER
══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('drawer');
const drawerCloseBtn = document.getElementById('drawerClose');
let drawerScrollY = 0;

function preventScroll(e) {
  if (!drawer.contains(e.target)) e.preventDefault();
}

function openDrawer() {
  drawerScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${drawerScrollY}px`;
  document.body.style.width = '100%';
  document.addEventListener('touchmove', preventScroll, { passive: false });
  drawer.classList.add('open');
  hamburger.classList.add('open');
}

function closeDrawer() {
  document.removeEventListener('touchmove', preventScroll);
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo({ top: drawerScrollY, behavior: 'instant' });
  drawer.classList.remove('open');
  hamburger.classList.remove('open');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
}

if (drawerCloseBtn) {
  drawerCloseBtn.addEventListener('click', closeDrawer);
}

drawer.querySelectorAll('.drawer__link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

/* ══════════════════════════════════════════════
   CAMPUS MAP TAB
══════════════════════════════════════════════ */
const MAPS = {
  mimi: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.7554635249385!2d121.58028871161693!3d25.076276077696267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ac881fb21bc5%3A0xff9ef32ce884855b!2z6Ie65YyX5biC56eB56uL5ZKq5ZKq6JKZ54m55qKt5Yip5bm85YWS5ZyS44CK5o6o6Jam5bm85YWS5ZyS44CL5YWn5rmW5Y2A5YSq6LOq5bm85YWS5ZyS772c5bCI5qWt5bm85YWS5ZyS772c6ZuZ6Kqe5bm85YWS5ZyS772c5bCP54-t5Yi25bm85YWS5ZyS772c6JKZ54m55qKt5Yip5pWZ5a24772c6KmV5YO56auY5bm85YWS5ZyS!5e0!3m2!1szh-TW!2stw!4v1779441008810!5m2!1szh-TW!2stw',
  casa: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.5231132257154!2d121.59732271161732!3d25.084147677691274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442acec9eda1d77%3A0x2004eb433bb086d4!2z56eB56uL5a6255Sw6JKZ54m55qKt5Yip5bm85YWS5ZyS44CK5o6o6Jam5bm85YWS5ZyS44CL5YWn5rmW5Y2A6JKZ54m55qKt5Yip5pWZ5a24772c6ZuZ6Kqe5bm85YWS5ZyS772c5bCI5qWt5bm85YWS5ZyS772c5bCP54-t5Yi2772c5bm85YWS576O6Kqe6Kqy56iL772c5YSq6LOq5bm85YWS5ZyS!5e0!3m2!1szh-TW!2stw!4v1779440914491!5m2!1szh-TW!2stw'
};

function switchCampus(campus) {
  const iframe = document.getElementById('map-iframe');
  if (iframe) iframe.src = MAPS[campus] || '';

  document.querySelectorAll('.campus-info').forEach(el => {
    el.classList.toggle('campus-info--active', el.dataset.campus === campus);
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('tab--active', tab.dataset.campus === campus);
  });
}

window.switchCampus = switchCampus;

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function showToast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ══════════════════════════════════════════════
   BOOKING DIALOG
   通知信箱：1354ark@gmail.com（由 GAS 負責寄送）
══════════════════════════════════════════════ */
const GAS_URLS = {
  '咪咪幼兒園': 'https://script.google.com/macros/s/AKfycbxXYqsZmUg-i9e-fa3nFHEhWFyeBlqFxDnW3J-DDaXXbbs4kvQ9TncqIWWDE5itMYxB/exec',
  '家田幼兒園': 'https://script.google.com/macros/s/AKfycbw3hlDkz6-NzQiWu7121nrgnl5Sqv31LFOIf33_1K8RGiY2mlUTpQHRPEOxKvsLKNqIMA/exec',
};

const bookingDialog  = document.getElementById('booking-dialog');
const dialogCloseBtn = document.getElementById('dialogClose');
const bookingForm    = document.getElementById('booking-form');
let bookingScrollY = 0;

function preventDialogScroll(e) {
  if (!bookingDialog.contains(e.target)) e.preventDefault();
}

function openBookingDialog() {
  bookingScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${bookingScrollY}px`;
  document.body.style.width = '100%';
  document.addEventListener('touchmove', preventDialogScroll, { passive: false });
  bookingDialog.showModal();
}

function closeBookingDialog() {
  function finish() {
    document.removeEventListener('touchmove', preventDialogScroll);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: bookingScrollY, behavior: 'instant' });
    bookingDialog.close();
    bookingForm.reset();
    document.getElementById('field-birthday')?.classList.add('date--empty');
    if (phoneInput) phoneInput.placeholder = '請輸入手機或市話';
    bookingForm.querySelectorAll('.field--error').forEach(el => el.classList.remove('field--error'));
    bookingForm.querySelectorAll('.form-error').forEach(el => { el.hidden = true; });
  }

  if (window.matchMedia('(max-width: 767px)').matches) {
    bookingDialog.classList.add('is-closing');
    bookingDialog.addEventListener('animationend', () => {
      bookingDialog.classList.remove('is-closing');
      finish();
    }, { once: true });
  } else {
    finish();
  }
}

dialogCloseBtn.addEventListener('click', closeBookingDialog);

bookingDialog.addEventListener('click', (e) => {
  if (e.target === bookingDialog) closeBookingDialog();
});

document.querySelectorAll('[data-open-booking]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (drawer.contains(btn)) closeDrawer();
    openBookingDialog();
  });
});

// Birthday date range
(function () {
  const today   = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 6);
  const input = document.getElementById('field-birthday');
  if (!input) return;
  input.max = today.toISOString().split('T')[0];
  input.min = minDate.toISOString().split('T')[0];
  input.addEventListener('change', () => {
    input.classList.toggle('date--empty', !input.value);
  });
  input.classList.add('date--empty');
})();

// Date field — click anywhere to open picker
(function () {
  const dateField = document.querySelector('.field--date');
  const dateInput = document.getElementById('field-birthday');
  if (!dateField || !dateInput) return;
  dateField.addEventListener('click', () => {
    try { dateInput.showPicker(); } catch (_) {}
  });
})();

// Enroll year options
(function () {
  const yearSelect = document.getElementById('field-enroll-year');
  if (!yearSelect) return;
  const current = new Date().getFullYear();
  for (let y = current; y <= current + 4; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
})();

// Select placeholder colour
document.querySelectorAll('.field--select select').forEach(sel => {
  const sync = () => sel.classList.toggle('select--empty', sel.value === '');
  sync();
  sel.addEventListener('change', sync);
});

// Phone auto-format + character limit
const phoneInput = document.getElementById('field-phone');
if (phoneInput) {
  phoneInput.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertText' && e.data && !/^\d+$/.test(e.data)) {
      e.preventDefault();
    }
  });

  phoneInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    const digits = pasted.replace(/\D/g, '');
    const s = phoneInput.selectionStart, end = phoneInput.selectionEnd;
    phoneInput.value = phoneInput.value.slice(0, s) + digits + phoneInput.value.slice(end);
    phoneInput.dispatchEvent(new Event('input'));
  });

  phoneInput.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '');

    if (digits.startsWith('09')) {
      // Mobile: 09XX-XXX-XXX (10 digits)
      const d = digits.slice(0, 10);
      let fmt = d;
      if (d.length > 7)      fmt = d.slice(0, 4) + '-' + d.slice(4, 7) + '-' + d.slice(7);
      else if (d.length > 4) fmt = d.slice(0, 4) + '-' + d.slice(4);
      e.target.value       = fmt;
      e.target.placeholder = '09XX-XXX-XXX';
    } else if (digits.startsWith('0')) {
      // Landline: (0X) XXXX-XXXX (10 digits)
      const d = digits.slice(0, 10);
      let fmt = d;
      if (d.length > 6)      fmt = '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      else if (d.length > 2) fmt = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      e.target.value       = fmt;
      e.target.placeholder = '(0X) XXXX-XXXX';
    } else {
      e.target.value       = digits.slice(0, 10);
      e.target.placeholder = '請輸入手機或市話';
    }
  });
}

// Clear error on input/change
function clearFieldError(target) {
  const wrap = target.closest('.form-field-wrap');
  if (wrap) {
    wrap.querySelector('.field')?.classList.remove('field--error');
    const err = wrap.querySelector('.form-error');
    if (err) err.hidden = true;
  }
}
bookingForm.addEventListener('input',  (e) => clearFieldError(e.target));
bookingForm.addEventListener('change', (e) => clearFieldError(e.target));

// Submit
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let valid = true;
  bookingForm.querySelectorAll('[required]').forEach(field => {
    const wrap    = field.closest('.form-field-wrap');
    const fieldEl = field.closest('.field');
    const err     = wrap?.querySelector('.form-error');
    const empty   = field.value.trim() === '';

    if (empty) {
      fieldEl?.classList.add('field--error');
      if (err) { err.hidden = false; err.textContent = '此欄位為必填'; }
      valid = false;
    } else if (field === phoneInput) {
      const digits = field.value.replace(/\D/g, '');
      if (digits.length < 10) {
        fieldEl?.classList.add('field--error');
        if (err) { err.hidden = false; err.textContent = '請輸入有效的電話號碼，市話需加區碼'; }
        valid = false;
      } else {
        fieldEl?.classList.remove('field--error');
        if (err) err.hidden = true;
      }
    } else {
      fieldEl?.classList.remove('field--error');
      if (err) err.hidden = true;
    }
  });
  if (!valid) return;

  const submitBtn = bookingForm.querySelector('.booking-form__submit');
  submitBtn.disabled    = true;
  submitBtn.textContent = '送出中…';

  const campus = bookingForm.school.value;
  const payload = {
    timestamp:   new Date().toLocaleString('zh-TW'),
    childName:   bookingForm.childName.value,
    birthday:    bookingForm.birthday.value,
    gender:      bookingForm.gender.value,
    campus,
    enrollYear:  bookingForm.enrollYear.value,
    enrollMonth: bookingForm.enrollMonth.value,
    parentName:  bookingForm.parentName.value,
    phone:       bookingForm.phone.value,
  };

  const gasUrl = GAS_URLS[campus] ?? GAS_URLS['咪咪幼兒園'];
  try {
    await fetch(gasUrl, { method: 'POST', body: JSON.stringify(payload), mode: 'no-cors' });
    closeBookingDialog();
    showToast('預約參觀表單送出成功');
  } catch {
    submitBtn.disabled    = false;
    submitBtn.textContent = '確定送出';
    alert('送出失敗，請稍後再試。');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = '確定送出';
  }
});

/* ══════════════════════════════════════════════
   CUSTOM SELECT
══════════════════════════════════════════════ */
(function () {
  let panel = null;
  let activeField = null;

  function closePanel() {
    if (panel) { panel.remove(); panel = null; }
    activeField = null;
  }

  document.addEventListener('click', (e) => {
    if (panel && !panel.contains(e.target) && !activeField?.contains(e.target)) {
      closePanel();
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
  bookingDialog.addEventListener('scroll', closePanel);

  function openPanel(fieldEl) {
    closePanel();
    activeField = fieldEl;
    const sel = fieldEl.querySelector('select');

    panel = document.createElement('ul');
    panel.className = 'csp';
    panel.style.visibility = 'hidden';

    Array.from(sel.options).forEach(opt => {
      if (opt.disabled) return;
      const li = document.createElement('li');
      li.className = 'csp__option';
      if (opt.value && opt.value === sel.value) li.classList.add('csp__option--active');
      li.textContent = opt.text;
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        sel.value = opt.value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        const label = fieldEl.querySelector('.custom-select__label');
        if (label) {
          label.textContent = opt.text;
          label.classList.toggle('select--empty', !opt.value);
        }
        clearFieldError(fieldEl);
        closePanel();
      });
      panel.appendChild(li);
    });

    bookingDialog.appendChild(panel);

    const rect   = fieldEl.getBoundingClientRect();
    const panelH = panel.offsetHeight;
    panel.style.width = rect.width + 'px';
    panel.style.left  = rect.left + 'px';
    panel.style.top   = (window.innerHeight - rect.bottom >= panelH + 8)
      ? (rect.bottom + 4) + 'px'
      : Math.max(4, rect.top - panelH - 4) + 'px';
    panel.style.visibility = '';
  }

  bookingForm.querySelectorAll('.field--custom-select').forEach(fieldEl => {
    fieldEl.addEventListener('click', (e) => {
      if (panel && activeField === fieldEl) { closePanel(); } else { openPanel(fieldEl); }
    });
  });

  // Reset labels when form resets after successful submit
  bookingForm.addEventListener('reset', () => {
    bookingForm.querySelectorAll('.field--custom-select').forEach(fieldEl => {
      const label = fieldEl.querySelector('.custom-select__label');
      const sel   = fieldEl.querySelector('select');
      if (label && sel) {
        label.textContent = sel.options[0]?.text || '';
        label.classList.add('select--empty');
      }
    });
  });
})();

/* ══════════════════════════════════════════════
   TEAM ROSTER + DRAWER (about page)
══════════════════════════════════════════════ */
(function () {
  const teamSection = document.getElementById('team');
  const teamDrawer  = document.getElementById('teamDrawer');
  if (!teamSection || !teamDrawer) return;

  // Tab switching (咪咪 / 家田)
  function switchTeam(campus) {
    teamSection.querySelectorAll('.team__list').forEach(list => {
      list.classList.toggle('is-active', list.dataset.campus === campus);
    });
    teamSection.querySelectorAll('.team__tabs .tab').forEach(tab => {
      tab.classList.toggle('tab--active', tab.dataset.campus === campus);
    });
  }
  teamSection.querySelectorAll('.team__tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => switchTeam(tab.dataset.campus));
  });

  // Drawer
  const bodyEl   = teamDrawer.querySelector('.team-drawer__body');
  const campusEl = teamDrawer.querySelector('.team-drawer__campus');
  const nameEl   = teamDrawer.querySelector('.team-drawer__name');
  const titleEl  = teamDrawer.querySelector('.team-drawer__title');
  const roleEl   = teamDrawer.querySelector('.team-drawer__role');
  const bioEl    = teamDrawer.querySelector('.team-drawer__bio');
  const CAMPUS_NAMES = { mimi: '咪咪幼兒園', casa: '家田幼兒園' };
  let teamScrollY = 0;

  function openTeamDrawer(trigger) {
    const member = trigger.closest('.member');
    const campus = trigger.closest('.team__list')?.dataset.campus;
    campusEl.textContent = CAMPUS_NAMES[campus] || '';
    nameEl.textContent  = trigger.querySelector('.member__name')?.textContent.trim() || '';
    titleEl.textContent = trigger.querySelector('.member__title')?.textContent.trim() || '';
    roleEl.textContent  = trigger.querySelector('.member__role')?.textContent.trim() || '';
    bioEl.innerHTML = '';
    const tpl = member?.querySelector('.member__bio');
    if (tpl) bioEl.appendChild(tpl.content.cloneNode(true));

    teamScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${teamScrollY}px`;
    document.body.style.width = '100%';
    teamDrawer.classList.add('is-open');
    teamDrawer.setAttribute('aria-hidden', 'false');
    bodyEl.scrollTop = 0;
  }

  function closeTeamDrawer() {
    if (!teamDrawer.classList.contains('is-open')) return;
    teamDrawer.classList.remove('is-open');
    teamDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: teamScrollY, behavior: 'instant' });
  }

  teamSection.querySelectorAll('.member__trigger').forEach(btn => {
    btn.addEventListener('click', () => openTeamDrawer(btn));
  });
  teamDrawer.querySelectorAll('[data-drawer-close]').forEach(el => {
    el.addEventListener('click', closeTeamDrawer);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTeamDrawer();
  });
})();

/* ══════════════════════════════════════════════
   LIGHTBOX (features page)
══════════════════════════════════════════════ */
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const imgEl   = document.getElementById('lightboxImg');
  const curEl   = document.getElementById('lbCurrent');
  const totalEl = document.getElementById('lbTotal');
  const dotsEl  = document.getElementById('lightboxDots');
  const prevBtn = lb.querySelector('[data-lb-prev]');
  const nextBtn = lb.querySelector('[data-lb-next]');
  let gallery = [];
  let idx = 0;
  let lbScrollY = 0;

  function render() {
    const item = gallery[idx];
    if (!item) return;
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    curEl.textContent = idx + 1;
    totalEl.textContent = gallery.length;
    dotsEl.querySelectorAll('.lightbox__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
    });
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === gallery.length - 1;
  }

  function openLightbox(items, start) {
    gallery = items;
    idx = start;
    dotsEl.innerHTML = '';
    items.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lightbox__dot';
      b.setAttribute('aria-label', `第 ${i + 1} 張`);
      b.addEventListener('click', () => { idx = i; render(); });
      dotsEl.appendChild(b);
    });
    lb.classList.toggle('lightbox--single', items.length <= 1);

    lbScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lbScrollY}px`;
    document.body.style.width = '100%';
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    render();
  }

  function closeLightbox() {
    if (!lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: lbScrollY, behavior: 'instant' });
  }

  function prev() { if (idx > 0) { idx--; render(); } }
  function next() { if (idx < gallery.length - 1) { idx++; render(); } }

  // Each feature media is its own gallery
  document.querySelectorAll('.feature__media').forEach(media => {
    const pics  = [...media.querySelectorAll('.feature__pic')];
    const items = pics.map(p => ({
      src: p.dataset.lbSrc,
      alt: p.querySelector('img')?.alt || '',
    }));
    pics.forEach((p, i) => p.addEventListener('click', () => openLightbox(items, i)));
  });

  lb.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', closeLightbox));
  lb.querySelector('[data-lb-prev]')?.addEventListener('click', prev);
  lb.querySelector('[data-lb-next]')?.addEventListener('click', next);
  // Click anywhere that isn't the image or a control closes the lightbox
  lb.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox__img, .lightbox__nav, .lightbox__dot')) return;
    closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });

  // Swipe (touch) — ignore multi-touch gestures (pinch-zoom) so they don't
  // get mistaken for a swipe and jump to another image.
  let startX = 0;
  let pinching = false;
  lb.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) { pinching = true; return; }
    pinching = false;
    startX = e.changedTouches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) pinching = true;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    // Skip if this was a pinch, or if fingers are still on screen (mid-pinch).
    if (pinching || e.touches.length > 0) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40 && gallery.length > 1) { dx > 0 ? prev() : next(); }
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   CAMPUS — 校區切換（咪咪 / 家田）
══════════════════════════════════════════════ */
(function () {
  const panels = [...document.querySelectorAll('.campus-school')];
  if (!panels.length) return;
  const tabs = [...document.querySelectorAll('.campus-tabs .tab')];

  function show(school) {
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.school === school));
    tabs.forEach(t => {
      const active = t.dataset.school === school;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.school)));
})();

/* ══════════════════════════════════════════════
   FEATURE NAV / TOC — 目錄 + scroll-spy
══════════════════════════════════════════════ */
(function () {
  const sections = [...document.querySelectorAll('.feature[id]')];
  if (!sections.length) return;
  const links = [...document.querySelectorAll('[data-toc]')];

  // Scroll-spy: the active section is the last one whose top has passed the
  // 40%-viewport line. Deterministic (one active at a time) and robust against
  // lazy-loaded images shifting layout.
  function updateActiveLink() {
    const line = window.innerHeight * 0.4;
    let activeId = sections[0].id;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= line) activeId = s.id;
    }
    links.forEach(l => l.classList.toggle('is-active', l.dataset.toc === activeId));
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();

  const navbarEl   = document.getElementById('navbar');
  const featureNav = document.querySelector('.feature-nav');
  const mq = window.matchMedia('(min-width: 1280px)');

  // Desktop anchor bar: stays visible; slides to top when navbar hides,
  // back under the navbar when it reappears.
  if (navbarEl && featureNav) {
    const syncFeatureNav = () => {
      if (mq.matches) {
        const navH = navbarEl.offsetHeight;
        featureNav.style.setProperty('--nav-h', navH + 'px');
        document.body.style.paddingTop = (navH + featureNav.offsetHeight) + 'px';
        document.documentElement.style.setProperty('--anchor-h', featureNav.offsetHeight + 'px');
        featureNav.classList.toggle('is-top', navbarEl.classList.contains('navbar--hidden'));
      } else {
        document.body.style.paddingTop = '';
        featureNav.classList.remove('is-top');
        featureNav.style.removeProperty('--nav-h');
        document.documentElement.style.removeProperty('--anchor-h');
      }
    };
    window.addEventListener('scroll', syncFeatureNav, { passive: true });
    window.addEventListener('resize', syncFeatureNav);
    syncFeatureNav();
  }

  // Direction-aware anchor scroll:
  //   scroll down → navbar hides, only the anchor bar occludes the top
  //   scroll up   → navbar reappears, so navbar + anchor bar both occlude
  function scrollToFeature(id, fromY, behavior) {
    const el = document.getElementById(id);
    if (!el) return;
    const desktop = mq.matches;
    // Desktop (2-col) lands at the section top — title is already beside the
    // image. Tablet/mobile (stacked, image on top) land on the title so the
    // user sees the heading and feels they arrived at the right place.
    const target = desktop ? el : (el.querySelector('.feature__head') || el);
    // Absolute document position — independent of current (maybe not-yet-
    // restored) scroll. Direction is judged against fromY when provided.
    const absTop   = target.getBoundingClientRect().top + window.scrollY;
    const ref      = (fromY == null) ? window.scrollY : fromY;
    const goingUp  = absTop < ref;
    const navH     = navbarEl ? navbarEl.offsetHeight : 0;
    const anchorH  = (desktop && featureNav) ? featureNav.offsetHeight : 0;
    const gap      = desktop ? 0 : 24;   // breathing room above the title
    const offset   = (goingUp ? (navH + anchorH) : anchorH) + gap;
    const top = Math.max(0, absTop - offset);
    window.scrollTo({ top, behavior: behavior || 'smooth' });

    // Drive navbar / anchor-bar explicitly — mobile smooth-scroll fires scroll
    // events unreliably, so don't depend on the scroll handler here.
    if (navbarEl) {
      navbarEl.className = goingUp
        ? 'navbar navbar--dark navbar--visible'
        : 'navbar navbar--dark navbar--hidden';
    }
    if (mq.matches && featureNav) {
      featureNav.classList.toggle('is-top', !goingUp);
    }
  }

  // Desktop anchor bar links
  document.querySelectorAll('.feature-nav__link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToFeature(a.getAttribute('href').slice(1));
    });
  });

  // Cross-page landing (e.g. homepage feature cards → features.html#feature-N):
  // re-position under the navbar/anchor bar once layout has settled.
  if (location.hash) {
    const hashId = location.hash.slice(1);
    const hashTarget = document.getElementById(hashId);
    if (hashTarget && hashTarget.classList.contains('feature')) {
      window.addEventListener('load', () => {
        requestAnimationFrame(() => scrollToFeature(hashId, 0, 'auto'));
      });
    }
  }

  // Mobile/tablet floating 目錄 button → bottom-sheet
  const toggle = document.getElementById('featureTocToggle');
  const sheet  = document.getElementById('tocSheet');
  if (!toggle || !sheet) return;
  let tocScrollY = 0;

  function openSheet() {
    tocScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${tocScrollY}px`;
    document.body.style.width = '100%';
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeSheet() {
    if (!sheet.classList.contains('is-open')) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: tocScrollY, behavior: 'instant' });
  }

  toggle.addEventListener('click', openSheet);
  sheet.querySelectorAll('[data-toc-close]').forEach(el => el.addEventListener('click', closeSheet));
  // Anchor links: unlock scroll first, then scroll with the right offset
  sheet.querySelectorAll('.toc-sheet__list a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const fromY = tocScrollY;   // where we were before the sheet opened
      closeSheet();
      // Instant jump: the position:fixed scroll-lock resets the page to the top
      // on unlock, so a smooth scroll would animate downward from there. Jumping
      // instantly avoids any wrong-direction feel.
      scrollToFeature(id, fromY, 'instant');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });
})();
