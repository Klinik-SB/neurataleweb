# Cloudflare Pages: configuración preparada

Fecha: 22 de octubre de 2026. Este documento describe la configuración prevista para publicar la web estática. No confirma que se haya creado un proyecto, conectado un dominio o realizado cambios de DNS.

## Proyecto y compilación

Conectar el repositorio `Marcolyto/neurataleweb` a un proyecto de **Cloudflare Pages**, con:

| Campo | Valor |
| --- | --- |
| Rama de producción | `main` |
| Framework preset | `None` |
| Root directory | raíz del repositorio |
| Build command | `npm run build && npm run check` |
| Build output directory | `dist` |
| Variable de entorno | `NODE_VERSION=20` |

Cloudflare admite HTML estático y permite fijar Node mediante `NODE_VERSION`. Referencias oficiales: [HTML estático en Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) y [entorno de compilación](https://developers.cloudflare.com/pages/configuration/build-image/).

Las dependencias de npm, fijadas en `package-lock.json`, se utilizan durante el build. Sharp genera las imágenes optimizadas; no forma parte de la ejecución del sitio en el navegador. La fuente WOFF2 de entrada está versionada: no se necesita Python, fontTools ni una instalación del conversor de fuentes en Cloudflare.

La salida contiene exclusivamente HTML, CSS, JavaScript, imágenes, fuente, licencia y archivos de configuración estática. No agregar carpeta `functions/`, Pages Functions, Workers ni servidor Node de producción. `npm start` y los lanzadores `.cmd`/PowerShell son sólo para la vista previa local.

## Dominio previsto y HCOP

La URL pública configurada en las páginas es **https://neuratale.com.ar**. Una vez comprobado el despliegue de Pages, asociar el apex y `www` desde la configuración de dominios de Pages. La preferencia `www` → apex puede resolverse con las reglas del proveedor; no se genera `_redirects` para adelantar esa decisión.

**https://hco.neuratale.com.ar permanece como aplicación de HCOP**. El nuevo acceso de la landing abre ese subdominio. No modificar sus DNS, despliegue ni configuración por publicar la landing. Esta entrega no cambia DNS ni activa un proyecto externo.

## Archivos generados y caché

- `dist/` está ignorado por Git; el build parte de las fuentes y de los originales de `src/assets/`.
- CSS, JavaScript, imágenes y fuente usan nombres con hash del contenido; los cambios generan nuevas URL.
- `_headers` declara caché larga para `/assets/*` y cabeceras de seguridad para las páginas. Al generar recursos nuevos se actualizan sus referencias.
- `sitemap.xml` contiene **21 páginas indexables**. Las 22 páginas HTML incluyen `404.html`, que lleva `noindex` y queda fuera del sitemap.
- `robots.txt` declara el sitemap público. Las páginas incluyen canonical, `og:url`, `og:image` absoluta y datos estructurados.
- Favicons y la imagen social se generan a partir de la identidad y los recursos existentes.

Los valores de las barras de voz se redondean durante el build para evitar pequeñas diferencias de punto flotante entre máquinas. Las dependencias de compilación están fijadas para conservar la misma herramienta de optimización.

## Presupuestos y comprobaciones

`npm run check` debe pasar antes de publicar. Comprueba:

- 22 páginas y 14 proyectos presentes en catálogo y menú; recursos, anclas e imágenes con texto alternativo.
- Variantes `srcset`/`sizes`, fuente WOFF2, CSS y JavaScript con hash.
- Enlaces `access` absolutos HTTPS, con texto y tipo `app`, `demo` o `docs`.
- Canonical, Open Graph, JSON-LD, sitemap, robots y `_headers`.
- Salida total menor a **4.000.000 bytes**, cada imagen de hasta **300.000 bytes** y recursos iniciales de la home menores a **600.000 bytes**, antes de compresión HTTP.

El cálculo de primera carga suma el HTML, los recursos enlazados y los `src` por defecto de imágenes que no son diferidas; no es una medición de red real y la selección de `srcset` varía con la pantalla y la densidad del dispositivo. La compresión HTTP y la caché del proveedor se verifican después de publicar.

## Pendientes para habilitar la versión pública

- Crear/conectar el proyecto de Pages y comprobar su primera compilación antes de asociar el dominio.
- Confirmar el correo institucional real. Mientras tanto se conserva el ejemplo reservado solicitado por el usuario; no se envía correo hacia él.
- Confirmar los accesos de otras soluciones. Hoy sólo se configura la URL productiva conocida de HCOP.
- Definir razón social, domicilio y CUIT si se van a incluir. No inventar datos institucionales.
- Decidir qué fotografías de archivo se sustituyen por material propio. Las dos imágenes descritas en `docs/photo-credits.md` se mantienen como ilustraciones, con sus créditos.
- Decidir si se activa Cloudflare Web Analytics. Esta entrega no lo activa y mantiene la información de privacidad sin analítica.
- Después de publicar y verificar el dominio, registrar la propiedad en Google Search Console y enviar `https://neuratale.com.ar/sitemap.xml`.

## Vista previa local

```powershell
npm ci
npm run build
npm run check
npm start
```

El sitio abre en http://127.0.0.1:5188. En Windows, `iniciar-neuratale.cmd` instala herramientas si faltan y reconstruye antes de iniciar. Conservar `detener-neuratale.cmd` para cerrar la vista previa. Ninguno de estos comandos publica ni modifica Cloudflare.
