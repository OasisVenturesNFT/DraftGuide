// Tampa Bay Buccaneers 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/12/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $294,392,664 | Top 51: $293,252,073
// HC: Todd Bowles | 2025 Record: 8-9 (2nd NFC South, Missed Playoffs)

const TB_CAP = {
  capSpace: 23828710, capCeiling: 304000000,
  offenseSpend: 184494501, defenseSpend: 102842572, specialSpend: 6800000,
  activeContracts: 49,
  keyQuestions: [
    "$23.8M cap space — functional flexibility but Baker Mayfield $39M cap hit in final year of deal",
    "Mike Evans, Cade Otton, Lavonte David, Haason Reddick, Jamel Dean all UFAs — massive turnover looming",
    "Emeka Egbuka (25/1) drafted as Evans succession plan; Rachaad White says he's done in TB",
    "Todd Bowles survived despite first playoff miss — won 3 straight division titles before 2025",
    "Defense needs investment at $102.8M (35% of liabilities) — edge rush and LB depth thin behind starters",
  ],
};

const TB_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Baker Mayfield","Teddy Bridgewater","Connor Bazelak"]},
    {pos:"RB",  players:["Bucky Irving","Rachaad White","Sean Tucker"]},
    {pos:"LWR", players:["Mike Evans","Jalen McMillan","Jaden Smith"]},
    {pos:"RWR", players:["Emeka Egbuka","Tez Johnson"]},
    {pos:"SWR", players:["Chris Godwin Jr.","Kameron Johnson","Sterling Shepard"]},
    {pos:"TE",  players:["Cade Otton","Payne Durham","Ko Kieft","Devin Culp"]},
    {pos:"LT",  players:["Tristan Wirfs","Benjamin Chukwuma"]},
    {pos:"LG",  players:["Ben Bredeson","Mike Jordan"]},
    {pos:"C",   players:["Graham Barton","Elijah Klein"]},
    {pos:"RG",  players:["Cody Mauch","Dan Feeney","Luke Haggard"]},
    {pos:"RT",  players:["Luke Goedeke","Charlie Heck"]},
  ],
  defense: [
    {pos:"LDE",  players:["Logan Hall","Elijah Roberts"]},
    {pos:"NT",   players:["Vita Vea","Elijah Simmons"]},
    {pos:"RDE",  players:["Calijah Kancey","Greg Gaines"]},
    {pos:"LOLB", players:["Haason Reddick","Anthony Nelson","Markees Watts"]},
    {pos:"LILB", players:["Lavonte David","Anthony Walker Jr."]},
    {pos:"RILB", players:["SirVocea Dennis","Deion Jones"]},
    {pos:"ROLB", players:["Yaya Diaby","Chris Braswell","David Walker"]},
    {pos:"LCB",  players:["Zyon McCollum","Kindle Vildor","Josh Hayes"]},
    {pos:"SS",   players:["Tykee Smith","J.T. Gray"]},
    {pos:"FS",   players:["Antoine Winfield Jr.","Rashad Wisdom"]},
    {pos:"RCB",  players:["Jamel Dean","Benjamin Morrison"]},
    {pos:"NB",   players:["Jacob Parrish","Christian Izien","JJ Roberts"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Chase McLaughlin"]},
    {pos:"PT", players:["Riley Dixon"]},
    {pos:"LS", players:["Evan Deckers"]},
    {pos:"H",  players:["Riley Dixon"]},
    {pos:"KO", players:["Chase McLaughlin"]},
    {pos:"PR", players:["Kameron Johnson","Tez Johnson"]},
    {pos:"KR", players:["Sean Tucker","Kameron Johnson"]},
  ],
  scheme: {offense:"Spread (Arians Tree)",defense:"3-4 Two-Gap"},
  coaching: {hc:"Todd Bowles",oc:"Zac Robinson",dc:"Todd Bowles",stc:"Danny Smith"},
};

export { TB_CAP, TB_DEPTH_CHART };
