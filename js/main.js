(function () {
  "use strict";

  var HEADER_OFFSET = 20;

  function headerHeight() {
    var header = document.querySelector(".site-header");
    return header ? header.offsetHeight + HEADER_OFFSET : 0;
  }

  function scrollToId(id) {
    var target = document.getElementById(id);
    if (!target) return false;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight();
    window.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var primaryNav = document.getElementById("primary-nav");

  function closeNav() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      primaryNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });
  }

  /* ---------- Mobile dropdown (Providers) toggle ---------- */
  var dropdownParents = document.querySelectorAll(".has-dropdown");
  dropdownParents.forEach(function (parent) {
    var link = parent.querySelector(":scope > a");
    if (!link) return;

    link.addEventListener("click", function (event) {
      var isMobile = window.matchMedia("(max-width: 760px)").matches;
      if (!isMobile) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      var isOpen = parent.classList.contains("is-open");
      dropdownParents.forEach(function (p) {
        p.classList.remove("is-open");
      });
      parent.classList.toggle("is-open", !isOpen);
    });
  });

  /* ---------- Smooth scroll for in-page + cross-page anchors ---------- */
  document.querySelectorAll('a[href*="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var href = link.getAttribute("href") || "";
      var hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      var pathPart = href.slice(0, hashIndex);
      var hash = href.slice(hashIndex + 1);
      if (!hash) return;

      var currentPath = window.location.pathname.split("/").pop() || "index.html";
      var linkPath = pathPart || currentPath;
      var isSamePage = linkPath === currentPath || (linkPath === "" && (currentPath === "index.html" || currentPath === ""));

      if (!isSamePage) {
        return; // let the browser navigate, then hash-scroll runs on load
      }

      var scrolled = scrollToId(hash);
      if (scrolled) {
        event.preventDefault();
        history.pushState(null, "", "#" + hash);
      }
      closeNav();
      dropdownParents.forEach(function (p) {
        p.classList.remove("is-open");
      });
    });
  });

  /* ---------- On load, smooth-scroll to any hash target ---------- */
  window.addEventListener("load", function () {
    if (window.location.hash) {
      var id = window.location.hash.slice(1);
      window.setTimeout(function () {
        scrollToId(id);
      }, 0);
    }
  });

  /* ---------- "Home" link on the homepage itself scrolls to top ---------- */
  document.querySelectorAll('[data-scroll-top]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var currentPath = window.location.pathname.split("/").pop() || "index.html";
      if (currentPath === "index.html" || currentPath === "") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeNav();
      }
    });
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Contact form (client-side placeholder handling) ---------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      var wrapper = contactForm.closest(".contact-form");
      if (wrapper) {
        wrapper.classList.add("is-submitted");
        var success = wrapper.querySelector(".form-success");
        if (success) {
          success.classList.add("is-visible");
          success.setAttribute("tabindex", "-1");
          success.focus();
        }
      }
    });
  }

  /* ---------- Close mobile nav on escape ---------- */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNav();
    }
  });
})();
