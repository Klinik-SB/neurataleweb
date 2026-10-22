# Neuratale

Sitio institucional claro y adaptable, con 9 soluciones, 5 líneas de investigación y páginas individuales. Se creó en esta carpeta independiente; no modifica HCOP ni los demás proyectos.

## Abrir

Para descargar una copia nueva:

```powershell
git clone https://github.com/Marcolyto/neurataleweb.git
cd neurataleweb
npm start
```

Con Node.js 20 o superior instalado, abrí **iniciar-neuratale.cmd**. Se inicia en segundo plano y abre http://127.0.0.1:5188. Para detenerlo usá **detener-neuratale.cmd**.

También podés ejecutar `npm start` desde esta carpeta. No necesita instalar dependencias. En ese caso se detiene con Ctrl+C.

## Contenido y edición

- `src/content.json`: productos y líneas de investigación.
- `src/styles.css`: diseño y adaptación a pantallas.
- `src/site.js`: menús, filtros, pestañas, galería y preparación de consultas.
- `scripts/build.mjs`: genera las páginas HTML.
- `dist/`: sitio completo, listo para servir con alojamiento estático.

Después de editar las fuentes ejecutá `npm run build`. Para comprobar las rutas, recursos, anclas y estructura básica ejecutá `npm run check`.

## Contenidos incluidos

HCOP, Visualizador DICOM, Autocontorneador y segmentador, UroNeuratale, IA PET y preinformes, Volumetría, RadioBioCalc, Buscador de protocolos para investigación y OncoAI. Investigación: GineIA, Perturbaciones radiobiológicas, GENESIS, EduMeta-IA y CogniBiometría-IA.

Los 14 proyectos están accesibles desde el catálogo y el menú. La búsqueda incluye las líneas de investigación, con un filtro propio de I+D y su identificación diferenciada.

El sitio diferencia soluciones e investigación. RadioBioCalc es educativo. GineIA se describe con su alcance institucional e investigacional. Las fotos de archivo y los recursos conceptuales no representan instalaciones, clientes ni integrantes reales de Neuratale.

## Contacto

Por indicación del usuario se usa `contacto@neuratale.example`, una dirección de ejemplo reservada. El formulario prepara el mensaje en el navegador y permite copiarlo o descargarlo; no lo envía. Antes de habilitar consultas reales se debe reemplazar el canal y conectar un servicio de recepción.

## Imágenes y procedencia

Los activos están incluidos en `dist/assets` para funcionar sin servicios externos. Los originales de marca, capturas, fotos, imágenes generadas, prompts y fuentes de los contenidos se documentan en `docs/`. La tipografía Manrope incluye su licencia SIL OFL.

El código está disponible en https://github.com/Marcolyto/neurataleweb. La web se ejecuta localmente; no se configuró alojamiento público ni un dominio.
