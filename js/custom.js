(function () {
    var body = document.body;
    var nav = document.querySelector("[data-nav]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var sections = navLinks
        .map(function (link) {
            var id = link.getAttribute("href");
            return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
        })
        .filter(Boolean);

    function closeNav() {
        if (!nav || !toggle) return;
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            nav.classList.toggle("is-open", !expanded);
            body.classList.toggle("nav-open", !expanded);
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeNav();
    });

    var year = document.querySelector("[data-year]");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    function setActiveSection() {
        var marker = window.scrollY + 130;
        var active = sections[0];

        sections.forEach(function (section) {
            if (section.offsetTop <= marker) {
                active = section;
            }
        });

        navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + active.id);
        });
    }

    setActiveSection();
    window.addEventListener("scroll", setActiveSection, { passive: true });

    var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
    }

    // Counter Animation
    var counters = Array.prototype.slice.call(document.querySelectorAll(".counter"));

    function animateCounter(counter) {
        var target = parseInt(counter.getAttribute("data-target"), 10);
        var current = 0;
        var increment = Math.max(1, Math.ceil(target / 60));

        function updateCounter() {
            current += increment;

            if (current >= target) {
                counter.textContent = target;
                return;
            }

            counter.textContent = current;
            requestAnimationFrame(updateCounter);
        }

        updateCounter();
    }

    if ("IntersectionObserver" in window) {
        var counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    var form = document.getElementById("emailForm");
    var status = document.querySelector("[data-form-status]");

    if (form && status) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            status.textContent = "Sending your message...";

            var request = new XMLHttpRequest();
            request.open("POST", form.getAttribute("action"), true);

            request.onreadystatechange = function () {
                if (request.readyState !== 4) return;

                if (request.status >= 200 && request.status < 300) {
                    form.reset();
                    status.textContent = "Thank you. Ambros will get in touch with you soon.";
                } else {
                    status.textContent = "We could not send the message here. Please call 0935-522-0144 or email sales@ambrosilocoscornik.com.";
                }
            };

            request.onerror = function () {
                status.textContent = "We could not send the message here. Please call 0935-522-0144 or email sales@ambrosilocoscornik.com.";
            };

            request.send(new FormData(form));
        });
    }
})();