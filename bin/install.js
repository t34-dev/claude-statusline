#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const isWindows = process.platform === "win32";
const home = process.env.HOME || process.env.USERPROFILE;
const claudeDir = path.join(home, ".claude");
const settingsPath = path.join(claudeDir, "settings.json");
const statuslineDest = path.join(claudeDir, "statusline.sh");
const backupPath = path.join(claudeDir, "statusline.sh.backup");
const settingsBackupPath = path.join(claudeDir, "settings.json.backup");
const statuslineSrc = path.join(__dirname, "..", "statusline.sh");

const blue = "\x1b[38;2;0;153;255m";
const green = "\x1b[38;2;0;175;80m";
const red = "\x1b[38;2;255;85;85m";
const dim = "\x1b[2m";
const reset = "\x1b[0m";

function header() {
  console.log();
  console.log(`  ${blue}Claude Statusline Installer${reset}`);
  console.log(`  ${dim}${"─".repeat(27)}${reset}`);
  console.log();
}

function ok(msg) {
  console.log(`  ${green}\u2713${reset} ${msg}`);
}

function fail(msg) {
  console.log(`  ${red}\u2717${reset} ${msg}`);
}

function checkDeps() {
  const deps = ["jq", "curl", "git"];
  let missing = [];

  for (const dep of deps) {
    try {
      if (isWindows) {
        execSync(`where ${dep}`, { stdio: "ignore" });
      } else {
        execSync(`command -v ${dep}`, { stdio: "ignore" });
      }
    } catch {
      missing.push(dep);
    }
  }

  if (missing.length > 0) {
    fail(`Missing dependencies: ${missing.join(", ")}`);
    console.log();
    if (process.platform === "darwin") {
      console.log(`  Install with: brew install ${missing.join(" ")}`);
    } else if (isWindows) {
      console.log(
        `  Install with: choco install ${missing.join(" ")}  (or scoop)`
      );
    } else {
      console.log(
        `  Install with: sudo apt install ${missing.join(" ")}  (or your package manager)`
      );
    }
    console.log();
    process.exit(1);
  }

  ok(`Dependencies found (${deps.join(", ")})`);
}

function install() {
  // Ensure ~/.claude/ exists
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Backup existing statusline
  if (fs.existsSync(statuslineDest)) {
    fs.copyFileSync(statuslineDest, backupPath);
    ok(`Backed up existing statusline to ${dim}statusline.sh.backup${reset}`);
  }

  // Copy statusline.sh
  fs.copyFileSync(statuslineSrc, statuslineDest);
  if (!isWindows) {
    fs.chmodSync(statuslineDest, 0o755);
  }
  ok(`Installed statusline to ${dim}${statuslineDest}${reset}`);

  // Update settings.json
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      // Backup settings
      fs.copyFileSync(settingsPath, settingsBackupPath);
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch {
      settings = {};
    }
  }

  settings.statusLine = {
    type: "command",
    command: `bash ${statuslineDest.replace(/\\/g, "/")}`,
  };

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  ok(`Updated ${dim}settings.json${reset} with statusLine config`);
}

function uninstall() {
  // Remove statusline.sh
  if (fs.existsSync(statuslineDest)) {
    fs.unlinkSync(statuslineDest);
    ok("Removed statusline.sh");
  }

  // Restore backup if exists
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, statuslineDest);
    fs.unlinkSync(backupPath);
    ok("Restored previous statusline from backup");
  }

  // Clean settings.json
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
      delete settings.statusLine;
      fs.writeFileSync(
        settingsPath,
        JSON.stringify(settings, null, 2) + "\n"
      );
      ok("Removed statusLine from settings.json");
    } catch {
      // ignore
    }
  }

  // Restore settings backup
  if (fs.existsSync(settingsBackupPath)) {
    fs.unlinkSync(settingsBackupPath);
  }
}

// ── Main ──────────────────────────────────────────────
header();

const args = process.argv.slice(2);

if (args.includes("--uninstall") || args.includes("-u")) {
  uninstall();
  console.log();
  console.log(
    `  ${green}Done!${reset} Statusline removed. Restart Claude Code.`
  );
  console.log();
} else {
  checkDeps();
  install();
  console.log();
  console.log(
    `  ${green}Done!${reset} Restart Claude Code to see your new status line.`
  );
  console.log();
}
