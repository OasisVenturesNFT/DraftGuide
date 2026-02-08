// Las Vegas Raiders 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/22/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $224,225,738 | Top 51: $189,413,472
// HC: Klint Kubiak (after SB) | 2025 Record: 2-15 (Last in AFC West)

const LV_CAP = {
  capSpace: 91522807, capCeiling: 304000000,
  offenseSpend: 102061177, defenseSpend: 81207295, specialSpend: 6145000,
  activeContracts: 48,
  keyQuestions: [
    "$91.5M in cap space + #2 overall pick — one of the best rebuild war chests in the NFL",
    "QB vacancy: Geno Smith flopped ($8M savings if cut) — likely targeting QB at #2 overall",
    "Brock Bowers + Ashton Jeanty = elite young skill core, need to protect them with OL investment",
    "New HC Klint Kubiak still filling coaching staff (OC/DC/STC vacant) — full organizational reset",
  ],
};

const LV_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Geno Smith","Kenny Pickett","Aidan O'Connell"]},
    {pos:"RB",  players:["Ashton Jeanty","Raheem Mostert","Dylan Laube","Zamir White"]},
    {pos:"LWR", players:["Jack Bech","Dont'e Thornton Jr."]},
    {pos:"RWR", players:["Tre Tucker","Shedrick Jackson"]},
    {pos:"SWR", players:["Tyler Lockett","Alex Bachman"]},
    {pos:"TE",  players:["Brock Bowers","Michael Mayer","Ian Thomas","Carter Runyon"]},
    {pos:"LT",  players:["Kolton Miller","Charles Grant"]},
    {pos:"LG",  players:["Dylan Parham","Atonio Mafi"]},
    {pos:"C",   players:["Jordan Meredith","Alex Cappa","Will Putnam"]},
    {pos:"RG",  players:["Jackson Powers-Johnson","Caleb Rogers"]},
    {pos:"RT",  players:["DJ Glaze","Stone Forsythe"]},
  ],
  defense: [
    {pos:"LDE",  players:["Maxx Crosby","Tyree Wilson","Jahfari Harvey"]},
    {pos:"LDT",  players:["Adam Butler","Thomas Booker IV","JJ Pegues"]},
    {pos:"RDT",  players:["Jonah Laulu","Tonka Hemingway","Brodric Martin"]},
    {pos:"RDE",  players:["Malcolm Koonce","Charles Snowden","Brennan Jackson"]},
    {pos:"WLB",  players:["Elandon Roberts","Tommy Eichenberg"]},
    {pos:"MLB",  players:["Devin White","Cody Lindenberg"]},
    {pos:"SLB",  players:["Jamal Adams","Jon Rhattigan"]},
    {pos:"LCB",  players:["Eric Stokes","Decamerion Richardson","Chigozie Anusiem"]},
    {pos:"SS",   players:["Isaiah Pola-Mao","Terrell Edmunds"]},
    {pos:"FS",   players:["Lonnie Johnson Jr.","Tristin McCollum"]},
    {pos:"RCB",  players:["Kyu Blu Kelly","Darien Porter"]},
    {pos:"NB",   players:["Jeremy Chinn","Greedy Vance","Darnay Holmes"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Daniel Carlson"]},
    {pos:"PT", players:["AJ Cole"]},
    {pos:"LS", players:["Jacob Bobenmoyer"]},
    {pos:"H",  players:["AJ Cole"]},
    {pos:"KO", players:["Daniel Carlson"]},
    {pos:"PR", players:["Alex Bachman","Tre Tucker"]},
    {pos:"KR", players:["Raheem Mostert","Dylan Laube","Zamir White"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"Klint Kubiak",oc:"Vacant",dc:"Vacant",stc:"Vacant"},
};

export { LV_CAP, LV_DEPTH_CHART };
