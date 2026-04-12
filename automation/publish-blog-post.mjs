#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import slugify from "slugify";

const DEFAULT_BRANCH = "automation/blog-posts";
const DEFAULT_TAGS = ["automation"];
const BLOG_DIR = path.join("src", "data", "blog");

function parseArgs(argv) {
  const args = {
    branch: DEFAULT_BRANCH,
    dryRun: false,
    overwrite: false,
    pickRandom: false,
    push: false,
    publishWindowMinutes: 0,
    input: null,
    commitMessage: null,
  };

  const readValue = (index, flag) => {
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}`);
    }
    return value;
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    switch (arg) {
      case "--input":
        args.input = readValue(i, arg);
        i += 1;
        break;
      case "--branch":
        args.branch = readValue(i, arg);
        i += 1;
        break;
      case "--commit-message":
        args.commitMessage = readValue(i, arg);
        i += 1;
        break;
      case "--publish-window-minutes": {
        const value = Number(readValue(i, arg));
        if (!Number.isFinite(value) || value < 0) {
          throw new Error(`Invalid value for ${arg}: must be a non-negative number`);
        }
        args.publishWindowMinutes = value;
        i += 1;
        break;
      }
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--overwrite":
        args.overwrite = true;
        break;
      case "--pick-random":
        args.pickRandom = true;
        break;
      case "--push":
        args.push = true;
        break;
      case "--help":
        printHelp();
        process.exit(0);
      default:
        if (!arg.startsWith("--") && !args.input) {
          args.input = arg;
        }
        break;
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Usage:
  node automation/publish-blog-post.mjs --input post.json [--branch automation/blog-posts] [--push]

Input JSON shape:
  {
    "title": "My Post",
    "description": "Short summary",
    "tags": ["automation", "ai"],
    "body": "# Heading\n\nPost content...",
    "draft": false,
    "featured": false,
    "pubDatetime": "2026-04-12T12:00:00.000Z",
    "publishWindowMinutes": 240
  }

Notes:
  - If pubDatetime is omitted and publishWindowMinutes is set, the script schedules a random future publish time.
  - The file is written to src/data/blog/<slug>.md.
  - Use --push to git commit and push to the target branch.
`);
}

async function readJsonInput(inputPath) {
  if (inputPath) {
    const raw = await fs.readFile(inputPath, "utf8");
    return JSON.parse(raw);
  }

  if (process.stdin.isTTY) {
    throw new Error("No input JSON provided. Use --input <file> or pipe JSON into stdin.");
  }

  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value == null ? [] : [value];
}

function schedulePublishDate(windowMinutes = 0) {
  const minutes = Number(windowMinutes || 0);
  if (!minutes || minutes <= 0) return new Date();
  const offset = Math.floor(Math.random() * minutes * 60 * 1000);
  return new Date(Date.now() + offset);
}

function normalizeSlug(input) {
  const value = slugify(String(input ?? ""), { lower: true, strict: true }).trim();
  if (value) return value;
  return `post-${Date.now()}`;
}

function renderBody(body) {
  if (typeof body === "string") return body.trimEnd() + "\n";

  if (Array.isArray(body)) {
    return body.map(part => String(part).trimEnd()).join("\n\n") + "\n";
  }

  if (body && typeof body === "object") {
    const sections = [];
    for (const [heading, text] of Object.entries(body)) {
      if (text == null) continue;
      sections.push(`## ${heading}`);
      sections.push(String(text).trimEnd());
    }
    return sections.join("\n\n") + "\n";
  }

  throw new Error("body must be a string, array, or object");
}

function normalizeSpec(raw) {
  const title = String(raw.title ?? "").trim();
  const description = String(raw.description ?? "").trim();
  const body = raw.body;

  if (!title) throw new Error("Missing required field: title");
  if (!description) throw new Error("Missing required field: description");
  if (body == null) throw new Error("Missing required field: body");

  const tags = asArray(raw.tags)
    .map(tag => String(tag).trim())
    .filter(Boolean);

  const pubDatetime = raw.pubDatetime
    ? new Date(raw.pubDatetime)
    : schedulePublishDate(raw.publishWindowMinutes);

  if (Number.isNaN(pubDatetime.getTime())) {
    throw new Error(`Invalid pubDatetime value: ${raw.pubDatetime}`);
  }

  const slug = normalizeSlug(raw.slug ?? title);
  const filename = `${slug}.md`;

  const frontmatter = {
    title,
    pubDatetime,
    description,
    tags: tags.length > 0 ? tags : DEFAULT_TAGS,
    draft: Boolean(raw.draft ?? false),
    featured: Boolean(raw.featured ?? false),
    canonicalURL: raw.canonicalURL,
    hideEditPost: raw.hideEditPost,
    timezone: raw.timezone,
    ogImage: typeof raw.ogImage === "string" ? raw.ogImage : undefined,
    author: raw.author,
  };

  const filteredFrontmatter = Object.fromEntries(
    Object.entries(frontmatter).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return {
    title,
    description,
    body: renderBody(body),
    filename,
    filePath: path.join(BLOG_DIR, filename),
    frontmatter: filteredFrontmatter,
  };
}

function yamlValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map(item => JSON.stringify(item)).join(", ")}]`;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  return JSON.stringify(String(value));
}

function toFrontmatter(frontmatter) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    lines.push(`${key}: ${yamlValue(value)}`);
  }
  lines.push("---");
  return lines.join("\n");
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function writePost(repoRoot, spec, overwrite) {
  const absPath = path.resolve(repoRoot, spec.filePath);
  const blogRoot = path.resolve(repoRoot, BLOG_DIR);
  const relative = path.relative(blogRoot, absPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside ${BLOG_DIR}: ${spec.filePath}`);
  }

  await ensureDir(absPath);

  if (!overwrite) {
    try {
      await fs.access(absPath);
      throw new Error(`File already exists: ${spec.filePath} (use --overwrite to replace it)`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }

  const content = `${toFrontmatter(spec.frontmatter)}\n\n${spec.body}`;
  await fs.writeFile(absPath, content, "utf8");
  return absPath;
}

function runGit(repoRoot, args, options = {}) {
  execFileSync("git", args, {
    cwd: repoRoot,
    stdio: options.stdio ?? "inherit",
  });
}

function gitStatus(repoRoot) {
  return execFileSync("git", ["status", "--short"], { cwd: repoRoot, encoding: "utf8" }).trim();
}

function assertCleanRepo(repoRoot) {
  const status = gitStatus(repoRoot);
  if (status) {
    throw new Error(`Refusing to run with a dirty working tree. Please commit/stash first:\n${status}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();
  const payload = await readJsonInput(args.input);
  const posts = Array.isArray(payload) ? payload : [payload];
  const selectedPosts = args.pickRandom && posts.length > 1
    ? [posts[Math.floor(Math.random() * posts.length)]]
    : posts;

  const enrichedPosts = selectedPosts.map(post => ({
    ...post,
    publishWindowMinutes:
      typeof post.publishWindowMinutes === "number"
        ? post.publishWindowMinutes
        : args.publishWindowMinutes,
  }));

  if (enrichedPosts.length === 0) {
    throw new Error("No post objects found in input JSON.");
  }

  const normalized = enrichedPosts.map(normalizeSpec);

  if (args.dryRun) {
    for (const spec of normalized) {
      console.log(`Would write ${spec.filePath}`);
      console.log(`  title: ${spec.title}`);
      console.log(`  pubDatetime: ${spec.frontmatter.pubDatetime.toISOString()}`);
      console.log(`  draft: ${spec.frontmatter.draft}`);
    }
    console.log("Dry run complete. No git changes made.");
    return;
  }

  assertCleanRepo(repoRoot);
  runGit(repoRoot, ["checkout", "-B", args.branch]);

  const writtenFiles = [];
  for (const spec of normalized) {
    const filePath = await writePost(repoRoot, spec, args.overwrite);
    writtenFiles.push(filePath);
    console.log(`Wrote ${path.relative(repoRoot, filePath)}`);
  }

  runGit(repoRoot, ["add", ...writtenFiles.map(file => path.relative(repoRoot, file))]);

  const stagedFiles = execFileSync("git", ["diff", "--cached", "--name-only"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();

  if (stagedFiles) {
    const commitMessage = args.commitMessage ?? `feat(blog): add ${normalized.map(item => item.filename.replace(/\.md$/, "")).join(", ")}`;
    runGit(repoRoot, ["commit", "-m", commitMessage]);
  } else {
    console.log("No staged changes to commit.");
  }

  if (args.push) {
    runGit(repoRoot, ["push", "-u", "origin", args.branch]);
  }

  console.log(`Done. Branch: ${args.branch}`);
}

main().catch(error => {
  console.error(error?.stack ?? error?.message ?? String(error));
  process.exit(1);
});
