import * as esbuild from 'esbuild';
import { copyFile, mkdir, cp } from 'node:fs/promises';

const supportedPlatforms = ['chrome', 'edge', 'firefox']

const isWatchMode = process.argv.includes('--watch');
let targetPlatform = process.argv[2];
if (targetPlatform === undefined) {
  console.warn('Target platform not defined. Using "chrome"')
  targetPlatform = 'chrome'
}


// --- Main Build Function ---
async function build(targetPlatform) {
  if (!supportedPlatforms.includes(targetPlatform)) {
    throw Error(`Invalid target platform ${targetPlatform}\n${supportedPlatforms} are supported`)
  }
  console.log(`Building for ${targetPlatform}`)

  const entryPoints = [
    'src/service-worker/background.ts',
    'src/content-scripts/content.ts',
    'src/popup/popup.ts',
    // The SDK content script loads the page script from injectable_script.js
    // at the root of the extension.
    { in: 'src/web-accessible-resources/script.ts', out: 'injectable_script' },
  ];

  const outputDir = `dist/${targetPlatform}`
  const context = await esbuild.context({
    entryPoints,
    bundle: true,
    minify: !isWatchMode,
    sourcemap: isWatchMode ? 'inline' : false,
    outdir: outputDir,
    logLevel: 'info',
  });

  // --- Copy Static Assets ---
  await mkdir(`${outputDir}/popup`, { recursive: true });
  await Promise.all([
    cp('src/assets', `${outputDir}/assets`, { recursive: true }),
    copyFile(`src/${targetPlatform}/manifest.json`, `${outputDir}/manifest.json`),
    copyFile('src/popup/popup.html',`${outputDir}/popup/popup.html`),
  ]);
  console.log('Static files copied.');

  if (isWatchMode) {
    console.log('Watching for changes...');
    await context.watch();
  } else {
    console.log('Building for production...');
    await context.rebuild();
    await context.dispose();
    console.log('Build complete.');
  }
}

build(targetPlatform).catch((e) => {
  console.error(e);
  process.exit(1);
});
