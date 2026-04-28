/**
 * Génère les icônes PWA en SVG (utilisables directement par les navigateurs modernes)
 * Pour la production, convertir en PNG avec un outil comme sharp ou Inkscape.
 *
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'icons');

// Assure que le dossier existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Génère une icône SVG NIO FAR aux dimensions demandées.
 * Le SVG est enregistré sous icon-{size}x{size}.svg.
 * La version PNG doit être générée séparément (Inkscape, sharp, etc.).
 */
function generateSVG(size) {
  const padding = Math.round(size * 0.1);
  const fontSize = Math.round(size * 0.22);
  const subFontSize = Math.round(size * 0.11);
  const centerX = size / 2;
  const logoY = Math.round(size * 0.52);
  const subY = Math.round(size * 0.7);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Fond principal -->
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#3D2B1F"/>

  <!-- Motif décoratif — vague stylisée Sénégal -->
  <circle cx="${centerX}" cy="${Math.round(size * 0.38)}" r="${Math.round(size * 0.22)}" fill="none" stroke="#C4682B" stroke-width="${Math.round(size * 0.04)}"/>
  <circle cx="${centerX}" cy="${Math.round(size * 0.38)}" r="${Math.round(size * 0.13)}" fill="#C4682B" opacity="0.3"/>

  <!-- Étoile centrale (inspirée drapeau Sénégal) -->
  <text x="${centerX}" y="${Math.round(size * 0.43)}" text-anchor="middle" font-size="${Math.round(size * 0.2)}" fill="#C49F4A">★</text>

  <!-- Texte NIO FAR -->
  <text x="${centerX}" y="${logoY}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}" font-weight="bold" fill="#FFFFFF" letter-spacing="1">NIO FAR</text>

  <!-- Sous-titre -->
  <text x="${centerX}" y="${subY}" text-anchor="middle"
        font-family="Georgia, serif"
        font-size="${subFontSize}" fill="#C4682B" letter-spacing="2">TOURISME</text>
</svg>`;
}

SIZES.forEach(size => {
  const svgContent = generateSVG(size);
  const svgPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);

  // Crée aussi un PNG placeholder (fichier vide) pour que le manifest ne génère pas d'erreur 404
  // Les vrais PNG doivent être générés avec un convertisseur SVG→PNG
  const pngPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
  if (!fs.existsSync(pngPath)) {
    // Copie le SVG comme fallback nommé en .png (certains browsers acceptent SVG)
    fs.writeFileSync(pngPath, svgContent);
  }
});

console.log(`✅ ${SIZES.length} icônes générées dans src/icons/`);
console.log('   Pour de vraies icônes PNG, utilisez:');
console.log('   npx sharp-cli --input src/icons/icon-512x512.svg --output src/icons/ resize 192');
