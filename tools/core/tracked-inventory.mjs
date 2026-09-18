// LOCAL PATCH YourRender 2026-09-18 (écart identifié au framework officiel 1.5.0 @ 3d04b4d) :
// le walk officiel inclut par design les fichiers gitignorés et non commités (« inventory
// correctness never depends on .gitignore », walkResourceFiles dans ../base-core.mjs). Sur
// YourRender, 322 ressources ainsi inventoriées sont absentes du checkout git : `index --check`
// passait localement et échouait en CI sur un checkout propre (run GitHub 35372253184, étape b).
//
// `inventory.tracked_only: true` (base.config.json) ne retient que les fichiers de l'index git du
// root, pour que le manifeste commité soit reproductible sur un checkout propre. Le filtre
// s'applique au NIVEAU de la liste de fichiers, après le walk officiel inchangé — le manifeste ne
// porte que des métadonnées, aucun contenu n'est re-haché. UN `git ls-files -z` par inventaire (pas
// un spawn par fichier). Défaut false = comportement officiel strictement inchangé. Hors dépôt git
// ou si git échoue : repli sur l'inventaire complet, avec avertissement visible sur stderr.

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * @param {string} root
 * @returns {Promise<Set<string> | null>} chemins POSIX relatifs au root — la même identité que
 * resource.path ; null si le root n'est pas un dépôt git exploitable (repli officiel).
 */
async function gitTrackedRelativePaths(root) {
  try {
    const { stdout } = await execFileAsync("git", ["-C", root, "ls-files", "-z"], { maxBuffer: 1 << 26 });
    return new Set(stdout.split("\0").filter(Boolean));
  } catch {
    return null;
  }
}

/**
 * @param {string} root @param {string[]} files
 * @returns {Promise<string[]>}
 */
export async function filterToGitTrackedFiles(root, files) {
  const tracked = await gitTrackedRelativePaths(root);
  if (!tracked) {
    console.error(`base: inventory.tracked_only actif mais ${root} n'est pas un dépôt git exploitable — inventaire complet (comportement officiel).`);
    return files;
  }
  return files.filter((file) => tracked.has(file));
}
