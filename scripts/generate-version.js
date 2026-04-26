#!/usr/bin/env node
/**
 * Génère src/version.json avant chaque build Angular.
 * Ce fichier est copié à la racine du dist et interrogé
 * par VersionCheckService pour détecter les nouvelles versions.
 */
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let gitSha = 'unknown';
try {
  gitSha = execSync('git rev-parse --short HEAD', { stdio: ['pipe', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {
  // pas de git disponible (CI sans historique, etc.)
}

const versionData = {
  version:   `${Date.now()}-${gitSha}`,
  buildTime: new Date().toISOString(),
  sha:       gitSha
};

const dest = path.join(__dirname, '..', 'src', 'version.json');
fs.writeFileSync(dest, JSON.stringify(versionData, null, 2));

console.log(`[generate-version] version.json écrit → ${versionData.version}`);
