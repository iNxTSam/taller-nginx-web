const PROJECTS = {
  analitica: {
    title: "Panel de analítica",
    tag: "Datos",
    image: "img/proyecto-1.svg",
    alt: "Panel de analítica con tarjetas de métricas y gráficos",
    description:
      "Prototipo de dashboard para explorar ventas por categoría. Incluye tarjetas de indicadores, un gráfico de barras y una tabla con los productos con mejor desempeño.",
    items: [
      "Diseño adaptable para escritorio y móvil.",
      "Visualizaciones construidas con datos de ejemplo.",
      "Filtros por categoría y periodo de tiempo."
    ]
  },
  reservas: {
    title: "Landing de reservas",
    tag: "Web",
    image: "img/proyecto-2.svg",
    alt: "Landing page de reservas con formulario y calendario",
    description:
      "Página de una sola vista para promocionar un servicio y captar reservas. El formulario valida los datos en el navegador y muestra una confirmación inmediata.",
    items: [
      "Maquetación semántica con HTML5.",
      "Estilos responsivos con variables CSS.",
      "Validación de formulario en JavaScript."
    ]
  },
  despliegue: {
    title: "Despliegue en la nube",
    tag: "Cloud",
    image: "img/proyecto-3.svg",
    alt: "Servidor Linux conectado a una red y a servicios en la nube",
    description:
      "Publicación de un sitio estático en una máquina virtual de Oracle Cloud. Nginx sirve los archivos y un subdominio de DuckDNS apunta a la IP pública del servidor.",
    items: [
      "Instalación y configuración de Nginx.",
      "Reglas de red para los puertos 22 y 80.",
      "Dominio gratuito con DuckDNS y verificación externa."
    ]
  }
};

const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const header = document.getElementById("site-header");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyTheme(theme, persist) {
  const isLight = theme === "light";
  root.dataset.theme = isLight ? "light" : "dark";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Activar tema oscuro" : "Activar tema claro");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", isLight ? "#f7f8fc" : "#0b1120");
  if (persist) {
    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch (error) {
      void error;
    }
  }
}

applyTheme(root.dataset.theme === "light" ? "light" : "dark", false);

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "light" ? "dark" : "light", true);
});

function closeMenu() {
  nav.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", (event) => {
  if (!nav.classList.contains("is-open")) return;
  if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
  closeMenu();
});

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const current = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === current);
        });
      });
    },
    { rootMargin: "-42% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

const revealItems = Array.from(document.querySelectorAll(".reveal"));

if (!("IntersectionObserver" in window) || reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 70}ms`;
    revealObserver.observe(item);
  });
}

const filterButtons = Array.from(document.querySelectorAll(".filter"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const emptyState = document.getElementById("empty-state");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    let visibleCount = 0;
    projectCards.forEach((card) => {
      const show = filter === "todos" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
      if (show) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
  });
});

const modal = document.getElementById("project-modal");
const modalImage = document.getElementById("modal-image");
const modalTag = document.getElementById("modal-tag");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalList = document.getElementById("modal-list");
const modalClose = document.getElementById("modal-close");

function openProject(projectId) {
  const project = PROJECTS[projectId];
  if (!project) return;

  modalImage.setAttribute("src", project.image);
  modalImage.setAttribute("alt", project.alt);
  modalTag.textContent = project.tag;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalList.replaceChildren();

  project.items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    modalList.appendChild(listItem);
  });

  modal.showModal();
  document.body.style.overflow = "hidden";
}

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => openProject(button.dataset.project));
});

modalClose.addEventListener("click", () => modal.close());

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

modal.addEventListener("close", () => {
  document.body.style.overflow = "";
});

const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(input, message) {
  const field = input.closest(".field");
  const error = field.querySelector(`[data-error-for="${input.id}"]`);
  field.classList.toggle("has-error", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
  return !message;
}

function validateName() {
  const value = nameInput.value.trim();
  if (!value) return setFieldError(nameInput, "Escribe tu nombre.");
  if (value.length < 2) return setFieldError(nameInput, "El nombre debe tener al menos 2 caracteres.");
  return setFieldError(nameInput, "");
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (!value) return setFieldError(emailInput, "Escribe tu correo electrónico.");
  if (!emailPattern.test(value)) return setFieldError(emailInput, "Usa un correo válido, por ejemplo nombre@dominio.com.");
  return setFieldError(emailInput, "");
}

function validateMessage() {
  const value = messageInput.value.trim();
  if (!value) return setFieldError(messageInput, "Escribe un mensaje.");
  if (value.length < 10) return setFieldError(messageInput, "El mensaje debe tener al menos 10 caracteres.");
  return setFieldError(messageInput, "");
}

const fieldValidators = [
  [nameInput, validateName],
  [emailInput, validateEmail],
  [messageInput, validateMessage]
];

fieldValidators.forEach(([input, validate]) => {
  input.addEventListener("blur", validate);
  input.addEventListener("input", () => {
    const field = input.closest(".field");
    if (field.classList.contains("has-error")) validate();
    formStatus.textContent = "";
    formStatus.classList.remove("is-success");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const results = fieldValidators.map(([, validate]) => validate());
  const firstInvalid = fieldValidators.find(([input]) => input.getAttribute("aria-invalid") === "true");

  if (results.includes(false)) {
    formStatus.textContent = "";
    formStatus.classList.remove("is-success");
    if (firstInvalid) firstInvalid[0].focus();
    return;
  }

  formStatus.textContent = "Mensaje validado correctamente. Este formulario es una demostración y no envía correos.";
  formStatus.classList.add("is-success");
  form.reset();
  fieldValidators.forEach(([input]) => {
    input.setAttribute("aria-invalid", "false");
    input.closest(".field").classList.remove("has-error");
    input.closest(".field").querySelector(".error").textContent = "";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
