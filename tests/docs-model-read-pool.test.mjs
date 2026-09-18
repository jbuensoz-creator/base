// LOCAL PATCH YourRender 2026-09-18 (deviation from official 1.5.0 @ 3d04b4d): buildDocsModel reads
// the corpus through a pool bounded at 256 concurrent reads (mapWithConcurrency) instead of an
// unbounded Promise.all, which hit EMFILE on corpora with more than 20k documentation files.
// These tests pin the pool contract: concurrency never exceeds the limit, result order matches the
// input order, every item is processed — and buildDocsModel still models a corpus larger than the
// pool itself.

import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { buildDocsModel, mapWithConcurrency } from "../tools/docs/model.mjs";

let tmpDir;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "base-docs-pool-"));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function write(relativePath, content) {
  const fullPath = path.join(tmpDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf8");
}

describe("mapWithConcurrency — the bounded read pool", () => {
  it("never exceeds the concurrency limit, while actually running concurrently", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const items = Array.from({ length: 1000 }, (_, i) => i);

    await mapWithConcurrency(items, 256, async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 1));
      inFlight -= 1;
    });

    assert.ok(maxInFlight <= 256, `the pool ran ${maxInFlight} tasks at once, above the 256 limit`);
    assert.ok(maxInFlight > 1, `the pool never parallelized (max in-flight ${maxInFlight})`);
  });

  it("respects a small limit exactly", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const items = Array.from({ length: 50 }, (_, i) => i);

    await mapWithConcurrency(items, 7, async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 2));
      inFlight -= 1;
    });

    assert.ok(maxInFlight <= 7, `limit 7 exceeded: ${maxInFlight} in flight`);
  });

  it("preserves the input order even when tasks finish out of order, and processes every item", async () => {
    const items = Array.from({ length: 600 }, (_, i) => i);
    const seen = new Set();

    const results = await mapWithConcurrency(items, 256, async (item) => {
      seen.add(item);
      // Later items resolve faster, so completion order differs from input order.
      await new Promise((resolve) => setTimeout(resolve, (items.length - item) % 5));
      return item * 2;
    });

    assert.deepEqual(results, items.map((i) => i * 2), "results are not in input order");
    assert.equal(seen.size, items.length, "some items were never processed");
  });

  it("handles an empty input and an input smaller than the limit", async () => {
    assert.deepEqual(await mapWithConcurrency([], 256, async (x) => x), []);
    assert.deepEqual(await mapWithConcurrency([1, 2], 256, async (x) => x + 1), [2, 3]);
  });
});

describe("buildDocsModel — a corpus larger than the pool (300 files > 256)", () => {
  it("models every page of a 300-file synthetic corpus", async () => {
    const total = 300;
    for (let i = 0; i < total; i += 1) {
      const n = String(i).padStart(3, "0");
      await write(`docs/guides/page-${n}.md`, `---\ntitle: Page ${n}\nsensitivity: public\n---\n# Page ${n}\n\nContenu ${n}.\n`);
    }

    const model = await buildDocsModel(tmpDir);
    const paths = new Set(model.resources.map((resource) => resource.path));

    for (let i = 0; i < total; i += 1) {
      const n = String(i).padStart(3, "0");
      assert.ok(paths.has(`docs/guides/page-${n}.md`), `docs/guides/page-${n}.md missing from the model`);
    }
    assert.equal(
      model.resources.filter((resource) => resource.path.startsWith("docs/guides/page-")).length,
      total,
      "the 300-page corpus was not fully modeled",
    );
  });
});
