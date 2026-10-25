import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
