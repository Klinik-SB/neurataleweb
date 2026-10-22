import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'src/assets');
const IMAGE_LIMIT = 300_000;
const DEFAULT_SIZES = '(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) calc(100vw - 80px), 980px';
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function optimizedImage(input, target, width, quality, extra = {}) {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true, ...extra })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
  if (data.length > IMAGE_LIMIT) {
    throw new Error(`${path.basename(target)} pesa ${data.length} bytes; supera el presupuesto de ${IMAGE_LIMIT}.`);
  }
  const parsed = path.parse(target);
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 10);
  const fileName = `${parsed.name}.${hash}${parsed.ext}`;
  await fs.writeFile(path.join(parsed.dir, fileName), data);
  return { ...info, size: data.length, fileName };
}

/**
 * Generate only deployable assets. Originals and privacy-edited screenshots stay
 * in src/assets; no image from outside that directory is included in the build.
 * outDir is the output root (normally dist), rather than its assets subfolder.
 */
export async function prepareAssets({ outDir = path.join(root, 'dist') } = {}) {
  outDir = path.resolve(outDir);
  const images = {};
  let imageBytes = 0;
  let imageFiles = 0;

  for (const group of ['art', 'brand', 'photos', 'screens']) {
    const inputDir = path.join(sourceRoot, group);
    const outputDir = path.join(outDir, 'assets', group);
    await fs.mkdir(outputDir, { recursive: true });
    const names = (await fs.readdir(inputDir)).filter(name => imageExtensions.has(path.extname(name).toLowerCase())).sort();
    for (const name of names) {
      const input = path.join(inputDir, name);
      const metadata = await sharp(input).metadata();
      const baseName = path.parse(name).name;
      const maxWidth = group === 'brand' ? 480 : group === 'photos' ? 1260 : 1536;
      const baseWidth = Math.min(metadata.width, maxWidth);
      const quality = group === 'brand' ? 90 : 80;
      const widths = group === 'brand' ? [baseWidth] : [...new Set([640, 980, baseWidth].filter(width => width <= baseWidth))].sort((a, b) => a - b);
      const variants = [];
      let largest;
      for (const width of widths) {
        const fileName = width === baseWidth ? `${baseName}.webp` : `${baseName}-${width}w.webp`;
        const info = await optimizedImage(input, path.join(outputDir, fileName), width, quality);
        const src = `/assets/${group}/${info.fileName}`;
        variants.push({ src, width: info.width });
        if (width === baseWidth) largest = { src, width: info.width, height: info.height };
        imageBytes += info.size;
        imageFiles++;
      }
      images[`/assets/${group}/${name}`] = {
        ...largest,
        srcset: variants.map(item => `${item.src} ${item.width}w`).join(', '),
        sizes: group === 'brand' ? '240px' : DEFAULT_SIZES,
        zoomSrc: largest.src,
      };
    }
  }

  const fontData = await fs.readFile(path.join(sourceRoot, 'fonts/Manrope-latin.woff2'));
  const fontHash = createHash('sha256').update(fontData).digest('hex').slice(0, 10);
  const fontName = `Manrope-latin.${fontHash}.woff2`;
  const font = `/assets/fonts/${fontName}`;
  await fs.mkdir(path.join(outDir, 'assets/fonts'), { recursive: true });
  await fs.writeFile(path.join(outDir, 'assets/fonts', fontName), fontData);
  await fs.copyFile(path.join(sourceRoot, 'fonts/OFL.txt'), path.join(outDir, 'assets/fonts/OFL.txt'));

  const faviconSource = path.join(sourceRoot, 'favicon.svg');
  await fs.copyFile(faviconSource, path.join(outDir, 'favicon.svg'));
  for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
    const info = await sharp(faviconSource, { density: 216 }).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(outDir, name));
    if (info.size > IMAGE_LIMIT) throw new Error(`${name} supera el presupuesto de imagen.`);
    imageBytes += info.size;
    imageFiles++;
  }

  const ogInfo = await optimizedImage(path.join(sourceRoot, 'art/neural-sculpture.png'), path.join(outDir, 'assets/art/neuratale-og.webp'), 1200, 80, { height: 630, fit: 'cover', position: 'centre' });
  const ogImage = `/assets/art/${ogInfo.fileName}`;
  imageBytes += ogInfo.size;
  imageFiles++;

  return {
    images,
    font,
    icons: { svg: '/favicon.svg', png: '/favicon-32.png', apple: '/apple-touch-icon.png' },
    ogImage,
    imageBytes,
    imageFiles,
    maxImageBytes: IMAGE_LIMIT,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outIndex = process.argv.indexOf('--out-dir');
  const result = await prepareAssets({ outDir: outIndex >= 0 ? process.argv[outIndex + 1] : undefined });
  console.log(`Assets: ${Object.keys(result.images).length} originales, ${result.imageFiles} imágenes optimizadas, ${result.imageBytes.toLocaleString('es-AR')} bytes.`);
}
