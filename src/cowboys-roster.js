// Dallas Cowboys 2026 Roster & Depth Chart
// SOURCES: Ourlads.com (updated 02/04/2026), Over The Cap
// Cap Ceiling: $304,000,000 | Total Liabilities: $362,568,427 | Top 51: $333,651,367
// HC: Brian Schottenheimer | 2025 Record: 7-9-1 (Missed Playoffs)

const DAL_CAP = {
  capSpace: -29168257, capCeiling: 304000000,
  offenseSpend: 206082117, defenseSpend: 126558800, specialSpend: 5583333,
  activeContracts: 54,
  keyQuestions: [
    "Currently $29.2M OVER the cap — restructures of Dak ($31M savings), Lamb ($20M), Tyler Smith ($18.6M) expected",
    "George Pickens franchise tag or extension — 93 rec, 1,429 yds in 2025; top priority to re-sign",
    "Kenny Clark $21.5M cap hit with no guaranteed money — cut/trade candidate to save cap space",
    "Brandon Aubrey RFA — elite kicker needs new deal; Javonte Williams UFA at RB",
    "New DC Christian Parker replacing Vic Fangio-style scheme; safety position in flux (Hooker aging, Downs draft target)",
  ],
};

const DAL_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Dak Prescott","Joe Milton III"]},
    {pos:"RB",  players:["Javonte Williams","Malik Davis","Miles Sanders","Jaydon Blue","Phil Mafah"]},
    {pos:"FB",  players:["Hunter Luepke"]},
    {pos:"LWR", players:["George Pickens","Jonathan Mingo"]},
    {pos:"RWR", players:["CeeDee Lamb","Jalen Tolbert"]},
    {pos:"SWR", players:["Ryan Flournoy","KaVontae Turpin"]},
    {pos:"TE",  players:["Jake Ferguson","Luke Schoonmaker","Brevyn Spann-Ford"]},
    {pos:"LT",  players:["Tyler Guyton","Nate Thomas"]},
    {pos:"LG",  players:["Tyler Smith","Trevor Keegan","Rob Jones"]},
    {pos:"C",   players:["Cooper Beebe","Brock Hoffman"]},
    {pos:"RG",  players:["Tyler Booker","T.J. Bass"]},
    {pos:"RT",  players:["Terence Steele","Hakeem Adeniji","Ajani Cornelius"]},
  ],
  defense: [
    {pos:"DE",   players:["Osa Odighizuwa","Solomon Thomas"]},
    {pos:"NT",   players:["Kenny Clark","Jay Toia"]},
    {pos:"DT",   players:["Quinnen Williams","Perrion Winfrey"]},
    {pos:"LOLB", players:["Jadeveon Clowney","Dante Fowler Jr.","James Houston"]},
    {pos:"LILB", players:["DeMarvion Overshown","Jack Sanborn","Shemar James"]},
    {pos:"RILB", players:["Kenneth Murray Jr.","Logan Wilson","Marist Liufau"]},
    {pos:"ROLB", players:["Donovan Ezeiruaku","Sam Williams","Payton Turner"]},
    {pos:"LCB",  players:["DaRon Bland","Trikweze Bridges","Josh Butler"]},
    {pos:"SS",   players:["Donovan Wilson","Markquese Bell"]},
    {pos:"FS",   players:["Malik Hooker","Juanyeh Thomas","Alijah Clark"]},
    {pos:"RCB",  players:["Shavon Revel Jr.","Caelen Carson","C.J. Goodwin"]},
    {pos:"NB",   players:["Reddy Steward","Corey Ballentine"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Brandon Aubrey"]},
    {pos:"PT", players:["Bryan Anger"]},
    {pos:"LS", players:["Trent Sieg"]},
    {pos:"H",  players:["Bryan Anger"]},
    {pos:"KO", players:["Brandon Aubrey"]},
    {pos:"PR", players:["KaVontae Turpin","Jalen Tolbert"]},
    {pos:"KR", players:["KaVontae Turpin","Jalen Tolbert","Jaydon Blue"]},
  ],
  scheme: {offense:"11 Personnel (3 WR)",defense:"Base 3-4"},
  coaching: {hc:"Brian Schottenheimer",oc:"Klayton Adams",dc:"Christian Parker",stc:"Nick Sorensen"},
};

export { DAL_CAP, DAL_DEPTH_CHART };
