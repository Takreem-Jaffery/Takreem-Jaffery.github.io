// Shrinks the About-page photos so they load fast.
//
//   npm install
//   npm run optimize-images
//
// For every image in src/assets/fun/ this writes a resized WebP copy next to
// the original (max 1200px wide, quality 76 — typically 10-20x smaller than a
// phone photo), then points about.html at the .webp files. Your originals are
// left untouched, so you can undo by restoring about.html.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'src/assets/fun';
const HTML = 'about.html';
const MAX_WIDTH = 1200;
const QUALITY = 76;

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(DIR, file);
  const out = path.join(DIR, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  await sharp(src)
    .rotate() // respect phone EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  const [a, b] = await Promise.all([stat(src), stat(out)]);
  before += a.size;
  after += b.size;
  console.log(`${file}  ${(a.size / 1024).toFixed(0)} KB -> ${(b.size / 1024).toFixed(0)} KB`);
}

let html = await readFile(HTML, 'utf8');
html = html.replace(/(\.\/src\/assets\/fun\/[^"']+?)\.(jpe?g|png)/gi, '$1.webp');
await writeFile(HTML, html);

console.log(
  `\nDone: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB. ` +
    `${HTML} now uses the .webp files.`
);
