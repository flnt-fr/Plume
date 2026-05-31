Update the README screenshots in `docs/` to reflect the current state of the site.

Steps:

1. Run `npm run build` to produce a fresh production build.

2. Start the preview server in the background: `npm run preview &` — wait ~2 s for it to be ready on port 4322.

3. Run this Node script to capture all screenshots:

```sh
node --input-type=module << 'EOF'
import { chromium } from 'playwright';
const browser = await chromium.launch();

// Desktop — light + dark for home; light only for the other pages
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

for (const scheme of ['light', 'dark']) {
  await page.emulateMedia({ colorScheme: scheme });
  await page.goto('http://localhost:4322/');
  await page.screenshot({ path: `docs/home-${scheme}.png`, fullPage: true });
}

for (const [url, name] of [
  ['/watch', 'watch'],
  ['/experiences', 'experiences'],
  ['/projects', 'projects'],
  ['/about', 'about'],
]) {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('http://localhost:4322' + url);
  await page.screenshot({ path: `docs/${name}.png`, fullPage: true });
}

// Mobile — light + dark for home
const mobile = await browser.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
for (const scheme of ['light', 'dark']) {
  await mobile.emulateMedia({ colorScheme: scheme });
  await mobile.goto('http://localhost:4322/');
  await mobile.screenshot({ path: `docs/home-mobile-${scheme}.png`, fullPage: true });
}

await browser.close();
console.log('Screenshots written to docs/');
EOF
```

4. Kill the preview server: `kill %1` (or `pkill -f "astro preview"`).

5. Report which files were updated (compare file modification times or sizes if possible).

Do not commit the screenshots — just update the files on disk and report what changed.