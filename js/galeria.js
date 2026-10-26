
const galleryPhotos = [
  {
    src: "assets/images/galeria/Startup0.jpeg",
    alt: "Membros da SessioTechnologies durante uma sessão de trabalho",
    title: "Trabalho em equipa",
    description: "Um momento de colaboração entre membros da SessioTechnologies.",
    category: "SESSIOTECHNOLOGIES"
  },

    {
    src: "assets/images/galeria/Startup1.jpeg",
    alt: "Membros da SessioTechnologies reunidos à volta de uma mesa",
    title: "Reunião de equipa",
    description: "Partilha de ideias e organização das próximas tarefas.",
    category: "SESSIOTECHNOLOGIES"
  },
  {
    src: "assets/images/galeria/Startup2.jpeg",
    alt: "Sessão de trabalho da equipa SessioTechnologies",
    title: "Sessão de trabalho",
    description: "A equipa reunida para avançar com o trabalho do projeto.",
    category: "SESSIOTECHNOLOGIES"
  },
  {
    src: "assets/images/galeria/Startup3.jpeg",
    alt: "Membro da SessioTechnologies a trabalhar num computador",
    title: "Foco no projeto",
    description: "Um momento de concentração durante a sessão de trabalho.",
    category: "SESSIOTECHNOLOGIES"
  },
  {
    src: "assets/images/galeria/Startup4.jpeg",
    alt: "Membros da SessioTechnologies a trabalhar à mesa",
    title: "Planeamento conjunto",
    description: "Computadores, apontamentos e ideias reunidos no mesmo espaço.",
    category: "SESSIOTECHNOLOGIES"
  },
  {
    src: "assets/images/galeria/Startup5.jpeg",
    alt: "Grupo da SessioTechnologies durante uma sessão de trabalho",
    title: "Momento da equipa",
    description: "A equipa reunida durante uma pausa no trabalho do projeto.",
    category: "SESSIOTECHNOLOGIES"
  },
  {
    src: "assets/images/galeria/Startup6.jpeg",
    alt: "Membros da SessioTechnologies a trabalhar com computadores",
    title: "Desenvolvimento em equipa",
    description: "Cada membro contribui para transformar as ideias em projeto.",
    category: "SESSIOTECHNOLOGIES"
  }
];

const track = document.querySelector("#gallery-track");
const dotsContainer = document.querySelector("#gallery-dots");
const toggleButton = document.querySelector("#gallery-toggle");
const galleryCarousel = document.querySelector(".gallery-carousel");

const previousButton = document.querySelector(".gallery-prev");
const nextButton = document.querySelector(".gallery-next");

const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxPrevious = document.querySelector("#lightbox-prev");
const lightboxNext = document.querySelector("#lightbox-next");

if (
  track &&
  dotsContainer &&
  toggleButton &&
  galleryCarousel &&
  previousButton &&
  nextButton &&
  lightbox &&
  lightboxImage &&
  lightboxTitle &&
  lightboxCaption &&
  lightboxClose &&
  lightboxPrevious &&
  lightboxNext
) {
  let currentIndex = 0;
  let isExpanded = false;
  let previousFocusedElement = null;

  function renderGallery() {
    track.replaceChildren();
    dotsContainer.replaceChildren();

    galleryPhotos.forEach((photo, index) => {
      const card = document.createElement("article");
      card.className = "gallery-card";

      const imageButton = document.createElement("button");
      imageButton.type = "button";
      imageButton.className = "gallery-card-button";
      imageButton.setAttribute(
        "aria-label",
        `Ampliar fotografia: ${photo.title}`
      );

      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt;
      image.loading = index < 3 ? "eager" : "lazy";

      image.addEventListener("error", () => {
        image.alt = `${photo.alt} — imagem indisponível`;
      });

      imageButton.append(image);
      imageButton.addEventListener("click", () => openLightbox(index));

      const info = document.createElement("div");
      info.className = "gallery-card-info";

      const category = document.createElement("span");
      category.className = "gallery-card-category";
      category.textContent = photo.category;

      const title = document.createElement("h3");
      title.textContent = photo.title;

      const description = document.createElement("p");
      description.textContent = photo.description;

      info.append(category, title, description);
      card.append(imageButton, info);
      track.append(card);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", `Ver fotografia ${index + 1}`);

      dot.addEventListener("click", () => {
        currentIndex = index;
        scrollToPhoto(index);
        updateNavigation();
      });

      dotsContainer.append(dot);
    });

    updateNavigation();
    animateGalleryCards();
  }

  function animateGalleryCards() {
    if (
      !window.gsap ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    window.gsap.fromTo(
      track.querySelectorAll(".gallery-card"),
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.06,
        overwrite: "auto"
      }
    );
  }

  function scrollToPhoto(index) {
    const cards = track.querySelectorAll(".gallery-card");
    const target = cards[index];

    if (target) {
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest",
        inline: "start"
      });
    }
  }

  function updateNavigation() {
    const dots = dotsContainer.querySelectorAll(".gallery-dot");

    dots.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle("is-active", active);

      if (active) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    previousButton.disabled = galleryPhotos.length < 2;
    nextButton.disabled = galleryPhotos.length < 2;

  }

  function moveGallery(direction) {
    if (!galleryPhotos.length) return;

    currentIndex =
      (currentIndex + direction + galleryPhotos.length) %
      galleryPhotos.length;

    scrollToPhoto(currentIndex);
    updateNavigation();
  }

  previousButton.addEventListener("click", () => moveGallery(-1));
  nextButton.addEventListener("click", () => moveGallery(1));

  toggleButton.addEventListener("click", () => {
    isExpanded = !isExpanded;

    track.classList.toggle("is-expanded", isExpanded);
    galleryCarousel.classList.toggle("is-expanded", isExpanded);

    toggleButton.setAttribute("aria-expanded", String(isExpanded));
    toggleButton.textContent = isExpanded
      ? "Mostrar menos −"
      : "Ver mais fotografias +";

    animateGalleryCards();
  });

  function openLightbox(index) {
    currentIndex = index;

    const photo = galleryPhotos[currentIndex];

    if (!photo) return;

    previousFocusedElement = document.activeElement;

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxTitle.textContent = `PHOTO_VIEWER.EXE — ${photo.title}`;
    lightboxCaption.textContent = photo.description;

    if (!lightbox.open) {
      lightbox.showModal();
    }

    lightboxClose.focus();
    updateNavigation();
  }

  function changeLightboxPhoto(direction) {
    currentIndex =
      (currentIndex + direction + galleryPhotos.length) %
      galleryPhotos.length;

    const photo = galleryPhotos[currentIndex];

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxTitle.textContent = `PHOTO_VIEWER.EXE — ${photo.title}`;
    lightboxCaption.textContent = photo.description;

    updateNavigation();
  }

  lightboxPrevious.addEventListener("click", () => {
    changeLightboxPhoto(-1);
  });

  lightboxNext.addEventListener("click", () => {
    changeLightboxPhoto(1);
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.close();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  lightbox.addEventListener("close", () => {
    if (previousFocusedElement instanceof HTMLElement) {
      previousFocusedElement.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeLightboxPhoto(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      changeLightboxPhoto(1);
    }
  });

  renderGallery();
}
