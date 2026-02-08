// Detroit Lions 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 11/26/2025), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $334,958,088 | Top 51: $327,944,798
// HC: Dan Campbell | 2025 Record: 9-8 (4th NFC North, Missed Playoffs)

const DET_CAP = {
  capSpace: -8531146, capCeiling: 304000000,
  offenseSpend: 214454833, defenseSpend: 111094631, specialSpend: 5050334,
  activeContracts: 52,
  keyQuestions: [
    "$8.5M over the cap — reflects paying young core (Goff, Sewell, St. Brown, Hutchinson extensions)",
    "Offense-heavy spending at $214M (64% of liabilities) — defense at $111M needs investment",
    "Sam LaPorta on IR (torn ACL) — recovery timeline key; Brock Wright stepped up as TE1",
    "Aidan Hutchinson returned from broken leg — full offseason to get back to elite form",
    "Back-to-back NFC North titles in 2023-24 but missed playoffs in 2025; retool window still open",
  ],
};

const DET_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Jared Goff","Kyle Allen"]},
    {pos:"RB",  players:["Jahmyr Gibbs","David Montgomery","Jacob Saylors","Sione Vaki"]},
    {pos:"LWR", players:["Kalif Raymond","Isaac TeSlaa"]},
    {pos:"RWR", players:["Jameson Williams","Tom Kennedy"]},
    {pos:"SWR", players:["Amon-Ra St. Brown","Dominic Lovett"]},
    {pos:"TE",  players:["Brock Wright","Ross Dwelley","Anthony Firkser"]},
    {pos:"LT",  players:["Taylor Decker","Dan Skipper"]},
    {pos:"LG",  players:["Kayode Awosika","Trystan Colon"]},
    {pos:"C",   players:["Frank Ragnow","Graham Glasgow","Michael Niese"]},
    {pos:"RG",  players:["Tate Ratledge","Miles Frazier"]},
    {pos:"RT",  players:["Penei Sewell"]},
  ],
  defense: [
    {pos:"LDE",  players:["Aidan Hutchinson","Al-Quadin Muhammad"]},
    {pos:"NT",   players:["DJ Reader","Roy Lopez"]},
    {pos:"DT",   players:["Alim McNeill","Tyleik Williams","Mekhi Wingo"]},
    {pos:"RDE",  players:["Marcus Davenport","Tyler Lacy","Tyrus Wheat"]},
    {pos:"WLB",  players:["Alex Anzalone","Grant Stuard"]},
    {pos:"MLB",  players:["Jack Campbell","Malcolm Rodriguez"]},
    {pos:"SLB",  players:["Derrick Barnes","Trevor Nowaske"]},
    {pos:"LCB",  players:["Terrion Arnold","Rock Ya-Sin"]},
    {pos:"SS",   players:["Brian Branch","Daniel Thomas"]},
    {pos:"FS",   players:["Kerby Joseph","Thomas Harper","Avonte Maddox"]},
    {pos:"RCB",  players:["D.J. Reed","Khalil Dorsey"]},
    {pos:"NB",   players:["Amik Robertson"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Jake Bates"]},
    {pos:"PT", players:["Jack Fox"]},
    {pos:"LS", players:["Hogan Hatten"]},
    {pos:"H",  players:["Jack Fox"]},
    {pos:"KO", players:["Jake Bates"]},
    {pos:"PR", players:["Kalif Raymond","Dominic Lovett"]},
    {pos:"KR", players:["Jacob Saylors","Kalif Raymond"]},
  ],
  scheme: {offense:"11 Personnel / Wide Zone",defense:"4-3 Under"},
  coaching: {hc:"Dan Campbell",oc:"John Morton",dc:"Kelvin Sheppard",stc:"Dave Fipp"},
};

export { DET_CAP, DET_DEPTH_CHART };
