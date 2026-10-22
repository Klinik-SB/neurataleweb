# Fuentes visuales del sitio

Este directorio conserva los originales del sitio anterior, incluidos los que
ya tenían los datos visibles difuminados. La migración se hizo exclusivamente
desde `dist/assets/`; no se incorporan imágenes clínicas originales externas.
Los archivos de procedencia y los prompts de generación permanecen en `docs/`.

`scripts/images.mjs` transforma estos recursos durante `npm run build`:

- Arte y capturas a WebP de calidad 80, con ancho máximo de 1536 px y variantes
  de 640 y 980 px cuando la imagen original tiene suficiente resolución.
- Fotografías a WebP de calidad 80, ancho máximo de 1260 px y variantes de
  640 y 980 px. Se conserva el encuadre.
- Logos a WebP de calidad 90 y ancho máximo de 480 px, suficiente para los
  240 px mostrados en el pie. La transparencia se conserva.
- Nombre derivado con hash SHA-256 de contenido para cada WebP y WOFF2, de modo
  que las actualizaciones no reutilicen una URL con caché larga.
- Imagen social de 1200 × 630 px: recorte técnico de la escultura neuronal
  existente. No se presenta como captura real.
- Iconos PNG de 32 y 180 px, derivados del favicon SVG existente.

El proceso elimina los metadatos de las imágenes y falla si un derivado supera
300.000 bytes. `sharp` es una dependencia de compilación, fijada con lockfile;
la web publicada no necesita Node, Python ni un servidor de aplicaciones.
La conversión WOFF2 se realizó una sola vez y se documenta en `fonts/README.md`.

La función exportada `prepareAssets({ outDir })` recibe la raíz de salida y
devuelve el mapa de rutas, `srcset`, tamaños, URL de fuente, iconos e imagen
social. No borra archivos: el generador del sitio prepara la salida limpia.
Para probar solo los recursos sin tocar el sitio servido:

```text
node scripts/images.mjs --out-dir .local/assets-check
```

Los derivados pertenecen únicamente a la salida generada; no se versionan.
