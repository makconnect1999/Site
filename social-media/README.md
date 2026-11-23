# MAK CONNECT — Redes sociais

Pasta de trabalho do Instagram e das demais redes da MAK CONNECT (@mak.connect).

## Estrutura

```
social-media/                      ← planejamento (não vai para o site)
  README.md                        ← este guia
  identidade-visual.md             ← cores, fontes e tom de voz para posts
  instagram/
    AAAA-MM-tema/
      legendas.md                  ← legenda, fonte dos dados e status de cada post

public/social/                     ← imagens publicadas (vão para o site)
  instagram/
    AAAA-MM-tema/
      post-01.jpg ...
```

## Por que as imagens ficam em `public/social/`

Para publicar no Instagram por API (Windsor.ai), a imagem precisa ter um endereço público.
Tudo o que está em `public/` vai para o site no Netlify. Por isso, cada arte fica disponível em:

```
https://makconnect.com.br/social/instagram/AAAA-MM-tema/post-01.jpg
```

Essas páginas não aparecem no Google (cabeçalho `X-Robots-Tag: noindex` no `netlify.toml`).

## Regras para as imagens

- Formato JPEG, no máximo 8 MB.
- Feed: 1080 × 1350 px (4:5). Stories: 1080 × 1920 px (9:16).
- Nome do arquivo: `post-NN.jpg`, na ordem de publicação.

## Fluxo de um post

1. Arte criada no canvas de design e exportada em JPEG.
2. JPEG salvo em `public/social/instagram/AAAA-MM-tema/`.
3. Legenda e fonte dos dados registradas em `social-media/instagram/AAAA-MM-tema/legendas.md`.
4. Publicação aprovada pela Michelle e feita pelo Windsor.ai, usando o endereço público da imagem.
5. Status do post atualizado em `legendas.md`.

## Campanhas

| Pasta | Tema | Posts | Status |
|---|---|---|---|
| `2026-11-conceito` | 2 posts conceituais só com imagem (luxo, confiança) | 2 | Agendado |
| `2026-11-abertura` | Post de abertura (carrossel panorâmico de 5 slides) | 1 | Publicado em 19/11/2026 |
| `2026-11-mercado-influencia` | Dados do mercado de influência | 8 | Agendado |

## Calendário de publicação

Um post por dia, sempre no horário de maior engajamento de cada dia da semana segundo os estudos
de 2026 (Buffer, Metricool, Sprout Social, Hootsuite). Publicação automática pelo Windsor.ai. Horário de Brasília.

| Data | Horário | Post |
|---|---|---|
| 19/11 (qui) | 18h27 | Carrossel de abertura (publicado) |
| 20/11 (sex) | 18h40 | Conexão (publicado) |
| 23/11 (seg) | 20h10 | Solidez |
| 24/11 (ter) | 19h10 | Mercado 1 |
| 25/11 (qua) | 12h10 | Mercado 2 |
| 26/11 (qui) | 9h10 | Mercado 3 |
| 27/11 (sex) | 11h10 | Mercado 4 |
| 28/11 (sáb) | 10h10 | Mercado 5 |
| 29/11 (dom) | 20h10 | Mercado 6 |
| 30/11 (seg) | 20h10 | Mercado 7 |
| 01/12 (ter) | 19h10 | Mercado 8 |

Horário por dia da semana: seg 20h10 · ter 19h10 · qua 12h10 · qui 9h10 · sex 11h10 · sáb 10h10 · dom 20h10.
Depois de 4 a 6 semanas, comparar com o Instagram Insights (Público > Horários mais ativos) e ajustar.
