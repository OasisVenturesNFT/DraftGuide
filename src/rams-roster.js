// Los Angeles Rams 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/23/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $268,528,736 | Top 51: $266,058,212
// HC: Sean McVay | 2025 Record: 12-5 (2nd in NFC West, lost in Divisional Round)

const LAR_CAP = {
  capSpace: 48214355, capCeiling: 304000000,
  offenseSpend: 189343186, defenseSpend: 74853026, specialSpend: 3632000,
  activeContracts: 52,
  keyQuestions: [
    "Puka Nacua extension is top priority — coming off All-Pro season, currently on rookie deal",
    "Matthew Stafford ($49.5M cap hit) in final year — retirement or one more run at age 38?",
    "Massive offensive spending ($189.3M) vs. defense ($74.9M) — defensive investment needed",
    "Cut candidates: Colby Parkinson ($7M savings), Darious Williams ($7.5M), Kevin Dotson ($16M savings)",
    "Two first-round picks in 2026 draft — elite capital to reload roster around young core",
  ],
};

const LAR_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Matthew Stafford","Jimmy Garoppolo","Stetson Bennett IV"]},
    {pos:"RB",  players:["Kyren Williams","Blake Corum","Ronnie Rivers","Jarquez Hunter"]},
    {pos:"LWR", players:["Davante Adams","Konata Mumpfield"]},
    {pos:"RWR", players:["Puka Nacua","Tutu Atwell"]},
    {pos:"SWR", players:["Jordan Whittington","Xavier Smith"]},
    {pos:"TE",  players:["Colby Parkinson","Terrance Ferguson","Tyler Higbee","Davis Allen","Nick Vannett"]},
    {pos:"LT",  players:["Alaric Jackson","D.J. Humphries"]},
    {pos:"LG",  players:["Steve Avila"]},
    {pos:"C",   players:["Coleman Shelton","Beaux Limmer"]},
    {pos:"RG",  players:["Kevin Dotson","Justin Dedich"]},
    {pos:"RT",  players:["Warren McClendon Jr.","David Quessenberry"]},
  ],
  defense: [
    {pos:"DE",   players:["Braden Fiske","Desjuan Johnson"]},
    {pos:"NT",   players:["Poona Ford","Tyler Davis"]},
    {pos:"DT",   players:["Kobie Turner","Ty Hamilton"]},
    {pos:"LOLB", players:["Byron Young","Josaiah Stewart"]},
    {pos:"LILB", players:["Nate Landman"]},
    {pos:"RILB", players:["Omar Speights","Troy Reeder"]},
    {pos:"ROLB", players:["Jared Verse","Nick Hampton"]},
    {pos:"LCB",  players:["Cobie Durant","Roger McCreary"]},
    {pos:"SS",   players:["Kam Curl"]},
    {pos:"FS",   players:["Kamren Kinchens","Jaylen McCollough"]},
    {pos:"RCB",  players:["Emmanuel Forbes Jr.","Darious Williams"]},
    {pos:"NB",   players:["Quentin Lake","Josh Wallace","Derion Kendrick"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Harrison Mevis"]},
    {pos:"PT", players:["Ethan Evans"]},
    {pos:"LS", players:["Jake McQuaide"]},
    {pos:"H",  players:["Ethan Evans"]},
    {pos:"KO", players:["Harrison Mevis"]},
    {pos:"PR", players:["Xavier Smith","Kyren Williams"]},
    {pos:"KR", players:["Ronnie Rivers","Jordan Whittington"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 3-4"},
  coaching: {hc:"Sean McVay",oc:"Mike LaFleur",dc:"Chris Shula",stc:"Ben Kotwica (interim)"},
};

export { LAR_CAP, LAR_DEPTH_CHART };
