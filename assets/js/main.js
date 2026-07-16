/* ══════════════════════════════════════════════
   I18N — runtime copy follows the page's <html lang>
   (HTML is per-language; JS is shared, so pick strings here)
══════════════════════════════════════════════ */
const MC_LANG = (document.documentElement.lang || 'zh').toLowerCase().startsWith('en') ? 'en' : 'zh';
const mcText = (zh, en) => (MC_LANG === 'en' ? en : zh);

/* ══════════════════════════════════════════════
   BLUR-UP — photos fade + sharpen in as they load
══════════════════════════════════════════════ */
(function () {
  const LQIP = window.LQIP || {};
  // Lazy photos + the eager hero background all get the blur-up treatment.
  document.querySelectorAll('img[loading="lazy"], .hero__bg').forEach(img => {
    img.classList.add('blur-up');

    // LQIP: paint a tiny blurred preview behind the image so there's no blank
    // gap before the full photo arrives. Falls back to the container colour.
    // currentSrc resolves the <picture> variant the browser actually picked
    // (the hero serves different files per breakpoint); src covers plain imgs.
    const src = img.currentSrc || img.getAttribute('src') || '';
    const file = src.split('?')[0].split('/').pop();
    const placeholder = LQIP[file];
    // The hero img is absolutely positioned inside a zero-sized <picture>, so
    // the placeholder must live on the .hero section; plain imgs use the parent.
    const holder = img.classList.contains('hero__bg')
      ? img.closest('.hero')
      : img.parentElement;
    if (placeholder && holder) {
      holder.style.setProperty('--lqip', `url("${placeholder}")`);
      holder.classList.add('has-lqip');
    }

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
   SLIDING UNDERLINE — active indicator glides (left/width) between items
   Used by: navbar links, philosophy anchor nav, and the 兩校 tab bars.
══════════════════════════════════════════════ */
const slidingUnderlines = [];

function createUnderline(container, opts, getActive) {
  if (!container) return null;
  const o = opts || {};
  const h = o.height || 2;
  const bar = document.createElement('span');
  bar.className = 'slide-bar';
  bar.style.height = h + 'px';
  bar.style.background = o.color || '#ffffff';
  if (o.radius) bar.style.borderRadius = o.radius;
  container.appendChild(bar);

  function move(el, animate) {
    if (!el) { bar.style.opacity = '0'; return; }
    if (animate === false) bar.style.transition = 'none';
    bar.style.left = el.offsetLeft + 'px';
    bar.style.width = el.offsetWidth + 'px';
    bar.style.top = (el.offsetTop + el.offsetHeight - h + (o.offsetY || 0)) + 'px';
    bar.style.opacity = '1';
    if (animate === false) { void bar.offsetWidth; bar.style.transition = ''; }
  }

  const ctrl = { bar, move, settle: o.settle !== false, reposition: () => move(getActive && getActive(), false) };
  slidingUnderlines.push(ctrl);
  return ctrl;
}

const TAB_UNDERLINE = {
  height: 3,
  color: 'var(--color-action-primary-bg)',
  radius: 'var(--r-pill)',
  offsetY: 1,
};

// Find-or-create the underline for a 兩校 tab bar, then glide it to the active tab.
function updateTabUnderline(container, animate) {
  if (!container) return;
  if (!container._underline) {
    container._underline = createUnderline(
      container, TAB_UNDERLINE, () => container.querySelector('.tab--active')
    );
  }
  container._underline.move(container.querySelector('.tab--active'), animate);
}

// Reposition every underline (no animation) after a layout change.
let _underlineRT;
window.addEventListener('resize', () => {
  clearTimeout(_underlineRT);
  _underlineRT = setTimeout(() => slidingUnderlines.forEach(c => c.reposition()), 120);
});

// Re-settle (no animation) once web fonts / images finish — Chinese text width
// isn't final until the font loads, which would otherwise leave a stale/0 width.
// (navbar opts out via settle:false so its cross-page slide isn't snapped short.)
function settleUnderlines() {
  slidingUnderlines.forEach(c => { if (c.settle) c.reposition(); });
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(settleUnderlines);
window.addEventListener('load', settleUnderlines);

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

/* Calm in-place fade for the newly-active 咪咪 / 家田 content panel. */
function playPanelFade(panel) {
  if (!panel) return;
  panel.classList.remove('tab-fade-in');
  void panel.offsetWidth; // reflow so the animation restarts on every switch
  panel.classList.add('tab-fade-in');
}

function switchCampus(campus) {
  const iframe = document.getElementById('map-iframe');
  if (iframe) iframe.src = MAPS[campus] || '';

  document.querySelectorAll('.campus-info').forEach(el => {
    el.classList.toggle('campus-info--active', el.dataset.campus === campus);
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('tab--active', tab.dataset.campus === campus);
  });

  playPanelFade(document.querySelector('.campus-info--active'));
  updateTabUnderline(document.querySelector('.location__tabs'), true);
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
function showToast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  const icon = document.createElement('img');
  icon.className = 'toast__icon';
  icon.src = `../assets/images/icon-toast-${type === 'fail' ? 'fail' : 'success'}.svg`;
  icon.alt = '';
  icon.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.className = 'toast__text';
  text.textContent = message;
  el.append(icon, text);
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
  restoreBookingDraft();
}

function finishBookingClose() {
  document.removeEventListener('touchmove', preventDialogScroll);
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo({ top: bookingScrollY, behavior: 'instant' });
  bookingDialog.close();
  bookingForm.reset();
  document.getElementById('field-birthday')?.classList.add('date--empty');
  if (phoneInput) phoneInput.placeholder = mcText('請輸入手機或市話', 'Mobile or landline number');
  bookingForm.querySelectorAll('.field--error').forEach(el => el.classList.remove('field--error'));
  bookingForm.querySelectorAll('.form-error').forEach(el => { el.hidden = true; });
}

function closeBookingDialog() {
  if (window.matchMedia('(max-width: 767px)').matches) {
    bookingDialog.classList.add('is-closing');
    bookingDialog.addEventListener('animationend', () => {
      bookingDialog.classList.remove('is-closing');
      finishBookingClose();
    }, { once: true });
  } else {
    finishBookingClose();
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

// Mobile drag-to-dismiss — same feel as the philosophy 目錄 sheet
(function () {
  const dlgBody = bookingDialog.querySelector('.booking-dialog__body');
  let startY = 0, dy = 0, dragging = false, lastY = 0, lastT = 0, vy = 0;

  bookingDialog.addEventListener('touchstart', (e) => {
    if (!bookingDialog.open) return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    const fromGrip = e.target.closest('.booking-dialog__handle, .booking-dialog__header');
    if (!fromGrip && dlgBody && dlgBody.scrollTop > 0) return;   // let the form scroll
    startY = e.touches[0].clientY;
    dy = 0;
    dragging = true;
    lastY = startY; lastT = e.timeStamp; vy = 0;
    bookingDialog.style.transition = 'none';
  }, { passive: true });

  bookingDialog.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const y = e.touches[0].clientY, now = e.timeStamp;
    if (now > lastT) vy = (y - lastY) / (now - lastT);   // px/ms, downward = positive
    lastY = y; lastT = now;
    dy = Math.max(0, y - startY);   // downward only
    if (dy > 0) {
      e.preventDefault();
      bookingDialog.style.transform = `translateY(${dy}px)`;
    }
  }, { passive: false });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    if (dy <= 0) { bookingDialog.style.transition = ''; bookingDialog.style.transform = ''; return; }
    // Only dismiss when pulled (almost) to the bottom or flicked down fast.
    const closing = dy > (bookingDialog.offsetHeight || 0) * 0.9 || vy > 0.6;
    bookingDialog.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
    bookingDialog.addEventListener('transitionend', function te(ev) {
      if (ev.target !== bookingDialog || ev.propertyName !== 'transform') return;
      bookingDialog.removeEventListener('transitionend', te);
      bookingDialog.style.transition = '';
      bookingDialog.style.transform = '';
      if (closing) finishBookingClose();
    });
    bookingDialog.style.transform = closing ? 'translateY(100%)' : 'translateY(0)';
    dy = 0;
  }
  bookingDialog.addEventListener('touchend', endDrag);
  bookingDialog.addEventListener('touchcancel', endDrag);
})();

// Birthday — responsive: native <input type="date"> on phone/tablet (nice wheel
// picker), Year/Month/Day <select>s on desktop (Safari desktop has no year nav).
// Both live in the DOM; CSS shows one per breakpoint. Set up both here.
(function () {
  // Native date input (mobile/tablet): min = 6 years ago, max = today.
  const input = document.getElementById('field-birthday');
  if (input) {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 6);
    input.max = today.toISOString().split('T')[0];
    input.min = minDate.toISOString().split('T')[0];
    input.classList.add('date--empty');
    input.addEventListener('change', () => {
      input.classList.toggle('date--empty', !input.value);
    });
    const field = input.closest('.field--date');
    field?.addEventListener('click', () => { try { input.showPicker(); } catch (_) {} });
  }
  // Year dropdown (desktop): today back through 6 years. Month/Day live in HTML.
  const yearSelect = document.getElementById('field-birth-year');
  if (yearSelect) {
    const current = new Date().getFullYear();
    for (let y = current; y >= current - 6; y--) {
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = String(y);
      yearSelect.appendChild(opt);
    }
  }
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
      e.target.placeholder = mcText('請輸入手機或市話', 'Mobile or landline number');
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
    // Skip only fields whose WRAPPER is hidden at this breakpoint (the birthday
    // has both a native date input and Y/M/D selects in the DOM). Don't test the
    // field's own offsetParent — custom-select <select>s are hidden but active.
    if (wrap && wrap.offsetParent === null) return;
    const fieldEl = field.closest('.field');
    const err     = wrap?.querySelector('.form-error');
    const empty   = field.value.trim() === '';

    if (empty) {
      fieldEl?.classList.add('field--error');
      if (err) { err.hidden = false; err.textContent = mcText('此欄位為必填', 'This field is required'); }
      valid = false;
    } else if (field === phoneInput) {
      const digits     = field.value.replace(/\D/g, '');
      const isMobile   = /^09\d{8}$/.test(digits);          // 09XX-XXX-XXX
      const isLandline = /^0[1-9]\d{7,8}$/.test(digits);    // (0X) area code + 7~8 digits
      const allSame    = /^(\d)\1+$/.test(digits);          // reject 0000000000 etc.
      if (!(isMobile || isLandline) || allSame) {
        fieldEl?.classList.add('field--error');
        if (err) { err.hidden = false; err.textContent = mcText('請輸入有效的電話號碼，市話需加區碼', 'Please enter a valid phone number (include the area code for landlines)'); }
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

  // Enroll year/month must not be earlier than the current month (allow this month onward)
  const eYear  = bookingForm.enrollYear;
  const eMonth = bookingForm.enrollMonth;
  if (eYear.value && eMonth.value) {
    const now   = new Date();
    const selYM = Number(eYear.value) * 100 + Number(eMonth.value);
    const curYM = now.getFullYear() * 100 + (now.getMonth() + 1);
    if (selYM < curYM) {
      const wrap    = eMonth.closest('.form-field-wrap');
      const fieldEl = eMonth.closest('.field');
      const err     = wrap?.querySelector('.form-error');
      fieldEl?.classList.add('field--error');
      if (err) { err.hidden = false; err.textContent = mcText('入學時間不能早於本月', 'Enrollment cannot be earlier than this month'); }
      valid = false;
    }
  }

  // Birthday must be a real calendar date and not in the future
  const isDesktopBday = window.matchMedia('(min-width: 1280px)').matches;
  let bdayStr = '', bdayField = null;
  if (isDesktopBday) {
    const by = bookingForm.birthYear.value, bm = bookingForm.birthMonth.value, bd = bookingForm.birthDay.value;
    if (by && bm && bd) { bdayStr = `${by}-${bm}-${bd}`; bdayField = bookingForm.birthDay; }
  } else if (bookingForm.birthday.value) {
    bdayStr = bookingForm.birthday.value; bdayField = bookingForm.birthday;
  }
  if (bdayStr && bdayField) {
    const [by, bm, bd] = bdayStr.split('-').map(Number);
    const dt = new Date(by, bm - 1, bd);
    const realDate = dt.getFullYear() === by && dt.getMonth() === bm - 1 && dt.getDate() === bd;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!realDate || dt > today) {
      const wrap    = bdayField.closest('.form-field-wrap');
      const fieldEl = bdayField.closest('.field');
      const err     = wrap?.querySelector('.form-error');
      fieldEl?.classList.add('field--error');
      if (err) {
        err.hidden = false;
        err.textContent = mcText('日期無效', 'Invalid date');
      }
      valid = false;
    }
  }

  if (!valid) return;

  const submitBtn = bookingForm.querySelector('.booking-form__submit');
  submitBtn.disabled    = true;
  submitBtn.textContent = mcText('送出中…', 'Submitting…');

  const campus = bookingForm.school.value;
  const payload = {
    timestamp:   new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei', hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }),
    childName:   bookingForm.childName.value,
    birthday:    window.matchMedia('(min-width: 1280px)').matches
      ? `${bookingForm.birthYear.value}-${bookingForm.birthMonth.value}-${bookingForm.birthDay.value}`
      : bookingForm.birthday.value,
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
    if (typeof gtag === 'function') {
      gtag('event', 'booking_submit', {
        event_category: 'booking',
        event_label: '預約參觀表單',
      });
    }
    clearBookingDraft();
    closeBookingDialog();
    showToast(mcText('預約參觀表單送出成功', 'Your visit request was submitted successfully'));
  } catch {
    submitBtn.disabled    = false;
    submitBtn.textContent = mcText('確定送出', 'Submit');
    showToast(mcText('預約參觀表單送出失敗，請再試一次', 'Submission failed. Please try again'), 'fail');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = mcText('確定送出', 'Submit');
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
   BOOKING FORM DRAFT — sessionStorage 暫存
   關閉 modal 不清除；送出成功才清除。
══════════════════════════════════════════════ */
const BOOKING_DRAFT_PREFIX = 'booking_';

// 生日：桌機用 Y/M/D 下拉、手機/平板用 native input，統一存成 YYYY-MM-DD
function bookingDraftReadBirthday() {
  const y = bookingForm.birthYear.value, m = bookingForm.birthMonth.value, d = bookingForm.birthDay.value;
  if (y && m && d) return `${y}-${m}-${d}`;
  return bookingForm.birthday.value || '';
}

// 復原 custom-select：設 value + 同步視覺 label 與 select--empty
function bookingDraftSetSelect(sel, value) {
  if (!sel || value == null || value === '') return;
  const opt = Array.from(sel.options).find(o => o.value === value);
  if (!opt) return;
  sel.value = value;
  const label = sel.closest('.field--custom-select')?.querySelector('.custom-select__label');
  if (label) { label.textContent = opt.text; label.classList.remove('select--empty'); }
  sel.classList.remove('select--empty');
}

function saveBookingDraft() {
  try {
    const set = (k, v) => v
      ? sessionStorage.setItem(BOOKING_DRAFT_PREFIX + k, v)
      : sessionStorage.removeItem(BOOKING_DRAFT_PREFIX + k);
    set('childName',   bookingForm.childName.value);
    set('birthday',    bookingDraftReadBirthday());
    set('gender',      bookingForm.gender.value);
    set('campus',      bookingForm.school.value);
    set('enrollYear',  bookingForm.enrollYear.value);
    set('enrollMonth', bookingForm.enrollMonth.value);
    set('parentName',  bookingForm.parentName.value);
    set('phone',       bookingForm.phone.value);
  } catch (_) {}
}

function restoreBookingDraft() {
  try {
    const get = k => sessionStorage.getItem(BOOKING_DRAFT_PREFIX + k);
    if (get('childName'))  bookingForm.childName.value  = get('childName');
    if (get('parentName')) bookingForm.parentName.value = get('parentName');
    if (get('phone')) {
      bookingForm.phone.value = get('phone');
      bookingForm.phone.dispatchEvent(new Event('input', { bubbles: true }));
    }
    bookingDraftSetSelect(bookingForm.gender,      get('gender'));
    bookingDraftSetSelect(bookingForm.school,      get('campus'));
    bookingDraftSetSelect(bookingForm.enrollYear,  get('enrollYear'));
    bookingDraftSetSelect(bookingForm.enrollMonth, get('enrollMonth'));
    const bday = get('birthday');
    if (bday) {
      const nativeEl = document.getElementById('field-birthday');
      if (nativeEl) { nativeEl.value = bday; nativeEl.classList.remove('date--empty'); }
      const [y, m, d] = bday.split('-');
      bookingDraftSetSelect(bookingForm.birthYear,  y);
      bookingDraftSetSelect(bookingForm.birthMonth, m);
      bookingDraftSetSelect(bookingForm.birthDay,   d);
    }
  } catch (_) {}
}

function clearBookingDraft() {
  try {
    Object.keys(sessionStorage)
      .filter(k => k.startsWith(BOOKING_DRAFT_PREFIX))
      .forEach(k => sessionStorage.removeItem(k));
  } catch (_) {}
}

// 每個欄位 input/change 時暫存（custom-select 會 dispatch 冒泡的 change）
bookingForm.addEventListener('input',  saveBookingDraft);
bookingForm.addEventListener('change', saveBookingDraft);

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
    playPanelFade(teamSection.querySelector('.team__list.is-active'));
    updateTabUnderline(teamSection.querySelector('.team__tabs'), true);
  }
  teamSection.querySelectorAll('.team__tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => switchTeam(tab.dataset.campus));
  });

  // Drawer
  const bodyEl   = teamDrawer.querySelector('.team-drawer__body');
  const campusEl = teamDrawer.querySelector('.team-drawer__campus');
  const nameEl   = teamDrawer.querySelector('.team-drawer__name');
  const titleEl  = teamDrawer.querySelector('.team-drawer__title');
  const bioEl    = teamDrawer.querySelector('.team-drawer__bio');
  const CAMPUS_NAMES = { mimi: mcText('咪咪幼兒園', 'Mimi Montessori'), casa: mcText('家田幼兒園', 'Casa Montessori') };
  let teamScrollY = 0;

  function openTeamDrawer(trigger) {
    const member = trigger.closest('.member');
    const campus = trigger.closest('.team__list')?.dataset.campus;
    campusEl.textContent = CAMPUS_NAMES[campus] || '';
    nameEl.textContent  = trigger.querySelector('.member__name')?.textContent.trim() || '';
    const title = trigger.querySelector('.member__title')?.textContent.trim() || '';
    titleEl.textContent = title;
    // Role-based theme: 執行長/Executive Director (green) / 園長/Principal (brown) / 老師・廚師 (default light)
    teamDrawer.classList.remove('team-drawer--ceo', 'team-drawer--mgmt');
    if (title === '執行長' || title === 'Executive Director') teamDrawer.classList.add('team-drawer--ceo');
    else if (title === '園長' || title === 'Principal') teamDrawer.classList.add('team-drawer--mgmt');
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
      b.setAttribute('aria-label', mcText(`第 ${i + 1} 張`, `Image ${i + 1}`));
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

  // Each media group is its own gallery (feature pics + about page-header pics)
  document.querySelectorAll('.feature__media, .page-header__media').forEach(media => {
    const pics  = [...media.querySelectorAll('.feature__pic, .about-pic')];
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
    const prev = panels.find(p => p.classList.contains('is-active'))?.dataset.school;
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.school === school));
    tabs.forEach(t => {
      const active = t.dataset.school === school;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const activePanel = panels.find(p => p.dataset.school === school);
    if (!activePanel) return;
    playPanelFade(activePanel);

    // Each panel has its own tab bar. Start its underline at the PREVIOUS tab's
    // position, then glide to the new one — so it slides (in step with the panel).
    const tabsC = activePanel.querySelector('.campus-tabs');
    if (!tabsC) return;
    if (!tabsC._underline) {
      tabsC._underline = createUnderline(tabsC, TAB_UNDERLINE, () => tabsC.querySelector('.tab--active'));
    }
    const toTab = tabsC.querySelector('.tab--active');
    const fromTab = prev ? tabsC.querySelector(`.tab[data-school="${prev}"]`) : null;
    if (fromTab && prev !== school) {
      tabsC._underline.move(fromTab, false); // jump to previous tab (forces a reflow internally)
      tabsC._underline.move(toTab, true);    // then glide to the new tab
    } else {
      tabsC._underline.move(toTab, false);
    }
  }

  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.school)));

  // Initial underline under the visible panel's active tab.
  const startPanel = panels.find(p => p.classList.contains('is-active'));
  if (startPanel) updateTabUnderline(startPanel.querySelector('.campus-tabs'), false);
})();

/* ══════════════════════════════════════════════
   FEATURE NAV / TOC — 目錄 + scroll-spy
══════════════════════════════════════════════ */
(function () {
  const sections = [...document.querySelectorAll('.feature[id]')];
  if (!sections.length) return;
  const links = [...document.querySelectorAll('[data-toc]')];

  // Sliding underline for the desktop anchor bar.
  const fnInner = document.querySelector('.feature-nav__inner');
  const fnUnderline = createUnderline(
    fnInner,
    { height: 2, color: 'var(--color-action-primary-bg)', offsetY: 0 },
    () => fnInner && fnInner.querySelector('.feature-nav__link.is-active')
  );
  let lastActiveId = null;

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
    if (fnUnderline && activeId !== lastActiveId) {
      // First positioning is instant; later changes glide.
      fnUnderline.move(fnInner.querySelector('.feature-nav__link.is-active'), lastActiveId !== null);
      lastActiveId = activeId;
    }
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

  // Drag-to-dismiss: grab the handle / bar (or the list when scrolled to top)
  // and pull the sheet down with a finger; release past 1/4 height to close.
  const panel   = sheet.querySelector('.toc-sheet__panel');
  const overlay = sheet.querySelector('.toc-sheet__overlay');
  let dragStartY = 0, dragDY = 0, dragging = false, dragLastY = 0, dragLastT = 0, dragVY = 0;

  panel.addEventListener('touchstart', (e) => {
    if (!sheet.classList.contains('is-open')) return;
    const fromGrip = e.target.closest('.toc-sheet__handle, .toc-sheet__bar');
    if (!fromGrip && panel.scrollTop > 0) return;   // let the list scroll
    dragStartY = e.touches[0].clientY;
    dragDY = 0;
    dragging = true;
    dragLastY = dragStartY; dragLastT = e.timeStamp; dragVY = 0;
    panel.style.transition = 'none';                // follow the finger
  }, { passive: true });

  panel.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const y = e.touches[0].clientY, now = e.timeStamp;
    if (now > dragLastT) dragVY = (y - dragLastY) / (now - dragLastT);   // px/ms, downward = positive
    dragLastY = y; dragLastT = now;
    dragDY = Math.max(0, y - dragStartY);   // downward only
    if (dragDY > 0) {
      e.preventDefault();                            // stop page/list scroll
      panel.style.transform = `translateY(${dragDY}px)`;
      const h = panel.offsetHeight || 1;
      overlay.style.opacity = String(Math.max(0, 1 - dragDY / h));
    }
  }, { passive: false });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    panel.style.transition = '';                     // restore CSS easing
    overlay.style.opacity = '';
    // Only dismiss when pulled (almost) to the bottom or flicked down fast.
    const closed = dragDY > (panel.offsetHeight || 0) * 0.9 || dragVY > 0.6;
    panel.style.transform = '';                      // class drives the rest
    if (closed) closeSheet();                         // → slides to translateY(100%)
    dragDY = 0;
  }
  panel.addEventListener('touchend', endDrag);
  panel.addEventListener('touchcancel', endDrag);
})();

/* ══════════════════════════════════════════════
   SLIDING UNDERLINE — initial positions + navbar (cross-page slide)
══════════════════════════════════════════════ */
(function () {
  // Two-school tab bars on this page (team / map / campus) → rest under the active tab.
  document.querySelectorAll('.team__tabs, .location__tabs').forEach(c => updateTabUnderline(c, false));
  const activeCampusTabs = document.querySelector('.campus-school.is-active .campus-tabs');
  if (activeCampusTabs) updateTabUnderline(activeCampusTabs, false);

  // Navbar: the underline marks the CURRENT page (not hover). When you click a
  // nav link the site navigates (full page load); we remember the page you left
  // in sessionStorage, so on the new page the underline starts there and glides
  // to the new current page's link.
  const nav = document.querySelector('.navbar__nav');
  if (!nav) return;
  const links = [...nav.querySelectorAll('.nav-link')];
  const keyOf = el => el && (el.getAttribute('href') || el.textContent.trim());
  const getActive = () => nav.querySelector('.nav-link.active');
  const u = createUnderline(nav, { height: 1, color: '#ffffff', offsetY: 4, settle: false }, getActive);
  if (!u) return;

  const active = getActive();
  const fromKey = sessionStorage.getItem('navSlideFrom');
  sessionStorage.removeItem('navSlideFrom');
  const fromEl = fromKey ? links.find(l => keyOf(l) === fromKey) : null;

  if (active && fromEl && fromEl !== active) {
    u.move(fromEl, false);  // start where we came from
    requestAnimationFrame(() => requestAnimationFrame(() => u.move(active, true))); // glide to current page
  } else {
    u.move(active, false);  // direct load → rest under the current page (or hidden if none)
  }

  // Remember the page being left so the next page can glide from it.
  links.forEach(l => l.addEventListener('click', () => {
    const a = getActive();
    if (a) sessionStorage.setItem('navSlideFrom', keyOf(a));
  }));
})();

/* ══════════════════════════════════════════════
   SHARE SNACKBAR — prompt to share after a likely screenshot
   (mobile/tablet only; once per session)
══════════════════════════════════════════════ */
(function () {
  const SEEN_KEY = 'mc-share-snackbar-seen';
  let snackbar = null;
  let wasAway = false;

  function canShow() {
    return !snackbar
      && !sessionStorage.getItem(SEEN_KEY)
      && typeof navigator.share === 'function'
      && window.innerWidth < 1280;
  }

  function removeSnackbar() {
    if (!snackbar) return;
    const el = snackbar;
    snackbar = null;
    el.classList.add('is-closing');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400);   // fallback
  }

  function buildSnackbar() {
    const bar = document.createElement('div');
    bar.className = 'snackbar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', mcText('分享這個頁面', 'Share this page'));
    bar.innerHTML =
      '<button type="button" class="snackbar__main">' +
        '<img class="snackbar__icon" src="../assets/images/icon-snackbar-share.svg?v=2" alt="" aria-hidden="true">' +
        '<span class="snackbar__text">' + mcText('點此分享給親朋好友', 'Share this site with family &amp; friends') + '</span>' +
      '</button>' +
      '<button type="button" class="snackbar__close" aria-label="' + mcText('關閉', 'Close') + '">' +
        '<img class="snackbar__icon" src="../assets/images/icon-snackbar-close.svg?v=2" alt="" aria-hidden="true">' +
      '</button>';
    bar.querySelector('.snackbar__main').addEventListener('click', () => {
      const url = window.location.href;
      removeSnackbar();   // close as soon as the share sheet opens
      navigator.share({ url }).catch(() => { /* cancelled / unsupported */ });
    });
    bar.querySelector('.snackbar__close').addEventListener('click', removeSnackbar);
    return bar;
  }

  // Follow the navbar: below it when it's showing, at viewport top when it's hidden.
  function positionSnackbar() {
    if (!snackbar) return;
    // Anchor to the navbar's real rendered bottom edge. When the navbar is
    // hidden it sits at translateY(-100%), so its bottom is ~0 → snackbar pins
    // to the top; when visible, the bar sits flush under it. Driving this off
    // geometry (not the --visible class) avoids overlap during state changes.
    const navBottom = navbar ? navbar.getBoundingClientRect().bottom : 0;
    snackbar.style.top = Math.max(0, Math.round(navBottom)) + 'px';
  }

  function showSnackbar() {
    if (!canShow()) return;
    sessionStorage.setItem(SEEN_KEY, '1');
    snackbar = buildSnackbar();
    document.body.appendChild(snackbar);
    positionSnackbar();
    requestAnimationFrame(() => snackbar.classList.add('is-open'));
  }

  // Re-anchor as the navbar collapses / reappears on scroll, on resize, and
  // once web fonts finish loading (font swap changes the navbar height).
  window.addEventListener('scroll', () => { if (snackbar) positionSnackbar(); }, { passive: true });
  window.addEventListener('resize', () => { if (snackbar) positionSnackbar(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (snackbar) positionSnackbar(); });
  }
  // Re-anchor once the navbar finishes sliding in/out — a scroll event can fire
  // mid-transition (navbar still translated), so re-measure when it settles.
  if (navbar) {
    navbar.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform' && snackbar) positionSnackbar();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      wasAway = true;
    } else if (document.visibilityState === 'visible' && wasAway) {
      wasAway = false;
      showSnackbar();
    }
  });
  window.addEventListener('blur', () => { wasAway = true; });
  window.addEventListener('focus', () => { if (wasAway) { wasAway = false; showSnackbar(); } });
})();
