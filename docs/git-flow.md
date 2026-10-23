# Flujo de ramas y despliegue

Fecha: 23 de octubre de 2026.

## Repositorios

| Remoto | URL | Rol |
| --- | --- | --- |
| `origin` | `Klinik-SB/neurataleweb` | Repo de Klinik. Desde acá se despliega. |
| `upstream` | `Marcolyto/neurataleweb` | Repo de Marcos. Se traen sus cambios con `git fetch upstream` y se integran en `develop`. |

## Ramas

| Rama | Uso | Despliegue en Cloudflare Pages |
| --- | --- | --- |
| `main` | Producción. Solo recibe merges desde `develop`. | Producción: `https://neurataleweb.pages.dev` y, cuando se asocie, `https://neuratale.com.ar`. |
| `develop` | Integración. Acá se prueba todo antes de pasar a producción. | Preview: `https://develop.neurataleweb.pages.dev`. |
| `feature/*` | Cambios puntuales. Nacen de `develop` y vuelven a `develop` por PR. | Sin despliegue automático. |

Un único proyecto de Pages llamado `neurataleweb`. Cloudflare trata `main` como rama de producción y cualquier otra rama como preview con su propia URL. No hacen falta dos proyectos.

## Ciclo habitual

1. `git checkout develop && git pull`
2. Trabajar en `develop` o en una `feature/*`, y verificar local con `npm run verify` y `npm start`.
3. Publicar la preview: `npm run deploy:develop`. Revisar en `https://develop.neurataleweb.pages.dev`.
4. Pasar a producción: `git checkout main && git merge --ff-only develop && git push`, y luego `npm run deploy:main`.

## Traer cambios de Marcos

```
git fetch upstream
git checkout develop
git merge upstream/main
git push
```

Si hay conflictos se resuelven en `develop`, nunca directo en `main`.

## Requisitos de despliegue

- `npm ci` instala `sharp` (imágenes) y `wrangler` (despliegue). Ninguno viaja al sitio publicado.
- La primera vez en cada máquina: `npx wrangler login`.
- El proyecto `neurataleweb` ya existe en la cuenta de Cloudflare de Klinik (creado el 23 de octubre de 2026 con `wrangler pages project create neurataleweb --production-branch main --force`; el `--force` solo hace falta en la creación, porque wrangler 4.152+ intenta delegar a Workers).
- `wrangler.jsonc` fija el nombre del proyecto y la carpeta `dist`. No agregar `functions/` ni Workers: el sitio es estático.
- `deploy:*` corre build y check antes de subir; si el check falla, no se despliega.
