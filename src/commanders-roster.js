// Washington Commanders 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/23/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $256,840,268 | Top 51: $255,706,956
// HC: Dan Quinn | 2025 Record: 5-12 (3rd in NFC East)

const WAS_CAP = {
  capSpace: 76041469, capCeiling: 304000000,
  offenseSpend: 131498279, defenseSpend: 123585343, specialSpend: 1508334,
  activeContracts: 52,
  keyQuestions: [
    "$76M cap space (6th most in NFL) but Deebo Samuel void triggers $12.4M dead cap hit — effective ~$63.7M",
    "Defense ranked 32nd in yards allowed, 27th in points allowed in 2025 — complete defensive rebuild needed",
    "Jayden Daniels Year 2 on rookie deal — window to build around franchise QB before extension",
    "Laremy Tunsil needs extension ($24.9M cap hit in final year); Marshon Lattimore $18.5M likely released",
    "Only 34 players under contract — Adam Peters must fill 20+ roster spots via FA and draft",
  ],
};

const WAS_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Jayden Daniels","Marcus Mariota","Josh Johnson"]},
    {pos:"RB",  players:["Austin Ekeler","Chris Rodriguez Jr.","Jacory Croskey-Merritt","Jeremy McNichols","Chase Edmonds"]},
    {pos:"LWR", players:["Terry McLaurin","Noah Brown","Chris Moore"]},
    {pos:"RWR", players:["Luke McCaffrey","Treylon Burks"]},
    {pos:"SWR", players:["Deebo Samuel","Jaylin Lane"]},
    {pos:"TE",  players:["Zach Ertz","John Bates","Ben Sinnott","Colson Yankoff","Tyree Jackson"]},
    {pos:"LT",  players:["Laremy Tunsil","Brandon Coleman","Lucas Niang"]},
    {pos:"LG",  players:["Chris Paul","Nick Allegretti"]},
    {pos:"C",   players:["Tyler Biadasz","Julian Good-Jones"]},
    {pos:"RG",  players:["Sam Cosmi","Andrew Wylie"]},
    {pos:"RT",  players:["Josh Conerly Jr.","Trent Scott","George Fant"]},
  ],
  defense: [
    {pos:"LDE",  players:["Deatrich Wise Jr.","Jalyn Holmes","Von Miller","Drake Jackson"]},
    {pos:"LDT",  players:["Daron Payne","Jer'Zhan Newton","Shy Tuttle"]},
    {pos:"RDT",  players:["Javon Kinlaw","Eddie Goldman","Sheldon Day"]},
    {pos:"RDE",  players:["Dorance Armstrong","Jacob Martin","Javontae Jean-Baptiste","Preston Smith"]},
    {pos:"WLB",  players:["Frankie Luvu","Jordan Magee","Nick Bellore"]},
    {pos:"MLB",  players:["Bobby Wagner","Kain Medrano","Ale Kaho"]},
    {pos:"LCB",  players:["Trey Amos","Jonathan Jones"]},
    {pos:"SS",   players:["Will Harris","Percy Butler"]},
    {pos:"FS",   players:["Jeremy Reaves","Quan Martin"]},
    {pos:"RCB",  players:["Marshon Lattimore","Antonio Hamilton Sr."]},
    {pos:"NB",   players:["Mike Sainristil","Noah Igbinoghene","Tyler Owens"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Jake Moody"]},
    {pos:"PT", players:["Tress Way"]},
    {pos:"LS", players:["Tyler Ott"]},
    {pos:"H",  players:["Tress Way"]},
    {pos:"KO", players:["Jake Moody"]},
    {pos:"PR", players:["Jaylin Lane"]},
    {pos:"KR", players:["Luke McCaffrey","Chris Moore","Chase Edmonds"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 4-2"},
  coaching: {hc:"Dan Quinn",oc:"David Blough",dc:"Daronte Jones",stc:"Larry Izzo"},
};

export { WAS_CAP, WAS_DEPTH_CHART };
