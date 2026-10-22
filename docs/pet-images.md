# Capturas de IA PET y preinformes

Capturas aportadas por el usuario. Edición de privacidad mediante ImageGen integrado, sin CLI.

## Archivos finales

| Archivo | Dimensiones | Contenido |
| --- | --- | --- |
| `src/assets/screens/pet-fusion-anon.png` | 1528 × 1029 | Fusión PET/CT y regiones de interés; cabecera del paciente difuminada. |
| `src/assets/screens/pet-ct-anon.png` | 1495 × 1052 | Revisión anatómica en CT con regiones señaladas; cabecera del paciente difuminada. |
| `src/assets/screens/pet-recortes-lesiones.png` | 2202 × 1212 | Recortes por lesión y mediciones; copia sin edición. |

Las dos versiones editadas se revisaron visualmente a resolución de salida por un segundo agente: la cabecera quedó ilegible y no se observaron otros identificadores legibles. Los originales del visor no se incorporan al repositorio. La captura de recortes no muestra identificadores personales directos en la revisión visual. Esta documentación describe los datos visibles; no certifica una anonimización de datos clínicos originales.

## Prompt común de edición

Use case: precise-object-edit.
Asset type: privacy-edited screenshot for the Neuratale IA PET product page.
Input image: edit target, an actual medical viewer screenshot provided by the user.
Primary request: change ONLY the patient-identity badge near the upper-right corner. Cover all text inside that badge with a dark opaque patch and strong Gaussian blur so no name, patient identifier or study date remains readable. Do not substitute fake names, numbers, dates or characters.
Target rectangle in normalized image coordinates: x=0.785 to 0.975, y=0.052 to 0.117. Include the entire badge and any text touching its edges. If any other patient-identifying text appears elsewhere, obscure that too.
Constraints: preserve the screenshot's proportions and full composition. Preserve all medical anatomy, lesions, colored segmentation overlays, viewport boundaries, image colors, toolbar, rulers, thumbnails, functional labels and bottom controls. Keep the functional 'Medir para informe' label below the badge readable. No crop, redesign, watermark, extra text or new medical content. Output a single edited screenshot.

## Instrucción adicional para la fusión

This target is the colored PET/CT FUSION screenshot. Keep the PET color map and the visible contour overlays exactly as in the source.

## Instrucción adicional para CT

This target is the grayscale CT screenshot with red lesion contours. Preserve the grayscale CT and the red overlays exactly as in the source.
