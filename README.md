# Angélica Mendes — Manicure e Pedicure

Site estático (HTML, CSS e JavaScript puro). Não precisa de instalação nem de build.

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos, serviços e preços | `index.html` (e o JSON-LD no `<head>`) |
| Cores e fontes | `css/style.css` → bloco `:root` |
| Avaliações reais | `js/script.js` → lista `AVALIACOES` |
| Instagram / Facebook / WhatsApp | `index.html` (seção Contato e rodapé) |
| Domínio (angelicanails.online) | `index.html`, `robots.txt`, `sitemap.xml` |

## Imagens

- `assets/logo.png` — logo redonda (320 px, gerada a partir da arte original)
- `assets/og-image.jpg` — imagem de compartilhamento (1200 × 630)
- `assets/trabalhos/trabalho-01.jpg` — foto do topo do site
- `assets/trabalhos/trabalho-02.jpg` … `trabalho-09.jpg` — galeria (verticais 4:5, ~960 × 1200 px, até ~200 KB cada)

Fotos ausentes não quebram o layout: são ocultadas automaticamente.

## Rodar localmente

Abra o `index.html` no navegador, ou rode um servidor simples na pasta:

    python3 -m http.server 8000

e acesse http://localhost:8000
