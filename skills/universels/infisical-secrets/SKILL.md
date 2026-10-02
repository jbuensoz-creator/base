---
schema_version: base.resource.v1
id: infisical-secrets
type: process
title: Gestion Sécurisée des Secrets & Clés d'API via Infisical
description: "Régit l'accès, l'injection et la vérification des clés secrètes via le coffre Infisical. Élimine tout mot de passe ou clé en clair dans git, interdit le devinement des variables manquantes et fournit les commandes d'injection standard pour dev et prod."
scope: team
status: active
sensitivity: internal
owner: "direction"
responsibility: "Tout développeur, opérateur ou script devant consommer une clé API applique cette méthode."
provenance: "Politique de sécurité YourRender / YourQuantix et directive anti-fuite de données."
confidentiality: "internal"
confidential: false
use_when: "Quand un projet ou un environnement manque de clés de configuration, pour configurer un nouvel opérateur sans risque de fuite, ou pour lancer le projet avec les secrets injectés."
routing:
  examples:
    - "configure les secrets avec infisical"
    - "injecte les clés d'api pour le dev"
    - "comment lancer le projet sans mettre les clés dans le git"
    - "récupère les variables d'environnement manquantes"
    - "vérifie la configuration du coffre de clés"
  avoid_when:
    - "Audit des routes backend (utiliser auditer-routes-admin-express)."
    - "Vérification purement git sans rapport avec les secrets (utiliser start-of-session)."
name: infisical-secrets
keywords: [infisical, secrets, api, cles, keys, env, coffre, securite, token, config]
user-invocable: true
allowed-tools: Read Bash
---

# Gestion Sécurisée des Secrets via Infisical (infisical-secrets)

## VFP (Produit Final de Valeur)
Un environnement de travail opérationnel doté de l'ensemble des clés nécessaires, injectées dynamiquement en mémoire ou dans un fichier strictement local et ignoré par git, avec **zéro fuite de secret dans l'historique ou les commits**.

---

## Les 3 Lois Inviolables
1. **JAMAIS de secret dans git** : Aucun fichier `.env` contenant de vraies valeurs ne doit être ajouté à git (`git add -f` sur un `.env` est un crime de haute trahison).
2. **JAMAIS d'invention de clé** : Si une variable manque, on consulte le coffre Infisical ou `.env.example`, on ne devine jamais une valeur arbitraire.
3. **API Keys backend ONLY** : Les clés privées (Stripe Secret, Supabase Service Role, KIE, ElevenLabs) ne doivent jamais être préfixées par `VITE_` ni exposées au frontend.

---

## Méthodes d'Exécution

### Méthode 1 : Lancement avec Injection Directe (Voie Recommandée)
L'outil CLI `infisical` injecte les variables directement en mémoire dans le processus enfant sans créer de fichier sur le disque :

```bash
# Pour le frontend / web
infisical run --env=dev -- npm run dev

# Pour le backend / api
infisical run --env=dev -- npm run start:dev
```

### Méthode 2 : Génération d'un `.env.local` Contrôlé (Si l'outil local l'exige)
Quand un environnement a besoin d'un fichier physique local (ex: Vite qui lit `web/.env.local`) :
1. Vérifier que `.gitignore` contient formellement `*.local` et `.env*`.
2. Tirer les variables nécessaires depuis le coffre :
   ```bash
   infisical export --env=dev --format=dotenv > .env.local
   ```
3. Vérifier immédiatement avec `git status` que le fichier `.env.local` n'apparaît **PAS** dans la liste des fichiers suivis.

### Méthode 3 : Tirage Chirurgical d'une Seule Clé
Pour un script d'automatisation ou un test ponctuel :
```bash
# Via le script coffre de la maison
node scripts/coffre-yr.mjs tire <projet> <NOM_DE_LA_CLE>
```

---

## Check-list d'Accréditation
- [ ] Le fichier `.env.example` liste toutes les variables requises (sans valeurs secrètes).
- [ ] La commande `git check-ignore -v .env.local` confirme que le fichier est bien exclu.
- [ ] Le projet démarre sans warning d'authentification manquante.
