# Preparación para Cloudflare Pages

Revisión del 22 de octubre de 2026, a partir de la devolución aceptada por el usuario. El sitio conserva el generador Node, el contenido JSON y la ejecución estática en el navegador.

## Cambios aplicados

- Originales versionados en `src/assets/`; `dist/` pasa a ser salida generada, ignorada por Git. No se incorporan las capturas clínicas anteriores a su difuminado.
- Sharp, fijado en el lockfile como herramienta de compilación, genera WebP, variantes de 640/980/1536 px según resolución, logos de hasta 480 px, iconos y recorte social de 1200 × 630. No hay dependencias de ejecución remotas ni backend.
- Manrope en WOFF2 latino, con pesos variables y licencia conservada. CSS, JavaScript, imágenes y fuente tienen hash de contenido para la caché.
- Imágenes con `srcset`/`sizes`; la ampliación de galería abre el derivado de mayor tamaño y no la miniatura seleccionada por el navegador.
- Acceso HTTPS a HCOP en inicio, catálogo y ficha; indicador en el menú. Las otras soluciones mantienen sus enlaces informativos mientras sus accesos no estén confirmados. Estados visibles sin convertir investigación en producto disponible.
- Canonical, Open Graph absoluto, JSON-LD, robots, sitemap y cabeceras de Cloudflare. El sitemap tiene 21 rutas: la página 404 completa las 22 páginas HTML y queda excluida de indexación.
- Contacto centralizado en `src/site-config.json`. Se mantiene el correo de ejemplo por indicación expresa del usuario. Al configurar un correo real se habilitan el enlace de contacto y el botón que prepara `mailto:` con asunto y cuerpo; nunca se envía automáticamente. Copia y descarga conservadas.
- Lanzador local actualizado para instalar las herramientas si faltan y reconstruir antes de servir. La guía de Pages está en `docs/cloudflare-pages.md`.

## Mediciones y comprobaciones

- Salida completa: **3,93 MB** (menos de 4.000.000 bytes), incluidos HTML y todos los tamaños de imágenes.
- 84 imágenes optimizadas; ninguna supera 300.000 bytes.
- WOFF2: 43.140 bytes.
- Recursos iniciales por defecto del inicio: **310 KB**, estimación sin compresión HTTP; la selección adaptable y la red real dependen del dispositivo.
- Dos compilaciones consecutivas: 115 archivos con nombres y contenidos idénticos.
- Copia limpia sin `dist/` ni `node_modules`: `npm ci`, build y verificador correctos; 3.930.350 bytes y los mismos 115 archivos, idénticos byte a byte.
- Verificador: 22 páginas, 169 rutas/recursos, 14 proyectos y 21 URLs indexables.
- Contacto: pruebas aisladas del correo preparado, con acentos y caracteres especiales; el destino de ejemplo no habilita envíos. Prueba de preparación local en el navegador con datos ficticios.
- Navegador: acceso de inicio, ficha de HCOP a 390 px, selección de variante WebP de 640 px, galería ampliada y cierre del menú al pasar de 1000 a 1300 px. Sin desborde horizontal observado en esas vistas.

## Pendientes que necesitan datos o configuración externa

La publicación en Cloudflare y los cambios de dominio no se realizan en esta entrega. Quedan pendientes el correo real, los accesos de otras aplicaciones, los datos institucionales, las fotos propias aprobadas y la decisión sobre analítica. No se inventa ninguno de esos datos ni se modifica el servicio de HCOP.
