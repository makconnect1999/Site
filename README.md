# MAK CONNECT — Site

Site institucional da **MAK CONNECT**, assessoria e gestão de carreira para influenciadoras digitais (São Paulo).

Site estático (HTML, CSS e JavaScript). As páginas fixas ficam em `public/` e as matérias do blog em `content/blog/`. O comando `npm run build` monta o site completo em `dist/`.

## Seções
Hero 3D · Sobre (missão e visão) · Influenciadoras / Marcas · Método MAK · Valores · Boutique · Contato

## Contato
- E-mail: contato.makconnect@gmail.com
- Instagram: @mak.connect
- WhatsApp: (11) 99705-3316


## Publicação
- **Provisória — GitHub Pages:** branch `gh-pages` → https://makconnect1999.github.io/Site/
- **Definitiva — Netlify:** importe o repositório no Netlify. O `netlify.toml` já está configurado (sem build, publica a pasta `public/`). O formulário usa Netlify Forms (mensagens em Netlify → Forms). Fora do Netlify, ele abre o app de e-mail do visitante.

## SEO e IAs
- Metatags completas (título, descrição, canonical, Open Graph, Twitter) e imagem de prévia `og-image.png`.
- Dados estruturados JSON-LD: Organization, ProfessionalService, WebSite, WebPage e FAQPage.
- `robots.txt` (libera buscadores e robôs de IA), `sitemap.xml` e `llms.txt` (resumo da empresa para IAs).
- Ao trocar o endereço do site, substitua `https://makconnect.netlify.app` em `public/index.html`, `robots.txt`, `sitemap.xml` e `llms.txt`.

## Blog
- Matérias em `content/blog/NNN-slug.md`, com cabeçalho `titulo`, `descricao`, `data` (AAAA-MM-DD) e `categoria`. Autora: Michelle Ashley King.
- Só entram no site as matérias com `data` igual ou anterior a hoje (horário de São Paulo).
- A função agendada `netlify/functions/publicar-diario.mjs` republica o site todo dia às 06:05 (Brasília), usando o gancho de publicação guardado na variável `BUILD_HOOK_URL` do Netlify. Assim, a matéria do dia entra no ar sozinha.
- Para ver todas as matérias localmente, inclusive as agendadas: `PREVIEW_ALL=1 npm run build` e abra `dist/`.
- Para trocar o endereço do site, mude `SITE_URL` em `netlify.toml`.
