// Atlanta Falcons 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/22/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $280,990,998 | Top 51: $278,755,644
// HC: Kevin Stefanski | 2025 Record: 8-9 (3rd NFC South, Missed Playoffs — HC/GM fired)

const ATL_CAP = {
  capSpace: 26462519, capCeiling: 304000000,
  offenseSpend: 176577247, defenseSpend: 99593397, specialSpend: 2585000,
  activeContracts: 48,
  keyQuestions: [
    "New HC Kevin Stefanski and new GM (search ongoing) after Raheem Morris & Terry Fontenot fired",
    "Kirk Cousins restructured — $22.5M dead money in 2026 plus $12.5M in 2027; Penix Jr. takes over",
    "Darnell Mooney likely cut ($7.4M savings) after injury-plagued 2025; WR2 opposite Drake London needed",
    "Jessie Bates III $24.8M cap hit at age 29 — trade/restructure candidate to save ~$14M",
    "Two 1st-round picks used on defense: James Pearce Jr. (25/1 LOLB) and Jalon Walker (25/1 ROLB) — edge tandem of the future",
  ],
};

const ATL_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Michael Penix Jr.","Kirk Cousins","Easton Stick","Emory Jones"]},
    {pos:"RB",  players:["Bijan Robinson","Tyler Allgeier","Nathan Carter"]},
    {pos:"LWR", players:["Darnell Mooney","Deven Thompkins","Casey Washington"]},
    {pos:"RWR", players:["David Sills V","Khadarel Hodge","Malik Heath"]},
    {pos:"SWR", players:["Drake London","Dylan Drummond"]},
    {pos:"TE",  players:["Kyle Pitts Sr.","Charlie Woerner","Teagan Quitoriano","Feleipe Franks"]},
    {pos:"LT",  players:["Jake Matthews","Storm Norton","Jack Nelson","Tyrone Wheatley Jr."]},
    {pos:"LG",  players:["Matthew Bergeron","Kyle Hinton"]},
    {pos:"C",   players:["Ryan Neuzil","Jovaughn Gwyn"]},
    {pos:"RG",  players:["Chris Lindstrom"]},
    {pos:"RT",  players:["Kaleb McGary","Elijah Wilkinson","Michael Jerrell"]},
  ],
  defense: [
    {pos:"LDE",  players:["David Onyemata","Kentavius Street","Elijah Garcia"]},
    {pos:"NT",   players:["Ruke Orhorhoro","LaCale London","Sam Roberts"]},
    {pos:"RDE",  players:["Brandon Dorlus","Zach Harrison"]},
    {pos:"LOLB", players:["James Pearce Jr.","Leonard Floyd","DeAngelo Malone","Bralen Trice"]},
    {pos:"WLB",  players:["Kaden Elliss","JD Bertrand","Josh Woods","Malik Verdon"]},
    {pos:"MLB",  players:["Divine Deablo","Ronnie Harrison","Troy Andersen"]},
    {pos:"ROLB", players:["Jalon Walker","Khalid Kareem","Arnold Ebiketie"]},
    {pos:"LCB",  players:["Mike Hughes","C.J. Henderson","Natrone Brooks"]},
    {pos:"SS",   players:["Jessie Bates III","DeMarcco Hellams"]},
    {pos:"FS",   players:["Xavier Watts","Jammie Robinson"]},
    {pos:"RCB",  players:["A.J. Terrell Jr.","Cobee Bryant","Clark Phillips III"]},
    {pos:"NB",   players:["Billy Bowman Jr.","Dee Alford","Mike Ford Jr."]},
  ],
  specialTeams: [
    {pos:"PK", players:["Zane Gonzalez"]},
    {pos:"PT", players:["Bradley Pinion"]},
    {pos:"LS", players:["Liam McCullough"]},
    {pos:"H",  players:["Bradley Pinion"]},
    {pos:"KO", players:["Zane Gonzalez"]},
    {pos:"PR", players:["Deven Thompkins","Natrone Brooks"]},
    {pos:"KR", players:["Deven Thompkins","Dylan Drummond","Natrone Brooks"]},
  ],
  scheme: {offense:"West Coast / Play Action",defense:"3-4 Multiple"},
  coaching: {hc:"Kevin Stefanski",oc:"Tommy Rees",dc:"Jeff Ulbrich",stc:"Craig Aukerman"},
};

export { ATL_CAP, ATL_DEPTH_CHART };
