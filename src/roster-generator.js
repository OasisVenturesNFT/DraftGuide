// ═══════════════════════════════════════════════════════════════════════
// ROSTER GENERATOR — Converts depth chart data into roster arrays
// ═══════════════════════════════════════════════════════════════════════
// For teams without detailed OTC contract data, this generates realistic
// roster arrays from depth chart data using position-based market estimates.
// Actual NE data is preserved; all other teams get generated estimates.
// ═══════════════════════════════════════════════════════════════════════

// Average cap hits by position (2026 market, in millions)
// Format: [starter_avg, backup_avg, 3rd_string_avg]
const POSITION_MARKET = {
  QB:   [35, 8, 1.2],
  RB:   [8, 3, 1.1],
  FB:   [2.5, 1.1, 1.0],
  LWR:  [16, 4, 1.1],
  RWR:  [14, 3.5, 1.1],
  SWR:  [12, 3, 1.1],
  WR:   [14, 3.5, 1.1],
  TE:   [10, 4, 1.1],
  LT:   [18, 5, 1.1],
  LG:   [12, 4, 1.1],
  C:    [12, 4, 1.1],
  RG:   [12, 4, 1.1],
  RT:   [15, 4.5, 1.1],
  LDE:  [14, 5, 1.1],
  RDE:  [14, 5, 1.1],
  LDT:  [10, 4, 1.1],
  RDT:  [10, 4, 1.1],
  NT:   [8, 3, 1.1],
  WLB:  [8, 3, 1.1],
  SLB:  [7, 2.5, 1.1],
  MLB:  [10, 4, 1.1],
  ROLB: [12, 4, 1.1],
  LOLB: [12, 4, 1.1],
  LCB:  [14, 5, 1.1],
  RCB:  [14, 5, 1.1],
  NB:   [6, 2.5, 1.1],
  CB:   [14, 5, 1.1],
  SS:   [8, 3, 1.1],
  FS:   [10, 4, 1.1],
  PK:   [5, 1.5, 1.0],
  PT:   [3.5, 1.2, 1.0],
  LS:   [1.5, 1.0, 1.0],
  H:    [0, 0, 0],  // holder is usually the punter
  KO:   [0, 0, 0],  // kicker already counted
  PR:   [0, 0, 0],  // returner already counted
  KR:   [0, 0, 0],  // returner already counted
};

// Map depth chart positions to simplified roster positions
const POS_MAP = {
  QB: "QB", RB: "RB", FB: "FB",
  LWR: "WR", RWR: "WR", SWR: "WR", WR: "WR",
  TE: "TE",
  LT: "OT", RT: "OT", LG: "IOL", RG: "IOL", C: "IOL",
  LDE: "EDGE", RDE: "EDGE",
  LDT: "DL", RDT: "DL", NT: "DL",
  WLB: "LB", SLB: "LB", MLB: "LB", ROLB: "EDGE", LOLB: "EDGE",
  LCB: "CB", RCB: "CB", NB: "CB",
  SS: "S", FS: "S",
  PK: "K", PT: "P", LS: "LS",
  H: null, KO: null, PR: null, KR: null,
};

// Known star players with approximate real cap hits (2026, $M)
// This overrides generic estimates for marquee names
const KNOWN_CAPS = {
  "Josh Allen": 56.4, "Patrick Mahomes": 52.0, "Lamar Jackson": 52.0,
  "Joe Burrow": 55.0, "Justin Herbert": 52.5, "Dak Prescott": 55.1,
  "Jalen Hurts": 38.0, "Tua Tagovailoa": 53.6, "Kyler Murray": 52.7,
  "Matthew Stafford": 44.0, "Geno Smith": 37.5, "Baker Mayfield": 30.0,
  "C.J. Stroud": 12.0, "Caleb Williams": 12.0, "Anthony Richardson": 12.0,
  "Trevor Lawrence": 45.0, "Jordan Love": 35.0, "Sam Darnold": 33.5,
  "Jared Goff": 40.0, "Brock Purdy": 35.0, "Justin Fields": 20.0,
  "Bo Nix": 8.0, "Drake Maye": 10.0, "Bryce Young": 12.0,
  "Cam Ward": 12.0, "JJ McCarthy": 10.0, "Jayden Daniels": 12.0,
  "Michael Penix Jr.": 6.0, "Dillon Gabriel": 5.0, "Jaxson Dart": 6.0,
  "Aaron Rodgers": 13.7, "Spencer Rattler": 2.5,
  // Elite skill position
  "Saquon Barkley": 26.0, "Derrick Henry": 16.0, "Jonathan Taylor": 12.0,
  "Bijan Robinson": 5.0, "Josh Jacobs": 12.0, "Ashton Jeanty": 8.0,
  "Ja'Marr Chase": 43.0, "Justin Jefferson": 35.0, "AJ Brown": 26.0,
  "Amon-Ra St. Brown": 25.0, "Puka Nacua": 4.0, "Garrett Wilson": 32.5,
  "CeeDee Lamb": 34.0, "Davante Adams": 23.0, "Cooper Kupp": 15.0,
  "DK Metcalf": 33.0, "DeVonta Smith": 20.0, "Terry McLaurin": 20.0,
  "George Kittle": 15.0, "Travis Kelce": 17.0, "Mark Andrews": 12.0,
  "Sam LaPorta": 3.0, "Kyle Pitts": 10.0, "Dallas Goedert": 12.0,
  "Tee Higgins": 28.75, "Stefon Diggs": 26.5, "DJ Moore": 20.0,
  "George Pickens": 4.0, "Chris Godwin": 16.0, "Mike Evans": 18.0,
  "Tyreek Hill": 30.0, "Khalil Shakir": 15.0, "Jaxon Smith-Njigba": 5.0,
  // Elite OL
  "Penei Sewell": 28.0, "Tristan Wirfs": 25.0, "Trent Williams": 25.0,
  "Lane Johnson": 20.0, "Zack Martin": 16.0, "Frank Ragnow": 15.0,
  "Tyler Linderbaum": 3.0, "Joe Alt": 10.0, "Rashawn Slater": 20.0,
  "Michael Onwenu": 25.0, "Quenton Nelson": 20.0, "Will Campbell": 10.0,
  "Ronnie Stanley": 20.0, "Zach Tom": 22.0, "Aaron Banks": 19.3,
  "Laremy Tunsil": 20.0, "Joe Thuney": 14.0,
  // Elite pass rushers
  "Myles Garrett": 40.0, "T.J. Watt": 41.0, "Micah Parsons": 12.0,
  "Nick Bosa": 34.0, "Maxx Crosby": 30.0, "Nik Bonitto": 30.0,
  "Will Anderson": 12.0, "Danielle Hunter": 17.8, "Trey Hendrickson": 21.0,
  "Jared Verse": 5.0, "Greg Rousseau": 20.0, "Joey Bosa": 12.6,
  "George Karlaftis": 23.3, "Aidan Hutchinson": 12.0,
  "DeMarcus Lawrence": 12.0, "Harold Landry": 14.5,
  // Elite DL
  "Quinnen Williams": 20.0, "Chris Jones": 28.0, "Ed Oliver": 18.0,
  "Jalen Carter": 5.0, "Vita Vea": 15.0, "Dexter Lawrence": 20.0,
  "Derrick Brown": 12.0, "Jeffery Simmons": 20.0, "Milton Williams": 26.0,
  // Elite LB
  "Roquan Smith": 20.0, "Fred Warner": 18.0, "Tremaine Edmunds": 15.0,
  "Lavonte David": 8.0, "Terrel Bernard": 12.5, "Nick Bolton": 15.0,
  "Bobby Wagner": 8.0, "Zack Baun": 6.0,
  // Elite CB
  "Sauce Gardner": 12.0, "Patrick Surtain II": 15.0,
  "Devon Witherspoon": 5.0, "Jalen Ramsey": 23.0, "Trevon Diggs": 18.0,
  "Christian Benford": 19.0, "Jaylon Johnson": 15.0,
  "Deommodore Lenoir": 5.0, "Marshon Lattimore": 15.0,
  "A.J. Terrell": 15.0, "Charvarius Ward": 15.0, "Carlton Davis": 20.0,
  "Byron Murphy Jr.": 16.5, "Jaire Alexander": 12.0,
  // Elite S
  "Kyle Hamilton": 5.0, "Derwin James": 18.0, "Antoine Winfield Jr.": 15.0,
  "Minkah Fitzpatrick": 14.0, "Brian Branch": 4.0, "Budda Baker": 12.0,
  "Xavier McKinney": 12.0, "Jessie Bates": 12.0,
  "Talanoa Hufanga": 15.0, "Camryn Bynum": 15.0,
  // Kickers
  "Justin Tucker": 6.0, "Chris Boswell": 5.0, "Tyler Bass": 5.0,
  "Evan McPherson": 5.0, "Brandon Aubrey": 3.0, "Jake Elliott": 4.0,
};

// Generate a roster array from depth chart data
function generateRoster(depthChart, capData) {
  const roster = [];
  const seen = new Set();
  const totalCapUsed = (capData?.offenseSpend || 0) + (capData?.defenseSpend || 0) + (capData?.specialSpend || 0);

  const processGroup = (positions, side) => {
    positions.forEach(posRow => {
      const depthPos = posRow.pos;
      const rosterPos = POS_MAP[depthPos];
      if (!rosterPos) return; // skip holder/returner dupes
      const market = POSITION_MARKET[depthPos] || [5, 2, 1];

      posRow.players.forEach((name, idx) => {
        if (seen.has(name)) return;
        seen.add(name);

        const isStarter = idx === 0;
        const depthLabel = `${depthPos}${idx + 1}`;

        // Cap hit: use known value or estimate from market
        let capHit;
        if (KNOWN_CAPS[name] !== undefined) {
          capHit = KNOWN_CAPS[name] * 1e6;
        } else {
          const tierValue = market[Math.min(idx, 2)];
          // Add some variance (±20%)
          const variance = 0.8 + (hashName(name) % 40) / 100;
          capHit = Math.round(tierValue * variance * 1e6);
        }

        // Estimate contract breakdown
        const baseSalary = Math.round(capHit * 0.6);
        const deadMoney = isStarter ? Math.round(capHit * 0.4) : Math.round(capHit * 0.15);
        const savings = capHit - deadMoney;
        const gtd = isStarter ? Math.round(capHit * 0.25) : 0;

        roster.push({
          n: name,
          p: rosterPos,
          dp: depthLabel,
          num: 0, // we don't have jersey numbers for most teams
          cap: capHit,
          base: baseSalary,
          dead: deadMoney,
          savings: savings,
          gtd: gtd,
          starter: isStarter,
          status: "active",
          estimated: true, // flag that this is estimated, not OTC-verified
        });
      });
    });
  };

  if (depthChart.offense) processGroup(depthChart.offense, "offense");
  if (depthChart.defense) processGroup(depthChart.defense, "defense");
  if (depthChart.specialTeams) processGroup(depthChart.specialTeams, "special");

  return roster;
}

// Simple hash for deterministic variance per player name
function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export { generateRoster, KNOWN_CAPS };
