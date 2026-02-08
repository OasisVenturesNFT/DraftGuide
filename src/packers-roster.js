// Green Bay Packers 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/20/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $340,601,929 | Top 51: $311,046,881
// HC: Matt LaFleur | 2025 Record: 9-7-1 (2nd NFC North, Wild Card)

const GB_CAP = {
  capSpace: -24640451, capCeiling: 304000000,
  offenseSpend: 157849803, defenseSpend: 155581147, specialSpend: 10005931,
  activeContracts: 55,
  keyQuestions: [
    "$24.6M over the cap — Elgton Jenkins ($24.3M hit) and Rashan Gary likely cut candidates to save ~$30M+",
    "No 1st-round picks for TWO years (traded for Micah Parsons) — must hit on Day 2 and Day 3",
    "Micah Parsons suffered season-ending ACL tear in Week 15 — rehab timeline critical for 2026",
    "O-line rebuild needed — lost Kenny Clark in Parsons trade, Jenkins/Gary likely gone, 3 starters potentially departing",
    "Jonathan Gannon hired as DC — transforming defense; interior D-line depth biggest hole after Clark departure",
  ],
};

const GB_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Jordan Love","Malik Willis","Desmond Ridder"]},
    {pos:"RB",  players:["Josh Jacobs","Emanuel Wilson","Chris Brooks","MarShawn Lloyd"]},
    {pos:"LWR", players:["Christian Watson","Matthew Golden","Jakobie Keeney-James"]},
    {pos:"RWR", players:["Romeo Doubs","Bo Melton"]},
    {pos:"SWR", players:["Jayden Reed","Dontayvion Wicks","Savion Williams"]},
    {pos:"TE",  players:["Tucker Kraft","John FitzPatrick","Luke Musgrave","Josh Whyle"]},
    {pos:"LT",  players:["Rasheed Walker","Darian Kinnard"]},
    {pos:"LG",  players:["Aaron Banks","Donovan Jennings","Lecitus Smith"]},
    {pos:"C",   players:["Elgton Jenkins","Jacob Monk"]},
    {pos:"RG",  players:["Sean Rhyan","Anthony Belton","John Williams"]},
    {pos:"RT",  players:["Zach Tom","Jordan Morgan","Travis Glover"]},
  ],
  defense: [
    {pos:"LDE",  players:["Rashan Gary","Kingsley Enagbare","Brenton Cox Jr.","Collin Oliver"]},
    {pos:"LDT",  players:["Karl Brooks","Warren Brinson","Jonathan Ford","Nazir Stackhouse"]},
    {pos:"RDT",  players:["Devonte Wyatt","Colby Wooden","Jordon Riley"]},
    {pos:"RDE",  players:["Micah Parsons","Lukas Van Ness","Barryn Sorrell","Arron Mosby"]},
    {pos:"WLB",  players:["Edgerrin Cooper","Isaiah McDuffie","Nick Niemann"]},
    {pos:"MLB",  players:["Quay Walker","Ty'Ron Hopper","Kristian Welch"]},
    {pos:"LCB",  players:["Keisean Nixon","Kamal Hadden","Shemar Bartholomew"]},
    {pos:"SS",   players:["Xavier McKinney","Zayne Anderson"]},
    {pos:"FS",   players:["Evan Williams","Kitan Oladapo","Johnathan Baldwin"]},
    {pos:"RCB",  players:["Carrington Valentine","Nate Hobbs","Jaylin Simpson"]},
    {pos:"NB",   players:["Javon Bullard"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Brandon McManus"]},
    {pos:"PT", players:["Daniel Whelan"]},
    {pos:"LS", players:["Matt Orzech"]},
    {pos:"H",  players:["Daniel Whelan"]},
    {pos:"KO", players:["Brandon McManus"]},
    {pos:"PR", players:["Romeo Doubs","Matthew Golden","Jayden Reed"]},
    {pos:"KR", players:["Savion Williams","Bo Melton","Keisean Nixon"]},
  ],
  scheme: {offense:"Outside Zone / RPO",defense:"Base 4-3"},
  coaching: {hc:"Matt LaFleur",oc:"Adam Stenavich",dc:"Jonathan Gannon",stc:"Rich Bisaccia"},
};

export { GB_CAP, GB_DEPTH_CHART };
