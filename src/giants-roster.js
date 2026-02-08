// New York Giants 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/23/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $302,346,728 | Top 51: $296,689,591
// HC: John Harbaugh | 2025 Record: 4-13 (Last in NFC East)

const NYG_CAP = {
  capSpace: 6947721, capCeiling: 304000000,
  offenseSpend: 104938437, defenseSpend: 187131586, specialSpend: 10059901,
  activeContracts: 52,
  keyQuestions: [
    "Only $6.9M cap space but just $217K dead money (2nd-lowest in NFL) — clean books for future",
    "New HC John Harbaugh + OC Matt Nagy + DC Dennard Wilson = complete coaching overhaul after Daboll era",
    "Jaxson Dart Year 2 — invested heavily around rookie QB with Cam Skattebo (R1), Abdul Carter (R1)",
    "Brian Burns $34.8M + Dexter Lawrence $27M cap hits = elite D-line but eat 20% of cap",
    "Restructure potential of $61–127M available; Bobby Okereke ($9M), Jon Runyan ($9.25M) = cut candidates",
  ],
};

const NYG_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Jaxson Dart","Jameis Winston","Russell Wilson"]},
    {pos:"RB",  players:["Cam Skattebo","Tyrone Tracy Jr.","Devin Singletary","Eric Gray","Dante Miller"]},
    {pos:"LWR", players:["Malik Nabers","Isaiah Hodgins","Dalen Cambre"]},
    {pos:"RWR", players:["Darius Slayton","Beaux Collins","Jalin Hyatt"]},
    {pos:"SWR", players:["Wan'Dale Robinson","Gunner Olszewski","Xavier Gipson","Ryan Miller"]},
    {pos:"TE",  players:["Theo Johnson","Daniel Bellinger","Chris Manhertz","Thomas Fidone II"]},
    {pos:"LT",  players:["Andrew Thomas","Marcus Mbow"]},
    {pos:"LG",  players:["Jon Runyan","Aaron Stinnie","Joshua Ezeudu"]},
    {pos:"C",   players:["John Michael Schmitz Jr.","Austin Schlottmann","Bryan Hudson"]},
    {pos:"RG",  players:["Greg Van Roten","Evan Neal"]},
    {pos:"RT",  players:["Jermaine Eluemunor","James Hudson III"]},
  ],
  defense: [
    {pos:"LDE",  players:["Brian Burns","Chauncey Golston","Victor Dimukeje","Caleb Murphy"]},
    {pos:"NT",   players:["Dexter Lawrence","Darius Alexander","D.J. Davidson"]},
    {pos:"DT",   players:["Roy Robertson-Harris","Rakeem Nuñez-Roches","Elijah Chatman"]},
    {pos:"RDE",  players:["Abdul Carter","Kayvon Thibodeaux","Tomon Fox"]},
    {pos:"WLB",  players:["Micah McFadden","Darius Muasau","Chris Board"]},
    {pos:"MLB",  players:["Bobby Okereke","Demetrius Flannigan-Fowles","Zaire Barnes"]},
    {pos:"LCB",  players:["Paulson Adebo","Deonte Banks","Korie Black"]},
    {pos:"SS",   players:["Tyler Nubin","Dane Belton","Beau Brade"]},
    {pos:"FS",   players:["Jevón Holland","Raheem Layne","Anthony Johnson Jr."]},
    {pos:"RCB",  players:["Cor'Dale Flott","Rico Payton","Jarrick Bernard-Converse"]},
    {pos:"NB",   players:["Dru Phillips","Nic Jones","TJ Moore"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Graham Gano","Ben Sauls"]},
    {pos:"PT", players:["Jamie Gillan"]},
    {pos:"LS", players:["Casey Kreiter"]},
    {pos:"H",  players:["Jamie Gillan"]},
    {pos:"KO", players:["Graham Gano"]},
    {pos:"PR", players:["Gunner Olszewski","Jevón Holland"]},
    {pos:"KR", players:["Gunner Olszewski","Deonte Banks","Devin Singletary"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 4-3"},
  coaching: {hc:"John Harbaugh",oc:"Matt Nagy",dc:"Dennard Wilson",stc:"Chris Horton"},
};

export { NYG_CAP, NYG_DEPTH_CHART };
