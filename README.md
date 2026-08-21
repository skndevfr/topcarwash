# Top Car Wash — site vitrine one-page

Site statique classique : HTML, CSS, JavaScript. Aucune installation, aucun outil de build.

```
web/
├── index.html        La page complète
├── robots.txt        Indexation par les moteurs de recherche
├── css/
│   └── style.css     Tous les styles
├── js/
│   ├── data.js       ← TOUTES LES DONNÉES ÉDITABLES
│   └── app.js        Configurateur, galerie, cookies, envoi
└── img/
    ├── logo.svg
    ├── logo-icon.svg
    └── tapis-avant.png / tapis-apres.png
```

## Voir le site

Double-cliquer sur `index.html`. C'est tout.

Pour tester avec un vrai serveur local (recommandé) :

```bash
cd web
python3 -m http.server 8080     # puis http://localhost:8080
```

## Modifier le contenu

Tout est dans **`js/data.js`** :

| Clé | Ce qu'elle contrôle |
|---|---|
| `business` | Adresse, téléphone, email, horaires |
| `formulas` | Les 4 cartes de tarifs |
| `washes` / `motoWashes` | Formules du configurateur |
| `supplements` | Suppléments par véhicule (berline +10 €, luxe +20 €, routière +30 €) |
| `addons` | Options — utilisées par le formulaire |
| `gallery` | Prestations du comparateur avant/après |
| `promos` | Codes promo et leur remise |
| `times` | Créneaux horaires proposés |
| `emailjs` | Clés EmailJS (voir plus bas) |

Attention : les tarifs affichés dans la section « Nos formules » et la liste des options sont écrits **en dur dans `index.html`**. Si vous changez un prix dans `data.js`, changez-le aussi dans `index.html` (recherchez le montant).

Les photos vont dans `img/`, puis on référence le nom du fichier dans `gallery`.

## Mettre en ligne

**GitHub Pages** — créer un dépôt, pousser le contenu de `web/`, puis Settings → Pages → Source : `main` / racine.

**Firebase Hosting**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting        # dossier public : .  (depuis web/)
firebase deploy --only hosting
```

**Netlify / Vercel** — glisser-déposer le dossier `web/`.

## Envoi des demandes de rendez-vous

Par défaut, « Confirmer » ouvre l'application mail du visiteur avec la demande pré-remplie.

Pour un envoi direct : créer un compte [EmailJS](https://www.emailjs.com/) et renseigner dans `js/data.js` :

```js
"emailjs": {
  "publicKey": "votre_public_key",
  "serviceId": "service_xxxxxxx",
  "templateId": "template_xxxxxxx"
}
```

Variables du gabarit EmailJS : `to_email`, `reply_to`, `from_name`, `phone`, `contact_pref`, `marketing`, `subject`, `message`.

Un champ anti-robot invisible (honeypot) est déjà en place.

## Limites du statique

- Les créneaux ne tiennent pas compte des réservations existantes : le formulaire envoie une **demande**, que vous confirmez ensuite.
- Aucune demande n'est stockée — seul l'email reçu en garde la trace.
- Les prix sont calculés dans le navigateur : devis indicatif, non contractuel.
- Les codes promo sont visibles dans `js/data.js`.
