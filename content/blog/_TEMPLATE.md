---
# Copy this file to content/blog/<slug>.md, fill it in, then:
#   node scripts/publish-original-post.cjs content/blog/<slug>.md           (dry run)
#   node scripts/publish-original-post.cjs content/blog/<slug>.md --apply   (publish)
#
# slug: the URL → https://myfilmjobs.com/blog/<slug>. Lowercase, hyphens, no accents.
#       Never change it after publishing (it would become a new page).
# summary: the line Google shows under the title. Aim for 120–155 characters.
# lang: es | en      category: careers | industry | business | technology
# public: false keeps it hidden (useful to stage a draft).
# translation: slug of the same article in the other language (optional; set it in both files).
slug: ejemplo-de-slug
translation:
title: Título claro que responde lo que la gente busca
summary: Una o dos frases que dicen exactamente qué va a aprender el lector y por qué le sirve.
lang: es
category: careers
tags: crew, república dominicana
author: Francisco Valdez
publishedAt: 2026-10-23
image:
public: false
---

Párrafo de apertura: responde la pregunta principal en las primeras líneas.

## Primer subtema

Texto en Markdown normal. **Negritas**, *cursivas*, [enlaces](https://myfilmjobs.com/jobs),
listas y tablas funcionan. No uses HTML directo ni `#` (h1): el título ya es el h1.

- Punto uno
- Punto dos

| Departamento | Tarifa diaria (RD$) |
| --- | --- |
| Ejemplo | 0 |

## Cierre

Termina con un siguiente paso concreto, por ejemplo crear tu perfil en el
[directorio de crew](https://myfilmjobs.com/directorio).
