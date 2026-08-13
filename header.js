(() => {
  "use strict";

  /* =========================================================
     CONFIGURAÇÃO
  ========================================================== */

  const HEADER_URL = "/header.html";
  const WHATSAPP_NUMBER = "51999230000";

  const PAGE_CONFIG = {
    default: {
      whatsappText: "Hola, quiero agendar mi primera sesión.",
      ctaText: "Agendar mi primera sesión",
      ariaLabel: "Agendar mi primera sesión por WhatsApp"
    },

    ansiedad: {
      whatsappText:
        "Hola, vi la página sobre ansiedad y ataques de pánico. Quisiera conocer los horarios disponibles para una primera sesión.",
      ctaText: "Agendar mi primera sesión",
      ariaLabel: "Agendar mi primera sesión por WhatsApp"
    }
  };


  /* =========================================================
     INÍCIO
  ========================================================== */

  document.addEventListener("DOMContentLoaded", loadHeader);


  async function loadHeader() {
    const container = document.getElementById("header-container");

    if (!container) {
      console.warn('Header: não foi encontrado "#header-container".');
      return;
    }

    try {
      const response = await fetch(HEADER_URL, {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      container.innerHTML = await response.text();

      initializeHeader();

    } catch (error) {
      console.error(
        "Não foi possível carregar header.html:",
        error
      );
    }
  }


  /* =========================================================
     INICIALIZAÇÃO DO HEADER
  ========================================================== */

  function initializeHeader() {
    const siteHeader = document.getElementById("siteHeader");
    const headerSpacer = document.getElementById("headerSpacer");

    const mobileMenuPanel =
      document.getElementById("mobileMenuPanel");

    const mobileMenuToggleTop =
      document.getElementById("mobileMenuToggleTop");

    const mobileMenuToggleCompact =
      document.getElementById("mobileMenuToggleCompact");

    const mobileMenuToggles = [
      mobileMenuToggleTop,
      mobileMenuToggleCompact
    ].filter(Boolean);

    const detailsWrap =
      document.getElementById("detailsWrap");

    const detailsToggle =
      document.getElementById("detailsToggle");

    const detailsPopover =
      document.getElementById("detailsPopover");

    const mobileBreakpoint =
      window.matchMedia("(max-width: 860px)");

    const desktopHover =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      );

    if (!siteHeader) {
      console.warn(
        'Header: não foi encontrado "#siteHeader".'
      );
      return;
    }


    /* -------------------------------------------------------
       WHATSAPP ESPECÍFICO POR PÁGINA
    -------------------------------------------------------- */

    configureWhatsappLinks();


    /* -------------------------------------------------------
       ESTADO ATIVO DO MENU
    -------------------------------------------------------- */

    updateActiveNavigation();


    /* =======================================================
       MENU MOBILE
    ======================================================== */

    function isMobileMenuOpen() {
      return Boolean(
        mobileMenuPanel &&
        mobileMenuPanel.classList.contains("isOpen")
      );
    }


    function openMobileMenu() {
      if (
        !mobileMenuPanel ||
        !mobileBreakpoint.matches
      ) {
        return;
      }

      closeDetails();

      mobileMenuPanel.classList.add("isOpen");
      mobileMenuPanel.setAttribute(
        "aria-hidden",
        "false"
      );

      siteHeader.classList.add("mobileMenuOpen");

      mobileMenuToggles.forEach((toggle) => {
        toggle.classList.add("isOpen");
        toggle.setAttribute(
          "aria-expanded",
          "true"
        );
      });
    }


    function closeMobileMenu() {
      if (!mobileMenuPanel) {
        return;
      }

      mobileMenuPanel.classList.remove("isOpen");
      mobileMenuPanel.setAttribute(
        "aria-hidden",
        "true"
      );

      siteHeader.classList.remove("mobileMenuOpen");

      mobileMenuToggles.forEach((toggle) => {
        toggle.classList.remove("isOpen");
        toggle.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    }


    function toggleMobileMenu(event) {
      event?.preventDefault();
      event?.stopPropagation();

      if (!mobileBreakpoint.matches) {
        return;
      }

      if (isMobileMenuOpen()) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }


    mobileMenuToggles.forEach((toggle) => {
      toggle.addEventListener(
        "click",
        toggleMobileMenu
      );
    });


    mobileMenuPanel
      ?.querySelectorAll(".mobileMenuItem")
      .forEach((item) => {
        item.addEventListener(
          "click",
          closeMobileMenu
        );
      });


    /* =======================================================
       DETALLES
    ======================================================== */

    function isDetailsOpen() {
      return Boolean(
        detailsPopover &&
        detailsPopover.classList.contains("isOpen")
      );
    }


    function setDetailsArrow(symbol) {
      const arrow =
        detailsToggle?.querySelector(
          ".detailsArrow"
        );

      if (arrow) {
        arrow.textContent = symbol;
      }
    }


    function openDetails() {
      if (
        !detailsPopover ||
        !detailsToggle
      ) {
        return;
      }

      closeMobileMenu();

      detailsPopover.classList.add("isOpen");
      detailsPopover.setAttribute(
        "aria-hidden",
        "false"
      );

      detailsToggle.classList.add("isOpen");
      detailsToggle.setAttribute(
        "aria-expanded",
        "true"
      );

      setDetailsArrow("△");
    }


    function closeDetails() {
      if (
        !detailsPopover ||
        !detailsToggle
      ) {
        return;
      }

      detailsPopover.classList.remove("isOpen");
      detailsPopover.setAttribute(
        "aria-hidden",
        "true"
      );

      detailsToggle.classList.remove("isOpen");
      detailsToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      setDetailsArrow("▽");
    }


    function toggleDetails(event) {
      event?.preventDefault();
      event?.stopPropagation();

      if (isDetailsOpen()) {
        closeDetails();
      } else {
        openDetails();
      }
    }


    detailsToggle?.addEventListener(
      "click",
      toggleDetails
    );


    if (
      desktopHover.matches &&
      detailsWrap
    ) {
      detailsWrap.addEventListener(
        "mouseenter",
        openDetails
      );

      detailsWrap.addEventListener(
        "mouseleave",
        closeDetails
      );

      detailsToggle?.addEventListener(
        "focus",
        openDetails
      );
    }


    detailsPopover?.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
      }
    );


    /* =======================================================
       CLIQUE FORA / ESCAPE
    ======================================================== */

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;

        if (!(target instanceof Node)) {
          return;
        }

        if (
          isDetailsOpen() &&
          detailsWrap &&
          !detailsWrap.contains(target)
        ) {
          closeDetails();
        }

        if (
          isMobileMenuOpen() &&
          !siteHeader.contains(target)
        ) {
          closeMobileMenu();
        }
      }
    );


    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") {
          return;
        }

        closeMobileMenu();
        closeDetails();
      }
    );


    /* =======================================================
       HEADER COMPACTO
    ======================================================== */

    let compactState = null;

    function shouldHeaderBeCompact() {
      return window.scrollY > 40;
    }


    function applyCompactState(shouldCompact) {
      siteHeader.classList.toggle(
        "isCompact",
        shouldCompact
      );

      siteHeader.classList.toggle(
        "is-scrolled",
        shouldCompact
      );
    }


    function updateCompactHeader() {
      const shouldCompact =
        shouldHeaderBeCompact();

      if (compactState === shouldCompact) {
        return;
      }

      compactState = shouldCompact;

      applyCompactState(shouldCompact);

      closeMobileMenu();
      closeDetails();
    }


    window.addEventListener(
      "scroll",
      updateCompactHeader,
      {
        passive: true
      }
    );


    /* =======================================================
       ESPAÇO EXATO DO HEADER

       O espaço deixa de ser um número fixo por breakpoint.
       O JavaScript mede o header expandido e reserva exatamente
       essa altura em todas as páginas.
    ======================================================== */

    function syncHeaderSpacer() {
      if (!headerSpacer) {
        return;
      }

      const shouldCompact =
        shouldHeaderBeCompact();

      /*
       * Mede sempre o header no estado expandido.
       * Assim o conteúdo não "salta" quando o header
       * fica compacto durante o scroll.
       */
      applyCompactState(false);

      const expandedHeight =
        Math.ceil(
          siteHeader.getBoundingClientRect().height
        );

      headerSpacer.style.height =
        expandedHeight + "px";

      applyCompactState(shouldCompact);

      compactState = shouldCompact;
    }


    let resizeFrame = null;

    function handleResize() {
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
      }

      resizeFrame =
        requestAnimationFrame(() => {
          closeMobileMenu();
          closeDetails();
          syncHeaderSpacer();
          resizeFrame = null;
        });
    }


    window.addEventListener(
      "resize",
      handleResize
    );


    window.addEventListener(
      "load",
      syncHeaderSpacer,
      {
        once: true
      }
    );


    if (
      typeof mobileBreakpoint.addEventListener ===
      "function"
    ) {
      mobileBreakpoint.addEventListener(
        "change",
        handleResize
      );
    } else {
      mobileBreakpoint.addListener(
        handleResize
      );
    }


    /* =======================================================
       MUDANÇA DE HASH
    ======================================================== */

    window.addEventListener(
      "hashchange",
      updateActiveNavigation
    );


    /* =======================================================
       ESTADO INICIAL
    ======================================================== */

    closeMobileMenu();
    closeDetails();

    /*
     * requestAnimationFrame garante que o HTML do header
     * já foi inserido e calculado pelo browser antes da medição.
     */
    requestAnimationFrame(() => {
      syncHeaderSpacer();
      updateCompactHeader();
    });
  }


  /* =========================================================
     CONFIGURAÇÃO WHATSAPP POR PÁGINA
  ========================================================== */

  function configureWhatsappLinks() {
    const pathname =
      window.location.pathname
        .toLowerCase()
        .replace(/\/+$/, "");

    let config = PAGE_CONFIG.default;

    if (
      pathname === "/ansiedad" ||
      pathname.endsWith("/ansiedad.html")
    ) {
      config = PAGE_CONFIG.ansiedad;
    }

    const whatsappURL =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(
        config.whatsappText
      );

    document
      .querySelectorAll(
        "[data-header-whatsapp]"
      )
      .forEach((link) => {
        link.href = whatsappURL;

        link.setAttribute(
          "aria-label",
          config.ariaLabel
        );

        const text =
          link.querySelector(
            ".headerCtaText"
          );

        if (text) {
          text.textContent =
            config.ctaText;
        }
      });
  }


  /* =========================================================
     MENU ATIVO
  ========================================================== */

  function updateActiveNavigation() {
    const pathname =
      window.location.pathname
        .toLowerCase()
        .replace(/\/+$/, "");

    const hash =
      window.location.hash
        .replace("#", "")
        .toLowerCase();

    document
      .querySelectorAll(
        ".tab, .mobileMenuItem"
      )
      .forEach((item) => {
        item.classList.remove("isActive");
      });

    const isHomepage =
      pathname === "" ||
      pathname === "/" ||
      pathname.endsWith("/index.html");

    if (!isHomepage) {
      return;
    }

    const activeTab =
      hash || "inicio";

    document
      .querySelectorAll(
        `[data-tab="${activeTab}"],
         [data-mobile-tab="${activeTab}"]`
      )
      .forEach((item) => {
        item.classList.add("isActive");
      });
  }

})();
