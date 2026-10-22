# Capturas del autocontorneador

Se incorporan dos capturas aportadas para la web: la selección de serie/modelo y la vista MPR con contornos. Los originales no se copian al proyecto ni se suben al repositorio.

## Archivos finales

- src/assets/screens/autocontorneador-flujo-anon.png
- src/assets/screens/autocontorneador-mpr-anon.png

## Edición de privacidad

Edición realizada con ImageGen integrado. Se aplicó difuminado fuerte a cinco zonas con datos visibles de identificación: el selector con UID y el bloque de metadatos de la primera captura, y las tres cabeceras de identificación/fecha de la segunda. Se revisaron las versiones editadas antes de utilizarlas. Las capturas se presentan con la indicación de datos visibles difuminados.

La edición está destinada a la presentación visual del software. Los archivos son imágenes de pantalla, no estudios DICOM ni resultados para interpretación clínica.

## Prompt de selección de serie y modelo

Use case: precise-object-edit. Image 1 is the edit target, a real software screenshot (original 2806x1474). Privacy redaction only.
Apply a very strong, irreversible-looking Gaussian blur to ALL text in exactly TWO broad rectangular regions: (A) the entire contents of the long left-hand 'Series disponibles' selection field containing the DICOM series UID, at normalized x=0.050 to 0.499, y=0.329 to 0.384; (B) the entire bottom-left metadata block, including patient, study date, study description, series description, image count, accession and institution, from normalized x=0.045 to 0.40 and y=0.795 down to the bottom edge. Ensure no letters or digits in either redacted region remain readable at full resolution; use heavy opaque charcoal blur patches, no faint or partially legible original characters.
Preserve the screenshot exactly everywhere else: original canvas and aspect ratio, all interface buttons, layout, panel borders, Spanish interface labels, CT thumbnail, anatomy, colors and medical content. Do not redraw the anatomy, retype text, replace names, invent patient data, crop the image, add watermarks, improve UI, or change any functional text. This is a privacy edit of a screenshot, not a redesigned interface. Output one edited screenshot only.

## Prompt de la vista MPR

Use case: precise-object-edit. Image 1 is the edit target, a real MPR medical software screenshot (original 2856x1446). Privacy redaction only.
Obscure completely, with very strong Gaussian blur on opaque charcoal backgrounds, all THREE patient information overlays that contain patient name, identifying number and date: (1) the badge at the upper-right of the large left axial viewport, normalized x=0.500 to 0.655 and y=0.016 to 0.090; (2) the badge at the upper-right of the upper-right sagittal viewport, normalized x=0.835 to 0.995 and y=0.016 to 0.112, including any small burned-in text immediately beneath this badge; (3) the badge at the upper-right of the lower-right coronal viewport, normalized x=0.835 to 0.995 and y=0.510 to 0.600. Cover the FULL rectangles including their rounded edges and all text, leaving no readable names, digits or dates. The redacted patches should look heavily blurred and dark, not replaced with any new text.
Preserve every other pixel of the screenshot as closely as possible: all three medical images, original anatomy, segmentation contours and colors, crosshairs, ROI labels, viewport borders, sidebar controls and coordinate controls, original canvas dimensions and aspect ratio. Do not alter or reconstruct anatomy, change segmentations, crop, add watermarks, add patient data, or redesign. This is a precise privacy edit, not a newly generated medical image. Output one edited screenshot only.
