// Los Angeles Chargers 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/16/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $224,461,544 | Top 51: $223,098,367
// HC: Jim Harbaugh | 2025 Record: 11-6 (Lost Wild Card)

const LAC_CAP = {
  capSpace: 83542941, capCeiling: 304000000,
  offenseSpend: 130460034, defenseSpend: 82993333, specialSpend: 10530000,
  activeContracts: 50,
  keyQuestions: [
    "$83.5M in cap space — 3rd most in NFL, Harbaugh has resources to build a contender",
    "Herbert's $46M cap hit is worth it — but OL needs massive investment (7 FA linemen)",
    "Khalil Mack (age 35) and Odafe Oweh both FA — pass rush identity at stake",
    "New OC Mike McDaniel replacing Greg Roman — offensive scheme overhaul incoming",
  ],
};

const LAC_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Justin Herbert","Trey Lance"]},
    {pos:"RB",  players:["Omarion Hampton","Najee Harris","Kimani Vidal","Jaret Patterson","Hassan Haskins"]},
    {pos:"FB",  players:["Scott Matlock"]},
    {pos:"LWR", players:["Quentin Johnston","Tre' Harris"]},
    {pos:"RWR", players:["Keenan Allen","KeAndre Lambert-Smith"]},
    {pos:"SWR", players:["Ladd McConkey","Derius Davis"]},
    {pos:"TE",  players:["Oronde Gadsden","Tucker Fisk","Will Dissly","Tyler Conklin"]},
    {pos:"LT",  players:["Rashawn Slater","Bobby Hart","Austin Deculus"]},
    {pos:"LG",  players:["Zion Johnson","Jamaree Salyer"]},
    {pos:"C",   players:["Bradley Bozeman","Andre James"]},
    {pos:"RG",  players:["Mekhi Becton","Trevor Penning"]},
    {pos:"RT",  players:["Joe Alt","Trey Pipkins III","Savion Washington"]},
  ],
  defense: [
    {pos:"DE",   players:["Da'Shawn Hand","Justin Eboigbe"]},
    {pos:"NT",   players:["Jamaree Caldwell","Otito Ogbonnia"]},
    {pos:"DT",   players:["Teair Tart","Josh Fuga"]},
    {pos:"LOLB", players:["Tuli Tuipulotu","Odafe Oweh"]},
    {pos:"LILB", players:["Denzel Perryman","Junior Colson","Marlowe Wax"]},
    {pos:"RILB", players:["Daiyan Henley","Troy Dye","Del'Shawn Phillips"]},
    {pos:"ROLB", players:["Khalil Mack","Bud Dupree","Kyle Kennard"]},
    {pos:"LCB",  players:["Tarheeb Still","Donte Jackson","Deane Leonard"]},
    {pos:"SS",   players:["Elijah Molden","RJ Mickens"]},
    {pos:"FS",   players:["Tony Jefferson","Kendall Williamson"]},
    {pos:"RCB",  players:["Cam Hart","Benjamin St-Juste","Eric Rogers"]},
    {pos:"NB",   players:["Derwin James Jr.","Nikko Reed","Jordan Oladokun"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Cameron Dicker"]},
    {pos:"PT", players:["JK Scott"]},
    {pos:"LS", players:["Josh Harris"]},
    {pos:"H",  players:["JK Scott"]},
    {pos:"KO", players:["Cameron Dicker"]},
    {pos:"PR", players:["Derius Davis","Tarheeb Still","Ladd McConkey"]},
    {pos:"KR", players:["Derius Davis","Hassan Haskins","KeAndre Lambert-Smith"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 3-4"},
  coaching: {hc:"Jim Harbaugh",oc:"Mike McDaniel",dc:"Chris O'Leary",stc:"Ryan Ficken"},
};

export { LAC_CAP, LAC_DEPTH_CHART };
