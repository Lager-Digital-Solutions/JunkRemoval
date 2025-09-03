// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      siteNav?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// IntersectionObserver reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Hero range label logic
const range = document.getElementById('loadRange');
const rangeLabel = document.getElementById('rangeLabel');
if (range && rangeLabel) {
  const labels = {
    1: ['⅛ Truck', 'Up to 1 cubic yard'],
    2: ['¼ Truck', 'Up to 2 cubic yards'],
    3: ['⅜ Truck', 'Up to 3 cubic yards'],
    4: ['½ Truck', 'Up to 6 cubic yards'],
    5: ['⅝ Truck', 'Up to 7.5 cubic yards'],
    6: ['¾ Truck', 'Up to 9 cubic yards'],
    7: ['⅞ Truck', 'Up to 10.5 cubic yards'],
    8: ['Full Truck', 'Up to 12 cubic yards'],
  };
  const metaEl = document.querySelector('.range-meta .muted');
  const sync = () => {
    const v = Number(range.value);
    rangeLabel.textContent = labels[v][0];
    if (metaEl) metaEl.textContent = labels[v][1];
  };
  range.addEventListener('input', sync);
  sync();
}

// Instant estimate (demo calculation)
const instantForm = document.getElementById('instantForm');
if (instantForm) {
  instantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = new FormData(instantForm).get('type');
    const size = Number(document.getElementById('loadRange').value);
    if (!type) {
      alert('Select the type of junk to continue.');
      return;
    }
    // Simple demo pricing tiers
    const base = [0, 99, 149, 189, 249, 299, 359, 419, 499][size] || 149;
    const materialAdj = /appliance|electronics/i.test(type) ? 30
                      : /construction/i.test(type) ? 50
                      : 0;
    const low = Math.round((base + materialAdj) * 0.92);
    const high = Math.round((base + materialAdj) * 1.15);
    alert(`Ballpark estimate: $${low} – $${high}\nFinal price confirmed on-site.`);
  });
}

// Reviews carousel
const track = document.getElementById('reviewTrack');
const prev = document.getElementById('prevReview');
const next = document.getElementById('nextReview');
if (track && prev && next) {
  let index = 0;
  const items = () => Array.from(track.children);
  const show = (i) => {
    const width = track.getBoundingClientRect().width;
    track.scrollTo({ left: width * i, behavior: 'smooth' });
  };
  next.addEventListener('click', () => {
    index = (index + 1) % items().length;
    show(index);
  });
  prev.addEventListener('click', () => {
    index = (index - 1 + items().length) % items().length;
    show(index);
  });
}

// Contact form (demo only)
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');
const photoInput = document.getElementById('photo');
const fileName = document.getElementById('fileName');

if (photoInput && fileName) {
  photoInput.addEventListener('change', () => {
    fileName.textContent = photoInput.files?.[0]?.name || '';
  });
}

if (contactForm && formAlert) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formAlert.className = 'alert';
    formAlert.textContent = 'Sending...';

    // Fake delay to simulate network
    await new Promise(r => setTimeout(r, 800));

    // Simple validation
    const fd = new FormData(contactForm);
    const required = ['name', 'phone', 'email', 'address'];
    const missing = required.filter(k => !String(fd.get(k) || '').trim());
    if (missing.length) {
      formAlert.classList.add('alert--bad');
      formAlert.textContent = 'Please fill in all required fields.';
      return;
    }

    // In production: send to your backend
    // await fetch('/api/estimate', { method:'POST', body: fd });

    formAlert.classList.add('alert--ok');
    formAlert.textContent = 'Thanks! We received your request and will reach out shortly.';
    contactForm.reset();
    fileName.textContent = '';
  });
}
