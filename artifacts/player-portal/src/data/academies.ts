export interface AcademyConfig {
  id: number;
  key: string;
  name: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
}

export const ACADEMIES: AcademyConfig[] = [
  {
    id: 1,
    key: "birmingham-city",
    name: "Birmingham City",
    logoText: "BCFC",
    primaryColor: "#1B2D7E",
    secondaryColor: "#FFFFFF",
    welcomeMessage: "Keep Right On! Welcome to your development journey."
  },
  {
    id: 2,
    key: "chelsea",
    name: "Chelsea",
    logoText: "CFC",
    primaryColor: "#034694",
    secondaryColor: "#DBA111",
    welcomeMessage: "Welcome to Cobham. Your blue journey starts here."
  },
  {
    id: 3,
    key: "arsenal",
    name: "Arsenal",
    logoText: "AFC",
    primaryColor: "#EF0107",
    secondaryColor: "#063672",
    welcomeMessage: "Victoria Concordia Crescit. Welcome to the Arsenal family."
  },
  {
    id: 4,
    key: "liverpool",
    name: "Liverpool",
    logoText: "LFC",
    primaryColor: "#C8102E",
    secondaryColor: "#F6EB61",
    welcomeMessage: "You'll Never Walk Alone. Begin your legacy."
  },
  {
    id: 5,
    key: "manchester-city",
    name: "Manchester City",
    logoText: "MCFC",
    primaryColor: "#6CABDD",
    secondaryColor: "#1C2C5B",
    welcomeMessage: "Cityzens, your path to greatness starts today."
  },
  {
    id: 6,
    key: "manchester-united",
    name: "Manchester United",
    logoText: "MUFC",
    primaryColor: "#DA291C",
    secondaryColor: "#FBE122",
    welcomeMessage: "Welcome to Carrington. Build your United story."
  },
  {
    id: 7,
    key: "tottenham",
    name: "Tottenham Hotspur",
    logoText: "THFC",
    primaryColor: "#132257",
    secondaryColor: "#FFFFFF",
    welcomeMessage: "To Dare Is To Do. Step into your future."
  },
  {
    id: 8,
    key: "newcastle",
    name: "Newcastle United",
    logoText: "NUFC",
    primaryColor: "#241F20",
    secondaryColor: "#41B6E6",
    welcomeMessage: "Howay the Lads! Forge your path at the Academy."
  }
];
