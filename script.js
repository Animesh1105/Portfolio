// Initialize Lucide Icons
lucide.createIcons();

// Custom Cursor removed per user request

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-btn');
const htmlEl = document.documentElement;
const themeIcon = themeBtn.querySelector('i');

themeBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  
  if(newTheme === 'light') {
    themeBtn.innerHTML = '<i data-lucide="moon"></i> <span>Dark Mode</span>';
  } else {
    themeBtn.innerHTML = '<i data-lucide="sun"></i> <span>Light Mode</span>';
  }
  lucide.createIcons();
});

// Typewriter Effect for Hero Section
const phrases = [
  "Software Engineer | Backend Developer",
  "I build scalable backend systems",
  "I develop enterprise-grade apps",
  "I integrate APIs and automate workflows"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter-text');
const typeSpeed = 80;
const deleteSpeed = 40;
const delayBetweenPhrases = 2000;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let timeout = isDeleting ? deleteSpeed : typeSpeed;

  if (!isDeleting && charIndex === currentPhrase.length) {
    timeout = delayBetweenPhrases;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    timeout = 500;
  }

  setTimeout(typeWriter, timeout);
}

// Start typing effect
setTimeout(typeWriter, 1000);

// GSAP Animations with ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
gsap.from(".hero-title", {
  duration: 1.2,
  y: 50,
  opacity: 0,
  ease: "power4.out",
  delay: 0.2
});

gsap.from(".hero-subtitle", {
  duration: 1,
  y: 30,
  opacity: 0,
  ease: "power3.out",
  delay: 0.5
});

gsap.from(".hero-cta .btn", {
  duration: 0.8,
  y: 20,
  opacity: 0,
  ease: "power2.out",
  stagger: 0.2,
  delay: 0.8
});

// Scroll Reveal for general elements
gsap.utils.toArray('.gsap-reveal').forEach(elem => {
  gsap.from(elem, {
    scrollTrigger: {
      trigger: elem,
      start: "top 85%"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    onComplete: () => {
      // Clear GSAP's inline transform lock so the continuous CSS 3D float keyframes can run smoothly!
      gsap.set(elem, { clearProps: "transform" });
    }
  });
});

// Skills Progress Bar Animation
const skillBars = document.querySelectorAll('.skill-progress');
skillBars.forEach(bar => {
  const targetWidth = bar.getAttribute('data-width');
  gsap.to(bar, {
    scrollTrigger: {
      trigger: bar,
      start: "top 90%",
    },
    width: targetWidth,
    duration: 1.5,
    ease: "power3.out"
  });
});

// Timeline Animation
const timelineItems = document.querySelectorAll('.gsap-timeline-item');
timelineItems.forEach((item, index) => {
  const xOffset = item.classList.contains('left') ? -50 : 50;
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    x: window.innerWidth > 768 ? xOffset : 0,
    y: window.innerWidth <= 768 ? 50 : 0,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if(this.getAttribute('href') !== '#') {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if(targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - 70, // offset for navbar
          behavior: 'smooth'
        });
      }
    }
  });
});

// Scroll Progress Tracker
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const currentScroll = window.scrollY;
  const scrollPercent = (currentScroll / scrollTotal) * 100;
  if(scrollBar) {
    scrollBar.style.width = `${scrollPercent}%`;
  }
});

// Contact Form AJAX Submission (Web3Forms)
const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Initial state
    result.innerHTML = "Sending message...";
    result.style.color = "var(--text-muted)";
    submitBtn.style.opacity = "0.7";
    submitBtn.style.pointerEvents = "none";

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = "Message sent successfully!";
        result.style.color = "var(--accent-1)";
      } else {
        console.log(response);
        result.innerHTML = json.message || "An error occurred.";
        result.style.color = "red";
      }
    })
    .catch(error => {
      console.log(error);
      result.innerHTML = "Something went wrong! Please try again.";
      result.style.color = "red";
    })
    .then(function() {
      form.reset();
      submitBtn.style.opacity = "1";
      submitBtn.style.pointerEvents = "auto";
      setTimeout(() => {
        result.innerHTML = "";
      }, 5000); // Clear message after 5 seconds
    });
  });
}
