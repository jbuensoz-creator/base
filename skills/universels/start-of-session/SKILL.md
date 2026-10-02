---
schema_version: base.resource.v1
id: start-of-session
type: process
title: Prise de Poste et Initialisation de Séance Éclair
description: "Démarrage propre et synchronisé de séance en moins de 30 secondes. Vérifie l'état git, contrôle la santé minimale du repo, charge le dernier état de travail et affiche la prochaine action prioritaire sans bavardage."
scope: team
status: active
sensitivity: internal
owner: "direction"
responsibility: "Tout opérateur ou agent exécutant applique au démarrage de chaque séance."
provenance: "Standard universel BASE 2026, consolidé d'après les rituels de flotte et la politique QUALS-001."
confidentiality: "internal"
confidential: false
use_when: "Quand une session débute, avant toute écriture de code ou de document, pour synchroniser le poste et savoir par quoi commencer."
routing:
  examples:
    - "start of session"
    - "prise de poste initiale"
    - "ouvre la journée de développement"
    - "synchronise le repo et donne la priorité"
    - "démarrage du poste"
  avoid_when:
    - "Arrêt, bilan ou sortie définitive (utiliser end-of-session)."
    - "Gestion de tickets ou de tâches individuelles (utiliser gestion-projet-bim-bam)."
name: start-of-session
keywords: [session, seance, start, debut, demarrage, ouverture, synchro, priorite, contexte, git]
user-invocable: true
allowed-tools: Read Bash
---

# Prise de Poste et Initialisation de Séance (start-of-session)

## VFP (Produit Final de Valeur)
Un espace de travail propre, synchronisé avec le dépôt distant, sans conflit non résolu, avec la prochaine tâche prioritaire identifiée et affichée en **moins de 30 secondes**.

---

## Protocole en 4 Étapes

### Étape 1 : Vérification Git & Étanchéité
1. Exécute : `git status -s`
   - Si des modifications non enregistrées existent d'une session précédente : les afficher immédiatement.
   - Ne **jamais** écraser ou réinitialiser de force sans confirmation humaine.
2. Exécute : `git pull --rebase` (si un remote existe) pour être à jour avec les dernières validations de l'équipe.

### Étape 2 : Détection du Mode (Client vs Founder)
- **Mode Client / Opérateur** (par défaut dans les dépôts clients comme `jevendsmonbien`) :
  - Focalisation 100 % opérationnelle sur le produit du client.
  - Zéro jargon administratif ou organisationnel interne.
- **Mode Founder / Direction** (dans `AI-Studio-Google` ou `YourQuantix/operations`) :
  - Contrôle de la santé de la flotte et des statistiques d'organisation.

### Étape 3 : Chargement du Dernier Contexte
1. Ouvre et lis les 30 dernières lignes de `docs/session-state.md` (ou du registre de projet).
2. Vérifie la présence de bloqueurs non résolus dans `BLOCKERS/`.

### Étape 4 : Le Briefing Flash (Sortie obligatoire)
Affiche un résumé strict de 4 lignes :
```text
================================================================
  PRÊT EN SESSION — [Nom du Repo]
================================================================
• Branche active      : [nom_branche]
• Dernier done validé : [ce qui a été terminé et prouvé lors de la dernière séance]
• Bloqueur en cours   : [aucun OU description du blocage actif]
• PROCHAINE PRIORITÉ  : [tâche concrète et mesurable à exécuter maintenant]
================================================================
```
- Si un **bloqueur actif** est détecté : proposer immédiatement la transmission vers le bon canal kChat via le skill `routage-communication-kchat` (ex: `Corrections Jevendsmonbien` pour Miguel ou `Décisions Founder` pour Jacky).
- Arrête-toi là. Attends la confirmation pour engager la priorité ou transmettre le blocage.
