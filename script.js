/* ==========================================================================
   KRISHIKA AMIN PORTFOLIO - MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================================
     LUCIDE ICONS
     ========================================================================== */

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }


  /* ==========================================================================
     PARTICLE NETWORK CANVAS SYSTEM
     ========================================================================== */

  const canvas = document.getElementById("particles-canvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    let particles = [];

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    let animationFrame;

    /* --------------------------------------------------------------------------
       Resize Canvas
       -------------------------------------------------------------------------- */

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles();
    }


    /* --------------------------------------------------------------------------
       Particle Class
       -------------------------------------------------------------------------- */

    class Particle {

      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;

        this.directionX = directionX;
        this.directionY = directionY;

        this.size = size;
        this.color = color;
      }


      /* Draw Particle */

      draw() {
        ctx.beginPath();

        ctx.arc(
          this.x,
          this.y,
          this.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = this.color;
        ctx.fill();
      }


      /* Update Particle */

      update() {

        /* Screen boundary collision */

        if (this.x + this.size >= window.innerWidth || this.x - this.size <= 0) {
          this.directionX *= -1;
        }

        if (this.y + this.size >= window.innerHeight || this.y - this.size <= 0) {
          this.directionY *= -1;
        }


        /* Mouse repulsion */

        if (mouse.x !== null && mouse.y !== null) {

          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < mouse.radius && distance > 0) {

            const force = (mouse.radius - distance) / mouse.radius;

            const moveX = (dx / distance) * force * 2;
            const moveY = (dy / distance) * force * 2;

            this.x -= moveX;
            this.y -= moveY;
          }
        }


        /* Normal movement */

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
      }
    }


    /* --------------------------------------------------------------------------
       Initialize Particles
       -------------------------------------------------------------------------- */

    function initParticles() {

      particles = [];

      const area = window.innerWidth * window.innerHeight;

      let numberOfParticles = Math.floor(area / 16000);

      /* Keep particle count reasonable */

      numberOfParticles = Math.max(
        30,
        Math.min(numberOfParticles, 110)
      );


      for (let i = 0; i < numberOfParticles; i++) {

        const size = Math.random() * 1.8 + 0.8;

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        const directionX = (Math.random() - 0.5) * 0.35;
        const directionY = (Math.random() - 0.5) * 0.35;

        const color =
          Math.random() > 0.5
            ? "rgba(139, 92, 246, 0.30)"
            : "rgba(6, 182, 212, 0.30)";


        particles.push(
          new Particle(
            x,
            y,
            directionX,
            directionY,
            size,
            color
          )
        );
      }
    }


    /* --------------------------------------------------------------------------
       Draw Connections
       -------------------------------------------------------------------------- */

    function drawLines() {

      const maxDistance = 150;

      for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );


          if (distance < maxDistance) {

            const opacity =
              1 - distance / maxDistance;

            ctx.beginPath();

            ctx.moveTo(
              particles[a].x,
              particles[a].y
            );

            ctx.lineTo(
              particles[b].x,
              particles[b].y
            );

            ctx.strokeStyle =
              `rgba(139, 92, 246, ${opacity * 0.08})`;

            ctx.lineWidth = 1;

            ctx.stroke();
          }
        }
      }
    }


    /* --------------------------------------------------------------------------
       Animation Loop
       -------------------------------------------------------------------------- */

    function animate() {

      animationFrame = requestAnimationFrame(animate);

      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );


      drawLines();


      particles.forEach(particle => {
        particle.update();
      });
    }


    /* --------------------------------------------------------------------------
       Mouse Events
       -------------------------------------------------------------------------- */

    window.addEventListener("mousemove", (event) => {

      mouse.x = event.clientX;
      mouse.y = event.clientY;

    });


    window.addEventListener("mouseleave", () => {

      mouse.x = null;
      mouse.y = null;

    });


    /* Touch devices */

    window.addEventListener("touchmove", (event) => {

      if (event.touches.length > 0) {

        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;

      }

    }, { passive: true });


    window.addEventListener("touchend", () => {

      mouse.x = null;
      mouse.y = null;

    });


    /* Resize */

    window.addEventListener(
      "resize",
      resizeCanvas
    );


    /* Initialize */

    resizeCanvas();
    animate();
  }


  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */

  const mobileToggle =
    document.getElementById("mobile-toggle");

  const mobileMenu =
    document.getElementById("mobile-menu");

  const mobileLinks =
    document.querySelectorAll(".mobile-link");


  if (mobileToggle && mobileMenu) {

    const menuIcon =
      mobileToggle.querySelector(".menu-icon");

    const closeIcon =
      mobileToggle.querySelector(".close-icon");


    function openMenu() {

      mobileMenu.classList.add("open");

      mobileMenu.setAttribute(
        "aria-hidden",
        "false"
      );

      mobileToggle.setAttribute(
        "aria-expanded",
        "true"
      );


      if (menuIcon) {
        menuIcon.style.display = "none";
      }

      if (closeIcon) {
        closeIcon.style.display = "block";
      }

      document.body.classList.add("menu-open");
    }


    function closeMenu() {

      mobileMenu.classList.remove("open");

      mobileMenu.setAttribute(
        "aria-hidden",
        "true"
      );

      mobileToggle.setAttribute(
        "aria-expanded",
        "false"
      );


      if (menuIcon) {
        menuIcon.style.display = "block";
      }

      if (closeIcon) {
        closeIcon.style.display = "none";
      }

      document.body.classList.remove("menu-open");
    }


    mobileToggle.addEventListener("click", () => {

      const isOpen =
        mobileMenu.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    });


    /* Close menu after clicking a link */

    mobileLinks.forEach(link => {

      link.addEventListener("click", () => {
        closeMenu();
      });

    });


    /* Close menu with Escape */

    document.addEventListener("keydown", (event) => {

      if (
        event.key === "Escape" &&
        mobileMenu.classList.contains("open")
      ) {
        closeMenu();
      }

    });

  }


  /* ==========================================================================
     HEADER + SCROLL PROGRESS + ACTIVE NAVIGATION
     ========================================================================== */

  const header =
    document.getElementById("header");

  const scrollProgress =
    document.getElementById("scroll-progress");

  const sections =
    document.querySelectorAll("section[id]");

  const navLinks =
    document.querySelectorAll(".nav-link");


  function updateScrollSystem() {

    const scrollTop =
      window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight;

    const windowHeight =
      window.innerHeight;


    /* --------------------------------------------------------------------------
       Scroll Progress
       -------------------------------------------------------------------------- */

    const scrollableHeight =
      documentHeight - windowHeight;


    const scrollPercentage =
      scrollableHeight > 0
        ? (scrollTop / scrollableHeight) * 100
        : 0;


    if (scrollProgress) {

      scrollProgress.style.width =
        `${Math.min(scrollPercentage, 100)}%`;

    }


    /* --------------------------------------------------------------------------
       Header Background
       -------------------------------------------------------------------------- */

    if (header) {

      if (scrollTop > 50) {

        header.classList.add("scrolled");

        header.style.background =
          "rgba(3, 0, 20, 0.88)";

        header.style.boxShadow =
          "0 10px 30px rgba(0, 0, 0, 0.3)";

      } else {

        header.classList.remove("scrolled");

        header.style.background =
          "rgba(3, 0, 20, 0.6)";

        header.style.boxShadow =
          "none";

      }

    }


    /* --------------------------------------------------------------------------
       Active Navigation Link
       -------------------------------------------------------------------------- */

    let currentSection = "";


    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - 160;

      const sectionBottom =
        sectionTop + section.offsetHeight;


      if (
        scrollTop >= sectionTop &&
        scrollTop < sectionBottom
      ) {

        currentSection =
          section.getAttribute("id");

      }

    });


    navLinks.forEach(link => {

      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${currentSection}`
      );

    });

  }


  window.addEventListener(
    "scroll",
    updateScrollSystem,
    { passive: true }
  );


  updateScrollSystem();


  /* ==========================================================================
     SCROLL REVEAL ANIMATION
     ========================================================================== */

  const revealElements =
    document.querySelectorAll(".scroll-reveal");


  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "revealed"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -50px 0px"
        }
      );


    revealElements.forEach(element => {

      revealObserver.observe(element);

    });

  } else {

    /* Fallback for older browsers */

    revealElements.forEach(element => {

      element.classList.add("revealed");

    });

  }


  /* ==========================================================================
     PROJECT FILTER SYSTEM
     ========================================================================== */

  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const projectCards =
    document.querySelectorAll(".project-card");


  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      /* Active filter button */

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");


      const selectedFilter =
        button.getAttribute("data-filter");


      projectCards.forEach(card => {

        const category =
          card.getAttribute("data-category");


        const shouldShow =
          selectedFilter === "all" ||
          category === selectedFilter;


        if (shouldShow) {

          card.style.display = "flex";

          requestAnimationFrame(() => {

            card.style.opacity = "1";
            card.style.transform = "scale(1)";

          });

        } else {

          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";


          setTimeout(() => {

            if (
              card.style.opacity === "0"
            ) {
              card.style.display = "none";
            }

          }, 300);

        }

      });

    });

  });


  /* ==========================================================================
     GLOWING CURSOR CARD EFFECT
     ========================================================================== */

  const glowCards =
    document.querySelectorAll("[data-glow]");


  glowCards.forEach(card => {

    card.addEventListener("mousemove", event => {

      const rect =
        card.getBoundingClientRect();


      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;


      card.style.setProperty(
        "--mouse-x",
        `${x}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${y}px`
      );

    });


    card.addEventListener("mouseleave", () => {

      card.style.removeProperty(
        "--mouse-x"
      );

      card.style.removeProperty(
        "--mouse-y"
      );

    });

  });


  /* ==========================================================================
     EMAIL COPY FUNCTION
     ========================================================================== */

  const copyEmailButton =
    document.getElementById(
      "copy-email-btn"
    );

  const emailElement =
    document.getElementById(
      "email-text"
    );


  if (copyEmailButton && emailElement) {

    const copyIcon =
      copyEmailButton.querySelector(
        ".copy-icon"
      );

    const checkIcon =
      copyEmailButton.querySelector(
        ".check-icon"
      );


    copyEmailButton.addEventListener(
      "click",
      async () => {

        const email =
          emailElement.textContent.trim();


        try {

          if (
            navigator.clipboard &&
            window.isSecureContext
          ) {

            await navigator.clipboard.writeText(
              email
            );

          } else {

            /* Fallback for non-secure environments */

            const temporaryInput =
              document.createElement("textarea");

            temporaryInput.value = email;

            temporaryInput.style.position =
              "fixed";

            temporaryInput.style.opacity = "0";

            document.body.appendChild(
              temporaryInput
            );

            temporaryInput.select();

            document.execCommand("copy");

            temporaryInput.remove();

          }


          /* Change icon */

          if (copyIcon) {
            copyIcon.style.display = "none";
          }

          if (checkIcon) {
            checkIcon.style.display = "block";
          }


          copyEmailButton.setAttribute(
            "aria-label",
            "Email copied"
          );


          setTimeout(() => {

            if (copyIcon) {
              copyIcon.style.display = "block";
            }

            if (checkIcon) {
              checkIcon.style.display = "none";
            }

            copyEmailButton.setAttribute(
              "aria-label",
              "Copy email to clipboard"
            );

          }, 2000);


        } catch (error) {

          console.error(
            "Unable to copy email:",
            error
          );

        }

      }
    );

  }


  /* ==========================================================================
     CONTACT FORM
     ========================================================================== */

  const contactForm =
    document.getElementById(
      "contact-form"
    );

  const formStatus =
    document.getElementById(
      "form-status"
    );


  if (contactForm && formStatus) {

    contactForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          document.getElementById(
            "name"
          )?.value.trim();


        const email =
          document.getElementById(
            "email"
          )?.value.trim();


        const subject =
          document.getElementById(
            "subject"
          )?.value.trim();


        const message =
          document.getElementById(
            "message"
          )?.value.trim();


        /* Required field validation */

        if (
          !name ||
          !email ||
          !subject ||
          !message
        ) {

          showFormStatus(
            "Please fill in all the required fields.",
            "error"
          );

          return;

        }


        /* Email validation */

        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

          showFormStatus(
            "Please enter a valid email address.",
            "error"
          );

          return;

        }


        /* Message length validation */

        if (message.length < 10) {

          showFormStatus(
            "Please enter a message with at least 10 characters.",
            "error"
          );

          return;

        }


        /* Submit button */

        const submitButton =
          contactForm.querySelector(
            ".form-submit-btn"
          );


        const submitText =
          submitButton?.querySelector(
            "span"
          );


        if (submitButton) {
          submitButton.disabled = true;
        }


        if (submitText) {
          submitText.textContent =
            "Sending Message...";
        }


        /*
         * NOTE:
         * This currently displays a success message locally.
         * To actually receive messages by email, connect this
         * form to a backend or form service.
         */

        setTimeout(() => {

          showFormStatus(
            "Thank you! Your message has been received.",
            "success"
          );


          contactForm.reset();


          if (submitButton) {
            submitButton.disabled = false;
          }


          if (submitText) {
            submitText.textContent =
              "Send Message";
          }


          setTimeout(() => {

            formStatus.style.display =
              "none";

          }, 5000);

        }, 1000);

      }
    );

  }


  /* --------------------------------------------------------------------------
     Form Status Helper
     -------------------------------------------------------------------------- */

  function showFormStatus(message, type) {

    if (!formStatus) {
      return;
    }


    formStatus.textContent =
      message;


    formStatus.className =
      `form-status ${type}`;


    formStatus.style.display =
      "block";

  }


  /* ==========================================================================
     SMOOTH SCROLLING
     ========================================================================== */

  document.querySelectorAll(
    'a[href^="#"]'
  ).forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        const headerHeight =
          document.getElementById(
            "header"
          )?.offsetHeight || 0;


        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          15;


        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

      }
    );

  });


  /* ==========================================================================
     RESUME / CONTACT BUTTON
     ========================================================================== */

  const resumeButton =
    document.getElementById(
      "resume-download-btn"
    );


  if (resumeButton) {

    resumeButton.addEventListener(
      "click",
      () => {

        /*
         * The button currently points to #contact.
         * This keeps the existing website behavior.
         *
         * If you later add:
         *
         * assets/Krishika-Amin-Resume.pdf
         *
         * this button can be changed into a real
         * resume download button.
         */

      }
    );

  }


  /* ==========================================================================
     PAGE VISIBILITY PERFORMANCE
     ========================================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden &&
        typeof animationFrame !== "undefined"
      ) {

        cancelAnimationFrame(
          animationFrame
        );

      }

    }
  );


  /* ==========================================================================
     FINAL ICON REFRESH
     ========================================================================== */

  if (typeof lucide !== "undefined") {

    lucide.createIcons();

  }

});
