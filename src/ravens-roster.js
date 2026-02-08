// Baltimore Ravens 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 11/24/2025), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $291,816,873 | Top 51: $279,554,158
// HC: John Harbaugh | 2025 Record: 8-9 (Missed Playoffs)

const BAL_CAP = {
  capSpace: 22043387, capCeiling: 304000000,
  offenseSpend: 132732771, defenseSpend: 144300194, specialSpend: 2521193,
  activeContracts: 55,
  keyQuestions: [
    "Lamar Jackson $52M cap hit — elite QB but tight $22M cap space limits FA moves",
    "Tyler Linderbaum UFA — top center in NFL, Ravens must decide on franchise tag or extension",
    "Pass rush dire need: Ojabo underwhelmed, no edge presence — draft or FA priority",
    "New HC Jesse Minter replacing Harbaugh-era coaching staff; Monken left for Browns",
  ],
};

const BAL_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Lamar Jackson","Tyler Huntley","Cooper Rush"]},
    {pos:"RB",  players:["Derrick Henry","Justice Hill","Keaton Mitchell","Rasheen Ali"]},
    {pos:"FB",  players:["Patrick Ricard"]},
    {pos:"LWR", players:["Rashod Bateman","Tylan Wallace"]},
    {pos:"RWR", players:["Zay Flowers","Devontez Walker"]},
    {pos:"SWR", players:["DeAndre Hopkins","LaJohntay Wester"]},
    {pos:"TE",  players:["Mark Andrews","Isaiah Likely","Charlie Kolar"]},
    {pos:"LT",  players:["Ronnie Stanley","Joseph Noteboom"]},
    {pos:"LG",  players:["Andrew Vorhees","Ben Cleveland"]},
    {pos:"C",   players:["Tyler Linderbaum","Corey Bullock"]},
    {pos:"RG",  players:["Daniel Faalele","Emery Jones Jr."]},
    {pos:"RT",  players:["Roger Rosengarten","Carson Vinson"]},
  ],
  defense: [
    {pos:"DE",   players:["Taven Bryan","Brent Urban"]},
    {pos:"NT",   players:["John Jenkins","C.J. Okoye"]},
    {pos:"DT",   players:["Travis Jones","Aeneas Peebles"]},
    {pos:"RUSH", players:["Dre'Mont Jones","Mike Green"]},
    {pos:"WLB",  players:["Teddye Buchanan","Jake Hummel"]},
    {pos:"MLB",  players:["Roquan Smith","Trenton Simpson"]},
    {pos:"SLB",  players:["Kyle Van Noy","David Ojabo"]},
    {pos:"LCB",  players:["Marlon Humphrey","T.J. Tampa"]},
    {pos:"SS",   players:["Alohi Gilman","Keondre Jackson"]},
    {pos:"FS",   players:["Malaki Starks"]},
    {pos:"RCB",  players:["Nate Wiggins","Chidobe Awuzie"]},
    {pos:"NB",   players:["Kyle Hamilton","Keyon Martin"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Tyler Loop"]},
    {pos:"PT", players:["Jordan Stout"]},
    {pos:"LS", players:["Nick Moore"]},
    {pos:"H",  players:["Jordan Stout"]},
    {pos:"KO", players:["Tyler Loop"]},
    {pos:"PR", players:["LaJohntay Wester","Tylan Wallace"]},
    {pos:"KR", players:["Rasheen Ali","Keaton Mitchell","Justice Hill"]},
  ],
  scheme: {offense:"12 Personnel (1 RB, 2 TE)",defense:"Base 3-4"},
  coaching: {hc:"John Harbaugh",oc:"Todd Monken",dc:"Zach Orr",stc:"Chris Horton"},
};

export { BAL_CAP, BAL_DEPTH_CHART };
