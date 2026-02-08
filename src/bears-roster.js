// Chicago Bears 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/28/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $321,059,062 | Top 51: $316,976,069
// HC: Ben Johnson | 2025 Record: 11-6 (Won NFC North, Made Playoffs)

const CHI_CAP = {
  capSpace: -5300354, capCeiling: 304000000,
  offenseSpend: 157687544, defenseSpend: 156921550, specialSpend: 5906975,
  activeContracts: 53,
  keyQuestions: [
    "Slightly over cap at $5.3M — manageable with restructures; $69.6M available in 2027 gives flexibility",
    "Dayo Odeyingbo and Grady Jarrett FA signings underwhelmed — combined $21M+ dead cap makes cuts costly",
    "Darnell Wright extension looming; need to balance keeping core intact with cap relief",
    "Luther Burden III (25/2) and Colston Loveland (25/1) — premium draft capital invested in skill weapons",
    "Ben Johnson Year 2 — offense took massive leap in Year 1; defense led NFL in takeaways (31)",
  ],
};

const CHI_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Caleb Williams","Tyson Bagent","Case Keenum"]},
    {pos:"RB",  players:["D'Andre Swift","Kyle Monangai","Roschon Johnson","Travis Homer","Deion Hankins"]},
    {pos:"LWR", players:["Rome Odunze","Jahdae Walker"]},
    {pos:"RWR", players:["DJ Moore","Olamide Zaccheaus"]},
    {pos:"SWR", players:["Luther Burden III","Devin Duvernay"]},
    {pos:"TE",  players:["Colston Loveland","Cole Kmet","Durham Smythe"]},
    {pos:"LT",  players:["Ozzy Trapilo","Theo Benedet","Kiran Amegadjie"]},
    {pos:"LG",  players:["Joe Thuney","Jordan McFadden"]},
    {pos:"C",   players:["Drew Dalman","Ryan Bates"]},
    {pos:"RG",  players:["Jonah Jackson","Luke Newman"]},
    {pos:"RT",  players:["Darnell Wright","Braxton Jones"]},
  ],
  defense: [
    {pos:"LDE",  players:["Montez Sweat","Dominique Robinson","Daniel Hardy"]},
    {pos:"LDT",  players:["Gervon Dexter Sr.","Shemar Turner","Chris Williams"]},
    {pos:"RDT",  players:["Grady Jarrett","Andrew Billings"]},
    {pos:"RDE",  players:["Dayo Odeyingbo","Austin Booker","Joe Tryon-Shoyinka"]},
    {pos:"WLB",  players:["T.J. Edwards","D'Marco Jackson","Amen Ogbongbemiga","Jalen Reeves-Maybin"]},
    {pos:"MLB",  players:["Tremaine Edmunds","Noah Sewell","Ruben Hyppolite II"]},
    {pos:"LCB",  players:["Nahshon Wright","Tyrique Stevenson","Zah Frazier","Jaylon Jones"]},
    {pos:"SS",   players:["Jaquan Brisker","Jonathan Owens"]},
    {pos:"FS",   players:["Kevin Byard III","Elijah Hicks"]},
    {pos:"RCB",  players:["Jaylon Johnson","Terell Smith","Nick McCloud"]},
    {pos:"NB",   players:["Kyler Gordon","C.J. Gardner-Johnson","Josh Blackwell"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Cairo Santos"]},
    {pos:"PT", players:["Tory Taylor"]},
    {pos:"LS", players:["Scott Daly"]},
    {pos:"H",  players:["Tory Taylor"]},
    {pos:"KO", players:["Cairo Santos"]},
    {pos:"PR", players:["Devin Duvernay","Luther Burden III"]},
    {pos:"KR", players:["Devin Duvernay","Josh Blackwell","Luther Burden III"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"4-3 Under"},
  coaching: {hc:"Ben Johnson",oc:"Vacant",dc:"Dennis Allen",stc:"Richard Hightower"},
};

export { CHI_CAP, CHI_DEPTH_CHART };
