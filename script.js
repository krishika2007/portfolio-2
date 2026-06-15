/* ==========================================================================
   PARTICLE NETWORK CANVAS SYSTEM
   ========================================================================== */

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = {
  x: null,
  y: null,
  radius: 120
};

// Handle window size update
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  // Draw individual particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Update position and check mouse interactions
  update() {
    // Check screen boundary collision
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Mouse interactive movement (Repulsion effect)
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 2;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 2;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 2;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 2;
      }
    }

    // Regular speed factor translation
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

// Generate particle population
function initParticles() {
  particles = [];
  // Adjust density based on resolution to maintain performance
  let numberOfParticles = (canvas.width * canvas.height) / 14000;
  numberOfParticles = Math.min(numberOfParticles, 120); // Limit maximum nodes

  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
    let directionX = (Math.random() * 0.4) - 0.2;
    let directionY = (Math.random() * 0.4) - 0.2;
    // Glow theme matching violet/cyan translucent
    let color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.25)' : 'rgba(6, 182, 212, 0.25)';

    particles.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// Connection line drawing between close particles
function drawLines() {
  let maxDistance = 150;
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        // Line transparency drops as distance increases
        let opacity = 1 - (distance / maxDistance);
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.08})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  drawLines();
}

// Event Listeners for canvas mouse movements
window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('resize', resizeCanvas);

// Initialize system
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
initParticles();
animate();


/* ==========================================================================
   NAVIGATION & MOBILE DRAWER
   ========================================================================== */

const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = mobileToggle.querySelector('.menu-icon');
const closeIcon = mobileToggle.querySelector('.close-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    mobileMenu.classList.remove('open');
    mobileMenu.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      mobileMenu.style.display = 'none';
      mobileMenu.setAttribute('aria-hidden', 'true');
    }, 400);
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
    mobileToggle.setAttribute('aria-expanded', 'false');
  } else {
    mobileMenu.style.display = 'block';
    mobileMenu.setAttribute('aria-hidden', 'false');
    // Simple delay to trigger transform transition
    setTimeout(() => {
      mobileMenu.classList.add('open');
      mobileMenu.style.transform = 'translateY(0)';
    }, 10);
    menuIcon.style.display = 'none';
    closeIcon.style.display = 'block';
    mobileToggle.setAttribute('aria-expanded', 'true');
  }
}

mobileToggle.addEventListener('click', toggleMenu);

// Close menu drawer on navigating click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      toggleMenu();
    }
  });
});


/* ==========================================================================
   SCROLL SYSTEM (HEADER PROGRESS, REVEALS, ACTIVE MARKS)
   ========================================================================== */

const header = document.getElementById('header');
const scrollProgress = document.getElementById('scroll-progress');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll reveal using IntersectionObserver
const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Once revealed, no need to track it again
      observer.unobserve(entry.target);
    }
  });
};

const revealObserver = new IntersectionObserver(revealCallback, {
  root: null,
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.scroll-reveal').forEach(el => {
  revealObserver.observe(el);
});

// Scroll Event Handler (Progress & Nav state updates)
window.addEventListener('scroll', () => {
  // 1. Update scroll progress indicator
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = `${scrollPct}%`;

  // 2. Sticky header styling modifier
  if (scrollTop > 50) {
    header.style.background = 'rgba(3, 0, 20, 0.85)';
    header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
  } else {
    header.style.background = 'rgba(3, 0, 20, 0.6)';
    header.style.boxShadow = 'none';
  }

  // 3. Highlight current active section in nav links
  let currentSectionId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
});


/* ==========================================================================
   PROJECTS FILTER SYSTEM
   ========================================================================== */

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Toggling active state on buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selectedFilter = btn.getAttribute('data-filter');

    // Filter project list items
    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');

      // Use scale animation to fade-out and hide unselected cards
      if (selectedFilter === 'all' || cardCategory === selectedFilter) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});


/* ==========================================================================
   GLOWING CURSOR POSITIONING CARD HANDLER
   ========================================================================== */

const glowCards = document.querySelectorAll('[data-glow]');

glowCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});


/* ==========================================================================
   EMAIL CLIPBOARD COPY FUNCTIONALITY
   ========================================================================== */

const copyEmailBtn = document.getElementById('copy-email-btn');
const emailText = document.getElementById('email-text').textContent;
const copyIcon = copyEmailBtn.querySelector('.copy-icon');
const checkIcon = copyEmailBtn.querySelector('.check-icon');

copyEmailBtn.addEventListener('click', () => {
  // Write text value into user's clipboard buffer
  navigator.clipboard.writeText(emailText).then(() => {
    // Visual toggle representation
    copyIcon.style.display = 'none';
    checkIcon.style.display = 'block';

    setTimeout(() => {
      copyIcon.style.display = 'block';
      checkIcon.style.display = 'none';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
});


/* ==========================================================================
   CONTACT FORM VALIDATION & SUBMIT SIMULATION
   ========================================================================== */

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Intercept default reload action

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  // Basic validation checks
  if (!name || !email || !subject || !message) {
    showStatus('Please fill in all the required form fields.', 'error');
    return;
  }

  // Simple email format check regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showStatus('Please enter a valid email address.', 'error');
    return;
  }

  // Form submit simulation
  const submitBtn = contactForm.querySelector('.form-submit-btn');
  const submitBtnText = submitBtn.querySelector('span');

  submitBtn.disabled = true;
  submitBtnText.textContent = 'Sending Message...';

  // Simulating network request speed
  setTimeout(() => {
    showStatus('Thank you! Your message has been sent successfully.', 'success');
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtnText.textContent = 'Send Message';

    // Auto-clear message status after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }, 1500);
});

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';
}

// Initialize Lucide Icons render helper
lucide.createIcons();
