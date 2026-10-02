# Kit de Compétences Universelles BASE (Socle de Session, Gouvernance & Vente)

Ces compétences constituent le **socle obligatoire** partagé par tout projet opérant sous le standard BASE (YourRender, YourQuantix, dépôts clients Empire).

---

## Les Briques Universelles

| Compétence | Dossier | Rôle clé |
|---|---|---|
| **1. Prise de poste éclair** | [`start-of-session/`](./start-of-session/SKILL.md) | Synchronisation git, santé du repo, affichage de la priorité en moins de 30 secondes. |
| **2. Clôture de séance** | [`end-of-session/`](./end-of-session/SKILL.md) | Tests de non-régression, nettoyage MEST, enregistrement des dones avec preuve. |
| **3. Coffre de clés** | [`infisical-secrets/`](./infisical-secrets/SKILL.md) | Zéro clé en clair dans git, injection dynamique des variables d'environnement. |
| **4. Pilotage de projet** | [`gestion-projet-bim-bam/`](./gestion-projet-bim-bam/SKILL.md) | Fin du bricolage des 200 lignes manuelles. Tickets à 4 champs, validation par preuve vue. |
| **5. Auto-organisation** | [`amelioration-constante/`](./amelioration-constante/SKILL.md) | Règle « Aucun agent ne travaille dans le vide » : Route ➔ Cope ➔ Organize selon BASE. |
| **6. Routage Communication** | [`routage-communication-kchat/`](./routage-communication-kchat/SKILL.md) | Doctrine stricte 1 canal = 1 sujet = 1 webhook avec preuve HTTP 201. |
| **7. Marketing & Vente KT (Zone 2)** | [`ligne-kt-direct-response/`](./ligne-kt-direct-response/SKILL.md) | Méthode Kevin Trudeau en 7 stations : validation d'offre, bouton émotionnel, annonces soft sell et escalier de conversion. |

---

## Déploiement dans un projet

Tout nouveau client initialisé via `base init` ou le template client peut soit :
1. **Pointeur direct** : Référencer ces compétences via `framework_dir` dans son `base.config.json`.
2. **Copie locale** : Être projeté dans `.ai/agents/<nom-agent>/skills/processes/` pour les postes concernés.
