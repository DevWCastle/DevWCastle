---
name: DevWCastle Portfolio Design System
description: Sistema visual minimalista de engenharia em carvão escuro com detalhes técnicos e destaques verde-lima
colors:
  primary: "#C7F36B"
  primary-hover: "#DCFF4D"
  background: "#0B100D"
  surface-1: "#131A15"
  surface-2: "#1A231D"
  border: "#303B2A"
  text-primary: "#F0F0E9"
  text-muted: "#A5ADA5"
  badge-bg: "rgba(19, 26, 21, 0.75)"
  badge-border: "rgba(48, 59, 42, 0.8)"
typography:
  display:
    fontFamily: "Sora, sans-serif"
    fontWeight: "900"
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Sora, sans-serif"
    fontWeight: "800"
    letterSpacing: "-0.03em"
  subheading:
    fontFamily: "Archivo, sans-serif"
    fontWeight: "800"
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "17px"
    lineHeight: "1.65"
  mono:
    fontFamily: "JetBrains Mono, Sora, monospace"
    fontSize: "12.5px"
    fontWeight: "600"
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "20px"
  2xl: "28px"
  3xl: "32px"
  full: "99px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "36px"
  2xl: "56px"
  wrap: "1520px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.3xl}"
    border: "{colors.border}"
  input:
    backgroundColor: "rgba(0, 0, 0, 0.35)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
---

## Overview
Identidade visual calibrada para comunicar rigor técnico e confiabilidade de engenharia ("Preto & Lime Minimalista"). O design equilibra uma base escura em carvão com subtons frios e florestais (`#0B100D`), superfícies translúcidas com desfoque de fundo (`backdrop-filter`) e destaques em verde-lima eletrizante (`#C7F36B`). A atmosfera une a precisão cirúrgica de sistemas industriais à elegância de interfaces web contemporâneas.

## Colors
- **Fundo Primário (`#0B100D`):** Carvão escuro com discreto matiz esverdeado que reduz o cansaço visual e estabelece contraste profundo sem ser preto puro.
- **Superfície 1 (`#131A15`):** Superfície para cartões, caixas de diálogo e painéis principais de conteúdo, aplicada geralmente com 75% a 96% de opacidade e efeito de vidro fosco (`backdrop-filter: blur(14px)` a `16px`).
- **Superfície 2 (`#1A231D`):** Nível secundário de elevação para estados selecionados, detalhes internos e cartões aninhados (como o detalhe de tecnologia na stack técnica).
- **Linhas e Contornos (`#303B2A`):** Traço suave de borda estrutural que delimita cartões, seções e divisórias do letreiro contínuo sem competir com o conteúdo.
- **Texto Primário (`#F0F0E9`):** Branco levemente aquecido e dessaturado, garantindo legibilidade máxima e alta taxa de contraste sobre fundos escuros.
- **Texto Atenuado (`#A5ADA5`):** Cinza-oliva intermediário para parágrafos explicativos, legendas, kickers e rótulos secundários.
- **Acento Verde-Lima (`#C7F36B`):** Ponto focal de alta vibração reservado para chamadas para ação (CTAs), palavras em destaque (`<em>`), badges ativos, cursores de digitação e bordas do card em foco.
- **Hover Verde-Lima Claro (`#DCFF4D`):** Elevação de luminosidade ativada em estados de foco e sobreposição de botões primários.

## Typography
- **Display & Títulos Hero (`Sora`, peso 900, entrelinha 1.02, espaçamento -0.02em):** Letras maiúsculas de alto impacto visual no Hero, alternando trechos em cor sólida e efeitos de contorno vazado (`stroke-lime`).
- **Títulos de Seção (`Sora`, peso 800, tamanho responsivo de 30px a 54px, espaçamento -0.03em):** Cabeçalhos imponentes em maiúsculas com marcadores destacados em verde-lima (`<em>`).
- **Subtítulos & Seção Contato (`Archivo`, peso 800, tamanho de 24px a 36px, entrelinha 1.1):** Tipografia geométrica compacta com autoridade técnica.
- **Corpo de Texto (`Inter`, peso 400 a 600, tamanho base 17px, entrelinha 1.65):** Tipografia neutra e de alta legibilidade para blocos textuais, descrições de projetos e formulários.
- **Monoespacada (`JetBrains Mono` / `Sora`, peso 600, tamanho 12px a 13px, espaçamento 0.08em a 0.12em):** Usada em letras maiúsculas para categorias técnicas, kickers ("APRESENTAÇÃO", "COMPETÊNCIAS"), rótulos de campos e comandos.

## Layout
- **Container Máximo (`1520px` centralizado):** Largura delimitadora em `margin: 0 auto` com espaçamento lateral fluido de 18px a 40px (`clamp(18px, 4vw, 40px)`).
- **Espaçamento de Seções:** Respiro vertical amplo de 70px a 120px (`clamp(70px, 11vh, 120px)`) para conferir ritmo editorial desobstruído.
- **Grade Assimétrica do Hero:** Divisão em proporção 1.1fr para 0.9fr, equilibrando a tipografia e badges à esquerda com o retrato em moldura técnica à direita.
- **Grade de Conteúdo em Duas Colunas (`1fr 1fr`):** Padrão responsivo para textos descritivos e formulários, colapsando para coluna única (`1fr`) em telas abaixo de 860px.
- **Letreiro Contínuo (`TechStrip`):** Faixa infinita horizontal delimitada por linhas superior e inferior com máscara suave de desvanecimento (`mask-image: linear-gradient`) nas extremidades.

## Components
- **Botão Primário ("Pill Glow"):** Pílula totalmente arredondada (raio de 99px), preenchimento verde-lima (`#C7F36B`), texto escuro (`#0B100D`), peso 700 e brilho difuso (`box-shadow: 0 0 25px rgba(199, 243, 107, 0.35)`).
- **Botão Secundário ("Outline"):** Pílula com fundo escuro semitransparente (`rgba(19, 26, 21, 0.6)`), borda clara translúcida (`rgba(240, 240, 233, 0.3)`) e texto esbranquiçado.
- **Cartão de Projeto (`ProjectCard`):** Estrutura ampla com cantos arredondados generosos (raio de 32px), fundo translúcido em vidro escuro, divisão entre vitrine de mídia (320px de altura mínima) e especificações técnicas com etiquetas arredondadas.
- **Badges de Stack Técnica:** Itens em cantos arredondados médios (raio de 12px), ícone quadrado com fundo preto destacado e borda verde sutil, acompanhados de tipografia técnica.
- **Barra de Navegação Suspensa (`Navbar`):** Cabeçalho de 68px de altura fixado ao topo com efeito de vidro fosco (`backdrop-filter: blur(14px)`), ativando gradualmente sua opacidade e logo de acordo com a rolagem do Hero.
- **Campos de Entrada (`Input / Textarea`):** Superfícies com fundo preto translúcido (`rgba(0, 0, 0, 0.35)`), cantos arredondados (raio de 12px), sem borda rígida em repouso e sem adornos excessivos.

## States
- **Hover em Botões Primários:** Elevação sutil (`transform: translateY(-2px)`), luminosidade aumentada para `#DCFF4D` e intensificação do brilho difuso verde.
- **Hover em Botões Secundários:** Transição da cor da borda para o verde-lima (`#C7F36B`) com leve deslocamento superior.
- **Foco em Campos de Formulário (`:focus`):** Borda iluminada em verde-lima com anel de foco difuso (`box-shadow: 0 0 0 3px rgba(204, 255, 0, 0.18)`), preservando acessibilidade visual.
- **Card de Projeto Ativo (`is-active`):** Borda verde-lima destacada com anel duplo de sombra difusa (`rgba(187, 255, 0, 0.18)`), enquanto os slides inativos recebem escala reduzida (0.82) e opacidade a 45%.
- **Navegação com Rolagem (`is-scrolled`):** A barra de navegação transita de invisível no início do Hero para visível e com fundo fosco sólido assim que o Hero é percorrido.

## Motion
- **Revelação em Rolagem (`useScrollReveal`):** Deslocamento suave vertical de 20px com curva de aceleração cúbica natural (`cubic-bezier(0.22, 1, 0.36, 1)`) em 850ms, respeitando `prefers-reduced-motion`.
- **Efeito de Digitação Dinâmica:** Ciclo de digitação cadenciado a 55ms por caractere com pausa de 1800ms ao concluir cada frase, comunicando adaptabilidade técnica em tempo real.
- **Carrossel Tridimensional:** Transição de slides através de escala e translação no eixo X com curva elástica suave (`cubic-bezier(0.2, 0.7, 0.2, 1)` em 700ms).
- **Letreiro Contínuo:** Deslocamento linear constante de 25s por ciclo, pausando suavemente quando o usuário passa o cursor sobre a faixa (`:hover`).

## Anti-patterns
- **Gradientes "Cyberpunk" Clichês:** Evitar gradientes de roxo para azul, ciano sobre preto ou neons descontrolados que descaracterizam a identidade industrial e séria do projeto.
- **Cartões Dentro de Cartões sem Hierarquia:** Não aninhar múltiplos níveis de cartões com bordas idênticas; usar contraste de fundo (`--s1` vs `--s2`) e espaçamento em vez de criar caixas desnecessárias.
- **Animações Decorativas Distrativas:** Proibido uso de partículas flutuantes, efeitos de scanline agressivos ou rotações 3D contínuas que prejudiquem a leitura de métricas, código e links.
- **Fontes Genéricas Sem Personalidade:** Não substituir as combinações de `Sora` e `Inter` por padrões descontextualizados sem alinhamento com a linguagem técnica do portfólio.
- **Contraste Inadequado:** Nunca aplicar textos com cinza muito escuro sobre fundos profundos; utilizar sempre `--tx` para leitura primária e `--mu` para apoio secundário.
