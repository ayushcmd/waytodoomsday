// compress-posters.js
// Run this from inside your "posters" folder (or point SRC_DIR to it)
//
// Setup:
//   npm install sharp
//
// Run:
//   node compress-posters.js
//
// This resizes images to a max width of 800px (plenty for poster thumbnails)
// and re-compresses as JPEG at 75% quality, replacing files in place.
// Originals are backed up to a "originals_backup" folder first.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC_DIR = __dirname; // change if running from elsewhere
const BACKUP_DIR = path.join(SRC_DIR, "originals_backup");
const MAX_WIDTH = 800;
const JPEG_QUALITY = 75;

async function run() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

  const files = fs.readdirSync(SRC_DIR).filter((f) =>
    /\.(jpe?g|png)$/i.test(f)
  );

  console.log(`Found ${files.length} images to compress...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = path.join(SRC_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    const sizeBefore = fs.statSync(inputPath).size;
    totalBefore += sizeBefore;

    // backup original
    fs.copyFileSync(inputPath, backupPath);

    // compress into a temp file, then overwrite original
    const tempPath = inputPath + ".tmp";
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(tempPath);

    fs.renameSync(tempPath, inputPath);

    const sizeAfter = fs.statSync(inputPath).size;
    totalAfter += sizeAfter;

    console.log(
      `${file}: ${(sizeBefore / 1024).toFixed(0)} KB -> ${(sizeAfter / 1024).toFixed(0)} KB`
    );
  }

  console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)} MB -> ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Originals backed up to: ${BACKUP_DIR}`);
}

run().catch((err) => {
  console.error("Error:", err);
});
