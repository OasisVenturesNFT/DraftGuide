// Philadelphia Eagles 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/22/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $306,684,556 | Top 51: $250,816,635
// HC: Nick Sirianni | 2025 Record: 11-6 (NFC East Champions, Won Super Bowl LIX)

const PHI_CAP = {
  capSpace: 20557388, capCeiling: 304000000,
  offenseSpend: 174398819, defenseSpend: 81104524, specialSpend: 6377000,
  activeContracts: 56,
  keyQuestions: [
    "Defending Super Bowl champs with $20.6M cap space — Howie Roseman void-year magic keeps window open",
    "$452M guaranteed money pushed into void years (most in NFL) — future cap liabilities are enormous",
    "Jalen Hurts extension + Saquon Barkley + A.J. Brown + DeVonta Smith = loaded but expensive offense",
    "Jaelan Phillips trade acquisition from Dolphins anchors edge rush; Jalen Carter emerging as elite interior DL",
    "OL coach Jeff Stoutland departed — massive loss for development pipeline; Lane Johnson aging at RT",
  ],
};

const PHI_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Jalen Hurts","Tanner McKee","Sam Howell"]},
    {pos:"RB",  players:["Saquon Barkley","Tank Bigsby","Will Shipley","A.J. Dillon"]},
    {pos:"FB",  players:["Ben VanSumeren"]},
    {pos:"LWR", players:["A.J. Brown","Darius Cooper"]},
    {pos:"RWR", players:["Jahan Dotson","Johnny Wilson"]},
    {pos:"SWR", players:["DeVonta Smith","Britain Covey"]},
    {pos:"TE",  players:["Dallas Goedert","Grant Calcaterra","Kylen Granson","Cameron Latu"]},
    {pos:"LT",  players:["Jordan Mailata","Myles Hinton"]},
    {pos:"LG",  players:["Landon Dickerson","Brett Toth"]},
    {pos:"C",   players:["Cam Jurgens","Drew Kendall","Willie Lampkin"]},
    {pos:"RG",  players:["Tyler Steen","Matt Pryor"]},
    {pos:"RT",  players:["Lane Johnson","Fred Johnson","Cameron Williams"]},
  ],
  defense: [
    {pos:"DE",   players:["Moro Ojomo"]},
    {pos:"NT",   players:["Jordan Davis","Ty Robinson"]},
    {pos:"DT",   players:["Jalen Carter","Byron Young"]},
    {pos:"LOLB", players:["Jaelan Phillips","Azeez Ojulari","Brandon Graham","Ogbo Okoronkwo"]},
    {pos:"WLB",  players:["Zack Baun","Jeremiah Trotter Jr.","Smael Mondon Jr."]},
    {pos:"MLB",  players:["Nakobe Dean","Jihaad Campbell"]},
    {pos:"ROLB", players:["Nolan Smith Jr.","Jalyx Hunt","Joshua Uche"]},
    {pos:"LCB",  players:["Quinyon Mitchell","Kelee Ringo","Jakorian Bennett"]},
    {pos:"SS",   players:["Andrew Mukuba","Sydney Brown"]},
    {pos:"FS",   players:["Reed Blankenship","Marcus Epps"]},
    {pos:"RCB",  players:["Adoree' Jackson","Mac McWilliams"]},
    {pos:"NB",   players:["Cooper DeJean","Michael Carter II"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Jake Elliott"]},
    {pos:"PT", players:["Braden Mann"]},
    {pos:"LS", players:[]},
    {pos:"H",  players:["Braden Mann"]},
    {pos:"KO", players:["Jake Elliott"]},
    {pos:"PR", players:["Britain Covey","Jahan Dotson"]},
    {pos:"KR", players:["Will Shipley","Tank Bigsby"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 3-4"},
  coaching: {hc:"Nick Sirianni",oc:"Sean Mannion",dc:"Vic Fangio",stc:"Michael Clay"},
};

export { PHI_CAP, PHI_DEPTH_CHART };
