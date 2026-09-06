import { makeIcon, makeScreenshot } from './svg'

// Demo catalogue — the launch products of i-SOA DigiLab.
// These are used when Supabase is not configured, and can also be imported
// into Supabase to seed the "products" table.

export const TYPE_LABELS = {
  app: 'App',
  site: 'Site Web',
  app_site: 'App + Site',
  demo: 'Démo / Réalisation',
}

export function seedProducts() {
  return [
    {
      id: 'p1',
      name: 'i-SOA Shop Game (iSOA Diamond Shop)',
      slug: 'i-soa-shop-game',
      type: 'app_site',
      category: 'Boutique & Recharges',
      short_description:
        'Achetez et rechargez des diamants pour vos jeux préférés — rapide, sécurisé, 24/7.',
      long_description:
        'i-SOA Shop Game est la boutique officielle conçue par i-SOA DigiLab pour l’achat et la recharge de diamants et de crédits de jeux. Elle centralise les transactions de recharge dans une interface simple, fluide et professionnelle.\n\nLa plateforme démarre avec Free Fire et son extension à d’autres jeux est déjà prévue. Chaque transaction est protégée par la sécurité i-SOA CybHa et traitée via des canaux de paiement fiables, avec un suivi de commande en temps réel.',
      icon_url: makeIcon({ bg: ['#3382ff', '#7c3aed'], fg: '#ffffff', label: 'Shop Game' }),
      screenshots: [
        makeScreenshot({ title: 'Catalogue des recharges', accent: '#3382ff' }),
        makeScreenshot({ title: 'Panier & paiement', accent: '#f59e0b' }),
        makeScreenshot({ title: 'Suivi de commande', accent: '#22c55e' }),
      ],
      demo_video_url: null,
      site_url: null,
      apk_url: null,
      status: 'published',
      is_featured: true,
      created_at: '2025-08-01T00:00:00Z',
      updated_at: '2025-11-10T00:00:00Z',
      features: [
        'Recharge de diamants en quelques clics',
        'Support initial : Free Fire — extension prévue à d’autres jeux',
        'Paiement sécurisé et historique des commandes',
        'Suivi de commande en temps réel',
        'Support client intégré & notifications',
      ],
    },
    {
      id: 'p2',
      name: 'intelli-SOA BOT',
      slug: 'intelli-soa-bot',
      type: 'app_site',
      category: 'Intelligence Artificielle',
      short_description:
        'Plateforme de chat IA : génération de code, aperçu live et terminal intégré.',
      long_description:
        'intelli-SOA BOT est l’assistant conversationnel propulsé par i-SOA DigiLab. Il ne se contente pas de discuter : il génère du code, exécute votre logique dans un terminal intégré et affiche un aperçu live du rendu.\n\nPensé comme un laboratoire pour développeurs et curieux, il réunit le meilleur du chat IA et des outils de prototypage dans une seule interface web et mobile, avec une expérience fluide et réactive.',
      icon_url: makeIcon({ bg: ['#22c55e', '#0ea5e9'], fg: '#ffffff', label: 'SOA BOT' }),
      screenshots: [
        makeScreenshot({ title: 'Chat IA conversationnel', accent: '#22c55e' }),
        makeScreenshot({ title: 'Terminal intégré', accent: '#0ea5e9' }),
        makeScreenshot({ title: 'Preview live du code', accent: '#8b5cf6' }),
      ],
      demo_video_url: null,
      site_url: null,
      apk_url: null,
      status: 'published',
      is_featured: true,
      created_at: '2025-09-01T00:00:00Z',
      updated_at: '2025-12-01T00:00:00Z',
      features: [
        'Chat IA multilingue et contextuel',
        'Génération de code dans plusieurs langages',
        'Terminal intégré pour exécuter la logique',
        'Aperçu live du rendu (preview)',
        'Historique de conversations',
      ],
    },
    {
      id: 'p3',
      name: 'i-SOA CO',
      slug: 'i-soa-co',
      type: 'app_site',
      category: 'Réseau social',
      short_description:
        'Le réseau social nouvelle génération : messagerie, publications, stories & comptes pro.',
      long_description:
        'i-SOA CO est le réseau social nouvelle génération imaginé et développé par i-SOA DigiLab. Il combine messagerie instantanée, fil de publications, stories éphémères et profils professionnels dans une seule expérience cohérente.\n\nConçu pour la performance et la confidentialité, i-SOA CO s’appuie sur l’infrastructure sécurisée du groupe pour offrir un espace de connexion moderne, sobre et sans distraction, aussi bien sur le web que sur mobile.',
      icon_url: makeIcon({ bg: ['#f43f5e', '#f59e0b'], fg: '#ffffff', label: 'i-SOA CO' }),
      screenshots: [
        makeScreenshot({ title: 'Fil de publications', accent: '#f43f5e' }),
        makeScreenshot({ title: 'Messagerie instantanée', accent: '#059669' }),
        makeScreenshot({ title: 'Stories & comptes pro', accent: '#f59e0b' }),
      ],
      demo_video_url: null,
      site_url: null,
      apk_url: null,
      status: 'published',
      is_featured: true,
      created_at: '2025-10-01T00:00:00Z',
      updated_at: '2025-12-15T00:00:00Z',
      features: [
        'Messagerie instantanée en temps réel',
        'Fil de publications avec réactions & commentaires',
        'Stories éphémères',
        'Comptes et pages professionnelles',
        'Paramètres de confidentialité avancés',
      ],
    },
  ]
}

// Seed changelog entries (demo)
export function seedChangelog() {
  return [
    { id: 'c1', product_id: 'p1', version: '1.2.0', description: 'Nouveau design du panier & paiement simplifié.', released_at: '2025-11-10' },
    { id: 'c2', product_id: 'p1', version: '1.1.0', description: 'Ajout du suivi de commande en temps réel.', released_at: '2025-09-20' },
    { id: 'c3', product_id: 'p2', version: '2.0.0', description: 'Nouveau terminal intégré & preview live.', released_at: '2025-12-01' },
    { id: 'c4', product_id: 'p2', version: '1.4.0', description: 'Chat multilingue et amélioration des performances.', released_at: '2025-10-12' },
    { id: 'c5', product_id: 'p3', version: '1.0.0', description: 'Lancement officiel de la plateforme.', released_at: '2025-12-15' },
  ]
}
