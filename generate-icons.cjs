const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createSolidPNG(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 2; // Truecolor (RGB)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdr = createChunk('IHDR', ihdrData);

  // Scanlines with cyan/deep dark glassmorphism gradient (#070b19 with vibrant cyan atom glow)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // No filter

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Glowing cyan atom circle
        const factor = 1 - dist / radius;
        rawData[pxOffset] = Math.min(255, Math.floor(10 + factor * 40));     // R
        rawData[pxOffset + 1] = Math.min(255, Math.floor(25 + factor * 190)); // G
        rawData[pxOffset + 2] = Math.min(255, Math.floor(50 + factor * 210)); // B
      } else {
        // Deep glass dark background #070b19
        rawData[pxOffset] = 7;
        rawData[pxOffset + 1] = 11;
        rawData[pxOffset + 2] = 25;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressedData);
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crc ^ buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

[192, 512].forEach((size) => {
  const png = createSolidPNG(size, size);
  fs.mkdirSync('./icons', { recursive: true });
  fs.mkdirSync('./public/icons', { recursive: true });
  fs.writeFileSync(`./icons/icon-${size}x${size}.png`, png);
  fs.writeFileSync(`./public/icons/icon-${size}x${size}.png`, png);
  console.log(`Generated glass icon-${size}x${size}.png`);
});
