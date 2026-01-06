// Wait for all libraries to be loaded
window.addEventListener("load", () => {
  // Register plugins
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-panel");
  const closeBtn = document.querySelector(".nav-close");
  const items = document.querySelectorAll(".nav-item");
  const lines = toggle.querySelectorAll("div");

  let isOpen = false;

  // Set initial state of panel and items
  gsap.set(panel, { scale: 0 });
  gsap.set(closeBtn, { opacity: 0 });
  gsap.set(items, { y: 20, opacity: 0 });

  const tl = gsap.timeline({ paused: true });

  tl.to(panel, {
    scale: 1,
    duration: 0.4,
    ease: "power3.out"
  }, 0)
  .to(closeBtn, {
    opacity: 1,
    duration: 0.4
  }, 0)
  .to(items, {
    y: 0,
    opacity: 1,
    stagger: 0.08,
    duration: 0.4
  }, 0.1)
  .to(lines[0], { rotate: 45 }, 0)
  .to(lines[1], { rotate: -45 }, 0);

  const closeMenu = () => {
    tl.reverse();
    isOpen = false;
  };

  const openMenu = () => {
    tl.play();
    isOpen = true;
  };

  const toggleMenu = () => {
    isOpen ? closeMenu() : openMenu();
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  closeBtn.addEventListener("click", closeMenu);
  
  // Close menu when clicking on nav items
  items.forEach(item => {
    item.addEventListener("click", (e) => {
      closeMenu();
      // Handle smooth scrolling
      const href = item.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          gsap.to(window, {
            scrollTo: {
              y: targetElement,
              autoKill: false
            },
            duration: 1,
            ease: "power2.inOut"
          });
        }
      }
    });
  });

  // Skew effect on scroll
  if (typeof gsap !== 'undefined' && typeof ScrollSmoother !== 'undefined') {
    let skewSetter = gsap.quickTo(".images img", "skewY"), // fast - only target images in .images section
      clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees.

    ScrollSmoother.create({
      wrapper: "#wrapper",
      content: "#content",
      smooth: 2,
      effects: true,
      onUpdate: self => skewSetter(clamp(self.getVelocity() / -300)),
      onStop: () => skewSetter(0)
    });

    // Animate H1 titles up when reaching the bio/projects section
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.to(".text", {
      scrollTrigger: {
        trigger: ".content-bottom",
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
        markers: false
      },
      y: -500,
      opacity: 0,
      pointerEvents: "none",
      ease: "power2.inOut"
    });

    console.log("ScrollSmoother initialized successfully");
  } else {
    console.error("GSAP or ScrollSmoother not loaded");
  }

  // Modal functionality for selected works
  const seeMoreBtns = document.querySelectorAll(".see-more-btn");
  const modals = document.querySelectorAll(".modal");
  const modalCloseButtons = document.querySelectorAll(".modal-close");

  // Open modal when clicking "SEE MORE+"
  seeMoreBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const workId = btn.getAttribute("data-work");
      const modal = document.getElementById(`modal-${workId}`);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal when clicking the close button
  modalCloseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // Close modal when clicking outside the modal-content
  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modals.forEach(modal => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      });
    }
  });
});


