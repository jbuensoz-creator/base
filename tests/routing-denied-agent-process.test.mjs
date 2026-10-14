// Spec coverage: FR-ROUTE-003
import assert from "node:assert/strict";
import { test } from "node:test";
import { computeRoute } from "../tools/core/route-service.mjs";
import { createProjections } from "../tools/core/projections.mjs";

test("lexical routing excludes a denied agent's attractive process and keeps coverage available", async () => {
  const resources = [
    { id: "crm", type: "agent", path: ".ai/agents/crm/AGENT.md", title: "CRM", metadata: { use_when: "crm contact client" } },
    { id: "ajouter-crm", type: "process", path: ".ai/agents/crm/skills/processes/ajouter/SKILL.md", title: "Ajoute un client CRM", metadata: { use_when: "ajoute client crm" } },
    { id: "ded", type: "agent", path: ".ai/agents/ded/AGENT.md", title: "Couverture", metadata: { use_when: "crm" } },
    { id: "couverture", type: "process", path: ".ai/agents/ded/skills/processes/couverture/SKILL.md", title: "Couverture", metadata: { use_when: "crm" } },
  ];
  const result = await computeRoute("/fixture", "Ajoute un client CRM", resources, { rankers: [], routing: { policy: { deny: ["crm"] } } });
  assert.equal(result.status, "routed");
  assert.equal(result.agent.id, "ded");
  assert.equal(result.process.id, "couverture");
  assert.ok(result.candidates.every((c) => !["crm", "ajouter-crm"].includes(c.id)));
});

test("the generated AGENTS catalogue omits denied agents while retaining coverage", async () => {
  const resources = [
    { id: "crm", type: "agent", path: ".ai/agents/crm/AGENT.md", title: "CRM" },
    { id: "ded", type: "agent", path: ".ai/agents/ded/AGENT.md", title: "Couverture" },
  ];
  const projections = createProjections({ inventoryResources: async () => resources, resolveConfig: async () => ({ tools: ["agents-md"], routing: { policy: { deny: ["crm"] } } }), recordEvent: async () => {} });
  const artifacts = await projections.buildArtifacts("/fixture", { targets: ["agents-md"] });
  const content = artifacts.find((a) => a.path === "AGENTS.md").content;
  assert.ok(content.includes("**ded**"));
  assert.ok(!content.includes("**crm**"));
});
