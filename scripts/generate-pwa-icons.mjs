import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

await mkdir("public/icons", { recursive: true });

for (const size of [192, 512]) {
  const fontSize = Math.round(size * 0.45);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="100%" height="100%" fill="#1e40af"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="${fontSize}" font-weight="bold">T</text>
  </svg>`;
  const out = path.join("public", "icons", `icon-${size}.png`);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log("Created", out);
}
