// Kansas City Chiefs 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/05/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $361,447,582 | Top 51: $358,576,941
// HC: Andy Reid | 2025 Record: 11-6 (Lost Divisional Round)

const KC_CAP = {
  capSpace: -54910166, capCeiling: 304000000,
  offenseSpend: 203908751, defenseSpend: 150018190, specialSpend: 7305000,
  activeContracts: 60,
  keyQuestions: [
    "Chiefs ~$54.9M OVER the cap — worst cap situation in the NFL, major restructures/cuts needed",
    "Mahomes $59.2M cap hit + Chris Jones $31.8M — dynasty tax squeezing roster depth",
    "Travis Kelce age 36 — $14.5M cap hit, will 2026 be his final season?",
    "Joey Bosa traded to Bills, but still carrying dead money — defensive reinvestment needed",
  ],
};

const KC_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Patrick Mahomes","Gardner Minshew","Chris Oladokun"]},
    {pos:"RB",  players:["Isiah Pacheco","Kareem Hunt","Brashard Smith","Dameon Pierce","Keaontay Ingram"]},
    {pos:"LWR", players:["Hollywood Brown","Tyquan Thornton"]},
    {pos:"RWR", players:["Xavier Worthy","JuJu Smith-Schuster"]},
    {pos:"SWR", players:["Rashee Rice","Jalen Royals","Nikko Remigio"]},
    {pos:"TE",  players:["Travis Kelce","Noah Gray","Robert Tonyan","Jared Wiley","Jake Briningstool"]},
    {pos:"LT",  players:["Josh Simmons","Esa Pole","Jaylon Moore"]},
    {pos:"LG",  players:["Kingsley Suamataia","C.J. Hanson"]},
    {pos:"C",   players:["Creed Humphrey","Hunter Nourzad"]},
    {pos:"RG",  players:["Trey Smith","Mike Caliendo"]},
    {pos:"RT",  players:["Jawaan Taylor","Wanya Morris","Chukwuebuka Godrick","Ethan Driskell"]},
  ],
  defense: [
    {pos:"LDE",  players:["George Karlaftis","Charles Omenihu","Felix Anudike-Uzomah","Tyreke Smith"]},
    {pos:"LDT",  players:["Chris Jones","Derrick Nnadi","Zacch Pickens"]},
    {pos:"RDT",  players:["Jerry Tillery","Omarr Norman-Lott","Mike Pennel"]},
    {pos:"RDE",  players:["Mike Danna","Ashton Gillotte","Ethan Downs","Janarius Robinson"]},
    {pos:"WLB",  players:["Drue Tranquill","Jeffrey Bassa","Cole Christiansen"]},
    {pos:"MLB",  players:["Nick Bolton","Cooper McDonald","Brandon George"]},
    {pos:"SLB",  players:["Leo Chenal","Jack Cochrane"]},
    {pos:"LCB",  players:["Jaylen Watson","Kristian Fulton","Nazeeh Johnson","Melvin Smith Jr."]},
    {pos:"SS",   players:["Chamarri Conner","Jaden Hicks"]},
    {pos:"FS",   players:["Bryan Cook","Mike Edwards","Deon Bush"]},
    {pos:"RCB",  players:["Trent McDuffie","Nohl Williams","Joshua Williams","Eric Scott"]},
    {pos:"NB",   players:["Chris Roland-Wallace","Kevin Knowles"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Harrison Butker"]},
    {pos:"PT", players:["Matt Araiza"]},
    {pos:"LS", players:["James Winchester"]},
    {pos:"H",  players:["Matt Araiza"]},
    {pos:"KO", players:["Harrison Butker"]},
    {pos:"PR", players:["Nikko Remigio","Xavier Worthy"]},
    {pos:"KR", players:["Nikko Remigio","Brashard Smith"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"Andy Reid",oc:"Eric Bieniemy",dc:"Steve Spagnuolo",stc:"Dave Toub"},
};

export { KC_CAP, KC_DEPTH_CHART };
