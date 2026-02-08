// Minnesota Vikings 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/04/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $359,987,626 | Top 51: $351,724,552
// HC: Kevin O'Connell | 2025 Record: 9-8 (3rd NFC North, Missed Playoffs)

const MIN_CAP = {
  capSpace: -40156353, capCeiling: 304000000,
  offenseSpend: 199642717, defenseSpend: 153619180, specialSpend: 1117655,
  activeContracts: 51,
  keyQuestions: [
    "$40.2M OVER the cap — worst in NFC North; Jefferson restructure alone frees ~$19M",
    "Aging veteran contracts dominate: O'Neill ($19.5M), Greenard ($19M), Allen ($17M), Hockenson ($16M), Van Ginkel ($16M) all cuttable",
    "Ryan Kelly concussion issues make 2026 return unlikely; Harrison Smith ($4.3M) expected to retire",
    "J.J. McCarthy Year 2 — rookie window demands aggressive spending; went 9-8 in first full season",
    "Jordan Mason acquired from SF — adds proven runner alongside aging Aaron Jones ($10M, $2M guaranteed)",
  ],
};

const MIN_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["J.J. McCarthy","Carson Wentz","Max Brosmer","John Wolford","Brett Rypien"]},
    {pos:"RB",  players:["Aaron Jones Sr.","Jordan Mason","Ty Chandler","Zavier Scott"]},
    {pos:"LWR", players:["Justin Jefferson","Tai Felton"]},
    {pos:"RWR", players:["Jordan Addison","Rondale Moore"]},
    {pos:"SWR", players:["Jalen Nailor","Myles Price"]},
    {pos:"TE",  players:["T.J. Hockenson","Josh Oliver","Ben Sims","Ben Yurosek","Gavin Bartholomew"]},
    {pos:"LT",  players:["Christian Darrisaw","Justin Skule"]},
    {pos:"LG",  players:["Donovan Jackson","Blake Brandel","Henry Byrd"]},
    {pos:"C",   players:["Ryan Kelly","Michael Jurgens","Zeke Correll"]},
    {pos:"RG",  players:["Will Fries","Joe Huber"]},
    {pos:"RT",  players:["Brian O'Neill","Walter Rouse","Matt Nelson"]},
  ],
  defense: [
    {pos:"LDE",  players:["Jonathan Allen","Elijah Williams"]},
    {pos:"NT",   players:["Javon Hargrave","Levi Drake Rodriguez","Taki Taimani"]},
    {pos:"RDE",  players:["Jalen Redmond","Tyrion Ingram-Dawkins"]},
    {pos:"LOLB", players:["Jonathan Greenard","Dallas Turner","Tyler Batty"]},
    {pos:"LILB", players:["Eric Wilson","Ivan Pace Jr."]},
    {pos:"RILB", players:["Blake Cashman"]},
    {pos:"ROLB", players:["Andrew Van Ginkel","Bo Richter","Chaz Chambliss"]},
    {pos:"LCB",  players:["Isaiah Rodgers","Fabian Moreau","Zemaiah Vaughn"]},
    {pos:"SS",   players:["Joshua Metellus","Jay Ward","Tavierre Thomas"]},
    {pos:"FS",   players:["Harrison Smith","Theo Jackson"]},
    {pos:"RCB",  players:["Byron Murphy Jr.","Jeff Okudah","Dwight McGlothern"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Will Reichard"]},
    {pos:"PT", players:["Ryan Wright"]},
    {pos:"LS", players:["Andrew DePaola"]},
    {pos:"H",  players:["Ryan Wright"]},
    {pos:"KO", players:["Will Reichard"]},
    {pos:"PR", players:["Myles Price","Jalen Nailor"]},
    {pos:"KR", players:["Myles Price","Tai Felton"]},
  ],
  scheme: {offense:"West Coast / Play Action",defense:"3-4 Multiple"},
  coaching: {hc:"Kevin O'Connell",oc:"Wes Phillips",dc:"Brian Flores",stc:"Matt Daniels"},
};

export { MIN_CAP, MIN_DEPTH_CHART };
