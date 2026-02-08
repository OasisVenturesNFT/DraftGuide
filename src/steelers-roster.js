// Pittsburgh Steelers 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/02/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $277,094,124 | Top 51: $266,504,786
// HC: Mike McCarthy | 2025 Record: 10-7 (Lost Wild Card)

const PIT_CAP = {
  capSpace: 37968170, capCeiling: 304000000,
  offenseSpend: 98973236, defenseSpend: 163068216, specialSpend: 7118334,
  activeContracts: 52,
  keyQuestions: [
    "Aaron Rodgers (age 42) on 1-year deal — retires or returns? QB decision defines offseason",
    "T.J. Watt $28M + Cam Heyward $16M anchor elite defense, but aging core needs succession plan",
    "WR2 void behind DK Metcalf — Roman Wilson hasn't emerged, need FA/draft investment",
    "New HC Mike McCarthy + OC Angelichio replacing Tomlin era — cultural shift in Pittsburgh",
  ],
};

const PIT_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Aaron Rodgers","Mason Rudolph","Will Howard","Skylar Thompson"]},
    {pos:"RB",  players:["Kenneth Gainwell","Jaylen Warren","Kaleb Johnson"]},
    {pos:"FB",  players:["Connor Heyward"]},
    {pos:"LWR", players:["DK Metcalf","Roman Wilson"]},
    {pos:"RWR", players:["Marquez Valdes-Scantling","Scotty Miller"]},
    {pos:"SWR", players:["Calvin Austin III","Ben Skowronek"]},
    {pos:"TE",  players:["Darnell Washington","Pat Freiermuth","Jonnu Smith","Donald Parham Jr."]},
    {pos:"LT",  players:["Broderick Jones","Dylan Cook"]},
    {pos:"LG",  players:["Isaac Seumalo","Andrus Peat","Max Scharping"]},
    {pos:"C",   players:["Zach Frazier","Ryan McCollum"]},
    {pos:"RG",  players:["Mason McCormick","Spencer Anderson"]},
    {pos:"RT",  players:["Troy Fautanu","Calvin Anderson","Jack Driscoll"]},
  ],
  defense: [
    {pos:"DE",   players:["Derrick Harmon","Isaiahh Loudermilk","Logan Lee"]},
    {pos:"NT",   players:["Keeanu Benton","Yahya Black","Daniel Ekuale"]},
    {pos:"DT",   players:["Cameron Heyward","Esezi Otomewo","Dean Lowry","Jacob Slade"]},
    {pos:"LOLB", players:["T.J. Watt","Jack Sawyer","Jeremiah Moon"]},
    {pos:"LILB", players:["Patrick Queen","Malik Harrison","Carson Bruener"]},
    {pos:"RILB", players:["Payton Wilson","Cole Holcomb"]},
    {pos:"ROLB", players:["Alex Highsmith","Nick Herbig"]},
    {pos:"LCB",  players:["James Pierre","Asante Samuel Jr."]},
    {pos:"SS",   players:["DeShon Elliott","Jabrill Peppers","Miles Killebrew"]},
    {pos:"FS",   players:["Kyle Dugger","Chuck Clark","Sebastian Castro"]},
    {pos:"RCB",  players:["Joey Porter Jr.","Cory Trice Jr."]},
    {pos:"NB",   players:["Jalen Ramsey","Brandin Echols","Donte Kent"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Chris Boswell"]},
    {pos:"PT", players:["Corliss Waitman"]},
    {pos:"LS", players:["Christian Kuntz"]},
    {pos:"H",  players:["Corliss Waitman"]},
    {pos:"KO", players:["Chris Boswell"]},
    {pos:"PR", players:["Calvin Austin III","Scotty Miller"]},
    {pos:"KR", players:["Kenneth Gainwell","Jaylen Warren"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 3-4"},
  coaching: {hc:"Mike McCarthy",oc:"Brian Angelichio",dc:"Patrick Graham",stc:"Danny Crossman"},
};

export { PIT_CAP, PIT_DEPTH_CHART };
