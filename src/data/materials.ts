import { Material } from '@/types';

export const DEFAULT_MATERIALS: Omit<Material, 'id' | 'profile_id' | 'created_at' | 'updated_at'>[] = [
  {
    name: "PTR 1x1 calibre 14",
    unit: "metro",
    price: 36,
    category: "Perfiles rectangulares",
    description: "Perfil tubular rectangular de 1 pulgada x 1 pulgada, calibre 14"
  },
  {
    name: "PTR 2x1 calibre 14",
    unit: "metro",
    price: 38,
    category: "Perfiles rectangulares",
    description: "Perfil tubular rectangular de 2 pulgadas x 1 pulgada, calibre 14"
  },
  {
    name: "PTR 2x2 calibre 14",
    unit: "metro",
    price: 43,
    category: "Perfiles rectangulares",
    description: "Perfil tubular rectangular de 2 pulgadas x 2 pulgadas, calibre 14"
  },
  {
    name: "PTR 3x2 calibre 14",
    unit: "metro",
    price: 52,
    category: "Perfiles rectangulares",
    description: "Perfil tubular rectangular de 3 pulgadas x 2 pulgadas, calibre 14"
  },
  {
    name: "PTR 4x2 calibre 14",
    unit: "metro",
    price: 65,
    category: "Perfiles rectangulares",
    description: "Perfil tubular rectangular de 4 pulgadas x 2 pulgadas, calibre 14"
  },
  {
    name: "Ángulo 1x1 calibre 3/16",
    unit: "metro",
    price: 35,
    category: "Ángulos",
    description: "Ángulo de acero de 1 pulgada x 1 pulgada, calibre 3/16"
  },
  {
    name: "Ángulo 1.5x1.5 calibre 3/16",
    unit: "metro",
    price: 42,
    category: "Ángulos",
    description: "Ángulo de acero de 1.5 pulgadas x 1.5 pulgadas, calibre 3/16"
  },
  {
    name: "Ángulo 2x2 calibre 3/16",
    unit: "metro",
    price: 48,
    category: "Ángulos",
    description: "Ángulo de acero de 2 pulgadas x 2 pulgadas, calibre 3/16"
  },
  {
    name: "Lámina galvanizada calibre 22",
    unit: "metro²",
    price: 65,
    category: "Láminas",
    description: "Lámina de acero galvanizada calibre 22"
  },
  {
    name: "Lámina galvanizada calibre 20",
    unit: "metro²",
    price: 75,
    category: "Láminas",
    description: "Lámina de acero galvanizada calibre 20"
  },
  {
    name: "Lámina galvanizada calibre 18",
    unit: "metro²",
    price: 85,
    category: "Láminas",
    description: "Lámina de acero galvanizada calibre 18"
  },
  {
    name: "Solera 1 pulgada calibre 3/16",
    unit: "metro",
    price: 29,
    category: "Soleras",
    description: "Solera de acero de 1 pulgada de ancho, calibre 3/16"
  },
  {
    name: "Solera 1.5 pulgadas calibre 3/16",
    unit: "metro",
    price: 38,
    category: "Soleras",
    description: "Solera de acero de 1.5 pulgadas de ancho, calibre 3/16"
  },
  {
    name: "Solera 2 pulgadas calibre 3/16",
    unit: "metro",
    price: 45,
    category: "Soleras",
    description: "Solera de acero de 2 pulgadas de ancho, calibre 3/16"
  },
  {
    name: "Redondo macizo 3/8",
    unit: "metro",
    price: 23,
    category: "Redondos",
    description: "Varilla redonda maciza de 3/8 de pulgada"
  },
  {
    name: "Redondo macizo 1/2",
    unit: "metro",
    price: 32,
    category: "Redondos",
    description: "Varilla redonda maciza de 1/2 pulgada"
  },
  {
    name: "Redondo macizo 5/8",
    unit: "metro",
    price: 45,
    category: "Redondos",
    description: "Varilla redonda maciza de 5/8 de pulgada"
  },
  {
    name: "Cuadrado macizo 1/2",
    unit: "metro",
    price: 42,
    category: "Cuadrados",
    description: "Varilla cuadrada maciza de 1/2 pulgada"
  },
  {
    name: "Cuadrado macizo 5/8",
    unit: "metro",
    price: 58,
    category: "Cuadrados",
    description: "Varilla cuadrada maciza de 5/8 de pulgada"
  },
  {
    name: "Cuadrado macizo 3/4",
    unit: "metro",
    price: 72,
    category: "Cuadrados",
    description: "Varilla cuadrada maciza de 3/4 de pulgada"
  },
  {
    name: "Placa de acero 1/8",
    unit: "metro²",
    price: 92,
    category: "Placas",
    description: "Placa de acero de 1/8 de pulgada de espesor"
  },
  {
    name: "Placa de acero 1/4",
    unit: "metro²",
    price: 165,
    category: "Placas",
    description: "Placa de acero de 1/4 de pulgada de espesor"
  },
  {
    name: "Placa de acero 3/8",
    unit: "metro²",
    price: 245,
    category: "Placas",
    description: "Placa de acero de 3/8 de pulgada de espesor"
  },
  {
    name: "Tubo redondo 1 pulgada calibre 14",
    unit: "metro",
    price: 28,
    category: "Tubos redondos",
    description: "Tubo redondo de 1 pulgada de diámetro, calibre 14"
  },
  {
    name: "Tubo redondo 1.5 pulgadas calibre 14",
    unit: "metro",
    price: 35,
    category: "Tubos redondos",
    description: "Tubo redondo de 1.5 pulgadas de diámetro, calibre 14"
  },
  {
    name: "Tubo redondo 2 pulgadas calibre 14",
    unit: "metro",
    price: 48,
    category: "Tubos redondos",
    description: "Tubo redondo de 2 pulgadas de diámetro, calibre 14"
  },
  {
    name: "Electrodo 6011 1/8",
    unit: "kilogramo",
    price: 85,
    category: "Soldadura",
    description: "Electrodo para soldadura 6011 de 1/8 de pulgada"
  },
  {
    name: "Electrodo 6013 1/8",
    unit: "kilogramo",
    price: 85,
    category: "Soldadura",
    description: "Electrodo para soldadura 6013 de 1/8 de pulgada"
  },
  {
    name: "Electrodo 7018 1/8",
    unit: "kilogramo",
    price: 125,
    category: "Soldadura",
    description: "Electrodo para soldadura 7018 de 1/8 de pulgada"
  },
  {
    name: "Primer anticorrosivo",
    unit: "litro",
    price: 95,
    category: "Pintura",
    description: "Primer anticorrosivo para protección del acero"
  },
  {
    name: "Esmalte sintético",
    unit: "litro",
    price: 85,
    category: "Pintura",
    description: "Esmalte sintético para acabado final"
  },
  {
    name: "Thinner estándar",
    unit: "litro",
    price: 45,
    category: "Pintura",
    description: "Thinner para dilución de pinturas"
  },
  {
    name: "Tornillo autoperforante 1/4 x 1",
    unit: "pieza",
    price: 1.5,
    category: "Tornillería",
    description: "Tornillo autoperforante de 1/4 x 1 pulgada"
  },
  {
    name: "Tornillo autoperforante 1/4 x 2",
    unit: "pieza",
    price: 2.2,
    category: "Tornillería",
    description: "Tornillo autoperforante de 1/4 x 2 pulgadas"
  },
  {
    name: "Remache pop 1/8",
    unit: "pieza",
    price: 0.8,
    category: "Tornillería",
    description: "Remache pop de 1/8 de pulgada"
  },
  {
    name: "Bisagra piano 2 pulgadas",
    unit: "metro",
    price: 85,
    category: "Herrajes",
    description: "Bisagra piano de 2 pulgadas de ancho"
  },
  {
    name: "Cerradura de sobreponer",
    unit: "pieza",
    price: 245,
    category: "Herrajes",
    description: "Cerradura de sobreponer estándar"
  },
  {
    name: "Chapa Yale estándar",
    unit: "pieza",
    price: 185,
    category: "Herrajes",
    description: "Chapa Yale para puertas estándar"
  },
  {
    name: "Manija de palanca",
    unit: "pieza",
    price: 125,
    category: "Herrajes",
    description: "Manija de palanca para puertas"
  },
  {
    name: "Candado de alta seguridad",
    unit: "pieza",
    price: 285,
    category: "Herrajes",
    description: "Candado de alta seguridad para portones"
  }
];

// Precios por estado (multiplicadores del precio base)
export const STATE_PRICE_MULTIPLIERS: Record<string, number> = {
  'Aguascalientes': 1.0,
  'Baja California': 1.15,
  'Baja California Sur': 1.25,
  'Campeche': 1.05,
  'Chiapas': 0.9,
  'Chihuahua': 1.1,
  'Coahuila': 1.05,
  'Colima': 1.0,
  'Ciudad de México': 1.2,
  'Durango': 0.95,
  'Guanajuato': 0.95,
  'Guerrero': 0.9,
  'Hidalgo': 0.95,
  'Jalisco': 1.0,
  'México': 1.1,
  'Michoacán': 0.95,
  'Morelos': 1.05,
  'Nayarit': 0.95,
  'Nuevo León': 1.1,
  'Oaxaca': 0.9,
  'Puebla': 0.95,
  'Querétaro': 1.05,
  'Quintana Roo': 1.15,
  'San Luis Potosí': 0.95,
  'Sinaloa': 1.05,
  'Sonora': 1.1,
  'Tabasco': 1.0,
  'Tamaulipas': 1.05,
  'Tlaxcala': 0.95,
  'Veracruz': 0.95,
  'Yucatán': 1.05,
  'Zacatecas': 0.9
};

export const getAdjustedMaterials = (state: string) => {
  const multiplier = STATE_PRICE_MULTIPLIERS[state] || 1.0;
  return DEFAULT_MATERIALS.map(material => ({
    ...material,
    price: Math.round(material.price * multiplier)
  }));
};
