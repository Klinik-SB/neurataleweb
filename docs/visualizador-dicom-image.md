# Captura del Visualizador DICOM

Archivo final: dist/assets/screens/visualizador-dicom-anon.png.

Captura aportada para la web, editada con ImageGen integrado para difuminar datos visibles de identificación. Se ocultaron las dos cabeceras de paciente/fecha expuestas, el encabezado y los metadatos del estudio del lateral, el texto de conexión PACS y las pequeñas anotaciones incrustadas que podían identificar el estudio.

El original permanece fuera del proyecto y del repositorio. Se revisa la imagen editada antes de incorporarla a la portada de producto, el catálogo, la pestaña del inicio y la galería ampliable.

## Prompt de edición

Use case: precise-object-edit. The reference is a REAL screenshot of the Neuratale DICOM viewer, original 2868x1532. Perform PRIVACY BLUR ONLY, keeping the original layout, medical images, anatomy, toolbar, all three viewports, study thumbnails and sidebar controls unchanged.
Make ALL sensitive text completely unreadable with very strong Gaussian blur backed by opaque dark patches. Do not substitute fake names or fake numbers. Blur these full broad rectangles, using normalized coordinates:
1. Upper-right patient badge of the left axial viewport: x=0.177 to 0.330, y=0.075 to 0.140. Hide the complete patient name, identifier and date.
2. Upper-right patient badge of the center sagittal viewport: x=0.508 to 0.660, y=0.075 to 0.140. Hide the complete repeated identity and date.
3. The PACS connection/error text at the top of the right sidebar, including any private IP address, port and hostname: x=0.750 to 0.987, y=0.107 to 0.171. Keep the 'Mostrar datos positivos' button below readable.
4. The study/patient card header in the right sidebar containing date, name and patient number in two lines: x=0.751 to 0.977, y=0.274 to 0.327.
5. The study description, accession number and UID lines farther down in the same right sidebar card: x=0.752 to 0.977, y=0.406 to 0.454.
6. Any small burned-in identifying text to the right of the sagittal head image: x=0.589 to 0.654, y=0.316 to 0.348.
7. The small horizontal burned-in annotation in the SCOUT preview thumbnail in the sidebar: x=0.775 to 0.835, y=0.616 to 0.645.
If any patient-identifying name, number, date, accession/UID or private server address remains elsewhere in the screenshot, blur it as well. Keep functional UI text, image counts, series labels, coordinate readouts, anatomical images and all other content crisp. Preserve canvas proportions, no crop, no redesign, no watermark, no new medical content. Produce one privacy-edited screenshot only.
