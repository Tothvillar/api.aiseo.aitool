// ===== 构建脚本：压缩前端静态资源 =====
// 将 HTML/CSS/JS 压缩后输出到 dist/ 目录
// 同时复制后端代码到 dist/（部署用）

const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

console.log('🔨 开始构建...\n');

// === 1. 清理上次构建 ===
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
  console.log('✅ 清理旧构建产物');
}
fs.mkdirSync(DIST, { recursive: true });

// === 2. 复制后端代码（不压缩，Node.js 运行时需要）===
fs.mkdirSync(path.join(DIST, 'server'), { recursive: true });
fs.cpSync(path.join(ROOT, 'server'), path.join(DIST, 'server'), { recursive: true });
console.log('✅ 复制后端代码 (server/)');

// 复制 package.json（部署时 npm install --production 用）
fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(DIST, 'package.json'));
console.log('✅ 复制 package.json');

// === 3. 复制静态资源（不压缩的文件）===
const copyFiles = ['CNAME', 'robots.txt', 'ads.txt', 'sitemap.xml', '.nojekyll'];
copyFiles.forEach(f => {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, f));
  }
});
console.log('✅ 复制静态配置文件');

// 复制 images 目录
if (fs.existsSync(path.join(ROOT, 'images'))) {
  fs.cpSync(path.join(ROOT, 'images'), path.join(DIST, 'images'), { recursive: true });
  console.log('✅ 复制 images/');
}

// 复制 articles 目录
if (fs.existsSync(path.join(ROOT, 'articles'))) {
  fs.cpSync(path.join(ROOT, 'articles'), path.join(DIST, 'articles'), { recursive: true });
  console.log('✅ 复制 articles/');
}

// === 4. 压缩 CSS ===
const cssPath = path.join(ROOT, 'css', 'style.css');
if (fs.existsSync(cssPath)) {
  const cssInput = fs.readFileSync(cssPath, 'utf8');
  const cssOutput = new CleanCSS({ level: 2 }).minify(cssInput);
  fs.mkdirSync(path.join(DIST, 'css'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'css', 'style.css'), cssOutput.styles);
  const cssRatio = ((1 - cssOutput.styles.length / cssInput.length) * 100).toFixed(1);
  console.log(`✅ CSS 压缩: ${cssInput.length} → ${cssOutput.styles.length} bytes (减少 ${cssRatio}%)`);
}

// === 5. 压缩 JS ===
const jsPath = path.join(ROOT, 'js', 'main.js');
if (fs.existsSync(jsPath)) {
  const jsInput = fs.readFileSync(jsPath, 'utf8');
  const jsOutput = UglifyJS.minify(jsInput);
  if (jsOutput.error) {
    console.error('❌ JS 压缩失败:', jsOutput.error);
    process.exit(1);
  }
  fs.mkdirSync(path.join(DIST, 'js'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'js', 'main.js'), jsOutput.code);
  const jsRatio = ((1 - jsOutput.code.length / jsInput.length) * 100).toFixed(1);
  console.log(`✅ JS 压缩: ${jsInput.length} → ${jsOutput.code.length} bytes (减少 ${jsRatio}%)`);
}

// === 6. 压缩 HTML ===
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let totalHtmlBefore = 0, totalHtmlAfter = 0;
htmlFiles.forEach(f => {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  totalHtmlBefore += html.length;
  const minified = minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
  });
  fs.writeFileSync(path.join(DIST, f), minified);
  totalHtmlAfter += minified.length;
});
if (htmlFiles.length > 0) {
  const htmlRatio = ((1 - totalHtmlAfter / totalHtmlBefore) * 100).toFixed(1);
  console.log(`✅ HTML 压缩: ${htmlFiles.length} 个文件, ${totalHtmlBefore} → ${totalHtmlAfter} bytes (减少 ${htmlRatio}%)`);
}

// === 7. 生成构建信息文件 ===
const buildInfo = {
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  files: {
    html: htmlFiles.length,
    css: 1,
    js: 1,
  },
  sizes: {
    htmlBefore: totalHtmlBefore,
    htmlAfter: totalHtmlAfter,
  }
};
fs.writeFileSync(path.join(DIST, 'build-info.json'), JSON.stringify(buildInfo, null, 2));
console.log('✅ 生成构建信息 build-info.json');

console.log(`\n🎉 构建完成！产物目录: ${DIST}`);
console.log(`📊 构建摘要: ${htmlFiles.length} HTML + 1 CSS + 1 JS + server/`);
