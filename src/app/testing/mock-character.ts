import { Character } from '../models/character';

export function mockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Spider-Man',
    slug: 'spider-man',
    powerstats: { intelligence: 90, strength: 55, speed: 67, durability: 75, power: 74, combat: 85 },
    biography: {
      fullName: 'Peter Parker',
      alterEgos: 'No alter egos found.',
      aliases: ['Spidey', 'Web-Head'],
      placeOfBirth: 'New York, New York',
      firstAppearance: 'Amazing Fantasy #15',
      publisher: 'Marvel Comics',
      alignment: 'good',
    },
    appearance: { gender: 'Male', race: 'Human', height: ["5'10", '178 cm'], weight: ['167 lb', '76 kg'], eyeColor: 'Hazel', hairColor: 'Brown' },
    work: { occupation: 'Freelance photographer', base: 'New York, New York' },
    connections: { groupAffiliation: 'Avengers', relatives: 'May Parker (aunt)' },
    images: { xs: 'xs.jpg', sm: 'sm.jpg', md: 'md.jpg', lg: 'lg.jpg' },
    ...overrides,
  };
}

export function mockDCCharacter(overrides: Partial<Character> = {}): Character {
  return mockCharacter({
    id: 2,
    name: 'Batman',
    slug: 'batman',
    biography: {
      fullName: 'Bruce Wayne',
      alterEgos: 'No alter egos found.',
      aliases: ['Dark Knight'],
      placeOfBirth: 'Gotham City',
      firstAppearance: 'Detective Comics #27',
      publisher: 'DC Comics',
      alignment: 'good',
    },
    ...overrides,
  });
}
