// Jacksonville Jaguars 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/12/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $331,439,511 | Top 51: $279,610,798
// HC: Liam Coen | 2025 Record: 4-13 (3rd in AFC South)

const JAX_CAP = {
  capSpace: -11433472, capCeiling: 304000000,
  offenseSpend: 142770825, defenseSpend: 137070376, specialSpend: 7734597,
  activeContracts: 52,
  keyQuestions: [
    "$11.4M over cap + $42M dead money = cap hell, need cuts/restructures before FA opens",
    "Trevor Lawrence $55M cap hit — massive investment in a QB coming off 4-13 season",
    "Travis Hunter #1 overall pick plays both ways — CB/WR hybrid changes roster construction",
    "New HC Liam Coen + new GM James Gladstone = full organizational reset in Jacksonville",
  ],
};

const JAX_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Trevor Lawrence","Nick Mullens"]},
    {pos:"RB",  players:["Travis Etienne Jr.","Bhayshul Tuten","LeQuint Allen Jr.","DeeJay Dallas"]},
    {pos:"LWR", players:["Brian Thomas Jr.","Tim Patrick"]},
    {pos:"RWR", players:["Jakobi Meyers","Dyami Brown","Joshua Cephus"]},
    {pos:"SWR", players:["Parker Washington","Travis Hunter"]},
    {pos:"TE",  players:["Brenton Strange","Quintin Morris","Johnny Mundt","Hunter Long"]},
    {pos:"LT",  players:["Cole Van Lanen","Walker Little"]},
    {pos:"LG",  players:["Ezra Cleveland","Cooper Hodges"]},
    {pos:"C",   players:["Robert Hainsey","Jonah Monheim"]},
    {pos:"RG",  players:["Patrick Mekari","Wyatt Milum"]},
    {pos:"RT",  players:["Anton Harrison","Chuma Edoga"]},
  ],
  defense: [
    {pos:"LDE",  players:["Travon Walker","Dawuane Smoot","B.J. Green II"]},
    {pos:"LDT",  players:["DaVon Hamilton","Austin Johnson"]},
    {pos:"RDT",  players:["Arik Armstead","Matt Dickerson","Maason Smith"]},
    {pos:"RDE",  players:["Josh Hines-Allen","Danny Striggow","Emmanuel Ogbah"]},
    {pos:"WLB",  players:["Foyesade Oluokun","Dennis Gardeck","Yasir Abdullah","Jalen McLeod"]},
    {pos:"MLB",  players:["Devin Lloyd","Ventrell Miller","Jack Kiser","Branson Combs"]},
    {pos:"LCB",  players:["Montaric Brown","Travis Hunter","Keith Taylor"]},
    {pos:"SS",   players:["Eric Murray","Antonio Johnson","Caleb Ransaw"]},
    {pos:"FS",   players:["Andrew Wingard","Rayuan Lane III"]},
    {pos:"RCB",  players:["Greg Newsome II","Christian Braswell"]},
    {pos:"NB",   players:["Jourdan Lewis","Jarrian Jones"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Cam Little"]},
    {pos:"PT", players:["Logan Cooke"]},
    {pos:"LS", players:["Ross Matiscik"]},
    {pos:"H",  players:["Logan Cooke"]},
    {pos:"KO", players:["Cam Little"]},
    {pos:"PR", players:["Parker Washington"]},
    {pos:"KR", players:["Bhayshul Tuten","LeQuint Allen Jr.","DeeJay Dallas"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"Liam Coen",oc:"Grant Udinski",dc:"Anthony Campanile",stc:"Heath Farwell"},
};

export { JAX_CAP, JAX_DEPTH_CHART };
