export interface PowerStats {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

export interface Biography {
  fullName: string;
  alterEgos: string;
  aliases: string[];
  placeOfBirth: string;
  firstAppearance: string;
  publisher: string;
  alignment: 'good' | 'bad' | 'neutral' | string;
}

export interface Appearance {
  gender: string;
  race: string;
  height: string[];
  weight: string[];
  eyeColor: string;
  hairColor: string;
}

export interface Work {
  occupation: string;
  base: string;
}

export interface Connections {
  groupAffiliation: string;
  relatives: string;
}

export interface CharacterImages {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export interface Character {
  id: number;
  name: string;
  slug: string;
  powerstats: PowerStats;
  biography: Biography;
  appearance: Appearance;
  work: Work;
  connections: Connections;
  images: CharacterImages;
}

export type Publisher = 'Marvel Comics' | 'DC Comics';
export type Theme = 'marvel' | 'dc';
