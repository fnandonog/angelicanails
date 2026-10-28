# Angélica Mendes — Manicure e Pedicure

Site estático (HTML, CSS e JavaScript puro). Não precisa de instalação nem de build.

- **Domínio:** https://angelicanails.online
- **Hospedagem:** Hostinger (hPanel)

## Páginas

| Arquivo | Endereço |
|---|---|
| `index.html` | angelicanails.online |
| `esmaltacao-em-gel.html` | angelicanails.online/esmaltacao-em-gel.html |

## Onde editar

| O quê | Onde |
|---|---|
| Textos, serviços e preços | `index.html` (e o JSON-LD no `<head>`) |
| Conteúdo da esmaltação em gel | `esmaltacao-em-gel.html` |
| Cores e fontes | `css/style.css` → bloco `:root` |
| Avaliações e nota do Google | `index.html` → seção `#avaliacoes` |
| Links de contato e redes | `index.html` e `esmaltacao-em-gel.html` |

Ao criar uma página nova, acrescente-a também no `sitemap.xml`.

## Imagens

- `assets/logo.png` — logo redonda
- `assets/og-image.jpg` — imagem de compartilhamento (1200 × 630)
- `assets/trabalhos/trabalho-01.jpg` … `trabalho-09.jpg` — fotos dos trabalhos
  (verticais 4:5, ~960 × 1200 px, até ~200 KB cada)

A `trabalho-01.jpg` é a foto do topo da home e a `trabalho-05.jpg` é a da página de gel.
Fotos que não existirem são ocultadas automaticamente, sem quebrar o layout.

## Rodar localmente

Abra o `index.html` no navegador, ou rode um servidor simples na pasta:

    python3 -m http.server 8000

e acesse http://localhost:8000

## Publicar (Hostinger)

1. hPanel → **Sites** → `angelicanails.online` → **Gerenciador de arquivos**
2. Abra a pasta `public_html`
3. Envie os arquivos alterados, substituindo os antigos

Para deixar automático (recomendado): hPanel → **Avançado → Git**, conecte um
repositório do GitHub e aponte para `public_html`. Depois disso, cada `git push`
publica o site sozinho.

## Se perder esta pasta

O site no ar serve de cópia de segurança. Para recuperar tudo:

    cd ~/Desktop && mkdir angel && cd angel
    curl -s -o index.html https://angelicanails.online/
    curl -s -o esmaltacao-em-gel.html https://angelicanails.online/esmaltacao-em-gel.html
    mkdir -p css js assets/trabalhos
    for f in css/style.css js/script.js assets/logo.png assets/og-image.jpg \
             assets/apple-touch-icon.png assets/favicon-192.png favicon.ico \
             robots.txt sitemap.xml; do
      curl -s -o "$f" "https://angelicanails.online/$f"
    done
    for i in 01 02 03 04 05 06 07 08 09; do
      curl -s -o "assets/trabalhos/trabalho-$i.jpg" \
        "https://angelicanails.online/assets/trabalhos/trabalho-$i.jpg"
    done

Melhor ainda: mantenha o projeto num repositório Git (esta pasta já é um).
