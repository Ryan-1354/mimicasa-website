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
