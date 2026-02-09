import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Fuse from "fuse.js";

function normalize(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");
}

function extractTokens(str) {
  return normalize(str)
    .split(" ")
    .filter(Boolean)
    .filter(
      w =>
        ![
          "xt",
          "ti",
          "super",
          "w",
          "plus",
          "gold",
          "bronze",
          "platinum",
          "pcie5",
          "mhz"
        ].includes(w)
    );
}

function tokenScore(inputTokens, itemTokens) {
  return inputTokens.filter(t => itemTokens.includes(t)).length;
}

function readCSV(filename) {
  const filePath = path.join(process.cwd(), "src/data", filename);
  const file = fs.readFileSync(filePath, "utf8");

  const results = Papa.parse(file, { header: true, skipEmptyLines: true });
  return results.data;
}

function findBestMatch(input, dataset, key = "name") {
  if (!input || !dataset.length) return null;

  const inputTokens = extractTokens(input);

  let bestItem = null;
  let bestScore = -1;

  for (const item of dataset) {
    const itemTokens = extractTokens(item[key]);
    const score = tokenScore(inputTokens, itemTokens);

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (bestScore === 0) {
    const fuse = new Fuse(dataset, {
      keys: [key],
      threshold: 0.4,
      ignoreLocation: true,
      tokenize: true
    });

    const fuseResult = fuse.search(input);
    bestItem = fuseResult[0]?.item || null;
  }

  return bestItem
    ? {
        name: bestItem[key],
        price: bestItem.price ? Number(bestItem.price) : "Unknown",
      }
    : null;
}

export function filterDataInJSON(build) {
  const cpuData = readCSV("cpu.csv");
  const gpuData = readCSV("video-card.csv");
  const ramData = readCSV("memory.csv");
  const storageData = readCSV("internal-hard-drive.csv");
  const motherboardData = readCSV("motherboard.csv");
  const psuData = readCSV("power-supply.csv");

  return {
    CPU: findBestMatch(build.CPU, cpuData),
    GPU: findBestMatch(build.GPU, gpuData, "chipset"),
    RAM: findBestMatch(build.RAM, ramData),
    Storage: findBestMatch(build.Storage, storageData),
    Motherboard: findBestMatch(build.Motherboard, motherboardData),
    PSU: findBestMatch(build.PSU, psuData),
  };
}
