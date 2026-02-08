// Seattle Seahawks 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/04/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $243,649,745 | Top 51: $243,166,022
// HC: Mike Macdonald | 2025 Record: 14-3 (1st in NFC West, NFC #1 seed, Super Bowl LX)

const SEA_CAP = {
  capSpace: 73284461, capCeiling: 304000000,
  offenseSpend: 111476789, defenseSpend: 120664233, specialSpend: 11025000,
  activeContracts: 42,
  keyQuestions: [
    "Super Bowl LX participants — $73.3M cap space gives flexibility to reload while competing",
    "Sam Darnold on value QB deal ($9.5M cap hit) — key extension decision after career-best season",
    "Zach Charbonnet torn ACL in divisional round — Kenneth Walker III only proven back for 2026",
    "DK Metcalf and Tyler Lockett both gone — $34.9M combined dead money; Jaxon Smith-Njigba (Offensive POY) is WR1",
    "Charles Cross signed 4-year, $104.4M extension ($26.1M/yr) — OL locked in with Grey Zabel (25/1)",
  ],
};

const SEA_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Sam Darnold","Drew Lock","Jalen Milroe"]},
    {pos:"RB",  players:["Kenneth Walker III","George Holani"]},
    {pos:"FB",  players:["Robbie Ouzts","Brady Russell"]},
    {pos:"LWR", players:["Jaxon Smith-Njigba","Dareke Young"]},
    {pos:"RWR", players:["Rashid Shaheed","Jake Bobo"]},
    {pos:"SWR", players:["Cooper Kupp"]},
    {pos:"TE",  players:["AJ Barner","Eric Saubert","Nick Kallerup","Elijah Arroyo"]},
    {pos:"LT",  players:["Charles Cross","Josh Jones"]},
    {pos:"LG",  players:["Grey Zabel","Christian Haynes"]},
    {pos:"C",   players:["Jalen Sundell","Olu Oluwatimi"]},
    {pos:"RG",  players:["Anthony Bradford"]},
    {pos:"RT",  players:["Abraham Lucas","Mason Richman"]},
  ],
  defense: [
    {pos:"LOLB", players:["DeMarcus Lawrence","Derick Hall","Jared Ivey"]},
    {pos:"NT",   players:["Byron Murphy II","Brandon Pili","Rylie Mills"]},
    {pos:"DT",   players:["Leonard Williams","Jarran Reed","Mike Morris"]},
    {pos:"ROLB", players:["Uchenna Nwosu","Boye Mafe","Connor O'Toole"]},
    {pos:"WLB",  players:["Drake Thomas","Tyrice Knight","Chazz Surratt"]},
    {pos:"MLB",  players:["Ernest Jones IV","Patrick O'Connell"]},
    {pos:"LCB",  players:["Devon Witherspoon","Nehemiah Pritchett"]},
    {pos:"SS",   players:["Julian Love"]},
    {pos:"FS",   players:["Coby Bryant","Ty Okada"]},
    {pos:"RCB",  players:["Riq Woolen","Josh Jobe"]},
    {pos:"NB",   players:["Nick Emmanwori"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Jason Myers"]},
    {pos:"PT", players:["Michael Dickson"]},
    {pos:"LS", players:["Chris Stoll"]},
    {pos:"H",  players:["Michael Dickson"]},
    {pos:"KO", players:["Jason Myers"]},
    {pos:"PR", players:["Rashid Shaheed","Jake Bobo"]},
    {pos:"KR", players:["Rashid Shaheed","Dareke Young"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 3-4 Under"},
  coaching: {hc:"Mike Macdonald",oc:"Klint Kubiak",dc:"Aden Durde",stc:"Jay Harbaugh"},
};

export { SEA_CAP, SEA_DEPTH_CHART };
