---
schema_version: base.resource.v1
id: routage-communication-kchat
type: process
title: Routage et Transmission de Communication via kChat
description: "Processus universel d'acheminement des messages, alertes, déblocages et demandes d'arbitrage sur les canaux kChat dédiés. Applique la doctrine stricte 1 canal = 1 sujet = 1 webhook, avec preuve d'envoi HTTP 201."
scope: team
status: active
sensitivity: internal
owner: "direction"
responsibility: "Tout agent, chef de projet ou opérateur ayant besoin de transmettre une information, alerter sur un blocage ou notifier un livrable applique ce standard."
provenance: "Politique des canaux kChat (YR-LPA-008, 2026) et consolidation des flux de communication de flotte."
confidentiality: "internal"
confidential: false
use_when: "Quand il faut envoyer un message, annoncer une mission à un opérateur, remonter un blocage au fondateur, poser une question fermée à Miguel ou soumettre un livrable pour validation."
routing:
  examples:
    - "envoie un message sur kchat"
    - "poste dans le canal de Miguel"
    - "alerte le founder sur kchat pour ce blocage"
    - "notifie l'opérateur dans son canal privé"
    - "demande la décision sur Décisions Founder"
    - "communique le livrable pour validation"
  avoid_when:
    - "Initialisation de la séance de travail (utiliser start-of-session)."
    - "Mise à jour des tickets du projet (utiliser gestion-projet-bim-bam)."
    - "Génération ou injection de clés API (utiliser infisical-secrets)."
name: routage-communication-kchat
keywords: [kchat, routage, message, canal, communication, alerte, bloqueur, notification, operateur, founder, miguel, webhook]
user-invocable: true
allowed-tools: Read Bash
---

# Routage et Transmission de Communication via kChat (routage-communication-kchat)

## VFP (Produit Final de Valeur)
Une communication transmise dans le **canal kChat exact**, au bon interlocuteur, dans la langue requise, sans fuite de secret ni pollution de canal commun, certifiée par une **preuve d'envoi HTTP 201**.

---

## La Règle d'Or : 1 Canal = 1 Sujet = 1 Webhook
> **Doctrine Inviolable** : Zéro canal fourre-tout. Zéro repli silencieux.
> Un message écrit et non envoyé n'est pas un message. Le fondateur n'est pas un facteur. L'agent envoie lui-même dans le canal concerné.

---

## Matrice Officielle de Routage

| Cible / Interlocuteur | Canal kChat | Langue | Format Requis |
|---|---|---|---|
| **Opérateur 6 – Nemish** | `Opérateur 6` | Anglais 🇬🇧 | Ordre de mission / Réponse à blocage (TONIGHT / DELIVER / DONE WHEN) |
| **Opérateur 3 – Shubham** | `Opérateur 3` | Anglais 🇬🇧 | Frontend, composants, boutons (TONIGHT / DELIVER / DONE WHEN) |
| **Opérateur 5 – Nisarga** | `Opérateur 5` | Anglais 🇬🇧 | Cartes, layout, styles (TONIGHT / DELIVER / DONE WHEN) |
| **Opérateur 4 – Arpan** | `Opérateur 4` | Anglais 🇬🇧 | Pages, formulaires, internationalisation (TONIGHT / DELIVER / DONE WHEN) |
| **Shiwam KC** | `Shiwam` | Anglais 🇬🇧 | Audit mobile, tests MEST, QA |
| **Ankit** | `Ankit` | Anglais 🇬🇧 | Scripts, automatisation, tooling |
| **Sagar (Gérant Népal)** | `Sagar` | Anglais 🇬🇧 | Coordination locale et heures de l'équipe |
| **Miguel (Client JVMB / Associé)** | `Corrections Jevendsmonbien` | Français 🇫🇷 | Question fermée (OUI/NON), notification de livraison prête sur preuve |
| **Miguel (Direction Associés)** | `Miguel` | Français 🇫🇷 | Direction stratégique entre associés |
| **Jacky Buensoz (Founder)** | `Décisions Founder` | Français 🇫🇷 | Demande d'arbitrage / Décision avec options binaires (`Approved` / `Disapproved`) |
| **Toute l'équipe (Collectif)** | `Operators` | Anglais 🇬🇧 | Annonces d'outillage commun (**aucun nom d'opérateur cité**) |
| **Projets Clients** | `Client Projects` | Français 🇫🇷 | Avancement global multi-clients |

---

## Commande Standard d'Acheminement

Le script officiel de publication est `scripts/post-kchat.mjs`.

```bash
# Envoi direct d'un message concis :
node scripts/post-kchat.mjs --channel "<CanalExact>" "<Texte du message>"

# Envoi d'un rapport ou d'une note longue via un fichier :
node scripts/post-kchat.mjs --channel "<CanalExact>" --file "<chemin/vers/fichier.md>"

# Mode vérification préalable (dry-run sans tir réseau) :
node scripts/post-kchat.mjs --channel "<CanalExact>" --dry-run "<Texte>"
```

*Note pour les dépôts enfants/clients* : si la commande est invoquée depuis un dossier client, cibler l'interpréteur racine :
```bash
node "$YR_HOME/AI-Studio-Google/scripts/post-kchat.mjs" --channel "<CanalExact>" "<Texte>"
```

---

## Les 3 Formats Canoniques selon la Cible

### 1. Format Mission / Déblocage Opérateur (Népal — Anglais Obligatoire)
```markdown
@<operator> Mission ready on branch `<branch>`:
- **DELIVERABLE**: <Ce qui doit être produit exactement>
- **PROOF REQUIRED**: <Preuve MEST observable de visu>
- **COMMANDS**: <Commandes exactes à exécuter>
- **DONE WHEN**: <Critère binaire d'acceptation>
```

### 2. Format Question / Validation Miguel (JVMB — Français Obligatoire)
```markdown
Point bloquant JVMB-<ID> :
- **Question** : <Question fermée et directe sans ambiguïté>
- **Option A** : <Impact / Choix A>
- **Option B** : <Impact / Choix B>
Répondre par A ou B pour débloquer la livraison.
```

### 3. Format Décision Founder (Jacky — Français Obligatoire)
```markdown
DEMANDE DE DÉCISION — <Sujet / Projet>
- **Contexte** : <Problème racine constaté>
- **Impact** : <Conséquence si non tranché>
- **Proposition** : <Recommandation claire>

[ ] Approved : <Option retenue>
[ ] Disapproved : <Raison du refus>
```

---

## Garde-Fous Inviolables

1. **Garde-fou Nominatif** :
   - Tout message citant le prénom ou le pseudo d'un opérateur (`Nemish`, `Shubham`, `Shiwam`, `Ankit`, etc.) doit obligatoirement être routé vers son **canal privé**.
   - Le script `post-kchat.mjs` rejette automatiquement tout message nominatif ciblant `Operators` ou `Announcements`.
2. **Zéro Secret dans le Chat** :
   - Interdiction formelle de poster une clé d'API, un token JWT, un mot de passe ou une chaîne de connexion. Utiliser `infisical-secrets`.
3. **Preuve MEST Obligatoire** :
   - L'agent ne considère la transmission comme acquise que si la commande renvoie explicitement :
     `✅ Posté dans kChat (canal ...) — HTTP 201`.
