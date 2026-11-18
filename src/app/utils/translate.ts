// Traducción de los valores de categoría del dataset (vienen en inglés). Lo que no está en las tablas se muestra tal cual.

const GENDER: Record<string, string> = { Male: 'Masculino', Female: 'Femenino' };

const RACE_PARTS: Record<string, string> = {
  Human: 'Humano',
  Mutant: 'Mutante',
  Cyborg: 'Cíborg',
  God: 'Dios',
  Eternal: 'Eterno',
  Radiation: 'Radiación',
  Symbiote: 'Simbionte',
  Android: 'Androide',
  Kryptonian: 'Kryptoniano',
  Alien: 'Alienígena',
  Demon: 'Demonio',
  Atlantean: 'Atlante',
  Asgardian: 'Asgardiano',
  Alpha: 'Alfa',
  Inhuman: 'Inhumano',
  'Cosmic Entity': 'Entidad cósmica',
  Altered: 'Alterado',
  'New God': 'Nuevo dios',
  Saiyan: 'Saiyajin',
  'Demi-God': 'Semidiós',
  Metahuman: 'Metahumano',
  Cosmic: 'Cósmico',
  'Frost Giant': 'Gigante de hielo',
  Vampire: 'Vampiro',
  Martian: 'Marciano',
  Amazon: 'Amazona',
  Clone: 'Clon',
  Zombie: 'Zombi',
  Gorilla: 'Gorila',
};

const EYE_PARTS: Record<string, string> = {
  Blue: 'Azul',
  Brown: 'Marrón',
  Bown: 'Marrón',
  Green: 'Verde',
  Red: 'Rojo',
  Black: 'Negro',
  Yellow: 'Amarillo',
  'Yellow (without irises)': 'Amarillo (sin iris)',
  White: 'Blanco',
  Hazel: 'Avellana',
  Grey: 'Gris',
  Purple: 'Morado',
  Gold: 'Dorado',
  Violet: 'Violeta',
  Amber: 'Ámbar',
  Indigo: 'Índigo',
  Silver: 'Plateado',
};

const HAIR_PARTS: Record<string, string> = {
  Black: 'Negro',
  Blond: 'Rubio',
  Brown: 'Castaño',
  Brownn: 'Castaño',
  'No Hair': 'Sin cabello',
  Red: 'Rojo',
  White: 'Blanco',
  Auburn: 'Castaño rojizo',
  Green: 'Verde',
  Purple: 'Morado',
  'Strawberry Blond': 'Rubio rojizo',
  Grey: 'Gris',
  Silver: 'Plateado',
  Blue: 'Azul',
  Orange: 'Naranja',
  Gold: 'Dorado',
  Indigo: 'Índigo',
  Magenta: 'Magenta',
  Pink: 'Rosado',
  Yellow: 'Amarillo',
};

// Traduce valores compuestos del tipo "Human / Radiation" parte por parte.
function byParts(value: string, table: Record<string, string>): string {
  if (table[value]) return table[value];
  return value
    .split(' / ')
    .map((part) => table[part.trim()] ?? part.trim())
    .join(' / ');
}

export const translateGender = (value: string): string => GENDER[value] ?? value;
export const translateRace = (value: string): string => byParts(value, RACE_PARTS);
export const translateEyes = (value: string): string => byParts(value, EYE_PARTS);
export const translateHair = (value: string): string => byParts(value, HAIR_PARTS);
