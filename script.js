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

  console.log("🎧 Lucho Chávez - Portfolio minimalista cargado")
}

function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link, .homepage-nav-link")
  const sections = document.querySelectorAll(".section")
  const sidebar = document.querySelector(".sidebar")
  const topNavbar = document.querySelector(".top-navbar")
  const mainContent = document.querySelector(".main-content")
  const heroImageWrapper = document.querySelector(".hero-image-wrapper")
  const mobileOverlay = document.querySelector(".mobile-overlay")

  // Get mobile menu button (now in HTML)
  const mobileMenuBtn = document.querySelector(".mobile-menu")

  const updateLayout = (sectionId) => {
    const isMobile = window.innerWidth <= 768

    // Pausar y reiniciar videos de la sección que se desactiva
    const currentActiveSectionElement = document.querySelector(".section.active")
    if (currentActiveSectionElement && currentActiveSectionElement.id !== sectionId) {
      const videosInInactiveSection = currentActiveSectionElement.querySelectorAll("video")
      videosInInactiveSection.forEach((video) => {
        video.pause()
        video.currentTime = 0
        video.load() // Use .load() to reset and show poster
      })
    }

    sections.forEach((s) => s.classList.remove("active"))

    if (!isMobile) {
      // Desktop behavior
      if (sectionId === "principal") {
        // Homepage: hide both sidebar and top navbar
        sidebar.classList.remove("visible")
        sidebar.classList.add("hidden")
        topNavbar.classList.remove("visible")
        topNavbar.classList.add("hidden")
        mainContent.classList.remove("with-sidebar", "with-top-navbar")
      } else {
        // Other sections: hide sidebar, show top navbar
        sidebar.classList.remove("visible")
        sidebar.classList.add("hidden")
        topNavbar.classList.remove("hidden")
        topNavbar.classList.add("visible")
        mainContent.classList.remove("with-sidebar")
        mainContent.classList.add("with-top-navbar")
      }
    } else {
      // Mobile behavior - hide top navbar, show only sidebar when opened
      topNavbar.classList.remove("visible")
      topNavbar.classList.add("hidden")
      mainContent.classList.remove("with-sidebar", "with-top-navbar") // Always full width

      // On mobile, sidebar is hidden by default and shown with menu button
      sidebar.classList.remove("open") // Close sidebar by default
      if (mobileOverlay) {
        mobileOverlay.classList.remove("active")
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = "☰" // Show hamburger icon
      }
    }

    // Hero image is always hidden now (using new homepage layout)
    if (heroImageWrapper) {
      heroImageWrapper.classList.add("hidden")
    }

    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
      targetSection.classList.add("active")
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 50)
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      navLinks.forEach((l) => l.classList.remove("active"))
      const sectionId = this.getAttribute("data-section")
      document.querySelectorAll(`[data-section="${sectionId}"]`).forEach((el) => el.classList.add("active"))
      updateLayout(sectionId)
      if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
        // Close sidebar after navigation on mobile
        sidebar.classList.remove("open")
        if (mobileOverlay) {
          mobileOverlay.classList.remove("active")
        }
        if (mobileMenuBtn) {
          mobileMenuBtn.innerHTML = "☰"
        }
      }
    })
  })

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open")
      if (mobileOverlay) {
        mobileOverlay.classList.toggle("active")
      }
      this.innerHTML = sidebar.classList.contains("open") ? "✕" : "☰"
    })
  }

  document.addEventListener("click", (e) => {
    // Check if click is outside sidebar and mobile menu button when sidebar is open on mobile
    if (
      window.innerWidth <= 768 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      (!mobileMenuBtn || !mobileMenuBtn.contains(e.target))
    ) {
      sidebar.classList.remove("open")
      if (mobileOverlay) {
        mobileOverlay.classList.remove("active")
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = "☰"
      }
    }
  })

  // Close sidebar when clicking overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => {
      sidebar.classList.remove("open")
      mobileOverlay.classList.remove("active")
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = "☰"
      }
    })
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open")
      if (mobileOverlay) {
        mobileOverlay.classList.remove("active")
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = "☰"
      }
    }
  })

  // Initial layout update on load
  const initialActiveSection = document.querySelector(".nav-link.active")?.getAttribute("data-section") || "principal"
  updateLayout(initialActiveSection)

  // Handle resize events to adjust layout
  window.addEventListener("resize", () => {
    const currentSectionId = document.querySelector(".section.active")?.id || "principal"
    updateLayout(currentSectionId) // Re-evaluate layout on resize based on current section
    if (window.innerWidth > 768 && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open") // Close sidebar if resized to desktop
      if (mobileOverlay) {
        mobileOverlay.classList.remove("active")
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = "☰"
      }
    }
  })
}

document.documentElement.style.scrollBehavior = "smooth"

window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease"
  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

// ====================================
// Contador de visitas global (Firebase)
// ====================================

// 1) Configuración de Firebase (compat)
//    Asegúrate de haber cargado antes firebase-app-compat.js y firebase-database-compat.js
const firebaseConfig = {
  apiKey: "AIzaSyCc0sRr0_Rxh-KRojw7hufaGXr9IaLqAYI",
  authDomain: "luchoweb-7d1d6.firebaseapp.com",
  databaseURL: "https://luchoweb-7d1d6-default-rtdb.firebaseio.com",
  projectId: "luchoweb-7d1d6",
  storageBucket: "luchoweb-7d1d6.appspot.com",
  messagingSenderId: "618672046355",
  appId: "1:618672046355:web:e52d33854123e9a20f9ae6",
  measurementId: "G-T16DQJTECK"
};
firebase.initializeApp(firebaseConfig);

const visitsRef  = firebase.database().ref('visits');
const initialCount = 25390;

console.log("💾 Intentando transacción con initialCount =", initialCount);
visitsRef.transaction(current => {
  console.log("  valor current en DB:", current);
  if (current === null || current < initialCount) return initialCount;
  return current + 1;
}, (error, committed, snapshot) => {
  console.log({ error, committed, newValue: snapshot && snapshot.val() });
  const el = document.getElementById('visit-counter');
  if (error) {
    el.textContent = 'Visitas: —';
    console.error("❌ Transaction error:", error);
  } else if (!committed) {
    el.textContent = `Visitas: ${snapshot.val()?.toLocaleString() || '—'}`;
    console.warn("⚠️ Transaction NO committed (reglas rechazaron):", snapshot.val());
  } else {
    el.textContent = `Visitas: ${snapshot.val().toLocaleString()}`;
    console.log("✅ Transacción OK. Nuevo valor:", snapshot.val());
  }
});