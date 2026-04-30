/**
 * Génère les icônes PWA en SVG pour NIO FAR Tourisme.
 * Les SVG sont utilisés directement dans le manifest.webmanifest
 * (supporté par Chrome, Edge, Firefox, Safari iOS 15.4+).
 *
 * Usage automatique via : npm run build  (hook prebuild)
 * Usage manuel           : node scripts/generate-icons.js
 */

const fs   = require('fs');
const path = require('path');

const SIZES      = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'icons');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function generateSVG(size) {
  const radius      = Math.round(size * 0.18);
  const cx          = size / 2;
  const ringR       = Math.round(size * 0.22);
  const ringStroke  = Math.round(size * 0.04);
  const dotR        = Math.round(size * 0.13);
  const starSize    = Math.round(size * 0.2);
  const starY       = Math.round(size * 0.43);
  const textSize    = Math.round(size * 0.22);
  const textY       = Math.round(size * 0.62);
  const subSize     = Math.round(size * 0.1);
  const subY        = Math.round(size * 0.76);
  const ringCY      = Math.round(size * 0.38);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#3D2B1F"/>
  <circle cx="${cx}" cy="${ringCY}" r="${ringR}" fill="none" stroke="#C4682B" stroke-width="${ringStroke}"/>
  <circle cx="${cx}" cy="${ringCY}" r="${dotR}" fill="#C4682B" opacity="0.25"/>
  <text x="${cx}" y="${starY}" text-anchor="middle" dominant-baseline="middle"
        font-size="${starSize}" fill="#C49F4A">★</text>
  <text x="${cx}" y="${textY}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${textSize}" font-weight="bold"
        fill="#FFFFFF" letter-spacing="1">NIO FAR</text>
  <text x="${cx}" y="${subY}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${subSize}"
        fill="#C4682B" letter-spacing="2">TOURISME</text>
</svg>`;
}

let count = 0;
SIZES.forEach(size => {
  const svgContent = generateSVG(size);
  const outPath    = path.join(OUTPUT_DIR, `icon-${size}x${size}.svg`);
  fs.writeFileSync(outPath, svgContent, 'utf8');
  count++;
});

// Supprimer les anciens .png fantômes (SVG sauvegardés avec extension .png)
const pngPhantoms = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
pngPhantoms.forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));

console.log(`✅ ${count} icônes SVG générées dans src/icons/`);
if (pngPhantoms.length) {
  console.log(`   🗑  ${pngPhantoms.length} fichier(s) .png fantôme(s) supprimé(s)`);
}
