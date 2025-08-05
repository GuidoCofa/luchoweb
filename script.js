// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeApp()
  } catch (error) {
    console.error("Error durante la inicialización de la aplicación:", error)
  }
})

function initializeApp() {
  console.log("Initializing app...")
  const initialSection = document.getElementById("principal")
  if (initialSection) {
    initialSection.classList.add("active")
  }

  initNavigation()
  initImageModal()

  console.log("🎧 Lucho Chávez - Portfolio minimalista cargado")
}

function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".section")
  const sidebar = document.querySelector(".sidebar")
  const topNavbar = document.querySelector(".top-navbar")
  const mainContent = document.querySelector(".main-content")
  const heroImageWrapper = document.querySelector(".hero-image-wrapper")

  // Create mobile menu button if it doesn't exist
  let mobileMenuBtn = document.querySelector(".mobile-menu")
  if (!mobileMenuBtn) {
    mobileMenuBtn = document.createElement("button")
    mobileMenuBtn.className = "mobile-menu"
    mobileMenuBtn.innerHTML = "☰"
    document.body.appendChild(mobileMenuBtn)
  }

  const updateLayout = (sectionId) => {
    const isMobile = window.innerWidth <= 768;

    // Pausar y reiniciar videos de la sección que se desactiva
    const currentActiveSectionElement = document.querySelector(".section.active");
    if (currentActiveSectionElement && currentActiveSectionElement.id !== sectionId) {
      const videosInInactiveSection = currentActiveSectionElement.querySelectorAll("video");
      videosInInactiveSection.forEach((video) => {
        video.pause();
        video.currentTime = 0;
        video.load(); // Use .load() to reset and show poster
      });
    }

    sections.forEach((s) => s.classList.remove("active"));

    if (!isMobile) {
      // Desktop behavior
      if (sectionId === "principal") {
        sidebar.classList.remove("hidden");
        sidebar.classList.add("visible");
        topNavbar.classList.remove("visible");
        topNavbar.classList.add("hidden");
        mainContent.classList.remove("with-top-navbar");
        mainContent.classList.add("with-sidebar");
      } else {
        sidebar.classList.remove("visible");
        sidebar.classList.add("hidden");
        topNavbar.classList.remove("hidden");
        topNavbar.classList.add("visible");
        mainContent.classList.remove("with-sidebar");
        mainContent.classList.add("with-top-navbar");
      }
    } else {
      // Mobile behavior
      // Top navbar is always visible on mobile
      topNavbar.classList.remove("hidden");
      topNavbar.classList.add("visible");
      mainContent.classList.remove("with-sidebar", "with-top-navbar"); // Always full width

      // Sidebar visibility on mobile based on sectionId
      if (sectionId === "principal") {
        sidebar.classList.add("open"); // Open sidebar by default on 'principal'
        mobileMenuBtn.innerHTML = "✕"; // Show close icon
      } else {
        sidebar.classList.remove("open"); // Close sidebar on other sections
        mobileMenuBtn.innerHTML = "☰"; // Show hamburger icon
      }
    }

    // Hero image visibility logic (applies to both mobile and desktop)
    if (heroImageWrapper) {
      if (sectionId === "principal") {
        heroImageWrapper.classList.remove("hidden");
      } else {
        heroImageWrapper.classList.add("hidden");
      }
    }

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      navLinks.forEach((l) => l.classList.remove("active"))
      const sectionId = this.getAttribute("data-section")
      document.querySelectorAll(`[data-section="${sectionId}"]`).forEach((el) => el.classList.add("active"))
      updateLayout(sectionId)
      if (window.innerWidth <= 768 && sidebar.classList.contains("open") && sectionId !== "principal") {
        // Only close sidebar if not on principal section on mobile
        sidebar.classList.remove("open")
        mobileMenuBtn.innerHTML = "☰"
      }
    })
  })

  mobileMenuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open")
    this.innerHTML = sidebar.classList.contains("open") ? "✕" : "☰"
  })

  document.addEventListener("click", (e) => {
    // Check if click is outside sidebar and mobile menu button when sidebar is open on mobile
    if (
      window.innerWidth <= 768 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      sidebar.classList.remove("open")
      mobileMenuBtn.innerHTML = "☰"
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open")
      mobileMenuBtn.innerHTML = "☰"
    }
  })

  // Initial layout update on load
  const initialActiveSection = document.querySelector(".nav-link.active")?.getAttribute("data-section") || "principal"
  updateLayout(initialActiveSection)

  // Handle resize events to adjust layout
  window.addEventListener("resize", () => {
    const currentSectionId = document.querySelector(".section.active")?.id || "principal";
    updateLayout(currentSectionId); // Re-evaluate layout on resize based on current section
    if (window.innerWidth > 768 && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open"); // Close sidebar if resized to desktop
      mobileMenuBtn.innerHTML = "☰";
    }
  });
}

document.documentElement.style.scrollBehavior = "smooth"

window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease"
  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

function initImageModal() {
  const modal = document.getElementById("imageModal")
  const modalImg = document.getElementById("modalImage")
  const modalCaption = document.getElementById("modalCaption")
  const closeModalBtn = document.querySelector(".image-modal-close")
  // Select all photo items that can open the modal
  const photoItems = document.querySelectorAll(".photo-gallery-item, .large-photo-item")

  if (modal && modalImg && closeModalBtn) {
    photoItems.forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img")
        const altText = img.getAttribute("alt")
        modal.classList.add("active")
        modalImg.src = img.src
        if (modalCaption) {
          modalCaption.textContent = altText
        }
        document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
      })
    })

    const closeModalFunction = () => {
      modal.classList.remove("active")
      document.body.style.overflow = "auto" // Restore scrolling
    }

    closeModalBtn.addEventListener("click", closeModalFunction)

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModalFunction()
      }
    })

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModalFunction()
      }
    })
  }
}
