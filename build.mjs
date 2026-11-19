// Gera o site final em dist/: copia public/ e monta o blog a partir de content/blog/*.md.
// Só entram as matérias com data igual ou anterior a hoje (horário de São Paulo).
// Uso: npm run build   (PREVIEW_ALL=1 mostra também as matérias agendadas, só para teste local)
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'dist');
const POSTS_DIR = path.join(ROOT, 'content', 'blog');

const ORIGINAL_URL = 'https://makconnect.netlify.app';
const SITE_URL = (process.env.SITE_URL || ORIGINAL_URL).replace(/\/$/, '');
const AUTHOR = { name: 'Michelle Ashley King', slug: 'michelle-ashley-king' };
const TZ = 'America/Sao_Paulo';

const today = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const previewAll = process.env.PREVIEW_ALL === '1';

// ---------- utilidades ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const fmtDate = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} de ${MESES[m - 1]} de ${y}`; };
const isoDate = (d) => `${d}T06:00:00-03:00`;
const write = (rel, content) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else if (/\.(html|txt|xml|webmanifest)$/.test(e.name) && SITE_URL !== ORIGINAL_URL) {
      fs.writeFileSync(b, fs.readFileSync(a, 'utf8').split(ORIGINAL_URL).join(SITE_URL));
    } else fs.copyFileSync(a, b);
  }
}

function parsePost(file) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Cabeçalho ausente em ${file}`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  for (const k of ['titulo', 'descricao', 'data', 'categoria']) if (!meta[k]) throw new Error(`Falta "${k}" em ${file}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.data)) throw new Error(`Data inválida em ${file}`);
  const body = m[2].trim();
  const words = body.split(/\s+/).length;
  return {
    file, ...meta,
    slug: file.replace(/^\d+-/, '').replace(/\.md$/, ''),
    catSlug: slugify(meta.categoria),
    html: marked.parse(body).replace(/<input (?:checked="" )?disabled="" type="checkbox">/g, '<span class="check" aria-hidden="true"></span>'),
    minutes: Math.max(1, Math.round(words / 200)),
  };
}

// ---------- modelos de página ----------
const SITE_JSON = { '@type': 'Organization', '@id': `${SITE_URL}/#organizacao`, name: 'MAK CONNECT', url: `${SITE_URL}/`, logo: `${SITE_URL}/icon-512.png` };

function head({ title, description, url, type = 'website', jsonld, extra = '', image = `${SITE_URL}/og-image.png` }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#0B0B0C">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="MAK CONNECT">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${image}">
${extra}  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Blog MAK CONNECT" href="${SITE_URL}/blog/feed.xml">
  <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/blog.css">
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="nav wrap">
  <a href="/" class="logo" aria-label="MAK CONNECT — início">
    <span class="logo-mak">MAK</span>
    <span class="logo-connect">CONNECT</span>
  </a>
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu">
    <span></span><span></span>
  </button>
  <nav id="menu" class="menu" aria-label="Principal">
    <a href="/#sobre">Sobre</a>
    <a href="/#dois-lados">Influenciadoras</a>
    <a href="/#dois-lados">Marcas</a>
    <a href="/#metodo">Método</a>
    <a href="/blog/">Blog</a>
    <a href="/#contato" class="btn btn-outline">Fale com a MAK</a>
  </nav>
</header>
`;
}

const footer = `
<footer class="footer">
  <div class="wrap foot">
    <div class="logo logo-sm"><span class="logo-mak">MAK</span><span class="logo-connect">CONNECT</span></div>
    <address class="foot-addr">São Paulo · SP · Brasil</address>
    <span class="foot-links">
      <a href="mailto:contato.makconnect@gmail.com">contato.makconnect@gmail.com</a>
      <a href="https://www.instagram.com/mak.connect/" target="_blank" rel="noopener">@mak.connect</a>
      <a href="https://wa.me/5511997053316" target="_blank" rel="noopener">(11) 99705-3316</a>
    </span>
    <span>© ${today.slice(0, 4)} MAK CONNECT</span>
  </div>
</footer>
<script src="/blog.js" defer></script>
</body>
</html>
`;

const card = (p, h = 'h3') => `
      <article class="post-card">
        <img class="post-thumb" src="/blog/capas/${p.slug}.jpg" alt="" width="1200" height="630" loading="lazy" decoding="async">
        <p class="post-cat"><a href="/blog/categoria/${p.catSlug}/">${esc(p.categoria)}</a></p>
        <${h}><a href="/blog/${p.slug}/">${esc(p.titulo)}</a></${h}>
        <p class="post-desc">${esc(p.descricao)}</p>
        <p class="post-meta"><time datetime="${p.data}">${fmtDate(p.data)}</time> · ${p.minutes} min de leitura</p>
      </article>`;

const breadcrumbLD = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
});

const authorLD = { '@type': 'Person', '@id': `${SITE_URL}/blog/autora/${AUTHOR.slug}/#pessoa`, name: AUTHOR.name, url: `${SITE_URL}/blog/autora/${AUTHOR.slug}/`, worksFor: { '@id': `${SITE_URL}/#organizacao` } };

function listPage({ rel, title, h1, intro, description, posts, cats, activeCat, crumbs, extraLD = [] }) {
  const url = `${SITE_URL}/${rel}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      SITE_JSON,
      { '@type': 'CollectionPage', '@id': `${url}#pagina`, url, name: title, description, inLanguage: 'pt-BR', isPartOf: { '@type': 'WebSite', url: `${SITE_URL}/`, name: 'MAK CONNECT' } },
      breadcrumbLD(crumbs),
      ...extraLD,
    ],
  };
  const chips = cats.map((c) => `<a href="/blog/categoria/${c.slug}/"${c.slug === activeCat ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('');
  return head({ title, description, url, jsonld: ld }) + `
<main id="conteudo" class="wrap blog">
  <nav class="crumbs" aria-label="Você está em">${crumbs.map(([n, u], i) => (i < crumbs.length - 1 ? `<a href="${u.replace(SITE_URL, '')}">${esc(n)}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(n)}</span>`)).join('')}</nav>
  <header class="blog-head">
    <p class="eyebrow">Blog MAK CONNECT</p>
    <h1>${h1}</h1>
    <p class="muted">${esc(intro)}</p>
  </header>
  <nav class="chips" aria-label="Categorias"><a href="/blog/"${activeCat ? '' : ' aria-current="page"'}>Todas</a>${chips}</nav>
  <div class="post-grid">${posts.map((p) => card(p, 'h2')).join('')}
  </div>
</main>` + footer;
}

// ---------- montagem ----------
fs.rmSync(OUT, { recursive: true, force: true });
copyDir(SRC, OUT);

const all = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).sort().map(parsePost);
const slugs = new Set();
for (const p of all) { if (slugs.has(p.slug)) throw new Error(`Slug repetido: ${p.slug}`); slugs.add(p.slug); }
const posts = all.filter((p) => previewAll || p.data <= today)
  .sort((a, b) => (a.data === b.data ? b.file.localeCompare(a.file) : b.data.localeCompare(a.data)));

const catMap = new Map();
for (const p of posts) catMap.set(p.catSlug, p.categoria);
const cats = [...catMap].map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

const blogCrumb = ['Blog', `${SITE_URL}/blog/`];
const homeCrumb = ['Início', `${SITE_URL}/`];

// Índice do blog
write('blog/index.html', listPage({
  rel: 'blog/',
  title: 'Blog MAK CONNECT | Mercado de influência, carreira e marcas',
  h1: 'Mercado de <em>influência</em>, sem mistério.',
  intro: 'Guias práticos para influenciadoras que querem tratar a carreira como negócio e para marcas que buscam parcerias autênticas com criadoras de conteúdo.',
  description: 'Blog da MAK CONNECT sobre marketing de influência: carreira de influenciadoras, contratos, precificação, campanhas com marcas e tendências do mercado.',
  posts, cats, activeCat: null, crumbs: [homeCrumb, blogCrumb],
  extraLD: [{ '@type': 'Blog', '@id': `${SITE_URL}/blog/#blog`, name: 'Blog MAK CONNECT', url: `${SITE_URL}/blog/`, inLanguage: 'pt-BR', publisher: { '@id': `${SITE_URL}/#organizacao` } }],
}));

// Categorias
for (const c of cats) {
  const list = posts.filter((p) => p.catSlug === c.slug);
  write(`blog/categoria/${c.slug}/index.html`, listPage({
    rel: `blog/categoria/${c.slug}/`,
    title: `${c.name} | Blog MAK CONNECT`,
    h1: esc(c.name),
    intro: `Matérias sobre ${c.name.toLowerCase()} no blog da MAK CONNECT, assessoria de influenciadoras em São Paulo.`,
    description: `Matérias sobre ${c.name.toLowerCase()}: guias práticos da MAK CONNECT sobre o mercado de influência.`,
    posts: list, cats, activeCat: c.slug, crumbs: [homeCrumb, blogCrumb, [c.name, `${SITE_URL}/blog/categoria/${c.slug}/`]],
  }));
}

// Página da autora
write(`blog/autora/${AUTHOR.slug}/index.html`, listPage({
  rel: `blog/autora/${AUTHOR.slug}/`,
  title: `${AUTHOR.name} | Blog MAK CONNECT`,
  h1: esc(AUTHOR.name),
  intro: `Matérias de ${AUTHOR.name} sobre o mercado de influência, carreira de influenciadoras e parcerias com marcas, no blog da MAK CONNECT.`,
  description: `Todas as matérias de ${AUTHOR.name} no blog da MAK CONNECT sobre marketing de influência.`,
  posts, cats, activeCat: '__autora', crumbs: [homeCrumb, blogCrumb, [AUTHOR.name, `${SITE_URL}/blog/autora/${AUTHOR.slug}/`]],
  extraLD: [{ ...authorLD, '@type': 'Person' }, { '@type': 'ProfilePage', url: `${SITE_URL}/blog/autora/${AUTHOR.slug}/`, mainEntity: { '@id': authorLD['@id'] } }],
}));

// Matérias
for (const p of posts) {
  const url = `${SITE_URL}/blog/${p.slug}/`;
  const related = posts.filter((o) => o !== p && o.catSlug === p.catSlug).slice(0, 3);
  const fill = posts.filter((o) => o !== p && !related.includes(o));
  while (related.length < 3 && fill.length) related.push(fill.shift());
  const crumbs = [homeCrumb, blogCrumb, [p.categoria, `${SITE_URL}/blog/categoria/${p.catSlug}/`], [p.titulo, url]];
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      SITE_JSON,
      authorLD,
      {
        '@type': 'BlogPosting', '@id': `${url}#materia`, mainEntityOfPage: url, url,
        headline: p.titulo, description: p.descricao, image: `${SITE_URL}/blog/capas/${p.slug}.jpg`,
        datePublished: isoDate(p.data), dateModified: isoDate(p.atualizado || p.data),
        author: { '@id': authorLD['@id'] }, publisher: { '@id': `${SITE_URL}/#organizacao` },
        articleSection: p.categoria, inLanguage: 'pt-BR', timeRequired: `PT${p.minutes}M`,
      },
      breadcrumbLD(crumbs),
    ],
  };
  const extra = `  <meta property="article:published_time" content="${isoDate(p.data)}">\n  <meta property="article:author" content="${esc(AUTHOR.name)}">\n  <meta property="article:section" content="${esc(p.categoria)}">\n  <meta name="author" content="${esc(AUTHOR.name)}">\n`;
  write(`blog/${p.slug}/index.html`, head({ title: `${p.titulo} | Blog MAK CONNECT`, description: p.descricao, url, type: 'article', jsonld: ld, extra, image: `${SITE_URL}/blog/capas/${p.slug}.jpg` }) + `
<main id="conteudo" class="wrap blog">
  <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><a href="/blog/categoria/${p.catSlug}/">${esc(p.categoria)}</a></nav>
  <article class="post">
    <header class="post-head">
      <p class="eyebrow"><a href="/blog/categoria/${p.catSlug}/">${esc(p.categoria)}</a></p>
      <h1>${esc(p.titulo)}</h1>
      <p class="post-lead">${esc(p.descricao)}</p>
      <p class="post-meta">Por <a href="/blog/autora/${AUTHOR.slug}/" rel="author">${esc(AUTHOR.name)}</a> · <time datetime="${p.data}">${fmtDate(p.data)}</time> · ${p.minutes} min de leitura</p>
    </header>
    <figure class="post-cover"><img src="/blog/capas/${p.slug}.jpg" alt="" width="1200" height="630" fetchpriority="high" decoding="async"></figure>
    <div class="post-body">
${p.html}
    </div>
    <footer class="post-foot">
      <div class="author-box">
        <p class="eyebrow">Quem escreve</p>
        <p><a href="/blog/autora/${AUTHOR.slug}/" rel="author">${esc(AUTHOR.name)}</a>, pela MAK CONNECT, assessoria e gestão de carreira para influenciadoras digitais em São Paulo.</p>
      </div>
      <div class="cta-box glass">
        <p class="cta-title">Quer uma assessoria que trate a sua carreira, ou a sua campanha, como prioridade?</p>
        <a href="/#contato" class="btn btn-solid">Fale com a MAK CONNECT</a>
      </div>
    </footer>
  </article>
  <section class="related" aria-labelledby="rel-titulo">
    <h2 id="rel-titulo">Continue <em>lendo</em></h2>
    <div class="post-grid">${related.map((p) => card(p)).join('')}
    </div>
  </section>
</main>` + footer);
}

// Últimas matérias na página inicial
const homeFile = path.join(OUT, 'index.html');
const recent = posts.length
  ? `<div class="post-grid">${posts.slice(0, 3).map((p) => card(p)).join('')}\n    </div>`
  : '<p class="muted">Em breve, as primeiras matérias.</p>';
fs.writeFileSync(homeFile, fs.readFileSync(homeFile, 'utf8').replace('<!-- BLOG_RECENTES -->', recent));

// RSS
const rssItems = posts.slice(0, 50).map((p) => `
    <item>
      <title>${esc(p.titulo)}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}/</guid>
      <pubDate>${new Date(isoDate(p.data)).toUTCString()}</pubDate>
      <dc:creator>${esc(AUTHOR.name)}</dc:creator>
      <category>${esc(p.categoria)}</category>
      <description>${esc(p.descricao)}</description>
    </item>`).join('');
write('blog/feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog MAK CONNECT</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Mercado de influência, carreira de influenciadoras e parcerias com marcas.</description>
    <language>pt-BR</language>${rssItems}
  </channel>
</rss>
`);

// Sitemap
const lastPost = posts[0]?.data || today;
const urls = [
  [`${SITE_URL}/`, lastPost, '1.0'],
  [`${SITE_URL}/blog/`, lastPost, '0.9'],
  ...posts.map((p) => [`${SITE_URL}/blog/${p.slug}/`, p.atualizado || p.data, '0.8']),
  ...cats.map((c) => [`${SITE_URL}/blog/categoria/${c.slug}/`, posts.find((p) => p.catSlug === c.slug).data, '0.5']),
  [`${SITE_URL}/blog/autora/${AUTHOR.slug}/`, lastPost, '0.5'],
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d, pr]) => `  <url><loc>${u}</loc><lastmod>${d}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`);

// llms.txt: acrescenta a lista de matérias
const llms = path.join(OUT, 'llms.txt');
fs.appendFileSync(llms, `\n## Blog (${posts.length} matérias, por ${AUTHOR.name})\n` + posts.map((p) => `- [${p.titulo}](${SITE_URL}/blog/${p.slug}/): ${p.descricao}`).join('\n') + '\n');

const pending = all.length - posts.length;
console.log(`Blog: ${posts.length} matérias publicadas, ${pending} agendadas (hoje: ${today}${previewAll ? ', PREVIEW_ALL' : ''}).`);
