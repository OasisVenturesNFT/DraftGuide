// New England Patriots 2026 Roster & Contracts
// SOURCES:
//   Ourlads.com depth chart (updated 02/07/2026) — SOURCE OF TRUTH for roster & depth
//   Over The Cap (overthecap.com) — financial data (cap hits, base salary, dead money, savings)
//   DC correction: Zak Kuhr (Terrell Williams out with cancer) — per user verification
//
// PROCESS: Every player below appears on Ourlads depth chart/roster/IR.
//          OTC financials matched by player name. Players on Ourlads but NOT on OTC are flagged.
//          Players on OTC but NOT on Ourlads are excluded (e.g. Kyle Dugger = dead money only).
//
// Cap Ceiling: $304,000,000 (projected)
// Total Cap Liabilities: $311,526,213
// Top 51 Cap: $290,735,831
// Team Cap Space: $42,735,263
// Offense: $144,220,011 | Defense: $143,226,667 | Special: $3,289,153
// GM: Eliot Wolf (since 2024)
// 2025 Record: 14-3 (AFC East Champions, #2 seed, Super Bowl LX)

// n=name, p=position, dp=depth chart position (from Ourlads), num=jersey number
// cap=2026 cap hit, base=base salary, dead=dead money if cut pre June 1, savings=cap savings if cut pre June 1
// gtd=guaranteed salary remaining, starter=true if listed as Player 1 at position on Ourlads
// status="active"|"IR"|"PS"|"PS/IR"|"DFR"
// FLAG = player on Ourlads but NOT found on OTC contract table — needs manual review

const NE_ROSTER = [
// ===================== OFFENSE =====================
// --- Quarterbacks ---
{n:"Drake Maye",p:"QB",dp:"QB1",num:10,cap:9992663,base:1075000,dead:21650770,savings:-11658107,gtd:4125888,starter:true,status:"active"},
{n:"Joshua Dobbs",p:"QB",dp:"QB2",num:11,cap:4750000,base:3200000,dead:1050000,savings:3700000,gtd:0,starter:false,status:"active"},
{n:"Tommy DeVito",p:"QB",dp:"QB3",num:16,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},

// --- Running Backs ---
{n:"Rhamondre Stevenson",p:"RB",dp:"RB1",num:38,cap:7423529,base:4750000,dead:8050000,savings:-626471,gtd:3250000,starter:true,status:"active"},
{n:"TreVeyon Henderson",p:"RB",dp:"RB2",num:32,cap:2532559,base:1346512,dead:9117213,savings:-6584654,gtd:1346512,starter:false,status:"active"},
{n:"D'Ernest Johnson",p:"RB",dp:"RB3",num:34,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},
{n:"Jack Westover",p:"FB",dp:"FB1",num:37,cap:0,base:0,dead:0,savings:0,gtd:0,starter:true,status:"active",flag:true},

// --- Wide Receivers ---
{n:"Kayshon Boutte",p:"WR",dp:"LWR1",num:9,cap:3651816,base:3605000,dead:46816,savings:3605000,gtd:0,starter:true,status:"active"},
{n:"Kyle Williams",p:"WR",dp:"LWR2",num:18,cap:1523539,base:1144708,dead:1136493,savings:387046,gtd:0,starter:false,status:"active"},
{n:"Mack Hollins",p:"WR",dp:"RWR1",num:13,cap:5150000,base:2900000,dead:750000,savings:4400000,gtd:0,starter:true,status:"active"},
{n:"Efton Chism III",p:"WR",dp:"RWR2",num:86,cap:1013333,base:1005000,dead:16667,savings:996666,gtd:0,starter:false,status:"active"},
{n:"Stefon Diggs",p:"WR",dp:"SWR1",num:8,cap:26500000,base:20600000,dead:9700000,savings:16800000,gtd:1700000,starter:true,status:"active"},
{n:"DeMario Douglas",p:"WR",dp:"SWR2",num:3,cap:3638333,base:3605000,dead:33333,savings:3605000,gtd:0,starter:false,status:"active"},

// --- Tight Ends ---
{n:"Hunter Henry",p:"TE",dp:"TE1",num:85,cap:11750000,base:7150000,dead:2500000,savings:9250000,gtd:0,starter:true,status:"active"},
{n:"Austin Hooper",p:"TE",dp:"TE2",num:81,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},
{n:"CJ Dippre",p:"TE",dp:"TE3",num:82,cap:1005000,base:1005000,dead:0,savings:1005000,gtd:0,starter:false,status:"active"},

// --- Offensive Line ---
{n:"Will Campbell",p:"OT",dp:"LT1",num:66,cap:9923204,base:1005000,dead:35723535,savings:-25800331,gtd:2824641,starter:true,status:"active"},
{n:"Vederian Lowe",p:"OT",dp:"LT2",num:59,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},
{n:"Jared Wilson",p:"IOL",dp:"LG1",num:58,cap:1410780,base:1122156,dead:865872,savings:544908,gtd:0,starter:true,status:"active"},
{n:"Ben Brown",p:"IOL",dp:"LG2",num:77,cap:1966666,base:1200000,dead:1933334,savings:33332,gtd:1200000,starter:false,status:"active"},
{n:"Garrett Bradbury",p:"IOL",dp:"C1",num:65,cap:6900000,base:3700000,dead:1200000,savings:5700000,gtd:0,starter:true,status:"active"},
{n:"Michael Onwenu",p:"IOL",dp:"RG1",num:71,cap:25000000,base:16000000,dead:7500000,savings:17500000,gtd:0,starter:true,status:"active"},
{n:"Caedan Wallace",p:"OT",dp:"RG2",num:70,cap:1648174,base:1344392,dead:607564,savings:1040610,gtd:0,starter:false,status:"active"},
{n:"Morgan Moses",p:"OT",dp:"RT1",num:76,cap:10400000,base:6500000,dead:7300000,savings:3100000,gtd:4500000,starter:true,status:"active"},
{n:"Thayer Munford Jr.",p:"OT",dp:"RT2",num:74,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},
{n:"Marcus Bryant",p:"OT",dp:"RT3",num:52,cap:1042082,base:1005000,dead:111246,savings:930836,gtd:0,starter:false,status:"active"},

// ===================== DEFENSE =====================
// --- Defensive Line ---
{n:"Milton Williams",p:"DL",dp:"DE1",num:97,cap:28400000,base:21000000,dead:39000000,savings:-10600000,gtd:21000000,starter:true,status:"active"},
{n:"Khyiris Tonga",p:"DL",dp:"NT1",num:95,cap:0,base:0,dead:0,savings:0,gtd:0,starter:true,status:"active",flag:true},
{n:"Cory Durden",p:"DL",dp:"NT2",num:94,cap:1145000,base:1145000,dead:0,savings:1145000,gtd:0,starter:false,status:"active"},
{n:"Christian Barmore",p:"DL",dp:"DT1",num:90,cap:17100000,base:12000000,dead:12800000,savings:4300000,gtd:2000000,starter:true,status:"active"},
{n:"Leonard Taylor III",p:"DL",dp:"DT2",num:93,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},

// --- Edge Rushers ---
{n:"Harold Landry III",p:"EDGE",dp:"LOLB1",num:2,cap:16350000,base:11000000,dead:19000000,savings:-2650000,gtd:11000000,starter:true,status:"active"},
{n:"Elijah Ponder",p:"EDGE",dp:"LOLB2",num:91,cap:1010000,base:1005000,dead:10000,savings:1000000,gtd:0,starter:false,status:"active"},
{n:"K'Lavon Chaisson",p:"EDGE",dp:"ROLB1",num:44,cap:0,base:0,dead:0,savings:0,gtd:0,starter:true,status:"active",flag:true},
{n:"Anfernee Jennings",p:"EDGE",dp:"ROLB2",num:33,cap:4867647,base:3000000,dead:1000000,savings:3867647,gtd:0,starter:false,status:"active"},
{n:"Bradyn Swinson",p:"EDGE",dp:"ROLB3",num:43,cap:1005000,base:1005000,dead:0,savings:1005000,gtd:0,starter:false,status:"active"},

// --- Linebackers ---
{n:"Robert Spillane",p:"LB",dp:"LILB1",num:14,cap:12320000,base:8300000,dead:14300000,savings:-1980000,gtd:8300000,starter:true,status:"active"},
{n:"Jack Gibbens",p:"LB",dp:"LILB2",num:51,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},
{n:"Christian Elliss",p:"LB",dp:"RILB1",num:53,cap:8555000,base:6750000,dead:3500000,savings:5055000,gtd:2250000,starter:true,status:"active"},
{n:"Jahlani Tavai",p:"LB",dp:"RILB2",num:48,cap:5223162,base:3000000,dead:3487500,savings:1735662,gtd:600000,starter:false,status:"active"},
{n:"Chad Muma",p:"LB",dp:"RILB3",num:49,cap:1240000,base:1215000,dead:0,savings:1240000,gtd:0,starter:false,status:"active"},

// --- Cornerbacks ---
{n:"Carlton Davis III",p:"CB",dp:"LCB1",num:7,cap:22000000,base:13000000,dead:24000000,savings:-2000000,gtd:13000000,starter:true,status:"active"},
{n:"Alex Austin",p:"CB",dp:"LCB2",num:28,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"active",flag:true},
{n:"Kobee Minor",p:"CB",dp:"LCB3",num:19,cap:1005000,base:1005000,dead:0,savings:1005000,gtd:0,starter:false,status:"active"},
{n:"Christian Gonzalez",p:"CB",dp:"RCB1",num:0,cap:4805458,base:2259482,dead:4805458,savings:0,gtd:2809482,starter:true,status:"active"},
{n:"Charles Woods",p:"CB",dp:"RCB2",num:22,cap:1075000,base:1075000,dead:0,savings:1075000,gtd:0,starter:false,status:"active"},
{n:"Marcus Jones",p:"CB",dp:"NB1",num:25,cap:6702500,base:2750000,dead:14942500,savings:-8240000,gtd:3770000,starter:true,status:"active"},

// --- Safeties ---
{n:"Craig Woodson",p:"S",dp:"SS1",num:31,cap:1271614,base:1005000,dead:799842,savings:471772,gtd:0,starter:true,status:"active"},
{n:"Dell Pettus",p:"S",dp:"SS2",num:24,cap:1078000,base:1075000,dead:3000,savings:1075000,gtd:0,starter:false,status:"active"},
{n:"Jaylinn Hawkins",p:"S",dp:"FS1",num:21,cap:0,base:0,dead:0,savings:0,gtd:0,starter:true,status:"active",flag:true},
{n:"Brenden Schooler",p:"S",dp:"FS2",num:41,cap:2998529,base:2000000,dead:1450000,savings:1548529,gtd:500000,starter:false,status:"active"},
{n:"Marte Mapu",p:"S",dp:"LILB3",num:15,cap:1770271,base:1508688,dead:261583,savings:1508688,gtd:0,starter:false,status:"active"},

// ===================== SPECIAL TEAMS =====================
{n:"Bryce Baringer",p:"P",dp:"PT",num:17,cap:1189614,base:1145000,dead:44614,savings:1145000,gtd:0,starter:true,status:"active"},
{n:"Andres Borregales",p:"K",dp:"PK",num:36,cap:1069121,base:1005000,dead:192363,savings:876758,gtd:0,starter:true,status:"active"},
{n:"Julian Ashby",p:"LS",dp:"LS",num:47,cap:1030418,base:1005000,dead:76254,savings:954164,gtd:0,starter:true,status:"active"},

// ===================== INJURED RESERVE =====================
{n:"Brock Lampe",p:"FB",dp:"IR",num:46,cap:890000,base:885000,dead:10000,savings:880000,gtd:0,starter:false,status:"IR"},
{n:"Isaiah Iton",p:"DL",dp:"IR",num:68,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"IR",flag:true},
{n:"Marcellas Dial",p:"CB",dp:"IR",num:27,cap:1128032,base:1075000,dead:106064,savings:1021968,gtd:0,starter:false,status:"IR"},
{n:"Jaquelin Roy",p:"DL",dp:"IR",num:94,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"IR",flag:true},
{n:"Lan Larison",p:"RB",dp:"IR",num:34,cap:893333,base:885000,dead:16667,savings:876666,gtd:0,starter:false,status:"IR"},
{n:"Deneric Prince",p:"RB",dp:"IR",num:30,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"IR",flag:true},
{n:"Yasir Durant",p:"OT",dp:"IR",num:72,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"IR",flag:true},
{n:"Antonio Gibson",p:"RB",dp:"IR",num:4,cap:4140000,base:2850000,dead:1000000,savings:3140000,gtd:0,starter:false,status:"IR"},
{n:"Eric Gregory",p:"DL",dp:"IR",num:55,cap:1005000,base:1005000,dead:0,savings:1005000,gtd:0,starter:false,status:"IR"},
{n:"Terrell Jennings",p:"RB",dp:"IR",num:26,cap:1075000,base:1075000,dead:0,savings:1075000,gtd:0,starter:false,status:"IR"},

// ===================== PRACTICE SQUAD =====================
{n:"John Jiles",p:"WR",dp:"PS",num:83,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Jeremiah Webb",p:"WR",dp:"PS",num:29,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Trent Sherfield Sr.",p:"WR",dp:"PS",num:80,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Lorenz Metz",p:"OT",dp:"PS",num:72,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Andrew Rupcich",p:"IOL",dp:"PS",num:67,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Mehki Butler",p:"IOL",dp:"PS",num:63,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Brenden Jaimes",p:"IOL",dp:"PS",num:61,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Marshall Lang",p:"TE",dp:"PS",num:84,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Patrick Johnson",p:"EDGE",dp:"PS",num:45,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Jeremiah Pharms Jr.",p:"DL",dp:"PS",num:98,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Otis Reese",p:"LB",dp:"PS",num:54,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Amari Gainer",p:"LB",dp:"PS",num:99,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Miles Battle",p:"CB",dp:"PS",num:35,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"Richie Grant",p:"S",dp:"PS",num:39,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},
{n:"John Saunders Jr.",p:"S",dp:"PS",num:23,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS"},

// ===================== PS/IR & DESIGNATED FOR RETURN =====================
{n:"Darius Harris",p:"LB",dp:"PS/IR",num:42,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS/IR"},
{n:"Craig Reynolds",p:"RB",dp:"PS/IR",num:49,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS/IR"},
{n:"Thomas Odukoya",p:"TE",dp:"PS/IR",num:88,cap:0,base:0,dead:0,savings:0,gtd:0,starter:false,status:"PS/IR"},
{n:"Joshua Farmer",p:"DL",dp:"DFR",num:92,cap:1171454,base:1005000,dead:499362,savings:672092,gtd:0,starter:false,status:"DFR"},
];

// Dead money charges (players NOT on active roster — from OTC)
const NE_DEAD_MONEY = [
  {n:"Kyle Dugger",cap:12177778},
  {n:"Jabrill Peppers",cap:3000000},
  {n:"Ja'Lynn Polk",cap:1935362},
  {n:"Kendrick Bourne",cap:1400000},
  {n:"Keion White",cap:666394},
  {n:"Layden Robinson",cap:426036},
  {n:"Javon Baker",cap:408298},
  {n:"Bradyn Swinson",cap:330597},
  {n:"Sidy Sow",cap:191029},
];

// Salary cap summary (from OTC)
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
  restructurePotential: [
    {n:"Milton Williams",savings:13390000,note:"OTC restructure savings"},
    {n:"Stefon Diggs",savings:9750000,note:"OTC restructure savings"},
    {n:"Carlton Davis III",savings:6962500,note:"OTC restructure savings"},
    {n:"Harold Landry III",savings:4962500,note:"OTC restructure savings"},
    {n:"Robert Spillane",savings:3632500,note:"OTC restructure savings"},
    {n:"Morgan Moses",savings:3425000,note:"OTC restructure savings"},
  ],
  keyQuestions: [
    "Off-field allegations for WR Stefon Diggs and DL Christian Barmore — impact on roster decisions?",
    "WRs Kayshon Boutte & DeMario Douglas entering contract years — core pieces or seek WR1?",
    "Christian Gonzalez 5th-year option (~$17.5M estimated) — lock-in decision upcoming",
    "Antonio Gibson on IR with torn ACL ($4.1M cap, $3.1M savings if cut) — likely release candidate",
  ],
};

// Depth Chart — STRICTLY from Ourlads.com (updated 02/07/2026)
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
    {pos:"RCB",  players:["Christian Gonzalez","Charles Woods"]},
    {pos:"NB",   players:["Marcus Jones"]},
    {pos:"SS",   players:["Craig Woodson","Dell Pettus"]},
    {pos:"FS",   players:["Jaylinn Hawkins","Brenden Schooler"]},
  ],
  specialTeams: [
    {pos:"PK", players:["Andres Borregales"]},
    {pos:"PT", players:["Bryce Baringer"]},
    {pos:"LS", players:["Julian Ashby"]},
    {pos:"H",  players:["Bryce Baringer"]},
    {pos:"KO", players:["Andres Borregales"]},
    {pos:"PR", players:["Marcus Jones","Efton Chism III"]},
    {pos:"KR", players:["Kyle Williams","Efton Chism III"]},
  ],
  scheme: {offense:"11 Personnel (1 RB, 1 TE) — 61% usage",defense:"Base 3-3"},
  coaching: {hc:"Mike Vrabel",oc:"Josh McDaniels",dc:"Zak Kuhr",stc:"Jeremy Springer"},
};

export { NE_ROSTER, NE_CAP, NE_DEPTH_CHART, NE_DEAD_MONEY };
