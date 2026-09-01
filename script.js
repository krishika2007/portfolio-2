```javascript
/* ==========================================================================
   KRISHIKA AMIN — PORTFOLIO JAVASCRIPT
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
      radius: 130
    };

    let animationFrame;


    /* --------------------------------------------------------------------------
       Resize Canvas
       -------------------------------------------------------------------------- */

    function resizeCanvas() {
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
      );

      initParticles();
    }


    /* --------------------------------------------------------------------------
       Particle Class
       -------------------------------------------------------------------------- */

    class Particle {

      constructor() {

        this.size = Math.random() * 1.6 + 0.8;

        this.x =
          Math.random() *
          (window.innerWidth - this.size * 2) +
          this.size;

        this.y =
          Math.random() *
          (window.innerHeight - this.size * 2) +
          this.size;

        this.directionX =
          (Math.random() - 0.5) * 0.35;

        this.directionY =
          (Math.random() - 0.5) * 0.35;

        this.color =
          Math.random() > 0.5
            ? "rgba(139, 92, 246, 0.35)"
            : "rgba(6, 182, 212, 0.35)";
      }


      /* ------------------------------------------------------------------------
         Draw Particle
         ------------------------------------------------------------------------ */

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


      /* ------------------------------------------------------------------------
         Update Particle
         ------------------------------------------------------------------------ */

      update() {

        /* Screen boundaries */

        if (
          this.x + this.size >= window.innerWidth ||
          this.x - this.size <= 0
        ) {
          this.directionX *= -1;
        }

        if (
          this.y + this.size >= window.innerHeight ||
          this.y - this.size <= 0
        ) {
          this.directionY *= -1;
        }


        /* Mouse interaction */

        if (mouse.x !== null && mouse.y !== null) {

          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < mouse.radius && distance > 0) {

            const force =
              (mouse.radius - distance) /
              mouse.radius;

            const pushX = dx / distance;
            const pushY = dy / distance;

            this.x += pushX * force * 1.8;
            this.y += pushY * force * 1.8;
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

      const area =
        window.innerWidth * window.innerHeight;

      let particleCount =
        Math.floor(area / 15000);

      /* Desktop maximum */

      particleCount = Math.min(
        particleCount,
        100
      );

      /* Fewer particles on small screens */

      if (window.innerWidth < 768) {
        particleCount = Math.min(
          particleCount,
          45
        );
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }


    /* --------------------------------------------------------------------------
       Draw Connecting Lines
       -------------------------------------------------------------------------- */

    function drawLines() {

      const maxDistance =
        window.innerWidth < 768
          ? 110
          : 150;

      for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

          const dx =
            particles[a].x -
            particles[b].x;

          const dy =
            particles[a].y -
            particles[b].y;

          const distance =
            Math.sqrt(dx * dx + dy * dy);

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
              `rgba(139, 92, 246, ${opacity * 0.10})`;

            ctx.lineWidth = 0.7;

            ctx.stroke();
          }
        }
      }
    }


    /* --------------------------------------------------------------------------
       Animation
       -------------------------------------------------------------------------- */

    function animate() {

      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      particles.forEach(
        particle => particle.update()
      );

      drawLines();

      animationFrame =
        requestAnimationFrame(animate);
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

    window.addEventListener(
      "touchmove",
      (event) => {

        if (event.touches.length > 0) {

          mouse.x =
            event.touches[0].clientX;

          mouse.y =
            event.touches[0].clientY;
        }

      },
      { passive: true }
    );


    window.addEventListener(
      "touchend",
      () => {

        mouse.x = null;
        mouse.y = null;

      }
    );


    window.addEventListener(
      "resize",
      () => {

        cancelAnimationFrame(animationFrame);
        resizeCanvas();
        animate();

      }
    );


    /* Start particle system */

    resizeCanvas();
    animate();
  }



  /* ==========================================================================
     HEADER & MOBILE NAVIGATION
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

      mobileMenu.style.display = "block";

      requestAnimationFrame(() => {
        mobileMenu.classList.add("open");
      });

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

      setTimeout(() => {

        if (
          !mobileMenu.classList.contains("open")
        ) {
          mobileMenu.style.display = "none";
        }

      }, 400);
    }


    mobileToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          mobileMenu.classList.contains("open");

        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }

      }
    );


    /* Close menu after selecting a section */

    mobileLinks.forEach(link => {

      link.addEventListener(
        "click",
        () => {
          closeMenu();
        }
      );

    });


    /* Close with Escape */

    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Escape" &&
          mobileMenu.classList.contains("open")
        ) {
          closeMenu();
        }

      }
    );


    /* Close if resized to desktop */

    window.addEventListener(
      "resize",
      () => {

        if (window.innerWidth > 900) {
          closeMenu();
        }

      }
    );
  }



  /* ==========================================================================
     SCROLL SYSTEM
     ========================================================================== */

  const header =
    document.getElementById("header");

  const scrollProgress =
    document.getElementById("scroll-progress");

  const sections =
    document.querySelectorAll("main section");

  const navLinks =
    document.querySelectorAll(".nav-link");


  /* --------------------------------------------------------------------------
     Scroll Reveal
     -------------------------------------------------------------------------- */

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
          rootMargin:
            "0px 0px -40px 0px"
        }
      );


    revealElements.forEach(element => {

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach(element => {

      element.classList.add("revealed");

    });
  }



  /* --------------------------------------------------------------------------
     Update Scroll UI
     -------------------------------------------------------------------------- */

  function updateScrollUI() {

    const scrollTop =
      window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;


    /* Scroll progress */

    if (scrollProgress) {

      const progress =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 100
          : 0;

      scrollProgress.style.width =
        `${progress}%`;
    }


    /* Header background */

    if (header) {

      if (scrollTop > 40) {

        header.classList.add(
          "scrolled"
        );

      } else {

        header.classList.remove(
          "scrolled"
        );
      }
    }


    /* Active navigation */

    let currentSection = "";

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - 160;

      const sectionBottom =
        sectionTop +
        section.offsetHeight;

      if (
        scrollTop >= sectionTop &&
        scrollTop < sectionBottom
      ) {
        currentSection =
          section.id;
      }

    });


    navLinks.forEach(link => {

      link.classList.remove("active");

      const target =
        link.getAttribute("href");

      if (
        target === `#${currentSection}`
      ) {
        link.classList.add("active");
      }

    });
  }


  window.addEventListener(
    "scroll",
    updateScrollUI,
    { passive: true }
  );

  updateScrollUI();



  /* ==========================================================================
     PROJECT FILTER SYSTEM
     ========================================================================== */

  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const projectCards =
    document.querySelectorAll(".project-card");


  filterButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        /* Active button */

        filterButtons.forEach(btn => {

          btn.classList.remove(
            "active"
          );

        });

        button.classList.add("active");


        const selectedFilter =
          button.getAttribute(
            "data-filter"
          );


        projectCards.forEach(card => {

          const category =
            card.getAttribute(
              "data-category"
            );


          const shouldShow =
            selectedFilter === "all" ||
            category === selectedFilter;


          if (shouldShow) {

            card.classList.remove(
              "project-hidden"
            );

            card.style.display = "flex";

            requestAnimationFrame(() => {

              card.style.opacity = "1";
              card.style.transform =
                "scale(1)";

            });

          } else {

            card.style.opacity = "0";
            card.style.transform =
              "scale(0.94)";

            setTimeout(() => {

              if (
                card.style.opacity === "0"
              ) {
                card.style.display =
                  "none";
              }

            }, 300);
          }

        });

      }
    );

  });



  /* ==========================================================================
     GLOWING CURSOR EFFECT
     ========================================================================== */

  const glowCards =
    document.querySelectorAll(
      "[data-glow]"
    );


  glowCards.forEach(card => {

    card.addEventListener(
      "mousemove",
      (event) => {

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
      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.style.removeProperty(
          "--mouse-x"
        );

        card.style.removeProperty(
          "--mouse-y"
        );

      }
    );

  });



  /* ==========================================================================
     EMAIL COPY FUNCTIONALITY
     ========================================================================== */

  const copyEmailButton =
    document.getElementById(
      "copy-email-btn"
    );

  const emailElement =
    document.getElementById(
      "email-text"
    );


  if (
    copyEmailButton &&
    emailElement
  ) {

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

          await navigator.clipboard.writeText(
            email
          );


          if (copyIcon) {
            copyIcon.style.display =
              "none";
          }

          if (checkIcon) {
            checkIcon.style.display =
              "block";
          }


          copyEmailButton.setAttribute(
            "aria-label",
            "Email copied"
          );


          setTimeout(() => {

            if (copyIcon) {
              copyIcon.style.display =
                "block";
            }

            if (checkIcon) {
              checkIcon.style.display =
                "none";
            }

            copyEmailButton.setAttribute(
              "aria-label",
              "Copy email to clipboard"
            );

          }, 2000);


        } catch (error) {

          /* Fallback for unsupported browsers */

          const temporaryInput =
            document.createElement(
              "input"
            );

          temporaryInput.value =
            email;

          document.body.appendChild(
            temporaryInput
          );

          temporaryInput.select();

          document.execCommand(
            "copy"
          );

          temporaryInput.remove();

        }

      }
    );
  }



  /* ==========================================================================
     CONTACT FORM VALIDATION
     ========================================================================== */

  const contactForm =
    document.getElementById(
      "contact-form"
    );

  const formStatus =
    document.getElementById(
      "form-status"
    );


  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async (event) => {

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


        /* Message length */

        if (message.length < 10) {

          showFormStatus(
            "Please enter a message with at least 10 characters.",
            "error"
          );

          return;
        }


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
            "Sending...";
        }


        /*
         * IMPORTANT:
         * This currently validates the form locally.
         * To actually receive messages, connect this form
         * to Formspree, Web3Forms, EmailJS, or your own backend.
         */

        setTimeout(() => {

          showFormStatus(
            "Thank you! Your message has been received.",
            "success"
          );

          contactForm.reset();


          if (submitButton) {
            submitButton.disabled =
              false;
          }

          if (submitText) {
            submitText.textContent =
              "Send Message";
          }


          setTimeout(() => {

            if (formStatus) {
              formStatus.style.display =
                "none";
            }

          }, 5000);

        }, 1000);

      }
    );
  }


  /* --------------------------------------------------------------------------
     Form Status Helper
     -------------------------------------------------------------------------- */

  function showFormStatus(
    message,
    type
  ) {

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

  const allAnchorLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  allAnchorLinks.forEach(link => {

    link.addEventListener(
      "click",
      (event) => {

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


        if (target) {

          event.preventDefault();

          const headerHeight =
            header?.offsetHeight || 80;

          const targetPosition =
            target.offsetTop -
            headerHeight -
            15;


          window.scrollTo({
            top:
              Math.max(
                targetPosition,
                0
              ),
            behavior: "smooth"
          });

        }

      }
    );

  });



  /* ==========================================================================
     RESUME / GET IN TOUCH BUTTON
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
         * The HTML currently uses this button
         * as "Get in Touch", so it scrolls
         * naturally to the contact section.
         */

      }
    );
  }



  /* ==========================================================================
     ACCESSIBILITY — REDUCED MOTION
     ========================================================================== */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  if (prefersReducedMotion.matches) {

    document
      .querySelectorAll(".scroll-reveal")
      .forEach(element => {

        element.classList.add(
          "revealed"
        );

      });

  }

});
```
