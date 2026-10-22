# Dirección visual

Sitio claro, blanco cálido y gris niebla; azul profundo #15333e y turquesa #0d9ca7. Tipografía Manrope alojada localmente. Imágenes conceptuales, fotos de archivo y capturas reales tienen procedencia y rótulos diferenciados.

## Generación de imágenes

Se utilizó la herramienta integrada ImageGen, sin API externa ni CLI. Los originales se conservan en la carpeta de imágenes generadas de Codex; los recursos utilizados están copiados dentro del proyecto.

- Arte de portada: src/assets/art/neural-sculpture.png
- Adaptación para fondo claro del logo original: src/assets/brand/neuratale-light.png

### Prompt de la portada

Use case: stylized-concept. Asset type: premium enterprise medical AI website hero image, wide landscape 3:2.
Create a beautiful sophisticated three-dimensional scientific sculpture of a branching neuron and a loosely spherical neural network, inspired by the branching neuron in Neuratale's identity. Numerous fine turquoise translucent glass fibers connect small pale teal nodes, forming an organic flowing sculptural object floating a few centimeters above a matte very pale ivory surface. Organic irregularity, convincing refraction, subtle navy-blue fiber accents, extremely detailed soft shadow. Composition: entire sculpture visible, centered to right, abundant calm negative space around object, close-up macro product photography, no text. Background seamless pale mist gray-white #f3f8f8, gentle natural studio light, tasteful restrained luxury, clean medical technology art direction. Do not add brains, faces, people, logos, computers, text, watermark, purple gradients or neon on black. This is conceptual artwork, not a diagnostic scan. High-end editorial CGI.

### Prompt de adaptación del logo

Use case: background-extraction and precise-object-edit. Image 1 is the existing original NEURATALE horizontal wordmark, an edit target. Create a clean flat light-background variant of the SAME exact original identity. Preserve the branching neuron symbol geometry at left and the exact NEURATALE lettering and relative layout at right. Remove the dark navy background and ALL luminous halos; output genuinely transparent background with crisp antialiased edges. Change the neuron symbol to solid teal #12aeb8 and the NEURATALE lettering to solid deep navy #12323e. Preserve the original bold NEURA and thin TALE treatment exactly. Do not redesign, add characters, add slogans, add gradients, add glow, or distort. Wide horizontal transparent PNG asset with tight comfortable margins.

## Otras fuentes

- Fotografía conceptual del estudio de investigación, archivo y prompt completo: docs/generated-studio.md
- Fotos: docs/photo-credits.md
- Logos originales y capturas: docs/assets-notes.md
- Contenidos de producto: docs/product-sources.md
