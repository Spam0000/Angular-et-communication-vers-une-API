import { fetchDigimon, fetchDigimons } from './datasource.js';

function mapDigimon(raw) {
  if (!raw) {
    return null;
  }

  return {
    id: raw.id,
    name: raw.name,
    releaseDate: raw.releaseDate,
    xAntibody: raw.xAntibody,
    images: raw.images ?? [],
    levels: (raw.levels ?? []).map((item) => item.level),
    types: (raw.types ?? []).map((item) => item.type),
    attributes: (raw.attributes ?? []).map((item) => item.attribute),
    descriptions: (raw.descriptions ?? [])
      .filter((item) => item.language === 'en_us')
      .map((item) => item.description),
    priorEvolutions: raw.priorEvolutions ?? [],
    nextEvolutions: raw.nextEvolutions ?? [],
  };
}

export const resolvers = {
  Query: {
    digimons: async (_parent, args) => fetchDigimons(args),
    digimon: async (_parent, { id }) => {
      const raw = await fetchDigimon(id);
      return mapDigimon(raw);
    },
    digimonByName: async (_parent, { name }) => {
      const raw = await fetchDigimon(name);
      return mapDigimon(raw);
    },
  },
};
