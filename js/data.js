/* Top Car Wash — toutes les données éditables du site.
   Modifier ce fichier suffit : tarifs, options, horaires, coordonnées, codes promo. */
window.TCW_DATA = {
  "business": {
    "name": "Top Car Wash",
    "city": "Nogent-sur-Marne",
    "phone": "01 48 73 95 95",
    "phoneHref": "+33148739595",
    "email": "capitini@hotmail.fr",
    "address1": "147 TER B boulevard de Strasbourg",
    "address2": "94130 Nogent-sur-Marne",
    "hours": [
      "Lundi – Samedi  8h – 20h",
      "Dimanche  fermé"
    ]
  },
  "emailjs": {
    "publicKey": "",
    "serviceId": "",
    "templateId": "",
    "templateIdClient": ""
  },
  "vehicles": [
    {
      "id": "citadine",
      "name": "Citadine"
    },
    {
      "id": "berline",
      "name": "Berline"
    },
    {
      "id": "luxe",
      "name": "Luxe"
    },
    {
      "id": "routiere",
      "name": "Routière"
    },
    {
      "id": "moto",
      "name": "Moto"
    }
  ],
  "supplements": {
    "citadine": 0,
    "berline": 10,
    "luxe": 20,
    "routiere": 30
  },
  "washes": [
    {
      "id": "interieur",
      "name": "Lavage intérieur",
      "price": 60
    },
    {
      "id": "exterieur",
      "name": "Lavage extérieur",
      "price": 70
    },
    {
      "id": "complet",
      "name": "Lavage complet",
      "price": 80
    },
    {
      "id": "prestige",
      "name": "Lavage prestige",
      "price": 105
    }
  ],
  "motoWashes": [
    {
      "id": "moto-basique",
      "name": "Basique",
      "price": 30
    },
    {
      "id": "moto-complet",
      "name": "Complet",
      "price": 50
    }
  ],
  "formulas": [
    {
      "name": "Lavage intérieur",
      "price": 60,
      "tagline": "Une fraîcheur au quotidien",
      "features": [
        "Aspiration de tout l'intérieur",
        "Nettoyage du tableau de bord",
        "Nettoyage des vitres intérieures"
      ],
      "featured": false
    },
    {
      "name": "Lavage extérieur",
      "price": 70,
      "tagline": "Un look impeccable",
      "features": [
        "Nettoyage de la carrosserie",
        "Nettoyage des vitres extérieures",
        "Nettoyage des jantes et des pneus"
      ],
      "featured": false
    },
    {
      "name": "Lavage complet",
      "price": 80,
      "tagline": "Un entretien complet",
      "features": [
        "Nettoyage de la carrosserie",
        "Nettoyage des vitres extérieures",
        "Nettoyage des jantes et des pneus",
        "Aspiration de tout l'intérieur",
        "Nettoyage du tableau de bord",
        "Nettoyage des vitres intérieures"
      ],
      "featured": true
    },
    {
      "name": "Lavage prestige",
      "price": 105,
      "tagline": "Finition irréprochable",
      "features": [
        "Tous les éléments du lavage complet",
        "Application d'un polish sur la carrosserie",
        "Nettoyage des sièges",
        "Nettoyage des tapis"
      ],
      "featured": false
    }
  ],
  "addons": [
    {
      "id": "sieges",
      "name": "Shampoing sièges",
      "price": 40
    },
    {
      "id": "cire",
      "name": "Cire de protection",
      "price": 30
    },
    {
      "id": "lustrage",
      "name": "Lustrage carrosserie",
      "price": 40
    },
    {
      "id": "cuir",
      "name": "Traitement du cuir",
      "price": 70
    },
    {
      "id": "moquette",
      "name": "Shampoing moquette",
      "price": 40
    },
    {
      "id": "plafond",
      "name": "Shampoing plafond",
      "price": 40
    },
    {
      "id": "full",
      "name": "Shampoing sièges, moquette, plafond & coffre",
      "price": 100,
      "wide": true
    },
    {
      "id": "plage",
      "name": "Plage arrière",
      "price": 10
    },
    {
      "id": "portes",
      "name": "Panneaux de porte",
      "price": 25
    },
    {
      "id": "coffre",
      "name": "Shampoing coffre",
      "price": 15
    },
    {
      "id": "moteur",
      "name": "Dessus moteur (à la main)",
      "price": 40
    }
  ],
  "gallery": [
    {
      "id": "carrosserie",
      "label": "Carrosserie",
      "icon": "🚗"
    },
    {
      "id": "jantes",
      "label": "Jantes",
      "icon": "🛞"
    },
    {
      "id": "detailing",
      "label": "Detailing",
      "icon": "✨"
    },
    {
      "id": "sieges",
      "label": "Sièges",
      "icon": "🪑"
    },
    {
      "id": "tapis",
      "label": "Tapis",
      "icon": "mat",
      "before": "tapis-avant.png",
      "after": "tapis-apres.png"
    }
  ],
  "promos": {
    "TOPCARWASH20": 0.2
  },
  "times": [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"
  ]
};
