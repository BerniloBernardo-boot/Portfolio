import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

class ListaClasses {
  #valores = new Set();

  add(...valores) {
    valores.forEach((valor) => this.#valores.add(valor));
  }

  remove(...valores) {
    valores.forEach((valor) => this.#valores.delete(valor));
  }

  contains(valor) {
    return this.#valores.has(valor);
  }

  toggle(valor, forcar) {
    if (forcar) {
      this.#valores.add(valor);
      return true;
    }

    this.#valores.delete(valor);
    return false;
  }
}

class ElementoFalso extends EventTarget {
  constructor() {
    super();
    this.classList = new ListaClasses();
    this.atributos = new Map();
    this.ouvintes = new Map();
    this.style = {};
  }

  addEventListener(tipo, ouvinte, opcoes) {
    this.ouvintes.set(tipo, ouvinte);
    return super.addEventListener(tipo, ouvinte, opcoes);
  }

  setAttribute(nome, valor) {
    this.atributos.set(nome, String(valor));
  }

  getAttribute(nome) {
    return this.atributos.get(nome) ?? null;
  }
}

const criarAmbiente = () => {
  const botao = new ElementoFalso();
  const lista = new ElementoFalso();
  const navegacao = new ElementoFalso();
  const cabecalho = new ElementoFalso();
  const documento = new EventTarget();
  documento.documentElement = new ElementoFalso();
  documento.querySelector = (seletor) => ({
    ".menu-hamburguer": botao,
    "#lista-navegacao": lista,
    ".navegacao-principal": navegacao,
    ".cabecalho-site": cabecalho
  }[seletor] ?? null);

  return { botao, lista, navegacao, cabecalho, documento };
};

test("o menu compacto abre por clique e fecha com Escape", async () => {
  const codigo = await readFile(new URL("../js/main.js", import.meta.url), "utf8");
  const { botao, lista, navegacao, cabecalho, documento } = criarAmbiente();
  cabecalho.clientWidth = 801;
  navegacao.offsetWidth = 762;
  lista.offsetWidth = 750;
  lista.scrollWidth = 750;

  vm.runInNewContext(codigo, {
    document: documento,
    getComputedStyle: () => ({ paddingLeft: "24px", paddingRight: "24px" }),
    window: { addEventListener() {} }
  });

  assert.equal(cabecalho.classList.contains("menu-compacto"), true);
  assert.equal(navegacao.classList.contains("navegacao-compacta"), true);

  botao.dispatchEvent(new Event("click"));
  assert.equal(botao.getAttribute("aria-expanded"), "true");
  assert.equal(lista.classList.contains("menu-aberto"), true);

  const escape = new Event("keydown");
  Object.defineProperty(escape, "key", { value: "Escape" });
  documento.dispatchEvent(escape);
  assert.equal(botao.getAttribute("aria-expanded"), "false");
  assert.equal(lista.classList.contains("menu-aberto"), false);

  botao.dispatchEvent(new Event("click"));
  const ligacao = { closest: (seletor) => (seletor === "a" ? ligacao : null) };
  lista.ouvintes.get("click")({ target: ligacao });
  assert.equal(botao.getAttribute("aria-expanded"), "false");
  assert.equal(lista.classList.contains("menu-aberto"), false);
});
