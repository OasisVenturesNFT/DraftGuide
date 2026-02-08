// Houston Texans 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/05/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $310,308,441 | Top 51: $289,385,661
// HC: DeMeco Ryans | 2025 Record: 10-7 (Won Super Bowl LX)

const HOU_CAP = {
  capSpace: -10808358, capCeiling: 304000000,
  offenseSpend: 144309127, defenseSpend: 137060090, specialSpend: 8016444,
  activeContracts: 57,
  keyQuestions: [
    "$10.8M over cap — Super Bowl champs face roster retention crunch, need restructures",
    "C.J. Stroud extension looming — still on rookie deal but 5th-year option coming, best value QB in NFL",
    "Will Anderson Jr. + Danielle Hunter = elite edge duo, but Hunter is 31 on big deal",
    "Nico Collins $28M/yr + Jayden Higgins rookie deal = WR room set; OL depth a concern",
  ],
};

const HOU_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["C.J. Stroud","Davis Mills","Graham Mertz"]},
    {pos:"RB",  players:["Woody Marks","Nick Chubb","Dare Ogunbowale","Jawhar Jordan","Joe Mixon"]},
    {pos:"FB",  players:["British Brooks"]},
    {pos:"LWR", players:["Nico Collins","Xavier Hutchinson","Juwann Winfree"]},
    {pos:"RWR", players:["Jayden Higgins","Tank Dell","Justin Watson"]},
    {pos:"SWR", players:["Christian Kirk","Jaylin Noel","Braxton Berrios"]},
    {pos:"TE",  players:["Dalton Schultz","Cade Stover","Harrison Bryant","Brevin Jordan"]},
    {pos:"LT",  players:["Aireontae Ersery","Blake Fisher"]},
    {pos:"LG",  players:["Tytus Howard","Jarrett Patterson"]},
    {pos:"C",   players:["Jake Andrews","Juice Scruggs"]},
    {pos:"RG",  players:["Ed Ingram","Jarrett Kingston"]},
    {pos:"RT",  players:["Trent Brown"]},
  ],
  defense: [
    {pos:"LDE",  players:["Will Anderson Jr.","Denico Autry","Dylan Horton"]},
    {pos:"LDT",  players:["Sheldon Rankins","Mario Edwards Jr.","Kurt Hinish","Naquan Jones"]},
    {pos:"RDT",  players:["Tim Settle Jr.","Tommy Togiai","Folorunso Fatukasi","Kyonte Hamilton"]},
    {pos:"RDE",  players:["Danielle Hunter","Derek Barnett"]},
    {pos:"WLB",  players:["Henry To'oTo'o","Christian Harris","Jake Hansen","Jamal Hill"]},
    {pos:"MLB",  players:["Azeez Al-Shaair","E.J. Speed","Damone Clark"]},
    {pos:"LCB",  players:["Derek Stingley Jr.","Ja'Marcus Ingram","Tremon Smith"]},
    {pos:"SS",   players:["M.J. Stewart","Jaylen Reed"]},
    {pos:"FS",   players:["Calen Bullock","Myles Bryant","Jimmie Ward"]},
    {pos:"RCB",  players:["Kamari Lassiter","Jaylin Smith","Ajani Carter"]},
    {pos:"NB",   players:["Jalen Pitre","Alijah Huzzie"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Ka'imi Fairbairn"]},
    {pos:"PT", players:["Tommy Townsend"]},
    {pos:"LS", players:["Austin Brinkman"]},
    {pos:"H",  players:["Tommy Townsend"]},
    {pos:"KO", players:["Ka'imi Fairbairn"]},
    {pos:"PR", players:["Jaylin Noel","Braxton Berrios","Christian Kirk"]},
    {pos:"KR", players:["Tremon Smith","Jaylin Noel","Braxton Berrios"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"DeMeco Ryans",oc:"Nick Caley",dc:"Matt Burke",stc:"Frank Ross"},
};

export { HOU_CAP, HOU_DEPTH_CHART };
