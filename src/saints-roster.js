// New Orleans Saints 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/21/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $341,567,615 | Top 51: $261,530,600
// HC: Kellen Moore | 2025 Record: 7-10 (4th NFC South, Missed Playoffs)

const NO_CAP = {
  capSpace: -6037060, capCeiling: 304000000,
  offenseSpend: 135425489, defenseSpend: 136733444, specialSpend: 3610000,
  activeContracts: 53,
  keyQuestions: [
    "$6M over the cap — manageable via restructures of Chase Young, Juwan Johnson, Justin Reid, Pete Werner (~$23M savings)",
    "$66M dead money on books including $36M from Derek Carr — annual cap gymnastics continue",
    "Tyler Shough (25/2) breakout as rookie — 5 wins in last 9 starts, OROY buzz; future franchise QB?",
    "Cameron Jordan (age 36) and Demario Davis (age 37) likely on farewell contracts to finish careers in NO",
    "Light at end of tunnel: $130M+ projected effective cap space in 2027 once dead money clears",
  ],
};

const NO_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Tyler Shough","Spencer Rattler"]},
    {pos:"RB",  players:["Alvin Kamara","Kendre Miller","Devin Neal","Audric Estimé","Evan Hull"]},
    {pos:"LWR", players:["Mason Tipton","Kevin Austin Jr.","Ronnie Bell","Samori Toure"]},
    {pos:"RWR", players:["Chris Olave","Bub Means","Ja'Lynn Polk"]},
    {pos:"SWR", players:["Devaughn Vele","Dante Pettis","Trey Palmer"]},
    {pos:"TE",  players:["Juwan Johnson","Foster Moreau","Taysom Hill","Moliki Matavao","Treyton Welch"]},
    {pos:"LT",  players:["Kelvin Banks Jr.","Landon Young"]},
    {pos:"LG",  players:["Dillon Radunz","Nick Saldiveri","Torricelli Simpkins III"]},
    {pos:"C",   players:["Erik McCoy","Luke Fortner","Will Clapp"]},
    {pos:"RG",  players:["Cesar Ruiz","William Sherman"]},
    {pos:"RT",  players:["Taliese Fuaga","Asim Richards","Xavier Truss"]},
  ],
  defense: [
    {pos:"DE",   players:["Bryan Bresee","Jonathan Bullard"]},
    {pos:"NT",   players:["Nathan Shepherd","Davon Godchaux","Khristian Boyd"]},
    {pos:"DT",   players:["Jonah Williams","Vernon Broughton","John Ridgeway III"]},
    {pos:"LOLB", players:["Cameron Jordan","Carl Granderson"]},
    {pos:"WLB",  players:["Pete Werner","Isaiah Stalbird","Jaylan Ford"]},
    {pos:"MLB",  players:["Demario Davis","Danny Stutsman"]},
    {pos:"ROLB", players:["Chase Young","Chris Rumph II","Fadil Diggs"]},
    {pos:"LCB",  players:["Quincy Riley","Isaac Yiadom","Rejzohn Wright"]},
    {pos:"SS",   players:["Justin Reid","Jordan Howden"]},
    {pos:"FS",   players:["Jonas Sanker","Julian Blackmon","Terrell Burgess"]},
    {pos:"RCB",  players:["Kool-Aid McKinstry","Michael Davis"]},
    {pos:"NB",   players:["Alontae Taylor","Ugo Amadi"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Charlie Smyth"]},
    {pos:"PT", players:["Kai Kroeger"]},
    {pos:"LS", players:["Zach Wood"]},
    {pos:"H",  players:["Kai Kroeger"]},
    {pos:"KO", players:["Charlie Smyth"]},
    {pos:"PR", players:["Dante Pettis"]},
    {pos:"KR", players:["Evan Hull"]},
  ],
  scheme: {offense:"Spread RPO",defense:"4-3 Multiple"},
  coaching: {hc:"Kellen Moore",oc:"Doug Nussmeier",dc:"Brandon Staley",stc:"Phil Galiano"},
};

export { NO_CAP, NO_DEPTH_CHART };
