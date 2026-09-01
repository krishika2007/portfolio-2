document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       LUCIDE ICONS
    ========================== */

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }


    /* =========================
       NAVBAR SCROLL EFFECT
    ========================== */

    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }


    /* =========================
       MOBILE MENU
    ========================== */

    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");

            const isOpen = mobileMenu.classList.contains("open");

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

            menuButton.innerHTML = isOpen
                ? '<i data-lucide="x"></i>'
                : '<i data-lucide="menu"></i>';

            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        });


        /* Close mobile menu after clicking a link */

        mobileMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");

                menuButton.setAttribute(
                    "aria-label",
                    "Open menu"
                );

                menuButton.innerHTML =
                    '<i data-lucide="menu"></i>';

                if (typeof lucide !== "undefined") {
                    lucide.createIcons();
                }
            });

        });

    }


    /* =========================
       ACTIVE NAVIGATION
    ========================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    function updateActiveNavigation() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 180;

            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                currentSection = section.getAttribute("id");
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );

    updateActiveNavigation();


    /* =========================
       SMOOTH SCROLL
    ========================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =========================
       SCROLL REVEAL
    ========================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (
        "IntersectionObserver" in window &&
        revealElements.length > 0
    ) {

        const observer =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =========================
       CLOSE MENU ON RESIZE
    ========================== */

    window.addEventListener("resize", () => {

        if (
            window.innerWidth > 900 &&
            mobileMenu
        ) {

            mobileMenu.classList.remove("open");

            if (menuButton) {

                menuButton.setAttribute(
                    "aria-label",
                    "Open menu"
                );

                menuButton.innerHTML =
                    '<i data-lucide="menu"></i>';

                if (typeof lucide !== "undefined") {
                    lucide.createIcons();
                }

            }

        }

    });


    /* =========================
       EMAIL LINKS
    ========================== */

    document
        .querySelectorAll('a[href^="mailto:"]')
        .forEach(link => {

            link.addEventListener("click", () => {
                console.log(
                    "Opening email client..."
                );
            });

        });


    /* =========================
       CURRENT YEAR
    ========================== */

    const yearElements =
        document.querySelectorAll("[data-year]");

    yearElements.forEach(element => {
        element.textContent =
            new Date().getFullYear();
    });

});
