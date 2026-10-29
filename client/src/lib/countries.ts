import names from "./country-names.json";

export type CountryIdentity = {
  code: string;
  name: string;
};

const byId = names as Record<string, CountryIdentity>;

const byEnglishName: Record<string, CountryIdentity> = {
  Kosovo: { code: "XK", name: "Kosovo" },
  Somaliland: { code: "SOL", name: "Somaliland" },
  "N. Cyprus": { code: "NCY", name: "Chipre del Norte" },
  "Indian Ocean Ter.": { code: "IOT", name: "Territorio Británico del Océano Índico" },
  "Siachen Glacier": { code: "SIA", name: "Glaciar de Siachen" },
};

export function identifyCountry(id: string | number | undefined, englishName: string): CountryIdentity {
  if (id != null) {
    const known = byId[String(id)];
    if (known) return known;
  }
  return byEnglishName[englishName] ?? { code: englishName, name: englishName };
}
