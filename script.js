/* ============================================================
   SHAURYA MITTAL
   PERSONAL DEVELOPER IDENTITY
   Advanced Interactive JavaScript
   File: script.js
   Version: 1.0.0
   ============================================================ */

"use strict";

/* ============================================================
   01. CONFIGURATION
   ============================================================ */

const SITE_CONFIG = Object.freeze({
    name: "Shaurya Mittal",
    username: "shaurya1233",
    repository: "shaurya1233",
    animationDuration: 450,
    scrollOffset: 90,
    revealThreshold: 0.12,
    enableRevealAnimations: true,
    enableActiveNavigation: true,
    enableBackToTop: true,
    enableCopyButtons: true,
    enableProjectFilters: true
});


/* ============================================================
   02. DOM UTILITIES
   ============================================================ */

const DOM = {
    select(selector, parent = document) {
        return parent.querySelector(selector);
    },

    selectAll(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
    },

    create(tag, className = "", text = "") {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text) {
            element.textContent = text;
        }

        return element;
    },

    exists(selector) {
        return Boolean(document.querySelector(selector));
    }
};


/* ============================================================
   03. APPLICATION STATE
   ============================================================ */

const AppState = {
    initialized: false,
    scrollPosition: 0,
    lastScrollPosition: 0,
    activeSection: null,
    observers: [],
    notificationTimer: null
};


/* ============================================================
   04. INITIALIZATION
   ============================================================ */

function initializeApplication() {
    if (AppState.initialized) return;

    AppState.initialized = true;

    initializeCurrentYear();
    initializeSmoothNavigation();
    initializeActiveNavigation();
    initializeScrollEffects();
    initializeRevealAnimations();
    initializeCopyButtons();
    initializeProjectFilters();
    initializeBackToTop();
    initializeExternalLinks();
    initializeKeyboardAccessibility();
    initializePageMetadata();

    document.documentElement.classList.add("js-enabled");

    window.dispatchEvent(
        new CustomEvent("shaurya:ready", {
            detail: {
                name: SITE_CONFIG.name,
                version: "1.0.0"
            }
        })
    );
}


/* ============================================================
   05. AUTOMATIC COPYRIGHT YEAR
   ============================================================ */

function initializeCurrentYear() {
    const year = new Date().getFullYear();

    DOM.selectAll("[data-current-year]").forEach(element => {
        element.textContent = String(year);
    });

    DOM.selectAll(".footer-copyright").forEach(element => {
        if (element.hasAttribute("data-current-year")) {
            element.textContent = `© ${year} ${SITE_CONFIG.name}.`;
        }
    });
}


/* ============================================================
   06. SMOOTH NAVIGATION
   ============================================================ */

function initializeSmoothNavigation() {
    DOM.selectAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.getElementById(
                decodeURIComponent(targetId.slice(1))
            );

            if (!target) return;

            event.preventDefault();

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                SITE_CONFIG.scrollOffset;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: prefersReducedMotion() ? "instant" : "smooth"
            });

            if (history.replaceState) {
                history.replaceState(null, "", targetId);
            }
        });
    });
}


/* ============================================================
   07. ACTIVE NAVIGATION
   ============================================================ */

function initializeActiveNavigation() {
    if (!SITE_CONFIG.enableActiveNavigation) return;

    const sections = DOM.selectAll("main section[id]");
    const navigationLinks = DOM.selectAll(
        '.nav-links a[href^="#"]'
    );

    if (!sections.length || !navigationLinks.length) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const activeId = entry.target.id;

            AppState.activeSection = activeId;

            navigationLinks.forEach(link => {
                const isActive =
                    link.getAttribute("href") === `#${activeId}`;

                link.classList.toggle("active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }, {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));

    AppState.observers.push(observer);
}


/* ============================================================
   08. SCROLL EFFECTS
   ============================================================ */

function initializeScrollEffects() {
    let ticking = false;

    function updateScrollState() {
        AppState.scrollPosition = window.scrollY;

        document.documentElement.classList.toggle(
            "has-scrolled",
            AppState.scrollPosition > 40
        );

        document.documentElement.style.setProperty(
            "--scroll-progress",
            `${getScrollProgress()}%`
        );

        AppState.lastScrollPosition = AppState.scrollPosition;

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(updateScrollState);
    }, {
        passive: true
    });

    updateScrollState();
}

function getScrollProgress() {
    const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (scrollableHeight <= 0) return 0;

    return Math.min(
        100,
        Math.max(0, (window.scrollY / scrollableHeight) * 100)
    );
}


/* ============================================================
   09. REVEAL ANIMATIONS
   ============================================================ */

function initializeRevealAnimations() {
    if (!SITE_CONFIG.enableRevealAnimations) return;

    const elements = DOM.selectAll("[data-reveal]");

    if (!elements.length) return;

    if (
        prefersReducedMotion() ||
        !("IntersectionObserver" in window)
    ) {
        elements.forEach(element => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
        });
    }, {
        threshold: SITE_CONFIG.revealThreshold,
        rootMargin: "0px 0px -35px 0px"
    });

    elements.forEach((element, index) => {
        element.style.setProperty(
            "--reveal-index",
            String(index % 6)
        );

        observer.observe(element);
    });

    AppState.observers.push(observer);
}


/* ============================================================
   10. COPY TO CLIPBOARD
   ============================================================ */

function initializeCopyButtons() {
    if (!SITE_CONFIG.enableCopyButtons) return;

    DOM.selectAll("[data-copy]").forEach(button => {
        button.addEventListener("click", async () => {
            const value = button.getAttribute("data-copy");

            if (!value) return;

            try {
                await copyText(value);

                showNotification("Copied to clipboard.");

                button.classList.add("is-copied");

                const originalText =
                    button.dataset.originalText ||
                    button.textContent;

                button.dataset.originalText = originalText;
                button.textContent = "Copied!";

                window.setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove("is-copied");
                }, 1600);

            } catch (error) {
                console.error("Clipboard operation failed:", error);

                showNotification(
                    "Copy unavailable. Please copy manually."
                );
            }
        });
    });
}

async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(value);
    }

    const textarea = DOM.create("textarea");

    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();

    const successful = document.execCommand("copy");

    textarea.remove();

    if (!successful) {
        throw new Error("Copy command unsuccessful.");
    }
}


/* ============================================================
   11. NOTIFICATION SYSTEM
   ============================================================ */

function showNotification(message) {
    let notification = DOM.select("#site-notification");

    if (!notification) {
        notification = DOM.create(
            "div",
            "site-notification"
        );

        notification.id = "site-notification";
        notification.setAttribute("role", "status");
        notification.setAttribute("aria-live", "polite");

        document.body.appendChild(notification);
    }

    notification.textContent = message;

    notification.classList.add("is-visible");

    window.clearTimeout(AppState.notificationTimer);

    AppState.notificationTimer = window.setTimeout(() => {
        notification.classList.remove("is-visible");
    }, 2500);
}


/* ============================================================
   12. PROJECT FILTERING
   ============================================================ */

function initializeProjectFilters() {
    if (!SITE_CONFIG.enableProjectFilters) return;

    const filterButtons = DOM.selectAll("[data-filter]");
    const projectCards = DOM.selectAll("[data-category]");

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedFilter =
                button.getAttribute("data-filter");

            if (!selectedFilter) return;

            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;

                filterButton.classList.toggle(
                    "is-active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            projectCards.forEach(card => {
                const categories = (
                    card.getAttribute("data-category") || ""
                )
                    .split(/\s+/)
                    .filter(Boolean);

                const shouldShow =
                    selectedFilter === "all" ||
                    categories.includes(selectedFilter);

                card.hidden = !shouldShow;
            });
        });
    });
}


/* ============================================================
   13. BACK TO TOP
   ============================================================ */

function initializeBackToTop() {
    if (!SITE_CONFIG.enableBackToTop) return;

    const button = DOM.select("[data-back-to-top]");

    if (!button) return;

    button.hidden = true;

    function updateButton() {
        button.hidden = window.scrollY < 450;
    }

    window.addEventListener("scroll", updateButton, {
        passive: true
    });

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "instant" : "smooth"
        });
    });

    updateButton();
}


/* ============================================================
   14. EXTERNAL LINK SECURITY
   ============================================================ */

function initializeExternalLinks() {
    DOM.selectAll('a[target="_blank"]').forEach(link => {
        const currentRel = new Set(
            (link.getAttribute("rel") || "")
                .split(/\s+/)
                .filter(Boolean)
        );

        currentRel.add("noopener");
        currentRel.add("noreferrer");

        link.setAttribute(
            "rel",
            [...currentRel].join(" ")
        );
    });
}


/* ============================================================
   15. KEYBOARD ACCESSIBILITY
   ============================================================ */

function initializeKeyboardAccessibility() {
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            document.activeElement?.blur();
        }
    });

    DOM.selectAll("[data-pressable]").forEach(element => {
        if (element.matches("button, a")) return;

        element.setAttribute("tabindex", "0");
        element.setAttribute("role", "button");

        element.addEventListener("keydown", event => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                element.click();
            }
        });
    });
}


/* ============================================================
   16. PAGE METADATA
   ============================================================ */

function initializePageMetadata() {
    document.documentElement.setAttribute(
        "data-site",
        SITE_CONFIG.username
    );

    document.documentElement.setAttribute(
        "data-site-version",
        "1.0.0"
    );
}


/* ============================================================
   17. MOTION PREFERENCE
   ============================================================ */

function prefersReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
}


/* ============================================================
   18. PUBLIC APPLICATION API
   ============================================================ */

window.ShauryaSite = Object.freeze({
    version: "1.0.0",

    getScrollProgress,

    showNotification,

    copyText,

    getActiveSection() {
        return AppState.activeSection;
    },

    getConfiguration() {
        return SITE_CONFIG;
    }
});


/* ============================================================
   19. START APPLICATION
   ============================================================ */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApplication,
        { once: true }
    );
} else {
    initializeApplication();
}


/* ============================================================
   END OF SCRIPT
   SHAURYA MITTAL
   ============================================================ */
