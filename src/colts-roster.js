// Indianapolis Colts 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/16/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $278,492,141 | Top 51: $268,433,497
// HC: Shane Steichen | 2025 Record: 6-11 (Missed Playoffs 5th straight year)

const IND_CAP = {
  capSpace: 35598489, capCeiling: 304000000,
  offenseSpend: 130232852, defenseSpend: 140635645, specialSpend: 5530000,
  activeContracts: 55,
  keyQuestions: [
    "Daniel Jones starting over Anthony Richardson — AR benched midseason, career at crossroads",
    "Sauce Gardner trade + Ward/Bynum signings = massive secondary investment, must pay off",
    "Tyler Warren #1 pick = franchise TE, immediate impact expected alongside Jonathan Taylor",
    "Quenton Nelson + DeForest Buckner aging anchors — restructure candidates to create space",
  ],
};

const IND_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Daniel Jones","Anthony Richardson Sr.","Riley Leonard"]},
    {pos:"RB",  players:["Jonathan Taylor","Ameer Abdullah","Tyler Goodson","DJ Giddens","Salvon Ahmed"]},
    {pos:"LWR", players:["Michael Pittman Jr.","Ashton Dulin","D.J. Montgomery"]},
    {pos:"RWR", players:["Alec Pierce","Laquon Treadwell"]},
    {pos:"SWR", players:["Josh Downs","Anthony Gould"]},
    {pos:"TE",  players:["Tyler Warren","Mo Alie-Cox","Drew Ogletree","Will Mallory"]},
    {pos:"LT",  players:["Bernhard Raimann","Jalen Travis","Jack Wilson"]},
    {pos:"LG",  players:["Quenton Nelson"]},
    {pos:"C",   players:["Tanor Bortolini","Danny Pinter"]},
    {pos:"RG",  players:["Matt Goncalves","Dalton Tucker"]},
    {pos:"RT",  players:["Braden Smith","Blake Freeland","Luke Tenuta"]},
  ],
  defense: [
    {pos:"LDE",  players:["Kwity Paye","Tyquan Lewis","JT Tuimoloau"]},
    {pos:"NT",   players:["Grover Stewart","Neville Gallimore","Eric Johnson II"]},
    {pos:"DT",   players:["DeForest Buckner","Adetomiwa Adebawore","Chris Wormley"]},
    {pos:"RDE",  players:["Laiatu Latu","Samson Ebukam"]},
    {pos:"WLB",  players:["Germaine Pratt","Austin Ajiake","Segun Olubi","Jacob Phillips"]},
    {pos:"MLB",  players:["Zaire Franklin","Buddy Johnson","Jaylon Carlies"]},
    {pos:"LCB",  players:["Charvarius Ward","Mekhi Blackmon","Jaylon Jones"]},
    {pos:"SS",   players:["Nick Cross","George Odum","Hunter Wohler"]},
    {pos:"FS",   players:["Cam Bynum","Rodney Thomas II","Daniel Scott"]},
    {pos:"RCB",  players:["Sauce Gardner","Justin Walley","Johnathan Edwards"]},
    {pos:"NB",   players:["Kenny Moore II","Chris Lammons","Cameron Mitchell"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Spencer Shrader","Blake Grupe"]},
    {pos:"PT", players:["Rigoberto Sanchez"]},
    {pos:"LS", players:["Luke Rhodes"]},
    {pos:"H",  players:["Rigoberto Sanchez"]},
    {pos:"KO", players:["Spencer Shrader","Blake Grupe"]},
    {pos:"PR", players:["Anthony Gould","Josh Downs"]},
    {pos:"KR", players:["Anthony Gould","Ashton Dulin","Ameer Abdullah"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"Shane Steichen",oc:"Jim Bob Cooter",dc:"Lou Anarumo",stc:"Brian Mason"},
};

export { IND_CAP, IND_DEPTH_CHART };
