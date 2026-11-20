const fs = require('fs');
const path = require('path');

const settingsPath = path.join(require('../utils/paths').ROOT, 'config', 'botSettings.json');

function load() {
  if (fs.existsSync(settingsPath)) {
    try {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

function save(settings) {
  try { fs.mkdirSync(path.dirname(settingsPath), { recursive: true }); } catch (_) {}
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function get(key, fallback) {
  const settings = load();
  return settings[key] !== undefined ? settings[key] : fallback;
}

function set(key, value) {
  const settings = load();
  settings[key] = value;
  save(settings);
}

module.exports = { get, set };
