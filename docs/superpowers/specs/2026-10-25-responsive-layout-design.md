# Auditoria e Desenho de Responsividade

## Objetivo

Fazer o portfólio estático adaptar-se de 320 px a ultrawide sem alterar a identidade retro, as cores, as fontes, o conteúdo ou a estrutura semântica existente. Não serão introduzidos frameworks, dependências ou uma reescrita do projeto.

## Estrutura auditada

- `index.html`: página única com cabeçalho fixo, sete âncoras, seis áreas de conteúdo e rodapé.
- `css/`: estilos por área, variáveis partilhadas e uma folha de respostas existente.
- `js/projects.js`: gera os cartões de projeto; não calcula dimensões nem posicionamento.
- `js/contact.js`: processa o formulário e atualiza o ano; não calcula dimensões nem posicionamento.
- `js/main.js`: não contém lógica de layout.

## Evidências e problemas encontrados

| Local | Evidência | Efeito provável |
| --- | --- | --- |
| `css/base.css:18` | `body` tem `min-width: 320px` | Pode gerar scroll horizontal abaixo de 320 px e em simulações com scrollbar. |
| `css/base.css:61-63` | A área principal usa 80% sem largura máxima e uma margem superior fixa | Em ultrawide o conteúdo torna-se demasiado largo; a margem deixa de acompanhar a altura real da navegação quando esta quebra linhas. |
| `css/navegacao.css:4-9` | Cabeçalho fixo e navegação com `flex-wrap` | A navegação é acessível e tem alvos de 44 px, mas pode ter duas ou mais linhas antes da regra de 650 px, sobrepondo-se ao início. |
| `css/inicio-sobre.css:48-50` | Colunas `1fr 300px` com `gap: 48px` | Entre aproximadamente 651 px e 1 000 px, o texto pode ficar demasiado estreito antes de a grelha passar para uma coluna. |
| `css/projetos.css:19` | Três colunas fixas até 800 px | Cartões ficam estreitos em tablets pequenos. |
| `css/servicos.css:81` | Duas colunas fixas até 650 px | Cartões ficam estreitos entre telemóvel grande e tablet pequeno. |
| `css/responsive.css` | Regras desktop-first em 800/700/650/600/380 px | Cobrem alguns tamanhos, mas há transições bruscas e valores redundantes em vez de comportamento intrínseco. |
| `css/base.css:25-27` | Imagens só definem `max-width` global | A maioria mantém proporção por defeito, mas falta a salvaguarda explícita `height: auto`; as imagens em molduras já usam `object-fit` corretamente. |
| `js/projects.js:4-6` | `cuidar-angola.png` e `portal-escolar.png` são referidas, mas não existem | São imagens partidas, uma questão de conteúdo/ativos e não de layout. Não serão removidas nem substituídas sem indicação. |

Não existem usos de `position: absolute`. Os usos de `position: fixed` são o cabeçalho e o link “Saltar para o conteúdo”; ambos têm justificação, mas o cabeçalho precisa de uma variante móvel que respeite a sua altura real.

## Decisões de implementação

1. Manter a composição desktop, com uma largura máxima para preservar a medida de leitura em ultrawide.
2. Substituir grelhas rígidas por `repeat(auto-fit, minmax(...))` onde os cartões devem reflowar naturalmente.
3. Fazer a área “Sobre mim” passar para uma coluna por capacidade real da grelha, não por uma largura fixa arbitrária.
4. Em ecrãs compactos, apresentar um menu hambúrguer retro dentro da navegação. Com JavaScript, abre e fecha por toque, clique, teclado e Escape; sem JavaScript, os links continuam sempre visíveis e utilizáveis.
5. Usar `clamp()` apenas para margens, espaçamentos e tamanhos que realmente precisam de interpolação; manter as bordas, sombras, ícones pixelizados e dimensões funcionais atuais.
6. Não usar `overflow-x: hidden` como correção.

## Matriz de comportamento pretendido

| Larguras | Comportamento esperado |
| --- | --- |
| 320–480 px | Menu hambúrguer retro com alvos de toque; uma coluna em Sobre, Projetos, Equipa, Serviços e Rodapé; competências refluem sem cortar etiquetas. |
| 768–834 px | Navegação sem sobreposição; Sobre ganha duas colunas apenas se houver largura; Projetos e Serviços escolhem uma ou duas colunas segundo o espaço disponível. |
| 1024–1440 px | Composição editorial atual preservada; cartões ocupam duas ou três colunas segundo a largura disponível. |
| 1920 px e ultrawide | Área de leitura limitada; grelhas podem ganhar colunas sem expandir linhas de texto ou cartões de forma excessiva. |

## Limitações de verificação neste ambiente

Os testes Node e as verificações de sintaxe funcionam. Não há Playwright instalado. Em 25-10-2026, a tentativa de usar Firefox em modo headless para capturar o HTML local a 320 px terminou em `SIGSEGV`; o histórico de `coredumpctl` mostra a mesma falha para capturas anteriores do portfólio. Assim, não há validação visual fiável dos viewports neste ambiente. A matriz de 320–1920 px, zoom, Safari e toque físico terá de ser confirmada num browser funcional após a implementação.
