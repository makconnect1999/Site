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
https://makconnect.netlify.app/social/instagram/AAAA-MM-tema/post-01.jpg
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

Agendado para publicação automática pelo Windsor.ai, às 18h40 (horário de Brasília).

| Data | Post |
|---|---|
| 19/11 (qui) | Carrossel de abertura (publicado) |
| 20/11 (sex) | conexao |
| 21/11 (sáb) | solidez |
| 24/11 (ter) | post-01 |
| 26/11 (qui) | post-02 |
| 01/12 (ter) | post-03 |
| 03/12 (qui) | post-04 |
| 08/12 (ter) | post-05 |
| 10/12 (qui) | post-06 |
| 15/12 (ter) | post-07 |
| 17/12 (qui) | post-08 |
