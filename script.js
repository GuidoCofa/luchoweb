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

  const mobileMenuBtn = document.createElement("button")
  mobileMenuBtn.className = "mobile-menu"
  mobileMenuBtn.innerHTML = "☰"
  document.body.appendChild(mobileMenuBtn)

  const updateLayout = (sectionId) => {
    // Pausar y reiniciar videos de la sección que se desactiva
    const currentActiveSectionElement = document.querySelector(".section.active")
    if (currentActiveSectionElement && currentActiveSectionElement.id !== sectionId) {
      const videosInInactiveSection = currentActiveSectionElement.querySelectorAll("video")
      videosInInactiveSection.forEach((video) => {
        video.pause()
        video.currentTime = 0
        // Forzamos la recarga del estado del video para que el póster reaparezca
        video.src = video.src
      })
    }

    sections.forEach((s) => s.classList.remove("active"))

    if (sectionId === "principal") {
      sidebar.classList.remove("hidden")
      sidebar.classList.add("visible")
      topNavbar.classList.remove("visible")
      topNavbar.classList.add("hidden")
      mainContent.classList.remove("with-top-navbar")
      mainContent.classList.add("with-sidebar")
      if (heroImageWrapper) {
        heroImageWrapper.classList.remove("hidden")
      }
    } else {
      sidebar.classList.remove("visible")
      sidebar.classList.add("hidden")
      topNavbar.classList.remove("hidden")
      topNavbar.classList.add("visible")
      mainContent.classList.remove("with-sidebar")
      mainContent.classList.add("with-top-navbar")
      if (heroImageWrapper) {
        heroImageWrapper.classList.add("hidden")
      }
    }

    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
      targetSection.classList.add("active")
      // 🔄 CAMBIO CRÍTICO: usamos scroll del body
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
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
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

  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    if (!img.closest(".hero-image-wrapper")) {
      img.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.02)"
      })
      img.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)"
      })
    }
  })

  const initialActiveSection = document.querySelector(".nav-link.active")?.getAttribute("data-section") || "principal"
  updateLayout(initialActiveSection)
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
  const photoItems = document.querySelectorAll(".large-photo-item")

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
        document.body.style.overflow = "hidden"
      })
    })

    const closeModalFunction = () => {
      modal.classList.remove("active")
      document.body.style.overflow = "auto"
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
