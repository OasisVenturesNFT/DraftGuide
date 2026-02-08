// Cincinnati Bengals 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/10/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $257,145,115 | Top 51: $244,308,560
// HC: Zac Taylor | 2025 Record: 7-10 (Missed Playoffs 3rd straight year)

const CIN_CAP = {
  capSpace: 56120880, capCeiling: 304000000,
  offenseSpend: 167623610, defenseSpend: 77706617, specialSpend: 7066666,
  activeContracts: 48,
  keyQuestions: [
    "$56.1M cap space + top-10 pick — Bengals must invest heavily in defense (worst scoring D in NFL)",
    "Trey Hendrickson UFA and likely gone — 61 sacks in 4 years, pass rush identity vanishes",
    "Burrow/Chase/Higgins Big 3 eating $100M+ — offense is elite but defense hemorrhages points",
    "New OC Dan Pitcher replacing Callahan; DC Al Golden must fix historically bad unit",
  ],
};

const CIN_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Joe Burrow","Joe Flacco","Jake Browning"]},
    {pos:"RB",  players:["Chase Brown","Samaje Perine","Tahj Brooks"]},
    {pos:"LWR", players:["Ja'Marr Chase","Ke'Shawn Williams"]},
    {pos:"RWR", players:["Tee Higgins","Mitch Tinsley"]},
    {pos:"SWR", players:["Andrei Iosivas","Charlie Jones"]},
    {pos:"TE",  players:["Mike Gesicki","Drew Sample","Noah Fant","Erick All Jr.","Tanner Hudson","Cam Grandy"]},
    {pos:"LT",  players:["Orlando Brown Jr."]},
    {pos:"LG",  players:["Dylan Fairchild","Cordell Volson"]},
    {pos:"C",   players:["Ted Karras","Lucas Patrick","Matt Lee"]},
    {pos:"RG",  players:["Dalton Risner","Jalen Rivers"]},
    {pos:"RT",  players:["Amarius Mims","Cody Ford"]},
  ],
  defense: [
    {pos:"LDE",  players:["Joseph Ossai","Myles Murphy","Cam Sample","Isaiah Foskey"]},
    {pos:"LDT",  players:["T.J. Slaton Jr.","McKinnley Jackson","Jordan Jefferson"]},
    {pos:"RDT",  players:["B.J. Hill","Kris Jenkins Jr."]},
    {pos:"RDE",  players:["Trey Hendrickson","Shemar Stewart","Cedric Johnson"]},
    {pos:"WLB",  players:["Demetrius Knight Jr.","Oren Burks","Brian Asamoah II"]},
    {pos:"MLB",  players:["Barrett Carter","Shaka Heyward","Joe Giles-Harris"]},
    {pos:"LCB",  players:["Cam Taylor-Britt","Josh Newton","Marco Wilson"]},
    {pos:"SS",   players:["Jordan Battle","Tycen Anderson"]},
    {pos:"FS",   players:["Geno Stone","PJ Jules","Daijahn Anthony"]},
    {pos:"RCB",  players:["DJ Turner II","DJ Ivey"]},
    {pos:"NB",   players:["Dax Hill","Jalen Davis"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Evan McPherson"]},
    {pos:"PT", players:["Ryan Rehkow"]},
    {pos:"LS", players:["William Wagner"]},
    {pos:"H",  players:["Ryan Rehkow"]},
    {pos:"KO", players:["Evan McPherson"]},
    {pos:"PR", players:["Charlie Jones","Mitch Tinsley","Ke'Shawn Williams"]},
    {pos:"KR", players:["Charlie Jones","Samaje Perine","Tahj Brooks"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"Zac Taylor",oc:"Dan Pitcher",dc:"Al Golden",stc:"Darrin Simmons"},
};

export { CIN_CAP, CIN_DEPTH_CHART };
