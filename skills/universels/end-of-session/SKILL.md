---
schema_version: base.resource.v1
id: end-of-session
type: process
title: Clôture de Séance et Enregistrement des Dones MEST
description: "Protocole rigoureux de fin de session. Vérifie que les tests passent, contrôle l'absence de fuites ou de fichiers temporaires, enregistre les produits finis avec leur preuve vérifiable et prépare la synchronisation sans régression."
scope: team
status: active
sensitivity: internal
owner: "direction"
responsibility: "Tout opérateur ou agent exécutant applique à la fin de chaque séance de travail."
provenance: "Standard universel BASE 2026, consolidé d'après les rituels de flotte et la politique QUALS-001."
confidentiality: "internal"
confidential: false
use_when: "Quand une session de travail se termine, avant de quitter le poste ou de rendre la main, pour garantir qu'aucun travail n'est perdu ou laissé dans un état cassé."
routing:
  examples:
    - "end of session"
    - "fin de session"
    - "clôture la séance"
    - "enregistre les dones et vérifie les tests"
    - "ferme la session de travail"
  avoid_when:
    - "Démarrage de session (utiliser start-of-session)."
    - "Simple validation d'une tâche unitaire (utiliser gestion-projet-bim-bam)."
name: end-of-session
keywords: [session, seance, end, fin, cloture, enregistrement, dones, mest, tests, clean, git]
user-invocable: true
allowed-tools: Read Write Edit Bash
---

# Clôture de Séance et Enregistrement des Dones (end-of-session)

## VFP (Produit Final de Valeur)
Un dépôt propre, stable, dont les tests de non-régression sont au vert, avec les preuves MEST des produits réalisés enregistrées dans le registre de session, et un commit net prêt à être partagé.

---

## Protocole en 5 Étapes

### Étape 1 : Le Contrôle de Non-Régression
Avant tout enregistrement de fin de séance, exécuter :
1. **Compilation des types** : `npm run typecheck` ou `npx tsc --noEmit` (si TypeScript). Zéro erreur tolérée.
2. **Tests unitaires rapides** : `npm test` ou la suite Jest/Vitest du projet. Tous les tests doivent être au vert.
3. *Règle absolue* : Si un test échoue, **ne jamais clore la séance en déclarant le travail terminé**. Soit le corriger, soit documenter explicitement le régressif dans `BLOCKERS/`.

### Étape 2 : Nettoyage MEST (Zéro Fichier Résiduel)
1. Vérifier `git status -s` :
   - Aucun fichier `.env` ou `.env.local` ne doit être suivi par git.
   - Aucun dossier temporaire (`.tmp`, `runtime/scratchpad`, screenshots de debug) ne doit être pollué.
2. Retirer ou archiver les fichiers jetables créés pendant la séance.

### Étape 3 : Enregistrement des Dones avec Preuve
Ajouter au journal de session (`docs/session-state.md` ou registre du projet) une entrée datée :
```markdown
### Séance du [YYYY-MM-DD] — [Nom de l'Opérateur / Agent]
- **Produit(s) réalisé(s)** : [Description précise du VFP]
- **Preuve(s) MEST** : [Lien de commit, test passant, capture d'écran, URL vérifiée]
- **Statut des tests** : [Ex: 37/37 tests PASS, typecheck 0 erreur]
- **Ce qui reste à faire** : [Prochaine action prioritaire pour la session suivante]
```

### Étape 4 : Préparation Git & Commit Propre
1. Si le travail est terminé et validé : proposer le message de commit au format standard (`feat:`, `fix:`, `docs:`, `test:`).
2. Si un travail reste en cours : le commiter sur une branche de travail dédiée sans toucher à la branche de production.

### Étape 5 : Accusé de Fin de Session (Sortie obligatoire)
```text
================================================================
  CLÔTURE DE SÉANCE RÉUSSIE — [Nom du Repo]
================================================================
✓ Tests & Types   : 100 % au vert
✓ Nettoyage MEST  : Zéro fichier résiduel non suivi
✓ Registre Dones  : Enregistré avec preuve
✓ Prochaine étape : [Description de la priorité suivante]
================================================================
```
