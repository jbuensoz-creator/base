// LOCAL PATCH YourRender 2026-09-18 (deviations from official 1.5.0 @ 3d04b4d): routeRequest accepts
// an optional preparedCorpus, and runRouteTests in production strategy prepares the corpus ONCE for
// the whole replay instead of re-inventorying per case (63 min -> 11 s on 1350 cases). These tests
// pin the safety contract of that optimization: identical routing decisions with or without the
// prepared corpus, identical route-test verdicts, and no corpus leakage between roots or across calls.

import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { prepareRouteCorpus, resolveConfig, routeRequest, runRouteTests } from "../tools/base-core.mjs";

let rootA;
let rootB;

const write = async (root, rel, content) => {
  const full = path.join(root, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
};

// Root A: an HR corpus. Root B: an IT corpus with disjoint vocabulary, so a verdict that routes
// «paie» proves the A corpus was used and a verdict that routes «vpn» proves the B corpus was used.
async function writeRootA(root) {
  await write(root, ".ai/agents/rh/AGENT.md", "---\nid: rh\ntype: agent\ndescription: Ressources humaines.\n---\n# RH\n");
  await write(
    root,
    ".ai/agents/rh/skills/processes/paie/SKILL.md",
    "---\nid: consulter-paie\ntype: process\nuse_when: Consulter ou afficher la paie d'un employé.\n---\n# Paie\n",
  );
  await write(
    root,
    ".ai/agents/rh/skills/processes/conge/SKILL.md",
    "---\nid: poser-conge\ntype: process\nuse_when: Poser ou demander un congé.\n---\n# Congé\n",
  );
  await write(
    root,
    ".ai/routing/route-tests.json",
    JSON.stringify([
      { request: "consulter la paie d'un employé", expect: { status: "routed", agent: "rh", process: "consulter-paie" } },
      { request: "je veux poser un congé", expect: { status: "routed", agent: "rh", process: "poser-conge" } },
    ]) + "\n",
  );
}

async function writeRootB(root) {
  await write(root, ".ai/agents/it/AGENT.md", "---\nid: it\ntype: agent\ndescription: Support informatique.\n---\n# IT\n");
  await write(
    root,
    ".ai/agents/it/skills/processes/vpn/SKILL.md",
    "---\nid: depanner-vpn\ntype: process\nuse_when: Dépanner une connexion VPN en panne.\n---\n# VPN\n",
  );
  await write(
    root,
    ".ai/agents/it/skills/processes/motdepasse/SKILL.md",
    "---\nid: reset-mot-de-passe\ntype: process\nuse_when: Réinitialiser un mot de passe oublié.\n---\n# Mot de passe\n",
  );
  await write(
    root,
    ".ai/routing/route-tests.json",
    JSON.stringify([
      { request: "dépanner ma connexion vpn en panne", expect: { status: "routed", agent: "it", process: "depanner-vpn" } },
      { request: "réinitialiser mon mot de passe oublié", expect: { status: "routed", agent: "it", process: "reset-mot-de-passe" } },
    ]) + "\n",
  );
}

beforeEach(async () => {
  rootA = await fs.mkdtemp(path.join(os.tmpdir(), "base-prepared-corpus-a-"));
  rootB = await fs.mkdtemp(path.join(os.tmpdir(), "base-prepared-corpus-b-"));
  await writeRootA(rootA);
  await writeRootB(rootB);
});

afterEach(async () => {
  await fs.rm(rootA, { recursive: true, force: true });
  await fs.rm(rootB, { recursive: true, force: true });
});

function decisionOf(out) {
  return { status: out.status, agent: out.agent?.id ?? null, process: out.process?.id ?? null };
}

describe("routeRequest — a preparedCorpus decides IDENTICALLY to a fresh inventory", () => {
  it("same status, agent and process across several requests, corpus reused across calls", async () => {
    const cfg = await resolveConfig(rootA);
    const preparedCorpus = await prepareRouteCorpus(rootA, cfg, {});
    assert.ok(preparedCorpus.length > 0, "the prepared corpus is empty");

    const requests = [
      "consulter la paie d'un employé",
      "je veux poser un congé",
      "réparer la fusée intergalactique", // nothing matches: the abstention path must match too
    ];
    for (const request of requests) {
      const fresh = await routeRequest(rootA, request, { config: cfg });
      const prepared = await routeRequest(rootA, request, { config: cfg, preparedCorpus });
      assert.deepEqual(
        decisionOf(prepared),
        decisionOf(fresh),
        `preparedCorpus changed the decision for «${request}»: ${JSON.stringify(decisionOf(prepared))} vs ${JSON.stringify(decisionOf(fresh))}`,
      );
    }
  });

  it("a prepared corpus carries the deny veto exactly like a fresh inventory", async () => {
    await write(
      rootA,
      ".ai/agents/rh/AGENT.md",
      "---\nid: rh\ntype: agent\ndescription: Ressources humaines.\nrouting:\n  deny:\n    - \"process:consulter-paie\"\n---\n# RH\n",
    );
    const cfg = await resolveConfig(rootA);
    const preparedCorpus = await prepareRouteCorpus(rootA, cfg, {});
    const fresh = await routeRequest(rootA, "consulter la paie d'un employé", { config: cfg });
    const prepared = await routeRequest(rootA, "consulter la paie d'un employé", { config: cfg, preparedCorpus });
    assert.deepEqual(decisionOf(prepared), decisionOf(fresh));
    assert.notEqual(prepared.process?.id, "consulter-paie", "the deny veto was lost with a prepared corpus");
  });
});

describe("runRouteTests — production replay with a shared corpus keeps the pre-patch verdicts", () => {
  it("production and lexical strategies return the same verdicts on the same fixtures", async () => {
    const lexical = await runRouteTests(rootA, { strategy: "lexical" });
    const production = await runRouteTests(rootA, { strategy: "production" });

    assert.equal(lexical.ok, true, `lexical replay failed: ${JSON.stringify(lexical.failures)}`);
    assert.equal(production.ok, true, `production replay failed: ${JSON.stringify(production.failures)}`);
    assert.equal(production.total, lexical.total);
    assert.equal(production.passed, lexical.passed);
  });

  it("each production verdict equals a fresh per-case routeRequest (the pre-patch behavior)", async () => {
    const cfg = await resolveConfig(rootA);
    const fixtures = JSON.parse(await fs.readFile(path.join(rootA, ".ai", "routing", "route-tests.json"), "utf8"));
    const production = await runRouteTests(rootA, { strategy: "production" });
    assert.equal(production.ok, true, `production replay failed: ${JSON.stringify(production.failures)}`);

    for (const testCase of fixtures) {
      // Official 1.5.0 replayed each case through routeRequest WITHOUT a prepared corpus.
      const fresh = await routeRequest(rootA, testCase.request, { config: cfg });
      assert.equal(fresh.status, testCase.expect.status, `fresh routeRequest disagrees on «${testCase.request}»`);
      assert.equal(fresh.agent?.id ?? null, testCase.expect.agent ?? null);
      assert.equal(fresh.process?.id ?? null, testCase.expect.process ?? null);
    }
  });
});

describe("corpus isolation — no incorrect reuse between roots or across calls", () => {
  it("runRouteTests(A) and runRouteTests(B) each prepare their OWN corpus in production", async () => {
    const resultA = await runRouteTests(rootA, { strategy: "production" });
    const resultB = await runRouteTests(rootB, { strategy: "production" });

    assert.equal(resultA.ok, true, `root A replay failed on its own corpus: ${JSON.stringify(resultA.failures)}`);
    assert.equal(resultB.ok, true, `root B replay failed on its own corpus: ${JSON.stringify(resultB.failures)}`);

    // Negative control: B's fixtures replayed against A's corpus MUST fail — otherwise the verdicts
    // above prove nothing about which corpus was used.
    await write(
      rootA,
      ".ai/routing/route-tests-b.json",
      await fs.readFile(path.join(rootB, ".ai", "routing", "route-tests.json"), "utf8"),
    );
    const cross = await runRouteTests(rootA, { fixturesPath: ".ai/routing/route-tests-b.json", strategy: "production" });
    assert.equal(cross.ok, false, "B's fixtures passed against A's corpus: the corpus used is not the root's own");
  });

  it("routeRequest without preparedCorpus inventories fresh — a process added after a first call routes", async () => {
    const before = await routeRequest(rootA, "consulter la paie d'un employé");
    assert.equal(before.process?.id, "consulter-paie");

    await write(
      rootA,
      ".ai/agents/rh/skills/processes/accident/SKILL.md",
      "---\nid: declarer-accident\ntype: process\nuse_when: Déclarer un accident de travail.\n---\n# Accident\n",
    );
    const after = await routeRequest(rootA, "déclarer un accident de travail");
    assert.equal(after.status, "routed");
    assert.equal(after.process?.id, "declarer-accident", "routeRequest served a stale corpus instead of re-inventorying");
  });

  it("routeRequest on root B never sees root A's corpus", async () => {
    const out = await routeRequest(rootB, "consulter la paie d'un employé");
    assert.notEqual(out.process?.id, "consulter-paie", "root A's process leaked into root B's routing");
    assert.notEqual(out.agent?.id, "rh", "root A's agent leaked into root B's routing");
  });
});
