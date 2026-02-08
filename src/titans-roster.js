// Tennessee Titans 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/02/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $221,326,966 | Top 51: $220,791,308
// HC: Robert Saleh | 2025 Record: 3-14 (Last in AFC South)

const TEN_CAP = {
  capSpace: 104769062, capCeiling: 304000000,
  offenseSpend: 121744469, defenseSpend: 99046839, specialSpend: 0,
  activeContracts: 45,
  keyQuestions: [
    "$104.8M cap space (most in NFL) + Cam Ward #3 pick = full franchise rebuild war chest",
    "New HC Robert Saleh + OC Brian Daboll + DC Gus Bradley = proven coaching overhaul",
    "Jeffery Simmons $25M cap hit anchors D-line; L'Jarius Sneed gives CB1 to build around",
    "WR room barren — Calvin Ridley + late-round rookies, massive FA/draft investment needed",
  ],
};

const TEN_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Cam Ward","Will Levis","Brandon Allen"]},
    {pos:"RB",  players:["Tony Pollard","Tyjae Spears","Kalel Mullings","Julius Chestnut"]},
    {pos:"LWR", players:["Elic Ayomanor","Van Jefferson"]},
    {pos:"RWR", players:["Calvin Ridley","Bryce Oliver"]},
    {pos:"SWR", players:["Chimere Dike","James Proche II","Mason Kinsey"]},
    {pos:"TE",  players:["Chig Okonkwo","Gunnar Helm","David Martin-Robinson"]},
    {pos:"LT",  players:["Dan Moore Jr.","Olisaemeka Udoh"]},
    {pos:"LG",  players:["Peter Skoronski","Jackson Slater","Garrett Dellinger"]},
    {pos:"C",   players:["Lloyd Cushenberry III","Corey Levin","Drew Moss"]},
    {pos:"RG",  players:["Kevin Zeitler","Blake Hance"]},
    {pos:"RT",  players:["JC Latham","Brandon Crenshaw-Dickson"]},
  ],
  defense: [
    {pos:"DE",   players:["Sebastian Joseph-Day","C.J. Ravenell"]},
    {pos:"NT",   players:["T'Vondre Sweat","Cam Horsley"]},
    {pos:"DT",   players:["Jeffery Simmons","James Lynch"]},
    {pos:"LOLB", players:["Arden Key","Jaylen Harrell","Ali Gaye"]},
    {pos:"LILB", players:["Cedric Gray","James Williams Sr.","Joe Bachie"]},
    {pos:"RILB", players:["Cody Barton","Dorian Mausi","Anfernee Orji"]},
    {pos:"ROLB", players:["Oluwafemi Oladejo","Jihad Ward","Truman Jones"]},
    {pos:"LCB",  players:["Darrell Baker Jr.","Jalyn Armour-Davis","Micah Robinson"]},
    {pos:"SS",   players:["Amani Hooker","Sanoussi Kane","Mike Brown"]},
    {pos:"FS",   players:["Xavier Woods","Kendell Brooks","Jerrick Reed II"]},
    {pos:"RCB",  players:["L'Jarius Sneed","Marcus Harris","Kaiir Elam"]},
    {pos:"NB",   players:["Kevin Winston Jr.","Kemon Hall"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Joey Slye"]},
    {pos:"PT", players:["Johnny Hekker"]},
    {pos:"LS", players:["Morgan Cox"]},
    {pos:"H",  players:["Johnny Hekker"]},
    {pos:"KO", players:["Joey Slye"]},
    {pos:"PR", players:["Chimere Dike","Mason Kinsey"]},
    {pos:"KR", players:["Chimere Dike","Julius Chestnut"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 3-4"},
  coaching: {hc:"Robert Saleh",oc:"Brian Daboll",dc:"Gus Bradley",stc:"John Fassel"},
};

export { TEN_CAP, TEN_DEPTH_CHART };
