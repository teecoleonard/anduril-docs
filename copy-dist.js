import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'docs/.vitepress/dist');
const docsPath = path.join(__dirname, 'docs');

// Função para copiar recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach(file => {
    if (file === '.vitepress') return; // Pula a pasta .vitepress
    
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied: ${file}`);
    }
  });
}

// Executa a cópia
if (fs.existsSync(distPath)) {
  console.log(`Copying from ${distPath} to ${docsPath}`);
  copyDir(distPath, docsPath);
  console.log('✓ Build files copied to /docs/');
} else {
  console.error(`Error: ${distPath} not found`);
  process.exit(1);
}
