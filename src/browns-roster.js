// Cleveland Browns 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 01/09/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $329,662,525 | Top 51: $294,358,677
// HC: Todd Monken | 2025 Record: 3-14 (Last in AFC North)

const CLE_CAP = {
  capSpace: 3210721, capCeiling: 304000000,
  offenseSpend: 183300292, defenseSpend: 113713385, specialSpend: 885000,
  activeContracts: 55,
  keyQuestions: [
    "Only $3.2M cap space — Deshaun Watson's $73M dead money albatross cripples flexibility",
    "Shedeur Sanders + Dillon Gabriel + Watson = 3 QBs on roster, who starts under Monken?",
    "Mason Graham #4 pick anchors D-line with Myles Garrett — elite pass rush tandem",
    "Entire starting OL (Bitonio, Teller, Pocic, Robinson, Conklin) are UFAs — full rebuild needed",
  ],
};

const CLE_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Shedeur Sanders","Dillon Gabriel","Deshaun Watson"]},
    {pos:"RB",  players:["Quinshon Judkins","Dylan Sampson","Jerome Ford","Raheim Sanders","Trayveon Williams"]},
    {pos:"LWR", players:["Jerry Jeudy","Jamari Thrash"]},
    {pos:"RWR", players:["Cedric Tillman","Gage Larvadain"]},
    {pos:"SWR", players:["Isaiah Bond","Malachi Corley","DeAndre Carter"]},
    {pos:"TE",  players:["Harold Fannin Jr.","David Njoku","Blake Whiteheart","Brenden Bates"]},
    {pos:"LT",  players:["Cam Robinson","Dawand Jones","Cornelius Lucas"]},
    {pos:"LG",  players:["Joel Bitonio","Zak Zinter","Kendrick Green"]},
    {pos:"C",   players:["Ethan Pocic","Luke Wypler","Kingsley Eguakun","Justin Osborne"]},
    {pos:"RG",  players:["Wyatt Teller","Teven Jenkins"]},
    {pos:"RT",  players:["Jack Conklin","KT Leveston","Jeremiah Byers"]},
  ],
  defense: [
    {pos:"LDE",  players:["Alex Wright","Isaiah McGuire"]},
    {pos:"LDT",  players:["Maliek Collins","Shelby Harris","Adin Huntington"]},
    {pos:"RDT",  players:["Mason Graham","Mike Hall Jr.","Sam Kamara"]},
    {pos:"RDE",  players:["Myles Garrett","Cameron Thomas"]},
    {pos:"WLB",  players:["Devin Bush","Jeremiah Owusu-Koramoah","Mohamoud Diabate","Easton Mascarenas-Arnold"]},
    {pos:"MLB",  players:["Carson Schwesinger","Jerome Baker","Winston Reid","Nathaniel Watson","Edefuan Ulofoshio"]},
    {pos:"LCB",  players:["Denzel Ward","Dom Jones","Sam Webb","Anthony Kendall"]},
    {pos:"SS",   players:["Grant Delpit","Rayshawn Jenkins","Christopher Edmonds"]},
    {pos:"FS",   players:["Ronnie Hickman","Donovan McMillon"]},
    {pos:"RCB",  players:["Tyson Campbell","Martin Emerson Jr.","D'Angelo Ross"]},
    {pos:"NB",   players:["Myles Harden","Tre Avery"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Andre Szmyt"]},
    {pos:"PT", players:["Corey Bojorquez"]},
    {pos:"LS", players:["Rex Sunahara"]},
    {pos:"H",  players:["Corey Bojorquez"]},
    {pos:"KO", players:["Andre Szmyt"]},
    {pos:"PR", players:["DeAndre Carter","Gage Larvadain","Isaiah Bond"]},
    {pos:"KR", players:["DeAndre Carter","Malachi Corley","Dylan Sampson"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE)",defense:"Base 4-2"},
  coaching: {hc:"Todd Monken",oc:"Travis Switzer",dc:"Vacant",stc:"Vacant"},
};

export { CLE_CAP, CLE_DEPTH_CHART };
