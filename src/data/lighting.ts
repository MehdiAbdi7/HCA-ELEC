export type Product = {
  id: string;
  name: string;
  spec: string;
  image: string;
  oldPrice: number;
  price: number;
};

export type ProductGroup = {
  id: string;
  title: string;
  intro: string;
  products: Product[];
};

const PLAF_SPEC = "56W • Ø40cm • 3 positions de lumière";

export const plafonniers: Product[] = [
  {
    id: "br01",
    name: "Plafonnier LED BR01",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-01.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br03",
    name: "Plafonnier LED BR03",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-03.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br06",
    name: "Plafonnier LED BR06",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-06.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br07",
    name: "Plafonnier LED BR07",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-07.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br09",
    name: "Plafonnier LED BR09",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-09.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br10",
    name: "Plafonnier LED BR10",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-10.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br11",
    name: "Plafonnier LED BR11",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-11.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br12",
    name: "Plafonnier LED BR12",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-12.jpg",
    oldPrice: 4500,
    price: 4000,
  },
  {
    id: "br13",
    name: "Plafonnier LED BR13",
    spec: PLAF_SPEC,
    image: "/images/plafonniers/br-13.jpg",
    oldPrice: 4500,
    price: 4000,
  },
];

export const appliqueGroups: ProductGroup[] = [
  {
    id: "crystal-double",
    title: "Applique Crystal — modèle double",
    intro:
      "Diffusion haut/bas, éclats dorés pris dans l'acrylique, 3 positions de couleur.",
    products: [
      {
        id: "crystale-2-3000",
        name: "Crystal double — 3000K",
        spec: "Blanc chaud",
        image: "/images/appliques/crystale-2-3000.jpg",
        oldPrice: 2800,
        price: 2400,
      },
      {
        id: "crystale-2-4500",
        name: "Crystal double — 4500K",
        spec: "Blanc neutre",
        image: "/images/appliques/crystale-2-4500.jpg",
        oldPrice: 2800,
        price: 2400,
      },
      {
        id: "crystale-2-6000",
        name: "Crystal double — 6000K",
        spec: "Blanc froid",
        image: "/images/appliques/crystale-2-6000.jpg",
        oldPrice: 2800,
        price: 2400,
      },
    ],
  },
  {
    id: "crystal-triple",
    title: "Applique Crystal — modèle triple",
    intro: "Même finition, format plus large, 3 positions de couleur.",
    products: [
      {
        id: "crystale-3-3000",
        name: "Crystal triple — 3000K",
        spec: "Blanc chaud",
        image: "/images/appliques/crystale-3-3000.jpg",
        oldPrice: 3200,
        price: 2800,
      },
      {
        id: "crystale-3-4500",
        name: "Crystal triple — 4500K",
        spec: "Blanc neutre",
        image: "/images/appliques/crystale-3-4500.jpg",
        oldPrice: 3200,
        price: 2800,
      },
      {
        id: "crystale-3-6000",
        name: "Crystal triple — 6000K",
        spec: "Blanc froid",
        image: "/images/appliques/crystale-3-6000.jpg",
        oldPrice: 3200,
        price: 2800,
      },
    ],
  },
  {
    id: "incurvee",
    title: "Design incurvé doré",
    intro:
      "Courbe métallique ouverte, intérieur doré, diffusion haut/bas enveloppante.",
    products: [
      {
        id: "white-g",
        name: "Incurvée blanche / dorée",
        spec: "Métallique",
        image: "/images/appliques/white-g.jpg",
        oldPrice: 4000,
        price: 3600,
      },
      {
        id: "black-g",
        name: "Incurvée noire / dorée",
        spec: "Métallique",
        image: "/images/appliques/black-g.jpg",
        oldPrice: 4000,
        price: 3600,
      },
    ],
  },
  {
    id: "projecteurs",
    title: "Projecteurs orientables",
    intro: "Tête orientable 3 positions, finition dorée, 12W.",
    products: [
      {
        id: "proj-bk-g",
        name: "Projecteur noir / doré",
        spec: "12W • 3 positions",
        image: "/images/appliques/proj-bk-g.jpg",
        oldPrice: 2000,
        price: 1600,
      },
      {
        id: "proj-wh-g",
        name: "Projecteur blanc / doré",
        spec: "12W • 3 positions",
        image: "/images/appliques/proj-wh-g.jpg",
        oldPrice: 2000,
        price: 1600,
      },
    ],
  },
  {
    id: "simples",
    title: "Simples & polyvalentes",
    intro:
      "Pour l'intérieur comme l'extérieur, du modèle compact au plus large.",
    products: [
      {
        id: "cube-bk",
        name: "Cube noir",
        spec: "Intérieur • 5W",
        image: "/images/appliques/cube-bk.jpg",
        oldPrice: 2300,
        price: 2000,
      },
      {
        id: "cylindrique-bk",
        name: "Cylindrique noire",
        spec: "Intérieur / extérieur • 6W",
        image: "/images/appliques/cylindrique-bk.jpg",
        oldPrice: 2800,
        price: 2500,
      },
      {
        id: "rond-bk",
        name: "Ronde métallique",
        spec: "Intérieur / extérieur • 12W",
        image: "/images/appliques/rond-bk.jpg",
        oldPrice: 2500,
        price: 2200,
      },
      {
        id: "carre-bk",
        name: "Bloc verre noir",
        spec: "Intérieur / extérieur • 12W",
        image: "/images/appliques/carre-bk.jpg",
        oldPrice: 2500,
        price: 2200,
      },
      {
        id: "double-bk",
        name: "Courbe plastique noire",
        spec: "Intérieur / extérieur",
        image: "/images/appliques/double-bk.jpg",
        oldPrice: 1500,
        price: 1200,
      },
      {
        id: "double-wh",
        name: "Courbe métallique blanche",
        spec: "Intérieur / extérieur",
        image: "/images/appliques/double-wh.jpg",
        oldPrice: 2300,
        price: 2000,
      },
      {
        id: "triple-bk",
        name: "Courbe large plastique noire",
        spec: "Intérieur / extérieur",
        image: "/images/appliques/triple-bk.jpg",
        oldPrice: 1800,
        price: 1500,
      },
      {
        id: "triple-wh",
        name: "Courbe large métallique blanche",
        spec: "Intérieur / extérieur",
        image: "/images/appliques/triple-wh.jpg",
        oldPrice: 2800,
        price: 2500,
      },
    ],
  },
];

export const SITE = {
  name: "HCA ELEC",
  fullName: "Home Connect Algérie",
  tagline: "Électricité générale",
  city: "Alger",
  // ⚠️ à remplacer par les vraies coordonnées du magasin
  phoneDisplay: "0555 03 22 16",
  phoneHref: "tel:+213555032216",
  whatsappHref: "https://wa.me/213555032216",
  address: "Tixeraine, birkhadem, Alger",
};
