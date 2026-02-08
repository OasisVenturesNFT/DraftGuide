// New England Patriots 2026 Roster & Contracts
// Source: Over The Cap, Spotrac, Ourlads Depth Chart (Feb 7, 2026)
// Cap Ceiling: $304,000,000 (projected)
// Total Cap Liabilities: $311,526,213
// Top 51 Cap: $290,735,831
// Team Cap Space: $42,735,263
// Offense: $144,220,011 | Defense: $143,226,667 | Special: $3,289,153
// GM: Eliot Wolf (since 2024)
// 2025 Record: 14-3 (AFC East Champions, #2 seed, Super Bowl LX)

// n=name, p=position, dp=depth chart position, age=2026 age, cap=2026 cap hit ($), base=base salary, dead=dead money if cut pre June 1, savings=cap savings if cut pre June 1, yrs=years remaining, gtd=guaranteed salary remaining, starter=true/false
const NE_ROSTER = [
// === OFFENSE ===
// Quarterbacks
{n:"Drake Maye",p:"QB",dp:"QB1",age:24,cap:9992663,base:1075000,dead:21650770,savings:-11658107,yrs:2,gtd:4125888,starter:true},
{n:"Joshua Dobbs",p:"QB",dp:"QB2",age:31,cap:4750000,base:3200000,dead:1050000,savings:3700000,yrs:1,gtd:0,starter:false},

// Running Backs
{n:"Rhamondre Stevenson",p:"RB",dp:"RB1",age:28,cap:7423529,base:4750000,dead:8050000,savings:-626471,yrs:2,gtd:3250000,starter:true},
{n:"TreVeyon Henderson",p:"RB",dp:"RB2",age:23,cap:2532559,base:1346512,dead:9117213,savings:-6584654,yrs:3,gtd:1346512,starter:false},
{n:"Antonio Gibson",p:"RB",dp:"RB3",age:28,cap:4140000,base:2850000,dead:1000000,savings:3140000,yrs:1,gtd:0,starter:false},

// Wide Receivers
{n:"Stefon Diggs",p:"WR",dp:"Slot",age:33,cap:26500000,base:20600000,dead:9700000,savings:16800000,yrs:2,gtd:1700000,starter:true},
{n:"Kayshon Boutte",p:"WR",dp:"LWR",age:24,cap:3651816,base:3605000,dead:46816,savings:3605000,yrs:1,gtd:0,starter:true},
{n:"Mack Hollins",p:"WR",dp:"RWR",age:31,cap:5150000,base:2900000,dead:750000,savings:4400000,yrs:1,gtd:0,starter:true},
{n:"DeMario Douglas",p:"WR",dp:"WR4",age:25,cap:3638333,base:3605000,dead:33333,savings:3605000,yrs:1,gtd:0,starter:false},
{n:"Kyle Williams",p:"WR",dp:"WR5",age:23,cap:1523539,base:1144708,dead:1136493,savings:387046,yrs:3,gtd:0,starter:false},
{n:"Efton Chism III",p:"WR",dp:"WR6",age:22,cap:1013333,base:1005000,dead:16667,savings:996666,yrs:3,gtd:0,starter:false},

// Tight Ends
{n:"Hunter Henry",p:"TE",dp:"TE1",age:31,cap:11750000,base:7150000,dead:2500000,savings:9250000,yrs:1,gtd:0,starter:true},

// Offensive Line
{n:"Will Campbell",p:"OT",dp:"LT",age:22,cap:9923204,base:1005000,dead:35723535,savings:-25800331,yrs:3,gtd:2824641,starter:true},
{n:"Jared Wilson",p:"IOL",dp:"LG",age:23,cap:1410780,base:1122156,dead:865872,savings:544908,yrs:3,gtd:0,starter:true},
{n:"Garrett Bradbury",p:"IOL",dp:"C",age:30,cap:6900000,base:3700000,dead:1200000,savings:5700000,yrs:1,gtd:0,starter:true},
{n:"Michael Onwenu",p:"IOL",dp:"RG",age:28,cap:25000000,base:16000000,dead:7500000,savings:17500000,yrs:2,gtd:0,starter:true},
{n:"Morgan Moses",p:"OT",dp:"RT",age:34,cap:10400000,base:6500000,dead:7300000,savings:3100000,yrs:2,gtd:4500000,starter:true},
{n:"Caedan Wallace",p:"OT",dp:"Swing T",age:25,cap:1648174,base:1344392,dead:607564,savings:1040610,yrs:2,gtd:0,starter:false},
{n:"Ben Brown",p:"IOL",dp:"IOL Backup",age:26,cap:1966666,base:1200000,dead:1933334,savings:33332,yrs:2,gtd:1200000,starter:false},

// === DEFENSE ===
// Defensive Line
{n:"Milton Williams",p:"DL",dp:"DE",age:27,cap:28400000,base:21000000,dead:39000000,savings:-10600000,yrs:3,gtd:21000000,starter:true},
{n:"Christian Barmore",p:"DL",dp:"DT",age:26,cap:17100000,base:12000000,dead:12800000,savings:4300000,yrs:3,gtd:2000000,starter:true},
{n:"Cory Durden",p:"DL",dp:"NT",age:27,cap:1145000,base:1145000,dead:0,savings:1145000,yrs:1,gtd:0,starter:true},
{n:"Joshua Farmer",p:"DL",dp:"DL Rot",age:24,cap:1171454,base:1005000,dead:499362,savings:672092,yrs:3,gtd:0,starter:false},
{n:"Eric Gregory",p:"DL",dp:"DL Rot",age:25,cap:1005000,base:1005000,dead:0,savings:1005000,yrs:1,gtd:0,starter:false},

// Edge Rushers
{n:"Harold Landry III",p:"EDGE",dp:"LOLB",age:30,cap:16350000,base:11000000,dead:19000000,savings:-2650000,yrs:2,gtd:11000000,starter:true},
{n:"K'Lavon Chaisson",p:"EDGE",dp:"ROLB",age:27,cap:0,base:0,dead:0,savings:0,yrs:1,gtd:0,starter:true},
{n:"Anfernee Jennings",p:"EDGE",dp:"Edge Rot",age:28,cap:4867647,base:3000000,dead:1000000,savings:3867647,yrs:1,gtd:0,starter:false},
{n:"Elijah Ponder",p:"EDGE",dp:"Edge Rot",age:24,cap:1010000,base:1005000,dead:10000,savings:1000000,yrs:3,gtd:0,starter:false},

// Linebackers
{n:"Robert Spillane",p:"LB",dp:"LILB",age:29,cap:12320000,base:8300000,dead:14300000,savings:-1980000,yrs:2,gtd:8300000,starter:true},
{n:"Christian Elliss",p:"LB",dp:"RILB",age:27,cap:8555000,base:6750000,dead:3500000,savings:5055000,yrs:2,gtd:2250000,starter:true},
{n:"Jahlani Tavai",p:"LB",dp:"LB Rot",age:28,cap:5223162,base:3000000,dead:3487500,savings:1735662,yrs:2,gtd:600000,starter:false},
{n:"Chad Muma",p:"LB",dp:"LB Rot",age:26,cap:1240000,base:1215000,dead:0,savings:1240000,yrs:1,gtd:0,starter:false},

// Cornerbacks
{n:"Carlton Davis III",p:"CB",dp:"LCB",age:29,cap:22000000,base:13000000,dead:24000000,savings:-2000000,yrs:3,gtd:13000000,starter:true},
{n:"Christian Gonzalez",p:"CB",dp:"RCB",age:23,cap:4805458,base:2259482,dead:4805458,savings:0,yrs:1,gtd:2809482,starter:true},
{n:"Marcus Jones",p:"CB",dp:"Nickel",age:26,cap:6702500,base:2750000,dead:14942500,savings:-8240000,yrs:3,gtd:3770000,starter:true},
{n:"Marcellas Dial",p:"CB",dp:"CB4",age:25,cap:1128032,base:1075000,dead:106064,savings:1021968,yrs:2,gtd:0,starter:false},
{n:"Charles Woods",p:"CB",dp:"CB5",age:26,cap:1075000,base:1075000,dead:0,savings:1075000,yrs:1,gtd:0,starter:false},
{n:"Kobee Minor",p:"CB",dp:"CB6",age:23,cap:1005000,base:1005000,dead:0,savings:1005000,yrs:3,gtd:0,starter:false},

// Safeties
{n:"Kyle Dugger",p:"S",dp:"FS",age:30,cap:0,base:0,dead:0,savings:0,yrs:1,gtd:0,starter:true},
{n:"Craig Woodson",p:"S",dp:"SS",age:24,cap:1271614,base:1005000,dead:799842,savings:471772,yrs:3,gtd:0,starter:true},
{n:"Marte Mapu",p:"S",dp:"S3",age:25,cap:1770271,base:1508688,dead:261583,savings:1508688,yrs:1,gtd:0,starter:false},
{n:"Dell Pettus",p:"S",dp:"S4",age:25,cap:1078000,base:1075000,dead:3000,savings:1075000,yrs:1,gtd:0,starter:false},

// === SPECIAL TEAMS ===
{n:"Bryce Baringer",p:"P",dp:"P",age:26,cap:1189614,base:1145000,dead:44614,savings:1145000,yrs:1,gtd:0,starter:true},
{n:"Andres Borregales",p:"K",dp:"K",age:24,cap:1069121,base:1005000,dead:192363,savings:876758,yrs:3,gtd:0,starter:true},
{n:"Brenden Schooler",p:"ST",dp:"LS/ST",age:28,cap:2998529,base:2000000,dead:1450000,savings:1548529,yrs:2,gtd:500000,starter:true},

// === DEPTH / RESERVES ===
{n:"Marcus Bryant",p:"EDGE",dp:"Depth",age:24,cap:1042082,base:1005000,dead:111246,savings:930836,yrs:3,gtd:0,starter:false},
{n:"Julian Ashby",p:"DL",dp:"Depth",age:24,cap:1030418,base:1005000,dead:76254,savings:954164,yrs:3,gtd:0,starter:false},
{n:"Terrell Jennings",p:"LB",dp:"Depth",age:24,cap:1075000,base:1075000,dead:0,savings:1075000,yrs:1,gtd:0,starter:false},
];

// Salary cap summary
const NE_CAP = {
  capCeiling: 304000000,
  totalLiabilities: 311526213,
  top51: 290735831,
  capSpace: 42735263,
  offenseSpend: 144220011,
  defenseSpend: 143226667,
  specialSpend: 3289153,
  activeContracts: 50,
  draftPicks: 11,
  record2025: "14-3",
  seed: "#2 AFC",
  result: "Super Bowl LX",
  gm: "Eliot Wolf",
  // Restructure candidates (from Spotrac analysis)
  restructurePotential: [
    {n:"Milton Williams",savings:17500000,note:"Converting 2026 salary to bonus + void years"},
    {n:"Carlton Davis III",savings:12600000,note:"Converting 2026 salary to bonus + void years"},
    {n:"Harold Landry III",savings:9000000,note:"Converting 2026 salary to bonus + void years"},
    {n:"Robert Spillane",savings:6600000,note:"Converting 2026 salary to bonus + void years"},
  ],
  // Key questions (from Spotrac offseason analysis)
  keyQuestions: [
    "Off-field allegations for WR Stefon Diggs and DL Christian Barmore — impact on roster decisions?",
    "WRs Kayshon Boutte & DeMario Douglas entering contract years — core pieces or seek WR1?",
    "Christian Gonzalez 5th-year option ($17.5M estimated) — lock-in decision upcoming",
    "Antonio Gibson likely cut candidate ($3.5M savings) after torn ACL + Henderson/Stevenson emergence",
  ],
};

// Depth Chart - sourced from Ourlads.com (updated 02/07/2026)
// Base Offense: 11 Personnel (1 RB, 1 TE) — 61% usage
// Base Defense: 3-3 Nickel
const NE_DEPTH_CHART = {
  offense: [
    {pos:"QB",  players:["Drake Maye","Joshua Dobbs","Tommy DeVito"]},
    {pos:"RB",  players:["Rhamondre Stevenson","TreVeyon Henderson","D'Ernest Johnson"]},
    {pos:"FB",  players:["Jack Westover"]},
    {pos:"LWR", players:["Kayshon Boutte","Kyle Williams"]},
    {pos:"SWR", players:["Stefon Diggs","DeMario Douglas"]},
    {pos:"RWR", players:["Mack Hollins","Efton Chism III"]},
    {pos:"TE",  players:["Hunter Henry","Austin Hooper","CJ Dippre"]},
    {pos:"LT",  players:["Will Campbell","Vederian Lowe"]},
    {pos:"LG",  players:["Jared Wilson","Ben Brown"]},
    {pos:"C",   players:["Garrett Bradbury"]},
    {pos:"RG",  players:["Michael Onwenu","Caedan Wallace"]},
    {pos:"RT",  players:["Morgan Moses","Thayer Munford Jr.","Marcus Bryant"]},
  ],
  defense: [
    {pos:"DE",   players:["Milton Williams"]},
    {pos:"NT",   players:["Khyiris Tonga","Cory Durden"]},
    {pos:"DT",   players:["Christian Barmore","Leonard Taylor III"]},
    {pos:"LOLB", players:["Harold Landry III","Elijah Ponder"]},
    {pos:"LILB", players:["Robert Spillane","Jack Gibbens","Marte Mapu"]},
    {pos:"RILB", players:["Christian Elliss","Jahlani Tavai","Chad Muma"]},
    {pos:"ROLB", players:["K'Lavon Chaisson","Anfernee Jennings","Bradyn Swinson"]},
    {pos:"LCB",  players:["Carlton Davis III","Alex Austin","Kobee Minor"]},
    {pos:"RCB",  players:["Christian Gonzalez","Marcellas Dial"]},
    {pos:"Nickel",players:["Marcus Jones","Charles Woods"]},
    {pos:"SS",   players:["Craig Woodson","Dell Pettus"]},
    {pos:"FS",   players:["Kyle Dugger","Marte Mapu"]},
  ],
  specialTeams: [
    {pos:"K",  players:["Andres Borregales"]},
    {pos:"P",  players:["Bryce Baringer"]},
    {pos:"LS", players:["Brenden Schooler"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE) — 61% usage",defense:"Base 3-3 Nickel"},
  coaching: {hc:"Mike Vrabel",oc:"Josh McDaniels",dc:"Terrell Williams"},
};

export { NE_ROSTER, NE_CAP, NE_DEPTH_CHART };
