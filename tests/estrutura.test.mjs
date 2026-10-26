import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const ler = (ficheiro) => readFile(new URL(`../${ficheiro}`, import.meta.url), "utf8");

test("a página usa semântica, fontes e metadados preparados para pesquisa", async () => {
  const [pagina, robots] = await Promise.all([
    ler("index.html"),
    ler("robots.txt")
  ]);

  assert.match(pagina, /<html lang="pt">/);
  assert.match(pagina, /name="robots" content="index, follow">/);
  assert.match(pagina, /application\/ld\+json/);
  assert.match(pagina, /DM\+Sans.*DM\+Serif\+Display.*Space\+Mono/);
  assert.doesNotMatch(pagina, /<footer id="contact" class="site-footer">\s*<footer/);
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
});

test("a apresentação não mostra faixa de texto nem galeria extra", async () => {
  const [pagina, estilos] = await Promise.all([
    ler("index.html"),
    ler("css/inicio-sobre.css")
  ]);

  assert.doesNotMatch(pagina, /faixa-scroll/);
  assert.doesNotMatch(pagina, /galeria-tecnologia/);
  assert.doesNotMatch(estilos, /border-bottom:\s*2px dashed/);
  assert.doesNotMatch(estilos, /\.galeria-tecnologia/);
});

test("as secções de apresentação, sobre e competências mantêm a hierarquia de layout", async () => {
  const pagina = await ler("index.html");

  assert.match(
    pagina,
    /<section id="inicio" class="secao-inicio"[\s\S]*?<div class="acoes-iniciais">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/
  );
  assert.match(
    pagina,
    /<section id="sobre" class="secao-sobre" aria-labelledby="titulo-sobre">\s*<div class="conteudo-sobre">/
  );
  assert.doesNotMatch(
    pagina,
    /<section id="competencias" class="secao-competencias"[\s\S]*?<section id="sobre"/
  );
});

test("a experiência de scroll é suave, acessível e sem barra nativa", async () => {
  const [pagina, base, responsivo] = await Promise.all([
    ler("index.html"),
    ler("css/base.css"),
    ler("css/responsive.css")
  ]);

  assert.match(base, /scroll-behavior:\s*smooth/);
  assert.match(base, /scrollbar-width:\s*none/);
  assert.match(base, /::-webkit-scrollbar/);
  assert.doesNotMatch(pagina, /js\/scroll\.js/);
  assert.match(base, /margin:\s*clamp\(112px, 10vw, 140px\) auto clamp\(48px, 6vw, 60px\)/);
  assert.doesNotMatch(base, /min-width:\s*320px/);
  assert.doesNotMatch(responsivo, /margin-top:\s*180px/);
});

test("os nomes das classes e os seletores de projectos estão em português", async () => {
  const [pagina, estilos, projetos] = await Promise.all([
    ler("index.html"),
    ler("css/projetos.css"),
    ler("js/projects.js")
  ]);

  assert.match(pagina, /class="secao-projectos"/);
  assert.match(estilos, /\.cartao-projecto/);
  assert.match(projetos, /cartao-projecto/);
  assert.doesNotMatch(pagina, /class="projects-section"/);
});

test("a grelha de projectos adapta as colunas sem comprimir os cartões", async () => {
  const [estilos, estilosPublicados, responsivo] = await Promise.all([
    ler("css/projetos.css"),
    ler("dist/css/projetos.css"),
    ler("css/responsive.css")
  ]);

  assert.match(
    estilos,
    /\.grelha-projectos\s*\{[\s\S]*?grid-template-columns:\s*repeat\(auto-fit, minmax\(min\(100%, 280px\), 1fr\)\)/
  );
  assert.match(
    estilosPublicados,
    /\.grelha-projectos\s*\{[\s\S]*?grid-template-columns:\s*repeat\(auto-fit, minmax\(min\(100%, 280px\), 1fr\)\)/
  );
  assert.doesNotMatch(responsivo, /\.grelha-projectos\s*\{/);
});

test("os projetos adicionais passam para uma nova linha em ecrãs largos", async () => {
  const [estilos, estilosPublicados] = await Promise.all([
    ler("css/projetos.css"),
    ler("dist/css/projetos.css")
  ]);

  const regraDeTresColunas = /@media\s*\(min-width:\s*1500px\)\s*\{[\s\S]*?\.grelha-projectos\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/;

  assert.match(estilos, regraDeTresColunas);
  assert.match(estilosPublicados, regraDeTresColunas);
});

test("a galeria carrega o seu script e usa as seis fotografias disponíveis", async () => {
  const [pagina, galeria] = await Promise.all([
    ler("index.html"),
    ler("js/galeria.js")
  ]);
  const caminhos = [
    "assets/images/galeria/Startup1.jpeg",
    "assets/images/galeria/Startup2.jpeg",
    "assets/images/galeria/Startup3.jpeg",
    "assets/images/galeria/Startup4.jpeg",
    "assets/images/galeria/Startup5.jpeg",
    "assets/images/galeria/Startup6.jpeg"
  ];

  assert.match(pagina, /<script src="js\/galeria\.js" defer><\/script>/);

  for (const caminho of caminhos) {
    assert.match(galeria, new RegExp(`src: "${caminho}"`));
  }

  await Promise.all(caminhos.map((caminho) => access(new URL(`../${caminho}`, import.meta.url))));
});

test("a galeria mantém o cabeçalho na secção e oculta as setas ao expandir", async () => {
  const [pagina, estilos, galeria] = await Promise.all([
    ler("index.html"),
    ler("css/galeria.css"),
    ler("js/galeria.js")
  ]);

  assert.match(
    pagina,
    /<section id="gallery" class="gallery-section">\s*<div class="gallery-window">\s*<header class="section-header">[\s\S]*?<h2>Galeria<span>\.<\/span><\/h2>[\s\S]*?<p>Fotografias, pessoas e momentos da nossa jornada\.<\/p>[\s\S]*?<\/header>/
  );
  assert.match(pagina, /<li><a href="#gallery">Galeria<\/a><\/li>/);
  assert.match(pagina, /cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\//);
  assert.match(pagina, /gsap\.min\.js" defer><\/script>\s*<script src="js\/galeria\.js" defer>/);
  assert.match(estilos, /var\(--cor-texto\)/);
  assert.match(estilos, /var\(--fonte-tecnica\)/);
  assert.match(estilos, /\.gallery-carousel\.is-expanded\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(estilos, /\.gallery-carousel\.is-expanded \.gallery-arrow\s*\{[\s\S]*?display:\s*none/);
  assert.match(estilos, /\.gallery-more\s*\{[\s\S]*?min-height:\s*44px[\s\S]*?padding:\s*12px 18px[\s\S]*?border:\s*var\(--borda-padrao\)/);
  assert.match(estilos, /\.gallery-arrow\s*\{[\s\S]*?width:\s*44px[\s\S]*?height:\s*44px[\s\S]*?border:\s*var\(--borda-padrao\)/);
  assert.match(estilos, /\.gallery-footer\s*\{[\s\S]*?gap:\s*10px/);
  assert.match(estilos, /\.gallery-track\s*\{[\s\S]*?overflow-x:\s*auto[\s\S]*?scrollbar-width:\s*none/);
  assert.match(estilos, /\.gallery-track::-webkit-scrollbar\s*\{[\s\S]*?display:\s*none/);
  assert.match(galeria, /galleryCarousel\.classList\.toggle\("is-expanded", isExpanded\)/);
  assert.match(galeria, /window\.gsap/);
});
