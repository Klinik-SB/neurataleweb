# Neuratale

Web institucional estática con 9 soluciones, 5 líneas de investigación y 22 páginas. El destino de publicación es **Cloudflare Pages**, con `https://neuratale.com.ar` como URL pública prevista. Este repositorio no publica automáticamente hasta que se conecte un proyecto de Pages.

HCOP mantiene su aplicación en **https://hco.neuratale.com.ar**. La landing enlaza a ese producto; no mueve el sistema ni comparte su servidor.

## Preparar y ver localmente

Se necesita Node.js 20.9 o superior y npm. En una copia nueva:

```powershell
git clone https://github.com/Marcolyto/neurataleweb.git
cd neurataleweb
npm ci
npm run build
npm run check
npm start
```

Abrí http://127.0.0.1:5188. `npm start` sirve únicamente la vista previa local; se detiene con Ctrl+C. No es el servidor de producción.

En Windows, **iniciar-neuratale.cmd** instala las herramientas de compilación si faltan, genera `dist/`, inicia la vista previa en segundo plano y abre el navegador. **detener-neuratale.cmd** detiene esa vista previa. El instalador de npm necesita conexión en el primer uso.

## Publicar en Cloudflare Pages

La configuración preparada es:

| Campo | Valor |
| --- | --- |
| Repositorio | `Marcolyto/neurataleweb` |
| Rama de producción | `main` |
| Framework preset | `None` |
| Build command | `npm run build && npm run check` |
| Build output directory | `dist` |
| Variable de entorno | `NODE_VERSION=20` |

Pages recibe únicamente los archivos de `dist/`. No hay backend, Pages Functions ni Workers. `server.mjs`, los lanzadores y los scripts de desarrollo se conservan en el repositorio pero no viajan al sitio generado. [Guía de configuración y pendientes](docs/cloudflare-pages.md).

## Contenido y edición

- `src/content.json`: productos, líneas de investigación y enlaces opcionales de acceso a aplicaciones, demos o documentación.
- `src/site-config.json`: URL pública y correo de contacto.
- `src/styles.css`: diseño, tipografía y adaptación a pantallas.
- `src/site.js`: menús, filtros, pestañas, galería y preparación de consultas.
- `src/assets/`: originales de marca, capturas, fotografías, arte y fuente tipográfica; son las entradas versionadas del build.
- `scripts/images.mjs`: genera WebP, tamaños adaptables, logos, iconos e imagen social usando Sharp sólo durante la compilación.
- `scripts/build.mjs`: genera HTML, recursos con hash, metadatos, sitemap, robots y cabeceras estáticas.
- `scripts/check.mjs`: comprueba las 22 páginas, enlaces y recursos, proyectos, SEO, configuración estática y presupuestos de peso.
- `dist/`: salida generada e ignorada por Git; se reconstruye localmente y en Cloudflare Pages.

Después de editar ejecutá `npm run build && npm run check`. Los recursos usan nombres derivados de su contenido para renovar la caché cuando cambian. No se versionan los derivados del build. `package-lock.json` fija las dependencias de compilación; la web publicada no descarga librerías ni fuentes desde terceros.

## Acceso a las soluciones

HCOP cuenta con acceso real en el inicio, el catálogo, su página y el menú. Las otras herramientas conservan su presentación y consulta hasta contar con una URL confirmada. Para habilitar un acceso en `src/content.json`:

```json
"access": {
  "url": "https://hco.neuratale.com.ar",
  "label": "Ingresar a HCOP",
  "kind": "app"
}
```

`kind` admite `app`, `demo` o `docs`; las URL deben ser absolutas y HTTPS. El texto de estado distingue el tipo y alcance de cada proyecto; tener una página informativa no implica acceso público a su aplicación.

## Contacto pendiente

Por indicación del usuario se conserva **`contacto@neuratale.example`**, una dirección de ejemplo reservada, en `src/site-config.json`. El formulario prepara el mensaje en el navegador y permite copiarlo o descargarlo. No envía consultas ni habilita correo hacia esa dirección de ejemplo.

Cuando se confirme el correo real, reemplazalo en esa configuración y reconstruí el sitio. El botón de correo preparado abrirá la aplicación de correo de la persona visitante; no es un envío automático ni requiere backend. La copia y descarga siguen disponibles como alternativa.

## Imágenes y alcance

Los originales y su procedencia se documentan en `docs/`; el build sólo publica derivados optimizados. Las capturas con datos visibles difuminados mantienen esa edición: los originales con identificación no se incorporan. Manrope se sirve como WOFF2 con subset latino y conserva su licencia SIL OFL.

Las fotos de archivo y recursos conceptuales no representan instalaciones, clientes ni integrantes reales de Neuratale. RadioBioCalc tiene alcance educativo y las líneas de I+D conservan sus límites de investigación. [Créditos fotográficos](docs/photo-credits.md) y [verificación](docs/verification.md).

El repositorio está en https://github.com/Marcolyto/neurataleweb. La configuración de Cloudflare y del dominio se realiza por separado; un push a GitHub por sí solo no confirma publicación pública.
