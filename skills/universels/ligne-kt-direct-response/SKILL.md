---
schema_version: base.resource.v1
id: ligne-kt-direct-response
type: process
title: "Marketing et Vente Direct Response Kevin Trudeau (7 Stations — Zone 2)"
description: "Processus universel de marketing direct, de validation d'offre et de vente en 7 stations selon le standard Kevin Trudeau (19 DVD). Arme la Zone 2 (Marketing & Vente) pour qualifier le produit, isoler le bouton émotionnel, rédiger les annonces à haute conversion, orchestrer l'amorce WhatsApp et bâtir la continuité."
scope: team
status: active
sensitivity: internal
owner: "direction"
responsibility: "Tout opérateur, marketeur ou assistant de Zone 2 (Marketing & Ventes / Division 2) exécutant ou auditant la stratégie commerciale d'un client applique ce standard."
provenance: "Consolidation des 19 DVD de Kevin Trudeau (Chicago) et standards de la Ligne Direct Response YourRender / YourQuantix."
confidentiality: "internal"
confidential: false
use_when: "Quand le travail concerne le marketing et les ventes d'un client (Zone 2) : qualifier le produit, trouver le bouton émotionnel, rédiger une annonce ou un script de vente directe, valider la rentabilité (markup 3x), configurer la commande WhatsApp, acheter du média ou structurer la continuité."
routing:
  examples:
    - "applique la méthode KT pour ce client"
    - "valide l'offre et le bouton émotionnel marketing"
    - "prépare l'annonce direct response selon les 7 stations"
    - "structure l'amorce publicitaire et l'escalier d'offres"
    - "analyse le produit avec la salle des 1000"
    - "audite la stratégie marketing zone 2 pour le client"
  avoid_when:
    - "Gestion technique de projet ou création de tickets (utiliser gestion-projet-bim-bam)."
    - "Prise de poste ou synchronisation git (utiliser start-of-session)."
    - "Clôture de session et rapport de fin de journée (utiliser end-of-session)."
name: ligne-kt-direct-response
keywords: [marketing, vente, direct-response, kevin-trudeau, kt, 7-stations, bouton, salle-des-1000, markup, annonce, accroche, whatsapp, continuite, zone-2]
user-invocable: true
allowed-tools: Read Write Edit Bash
---

# Ligne Direct Response Kevin Trudeau — 7 Stations (ligne-kt-direct-response)
*Le standard universel de la Zone 2 (Marketing & Ventes / Division 2)*

## VFP (Produit Final de Valeur)
Une offre commerciale certifiée sur ses ratios financiers (markup $\ge 3\times$, plancher $29\$$), armée d'un bouton émotionnel validé par le marché (« head-bob »), avec des annonces à haute conversion sans forcing agressif (« soft sell »), déployée sur un canal de commande à friction zéro (WhatsApp Business) et adossée à une continuité à forte LTV.

---

## Les Principes Inviolables de la Zone 2 (Doctrine KT)

1. **Doctrine du Mental (Inviolable)** :
   - Le terme « cerveau » est formellement proscrit.
   - Utiliser exclusivement **« le mental »** (le classeur d'images et d'expériences) ou **« l'esprit »** (le point de vue créateur qui perçoit et décide).
2. **L'Art de Vendre sans Vendre (« Soft Sell » & Détachement)** :
   - Zéro agressivité de camelot, zéro faux compte à rebours, zéro forcing artificiel.
   - Posture exacte : **Certitude absolue dans la valeur du produit** alliée à un **détachement total du résultat** (*« Ce produit est exceptionnel pour vous. Si vous ne le prenez pas, c'est votre perte, je m'en fiche »*).
3. **Zéro Fausse Donnée** :
   - Interdiction totale d'inventer des chiffres, de faux témoignages ou des volumes de recherche imaginaires. Chaque affirmation s'appuie sur le dossier canonique du client ou des preuves MEST (D9).
4. **Calcul Déterministe des Ratios** :
   - Ne jamais évaluer mentalement la rentabilité. Appliquer strictement la règle du markup minimum $3\times$ pour produit $\le 100\$$ et $2\times$ pour produit $> 100\$$.

---

## L'Enchaînement Canonique des 7 Stations

```
[STATION 0] Dossier Canonique Factuel (Intake)
     ↓
[STATION 1] PRODUCT (Catégorie, Salle des 1 000, Bouton Maître, Escalier d'Offres, Markup)
     ↓
[STATION 2] AD (8 Piliers, Accroches d'amorce, Histoires d'ancrage, Format Soft Sell)
     ↓ 🛑 POINT D'ARRÊT OBLIGATOIRE (Validation Planche Produit + Annonce avant média)
[STATION 3] ORDER METHODS (WhatsApp Business = le 800 moderne, formulaire Two-Step)
     ↓
[STATION 4] BUY MEDIA (Quick Test 50 CHF/EUR, CPC/CPL, intention réelle vs vanité)
     ↓
[STATION 5] TAKE ORDER (Diagnostic offert, closing consultatif, levée d'objections)
     ↓
[STATION 6] SHIP PRODUCT (Délivrance sans friction, élimination du remords d'achat)
     ↓
[STATION 7] DATABASE MARKETING (Actif client, relances, upsells, continuité & LTV)
```

---

### Station 0 — Dossier Canonique (Intake Factuel)
- **Objectif** : Rassembler les faits bruts du client dans le tiroir `2-recu-du-client/DOCUMENT-CANONIQUE-<CLIENT>.md`.
- **Règle d'or** : Sans dossier canonique vérifié, la Station 1 est interdite. On ne devine jamais l'activité d'un client.

---

### Station 1 — PRODUCT : Qualification & Offre (P-01 à P-12)
1. **Catégorie avant l'objet (P-01)** : Identifier la catégorie durable (*evergreen* : argent, santé, gain de temps, statut) vs effet de mode (*fad*).
2. **Test des 1 000 personnes (P-02)** : Poser la question à une salle de 1 000 personnes tout-venant.
   - Si la majorité lève la main $\rightarrow$ **Mass Appeal**.
   - Si seule une minorité ciblée ressent une douleur aiguë $\rightarrow$ **Targeted Marketing** (qualifié par l'intensité de la douleur).
3. **Le « Head-Bob » & Bouton Maître (P-03)** : Remplacer le concept abstrait par une scène vécue déclenchant un hochement de tête affirmatif (*« Oui, c'est exactement ce qui m'arrive »*).
4. **La Règle du Markup Financier (P-05 / P-10)** :
   - Produit $\le 100\$$ : Prix de vente $\ge 3\times$ le coût de revient physique.
   - Produit $> 100\$$ : Prix de vente $\ge 2\times$ le coût de revient physique.
   - Plancher de prix conseillé : $29\$$ minimum (en-dessous, les frais d'acquisition ne sont pas couverts).
5. **L'Escalier des Offres (P-05)** :
   - Marche 1 (Aimant gratuit / diagnostic offert) $\rightarrow$ Marche 2 (Offre centrale) $\rightarrow$ Marche 3 (Prestation premium / continuité).

---

### Station 2 — AD : Conception de l'Annonce (A-01 à A-19)
1. **Format porteur (A-01)** :
   - *Short Form* (Meta Ads / TikTok / Carrousel) : Générateur de prospects (amorce vers diagnostic ou catalogue).
   - *Long Form* (VSL / Document de présentation 28:30) : Déroulé complet sans rupture logique.
2. **Offre Douce vs Offre Dure (A-03)** :
   - *Offre Douce* : Mettre en avant un diagnostic offert ou un guide gratuit pour capturer le prospect avant d'annoncer le prix.
   - *Offre Dure* : Afficher le prix d'emblée uniquement si l'écart de prix est le bouton d'achat (ex : -70 % sur destockage).
3. **Les 8 Piliers de l'Annonce (Crescendo)** :
   - 1. Accroche / Question d'amorce (*« Qui a déjà... ? »*).
   - 2. Scène du problème vécue.
   - 3. Bascule (*« Et s'il existait un moyen de... ? »*).
   - 4. Présentation de la solution sans jargon.
   - 5. Preuve sociale et autorité du fondateur.
   - 6. Démonstration du résultat.
   - 7. Histoires d'ancrage traitant les doutes (*Stories* concrètes).
   - 8. Appel à l'action clair et rassurant (CTA).

> **🛑 Point d'Arrêt Obligatoire** : À la fin de la Station 2, l'opérateur livre la **Planche Produit + Annonce**. Aucune dépense média (Station 4) ne démarre sans GO écrit de la Direction.

---

### Station 3 — ORDER METHODS : Le 800 Moderne
- **WhatsApp Business** est le numéro vert 800 des années 2026 : lien direct, conversationnel, confiance immédiate.
- Formulaire ultra-court : Nom + Téléphone + Ville (2 clics maximum). Supprimer toute friction inutile.

---

### Station 4 — BUY MEDIA : Test Rapide (Quick Test)
- Budget test minimaliste (ex: 50 CHF / EUR) sur des requêtes d'intention forte.
- Mesure des indicateurs réels : Coût par Clic (CPC), Taux de Clic (CTR), Coût par Lead (CPL).
- Verdict strict : Si le coût d'acquisition dépasse la rentabilité unitaire $\rightarrow$ réajuster l'annonce (Station 2) ou l'offre (Station 1), ne jamais forcer le budget.

---

### Station 5 — TAKE ORDER : Conversion & Closing Soft Sell
- Entretien de diagnostic ou échange WhatsApp orienté conseil.
- Poser les questions de qualification, écouter la situation réelle du client.
- Présentation de la solution comme une évidence, avec proposition claire et garantie satisfaction.

---

### Station 6 — SHIP PRODUCT : Délivrance & Zéro Déception
- Confirmation immédiate de la commande par message personnalisé.
- Prise en charge logistique ou démarrage de la prestation sans délai.
- Effacement total du remords post-achat par un message rassurant et valorisant.

---

### Station 7 — DATABASE MARKETING : La Valeur Vie (LTV)
- Enregistrement systématique du contact dans le fichier client central.
- Séquence de suivi à 7, 30 et 90 jours : conseils utiles, propositions d'amélioration, offres complémentaires (upsells).
- La pérennité d'un business réside dans le réachat et la recommandation, pas uniquement dans l'acquisition froide.
