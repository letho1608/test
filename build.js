/**
 * ============================================================================
 * VÔ HẠN TRÙNG SINH - PRODUCTION BUILD & CODE OBFUSCATION PIPELINE
 * Tác giả: ThoLe
 * Mục đích: Đóng gói, nén, làm rối mã nguồn, chống can thiệp và chống đánh cắp mã.
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const terser = require('terser');
const CleanCSS = require('clean-css');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('================================================================');
console.log('  VO HAN TRUNG SINH - HE THONG DONG GOI & CHONG HACK TOAN DIEN  ');
console.log('================================================================\n');

// 1. Tao thu muc dist
function ensureDirs() {
  if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
  const subdirs = ['css', 'js'];
  for (const dir of subdirs) {
    const p = path.join(DIST_DIR, dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }
}

// 2. Toi uu hoa & nén CSS
function buildCSS() {
  console.log('[1/4] Dang toi uu hoa va nen CSS...');
  const cssSource = fs.readFileSync(path.join(ROOT_DIR, 'css', 'main.css'), 'utf8');
  const minified = new CleanCSS({ level: 2 }).minify(cssSource);
  const outPath = path.join(DIST_DIR, 'css', 'main.min.css');
  fs.writeFileSync(outPath, minified.styles, 'utf8');
  console.log(`      => Goc: ${(cssSource.length / 1024).toFixed(1)} KB -> Nen: ${(minified.styles.length / 1024).toFixed(1)} KB`);
  return minified.styles;
}

// 3. Toi uu hoa du lieu lich su era.js
async function buildEraData() {
  console.log('[2/4] Dang dong goi & bao ve du lieu lich su (era.js)...');
  const eraSource = fs.readFileSync(path.join(ROOT_DIR, 'era.js'), 'utf8');
  const minified = await terser.minify(eraSource, {
    compress: { passes: 2 },
    mangle: false // giu ten bien ERA toan cuc de eraLoad su dung
  });
  const outPath = path.join(DIST_DIR, 'era.js');
  fs.writeFileSync(outPath, minified.code, 'utf8');
  console.log(`      => era.js goc: ${(eraSource.length / 1024).toFixed(1)} KB -> Nen: ${(minified.code.length / 1024).toFixed(1)} KB`);
}

// 4. Dong goi va lam roi (Obfuscate) toan bo ma nguon JS
async function buildScripts() {
  console.log('[3/4] Dang dong goi tat ca cac module logic & du lieu...');

  const scriptFiles = [
    'js/security.js',
    'js/bootstrap.js',
    'js/lang.js',
    'data/i18n.js',
    'data/world.js',
    'data/career.js',
    'js/core.js',
    'js/life.js',
    'js/economy.js',
    'js/family.js',
    'js/edu-career.js',
    'js/decisions.js',
    'js/society.js',
    'js/events.js',
    'js/era.js',
    'js/human.js',
    'js/pixel.js',
    'js/home.js',
    'js/ui.js',
    'js/app.js'
  ];

  let rawBundle = '';
  for (const rel of scriptFiles) {
    const fullPath = path.join(ROOT_DIR, rel);
    const content = fs.readFileSync(fullPath, 'utf8');
    rawBundle += `\n/* MODULE: ${rel} */\n` + content + '\n;\n';
  }

  console.log(`      => Tong dung luong chua nen: ${(rawBundle.length / 1024 / 1024).toFixed(2)} MB`);

  // Buoc 4.1: Toi uu hoa & nen truoc bang Terser
  console.log('      -> Dang chay Terser de tinh gon AST va loai bo code thua...');
  const terserResult = await terser.minify(rawBundle, {
    compress: {
      dead_code: true,
      drop_console: false, // security.js tu xu ly console
      passes: 2
    },
    mangle: false // de obfuscator xu ly sau
  });

  if (terserResult.error) {
    throw new Error('Terser error: ' + terserResult.error);
  }

  // Buoc 4.2: Ap dung javascript-obfuscator voi che do phong thu toi da
  console.log('      -> Dang thuc hien lam roi ma nguon (Obfuscation): Control-Flow, String Encryption, Self-Defense, Anti-Debugger...');
  const t0 = Date.now();

  const obfuscated = JavaScriptObfuscator.obfuscate(terserResult.code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.25,
    numbersToExpressions: true,
    simplify: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.6,
    splitStrings: true,
    splitStringsChunkLength: 12,
    identifierNamesGenerator: 'hexadecimal',
    selfDefending: true, // Tu dong crash neu hacker co format/beautify code
    debugProtection: true, // Tu dong kich hoat debugger halts lien tuc
    debugProtectionInterval: 2500,
    disableConsoleOutput: true,
    target: 'browser'
  });

  const finalCode = obfuscated.getObfuscatedCode();
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`      => Hoan thanh lam roi trong ${elapsed}s! Kich thuoc cuoi: ${(finalCode.length / 1024 / 1024).toFixed(2)} MB`);

  const outBundlePath = path.join(DIST_DIR, 'js', 'app.min.js');
  fs.writeFileSync(outBundlePath, finalCode, 'utf8');
  return finalCode;
}

// 5. Tao index.html cho ban phan phoi (Production HTML)
function buildHTML(minifiedCSS, minifiedJS) {
  console.log('[4/4] Dang tao file index.html san xuat va ban Standalone doc lap...');
  const srcHTML = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

  // Thay the css link va cac script tags bang ban minified bundle duy nhat
  let distHTML = srcHTML;

  // Thay CSS
  distHTML = distHTML.replace(
    /<link rel="stylesheet" href="css\/main\.css">/,
    '<link rel="stylesheet" href="css/main.min.css">'
  );

  // Xoa toan bo script le o phan head va cuoi trang
  distHTML = distHTML.replace(/<script src="js\/security\.js"><\/script>\s*/g, '');
  distHTML = distHTML.replace(/<script src="js\/bootstrap\.js"><\/script>\s*/g, '');

  const appScriptsRegex = /<!--APP-->[\s\S]*?<\/body>/;
  const replacement = '<!--APP SECURE BUNDLE-->\n<script src="js/app.min.js"></script>\n</body>';
  distHTML = distHTML.replace(appScriptsRegex, replacement);

  // Ghi ra dist/index.html
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), distHTML, 'utf8');

  // Copy file 404.html neu co
  if (fs.existsSync(path.join(ROOT_DIR, '404.html'))) {
    fs.copyFileSync(path.join(ROOT_DIR, '404.html'), path.join(DIST_DIR, '404.html'));
  }

  // Tao them file dist/standalone.html (Gop 100% vao 1 file duy nhat cuc ky tien loi)
  let standaloneHTML = srcHTML;
  standaloneHTML = standaloneHTML.replace(/<script src="js\/security\.js"><\/script>\s*/g, '');
  standaloneHTML = standaloneHTML.replace(/<script src="js\/bootstrap\.js"><\/script>\s*/g, '');
  standaloneHTML = standaloneHTML.replace(
    /<link rel="stylesheet" href="css\/main\.css">/,
    `<style>\n${minifiedCSS}\n</style>`
  );
  standaloneHTML = standaloneHTML.replace(
    appScriptsRegex,
    `<!--APP SECURE INLINE-->\n<script>\n${minifiedJS}\n</script>\n</body>`
  );
  fs.writeFileSync(path.join(DIST_DIR, 'standalone.html'), standaloneHTML, 'utf8');

  console.log('      => Da tao dist/index.html (Modular Production)');
  console.log('      => Da tao dist/standalone.html (Single-file All-in-One)');
}

async function run() {
  const tTotal = Date.now();
  try {
    ensureDirs();
    const css = buildCSS();
    await buildEraData();
    const js = await buildScripts();
    buildHTML(css, js);

    console.log('\n================================================================');
    console.log(`  BUILD THANH CONG! (Tong thoi gian: ${((Date.now() - tTotal) / 1000).toFixed(1)}s)`);
    console.log('  Toan bo ban phan phoi da duoc ma hoa nam trong thu muc: /dist');
    console.log('================================================================\n');
  } catch (err) {
    console.error('\n[!] LOI KHI BUILD:', err);
    process.exit(1);
  }
}

run();
