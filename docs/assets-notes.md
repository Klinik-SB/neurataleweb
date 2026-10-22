# Activos de marca y pantallas

## Marca original

Copias sin editar, inspeccionadas visualmente el 21 de octubre de 2026. No se generaron ni alteraron imágenes.

| Archivo del sitio | Fuente | Uso sugerido |
| --- | --- | --- |
| `dist/assets/brand/neuratale-wordmark.png` | `C:\visualizador\assets\logonombre.png` | Marca completa en portada o franja oscura. Conserva fondo azul oscuro opaco. |
| `dist/assets/brand/neuratale-symbol.png` | `C:\visualizador\assets\logofondo.png` | Símbolo en bloque oscuro o sección institucional. Conserva fondo negro opaco; no es un recorte transparente. |

## Capturas

No se copiaron capturas de producto: no se localizaron capturas preexistentes en RadioBioCalc ni en el material de presentación GineIA seleccionado. Las capturas de HCOP en `docs/media/demo-flujo-7-pasos/capturas` se documentan como demostrativas, pero las inspeccionadas contienen nombres e identificadores visibles; se excluyeron para mantener la web libre de esos datos. No se editaron ni recortaron esas imágenes.

Una futura captura de RadioBioCalc puede mostrar parámetros de simulación educativos; una de HCOP debería tomarse en login o en un módulo vacío, sin pacientes. Ningún archivo de los proyectos fuente fue modificado.

## Capturas reales autorizadas posteriormente

Se autorizó tomar capturas nuevas mediante CUA, sin generar ni editar imágenes. Se sirvió temporalmente únicamente `C:\Proyectos\RadiobioCalc\RadioBioCalc` en `http://127.0.0.1:5196`, limitado a loopback. El servidor fue detenido después de obtener las capturas.

| Archivo | Origen y contenido | Revisión |
| --- | --- | --- |
| `dist/assets/screens/radiobiocalc.jpg` | `/#results`: resultados de los dos esquemas de demostración predeterminados de RadioBioCalc. | Captura real, valores educativos; no contiene datos de pacientes. |
| `dist/assets/screens/radiomodelos.jpg` | `/radiomodelos.html`: portada del curso RadioModelos. | Captura real, contenido educativo; no contiene datos de pacientes. |

El navegador CUA entrega capturas JPEG; se conservó ese formato original con extensión `.jpg`. No son imágenes generadas, composiciones ni interfaces reconstruidas. Las aplicaciones fuente permanecieron sin modificaciones.

## Capturas aportadas del autocontorneador

Las versiones `autocontorneador-flujo-anon.png` y `autocontorneador-mpr-anon.png` se incluyen con los datos visibles de identificación difuminados mediante edición de imágenes. Los originales aportados no se incluyen en el proyecto ni en Git. Los prompts y el alcance de edición están documentados en `docs/autocontorneador-images.md`.

## Captura aportada del Visualizador DICOM

`visualizador-dicom-anon.png` muestra las vistas multiplanares, las herramientas y el panel de series. Se difuminaron los datos visibles de identificación y conexión antes de incorporarla al sitio. El original queda fuera del proyecto. Prompt y alcance: `docs/visualizador-dicom-image.md`.

## Capturas aportadas de GineIA

El usuario aportó `gineia3.PNG` y `gineia2.PNG`, incorporadas sin edición como `dist/assets/screens/gineia-explorador-full13.png` (1577 × 773) y `dist/assets/screens/gineia-red-neuronal.png` (1641 × 878). Muestran el explorador Full13 y el esquema de la red neuronal. En la revisión visual independiente no se observaron identificadores personales directos. No se afirma que los valores clínicos mostrados sean ficticios. Las imágenes se presentan como capturas del entorno de investigación; sus cifras no se convierten en afirmaciones de validación clínica. La red neuronal se utiliza también en la presentación y las tarjetas de GineIA.

## Capturas aportadas de PET

Las imágenes `pet1.jpeg` y `pet2.jpeg` se incorporan como `dist/assets/screens/pet-fusion-anon.png` y `dist/assets/screens/pet-ct-anon.png`, con las cabeceras de identificación difuminadas mediante ImageGen integrado. Los originales de estas dos capturas permanecen fuera del proyecto. `pet3.png` se conserva sin edición como `dist/assets/screens/pet-recortes-lesiones.png`, tras una revisión visual sin identificadores personales directos observados. No se atribuye carácter ficticio a las mediciones ni se presentan como métricas de validación. La galería incluye las tres vistas; la fusión PET/CT se usa también como presentación del producto y en el catálogo. Archivos finales y prompts: `docs/pet-images.md`.
