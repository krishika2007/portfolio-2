document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     LUCIDE ICONS
  ========================= */

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }


  /* =========================
     PARTICLE BACKGROUND
  ========================= */

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


    function resizeCanvas() {

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles();
    }


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


      update() {

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


        if (mouse.x !== null && mouse.y !== null) {

          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;

          const distance =
            Math.sqrt(dx * dx + dy * dy);

          if (
            distance < mouse.radius &&
            distance > 0
          ) {

            const force =
              (mouse.radius - distance) /
              mouse.radius;

            this.x +=
              (dx / distance) *
              force *
              1.8;

            this.y +=
              (dy / distance) *
              force *
              1.8;
          }
        }


        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
      }
    }


    function initParticles() {

      particles = [];

      const area =
        window.innerWidth *
        window.innerHeight;

      let particleCount =
        Math.floor(area / 15000);

      particleCount =
        Math.min(particleCount, 100);

      if (window.innerWidth < 768) {

        particleCount =
          Math.min(particleCount, 45);
      }

      for (
        let i = 0;
        i < particleCount;
        i++
      ) {

        particles.push(
          new Particle()
        );
      }
    }


    function drawLines() {

      const maxDistance =
        window.innerWidth < 768
          ? 110
          : 150;

      for (
        let a = 0;
        a < particles.length;
        a++
      ) {

        for (
          let b = a + 1;
          b < particles.length;
          b++
        ) {

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


    window.addEventListener(
      "mousemove",
      event => {

        mouse.x = event.clientX;
        mouse.y = event.clientY;
      }
    );


    window.addEventListener(
      "mouseleave",
      () => {

        mouse.x = null;
        mouse.y = null;
      }
    );


    window.addEventListener(
      "touchmove",
      event => {

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


    resizeCanvas();

    animate();
  }


  /* =========================
     MOBILE MENU
  ========================= */

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

      document.body.classList.add(
        "menu-open"
      );
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

      document.body.classList.remove(
        "menu-open"
      );

      setTimeout(() => {

        if (
          !mobileMenu.classList.contains("open")
        ) {

          mobileMenu.style.display =
            "none";
        }

      }, 400);
    }


    mobileToggle.addEventListener(
      "click",
      () => {

        if (
          mobileMenu.classList.contains("open")
        ) {

          closeMenu();

        } else {

          openMenu();
        }
      }
    );


    mobileLinks.forEach(link => {

      link.addEventListener(
        "click",
        closeMenu
      );
    });


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          mobileMenu.classList.contains("open")
        ) {

          closeMenu();
        }
      }
    );


    window.addEventListener(
      "resize",
      () => {

        if (window.innerWidth > 900) {

          closeMenu();
        }
      }
    );
  }


  /* =========================
     SCROLL SYSTEM
  ========================= */

  const header =
    document.getElementById("header");

  const scrollProgress =
    document.getElementById(
      "scroll-progress"
    );

  const sections =
    document.querySelectorAll(
      "main section"
    );

  const navLinks =
    document.querySelectorAll(
      ".nav-link"
    );


  /* =========================
     SCROLL REVEAL
  ========================= */

  const revealElements =
    document.querySelectorAll(
      ".scroll-reveal"
    );


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


    revealElements.forEach(
      element => {

        revealObserver.observe(
          element
        );
      }
    );

  } else {

    revealElements.forEach(
      element => {

        element.classList.add(
          "revealed"
        );
      }
    );
  }


  /* =========================
     SCROLL UI
  ========================= */

  function updateScrollUI() {

    const scrollTop =
      window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;


    if (scrollProgress) {

      const progress =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 100
          : 0;

      scrollProgress.style.width =
        `${progress}%`;
    }


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

      link.classList.remove(
        "active"
      );

      const target =
        link.getAttribute("href");

      if (
        target ===
        `#${currentSection}`
      ) {

        link.classList.add(
          "active"
        );
      }
    });
  }


  window.addEventListener(
    "scroll",
    updateScrollUI,
    { passive: true }
  );

  updateScrollUI();


  /* =========================
     PROJECT FILTER
  ========================= */

  const filterButtons =
    document.querySelectorAll(
      ".filter-btn"
    );

  const projectCards =
    document.querySelectorAll(
      ".project-card"
    );


  filterButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        filterButtons.forEach(
          btn => {

            btn.classList.remove(
              "active"
            );
          }
        );

        button.classList.add(
          "active"
        );


        const selectedFilter =
          button.getAttribute(
            "data-filter"
          );


        projectCards.forEach(
          card => {

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

              card.style.display =
                "flex";

              requestAnimationFrame(
                () => {

                  card.style.opacity =
                    "1";

                  card.style.transform =
                    "scale(1)";
                }
              );

            } else {

              card.style.opacity =
                "0";

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
          }
        );
      }
    );
  });


  /* =========================
     GLOW EFFECT
  ========================= */

  const glowCards =
    document.querySelectorAll(
      "[data-glow]"
    );


  glowCards.forEach(card => {

    card.addEventListener(
      "mousemove",
      event => {

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


  /* =========================
     COPY EMAIL
  ========================= */

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

        } catch (error) {

          const input =
            document.createElement(
              "input"
            );

          input.value = email;

          document.body.appendChild(
            input
          );

          input.select();

          document.execCommand(
            "copy"
          );

          input.remove();
        }


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
      }
    );
  }


  /* =========================
     CONTACT FORM
  ========================= */

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


        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

          showFormStatus(
            "Please enter a valid email address.",
            "error"
          );

          return;
        }


        if (message.length < 10) {

          showFormStatus(
            "Please enter at least 10 characters.",
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
          submitButton.disabled =
            true;
        }

        if (submitText) {
          submitText.textContent =
            "Sending...";
        }


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

        }, 1000);
      }
    );
  }


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


  /* =========================
     SMOOTH SCROLL
  ========================= */

  const allAnchorLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  allAnchorLinks.forEach(link => {

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


        if (target) {

          event.preventDefault();

          const headerHeight =
            header?.offsetHeight || 80;

          const targetPosition =
            target.offsetTop -
            headerHeight -
            15;


          window.scrollTo({
            top: Math.max(
              targetPosition,
              0
            ),
            behavior: "smooth"
          });
        }
      }
    );
  });


  /* =========================
     REDUCED MOTION
  ========================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  if (prefersReducedMotion.matches) {

    document
      .querySelectorAll(
        ".scroll-reveal"
      )
      .forEach(element => {

        element.classList.add(
          "revealed"
        );
      });
  }

});
