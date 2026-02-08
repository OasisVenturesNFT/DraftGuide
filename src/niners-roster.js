// San Francisco 49ers 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 12/30/2025), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $300,855,589 | Top 51: $269,621,623
// HC: Kyle Shanahan | 2025 Record: 12-5 (3rd in NFC West, lost in Divisional Round)

const SF_CAP = {
  capSpace: 42950176, capCeiling: 304000000,
  offenseSpend: 157887083, defenseSpend: 121104765, specialSpend: 0,
  activeContracts: 53,
  keyQuestions: [
    "Nick Bosa ($33.5M cap hit) and Fred Warner ($27M) both on IR — two franchise cornerstones missed significant time",
    "Brandon Aiyuk listed as 'LEFT' — $24.9M guaranteed for 2026 but relationship appears fractured",
    "Robert Saleh returns as DC after Jets firing — reunion with Shanahan's defensive scheme",
    "Brock Purdy extension looming — $37.75M guaranteed trigger in March, massive deal incoming",
    "Only 20 sacks in 2025 (worst in NFL) — pass rush was historically bad despite Bosa's reputation",
  ],
};

const SF_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Brock Purdy","Mac Jones"]},
    {pos:"RB",  players:["Christian McCaffrey","Brian Robinson Jr.","Jordan James","Isaac Guerendo"]},
    {pos:"FB",  players:["Kyle Juszczyk"]},
    {pos:"LWR", players:["Ricky Pearsall","Kendrick Bourne"]},
    {pos:"RWR", players:["Jauan Jennings","Skyy Moore"]},
    {pos:"SWR", players:["Demarcus Robinson","Jordan Watkins"]},
    {pos:"TE",  players:["George Kittle","Jake Tonges","Luke Farrell"]},
    {pos:"LT",  players:["Trent Williams","Austen Pleasants"]},
    {pos:"LG",  players:["Spencer Burford"]},
    {pos:"C",   players:["Jake Brendel","Matt Hennessy"]},
    {pos:"RG",  players:["Dominick Puni","Connor Colby"]},
    {pos:"RT",  players:["Colton McKivitz"]},
  ],
  defense: [
    {pos:"LDE",  players:["Bryce Huff","Yetur Gross-Matos","Robert Beal Jr."]},
    {pos:"LDT",  players:["Jordan Elliott","Alfred Collins","Kevin Givens"]},
    {pos:"RDT",  players:["Kalia Davis","C.J. West"]},
    {pos:"RDE",  players:["Sam Okuayinonu","Keion White","Clelin Ferrell"]},
    {pos:"WLB",  players:["Dee Winters","Luke Gifford"]},
    {pos:"MLB",  players:["Tatum Bethune","Garret Wallow","Curtis Robinson"]},
    {pos:"LCB",  players:["Renardo Green","Darrell Luter Jr."]},
    {pos:"SS",   players:["Ji'Ayir Brown","Jason Pinnock"]},
    {pos:"FS",   players:["Malik Mustapha","Marques Sigle"]},
    {pos:"RCB",  players:["Deommodore Lenoir","Siran Neal"]},
    {pos:"NB",   players:["Upton Stout","Chase Lucas"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Eddy Piñeiro"]},
    {pos:"PT", players:["Thomas Morstead"]},
    {pos:"LS", players:["Jon Weeks"]},
    {pos:"H",  players:["Thomas Morstead"]},
    {pos:"KO", players:["Eddy Piñeiro"]},
    {pos:"PR", players:["Skyy Moore","Jordan Watkins","Ricky Pearsall"]},
    {pos:"KR", players:["Skyy Moore","Brian Robinson Jr.","Isaac Guerendo"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 4-2"},
  coaching: {hc:"Kyle Shanahan",oc:"Klay Kubiak",dc:"Robert Saleh",stc:"Brant Boyer"},
};

export { SF_CAP, SF_DEPTH_CHART };
