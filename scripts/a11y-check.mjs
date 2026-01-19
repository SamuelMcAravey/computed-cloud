import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const BASE_URL = process.env.A11Y_BASE_URL ?? "http://localhost:4321";
const USE_EXTERNAL_SERVER = Boolean(process.env.A11Y_BASE_URL);
const MAX_POSTS = 3;

const projectRoot = process.cwd();
const blogDir = path.join(projectRoot, "src", "content", "blog");

const getPostSlugs = () => {
  const entries = readdirSync(blogDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""));
  return entries.slice(0, MAX_POSTS);
};

const buildUrls = () => {
  const slugs = getPostSlugs();
  const basePaths = ["/", "/blog", "/about", "/tags", "/tools", "/blog/start-here"];
  const postPaths = slugs.map((slug) => `/blog/${slug}`);
  return [...basePaths, ...postPaths].map((p) => `${BASE_URL}${p}`);
};

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

const waitForServer = async (url, attempts = 30, delayMs = 500) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return;
    } catch {
      // ignore
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`Server did not become ready at ${url}`);
};

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

const main = async () => {
  let preview = null;
  try {
    if (!USE_EXTERNAL_SERVER) {
      await run(npxCmd, ["astro", "build"]);
      preview = spawn(npxCmd, ["astro", "preview", "--port", "4321"], {
        stdio: "inherit",
      });
      await waitForServer(`${BASE_URL}/`);
    }

    const urls = buildUrls();
    await run(npxCmd, ["--no-install", "axe", ...urls]);
  } finally {
    if (preview) preview.kill();
  }
};

main().catch((err) => {
  console.error(err?.message ?? err);
  process.exit(1);
});
