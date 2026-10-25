// Comportamento do portfólio.

const botaoMenu = document.querySelector(".menu-hamburguer");
const listaNavegacao = document.querySelector("#lista-navegacao");
const navegacaoPrincipal = document.querySelector(".navegacao-principal");
const cabecalhoSite = document.querySelector(".cabecalho-site");

if (botaoMenu && listaNavegacao) {
  document.documentElement.classList.add("js");

  const fecharMenu = () => {
    listaNavegacao.classList.remove("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  };

  botaoMenu.addEventListener("click", () => {
    const estaAberto = botaoMenu.getAttribute("aria-expanded") === "true";

    if (estaAberto) {
      fecharMenu();
      return;
    }

    listaNavegacao.classList.add("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", "true");
  });

  listaNavegacao.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) fecharMenu();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharMenu();
  });

  if (navegacaoPrincipal && cabecalhoSite && typeof window !== "undefined" && typeof getComputedStyle === "function") {
    const atualizarMenuCompacto = () => {
      const larguraMaximaOriginal = navegacaoPrincipal.style.maxWidth;
      const larguraOriginal = navegacaoPrincipal.style.width;
      const quebraOriginal = listaNavegacao.style.flexWrap;

      navegacaoPrincipal.classList.remove("navegacao-compacta");
      cabecalhoSite.classList.remove("menu-compacto");
      navegacaoPrincipal.style.maxWidth = "none";
      navegacaoPrincipal.style.width = "max-content";
      listaNavegacao.style.flexWrap = "nowrap";

      const larguraNecessaria = navegacaoPrincipal.offsetWidth;
      const estilosCabecalho = getComputedStyle(cabecalhoSite);
      const larguraDisponivel = cabecalhoSite.clientWidth
        - Number.parseFloat(estilosCabecalho.paddingLeft)
        - Number.parseFloat(estilosCabecalho.paddingRight);

      navegacaoPrincipal.style.maxWidth = larguraMaximaOriginal;
      navegacaoPrincipal.style.width = larguraOriginal;
      listaNavegacao.style.flexWrap = quebraOriginal;

      const deveCompactar = larguraNecessaria > larguraDisponivel;
      navegacaoPrincipal.classList.toggle("navegacao-compacta", deveCompactar);
      cabecalhoSite.classList.toggle("menu-compacto", deveCompactar);

      if (!deveCompactar) fecharMenu();
    };

    atualizarMenuCompacto();
    window.addEventListener("resize", atualizarMenuCompacto);

    if (document.fonts?.ready) {
      document.fonts.ready.then(atualizarMenuCompacto);
    }
  }
}
