/* ==========================================================================
   Angélica Mendes — Manicure e Pedicure
   JavaScript do site (sem dependências)
   ========================================================================== */

/* --------------------------------------------------------------------------
   AVALIAÇÕES
   Cadastre aqui somente avaliações REAIS de clientes (por exemplo, copiadas
   do Google, com autorização). Enquanto a lista estiver vazia, o site mostra
   apenas o convite para avaliar no Google.

   Exemplo de formato:
   {
     nome: "Maria S.",
     texto: "Texto da avaliação escrito pela cliente.",
     nota: 5            // de 1 a 5 (opcional)
   },
   -------------------------------------------------------------------------- */
const AVALIACOES = [
];

(function () {
  "use strict";

  const body = document.body;

  /* Ano atual no rodapé ---------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* Helper: executa callback quando a imagem falhar (inclusive se já falhou) */
  function onImageError(img, callback) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
      callback();
      return;
    }
    img.addEventListener("error", callback, { once: true });
  }

  /* Foto do topo: mantém a moldura elegante se a imagem não existir -------- */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    onImageError(img, function () {
      img.parentElement.classList.add("is-missing");
      img.alt = "";
    });
  });

  /* Header: borda sutil ao rolar ------------------------------------------ */
  const header = document.querySelector(".header");
  if (header) {
    const updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* Menu mobile ------------------------------------------------------------ */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");
  const desktopQuery = window.matchMedia("(min-width: 1024px)");

  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);
    if (!open && returnFocus) toggle.focus();
  }

  function isMobileMenuOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  function syncNavAccessibility() {
    if (!nav) return;
    // No mobile, o menu fechado não deve receber foco pelo teclado
    if (desktopQuery.matches) {
      nav.removeAttribute("inert");
      setMenu(false);
    } else if (!isMobileMenuOpen()) {
      nav.setAttribute("inert", "");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = !isMobileMenuOpen();
      setMenu(open);
      if (open) {
        nav.removeAttribute("inert");
        const first = nav.querySelector("a");
        if (first) first.focus();
      } else {
        nav.setAttribute("inert", "");
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && isMobileMenuOpen()) {
        setMenu(false);
        nav.setAttribute("inert", "");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isMobileMenuOpen()) {
        setMenu(false, true);
        nav.setAttribute("inert", "");
      }
    });

    syncNavAccessibility();
    desktopQuery.addEventListener("change", syncNavAccessibility);
  }

  /* Destaca o item do menu da seção visível -------------------------------- */
  const navLinks = document.querySelectorAll('.nav__list a[href^="#"]');
  if ("IntersectionObserver" in window && navLinks.length) {
    const linkById = {};
    navLinks.forEach(function (link) {
      linkById[link.getAttribute("href").slice(1)] = link;
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.remove("is-active");
          l.removeAttribute("aria-current");
        });
        const active = linkById[entry.target.id];
        if (active) {
          active.classList.add("is-active");
          active.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(linkById).forEach(function (id) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* Avaliações ------------------------------------------------------------- */
  const reviewsList = document.querySelector("[data-reviews]");
  if (reviewsList && Array.isArray(AVALIACOES) && AVALIACOES.length) {
    AVALIACOES.forEach(function (review) {
      if (!review || !review.texto) return;

      const item = document.createElement("li");
      item.className = "review";

      const nota = Math.max(0, Math.min(5, Math.round(Number(review.nota) || 0)));
      if (nota) {
        const stars = document.createElement("p");
        stars.className = "review__stars";
        stars.setAttribute("role", "img");
        stars.setAttribute("aria-label", "Nota " + nota + " de 5");
        stars.innerHTML = new Array(nota + 1).join(
          '<svg class="icon" aria-hidden="true"><use href="#i-star-fill"></use></svg>'
        );
        item.appendChild(stars);
      }

      const quote = document.createElement("blockquote");
      quote.className = "review__text";
      quote.textContent = "“" + review.texto + "”";
      item.appendChild(quote);

      if (review.nome) {
        const author = document.createElement("p");
        author.className = "review__author";
        author.textContent = review.nome;
        item.appendChild(author);
      }

      reviewsList.appendChild(item);
    });

    if (reviewsList.children.length) reviewsList.hidden = false;
  }

  /* Galeria + lightbox ----------------------------------------------------- */
  const gallery = document.querySelector("[data-gallery]");
  const lightbox = document.querySelector("[data-lightbox]");
  if (!gallery) return;

  const items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery__item"));
  const emptyMessage = document.querySelector("[data-gallery-empty]");

  function updateGalleryState() {
    const visible = items.filter(function (item) {
      return !item.classList.contains("is-missing");
    });
    if (emptyMessage) emptyMessage.hidden = visible.length > 0;
    gallery.hidden = visible.length === 0;
  }

  items.forEach(function (item) {
    const img = item.querySelector("img");
    if (!img) return;
    onImageError(img, function () {
      item.classList.add("is-missing");
      updateGalleryState();
    });
  });

  // Fotos com loading="lazy" só carregam perto da tela; se o navegador
  // não disparar o erro antes, a checagem acima cobre quando rolar.
  updateGalleryState();

  if (!lightbox || typeof lightbox.showModal !== "function") {
    // Navegadores muito antigos: abre a imagem em nova aba
    items.forEach(function (item) {
      const button = item.querySelector("button");
      const img = item.querySelector("img");
      if (button && img) {
        button.addEventListener("click", function () {
          window.open(img.currentSrc || img.src, "_blank", "noopener");
        });
      }
    });
    return;
  }

  const lbImg = lightbox.querySelector("[data-lb-img]");
  const lbCounter = lightbox.querySelector("[data-lb-counter]");
  const lbPrev = lightbox.querySelector("[data-lb-prev]");
  const lbNext = lightbox.querySelector("[data-lb-next]");
  const lbClose = lightbox.querySelector("[data-lb-close]");
  let current = 0;
  let opener = null;

  function visibleItems() {
    return items.filter(function (item) {
      return !item.classList.contains("is-missing");
    });
  }

  function show(index) {
    const list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    const img = list[current].querySelector("img");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCounter.textContent = (current + 1) + " / " + list.length;

    const single = list.length < 2;
    lbPrev.hidden = single;
    lbNext.hidden = single;
    lightbox.classList.toggle("is-single", single);
  }

  function openLightbox(item) {
    opener = item.querySelector("button");
    show(visibleItems().indexOf(item));
    lightbox.showModal();
    body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (lightbox.open) lightbox.close();
  }

  items.forEach(function (item) {
    const button = item.querySelector("button");
    if (button) {
      button.addEventListener("click", function () { openLightbox(item); });
    }
  });

  lbPrev.addEventListener("click", function () { show(current - 1); });
  lbNext.addEventListener("click", function () { show(current + 1); });
  lbClose.addEventListener("click", closeLightbox);

  // Fecha ao clicar fora da imagem
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox || event.target.classList.contains("lightbox__figure")) {
      closeLightbox();
    }
  });

  lightbox.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  // Gesto de deslizar no celular
  let touchX = null;
  lightbox.addEventListener("touchstart", function (event) {
    touchX = event.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", function (event) {
    if (touchX === null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 50) show(delta > 0 ? current - 1 : current + 1);
    touchX = null;
  }, { passive: true });

  lightbox.addEventListener("close", function () {
    body.style.overflow = "";
    lbImg.removeAttribute("src");
    if (opener) opener.focus();
  });
})();
