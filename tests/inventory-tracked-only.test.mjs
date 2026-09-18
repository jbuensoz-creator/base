// LOCAL PATCH YourRender 2026-09-18 (deviation from official 1.5.0 @ 3d04b4d): `inventory.tracked_only`
// restricts the inventory to git-tracked files, so a committed manifest is reproducible on a clean CI
// checkout (YourRender: 322 inventoried resources absent from the git checkout made `index --check`
// green locally and red in CI — run 35372253184). These tests pin the contract: default (absent or
// false) is the official full working-tree inventory; true keeps only `git ls-files` entries; outside
// a usable git repo the inventory falls back to the official behavior with a visible stderr warning.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, it } from "node:test";
import { buildManifest, inventoryResources, resolveConfig, walkResourceFiles } from "../tools/base-core.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let tmpDir;

const git = (args) => execFileSync("git", ["-C", tmpDir, ...args], { stdio: ["ignore", "pipe", "pipe"] });

const write = async (rel, content) => {
  const full = path.join(tmpDir, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
};

// (a) a COMMITTED resource, (b) an UNTRACKED resource, (c) a GITIGNORED resource.
async function writeCorpus() {
  await write(".ai/agents/rh/AGENT.md", "---\nid: rh\ntype: agent\ndescription: Ressources humaines.\n---\n# RH\n");
  await write(".ai/agents/it/AGENT.md", "---\nid: it\ntype: agent\ndescription: Support informatique.\n---\n# IT\n");
  await write("memory/notes.md", "---\ntitle: Notes\nsensitivity: internal\n---\n# Notes\n");
  await write(".gitignore", "memory/\n");
}

async function gitInitCommitTrackedOnly() {
  git(["init", "-q"]);
  git(["add", ".gitignore", ".ai/agents/rh/AGENT.md"]); // (a) committed; (b) untracked; (c) ignored
  git(["-c", "user.email=test@example.com", "-c", "user.name=Test", "commit", "-qm", "init"]);
}

const pathsOf = (resources) => resources.map((r) => r.path ?? r).sort();

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "base-tracked-only-"));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe("inventory.tracked_only — the CI-reproducible inventory mode", () => {
  it("default (key absent): the official behavior — committed, untracked and gitignored files are ALL inventoried", async () => {
    await writeCorpus();
    gitInitCommitTrackedOnly();

    const resources = await inventoryResources(tmpDir);
    assert.deepEqual(pathsOf(resources), [".ai/agents/it/AGENT.md", ".ai/agents/rh/AGENT.md", "memory/notes.md"]);
  });

  it("tracked_only: false — same official behavior, explicitly", async () => {
    await writeCorpus();
    gitInitCommitTrackedOnly();
    await write("base.config.json", JSON.stringify({ inventory: { tracked_only: false } }));

    assert.equal((await inventoryResources(tmpDir)).length, 3);
  });

  it("tracked_only: true — only the git-tracked file is inventoried (walk AND resource level)", async () => {
    await writeCorpus();
    gitInitCommitTrackedOnly();
    await write("base.config.json", JSON.stringify({ inventory: { tracked_only: true } }));

    assert.deepEqual((await walkResourceFiles(tmpDir)).sort(), [".ai/agents/rh/AGENT.md"], "walkResourceFiles (direct callers) honors the filter");
    assert.deepEqual(pathsOf(await inventoryResources(tmpDir)), [".ai/agents/rh/AGENT.md"], "inventoryResources honors the filter");
  });

  it("the manifest built over tracked_only names exactly the tracked resources (the CI-reproducibility promise)", async () => {
    await writeCorpus();
    gitInitCommitTrackedOnly();
    await write("base.config.json", JSON.stringify({ inventory: { tracked_only: true } }));

    const manifest = await buildManifest(tmpDir);
    assert.deepEqual(manifest.resources.map((r) => r.path), [".ai/agents/rh/AGENT.md"]);
  });

  it("a file committed AFTER a first inventory appears on the next call (one fresh git ls-files per inventory)", async () => {
    await writeCorpus();
    gitInitCommitTrackedOnly();
    await write("base.config.json", JSON.stringify({ inventory: { tracked_only: true } }));

    assert.equal((await inventoryResources(tmpDir)).length, 1);
    git(["add", ".ai/agents/it/AGENT.md"]);
    git(["-c", "user.email=test@example.com", "-c", "user.name=Test", "commit", "-qm", "add it"]);
    assert.deepEqual(pathsOf(await inventoryResources(tmpDir)), [".ai/agents/it/AGENT.md", ".ai/agents/rh/AGENT.md"]);
  });

  it("outside a git repo: full inventory (official fallback) WITH a visible stderr warning", async () => {
    await writeCorpus(); // no git init
    await write("base.config.json", JSON.stringify({ inventory: { tracked_only: true } }));

    const warnings = [];
    const originalError = console.error;
    console.error = (...args) => warnings.push(args.join(" "));
    try {
      assert.equal((await inventoryResources(tmpDir)).length, 3, "fallback inventories everything");
    } finally {
      console.error = originalError;
    }
    assert.ok(warnings.some((w) => w.includes("inventory.tracked_only")), `expected a stderr warning, got: ${JSON.stringify(warnings)}`);
  });
});

describe("inventory.tracked_only — config validation and shipped schema", () => {
  it("a non-boolean tracked_only is rejected loudly", async () => {
    await write("base.config.json", JSON.stringify({ inventory: { tracked_only: "yes" } }));
    await assert.rejects(() => resolveConfig(tmpDir), /inventory\.tracked_only.*boolean/);
  });

  it("the resolved config carries no tracked_only key by default (official shape preserved)", async () => {
    await write("base.config.json", JSON.stringify({ inventory: { exclude: ["specs"] } }));
    const cfg = await resolveConfig(tmpDir);
    assert.deepEqual(cfg.inventory, { exclude: ["specs"] }, "no extra key when the project never asked");
  });

  it("the shipped base.config.v1 schema accepts inventory.tracked_only as a boolean", async () => {
    const schema = JSON.parse(await fs.readFile(path.join(repoRoot, "specs", "current", "30_schemas", "base.config.v1.json"), "utf8"));
    assert.equal(schema.properties.inventory.properties.tracked_only?.type, "boolean", "the published schema rejects the key (additionalProperties: false)");
  });
});
