// Carolina Panthers 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/19/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $300,530,667 | Top 51: $288,819,573
// HC: Dave Canales | 2025 Record: 8-9 (Won NFC South via tiebreaker, Lost Wild Card)

const CAR_CAP = {
  capSpace: 11147004, capCeiling: 304000000,
  offenseSpend: 145315023, defenseSpend: 144864550, specialSpend: 1010000,
  activeContracts: 52,
  keyQuestions: [
    "$11.1M cap space plus ~$24M rollover gives ~$35M effective; healthy position for continued build",
    "Bryce Young 5th-year option decision looming ($26M+ in 2027) — improved in Year 3 but not elite",
    "Ikem Ekwonu $17.5M 5th-year option but ruptured patellar tendon — may not play in 2026",
    "Tetairoa McMillan (25/1) and Nic Scourton (25/2) — premium draft picks hitting immediately",
    "First NFC South title since 2015 — playoff experience and culture shift under Canales",
  ],
};

const CAR_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Bryce Young","Andy Dalton"]},
    {pos:"RB",  players:["Chuba Hubbard","Rico Dowdle","Jonathon Brooks","Trevor Etienne"]},
    {pos:"LWR", players:["Tetairoa McMillan","David Moore"]},
    {pos:"RWR", players:["Xavier Legette","Brycen Tremayne"]},
    {pos:"SWR", players:["Jalen Coker","Jimmy Horn Jr."]},
    {pos:"TE",  players:["Tommy Tremble","Ja'Tavion Sanders","Mitchell Evans","James Mitchell"]},
    {pos:"LT",  players:["Ikem Ekwonu","Yosh Nijman"]},
    {pos:"LG",  players:["Damien Lewis","Austin Corbett"]},
    {pos:"C",   players:["Cade Mays","Nick Samac"]},
    {pos:"RG",  players:["Robert Hunt","Chandler Zavala","Jake Curhan"]},
    {pos:"RT",  players:["Taylor Moton","Brady Christensen"]},
  ],
  defense: [
    {pos:"LDE",  players:["Derrick Brown","Bobby Brown III"]},
    {pos:"NT",   players:["A'Shawn Robinson","Cam Jackson","Popo Aumavae"]},
    {pos:"RDE",  players:["Tershawn Wharton","LaBryan Ray","Jared Harrison-Hunte"]},
    {pos:"LOLB", players:["Nic Scourton","Patrick Jones II","Trevis Gipson"]},
    {pos:"LILB", players:["Trevin Wallace","Claudin Cherelus","Bam Martin-Scott","Isaiah Simmons"]},
    {pos:"RILB", players:["Christian Rozeboom","Krys Barnes","Maema Njongmeta"]},
    {pos:"ROLB", players:["D.J. Wonnum","Princely Umanmielen","Thomas Incoom"]},
    {pos:"LCB",  players:["Mike Jackson","Damarri Mathis","Robert Rochell"]},
    {pos:"SS",   players:["Tre'von Moehrig"]},
    {pos:"FS",   players:["Nick Scott","Lathan Ransom"]},
    {pos:"RCB",  players:["Jaycee Horn","Akayleb Evans"]},
    {pos:"NB",   players:["Chau Smith-Wade","Corey Thornton"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Ryan Fitzgerald"]},
    {pos:"PT", players:["Sam Martin"]},
    {pos:"LS", players:["JJ Jansen"]},
    {pos:"H",  players:["Sam Martin"]},
    {pos:"KO", players:["Ryan Fitzgerald"]},
    {pos:"PR", players:["Trevor Etienne","David Moore","Brycen Tremayne"]},
    {pos:"KR", players:["Trevor Etienne","Chuba Hubbard","Rico Dowdle"]},
  ],
  scheme: {offense:"West Coast / Play Action",defense:"3-4 Multiple"},
  coaching: {hc:"Dave Canales",oc:"Brad Idzik",dc:"Ejiro Evero",stc:"Tracy Smith"},
};

export { CAR_CAP, CAR_DEPTH_CHART };
