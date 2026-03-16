import { db } from "@workspace/db";
import { academiesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const ACADEMY_SEED_DATA = [
  { key: "arsenal", name: "Arsenal", logoText: "AFC", primaryColor: "#EF0107", secondaryColor: "#FFFFFF", welcomeMessage: "Victoria Concordia Crescit. Welcome to the Arsenal Academy family." },
  { key: "aston-villa", name: "Aston Villa", logoText: "AVFC", primaryColor: "#670E36", secondaryColor: "#95BFE5", welcomeMessage: "In Preparation is Victory. Your Villa story starts here." },
  { key: "bournemouth", name: "Bournemouth", logoText: "AFCB", primaryColor: "#DA291C", secondaryColor: "#000000", welcomeMessage: "Welcome to the Cherries Academy. Your journey on the south coast starts now." },
  { key: "brentford", name: "Brentford", logoText: "BFC", primaryColor: "#E30613", secondaryColor: "#FFFFFF", welcomeMessage: "Welcome to Brentford Academy. Think differently, play boldly." },
  { key: "brighton", name: "Brighton & Hove Albion", logoText: "BHAFC", primaryColor: "#0057B8", secondaryColor: "#FFCD00", welcomeMessage: "Seagulls, your development journey begins at the Amex." },
  { key: "chelsea", name: "Chelsea", logoText: "CFC", primaryColor: "#034694", secondaryColor: "#DBA111", welcomeMessage: "Welcome to Cobham. Your blue journey starts here." },
  { key: "crystal-palace", name: "Crystal Palace", logoText: "CPFC", primaryColor: "#1B458F", secondaryColor: "#C4122E", welcomeMessage: "Glad All Over. Your Palace Academy story begins today." },
  { key: "everton", name: "Everton", logoText: "EFC", primaryColor: "#003399", secondaryColor: "#FFFFFF", welcomeMessage: "Nil Satis Nisi Optimum — nothing but the best. Welcome to Everton Academy." },
  { key: "fulham", name: "Fulham", logoText: "FFC", primaryColor: "#CC0000", secondaryColor: "#FFFFFF", welcomeMessage: "Welcome to Fulham Academy. The Thames runs through our history." },
  { key: "ipswich", name: "Ipswich Town", logoText: "ITFC", primaryColor: "#003781", secondaryColor: "#FFFFFF", welcomeMessage: "Welcome to Portman Road. Suffolk's finest, your story starts here." },
  { key: "leicester", name: "Leicester City", logoText: "LCFC", primaryColor: "#003090", secondaryColor: "#FDBE11", welcomeMessage: "Welcome to the King Power. Your Foxes journey begins." },
  { key: "liverpool", name: "Liverpool", logoText: "LFC", primaryColor: "#C8102E", secondaryColor: "#F6EB61", welcomeMessage: "You'll Never Walk Alone. Begin your Anfield legacy." },
  { key: "manchester-city", name: "Manchester City", logoText: "MCFC", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B", welcomeMessage: "Cityzens, your path to greatness starts at the City Football Academy." },
  { key: "manchester-united", name: "Manchester United", logoText: "MUFC", primaryColor: "#DA291C", secondaryColor: "#FBE122", welcomeMessage: "Welcome to Carrington. Build your United story." },
  { key: "newcastle", name: "Newcastle United", logoText: "NUFC", primaryColor: "#241F20", secondaryColor: "#FFFFFF", welcomeMessage: "Howay the Lads! Forge your path at the Newcastle Academy." },
  { key: "nottingham-forest", name: "Nottingham Forest", logoText: "NFFC", primaryColor: "#DD0000", secondaryColor: "#FFFFFF", welcomeMessage: "Welcome to the Garibaldi. Forest roots run deep — so will your story." },
  { key: "southampton", name: "Southampton", logoText: "SCFC", primaryColor: "#D71920", secondaryColor: "#FFFFFF", welcomeMessage: "Welcome to Staplewood. The Saints Academy has shaped legends." },
  { key: "tottenham", name: "Tottenham Hotspur", logoText: "THFC", primaryColor: "#132257", secondaryColor: "#FFFFFF", welcomeMessage: "To Dare Is To Do. Step into your Spurs future." },
  { key: "west-ham", name: "West Ham United", logoText: "WHUFC", primaryColor: "#7A263A", secondaryColor: "#1BB1E7", welcomeMessage: "Forever Blowing Bubbles. Welcome to the West Ham Academy." },
  { key: "wolves", name: "Wolverhampton Wanderers", logoText: "WWFC", primaryColor: "#FDB913", secondaryColor: "#231F20", welcomeMessage: "Welcome to the Wolves Academy. Old Gold runs through everything we do." },
  { key: "birmingham-city", name: "Birmingham City", logoText: "BCFC", primaryColor: "#1B2D7E", secondaryColor: "#FFFFFF", welcomeMessage: "Keep Right On! Welcome to your Birmingham City development journey." },
  { key: "leeds", name: "Leeds United", logoText: "LUFC", primaryColor: "#1D428A", secondaryColor: "#FFCD00", welcomeMessage: "Marching On Together. Leeds Academy — ambition without limits." },
  { key: "sunderland", name: "Sunderland", logoText: "SAFC", primaryColor: "#EB172B", secondaryColor: "#FFFFFF", welcomeMessage: "Ha'way the Lads! Sunderland Academy — built on pride and graft." },
  { key: "sheffield-united", name: "Sheffield United", logoText: "SUFC", primaryColor: "#EE2737", secondaryColor: "#FFFFFF", welcomeMessage: "United as One. Sheffield United Academy starts your Blades journey." },
  { key: "west-brom", name: "West Bromwich Albion", logoText: "WBA", primaryColor: "#122F67", secondaryColor: "#FFFFFF", welcomeMessage: "Throstle pride runs deep. West Brom Academy — your story, your chapter." },
  { key: "middlesbrough", name: "Middlesbrough", logoText: "MFC", primaryColor: "#EE2020", secondaryColor: "#FFFFFF", welcomeMessage: "Boro born and Boro bred. The Riverside Academy is your launchpad." },
  { key: "burnley", name: "Burnley", logoText: "BFC", primaryColor: "#6C1D45", secondaryColor: "#99D6EA", welcomeMessage: "Clarets together. Burnley Academy — roots in the community, eyes on the top." },
  { key: "norwich", name: "Norwich City", logoText: "NCFC", primaryColor: "#00A650", secondaryColor: "#FFF200", welcomeMessage: "On the Ball City! Norwich Academy — the Canary in you is ready to fly." },
  { key: "watford", name: "Watford", logoText: "WFC", primaryColor: "#FBEE23", secondaryColor: "#ED2127", welcomeMessage: "Come On You 'Orns! Watford Academy — building the future of the Hornets." },
  { key: "coventry", name: "Coventry City", logoText: "CCFC", primaryColor: "#59CBE8", secondaryColor: "#FFFFFF", welcomeMessage: "Sky Blue Army! Coventry Academy — your journey in sky blue." },
  { key: "sheffield-wednesday", name: "Sheffield Wednesday", logoText: "SWFC", primaryColor: "#0066B3", secondaryColor: "#FFFFFF", welcomeMessage: "Owls forever. Sheffield Wednesday Academy — wise players, bold futures." },
  { key: "blackburn", name: "Blackburn Rovers", logoText: "BRFC", primaryColor: "#009EE0", secondaryColor: "#FFFFFF", welcomeMessage: "Rovers forever. Blackburn Academy — blue and white, through and through." },
  { key: "stoke", name: "Stoke City", logoText: "SCFC", primaryColor: "#E03A3E", secondaryColor: "#FFFFFF", welcomeMessage: "Delilah! Stoke City Academy — Potteries grit, Premier League ambition." },
  { key: "hull", name: "Hull City", logoText: "HCAFC", primaryColor: "#F5A12D", secondaryColor: "#231F20", welcomeMessage: "Tigers together. Hull City Academy — amber and black, building your story." },
  { key: "cardiff", name: "Cardiff City", logoText: "CCFC", primaryColor: "#0070B5", secondaryColor: "#FFFFFF", welcomeMessage: "Bluebirds rising. Cardiff Academy — your story in the Welsh capital." },
  { key: "derby", name: "Derby County", logoText: "DCFC", primaryColor: "#FFFFFF", secondaryColor: "#241F21", welcomeMessage: "Pride of the Midlands. Derby Academy — your Ram story begins." },
  { key: "millwall", name: "Millwall", logoText: "MFC", primaryColor: "#001D5E", secondaryColor: "#FFFFFF", welcomeMessage: "No One Likes Us, We Don't Care. Millwall Academy — lion-hearted players." },
  { key: "luton", name: "Luton Town", logoText: "LTFC", primaryColor: "#F78F1E", secondaryColor: "#001F5B", welcomeMessage: "Come On You Hatters! Luton Academy — keep on keeping on." },
  { key: "qpr", name: "Queens Park Rangers", logoText: "QPR", primaryColor: "#1D5BA4", secondaryColor: "#FFFFFF", welcomeMessage: "QPR Academy — Hoops ambition, no limits." },
  { key: "bristol-city", name: "Bristol City", logoText: "BCFC", primaryColor: "#E00000", secondaryColor: "#FFFFFF", welcomeMessage: "Seize The Day. Bristol City Academy — the city's red heart beats for you." },
  { key: "swansea", name: "Swansea City", logoText: "SCAFC", primaryColor: "#121212", secondaryColor: "#FFFFFF", welcomeMessage: "Swans together. Swansea City Academy — your Welsh journey on the Liberty." },
  { key: "portsmouth", name: "Portsmouth", logoText: "PFC", primaryColor: "#001489", secondaryColor: "#FFFFFF", welcomeMessage: "Play Up Pompey! Portsmouth Academy — Fratton spirit in every step." },
];

export async function seedAcademies() {
  try {
    for (const academy of ACADEMY_SEED_DATA) {
      const existing = await db
        .select({ id: academiesTable.id })
        .from(academiesTable)
        .where(eq(academiesTable.key, academy.key))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(academiesTable).values(academy);
        console.log(`[seed] Inserted academy: ${academy.name}`);
      }
    }
    console.log(`[seed] Academies seeded (${ACADEMY_SEED_DATA.length} total)`);
  } catch (err) {
    console.error("[seed] Failed to seed academies:", err);
  }
}
