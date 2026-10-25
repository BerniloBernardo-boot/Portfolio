# Portfólio — Bernilo Bernardo

Portfólio pessoal estático construído com HTML5, CSS3 e JavaScript, sem
dependências nem passo de compilação.

## Arranque

Abrir `index.html` no browser, ou servir a pasta localmente:

```bash
python3 -m http.server 8000
```

Depois visitar <http://localhost:8000>.

## Estrutura

```text
index.html                  Página principal e metadados de pesquisa
css/variaveis.css           Cores, tipografia, sombras e camadas
css/base.css                Estilos globais e componentes partilhados
css/navegacao.css           Navegação principal
css/inicio-sobre.css        Secções de início e sobre mim
css/competencias.css        Secção de competências
css/projetos.css            Secção de projetos
css/equipa.css              Secção de equipa
css/servicos.css            Secção de serviços
css/rodape.css              Rodapé e formulário de contacto
css/responsive.css          Apenas ajustes por tamanho de ecrã
js/projects.js              Renderização e alternância de projetos
js/contact.js               Preparação da mensagem de contacto
assets/images/profile/      Fotografias de perfil
assets/images/projects/     Imagens dos projetos
assets/images/team/         Imagens da equipa
assets/icons/               Ícones (inclui favicon.svg)
robots.txt                  Permissões de rastreamento para motores de pesquisa
```
