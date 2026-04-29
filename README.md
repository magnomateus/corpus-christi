# 150 Moldes de Tapetes para Corpus Christi

Landing page do infoproduto **150 Moldes de Tapetes para Corpus Christi** — ebook digital com moldes prontos para imprimir e montar tapetes da procissão. Otimizada para tráfego pago no Meta Ads.

## Stack

- HTML5 + CSS puro (mobile-first, sem frameworks)
- JavaScript vanilla (sem libs)
- Google Fonts: Montserrat + Open Sans (com `display=swap`)
- Pixel: Utmify (pixel + UTMs)
- Checkout: VIS
- Hospedagem: DigitalOcean

## Paleta — "Céu de Procissão"

| Token | Hex | Uso |
|---|---|---|
| `--sky-blue` | `#7AB8E0` | Cor de identidade |
| `--cream` | `#FAF7F0` | Background base |
| `--gold` | `#D4A656` | CTAs, preços, ribbon |
| `--coral` | `#F5A088` | Urgência (faixa, timer) |
| `--success` | `#7DB97D` | Checks, "GRÁTIS" |
| `--text-dark` | `#2D4A6B` | Texto principal |

## Planos

| Plano   | Preço    | Inclui |
|---------|----------|--------|
| Básico  | R$ 17,90 | 150 moldes em PDF |
| Premium | R$ 29,90 (3x R$ 9,97) | 150 moldes + 4 bônus (Materiais, Combinação de Cores, Equipe, Moldes Extras) |
| Downsell (popup) | R$ 19,90 | Premium com desconto exclusivo (acionado pelo botão "Plano Básico") |

## Estrutura da página

1. Faixa de urgência (dias até Corpus Christi + data dinâmica)
2. Hero — headline + mockup + CTA principal
3. O que você recebe (checklist com 10 itens + chamada pros bônus)
4. Por que escolher (3 pilares em cards)
5. Bônus exclusivos (4 cards 2×2 com âncora R$ 150 → GRÁTIS)
6. Oferta — countdown + 2 planos lado a lado (Básico + Premium destacado)
7. Depoimentos (3 cards com avatar circular)
8. FAQ accordion (7 perguntas)
9. Garantia 7 dias (selo dourado + 4 bullets)
10. CTA final (gradient gold, fechamento devocional)
11. Footer mínimo + Popup downsell (modal acionado pelo Plano Básico)

## Estrutura de arquivos

```
.
├── index.html            # Página principal
├── styles.css            # Design system + 9 seções
├── script.js             # Countdown, FAQ accordion, popup
├── images/
│   ├── mockup-produto.svg    # Capa do ebook (placeholder)
│   ├── bonus-1.svg → 4.svg   # Covers dos 4 bônus (placeholders)
│   └── avatar-1.svg → 3.svg  # Avatares dos depoimentos (placeholders)
├── .gitignore
└── README.md
```

## Como rodar localmente

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

## ⚠️ Antes de publicar

- [ ] Substituir `REPLACE_WITH_YOUR_UTMIFY_PIXEL_ID` em `index.html` (linha 79)
- [ ] Plugar URL do checkout VIS Premium R$ 29,90 → `#TODO-VIS-PREMIUM`
- [ ] Plugar URL do checkout VIS Downsell R$ 19,90 → `#TODO-VIS-DOWNSELL`
- [ ] Plugar URL do checkout VIS Básico R$ 17,90 → `#TODO-VIS-BASICO`
- [ ] Substituir `images/mockup-produto.svg` pelo PNG real do mockup do ebook
- [ ] Substituir `images/bonus-*.svg` pelas artes reais dos bônus (opcional)
- [ ] Substituir `images/avatar-*.svg` por fotos reais (opcional — iniciais ficam OK)
- [ ] Adicionar `images/og-cover.jpg` (preview de compartilhamento)
- [ ] Adicionar `images/favicon.png`
- [ ] Conferir PageSpeed mobile (target: >90)
- [ ] Configurar pixel + Conversions API no Gerenciador de Ads do Meta

## Comportamentos JS

- **Faixa de urgência**: dias até próximo Corpus Christi (precomputado 2026–2032)
- **Countdown**: regressivo até 23:59:59 do dia, reset diário automático
- **FAQ**: accordion single-open com `aria-expanded`
- **Popup downsell**: abre ao clicar em "Plano Básico", fecha via X / clique fora / ESC
- **Smooth scroll**: âncoras internas com transição suave
