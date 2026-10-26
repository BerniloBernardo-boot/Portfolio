const LIMITE_INICIAL = 3;

const projetos = [

 { titulo: "Manual Linux", descricao: "Linux Manual** é um projeto de documentação criado para facilitar a aprendizagem de Linux, com guias práticos, explicações claras e conteúdos organizados por nível de dificuldade. O objetivo é ajudar iniciantes a compreender os comandos, utilizar o terminal e resolver problemas comuns, promovendo uma aprendizagem gradual e autónoma.", imagem: "assets/images/projects/Linux.jpeg", site: "", repositorio: "https://github.com/BerniloBernardo-boot/Linux-Manual", destaque: true },

  { titulo: "Git-GiHub", descricao: "Guia completo e gratuito de Git e GitHub, do zero ao nível profissional, em português. Criado para estudo individual e em equipa — incluindo o workflow real do projeto Cuidar Angola (main → produção, develop → integração.", imagem: "assets/images/projects/git-github.svg", site: "", repositorio: "https://github.com/BerniloBernardo-boot/Git-e-GitHub", destaque: false },


  { titulo: "Terminus", descricao: "O Terminus é um assistente de terminal desenvolvido em Python para tornar o Linux mais fácil de compreender e utilizar. Combina uma base de conhecimento offline com assistência de IA online para explicar comandos, ajudar a diagnosticar problemas e orientar os utilizadores na resolução de erros. Foi pensado especialmente para iniciantes, com foco na segurança, na aprendizagem e na compreensão do que acontece no sistema antes de executar alterações.", imagem: "assets/images/projects/terminus-basico.svg", site: "", repositorio: "https://github.com/BerniloBernardo-boot/terminus", destaque: false },

 { titulo: "free-tech-certifications", descricao: "O Free Tech Certifications é um repositório que reúne recursos e oportunidades de certificação gratuita na área da tecnologia. Organiza opções de aprendizagem para ajudar estudantes e profissionais a desenvolver competências, ampliar os seus conhecimentos e fortalecer o currículo sem depender de formações pagas.", imagem: "assets/images/projects/certificados.svg", site: "", repositorio: "https://github.com/BerniloBernardo-boot/free-tech-certifications", destaque: false },

 { titulo: "Link-in-Bio", descricao: "Este projeto funciona como a minha página de links pessoais, facilitando o acesso ao meu portfólio, GitHub, LinkedIn e YouTube através de um único endereço.", imagem: "assets/images/projects/bernilo-links.svg", site: "", repositorio: " https://github.com/BerniloBernardo-boot/link-in-bio", destaque: false }

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
