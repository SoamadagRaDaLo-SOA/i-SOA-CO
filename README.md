# i-SOA DigiLab Store

La **vitrine officielle** des produits technologiques créés en interne par la branche
Recherche & Développement du groupe **i-SOAMADA**. Ce site n'est **pas** un marketplace
ouvert : il n'existe aucun formulaire de soumission publique — seul le compte admin
i-SOA DigiLab peut ajouter, modifier ou retirer un produit du catalogue.

---

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

Sans configuration, l'app fonctionne en **MODE DÉMO** : toutes les données sont
stockées dans le navigateur (localStorage), pré-remplies avec les trois produits de
lancement, et la connexion admin Google est **simulée**. Vous pouvez tester tout le
parcours immédiatement.

### Connexion admin (mode démo)
1. Rendez-vous sur `/admin/ext` puis sur l'icône **Admin** (ou `/#/admin`).
   En mode démo, cliquez « Se connecter avec Google » — la session admin est
   simulée avec `isoadigilabmailaka@gmail.com`.
2. Vous accédez au tableau de bord : statistiques, CRUD produits, messages,
   édition de la page À propos.

---

## 🔌 Passer en production (Supabase)

### 1. Configurer le projet Supabase
- Créez un projet sur [supabase.com](https://supabase.com).
- Copiez l'URL et la clé **anon** dans un fichier `.env` :

```bash
cp .env.example .env
# puis éditer :
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

### 2. Appliquer le schéma
Ouvrez `supabase/schema.sql` dans l'éditeur SQL de Supabase et exécutez-le.
Il crée les tables, les triggers, les **politiques RLS** et le bucket de stockage.

### 3. Activer l'authentification Google uniquement
- **Dashboard → Authentication → Providers → Google** : activez Google et
  renseignez votre Client ID / Secret OAuth de la console Google Cloud.
- **Dashboard → Authentication → Providers → Email** : **désactivez Email/Password**.
  (Il ne doit rester QUE Google. Aucune inscription par e-mail/mot de passe.)
- **Dashboard → Authentication → URL Configuration** : définissez le Site URL et
  ajoutez l'URL de redirection de votre app.

### 4. Sécurité — un seul compte admin autorisé
La sécurité ne repose pas que sur l'interface : elle est **implémentée côté
serveur** dans `supabase/schema.sql` à l'aide de **Row Level Security**.
La fonction `public.is_admin()` retourne vrai **uniquement** si
`auth.email() = 'isoadigilabmailaka@gmail.com'`.

- `INSERT / UPDATE / DELETE` sur `products`, `product_changelog`,
  `contact_messages` et `about_content` → **with check (public.is_admin())**.
- `SELECT` sur les messages et les brouillons → **admin uniquement**.
- Le public (anon) peut **lire les produits publiés** et **envoyer** un message
  de contact. Il ne peut **jamais** écrire dans le catalogue.

> 🔒 Le code de l'app vérifie aussi l'e-mail autorisé côté client (pour offrir une
> réponse claire), mais la vraie barrière est **RLS**. Toute tentative d'un compte
> Google non autorisé est rejetée par Supabase.

---

## 📂 Structure du projet

```
i-soa-digilab-store/
├─ .env.example              # clés Supabase (à copier en .env)
├─ supabase/schema.sql       # schéma + RLS + triggér + bucket (à exécuter)
├─ src/
│  ├─ App.jsx                # routes
│  ├─ index.css              # Tailwind + composants UI
│  ├─ context/ThemeContext   # thème sombre/clair
│  ├─ lib/
│  │  ├─ supabaseClient.js   # client + e-mail admin autorisé
│  │  ├─ api.js              # couche de données (Supabase / démo)
│  │  ├─ seed.js             # catalogue de lancement
│  │  └─ svg.js              # visuels de démo auto-générés
│  ├─ components/            # Logo, Navbar, Footer, ProductCard, badges…
│  └─ pages/
│     ├─ Home.jsx            # vitrine (héro, recherche, filtres)
│     ├─ ProductDetail.jsx   # fiche produit (galerie, vidéo, changelog)
│     ├─ About.jsx           # présentation i-SOA DigiLab / groupe
│     ├─ Contact.jsx         # formulaire + section collaboration
│     └─ admin/              # login Google, dashboard, CRUD, messages, à propos
```

## 🧩 Fonctionnalités

| Page | Contenu |
|------|---------|
| **Accueil** | Héro + slogan + logo, recherche interne, filtres par type (Toutes / App / Site Web / App + Site / Démo), cartes produits (icône, badge type, description), produits à la une |
| **Produit** | Galerie captures, vidéo démo (si dispo), description, fonctionnalités, boutons « Ouvrir le site » / « Télécharger l'APK », historique de versions, bloc Développé par i-SOA DigiLab |
| **À propos** | Mission, vision, valeurs, le groupe en 3 branches (i-SOAMADA mère, i-SOA DigiLab R&D, i-SOA CybHa sécurité), chiffres clés |
| **Contact** | Formulaire (nom, e-mail, sujet, message) + section « Vous avez un projet ? Collaborons » + liens |
| **Admin** | Connexion Google seulement (compte unique vérifié), tableau de bord (nb produits, messages, produits les plus consultés), CRUD complet avec upload icônes/captures/vidéo, type, catégorie, liens, statut, mise en vedette, changelog, gestion & réponse aux messages, édition du contenu À propos |

## 🎨 Design
- Look moderne inspiré de Google Play / Product Hunt, avec une identité propre à
  i-SOA DigiLab (dégradés bleu → violet, logo « chip » personnalisé).
- Cartes avec ombres douces, coins arrondis, animations au survol.
- **Thème sombre/clair** commutable (bouton dans la barre + sauvegardé).
- Entièrement responsive.

## 🗄️ Tables (Supabase)
- `products` — id, name, slug, type, category, short/long_description, icon_url,
  screenshots (jsonb), demo_video_url, site_url, apk_url, features, status,
  is_featured, views, created_at, updated_at
- `product_changelog` — id, product_id, version, description, released_at
- `contact_messages` — id, name, email, subject, message, status, created_at
- `about_content` — contenu éditable de la page À propos

## 📝 Ajouter un produit plus tard
Dans l'espace admin → onglet **Produits** → **+ Ajouter un produit**. Renseignez nom,
type, liens, médias et statut. Le produit apparaît instantanément sur la vitrine s'il
est publié. Structure identique pour de futurs produits (ex. « i-SOA CybHa Cours »).

## ⚠️ Notes
- En production, uploader les médias vers le bucket Supabase `assets` (les règles de
  sécurité sont déjà dans `schema.sql`) et passer les URLs publiques dans les champs.
- `npm run build` pour produire le bundle statique (`dist/`) à déployer.
