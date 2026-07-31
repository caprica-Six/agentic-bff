import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const checkMode = process.argv.includes("--check");
const ignoredDirs = new Set(["node_modules", ".next", "dist", "coverage"]);
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...(await walk(fullPath)));
      }
      continue;
    }

    if (extensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function toJsonContent(content) {
  try {
    return `${JSON.stringify(JSON.parse(content), null, 2)}\n`;
  } catch {
    return content.trimEnd() + "\n";
  }
}

function toMarkdownContent(content) {
  return content.replace(/[ \t]+$/gm, "").trimEnd() + "\n";
}

async function formatFile(filePath) {
  const original = await fs.readFile(filePath, "utf8");
  let next = original;

  if (filePath.endsWith(".json")) {
    next = toJsonContent(original);
  } else if (filePath.endsWith(".md")) {
    next = toMarkdownContent(original);
  }

  if (checkMode) {
    return next !== original;
  }

  if (next !== original) {
    await fs.writeFile(filePath, next, "utf8");
  }

  return false;
}

async function main() {
  const files = await walk(rootDir);
  const changedFiles = [];

  for (const file of files) {
    const changed = await formatFile(file);
    if (changed) {
      changedFiles.push(path.relative(rootDir, file));
    }
  }

  const tsFiles = files.filter((file) => [".ts", ".tsx", ".js", ".jsx"].includes(path.extname(file)));
  if (tsFiles.length > 0) {
    const eslintBin = path.join(rootDir, "node_modules", "eslint", "bin", "eslint.js");
    const args = [eslintBin, ...tsFiles, "--fix", "--no-error-on-unmatched-pattern"];
    try {
      execFileSync(process.execPath, args, { stdio: "inherit" });
    } catch {
      if (!checkMode) {
        throw new Error("ESLint failed while applying fixes.");
      }
    }
  }

  if (checkMode) {
    const changed = [];
    for (const file of files) {
      const original = await fs.readFile(file, "utf8");
      const next = await fs.readFile(file, "utf8");
      if (original !== next) {
        changed.push(path.relative(rootDir, file));
      }
    }

    if (changed.length > 0) {
      console.error(`Formatting issues found in: ${changed.join(", ")}`);
      process.exit(1);
    }

    console.log("Formatting check passed.");
    return;
  }

  if (changedFiles.length > 0) {
    console.log(`Formatted ${changedFiles.length} file(s).`);
  } else {
    console.log("No formatting changes needed.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
