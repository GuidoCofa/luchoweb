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

  // Asegurarse de que la sección "principal" esté activa al cargar
  const initialSection = document.getElementById("principal")
  if (initialSection) {
    initialSection.classList.add("active")
  }

  initNavigation()
  initImageModal()

  console.log("🎙️ Lucho Chávez - Portfolio minimalista cargado")
}

// Navegación y funcionalidad principal
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".section")
  const sidebar = document.querySelector(".sidebar")
  const topNavbar = document.querySelector(".top-navbar")
  const mainContent = document.querySelector(".main-content")
  const heroImageWrapper = document.querySelector(".hero-image-wrapper") // Obtener referencia a la imagen hero

  console.log("navLinks found:", navLinks.length)
  console.log("sections found:", sections.length)
  console.log("sidebar found:", !!sidebar)
  console.log("topNavbar found:", !!topNavbar)
  console.log("mainContent found:", !!mainContent)
  console.log("heroImageWrapper found:", !!heroImageWrapper) // Log para verificar

  // Crear botón de menú móvil
  const mobileMenuBtn = document.createElement("button")
  mobileMenuBtn.className = "mobile-menu"
  mobileMenuBtn.innerHTML = "☰"
  document.body.appendChild(mobileMenuBtn)

  // Función para actualizar la visibilidad de sidebar/navbar y clases de main-content
  const updateLayout = (sectionId) => {
    // Primero, ocultar todas las secciones
    sections.forEach((s) => s.classList.remove("active"))

    if (sectionId === "principal") {
      sidebar.classList.remove("hidden")
      sidebar.classList.add("visible")
      topNavbar.classList.remove("visible")
      topNavbar.classList.add("hidden")
      mainContent.classList.remove("with-top-navbar")
      mainContent.classList.add("with-sidebar")
      if (heroImageWrapper) {
        heroImageWrapper.classList.remove("hidden") // Mostrar hero image en la sección principal
      }
    } else {
      sidebar.classList.remove("visible")
      sidebar.classList.add("hidden")
      topNavbar.classList.remove("hidden")
      topNavbar.classList.add("visible")
      mainContent.classList.remove("with-sidebar")
      mainContent.classList.add("with-top-navbar")
      if (heroImageWrapper) {
        heroImageWrapper.classList.add("hidden") // Ocultar hero image en otras secciones
      }
    }

    // Mostrar la sección correspondiente
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
      targetSection.classList.add("active")
      // Desplazar a la parte superior de la sección activa
      setTimeout(() => {
        mainContent.scrollTo({ top: 0, behavior: "smooth" })
      }, 50) // Pequeño retraso para asegurar que el layout se haya aplicado
    }
  }

  // Manejar clicks en navegación sidebar y top navbar
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remover clase active de todos los enlaces
      navLinks.forEach((l) => l.classList.remove("active"))

      // Agregar clase active al enlace clickeado (tanto en sidebar como en top navbar)
      const sectionId = this.getAttribute("data-section")
      document.querySelectorAll(`[data-section="${sectionId}"]`).forEach((el) => el.classList.add("active"))

      // Actualizar el layout (sidebar/top navbar) y desplazar
      updateLayout(sectionId)

      // Cerrar menú móvil si está abierto
      if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open")
        mobileMenuBtn.innerHTML = "☰"
      }
    })
  })

  // Funcionalidad menú móvil
  mobileMenuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open")
    this.innerHTML = sidebar.classList.contains("open") ? "✕" : "☰"
  })

  // Cerrar menú móvil al hacer click fuera
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove("open")
      mobileMenuBtn.innerHTML = "☰"
    }
  })

  // Navegación con teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open")
      mobileMenuBtn.innerHTML = "☰"
    }
  })

  // Efectos hover en imágenes
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    // Excluir la imagen principal del efecto hover
    if (!img.closest(".hero-image-wrapper")) {
      img.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.02)"
      })

      img.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)"
      })
    }
  })

  // Inicializar el layout al cargar la página
  const initialActiveSection = document.querySelector(".nav-link.active")?.getAttribute("data-section") || "principal"
  updateLayout(initialActiveSection)
}

// Smooth scrolling
document.documentElement.style.scrollBehavior = "smooth"

// Animación de carga
window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

// Image Modal functionality
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
