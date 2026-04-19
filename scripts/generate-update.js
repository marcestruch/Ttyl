import fs from 'fs';
import path from 'path';

/**
 * Script de ayuda para generar el archivo update.json de ttyl.
 * Debe ejecutarse después de 'npm run tauri build'.
 */

const CONF_PATH = './src-tauri/tauri.conf.json';
const OUTPUT_DIR = './src-tauri/target/release/bundle/deb'; // Ajustar según plataforma

async function generateUpdateJson() {
  try {
    const config = JSON.parse(fs.readFileSync(CONF_PATH, 'utf-8'));
    const version = config.version;
    const pubDate = new Date().toISOString();

    console.log(`🚀 Generando update.json para la versión v${version}...`);

    // Busca los archivos generados
    // Nota: El updater de Tauri v2 genera un .zip para macOS/Windows y .deb/AppImage para Linux.
    // Para simplificar esta V1 integrada con marcestruch.es, nos enfocamos en Linux.
    
    // Aquí el usuario debería haber configurado las llaves de firma.
    // El build de Tauri genera un archivo .sig junto al paquete.
    
    const releaseData = {
      version: `v${version}`,
      notes: `Lanzamiento de Ttyl v${version}. Consulta los cambios en el sitio oficial.`,
      pub_date: pubDate,
      platforms: {
        "linux-x86_64": {
          "signature": "PEGAR_AQUI_EL_CONTENIDO_DEL_ARCHIVO_.sig",
          "url": `https://marcestruch.es/projects/ttyl/ttyl_${version}_amd64.deb`
        }
      }
    };

    fs.writeFileSync('./update.json', JSON.stringify(releaseData, null, 2));
    
    console.log('\n✅ ¡update.json generado con éxito!');
    console.log('\n--- PRÓXIMOS PASOS ---');
    console.log('1. Firma el archivo .deb generado si no lo has hecho.');
    console.log('2. Copia el contenido del archivo .sig en el campo "signature" de update.json.');
    console.log('3. Sube ttyl_${version}_amd64.deb y update.json a marcestruch.es/projects/ttyl/');
    console.log('----------------------\n');

  } catch (err) {
    console.error('❌ Error generando update.json:', err);
  }
}

generateUpdateJson();
