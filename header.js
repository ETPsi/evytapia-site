(() => {
  "use strict";

  /* =========================================================
     CONFIGURAÇÃO
  ========================================================== */

  const HEADER_URL = "/header.html";

  const WHATSAPP_NUMBER = "51999230000";

  /*
   * Configuração específica por página.
   * Podemos adicionar futuras landing pages aqui.
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
     * Todas as páginas que utilizem este header
     * precisam de:
     *
     * <div id="header-container"></div>
     */
    if (!container) {

      console.warn(
        'Header: não foi encontrado "#header-container".'
      );

      return;
    }


    try {

      const response =
        await fetch(HEADER_URL, {
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


    /*
     * Breakpoint utilizado pelo menu mobile.
     * Deve coincidir com o breakpoint do CSS.
     */
    const mobileBreakpoint =
      window.matchMedia(
        "(max-width: 860px)"
      );


    /*
     * Permite hover apenas em computadores
     * com rato/trackpad.
     */
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
        mobileMenuPanel.classList.contains(
          "isOpen"
        )
      );

    }


    function openMobileMenu() {

      if (
        !mobileMenuPanel ||
        !mobileBreakpoint.matches
      ) {
        return;
      }


      /*
       * Não queremos Detalles e menu
       * abertos ao mesmo tempo.
       */
      closeDetails();


      mobileMenuPanel.classList.add(
        "isOpen"
      );


      mobileMenuPanel.setAttribute(
        "aria-hidden",
        "false"
      );


      siteHeader.classList.add(
        "mobileMenuOpen"
      );


      mobileMenuToggles.forEach(
        (toggle) => {

          toggle.classList.add(
            "isOpen"
          );

          toggle.setAttribute(
            "aria-expanded",
            "true"
          );

        }
      );

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


      siteHeader.classList.remove(
        "mobileMenuOpen"
      );


      mobileMenuToggles.forEach(
        (toggle) => {

          toggle.classList.remove(
            "isOpen"
          );

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

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


    /*
     * Botões hambúrguer.
     */
    mobileMenuToggles.forEach(
      (toggle) => {

        toggle.addEventListener(
          "click",
          toggleMobileMenu
        );

      }
    );


    /*
     * Fecha o menu depois de clicar
     * numa opção.
     */
    mobileMenuPanel
      ?.querySelectorAll(
        ".mobileMenuItem"
      )
      .forEach((item) => {

        item.addEventListener(
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

      return Boolean(
        detailsPopover &&
        detailsPopover.classList.contains(
          "isOpen"
        )
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
       * Fecha o menu mobile.
       */
      closeMobileMenu();


      detailsPopover.classList.add(
        "isOpen"
      );


      detailsPopover.setAttribute(
        "aria-hidden",
        "false"
      );


      detailsToggle.classList.add(
        "isOpen"
      );


      detailsToggle.setAttribute(
        "aria-expanded",
        "true"
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


      detailsToggle.classList.remove(
        "isOpen"
      );


      detailsToggle.setAttribute(
        "aria-expanded",
        "false"
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

      event?.preventDefault();
      event?.stopPropagation();


      if (isDetailsOpen()) {

        closeDetails();

      } else {

        openDetails();

      }

    }


    /*
     * Em telemóvel/tablet:
     * abre através de clique.
     */
    detailsToggle?.addEventListener(
      "click",
      (event) => {

        /*
         * Em computadores com hover,
         * continuamos a permitir clique,
         * mas o hover também funciona.
         */
        toggleDetails(event);

      }
    );


    /*
     * Em desktop:
     * abre também quando o rato entra
     * na zona do botão.
     */
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


    /*
     * Clicar dentro do popover
     * não deve fechá-lo.
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

        const target =
          event.target;


        if (!(target instanceof Node)) {
          return;
        }


        /*
         * Fecha Detalles ao clicar fora.
         */
        if (
          isDetailsOpen() &&
          detailsWrap &&
          !detailsWrap.contains(target)
        ) {

          closeDetails();

        }


        /*
         * Fecha menu mobile
         * ao clicar fora do header.
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


        closeMobileMenu();
        closeDetails();

      }
    );


    /* =======================================================
       HEADER COMPACTO AO FAZER SCROLL
    ======================================================== */

    let compactState = null;


    function updateCompactHeader() {

      const shouldCompact =
        window.scrollY > 40;


      /*
       * Só altera o DOM quando realmente
       * muda de estado.
       */
      if (
        compactState === shouldCompact
      ) {
        return;
      }


      compactState =
        shouldCompact;


      /*
       * Mantemos as duas classes para
       * compatibilidade com o CSS antigo
       * da página principal.
       */
      siteHeader.classList.toggle(
        "isCompact",
        shouldCompact
      );


      siteHeader.classList.toggle(
        "is-scrolled",
        shouldCompact
      );


      /*
       * Fecha menus quando ocorre
       * a transição normal -> compacto.
       */
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
       ALTERAÇÃO DE TAMANHO / ORIENTAÇÃO
    ======================================================== */

    function handleResize() {

      /*
       * Se deixarmos de estar em mobile,
       * garantimos que o painel não fica
       * artificialmente aberto.
       */
      if (!mobileBreakpoint.matches) {

        closeMobileMenu();

      }


      closeDetails();

    }


    window.addEventListener(
      "resize",
      handleResize
    );


    /*
     * Mudança direta do breakpoint.
     */
    const handleBreakpointChange =
      (event) => {

        if (!event.matches) {

          closeMobileMenu();

        }

      };


    /*
     * Browsers modernos.
     */
    if (
      typeof mobileBreakpoint.addEventListener ===
      "function"
    ) {

      mobileBreakpoint.addEventListener(
        "change",
        handleBreakpointChange
      );

    } else {

      /*
       * Compatibilidade com browsers antigos.
       */
      mobileBreakpoint.addListener(
        handleBreakpointChange
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

    /*
     * Muito importante:
     * o menu começa SEMPRE fechado.
     */
    closeMobileMenu();
    closeDetails();


    /*
     * Verifica se a página já foi aberta
     * numa posição de scroll mais baixa.
     */
    updateCompactHeader();

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
     * Landing de ansiedade.
     *
     * Funciona:
     * /ansiedad
     * /ansiedad/
     * /ansiedad.html
     */
    if (
      pathname === "/ansiedad" ||
      pathname.endsWith(
        "/ansiedad.html"
      )
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
        .toLowerCase()
        .replace(/\/+$/, "");


    const hash =
      window.location.hash
        .replace("#", "")
        .toLowerCase();


    /*
     * Primeiro retiramos qualquer
     * estado ativo anterior.
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
     * Só marcamos uma tab como ativa
     * quando estamos na homepage.
     *
     * Em /ansiedad não fica nenhuma
     * opção falsamente selecionada.
     */
    const isHomepage =
      pathname === "" ||
      pathname === "/" ||
      pathname.endsWith(
        "/index.html"
      );


    if (!isHomepage) {
      return;
    }


    /*
     * Se não existir hash:
     * Inicio é a secção ativa.
     */
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
