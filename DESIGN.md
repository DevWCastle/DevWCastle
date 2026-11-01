---
name: DevWCastle Portfolio
description: Azul de marca sobre azul-noite e papel frio; o sinal do chão de fábrica virando produto
colors:
  brand-blue: "#0031f9"
  brand-blue-deep: "#0024b8"
  signal-blue: "#4a74ff"
  mist-blue: "#9db2ff"
  logo-cyan: "#00c6fc"
  night: "#020716"
  night-2: "#050f2a"
  night-3: "#0a1a42"
  snow: "#eef2ff"
  mist: "#a7b3d6"
  paper: "#f4f6fc"
  paper-2: "#e9eefa"
  white: "#ffffff"
  ink: "#050e2b"
  ink-2: "#3a4566"
  ink-line: "#d3daec"
  danger: "#ff9a9a"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.9rem, 8.6vw, 9.75rem)"
    fontWeight: 850
    lineHeight: 0.86
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 5rem)"
    fontWeight: 850
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.3vw, 2.125rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 108"
  lead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.8vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  field: "4px"
  pill: "999px"
  chamfer: "18px"
  chamfer-media: "28px"
  chamfer-photo: "36px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(96px, 14vh, 168px)"
  wrap: "1440px"
  nav: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 1.4rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.brand-blue-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.snow}"
    rounded: "{rounded.pill}"
    padding: "0 1.4rem"
    height: "48px"
  button-outline-ink:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.4rem"
    height: "48px"
  input:
    backgroundColor: "{colors.night}"
    textColor: "{colors.snow}"
    rounded: "{rounded.field}"
    padding: "14px 16px"
    height: "52px"
  tech-chip:
    backgroundColor: "transparent"
    textColor: "{colors.snow}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "7px 12px"
  nav-bar:
    backgroundColor: "{colors.night}"
    textColor: "{colors.mist}"
    rounded: "28px"
    height: "{spacing.nav}"
---

# Design System: DevWCastle Portfolio

## Overview

**Creative North Star: "O sinal vira produto"**

O portfólio conta uma passagem: do sinal de campo (um CLP ligando máquinas) até o software em produção. O sistema visual trata isso como um fio contínuo. Os campos escuros em azul-noite são o "campo" e a "sala de controle", o papel frio é a bancada onde o trabalho é examinado, e o azul da logo DWC é o próprio sinal: aparece em campos inteiros e em traço fino, nunca como brilho neon espalhado.

A tipografia é uma única grotesca (Archivo) em largura expandida e peso pesado para afirmar, e na largura normal para explicar. A mono (JetBrains Mono) só aparece onde há dado: hora, contagens, nomes de tecnologia, numeração de etapas. A forma vem das letras do wordmark DWC: cantos chanfrados a 45°.

Existe um único efeito pesado, no hero: o retrato em pontos azuis que se resolve na foto real perto do cursor. O resto do site não tem movimento contínuo; o movimento é sempre uma resposta (rolagem, clique, foco).

**Key Characteristics:**
- Azul de marca #0031F9 extraído do núcleo do wordmark; nenhuma outra cor dominante.
- Alternância de seções: azul-noite → papel → azul-noite (meio) → branco → azul-noite.
- Uma família tipográfica em duas larguras + mono só para dados.
- Chanfro de 45° em mídias e fotos; pílula em controles.
- Diagramas em traço fino sem preenchimento.

## Colors

Um azul só, em várias profundidades, sobre dois chãos: azul-noite e papel frio.

### Primary
- **Azul DWC** (brand-blue): o núcleo do wordmark. Botão primário, palavra de destaque em títulos sobre fundo claro, campo inteiro atrás de capturas de projeto e da foto do Sobre, números do livro-razão. Contraste de 7,6:1 sobre branco.
- **Azul DWC profundo** (brand-blue-deep): hover do botão primário e de links sobre fundo claro.
- **Azul sinal** (signal-blue): a versão do azul que funciona sobre azul-noite. Palavra de destaque em títulos escuros ("impacto real", "ao deploy"), traços de diagrama, foco. 5:1 sobre azul-noite.
- **Azul névoa** (mist-blue): texto pequeno de destaque sobre o escuro (números de etapa, links do rodapé no hover).
- **Ciano da logo** (logo-cyan): só a ponta da fita do preloader, como na ponta do gradiente da logo. Nunca em texto nem em superfície.

### Neutral
- **Azul-noite** (night): chão do hero, do contato e do rodapé.
- **Azul-noite 2** (night-2): chão da seção Stack e do painel do formulário.
- **Azul-noite 3** (night-3): círculo de ícone dos links de contato.
- **Neve** (snow): texto principal no escuro.
- **Névoa** (mist): texto secundário no escuro (9:1).
- **Papel frio** (paper): chão da seção Projetos.
- **Branco** (white): chão da seção Sobre, fundo das setas do carrossel.
- **Tinta** (ink) e **tinta 2** (ink-2): texto principal e secundário no claro.
- **Linha de tinta** (ink-line): divisórias e contornos no claro. No escuro, a divisória é `rgba(157, 178, 255, 0.16)`.
- **Alerta** (danger): só erro de formulário, sempre com ícone e texto.

### Named Rules
**The One Signal Rule.** O único acento é o azul da logo. Verde, roxo, laranja ou outro azul de outra família não entram, nem em gradiente.

**The Field Not Glow Rule.** Azul ocupa áreas (um campo atrás da foto, um botão, uma palavra inteira) ou é traço fino. Halo luminoso, `drop-shadow` colorido e texto com gradiente não fazem parte do sistema.

## Typography

**Display Font:** Archivo variável, largura 108–118, peso 800–850 (com Helvetica Neue, Arial)
**Body Font:** Archivo variável, largura 100, peso 400–600
**Label/Mono Font:** JetBrains Mono 400–500

**Character:** uma grotesca industrial em duas larguras: expandida e pesada para afirmar, normal para explicar. A mono é instrumento de medida, não fantasia de "técnico".

### Hierarchy
- **Display** (850, até 9,75rem, entrelinha 0,86, maiúsculas): só o título do hero, ancorado na base.
- **Headline** (850, até 5rem, entrelinha 0,94, maiúsculas): títulos de seção, com a segunda parte em azul.
- **Title** (800, até 2,125rem): nome de projeto e de camada da Stack.
- **Lead** (400, até 1,625rem, entrelinha 1,35–1,4): frase de abertura de seção, linha de cada etapa.
- **Body** (400, 1,0625rem, entrelinha 1,6, até ~58ch): descrições.
- **Label** (mono 500, 0,75rem, maiúsculas, espaçamento 0,06em, numerais tabulares): hora, 01 / 06, tags de tecnologia, contador de caracteres.

### Named Rules
**The No Eyebrow Rule.** Nenhum rótulo pequeno acima de título de seção. O título se sustenta sozinho.

**The Mono Is Data Rule.** Mono só para hora, contagem, numeração e nomes de tecnologia. Frase em mono é proibida.

## Layout

Contêiner de até 1440px com margem lateral fluida (`clamp(16px, 4vw, 56px)`) e respiro vertical de seção de `clamp(96px, 14vh, 168px)`. Mais espaço acima de um título do que abaixo.

- **Hero:** grade de duas colunas e três linhas. Metadados editoriais no topo (logo, Atualmente, Base com hora de Brasília, Navegação, CTA em contorno), retrato em pontos na metade direita ocupando a altura, parágrafo e "Ver projetos" à esquerda, título gigante ancorado embaixo, atravessando o retrato.
- **Projetos:** trilho largo (até 1240px por slide) com o próximo slide aparecendo na borda; mídia e ficha lado a lado.
- **Stack:** diagrama fixo (sticky) à esquerda, etapas de ~50vh à direita.
- **Sobre:** foto fixa (sticky) à esquerda, texto, trajetória e livro-razão à direita.
- **Contato:** links diretos à esquerda, formulário à direita.

Responsivo: até 1180px os metadados do hero perdem a coluna Navegação; até 900px tudo vira coluna única (no hero, o retrato fica no alto e o título e o texto embaixo; na Stack, cada etapa traz a própria forma; a foto do Sobre fica quadrada); até 520px os botões principais ocupam a largura toda e a trajetória fica vertical.

## Elevation & Depth

O sistema é plano e usa camadas tonais: azul-noite → azul-noite 2 → azul-noite 3 no escuro, papel → branco no claro. Sombra só existe onde um objeto está de fato acima de outro.

### Shadow Vocabulary
- **Captura flutuante** (`box-shadow: 0 24px 48px -16px rgba(2, 7, 22, 0.6)`): capturas de tela sobre o campo azul do projeto.
- **Barra de navegação** (`box-shadow: 0 12px 32px -12px rgba(2, 7, 22, 0.55)`): a barra flutuante sobre o conteúdo.

### Named Rules
**The No Glass Rule.** Sem `backdrop-filter` decorativo. A barra de navegação é sólida (azul-noite a 94%).

## Shapes

Três formas, cada uma com um papel:
- **Chanfro a 45°** (18px; 28px em mídias de projeto; 36px na foto do Sobre), recortado com `clip-path` de seis vértices: tudo que é conteúdo visual (mídias, fotos). Vem das letras do wordmark DWC.
- **Pílula** (999px): tudo que é controle (botões, chips de tecnologia, seletor do retrato, barra de navegação a 28px).
- **Canto quase reto** (4px): campos de formulário e nós de diagrama.

Diagramas são desenhados em traço fino (1,2–1,4px) sem preenchimento, com `stroke-linecap: round`.

## Components

### Buttons
- **Shape:** pílula (999px), altura mínima de 48px (44px na navegação).
- **Primary:** fundo azul DWC, texto branco, peso 600; ícone de seta em SVG de traço 1,6.
- **Hover / Focus:** o fundo escurece para o azul profundo, a seta anda 3px na direção dela, `:active` reduz para 0,98. O foco usa um contorno de 2px em azul sinal com 3px de afastamento.
- **Outline (escuro):** borda azul-névoa a 45%; no hover a borda vira azul sinal e o fundo ganha azul a 16%.
- **Outline (claro):** borda linha de tinta; no hover a borda e o texto viram azul DWC.

### Chips
- **Style:** chips de tecnologia são pílulas com borda de divisória, mono maiúscula. No claro (projetos) viram texto mono solto sobre uma linha.

### Cards / Containers
- **Corner Style:** não há cards. A mídia de projeto é um campo chanfrado (azul DWC para capturas, azul-noite para diagramas); o painel do formulário é um retângulo azul-noite 2 com borda de divisória.
- **Internal Padding:** `clamp(20px, 4vw, 48px)` na mídia, `clamp(24px, 3.5vw, 44px)` no formulário.

### Inputs / Fields
- **Style:** fundo azul-noite, borda de divisória de 1px, canto de 4px, 52px de altura.
- **Focus:** borda azul sinal com anel de 3px em azul DWC a 35%; o rótulo passa de névoa para neve.
- **Valid / Error:** quando válido, a borda fica azul e aparece um ✓ (SVG). Quando há erro, a borda usa a cor de alerta e aparece uma mensagem com ícone de triângulo dizendo o problema e como corrigir. O textarea tem contador de caracteres.

### Navigation
- **Hero:** linha de metadados com links sublinhados.
- **Barra flutuante:** só aparece depois do hero, some ao rolar para baixo e volta ao rolar para cima. A seção ativa é marcada por uma pílula azul que desliza entre os links. No mobile vira um menu em lista com setas, que fecha com Esc.

### Retrato em pontos (signature)
Canvas 2D carregado sob demanda que amostra a foto real (com alfa). Tem três desenhos alternáveis (Pontos, Pixels, Linhas) em cinco tons do azul de marca. Perto do cursor, os pontos se afastam e a foto nítida aparece. Entra com uma varredura de cima para baixo e para o laço quando nada muda. Em toque e com movimento reduzido, o desenho é estático.

### Stack em camadas (signature)
Seis formas em traço (sinal, controlador, API, banco, interface, deploy) desenhadas com `stroke-dashoffset` conforme cada etapa cruza o meio da tela. As camadas já passadas ficam em azul sinal, a atual em neve e as próximas em fantasma.

### Preloader
Só na primeira visita da sessão, até ~1,5s, desligado com movimento reduzido. Mostra uma fita de luz azul que se organiza, contador 000–100 no canto inferior esquerdo, revelação da logo e do nome e uma cortina que sobe para o azul-noite do hero, sem clarão. "Pular intro" e Esc encerram a intro.

## Do's and Don'ts

### Do:
- **Do** usar o azul DWC (#0031F9) sobre fundo claro e o azul sinal (#4A74FF) sobre fundo escuro.
- **Do** alternar os chãos das seções para dar ritmo, com uma seção escura no meio.
- **Do** recortar mídias e fotos com o chanfro de 45°.
- **Do** desenhar ícones em SVG de traço único (1,6px), nunca com setas em Unicode.
- **Do** respeitar `prefers-reduced-motion`, mostrando o estado final sem transição.
- **Do** mostrar só números conferidos (repositórios, commits, tecnologias listadas).

### Don't:
- **Don't** usar verde-lima, roxo ou qualquer outra cor dominante. O sistema antigo em carvão e lima foi aposentado.
- **Don't** colocar rótulos/eyebrows acima de títulos de seção.
- **Don't** usar texto com gradiente, glass decorativo ou halo neon.
- **Don't** adicionar movimento contínuo fora do hero (letreiros, autoplay, partículas).
- **Don't** aninhar cards nem montar grades de ícones em tiles para a stack.
