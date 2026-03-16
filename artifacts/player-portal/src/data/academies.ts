export interface AcademyConfig {
  id: number;
  key: string;
  name: string;
  shortName: string;
  logoText: string;
  tier: "premier-league" | "championship";
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  crestUrl?: string;
  welcomeMessage: string;
}

export const ACADEMIES: AcademyConfig[] = [

  // ── PREMIER LEAGUE ──────────────────────────────────────────────────────────

  {
    id: 1,
    key: "arsenal",
    name: "Arsenal",
    shortName: "Arsenal",
    logoText: "AFC",
    tier: "premier-league",
    primaryColor: "#EF0107",
    secondaryColor: "#FFFFFF",
    accentColor: "#063672",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    welcomeMessage: "Victoria Concordia Crescit. Welcome to the Arsenal Academy family."
  },
  {
    id: 2,
    key: "aston-villa",
    name: "Aston Villa",
    shortName: "Aston Villa",
    logoText: "AVFC",
    tier: "premier-league",
    primaryColor: "#670E36",
    secondaryColor: "#95BFE5",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/8/86/Aston_Villa_F.C._logo.svg",
    welcomeMessage: "In Preparation is Victory. Your Villa story starts here."
  },
  {
    id: 3,
    key: "bournemouth",
    name: "Bournemouth",
    shortName: "Bournemouth",
    logoText: "AFCB",
    tier: "premier-league",
    primaryColor: "#DA291C",
    secondaryColor: "#000000",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg",
    welcomeMessage: "Welcome to the Cherries Academy. Your journey on the south coast starts now."
  },
  {
    id: 4,
    key: "brentford",
    name: "Brentford",
    shortName: "Brentford",
    logoText: "BFC",
    tier: "premier-league",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    accentColor: "#000000",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg",
    welcomeMessage: "Welcome to Brentford Academy. Think differently, play boldly."
  },
  {
    id: 5,
    key: "brighton",
    name: "Brighton & Hove Albion",
    shortName: "Brighton",
    logoText: "BHAFC",
    tier: "premier-league",
    primaryColor: "#0057B8",
    secondaryColor: "#FFCD00",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg",
    welcomeMessage: "Seagulls, your development journey begins at the Amex."
  },
  {
    id: 6,
    key: "chelsea",
    name: "Chelsea",
    shortName: "Chelsea",
    logoText: "CFC",
    tier: "premier-league",
    primaryColor: "#034694",
    secondaryColor: "#DBA111",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    welcomeMessage: "Welcome to Cobham. Your blue journey starts here."
  },
  {
    id: 7,
    key: "crystal-palace",
    name: "Crystal Palace",
    shortName: "Crystal Palace",
    logoText: "CPFC",
    tier: "premier-league",
    primaryColor: "#1B458F",
    secondaryColor: "#C4122E",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg",
    welcomeMessage: "Glad All Over. Your Palace Academy story begins today."
  },
  {
    id: 8,
    key: "everton",
    name: "Everton",
    shortName: "Everton",
    logoText: "EFC",
    tier: "premier-league",
    primaryColor: "#003399",
    secondaryColor: "#FFFFFF",
    accentColor: "#BCA996",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
    welcomeMessage: "Nil Satis Nisi Optimum — nothing but the best. Welcome to Everton Academy."
  },
  {
    id: 9,
    key: "fulham",
    name: "Fulham",
    shortName: "Fulham",
    logoText: "FFC",
    tier: "premier-league",
    primaryColor: "#CC0000",
    secondaryColor: "#FFFFFF",
    accentColor: "#000000",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg",
    welcomeMessage: "Welcome to Fulham Academy. The Thames runs through our history."
  },
  {
    id: 10,
    key: "ipswich",
    name: "Ipswich Town",
    shortName: "Ipswich",
    logoText: "ITFC",
    tier: "premier-league",
    primaryColor: "#003781",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg",
    welcomeMessage: "Welcome to Portman Road. Suffolk's finest, your story starts here."
  },
  {
    id: 11,
    key: "leicester",
    name: "Leicester City",
    shortName: "Leicester",
    logoText: "LCFC",
    tier: "premier-league",
    primaryColor: "#003090",
    secondaryColor: "#FDBE11",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg",
    welcomeMessage: "Welcome to the King Power. Your Foxes journey begins."
  },
  {
    id: 12,
    key: "liverpool",
    name: "Liverpool",
    shortName: "Liverpool",
    logoText: "LFC",
    tier: "premier-league",
    primaryColor: "#C8102E",
    secondaryColor: "#F6EB61",
    accentColor: "#00B2A9",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
    welcomeMessage: "You'll Never Walk Alone. Begin your Anfield legacy."
  },
  {
    id: 13,
    key: "manchester-city",
    name: "Manchester City",
    shortName: "Man City",
    logoText: "MCFC",
    tier: "premier-league",
    primaryColor: "#6CABDD",
    secondaryColor: "#1C2C5B",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
    welcomeMessage: "Cityzens, your path to greatness starts at the City Football Academy."
  },
  {
    id: 14,
    key: "manchester-united",
    name: "Manchester United",
    shortName: "Man United",
    logoText: "MUFC",
    tier: "premier-league",
    primaryColor: "#DA291C",
    secondaryColor: "#FBE122",
    accentColor: "#000000",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
    welcomeMessage: "Welcome to Carrington. Build your United story."
  },
  {
    id: 15,
    key: "newcastle",
    name: "Newcastle United",
    shortName: "Newcastle",
    logoText: "NUFC",
    tier: "premier-league",
    primaryColor: "#241F20",
    secondaryColor: "#FFFFFF",
    accentColor: "#41B6E6",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
    welcomeMessage: "Howay the Lads! Forge your path at the Newcastle Academy."
  },
  {
    id: 16,
    key: "nottingham-forest",
    name: "Nottingham Forest",
    shortName: "Nott'm Forest",
    logoText: "NFFC",
    tier: "premier-league",
    primaryColor: "#DD0000",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg",
    welcomeMessage: "Welcome to the Garibaldi. Forest roots run deep — so will your story."
  },
  {
    id: 17,
    key: "southampton",
    name: "Southampton",
    shortName: "Southampton",
    logoText: "SCFC",
    tier: "premier-league",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    accentColor: "#130C0E",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg",
    welcomeMessage: "Welcome to Staplewood. The Saints Academy has shaped legends."
  },
  {
    id: 18,
    key: "tottenham",
    name: "Tottenham Hotspur",
    shortName: "Spurs",
    logoText: "THFC",
    tier: "premier-league",
    primaryColor: "#132257",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
    welcomeMessage: "To Dare Is To Do. Step into your Spurs future."
  },
  {
    id: 19,
    key: "west-ham",
    name: "West Ham United",
    shortName: "West Ham",
    logoText: "WHUFC",
    tier: "premier-league",
    primaryColor: "#7A263A",
    secondaryColor: "#1BB1E7",
    accentColor: "#F5D439",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
    welcomeMessage: "Forever Blowing Bubbles. Welcome to the West Ham Academy."
  },
  {
    id: 20,
    key: "wolves",
    name: "Wolverhampton Wanderers",
    shortName: "Wolves",
    logoText: "WWFC",
    tier: "premier-league",
    primaryColor: "#FDB913",
    secondaryColor: "#231F20",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
    welcomeMessage: "Welcome to the Wolves Academy. Old Gold runs through everything we do."
  },

  // ── CHAMPIONSHIP ────────────────────────────────────────────────────────────

  {
    id: 21,
    key: "birmingham-city",
    name: "Birmingham City",
    shortName: "Birmingham",
    logoText: "BCFC",
    tier: "championship",
    primaryColor: "#1B2D7E",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/6/68/Birmingham_City_FC_logo.svg",
    welcomeMessage: "Keep Right On! Welcome to your Birmingham City development journey."
  },
  {
    id: 22,
    key: "leeds",
    name: "Leeds United",
    shortName: "Leeds",
    logoText: "LUFC",
    tier: "championship",
    primaryColor: "#1D428A",
    secondaryColor: "#FFCD00",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg",
    welcomeMessage: "Marching On Together. Leeds Academy — ambition without limits."
  },
  {
    id: 23,
    key: "sunderland",
    name: "Sunderland",
    shortName: "Sunderland",
    logoText: "SAFC",
    tier: "championship",
    primaryColor: "#EB172B",
    secondaryColor: "#FFFFFF",
    accentColor: "#000000",
    welcomeMessage: "Ha'way the Lads! Sunderland Academy — built on pride and graft."
  },
  {
    id: 24,
    key: "sheffield-united",
    name: "Sheffield United",
    shortName: "Sheff United",
    logoText: "SUFC",
    tier: "championship",
    primaryColor: "#EE2737",
    secondaryColor: "#FFFFFF",
    accentColor: "#000000",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg",
    welcomeMessage: "United as One. Sheffield United Academy starts your Blades journey."
  },
  {
    id: 25,
    key: "west-brom",
    name: "West Bromwich Albion",
    shortName: "West Brom",
    logoText: "WBA",
    tier: "championship",
    primaryColor: "#122F67",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/8/8b/West_Bromwich_Albion.svg",
    welcomeMessage: "Throstle pride runs deep. West Brom Academy — your story, your chapter."
  },
  {
    id: 26,
    key: "middlesbrough",
    name: "Middlesbrough",
    shortName: "Boro",
    logoText: "MFC",
    tier: "championship",
    primaryColor: "#EE2020",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/2/2c/Middlesbrough_FC_crest.svg",
    welcomeMessage: "Boro born and Boro bred. The Riverside Academy is your launchpad."
  },
  {
    id: 27,
    key: "burnley",
    name: "Burnley",
    shortName: "Burnley",
    logoText: "BFC",
    tier: "championship",
    primaryColor: "#6C1D45",
    secondaryColor: "#99D6EA",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/6/6d/Burnley_FC_Logo.svg",
    welcomeMessage: "Clarets together. Burnley Academy — roots in the community, eyes on the top."
  },
  {
    id: 28,
    key: "norwich",
    name: "Norwich City",
    shortName: "Norwich",
    logoText: "NCFC",
    tier: "championship",
    primaryColor: "#00A650",
    secondaryColor: "#FFF200",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/1/17/Norwich_City_FC_logo.svg",
    welcomeMessage: "On the Ball City! Norwich Academy — the Canary in you is ready to fly."
  },
  {
    id: 29,
    key: "watford",
    name: "Watford",
    shortName: "Watford",
    logoText: "WFC",
    tier: "championship",
    primaryColor: "#FBEE23",
    secondaryColor: "#ED2127",
    accentColor: "#000000",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/e/e2/Watford.svg",
    welcomeMessage: "Come On You 'Orns! Watford Academy — building the future of the Hornets."
  },
  {
    id: 30,
    key: "coventry",
    name: "Coventry City",
    shortName: "Coventry",
    logoText: "CCFC",
    tier: "championship",
    primaryColor: "#59CBE8",
    secondaryColor: "#FFFFFF",
    accentColor: "#034694",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/7/7b/Coventry_City_FC_crest.svg",
    welcomeMessage: "Sky Blue Army! Coventry Academy — your journey in sky blue."
  },
  {
    id: 31,
    key: "sheffield-wednesday",
    name: "Sheffield Wednesday",
    shortName: "Sheff Wed",
    logoText: "SWFC",
    tier: "championship",
    primaryColor: "#0066B3",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/a/a5/Sheffield_Wednesday.svg",
    welcomeMessage: "Owls forever. Sheffield Wednesday Academy — wise players, bold futures."
  },
  {
    id: 32,
    key: "blackburn",
    name: "Blackburn Rovers",
    shortName: "Blackburn",
    logoText: "BRFC",
    tier: "championship",
    primaryColor: "#009EE0",
    secondaryColor: "#FFFFFF",
    accentColor: "#EF3829",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg",
    welcomeMessage: "Rovers forever. Blackburn Academy — blue and white, through and through."
  },
  {
    id: 33,
    key: "stoke",
    name: "Stoke City",
    shortName: "Stoke",
    logoText: "SCFC",
    tier: "championship",
    primaryColor: "#E03A3E",
    secondaryColor: "#FFFFFF",
    accentColor: "#1B2F6B",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/2/29/Stoke_City_FC.svg",
    welcomeMessage: "Delilah! Stoke City Academy — Potteries grit, Premier League ambition."
  },
  {
    id: 34,
    key: "hull",
    name: "Hull City",
    shortName: "Hull",
    logoText: "HCAFC",
    tier: "championship",
    primaryColor: "#F5A12D",
    secondaryColor: "#231F20",
    welcomeMessage: "Tigers together. Hull City Academy — amber and black, building your story."
  },
  {
    id: 35,
    key: "cardiff",
    name: "Cardiff City",
    shortName: "Cardiff",
    logoText: "CCFC",
    tier: "championship",
    primaryColor: "#0070B5",
    secondaryColor: "#FFFFFF",
    accentColor: "#D4011D",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/3/3c/Cardiff_City_crest.svg",
    welcomeMessage: "Bluebirds rising. Cardiff Academy — your story in the Welsh capital."
  },
  {
    id: 36,
    key: "derby",
    name: "Derby County",
    shortName: "Derby",
    logoText: "DCFC",
    tier: "championship",
    primaryColor: "#FFFFFF",
    secondaryColor: "#241F21",
    accentColor: "#B1B3B3",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/Derby_County_crest.svg",
    welcomeMessage: "Pride of the Midlands. Derby Academy — your Ram story begins."
  },
  {
    id: 37,
    key: "millwall",
    name: "Millwall",
    shortName: "Millwall",
    logoText: "MFC",
    tier: "championship",
    primaryColor: "#001D5E",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/7/71/Millwall_FC_logo.png",
    welcomeMessage: "No One Likes Us, We Don't Care. Millwall Academy — lion-hearted players."
  },
  {
    id: 38,
    key: "luton",
    name: "Luton Town",
    shortName: "Luton",
    logoText: "LTFC",
    tier: "championship",
    primaryColor: "#F78F1E",
    secondaryColor: "#001F5B",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/9/9d/Luton_Town_logo.svg",
    welcomeMessage: "Come On You Hatters! Luton Academy — keep on keeping on."
  },
  {
    id: 39,
    key: "qpr",
    name: "Queens Park Rangers",
    shortName: "QPR",
    logoText: "QPR",
    tier: "championship",
    primaryColor: "#1D5BA4",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/3/31/Queens_Park_Rangers_crest.svg",
    welcomeMessage: "QPR Academy — Hoops ambition, no limits."
  },
  {
    id: 40,
    key: "bristol-city",
    name: "Bristol City",
    shortName: "Bristol City",
    logoText: "BCFC",
    tier: "championship",
    primaryColor: "#E00000",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/f/f5/Bristol_City_crest.svg",
    welcomeMessage: "Seize The Day. Bristol City Academy — the city's red heart beats for you."
  },
  {
    id: 41,
    key: "swansea",
    name: "Swansea City",
    shortName: "Swansea",
    logoText: "SCAFC",
    tier: "championship",
    primaryColor: "#121212",
    secondaryColor: "#FFFFFF",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/f/f9/Swansea_City_AFC_logo.svg",
    welcomeMessage: "Swans together. Swansea City Academy — your Welsh journey on the Liberty."
  },
  {
    id: 42,
    key: "portsmouth",
    name: "Portsmouth",
    shortName: "Portsmouth",
    logoText: "PFC",
    tier: "championship",
    primaryColor: "#001489",
    secondaryColor: "#FFFFFF",
    accentColor: "#C8102E",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/Portsmouth_FC_logo.svg",
    welcomeMessage: "Play Up Pompey! Portsmouth Academy — Fratton spirit in every step."
  }
];

export const PREMIER_LEAGUE = ACADEMIES.filter(a => a.tier === "premier-league");
export const CHAMPIONSHIP = ACADEMIES.filter(a => a.tier === "championship");
