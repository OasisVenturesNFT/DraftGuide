// Denver Broncos 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/02/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $268,871,313 | Top 51: $267,652,391
// HC: Sean Payton | 2025 Record: 10-7 (Lost AFC Championship to NE)

const DEN_CAP = {
  capSpace: 27263087, capCeiling: 304000000,
  offenseSpend: 134658214, defenseSpend: 128031941, specialSpend: 4962236,
  activeContracts: 55,
  keyQuestions: [
    "Bo Nix on rookie deal (~$5M cap) — massive QB value with $27M in cap space to build around him",
    "Lost AFC Championship to Patriots — one piece away? Payton wants to be aggressive",
    "Courtland Sutton's only WR1 on chart — need to add weapons for Nix in FA/draft",
    "Multiple option bonuses due (Allen, Sutton, Bolles, Bonitto) — exercise early for cap flexibility",
  ],
};

const DEN_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Bo Nix","Jarrett Stidham","Sam Ehlinger"]},
    {pos:"RB",  players:["J.K. Dobbins","RJ Harvey","Jaleel McLaughlin","Tyler Badie"]},
    {pos:"FB",  players:["Adam Prentice","Michael Burton"]},
    {pos:"LWR", players:["Courtland Sutton"]},
    {pos:"RWR", players:["Troy Franklin","Marvin Mims Jr."]},
    {pos:"SWR", players:["Pat Bryant","Lil'Jordan Humphrey"]},
    {pos:"TE",  players:["Adam Trautman","Evan Engram","Nate Adkins","Lucas Krull"]},
    {pos:"LT",  players:["Garett Bolles","Matt Peart"]},
    {pos:"LG",  players:["Ben Powers","Alex Palczewski"]},
    {pos:"C",   players:["Luke Wattenberg","Alex Forsyth","Sam Mustipher"]},
    {pos:"RG",  players:["Quinn Meinerz","Nick Gargiulo"]},
    {pos:"RT",  players:["Mike McGlinchey","Frank Crum"]},
  ],
  defense: [
    {pos:"LDE",  players:["Zach Allen","Jordan Jackson","Sai'vion Jones"]},
    {pos:"NT",   players:["Malcolm Roach","D.J. Jones"]},
    {pos:"RDE",  players:["John Franklin-Myers","Eyioma Uwazurike","Matt Henningsen"]},
    {pos:"LOLB", players:["Jonathon Cooper","Jonah Elliss","Que Robinson"]},
    {pos:"LILB", players:["Dre Greenlaw","Justin Strnad","Karene Reid"]},
    {pos:"RILB", players:["Alex Singleton","Drew Sanders","Jordan Turner"]},
    {pos:"ROLB", players:["Nik Bonitto","Dondrea Tillman","Johnny Walker"]},
    {pos:"LCB",  players:["Riley Moss","Jahdae Barron"]},
    {pos:"SS",   players:["Talanoa Hufanga","P.J. Locke","JL Skinner"]},
    {pos:"FS",   players:["Brandon Jones","Devon Key"]},
    {pos:"RCB",  players:["Pat Surtain II","Kris Abrams-Draine"]},
    {pos:"NB",   players:["Ja'Quan McMillian","Reese Taylor"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Wil Lutz"]},
    {pos:"PT", players:["Jeremy Crawshaw"]},
    {pos:"LS", players:["Mitchell Fraboni"]},
    {pos:"H",  players:["Jeremy Crawshaw"]},
    {pos:"KO", players:["Wil Lutz"]},
    {pos:"PR", players:["Marvin Mims Jr.","Riley Moss"]},
    {pos:"KR", players:["Marvin Mims Jr.","RJ Harvey","Tyler Badie"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 3-4"},
  coaching: {hc:"Sean Payton",oc:"Davis Webb",dc:"Vance Joseph",stc:"Darren Rizzi"},
};

export { DEN_CAP, DEN_DEPTH_CHART };
