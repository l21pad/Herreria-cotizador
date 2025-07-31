const fs = require('fs');
const path = require('path');

// Crear un SVG simple con el icono de calculadora
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="4" fill="#1f2937"/>
  <rect x="4" y="4" width="16" height="16" rx="2" fill="white"/>
  <rect x="6" y="6" width="4" height="2" rx="1" fill="#1f2937"/>
  <rect x="6" y="9" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="9" y="9" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="12" y="9" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="15" y="9" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="6" y="12" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="9" y="12" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="12" y="12" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="15" y="12" width="2" height="5" rx="1" fill="#3b82f6"/>
  <rect x="6" y="15" width="2" height="2" rx="1" fill="#1f2937"/>
  <rect x="9" y="15" width="5" height="2" rx="1" fill="#3b82f6"/>
</svg>`;

// Función para convertir SVG a PNG (simulado - en realidad necesitarías una librería como puppeteer)
const createPNG = (size, filename) => {
  const svg = createIconSVG(size);
  
  // Por simplicidad, guardamos el SVG y luego podemos convertirlo manualmente
  // En producción usarías algo como puppeteer o sharp
  fs.writeFileSync(path.join(__dirname, 'public', 'icons', filename.replace('.png', '.svg')), svg);
  
  console.log(`Created SVG for ${filename}`);
};

// Crear directorio de iconos si no existe
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Crear iconos necesarios
createPNG(152, 'icon-152x152.png');
createPNG(192, 'icon-192x192.png');
createPNG(512, 'icon-512x512.png');

console.log('Icons created successfully!');
