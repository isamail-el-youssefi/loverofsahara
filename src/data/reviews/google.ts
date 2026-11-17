/**
 * Google reviews of Lover of Sahara, copied word for word from the public Google Maps listing
 * (5.0 stars, 21 reviews). The long, complete reviews are kept for the home page. Google shows only a
 * relative age ("6 months ago"), so no dates are stored. All of them are written in French.
 */
export interface GoogleReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  lang: "fr";
}

/** The business listing on Google Maps (by its CID), where all reviews can be read. */
export const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=" + "5988124218715247918";

export const GOOGLE_REVIEWS_LIST: GoogleReview[] = [
  {
    id: "g-jade",
    name: "Jade",
    rating: 5,
    lang: "fr",
    text: "Une semaine incroyable avec notre guide Salah. Le paysage est à couper le souffle tout le long, le circuit nous a fait découvrir le Maroc sous différentes perspectives entre gorges, désert, palmeraies, montagnes. Salah est dévoué, attentif et veille à ce que chaque journée soit inoubliable. Nous avons appris beaucoup sur les cultures marocaine et berbère grâce à Salah qui a répondu à toutes nos questions avec patience. Chaque jour un merveilleux nouveau logement pour nous surprendre. Chaque fois très très bien accueillis. Nous recommandons à 1000%. Encore merci Salah !",
  },
  {
    id: "g-sandrine",
    name: "Sandrine Oudard",
    rating: 5,
    lang: "fr",
    text: "Salah bien plus qu'un guide, une personne bienveillante et généreuse qui partage ses connaissances et les merveilles de son pays avec passion. 4 jours de découvertes et de paysages plus beaux les uns que les autres. Une experience authentique que je recommande à tout ceux qui veulent sortir des sentiers touristiques. Salah tu es une belle rencontre de notre voyage et Maël gardera longtemps tout ce que tu lui as appris. Ca restera gravé dans nos coeurs et memoires.",
  },
  {
    id: "g-carolina",
    name: "Carolina Solar",
    rating: 5,
    lang: "fr",
    text: "Nous avons eu le plaisir de faire appel aux services de transport et de guide de Salah. C’est une personne géniale, enthousiaste, aimable et très responsable.\n\nNous avons effectué le trajet entre Zagora et Erg Chegaga, où se trouve un camp magnifique dans le Sahara. Il a eu la délicate attention de nous suggérer d’aller admirer le splendide lever de soleil depuis le camp.\n\nJe remercie Salah pour ce magnifique voyage. J’aimerais vraiment y retourner avec des amis.",
  },
  {
    id: "g-nicolas",
    name: "nicolas rizzi",
    rating: 5,
    lang: "fr",
    text: "Une superbe experience de 2 nuits dans le desert avec Salah.\nLes paysages sont a couper le souffle, déconnexion, détente et nature assurés.\nL'expérience est encore meilleure grâce a Salah, tres professionnel, chaleureux, attentionné et fin connaisseur de la région.\nUn grand merci Salah !\nNous recommandons vivement de se laisser tenter !",
  },
  {
    id: "g-begona",
    name: "begoña Lopez",
    rating: 5,
    lang: "fr",
    text: "Nous avons pu profiter de quelques jours avec un tour dans le désert.\nSalah est un chauffeur expert et respectueux de nos besoins et préoccupations.\n\nIl s'est occupé de tout en détail et la seule chose que je peux dire, c'est que nous avons toujours été très à l'aise.\n\nFortement recommandé.\n\nMerci beaucoup Salah.",
  },
];
