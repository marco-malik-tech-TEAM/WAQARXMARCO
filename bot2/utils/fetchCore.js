"use strict";

/**
 * The original bot downloaded its commands from a third-party GitHub
 * repository every time it started, which overwrote local changes and ran
 * code you had no control over. All commands now ship inside this project
 * (./commands), so nothing is downloaded.
 */
async function fetchCore() {
  console.log("✅ Using bundled commands (no remote download).");
}

module.exports = { fetchCore };
