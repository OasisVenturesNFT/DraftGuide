// Arizona Cardinals 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/16/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $287,649,592 | Top 51: $274,012,155
// HC: Mike LaFleur | 2025 Record: 5-12 (Last in NFC West)

const ARI_CAP = {
  capSpace: 42187426, capCeiling: 304000000,
  offenseSpend: 145279677, defenseSpend: 138435811, specialSpend: 0,
  activeContracts: 61,
  keyQuestions: [
    "Kyler Murray $52.7M cap hit on IR — $36.8M guaranteed salary; 5th day trigger adds $19.5M guarantee for 2027",
    "New HC Mike LaFleur after Jonathan Gannon fired — complete coaching staff overhaul with Nathaniel Hackett (OC) and Nick Rallis (DC)",
    "Walter Nolen (25/1) and Will Johnson (25/2) headline 2025 draft class injecting youth into defense",
    "Cut candidates: Murphy-Bunting ($7.2M savings), Nichols ($5.8M), Tomlinson ($9.4M), Conner ($7.6M), Davis-Gaither ($5.2M)",
    "Josh Sweat $16.4M cap hit with $17M guaranteed — locked in as edge anchor but $31.8M dead money if cut",
  ],
};

const ARI_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Jacoby Brissett","Kyler Murray","Kedon Slovis"]},
    {pos:"RB",  players:["James Conner","Trey Benson","Bam Knight","Michael Carter","Emari Demercado","Corey Kiner"]},
    {pos:"LWR", players:["Marvin Harrison Jr.","Simi Fehoko","Jalen Brooks"]},
    {pos:"RWR", players:["Zay Jones","Xavier Weaver","Tejhaun Palmer"]},
    {pos:"SWR", players:["Michael Wilson","Greg Dortch","Andre Baccellia"]},
    {pos:"TE",  players:["Trey McBride","Tip Reiman","Elijah Higgins","Travis Vokolek","Pharaoh Brown","Josiah Deguara","Rivaldo Fairweather"]},
    {pos:"LT",  players:["Paris Johnson Jr.","Josh Fryar","Demontrey Jacobs"]},
    {pos:"LG",  players:["Evan Brown","Jon Gaines II"]},
    {pos:"C",   players:["Hjalte Froholdt","Hayden Conner"]},
    {pos:"RG",  players:["Isaiah Adams","Will Hernandez"]},
    {pos:"RT",  players:["Jonah Williams","Kelvin Beachum","Christian Jones","Valentin Senn"]},
  ],
  defense: [
    {pos:"LDE",  players:["Calais Campbell","Darius Robinson","L.J. Collier"]},
    {pos:"NT",   players:["Dalvin Tomlinson","PJ Mustipher","Bilal Nichols"]},
    {pos:"RDE",  players:["Walter Nolen","Dante Stills","Zachary Carter"]},
    {pos:"LOLB", players:["Zaven Collins","Baron Browning","Jordan Burch"]},
    {pos:"WLB",  players:["Mack Wilson Sr.","Cody Simon","J.J. Russell"]},
    {pos:"MLB",  players:["Akeem Davis-Gaither","Owen Pappoe","Channing Tindall","Austin Keys"]},
    {pos:"ROLB", players:["Josh Sweat","BJ Ojulari"]},
    {pos:"LCB",  players:["Will Johnson","Starling Thomas V","Kei'Trel Clark","Elijah Jones"]},
    {pos:"SS",   players:["Jalen Thompson","Joey Blount"]},
    {pos:"FS",   players:["Budda Baker","Dadrion Taylor-Demerson","Kitan Crawford"]},
    {pos:"RCB",  players:["Denzel Burke","Sean Murphy-Bunting","Max Melton","Kalen King"]},
    {pos:"NB",   players:["Garrett Williams","Darren Hall"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Chad Ryland","Joshua Karty"]},
    {pos:"PT", players:["Blake Gillikin","Matt Haack"]},
    {pos:"LS", players:["Aaron Brewer"]},
    {pos:"H",  players:["Blake Gillikin"]},
    {pos:"KO", players:["Chad Ryland"]},
    {pos:"PR", players:["Xavier Weaver","Michael Wilson"]},
    {pos:"KR", players:["Jalen Brooks","Xavier Weaver","Emari Demercado"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 3-4"},
  coaching: {hc:"Mike LaFleur",oc:"Nathaniel Hackett",dc:"Nick Rallis",stc:"Vacant"},
};

export { ARI_CAP, ARI_DEPTH_CHART };
