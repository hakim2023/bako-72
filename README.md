# Bako-72 Restaurant

Site du restaurant Bako-72 : cuisine africaine traditionnelle faite maison, Saint-Denis.

**En ligne :** https://bako-72.netlify.app — **Administration de la carte :** https://bako-72.netlify.app/admin

## Structure

- `public/` : le site publié par Netlify
  - `index.html`, `main.js`, `style.css` : site (carte, commande, infos, plan)
  - `menu.html` : carte A4 prête à imprimer, avec QR code vers le site
  - `data.js` : carte par défaut (utilisée si l'API ne répond pas) + chargement de la carte en direct
  - `admin/` : espace d'administration (connexion par mot de passe, édition de la carte)
- `netlify/functions/menu.mjs` : API de la carte (`/api/menu`), stockée dans Netlify Blobs
- `index.html`, `menu.html` (à la racine) : redirections de l'ancienne adresse GitHub Pages vers Netlify

## Mot de passe administrateur

Stocké uniquement sous forme de hachage scrypt. Il se change depuis l'admin (« Changer le mot de passe »).
Une variable d'environnement Netlify `ADMIN_PASSWORD`, si elle est définie, est prioritaire.
