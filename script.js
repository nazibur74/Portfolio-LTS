/* Personal details and links: update these before publishing. */
const CONFIG = {
  email: "shafikhanzz72@gmail.com",
  phone: "+880 1797-971474",
  links: {
    github: "https://github.com/nazibur74",
    linkedin: "https://www.linkedin.com/in/md-nazibur-rahman-917212189/",
    "rice-code": "https://github.com/nazibur74/RiceDT-FYDP",
    "rec-code": "https://github.com/nazibur74/DecodeLabs-Internship/tree/main/Project_03",
    "zstore-code": "https://github.com/nazibur74/Flutter_Project",
    "speech-code": "",
    facebook: "https://www.facebook.com/shafikhanzz72",
    instagram: "https://www.instagram.com/_.shafiiii._/",
    whatsapp: "https://wa.me/8801797971474",
    cv: "assets/cv/Md. Nazibur Rahman.pdf"
  }
};

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
const email = document.getElementById("email");
if (email) { email.textContent = CONFIG.email; email.href = `mailto:${CONFIG.email}`; }
const heroEmail = document.getElementById("hero-email");
if (heroEmail) heroEmail.href = `mailto:${CONFIG.email}`;

const phoneRow = document.getElementById("phone-row");
const phone = document.getElementById("phone");
if (phoneRow && phone && CONFIG.phone) {
  phone.textContent = CONFIG.phone;
  phone.href = `tel:${CONFIG.phone.replace(/[^\d+]/g, "")}`;
  phoneRow.hidden = false;
  if (!CONFIG.links.whatsapp) CONFIG.links.whatsapp = `https://wa.me/${CONFIG.phone.replace(/\D/g, "")}`;
}

document.querySelectorAll("[data-link]").forEach((link) => {
  const url = CONFIG.links[link.dataset.link];
  if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; }
  else link.hidden = true;
});

function activateImage(imageId, wrapperSelector) {
  const image = document.getElementById(imageId);
  if (!image) return;
  const wrapper = image.closest(wrapperSelector);
  if (!wrapper) return;
  image.addEventListener("load", () => wrapper.classList.add("has-photo"));
  image.addEventListener("error", () => wrapper.classList.remove("has-photo"));
  if (image.complete && image.naturalWidth > 0) wrapper.classList.add("has-photo");
}
activateImage("profile-photo", ".avatar");
activateImage("contact-photo", ".contact-photo");

function activateLogo(image) {
  const wrapper = image.closest(".brand, .contact-brand");
  if (!wrapper) return;
  image.addEventListener("load", () => wrapper.classList.add("has-logo"));
  image.addEventListener("error", () => wrapper.classList.remove("has-logo"));
  if (image.complete && image.naturalWidth > 0) wrapper.classList.add("has-logo");
}
document.querySelectorAll(".brand-logo,.contact-logo").forEach(activateLogo);

const roles = ["AI & Machine Learning", "Computer Vision", "Data Analytics", "Software Development", "Problem Solving", "UI and UX Design"];
const typed = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (typed && !reduceMotion) {
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  function typeLoop() {
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typed.textContent = word.slice(0, charIndex);
    let delay = deleting ? 48 : 95;
    if (!deleting && charIndex === word.length) { deleting = true; delay = 1450; }
    else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 280; }
    window.setTimeout(typeLoop, delay);
  }
  window.setTimeout(typeLoop, 1700);
}

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

const navItems = [...document.querySelectorAll(".nav-links a")];
const sections = navItems.map(link => document.querySelector(link.getAttribute("href")));
function updateActiveLink() {
  const position = window.scrollY + 150;
  let current = 0;
  sections.forEach((section, index) => { if (section && section.offsetTop <= position) current = index; });
  navItems.forEach((link, index) => link.classList.toggle("active", index === current));
}
window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

const form = document.getElementById("form");
if (form) form.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("f-name").value.trim();
  const sender = document.getElementById("f-email").value.trim();
  const message = document.getElementById("f-msg").value.trim();
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${sender}\n\n${message}`);
  window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
});

/* Floating tech logos: a relaxed, slow drift. Only a handful are shown at a
   time; every SHOW_MS the visible set fades out and a fresh set fades in. */
(function () {
  const stage = document.getElementById("stage");
  const orbit = stage && stage.querySelector(".tech-orbit");
  const avatar = stage && stage.querySelector(".avatar");
  if (!stage || !orbit || !avatar || reduceMotion) return;

  const SHOW_MS = 5000;       // how long each set stays on screen
  const FADE_MS = 1500;        // fade-out time before the next set appears
  const PER_SET = 7;           // logos shown at once on desktop
  const PER_SET_SMALL = 5;     // logos shown at once on phones
  const MIN_SPEED = 18, MAX_SPEED = 30;   // px per second (slow and calm)

  const items = [...orbit.querySelectorAll(".tech-logo")].map(el => (
    { el, x: 0, y: 0, r: 27, vx: 0, vy: 0, speed: 0, avail: true, on: false, vis: false }
  ));
  let W = 0, H = 0, R = 0, lastSet = [];

  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const draw = b => { b.el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`; };

  function measure() {
    W = stage.clientWidth; H = stage.clientHeight; R = avatar.offsetWidth / 2 + 10;
    items.forEach(b => {
      b.avail = b.el.offsetWidth > 0;
      b.r = b.avail ? b.el.offsetWidth / 2 : 0;
      if (b.on) { b.x = Math.min(Math.max(b.x, b.r), W - b.r); b.y = Math.min(Math.max(b.y, b.r), H - b.r); draw(b); }
    });
  }

  function place(b, k, n) {
    const a = (k / n) * Math.PI * 2 + Math.random() * 0.5;
    const rad = Math.min(W, H) * 0.40;
    b.x = W / 2 + Math.cos(a) * rad; b.y = H / 2 + Math.sin(a) * rad;
    const dir = Math.random() * Math.PI * 2;
    b.speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    b.vx = Math.cos(dir) * b.speed; b.vy = Math.sin(dir) * b.speed;
    b.x = Math.min(Math.max(b.x, b.r), W - b.r); b.y = Math.min(Math.max(b.y, b.r), H - b.r);
    draw(b);
  }

  function showNext() {
    measure();
    const avail = items.filter(b => b.avail);
    const n = Math.min(window.innerWidth <= 680 ? PER_SET_SMALL : PER_SET, avail.length);
    const fresh = shuffle(avail.filter(b => !lastSet.includes(b)));
    const next = fresh.concat(shuffle(avail.filter(b => lastSet.includes(b)))).slice(0, n);
    next.forEach((b, k) => { place(b, k, n); b.on = true; b.vis = true; });
    requestAnimationFrame(() => requestAnimationFrame(() => next.forEach(b => b.el.classList.add("shown"))));
    lastSet = next;
    setTimeout(hideCurrent, SHOW_MS);
  }

  function hideCurrent() {
    const old = items.filter(b => b.vis);
    old.forEach(b => { b.vis = false; b.el.classList.remove("shown"); });
    setTimeout(() => { old.forEach(b => { b.on = false; }); showNext(); }, FADE_MS);
  }

  orbit.classList.add("physics");
  measure();
  window.addEventListener("resize", measure);
  showNext();

  let visible = true, last = performance.now();
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(stage);

  function step(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (visible) {
      const live = items.filter(b => b.on && b.avail);
      const cx = W / 2, cy = H / 2;
      live.forEach(b => {
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx); }
        if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx); }
        if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy); }
        if (b.y > H - b.r) { b.y = H - b.r; b.vy = -Math.abs(b.vy); }
        const dx = b.x - cx, dy = b.y - cy, d = Math.hypot(dx, dy) || 1, min = R + b.r;
        if (d < min) {
          const nx = dx / d, ny = dy / d, dot = b.vx * nx + b.vy * ny;
          if (dot < 0) { b.vx -= 2 * dot * nx; b.vy -= 2 * dot * ny; }
          b.x = cx + nx * min; b.y = cy + ny * min;
        }
      });
      for (let pass = 0; pass < 2; pass++) for (let a = 0; a < live.length; a++) for (let c = a + 1; c < live.length; c++) {
        const p = live[a], q = live[c], dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1, min = p.r + q.r;
        if (d < min) {
          const nx = dx / d, ny = dy / d, rel = (p.vx - q.vx) * nx + (p.vy - q.vy) * ny;
          if (rel > 0) { p.vx -= rel * nx; p.vy -= rel * ny; q.vx += rel * nx; q.vy += rel * ny; }
          const push = (min - d) / 2; p.x -= nx * push; p.y -= ny * push; q.x += nx * push; q.y += ny * push;
        }
      }
      live.forEach(b => {
        b.x = Math.min(Math.max(b.x, b.r), W - b.r); b.y = Math.min(Math.max(b.y, b.r), H - b.r);
        const s = Math.hypot(b.vx, b.vy) || 1; b.vx = b.vx / s * b.speed; b.vy = b.vy / s * b.speed; draw(b);
      });
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();