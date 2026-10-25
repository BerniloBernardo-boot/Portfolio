const LIMITE_INICIAL = 3;

const projetos = [
  { titulo: "Cuidar Angola", descricao: "Plataforma para conectar centros de acolhimento, doadores e parceiros em Angola.", imagem: "assets/images/projects/cuidar-angola.png", site: "", repositorio: "", destaque: true },
  { titulo: "Portal Escolar", descricao: "Plataforma de informação escolar para divulgar eventos, avisos e atividades académicas.", imagem: "assets/images/projects/portal-escolar.png", site: "", repositorio: "", destaque: false },
  { titulo: "Terminus", descricao: "Assistente de terminal Linux para explicar comandos e ajudar a diagnosticar problemas.", imagem: "assets/images/profile/WhatsApp Image 2026-10-25 at 13.59.49.jpeg", site: "", repositorio: "https://github.com/BerniloBernardo-boot/terminus", destaque: false }
];

const grelhaProjetos = document.querySelector("#grelha-projectos");
const alternarProjetos = document.querySelector("#alternar-projectos");
let mostrarTodos = false;

function escaparHTML(valor = "") {
  return String(valor).replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

function renderizarProjeto(projeto, indice) {
  const titulo = escaparHTML(projeto.titulo);
  const descricao = escaparHTML(projeto.descricao);
  const imagem = escaparHTML(projeto.imagem || "");
  const site = escaparHTML(projeto.site || "");
  const repositorio = escaparHTML(projeto.repositorio || "");
  const ligacoes = [
    site ? `<a class="botao-retro link-projecto" href="${site}" target="_blank" rel="noopener noreferrer">Ver site ↗</a>` : "",
    repositorio ? `<a class="botao-retro link-projecto repositorio-projecto" href="${repositorio}" target="_blank" rel="noopener noreferrer"><span>Repositório</span><span aria-hidden="true">↗</span></a>` : ""
  ].filter(Boolean).join("");

  return `
    <article class="cartao-projecto${projeto.destaque ? " em-destaque" : ""}" ${projeto.destaque ? 'data-destaque="true"' : ""} ${!mostrarTodos && indice >= LIMITE_INICIAL ? "hidden" : ""}>
      ${projeto.destaque ? '<span class="rotulo-destaque-projecto">Em destaque</span>' : ""}
      <div class="imagem-projecto">
        ${imagem ? `<img src="${imagem}" alt="${titulo}" loading="lazy" decoding="async">` : '<div class="imagem-projecto-alternativa">Imagem do projeto</div>'}
      </div>
      <div class="conteudo-projecto">
        <h3 class="titulo-projecto">${titulo}</h3>
        <p class="descricao-projecto">${descricao}</p>
        ${ligacoes ? `<div class="links-projecto">${ligacoes}</div>` : ""}
      </div>
    </article>
  `;
}

function renderizarProjetos() {
  if (!grelhaProjetos) return;

  grelhaProjetos.innerHTML = projetos.map(renderizarProjeto).join("");

  if (alternarProjetos) {
    alternarProjetos.hidden = projetos.length <= LIMITE_INICIAL;
    alternarProjetos.textContent = mostrarTodos ? "Mostrar menos" : "Ver todos os projetos";
    alternarProjetos.setAttribute("aria-expanded", String(mostrarTodos));
  }
}

if (alternarProjetos) {
  alternarProjetos.addEventListener("click", () => {
    mostrarTodos = !mostrarTodos;
    renderizarProjetos();
  });
}

renderizarProjetos();
