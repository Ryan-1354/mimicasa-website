/* ══════════════════════════════════════════════
   NAVBAR — Smart Scroll
══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

function updateNavbar() {
  const currentScrollY = window.scrollY;

  if (currentScrollY === 0) {
    navbar.className = 'navbar navbar--transparent navbar--visible';
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

function openDrawer() {
  drawer.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
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
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzoBC9phdPJjxs4HJealTci1_k_aNohZDhT-QvlVvCAl4jJ_ljAMRV-KZSJAjR6GWb3Ag/exec';

const bookingDialog  = document.getElementById('booking-dialog');
const dialogCloseBtn = document.getElementById('dialogClose');
const bookingForm    = document.getElementById('booking-form');

function openBookingDialog() {
  bookingDialog.showModal();
  document.body.style.overflow = 'hidden';
}

function closeBookingDialog() {
  function finish() {
    bookingDialog.close();
    document.body.style.overflow = '';
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
  btn.addEventListener('click', openBookingDialog);
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

// Date field — click anywhere to open picker
(function () {
  const dateField = document.querySelector('.field--date');
  const dateInput = document.getElementById('field-birthday');
  if (!dateField || !dateInput) return;
  dateField.addEventListener('click', () => {
    try { dateInput.showPicker(); } catch (_) {}
  });
})();

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

  const payload = {
    school:      bookingForm.school.value,
    childName:   bookingForm.childName.value,
    birthday:    bookingForm.birthday.value,
    gender:      bookingForm.gender.value,
    enrollYear:  bookingForm.enrollYear.value,
    enrollMonth: bookingForm.enrollMonth.value,
    parentName:  bookingForm.parentName.value,
    phone:       bookingForm.phone.value,
  };

  try {
    await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload), mode: 'no-cors' });
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
