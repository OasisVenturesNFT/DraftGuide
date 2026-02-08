// Miami Dolphins 2026 Roster & Depth Chart
// SOURCES:
//   Ourlads.com depth chart (updated 02/06/2026) — SOURCE OF TRUTH for roster & depth
//   Over The Cap (overthecap.com) — team-level financial data
//
// Cap Ceiling: $304,000,000 (projected)
// Total Cap Liabilities: $328,117,560
// Top 51 Cap: $291,731,923
// Team Cap Space: -$30,511,554 (OVER THE CAP)
// Offense: $186,200,073 | Defense: $101,835,350 | Special: $4,581,500
// HC: Jeff Hafley (since 2026)
// 2025 Record: 5-12 (3rd in AFC East)

const MIA_CAP = {
  capSpace: -30511554,
  capCeiling: 304000000,
  offenseSpend: 186200073,
  defenseSpend: 101835350,
  specialSpend: 4581500,
  activeContracts: 62,
  keyQuestions: [
    "Dolphins are ~$30.5M OVER the cap — most aggressive cuts/restructures needed in AFC East",
    "Tyreek Hill's $51M cap hit likely forces release — saves $22.9M pre-June 1 or $35.2M post-June 1",
    "Tua Tagovailoa's $56.4M cap hit — cutting him INCREASES dead money; trade or restructure only",
    "New HC Jeff Hafley inherits cap mess — Quinn Ewers drafted as potential QB transition plan",
  ],
};

// Depth Chart — STRICTLY from Ourlads.com (updated 02/06/2026)
const MIA_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Quinn Ewers","Zach Wilson","Tua Tagovailoa","Cam Miller"]},
    {pos:"RB",  players:["De'Von Achane","Jaylen Wright","Ollie Gordon II","Alexander Mattison","Donovan Edwards"]},
    {pos:"FB",  players:["Alec Ingold"]},
    {pos:"LWR", players:["Jaylen Waddle","Nick Westbrook-Ikhine","Dee Eskridge"]},
    {pos:"RWR", players:["Tyreek Hill","Cedrick Wilson Jr.","Theo Wease Jr."]},
    {pos:"SWR", players:["Malik Washington","Tahj Washington"]},
    {pos:"TE",  players:["Darren Waller","Julian Hill","Greg Dulcich","Jalin Conyers"]},
    {pos:"LT",  players:["Patrick Paul","Kendall Lamm","Germain Ifedi","Obinna Eze"]},
    {pos:"LG",  players:["Jonah Savaiinaea","Daniel Brunskill"]},
    {pos:"C",   players:["Aaron Brewer","Andrew Meyer"]},
    {pos:"RG",  players:["James Daniels","Cole Strange","Liam Eichenberg"]},
    {pos:"RT",  players:["Austin Jackson","Larry Borom","Yodny Cajuste"]},
  ],
  defense: [
    {pos:"LDE",  players:["Kenneth Grant","Zeek Biggers"]},
    {pos:"NT",   players:["Jordan Phillips","Benito Jones"]},
    {pos:"RDE",  players:["Zach Sieler","Matthew Butler"]},
    {pos:"LOLB", players:["Chop Robinson","Quinton Bell"]},
    {pos:"LILB", players:["Jordyn Brooks","Willie Gay Jr.","Jackson Woodard"]},
    {pos:"RILB", players:["Tyrel Dodson","K.J. Britt","Caleb Johnson"]},
    {pos:"ROLB", players:["Bradley Chubb","Cameron Goode"]},
    {pos:"LCB",  players:["Rasul Douglas","Jack Jones","A.J. Green III","Isaiah Johnson"]},
    {pos:"SS",   players:["Ashtyn Davis","Ifeatu Melifonwu","Jordan Colbert"]},
    {pos:"FS",   players:["Minkah Fitzpatrick","Dante Trader Jr.","Elijah Campbell"]},
    {pos:"RCB",  players:["Storm Duck","JuJu Brents","Ethan Bonner"]},
    {pos:"NB",   players:["Kader Kohou","Jason Marshall Jr.","Artie Burns","Ethan Robinson","Jason Maitre"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Jason Sanders","Riley Patterson"]},
    {pos:"PT", players:["Jake Bailey"]},
    {pos:"LS", players:["Joe Cardona"]},
    {pos:"H",  players:["Jake Bailey"]},
    {pos:"KO", players:["Jason Sanders","Riley Patterson"]},
    {pos:"PR", players:["Malik Washington","Tahj Washington"]},
    {pos:"KR", players:["Malik Washington","Ollie Gordon II"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 3-4"},
  coaching: {hc:"Jeff Hafley",oc:"Bobby Slowik",dc:"Sean Duggan",stc:"Chris Tabor"},
};

export { MIA_CAP, MIA_DEPTH_CHART };
