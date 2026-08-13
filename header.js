(() => {
  "use strict";

  /* =========================================================
     CONFIGURAÇÃO
  ========================================================== */

  const HEADER_URL = "/header.html";

  const WHATSAPP_NUMBER = "51999230000";

  /*
   * Podemos adicionar aqui mensagens diferentes
   * para futuras landing pages.
   */
  const PAGE_CONFIG = {
    default: {
      whatsappText:
        "Hola, quiero agendar mi primera sesión.",
      ctaText:
        "Agendar mi primera sesión",
      ariaLabel:
        "Agendar mi primera sesión por WhatsApp"
    },

    ansiedad: {
      whatsappText:
        "Hola, vi la página sobre ansiedad y ataques de pánico. Quisiera conocer los horarios disponibles para una primera sesión.",
      ctaText:
        "Agendar mi primera sesión",
      ariaLabel:
        "Agendar mi primera sesión por WhatsApp"
    }
  };


  /* =========================================================
     INÍCIO
  ========================================================== */

  document.addEventListener("DOMContentLoaded", loadHeader);


  async function loadHeader() {

    const container =
      document.getElementById("header-container");

    /*
     * Se a página ainda não tiver:
     *
     * <div id="header-container"></div>
     *
     * não fazemos nada.
     */
    if (!container) {
      console.warn(
        'Header: não foi encontrado "#header-container".'
      );

      return;
    }


    try {

      const response = await fetch(HEADER_URL, {
        cache: "no-cache"
      });


      if (!response.ok) {
        throw new Error(
          `Erro HTTP ${response.status}`
        );
      }


      const headerHTML =
        await response.text();


      container.innerHTML =
        headerHTML;


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

    const siteHeader =
      document.getElementById("siteHeader");

    const headerSpacer =
      document.getElementById("headerSpacer");

    const mobileMenuPanel =
      document.getElementById("mobileMenuPanel");

    const mobileMenuToggleTop =
      document.getElementById("mobileMenuToggleTop");

    const mobileMenuToggleCompact =
      document.getElementById("mobileMenuToggleCompact");

    const detailsWrap =
      document.getElementById("detailsWrap");

    const detailsToggle =
      document.getElementById("detailsToggle");

    const detailsPopover =
      document.getElementById("detailsPopover");


    if (!siteHeader) {
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


    /* -------------------------------------------------------
       MENU MOBILE
    -------------------------------------------------------- */

    function isMobileMenuOpen() {

      return (
        mobileMenuPanel &&
        mobileMenuPanel.classList.contains("isOpen")
      );

    }


    function openMobileMenu() {

      if (!mobileMenuPanel) {
        return;
      }


      /*
       * Fecha Detalles antes de abrir menu.
       */
      closeDetails();


      mobileMenuPanel.classList.add("isOpen");

      mobileMenuPanel.setAttribute(
        "aria-hidden",
        "false"
      );


      mobileMenuToggleTop?.setAttribute(
        "aria-expanded",
        "true"
      );

      mobileMenuToggleCompact?.setAttribute(
        "aria-expanded",
        "true"
      );


      siteHeader.classList.add(
        "mobileMenuOpen"
      );


      updateSpacerHeight();

    }


    function closeMobileMenu() {

      if (!mobileMenuPanel) {
        return;
      }


      mobileMenuPanel.classList.remove(
        "isOpen"
      );

      mobileMenuPanel.setAttribute(
        "aria-hidden",
        "true"
      );


      mobileMenuToggleTop?.setAttribute(
        "aria-expanded",
        "false"
      );

      mobileMenuToggleCompact?.setAttribute(
        "aria-expanded",
        "false"
      );


      siteHeader.classList.remove(
        "mobileMenuOpen"
      );


      updateSpacerHeight();

    }


    function toggleMobileMenu(event) {

      event?.preventDefault();

      event?.stopPropagation();


      if (isMobileMenuOpen()) {

        closeMobileMenu();

      } else {

        openMobileMenu();

      }

    }


    mobileMenuToggleTop?.addEventListener(
      "click",
      toggleMobileMenu
    );


    mobileMenuToggleCompact?.addEventListener(
      "click",
      toggleMobileMenu
    );


    /*
     * Fecha menu depois de escolher uma opção.
     */
    mobileMenuPanel
      ?.querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {

            closeMobileMenu();

          }
        );

      });


    /* =======================================================
       DETALLES
    ======================================================== */

    function isDetailsOpen() {

      return (
        detailsPopover &&
        detailsPopover.classList.contains("isOpen")
      );

    }


    function openDetails() {

      if (
        !detailsPopover ||
        !detailsToggle
      ) {
        return;
      }


      /*
       * Evita menu mobile e Detalles
       * abertos ao mesmo tempo.
       */
      closeMobileMenu();


      detailsPopover.classList.add(
        "isOpen"
      );

      detailsPopover.setAttribute(
        "aria-hidden",
        "false"
      );


      detailsToggle.setAttribute(
        "aria-expanded",
        "true"
      );


      detailsToggle.classList.add(
        "isOpen"
      );


      const arrow =
        detailsToggle.querySelector(
          ".detailsArrow"
        );


      if (arrow) {
        arrow.textContent = "△";
      }

    }


    function closeDetails() {

      if (
        !detailsPopover ||
        !detailsToggle
      ) {
        return;
      }


      detailsPopover.classList.remove(
        "isOpen"
      );

      detailsPopover.setAttribute(
        "aria-hidden",
        "true"
      );


      detailsToggle.setAttribute(
        "aria-expanded",
        "false"
      );


      detailsToggle.classList.remove(
        "isOpen"
      );


      const arrow =
        detailsToggle.querySelector(
          ".detailsArrow"
        );


      if (arrow) {
        arrow.textContent = "▽";
      }

    }


    function toggleDetails(event) {

      event.preventDefault();

      event.stopPropagation();


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


    /*
     * Evita que clicar dentro do popover
     * o feche imediatamente.
     */
    detailsPopover?.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

      }
    );


    /* =======================================================
       CLIQUE FORA
    ======================================================== */

    document.addEventListener(
      "click",
      (event) => {

        const target = event.target;

        if (!(target instanceof Node)) {
          return;
        }


        /*
         * Fecha Detalles se clicar fora.
         */
        if (
          isDetailsOpen() &&
          detailsWrap &&
          !detailsWrap.contains(target)
        ) {

          closeDetails();

        }


        /*
         * Fecha menu mobile se clicar fora.
         */
        if (
          isMobileMenuOpen() &&
          !siteHeader.contains(target)
        ) {

          closeMobileMenu();

        }

      }
    );


    /* =======================================================
       ESCAPE
    ======================================================== */

    document.addEventListener(
      "keydown",
      (event) => {

        if (event.key !== "Escape") {
          return;
        }


        closeDetails();

        closeMobileMenu();

      }
    );


    /* =======================================================
       HEADER COMPACTO AO FAZER SCROLL
    ======================================================== */

    let lastCompactState = null;


    function updateCompactHeader() {

      /*
       * Ponto a partir do qual o header encolhe.
       */
      const shouldCompact =
        window.scrollY > 45;


      /*
       * Evita manipular classes desnecessariamente
       * a cada pixel de scroll.
       */
      if (
        shouldCompact ===
        lastCompactState
      ) {
        return;
      }


      lastCompactState =
        shouldCompact;


      siteHeader.classList.toggle(
        "isCompact",
        shouldCompact
      );


      /*
       * Fechamos os elementos flutuantes
       * durante a mudança de estado.
       */
      closeDetails();

      closeMobileMenu();


      requestAnimationFrame(
        updateSpacerHeight
      );

    }


    window.addEventListener(
      "scroll",
      updateCompactHeader,
      {
        passive: true
      }
    );


    /* =======================================================
       ALTURA DO HEADER / SPACER
    ======================================================== */

    function updateSpacerHeight() {

      if (!headerSpacer) {
        return;
      }


      /*
       * O header está fixed, por isso o spacer
       * ocupa exatamente o espaço necessário
       * antes do conteúdo da página.
       */
      const headerHeight =
        siteHeader.offsetHeight;


      headerSpacer.style.height =
        `${headerHeight}px`;

    }


    /*
     * Atualiza também se o browser/mobile
     * mudar a largura.
     */
    window.addEventListener(
      "resize",
      () => {

        closeDetails();

        closeMobileMenu();

        updateSpacerHeight();

      }
    );


    /*
     * ResizeObserver é especialmente útil
     * quando o header muda de tamanho
     * entre normal e compacto.
     */
    if ("ResizeObserver" in window) {

      const resizeObserver =
        new ResizeObserver(() => {

          updateSpacerHeight();

        });


      resizeObserver.observe(
        siteHeader
      );

    }


    /* =======================================================
       ESTADO INICIAL
    ======================================================== */

    updateCompactHeader();

    updateSpacerHeight();

  }


  /* =========================================================
     CONFIGURAÇÃO WHATSAPP POR PÁGINA
  ========================================================== */

  function configureWhatsappLinks() {

    const pathname =
      window.location.pathname
        .toLowerCase()
        .replace(/\/+$/, "");


    let config =
      PAGE_CONFIG.default;


    /*
     * Funciona tanto com:
     *
     * /ansiedad
     * /ansiedad.html
     */
    if (
      pathname === "/ansiedad" ||
      pathname.endsWith("/ansiedad.html")
    ) {

      config =
        PAGE_CONFIG.ansiedad;

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

        link.href =
          whatsappURL;


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
        .toLowerCase();


    const hash =
      window.location.hash
        .replace("#", "");


    /*
     * Remove primeiro qualquer estado anterior.
     */
    document
      .querySelectorAll(
        ".tab, .mobileMenuItem"
      )
      .forEach((item) => {

        item.classList.remove(
          "isActive"
        );

      });


    /*
     * Nas landing pages, como /ansiedad,
     * não marcamos nenhum item como ativo,
     * porque o utilizador não está numa secção
     * da homepage.
     */
    const isHomepage =
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

        item.classList.add(
          "isActive"
        );

      });

  }

})();
