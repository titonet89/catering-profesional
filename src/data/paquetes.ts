export type PaqueteId =
  | "cena-promo-1"
  | "cena-promo-2"
  | "cena-promo-3"
  | "lunch-promo-1"
  | "lunch-promo-2"
  | "lunch-promo-islas";

export type Paquete = {
  id: PaqueteId;
  nombre: string;
  tipo: "cena" | "lunch";
  precio: number;
  imagen: string;
  resumen: string[];
  menu: Record<string, string[] | Record<string, string[]>>;
  servicios: string[];
  bebidas: string[];
};

export const PRECIO_MINIMO_INVITADOS = 90;

export const PAQUETES: Record<PaqueteId, Paquete> = {
  "cena-promo-1": {
    id: "cena-promo-1",
    nombre: "Cena Promo 1",
    tipo: "cena",
    precio: 59900,
    imagen: "/presupuestos/cena-promo-1.png",
    resumen: ["Menú completo", "Bebidas incluidas", "Servicios incluidos", "Atención profesional"],
    menu: {
      recepcion: ["Trago largo de ananá y frutilla", "Sándwich de miga de jamón y queso"],
      entrada: ["Arrollado Primavera (palmito, jamón, queso crema, aceituna y mix de hojas verdes)", "Vitel toné", "Empanadas"],
      principal: {
        "Carnes blancas": ["Pollo deshuesado", "Pollo al limón", "Pollo a la naranja", "Pollo a la mostaza", "Pollo al ajillo"],
        "Salsas": ["Demiglace", "Salsa crema de puerro", "Salsa crema cuatro quesos", "Salsa crema de albahaca", "Salsa al Oporto", "Salsa al Malbec"],
        "Guarniciones": ["Papas españolas", "Papas Hasselback", "Ensalada rusa"],
      },
      postre: ["Copa helada con oblea y salsa", "Copa Karin (ensalada de fruta, bocha de helado, crema chantilly, salsa y crocante)", "Bombón suizo"],
    },
    bebidas: ["Gaseosa línea Coca-Cola (Sprite, Fanta y Coca-Cola)", "Vino fino 3/4 Los Robles o similar (tinto y blanco)", "Agua mineral", "Soda", "Hielo", "Espumante para brindis", "Todo canilla libre"],
    servicios: ["Juego de vajilla completa", "Cristalería", "Mantelería", "Ornamentación de salón", "Forros de silla", "Servicio de mozos", "Chef profesional", "Ayudantes de cocina", "DJ completo", "Pata flambeada"],
  },

  "cena-promo-2": {
    id: "cena-promo-2",
    nombre: "Cena Promo 2",
    tipo: "cena",
    precio: 69900,
    imagen: "/presupuestos/cena-promo-2.png",
    resumen: ["Menú completo", "Bebidas incluidas", "Servicios incluidos", "Atención profesional"],
    menu: {
      recepcion: ["Trago largo de ananá y frutilla", "Jamón y queso", "Ternera, tomate y huevo", "Ternera, lechuga y tomate", "Apio, roquefort y jamón"],
      entrada: ["Vitel toné", "Arrollado Primavera", "Empanadas", "Creps de jamón y queso gratinado"],
      principal: {
        "Carnes rojas": ["Lomo grillado", "Lomo mechado", "Vacío al horno", "Peceto mechado", "Peceto a la mostaza"],
        "Carnes blancas": ["Arrollado de pollo", "Pollo al limón", "Pollo a la naranja", "Pollo a la mostaza", "Pollo al ajillo"],
        "Salsas": ["Demiglace", "Salsa crema de puerro", "Salsa crema cuatro quesos", "Salsa crema de albahaca", "Salsa crema de panceta", "Salsa a la mostaza", "Salsa al Oporto", "Salsa al Malbec"],
        "Guarniciones": ["Papas españolas", "Papas Hasselback", "Papas bastón", "Ensalada rusa"],
      },
      postre: ["Copa Karin (ensalada de fruta, bocha de helado, crema chantilly, salsa y crocante)", "Bombón suizo", "Torreja con compota de fruta", "Quesillo con dulce de cayote y miel de caña", "Tiramisú"],
    },
    bebidas: ["Gaseosa línea Coca-Cola (Sprite, Fanta y Coca-Cola)", "Vino fino 3/4 Quara, Callia o similar (según stock disponible)", "Barra (Fernet Branca y cerveza)", "Agua mineral", "Soda", "Hielo", "Espumante para brindis", "Todo canilla libre"],
    servicios: ["Juego de vajilla completa", "Cristalería", "Mantelería", "Forros de silla", "Ornamentación del salón en telas", "Servicio de mozos", "Recepcionista", "Chef profesional", "Ayudantes de cocina", "DJ (sonido, animación y ambientación)"],
  },

  "cena-promo-3": {
    id: "cena-promo-3",
    nombre: "Cena Promo 3",
    tipo: "cena",
    precio: 85900,
    imagen: "/presupuestos/cena-promo-3.png",
    resumen: ["Menú completo", "Bebidas incluidas", "Servicios incluidos", "Atención profesional"],
    menu: {
      recepcion: ["Trago largo de ananá y frutilla", "Jamón y queso", "Ternera, tomate y huevo", "Ternera, lechuga y tomate", "Apio, roquefort y jamón", "Empanadas", "Pizzetas", "Chips de jamón crudo y queso"],
      entrada: ["Espárragos gratinados", "Arrollado Primavera", "Creps de jamón y queso gratinado", "Amuse bouche"],
      principal: {
        "Carnes rojas": ["Lomo grillado", "Lomo mechado", "Vacío al horno", "Peceto mechado", "Peceto a la mostaza", "Matambre a la crema", "Matambre al ajillo"],
        "Carnes blancas y cerdo": ["Arrollado de pollo", "Pollo al limón", "Pollo a la naranja", "Pollo a la mostaza", "Suprema grillada", "Carré de cerdo", "Cerdo adobado", "Matambre a la parrilla", "Costilla de cerdo agridulce"],
        "Salsas": ["Demiglace", "Salsa crema de puerro", "Salsa crema cuatro quesos", "Salsa crema de albahaca", "Salsa crema de panceta", "Salsa crema de champignon", "Salsa a la mostaza", "Salsa al Oporto", "Salsa al Malbec"],
        "Guarniciones": ["Papas españolas", "Papas Hasselback", "Papas bastón", "Ensalada rusa", "Mil hojas de papas", "Risotto Duville", "Ensalada Waldorf"],
      },
      postre: ["Copa Karin (ensalada de fruta, bocha de helado, crema chantilly, salsa y crocante)", "Cupcakes con corazón de dulce de leche y cubierta de merengue o chantilly", "Bombón suizo", "Torreja con compota de fruta", "Quesillo con dulce de cayote y miel de caña", "Profiteroles bañados en chocolate", "Peras al vino con crema"],
    },
    bebidas: ["Gaseosa línea Coca-Cola (Sprite, Fanta y Coca-Cola)", "Vino fino 3/4 Quara, Callia o similar (según stock disponible)", "Barra (Fernet Branca, Dr. Lemon, Gancia y cerveza)", "Agua mineral", "Soda", "Hielo", "Espumante para brindis", "Todo canilla libre"],
    servicios: ["Juego de vajilla completa", "Cristalería", "Mantelería", "Forros de silla", "Ornamentación del salón en telas", "Servicio de mozos", "Recepcionista", "Chef profesional", "Ayudantes de cocina", "DJ (sonido, animación y ambientación)", "Pata flambeada", "Mesa dulce", "Cotillón"],
  },

  "lunch-promo-1": {
    id: "lunch-promo-1",
    nombre: "Lunch Promo 1",
    tipo: "lunch",
    precio: 57900,
    imagen: "/presupuestos/lunch-promo-1.png",
    resumen: ["Lunch completo", "Pata flambeada", "Bebidas incluidas", "Servicios incluidos"],
    menu: {
      lunch: ["Empanadas de pollo", "Empanadas de carne", "Sándwich de miga (jamón y queso, ternera tomate y lechuga, ternera queso y tomate)", "Chips de pollo", "Variedad de pizzetas", "Papas en cono", "Albondiguitas", "Mini panchos"],
      "Pata flambeada": ["Pata flambeada", "Variedades de salsas", "Variedades de ensaladas", "Canasta de panes artesanales"],
      postre: ["Copa helada con oblea y salsa"],
    },
    bebidas: ["Gaseosa línea Coca-Cola x 1 lt (Coca-Cola, Sprite, Fanta)", "Soda", "Agua mineral", "Hielo", "Espumante para brindis", "Canilla libre"],
    servicios: ["Servicio de mozos", "Juego de vajilla completa", "Mantelería", "Cristalería", "Decoración del salón con telas", "Forrado de sillas", "Chef profesional", "DJ completo"],
  },

  "lunch-promo-2": {
    id: "lunch-promo-2",
    nombre: "Lunch Promo 2",
    tipo: "lunch",
    precio: 67900,
    imagen: "/presupuestos/lunch-promo-2.png",
    resumen: ["Lunch completo", "Pata flambeada", "Bebidas incluidas", "Servicios incluidos"],
    menu: {
      lunch: ["Empanadas de pollo", "Empanadas de carne", "Empanadas de queso", "Empanadas árabes", "Sándwich de miga (jamón y queso, ternera tomate y lechuga, ternera queso y tomate)", "Chips de jamón crudo", "Chips de pollo", "Variedad de pizzetas", "Pinchos de cerdo y morrón asado", "Mini hamburguesas", "Isla caribeña (mesa preparada con distintos tipos de frutas de estación)", "Variedad de jugos frutales (jugos naturales)"],
      "Pata flambeada": ["Pata flambeada", "Variedades de salsas", "Variedades de ensaladas", "Canasta de panes artesanales"],
    },
    bebidas: ["Gaseosa línea Coca-Cola x 1 lt (Coca-Cola, Sprite, Fanta)", "Soda", "Agua mineral", "Hielo", "Canilla libre"],
    servicios: ["Servicio de mozos", "Juego de vajilla completa", "Mantelería", "Cristalería", "Chef profesional", "DJ completo"],
  },

  "lunch-promo-islas": {
    id: "lunch-promo-islas",
    nombre: "Promo Lunch Islas",
    tipo: "lunch",
    precio: 84900,
    imagen: "/presupuestos/lunch-promo-islas.png",
    resumen: ["Mesa de fiambres", "Lunch completo", "Islas temáticas", "Servicios incluidos"],
    menu: {
      "Tabla de quesos y fiambres": ["Queso Dambo", "Queso Gruyere", "Queso Pategrás", "Queso Roquefort", "Jamón cocido", "Jamón crudo", "Lomito ahumado", "Salamín", "Bondiola", "Olivas negras", "Olivas verdes", "Mini tostadas", "Chips", "Grisines"],
      lunch: ["Variedad de sándwiches de miga", "Variedad de pizzetas", "Pinchos de cherry con queso", "Chips de pan brioche con jamón crudo, queso y rúcula", "Dips de nachos con guacamole", "Pinchos de cerdo y morrón asado", "Variedad de empanadas", "Panes artesanales"],
      "Isla Andina": ["Cazuela de pollo", "Cazuela criolla", "Cazuela de pique a lo macho", "Salteados thai"],
      "Isla Árabe": ["Shawarma", "Sfijas", "Niño envuelto"],
      postre: ["Mesa dulce (variedad de tartas)"],
    },
    bebidas: ["Gaseosa línea Coca-Cola x 1 lt (Coca-Cola, Sprite, Fanta)", "Soda", "Agua mineral", "Hielo", "Canilla libre"],
    servicios: ["Servicio de mozos", "Juego de vajilla completa", "Mantelería", "Cristalería", "Chef profesional"],
  },
};

export const PAQUETES_LISTA = Object.values(PAQUETES);

export function formatPrecio(n: number): string {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}
