// Spec coverage: FR-ROUTE-001
import assert from "node:assert/strict";
import { test } from "node:test";
import { routeAvoidReasons, routeTerms } from "../tools/core/route-service.mjs";

test("a named exclusion vetoes its organisation inside a longer CRM request", () => {
  assert.deepEqual(routeAvoidReasons(["YourQuantix"], routeTerms("Ajoute Joe Blow dans le CRM de YourQuantix")), ["route_avoid:yourquantix"]);
});

test("a named exclusion does not veto a different organisation sharing a prefix", () => {
  assert.deepEqual(routeAvoidReasons(["YourQuantix"], routeTerms("We have a new client Joe Blow for Your Render put it in my CRM !")), []);
});
