// New York Jets 2026 Roster & Depth Chart
// SOURCES:
//   Ourlads.com depth chart (updated 02/04/2026) — SOURCE OF TRUTH for roster & depth
//   Over The Cap (overthecap.com) — team-level financial data
//
// Cap Ceiling: $304,000,000 (projected)
// Total Cap Liabilities: $248,339,083
// Top 51 Cap: $167,404,312
// Team Cap Space: $83,263,050
// Offense: $83,341,189 | Defense: $86,011,456 | Special: $3,365,000
// HC: Aaron Glenn (since 2026)
// 2025 Record: 3-14 (Last in AFC East)

const NYJ_CAP = {
  capSpace: 83263050,
  capCeiling: 304000000,
  offenseSpend: 83341189,
  defenseSpend: 86011456,
  specialSpend: 3365000,
  activeContracts: 50,
  keyQuestions: [
    "$83.3M in cap space — 2nd most in NFL, massive rebuild flexibility for Aaron Glenn",
    "Justin Fields at $23M cap hit ($22M dead if cut) — committed for 2026 but is he the answer?",
    "Garrett Wilson on rookie deal — extend or franchise tag the #1 WR asset?",
    "New coaching staff (Glenn/Reich/Duker) inherits barren roster — draft capital + cap = full reset",
  ],
};

// Depth Chart — STRICTLY from Ourlads.com (updated 02/04/2026)
const NYJ_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Justin Fields","Brady Cook","Tyrod Taylor","Hendon Hooker"]},
    {pos:"RB",  players:["Breece Hall","Braelon Allen","Isaiah Davis","Kene Nwangwu","Khalil Herbert"]},
    {pos:"FB",  players:["Andrew Beck"]},
    {pos:"LWR", players:["Adonai Mitchell","Arian Smith","Irvin Charles"]},
    {pos:"RWR", players:["Garrett Wilson","Josh Reynolds","Quentin Skinner"]},
    {pos:"SWR", players:["John Metchie III","Isaiah Williams","Tyler Johnson"]},
    {pos:"TE",  players:["Mason Taylor","Jeremy Ruckert","Stone Smartt","Jelani Woods"]},
    {pos:"LT",  players:["Olu Fashanu","Max Mitchell"]},
    {pos:"LG",  players:["John Simpson","Xavier Newman","Kohl Levao"]},
    {pos:"C",   players:["Joe Tippmann","Josh Myers","Gus Hartwig"]},
    {pos:"RG",  players:["Alijah Vera-Tucker","Marquis Hayes"]},
    {pos:"RT",  players:["Armand Membou","Chukwuma Okorafor"]},
  ],
  defense: [
    {pos:"LDE",  players:["Will McDonald IV","Micheal Clemons","Tyler Baron","Kingsley Jonathan"]},
    {pos:"LDT",  players:["Harrison Phillips","Jay Tufele","Mazi Smith"]},
    {pos:"RDT",  players:["Jowon Briggs","Khalen Saunders","Payton Page"]},
    {pos:"RDE",  players:["Jermaine Johnson","Braiden McGregor","Eric Watts"]},
    {pos:"WLB",  players:["Quincy Williams","Marcelino McCrary-Ball","Cam Jones","Kobe King"]},
    {pos:"MLB",  players:["Jamien Sherwood","Kiko Mauigoa","Mykal Walker"]},
    {pos:"LCB",  players:["Azareye'h Thomas","Qwan'tez Stiggers","Kris Boyd"]},
    {pos:"SS",   players:["Malachi Moore","Isaiah Oliver","Keidron Smith","Jarius Monroe"]},
    {pos:"FS",   players:["Andre Cisco","Tony Adams","Dean Clark","Chris Smith II"]},
    {pos:"RCB",  players:["Brandon Stephens","Ja'Sir Taylor","Tre Brown"]},
    {pos:"NB",   players:["Jarvis Brownlee Jr.","Jordan Clark"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Nick Folk"]},
    {pos:"PT", players:["Austin McNamara"]},
    {pos:"LS", players:["Thomas Hennessy"]},
    {pos:"H",  players:["Austin McNamara"]},
    {pos:"KO", players:["Nick Folk"]},
    {pos:"PR", players:["Isaiah Williams","Khalil Herbert","Arian Smith"]},
    {pos:"KR", players:["Kene Nwangwu","Isaiah Williams","Khalil Herbert","Arian Smith"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"Aaron Glenn",oc:"Frank Reich",dc:"Brian Duker",stc:"Chris Banjo"},
};

export { NYJ_CAP, NYJ_DEPTH_CHART };
