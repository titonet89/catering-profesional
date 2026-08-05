export type VajillaItemId =
  | "copa-vino" | "copa-agua" | "copa-champagne" | "vaso-trago"
  | "plato-playo" | "plato-hondo" | "plato-entrada" | "fuente"
  | "cubiertos" | "pinzas" | "cazuela"
  | "mantel-largo" | "mantel-redondo" | "camino-mesa" | "servilletas" | "cubre-silla"
  | "decoracion";

export type VajillaItem = {
  id: VajillaItemId;
  nombre: string;
  precio: number;
  unidad: string;
};

export type VajillaCategoria = {
  nombre: string;
  icono: string;
  items: VajillaItem[];
};

export type VajillaItemPedido = {
  id: VajillaItemId;
  nombre: string;
  unidad: string;
  qty: number;
  precio_unitario: number;
  subtotal: number;
};

export const VAJILLA_CATEGORIAS: VajillaCategoria[] = [
  {
    nombre: "Cristalería",
    icono: "🥂",
    items: [
      { id: "copa-vino",      nombre: "Copa de vino tinto",      precio: 250,    unidad: "u." },
      { id: "copa-agua",      nombre: "Copa de agua",            precio: 250,    unidad: "u." },
      { id: "copa-champagne", nombre: "Copa de champagne",       precio: 250,    unidad: "u." },
      { id: "vaso-trago",     nombre: "Vaso trago largo",        precio: 250,    unidad: "u." },
    ],
  },
  {
    nombre: "Vajilla",
    icono: "🍽",
    items: [
      { id: "plato-playo",    nombre: "Plato playo",             precio: 350,    unidad: "u." },
      { id: "plato-hondo",    nombre: "Plato hondo",             precio: 350,    unidad: "u." },
      { id: "plato-entrada",  nombre: "Plato de entrada",        precio: 300,    unidad: "u." },
      { id: "fuente",         nombre: "Fuente de servicio",      precio: 600,    unidad: "u." },
    ],
  },
  {
    nombre: "Cubertería & Accesorios",
    icono: "🍴",
    items: [
      { id: "cubiertos",      nombre: "Set de cubiertos (3 pz)", precio: 450,    unidad: "set" },
      { id: "pinzas",         nombre: "Pinzas de servicio",      precio: 150,    unidad: "u." },
      { id: "cazuela",        nombre: "Cazuela rústica",         precio: 350,    unidad: "u." },
    ],
  },
  {
    nombre: "Mantelería",
    icono: "🪡",
    items: [
      { id: "mantel-largo",   nombre: "Mantel largo (mesa 10)", precio: 2000,   unidad: "u." },
      { id: "mantel-redondo", nombre: "Mantel redondo",         precio: 2200,   unidad: "u." },
      { id: "camino-mesa",    nombre: "Camino de mesa",         precio: 900,    unidad: "u." },
      { id: "servilletas",    nombre: "Servilletas de tela",    precio: 200,    unidad: "u." },
      { id: "cubre-silla",    nombre: "Cubre silla con lazo",   precio: 600,    unidad: "u." },
    ],
  },
  {
    nombre: "Decoración",
    icono: "✨",
    items: [
      { id: "decoracion",     nombre: "Decoración premium",     precio: 150000, unidad: "evento" },
    ],
  },
];

export const ALL_VAJILLA_ITEMS: VajillaItem[] = VAJILLA_CATEGORIAS.flatMap((c) => c.items);

export function findVajillaItem(id: string): VajillaItem | undefined {
  return ALL_VAJILLA_ITEMS.find((i) => i.id === id);
}

export function calcTotalVajilla(items: VajillaItemPedido[]): number {
  return items.reduce((s, i) => s + i.subtotal, 0);
}

export function formatARS(n: number): string {
  return "$ " + n.toLocaleString("es-AR");
}
