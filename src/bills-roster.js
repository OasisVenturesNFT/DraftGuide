// Buffalo Bills 2026 Roster & Depth Chart
// SOURCES:
//   Ourlads.com depth chart (updated 01/20/2026) — SOURCE OF TRUTH for roster & depth
//   Over The Cap (overthecap.com) — team-level financial data
//
// Cap Ceiling: $304,000,000 (projected)
// Total Cap Liabilities: $319,534,072
// Top 51 Cap: $310,227,823
// Team Cap Space: -$7,449,001 (OVER THE CAP)
// Offense: $183,549,559 | Defense: $128,094,847 | Special: $7,457,500
// HC: Joe Brady (since 2026)
// 2025 Record: 13-4 (Lost AFC Championship)

const BUF_CAP = {
  capSpace: -7449001,
  capCeiling: 304000000,
  offenseSpend: 183549559,
  defenseSpend: 128094847,
  specialSpend: 7457500,
  activeContracts: 65,
  keyQuestions: [
    "Bills are ~$7.4M OVER the cap — restructures needed before league year (March 11)",
    "Josh Allen's $56.4M cap hit dominates — team built around him but flexibility constrained",
    "Joey Bosa ($22.5M cap) and Tre'Davious White added in big FA splashes — do they deliver?",
    "Dalton Kincaid 5th-year option decision by May 1 — TE room loaded with Knox, Kincaid, Hawes",
  ],
};

// Depth Chart — STRICTLY from Ourlads.com (updated 01/20/2026)
const BUF_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Josh Allen","Mitchell Trubisky"]},
    {pos:"RB",  players:["James Cook III","Ty Johnson","Ray Davis"]},
    {pos:"FB",  players:["Reggie Gilliam"]},
    {pos:"LWR", players:["Brandin Cooks","Keon Coleman","Gabe Davis"]},
    {pos:"RWR", players:["Joshua Palmer","Tyrell Shavers"]},
    {pos:"SWR", players:["Khalil Shakir","Curtis Samuel"]},
    {pos:"TE",  players:["Dawson Knox","Dalton Kincaid","Jackson Hawes","Keleki Latu"]},
    {pos:"LT",  players:["Dion Dawkins","Tylan Grable","Chase Lundt"]},
    {pos:"LG",  players:["David Edwards"]},
    {pos:"C",   players:["Connor McGovern","Sedrick Van Pran-Granger"]},
    {pos:"RG",  players:["O'Cyrus Torrence","Alec Anderson"]},
    {pos:"RT",  players:["Spencer Brown","Ryan Van Demark"]},
  ],
  defense: [
    {pos:"LDE",  players:["Greg Rousseau","Michael Hoecht","Landon Jackson"]},
    {pos:"LDT",  players:["Ed Oliver","T.J. Sanders","Larry Ogunjobi","Phidarian Mathis"]},
    {pos:"RDT",  players:["Deone Walker","DaQuan Jones","DeWayne Carter","Jordan Phillips"]},
    {pos:"RDE",  players:["Joey Bosa","A.J. Epenesa","Javon Solomon"]},
    {pos:"WLB",  players:["Matt Milano","Dorian Williams","Baylon Spector"]},
    {pos:"MLB",  players:["Terrel Bernard","Shaq Thompson","Joe Andreessen"]},
    {pos:"LCB",  players:["Christian Benford","Maxwell Hairston","Dane Jackson"]},
    {pos:"SS",   players:["Taylor Rapp","Jordan Poyer","Darnell Savage","Wande Owens"]},
    {pos:"FS",   players:["Cole Bishop","Damar Hamlin","Jordan Hancock"]},
    {pos:"RCB",  players:["Tre'Davious White","Dorian Strong","Darius Slay"]},
    {pos:"NB",   players:["Taron Johnson","Cam Lewis","Sam Franklin Jr."]},
  ],
  specialTeams: [
    {pos:"PK", players:["Tyler Bass","Matt Prater"]},
    {pos:"PT", players:["Mitch Wishnowsky"]},
    {pos:"LS", players:["Reid Ferguson"]},
    {pos:"H",  players:["Mitch Wishnowsky"]},
    {pos:"KO", players:["Tyler Bass","Matt Prater"]},
    {pos:"PR", players:["Khalil Shakir","Keon Coleman"]},
    {pos:"KR", players:["Ray Davis","Ty Johnson","Curtis Samuel"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE) — 53% usage",defense:"Base 4-2"},
  coaching: {hc:"Joe Brady",oc:"Pete Carmichael Jr.",dc:"Jim Leonhard",stc:"Jeff Rodgers"},
};

export { BUF_CAP, BUF_DEPTH_CHART };
