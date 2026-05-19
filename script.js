// ── Init Icons ──
lucide.createIcons();

// ── Theme Toggle ──
const themeBtn = document.getElementById('theme-btn');
const htmlEl   = document.documentElement;

themeBtn.addEventListener('click', () => {
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  themeBtn.innerHTML = isDark
    ? '<i data-lucide="moon" style="width:15px;height:15px;"></i><span>Dark</span>'
    : '<i data-lucide="sun"  style="width:15px;height:15px;"></i><span>Light</span>';
  lucide.createIcons();
});

// ── Nav Scroll Effects ──
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
  updateScrollBar();
}, { passive: true });

// ── Active Nav Link ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ── Scroll Progress ──
const scrollBar = document.getElementById('scroll-bar');
function updateScrollBar() {
  const total   = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (window.scrollY / total) * 100;
  if (scrollBar) scrollBar.style.width = percent + '%';
}

// ── Typewriter ──
const phrases = [
  'Software Engineer | Backend Developer',
  'I build scalable backend systems.',
  'I develop enterprise-grade applications.',
  'I integrate APIs & automate workflows.'
];
let pIdx = 0, cIdx = 0, deleting = false;
const tw   = document.getElementById('typewriter-text');
const tCursor = '|';

function type() {
  const phrase = phrases[pIdx];
  if (deleting) {
    tw.textContent = phrase.substring(0, --cIdx);
  } else {
    tw.textContent = phrase.substring(0, ++cIdx);
  }
  let delay = deleting ? 35 : 75;
  if (!deleting && cIdx === phrase.length) { delay = 2200; deleting = true; }
  else if (deleting && cIdx === 0)         { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
setTimeout(type, 800);

// ── Counter Animation ──
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const suffix = el.textContent.includes('+') ? '+' : (target >= 10 ? '+' : '');
  let start = 0;
  const step = () => {
    start += Math.ceil(target / 40);
    if (start >= target) { el.textContent = target + suffix; return; }
    el.textContent = start + (suffix || '');
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ── GSAP Animations ──
gsap.registerPlugin(ScrollTrigger);

gsap.from('.hero-badge', { duration:0.8, y:20, opacity:0, ease:'power3.out', delay:0.2 });
gsap.from('.hero-title',   { duration:1.2, y:50, opacity:0, ease:'power4.out', delay:0.4 });
gsap.from('.hero-subtitle',{ duration:1,   y:30, opacity:0, ease:'power3.out', delay:0.7 });
gsap.from('.hero-cta .btn',{ duration:0.8, y:20, opacity:0, ease:'power2.out', stagger:0.15, delay:0.9 });
gsap.from('.hero-stats .stat-item', { duration:0.7, y:20, opacity:0, stagger:0.1, ease:'power2.out', delay:1.1 });

gsap.utils.toArray('.gsap-reveal').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger:el, start:'top 88%' },
    y: 40, opacity:0, duration:0.9, ease:'power3.out',
    onComplete: () => gsap.set(el, { clearProps:'transform' })
  });
});

gsap.utils.toArray('.gsap-timeline-item').forEach((item, i) => {
  const xOff = item.classList.contains('left') ? -50 : 50;
  gsap.from(item, {
    scrollTrigger: { trigger:item, start:'top 88%', toggleActions:'play none none reverse' },
    x: window.innerWidth > 768 ? xOff : 0,
    y: window.innerWidth <= 768 ? 40 : 0,
    opacity:0, duration:0.8, ease:'power3.out'
  });
});

// ── Glass Card Tilt ──
document.querySelectorAll('.glass.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const x   = e.clientX - r.left - r.width / 2;
    const y   = e.clientY - r.top - r.height / 2;
    const rx  = -(y / r.height) * 8;
    const ry  =  (x / r.width)  * 8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) window.scrollTo({ top: target.offsetTop - 70, behavior:'smooth' });
  });
});

// ── Contact Form ──
const form      = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');
const submitBtn  = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = JSON.stringify(Object.fromEntries(new FormData(form)));
    formResult.textContent = 'Sending…';
    formResult.style.color = 'var(--muted)';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
        body: data
      });
      const json = await res.json();
      if (res.ok) {
        formResult.textContent = '✓ Message sent successfully!';
        formResult.style.color = 'var(--green)';
        form.reset();
      } else {
        throw new Error(json.message || 'Error');
      }
    } catch(err) {
      formResult.textContent = '✕ ' + (err.message || 'Something went wrong.');
      formResult.style.color = '#f87171';
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      setTimeout(() => { formResult.textContent = ''; }, 5000);
    }
  });
}
