# MAK CONNECT — Site

Site institucional da **MAK CONNECT**, assessoria e gestão de carreira para influenciadoras digitais (São Paulo).

Site estático (HTML, CSS e JavaScript puros), sem etapa de build. Os arquivos do site ficam em `public/`. Para ver localmente, abra `public/index.html` no navegador.

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
- Ao trocar o endereço do site, substitua `https://site-5dby.netlify.app` em `public/index.html`, `robots.txt`, `sitemap.xml` e `llms.txt`.
