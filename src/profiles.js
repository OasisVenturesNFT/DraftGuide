// Player profiles keyed by player name (must match players.js exactly)
// Only top 10 at each position get profiles
const PROFILES = {
  // ── QB ──
  "Fernando Mendoza": {
    age: 22, height: "6'3\"", weight: 220, class: "Senior",
    projected: "Top 5 Pick",
    comp: "Justin Herbert",
    summary: "A late riser who took the college football world by storm with a breakout senior season at Indiana. Mendoza combines elite arm talent with impressive poise in the pocket, consistently delivering accurate throws at all three levels of the field. His ability to process defenses quickly and make decisive reads has vaulted him to the top of the 2026 class.",
    pros: [
      "Elite arm strength with ability to make every throw",
      "Excellent poise and composure under pressure",
      "Quick processing speed and decisiveness",
      "Natural leader who elevates teammates around him",
    ],
    cons: [
      "Limited starting experience at a major program",
      "Footwork can get inconsistent under duress",
      "Needs to improve on deep ball accuracy",
      "Decision-making can be aggressive in tight windows",
    ],
  },
  "Ty Simpson": {
    age: 21, height: "6'2\"", weight: 213, class: "Junior",
    projected: "1st Round",
    comp: "Dak Prescott",
    summary: "A dual-threat quarterback with outstanding athleticism and a strong arm. Simpson has grown tremendously as a passer during his time at Alabama, developing from a raw athlete into a capable pocket passer who can also create with his legs. His ceiling is immense if he continues to refine his mechanics.",
    pros: [
      "Dynamic rushing ability creates extra dimension",
      "Strong arm with natural throwing ability",
      "Improved pocket presence and reads as a junior",
      "Competitive fire and clutch gene",
    ],
    cons: [
      "Still developing as a pure pocket passer",
      "Accuracy can waver on intermediate routes",
      "Tends to rely on athleticism over progressions",
      "Needs to better protect himself as a runner",
    ],
  },
  "Garrett Nussmeier": {
    age: 22, height: "6'2\"", weight: 210, class: "Senior",
    projected: "1st–2nd Round",
    comp: "Baker Mayfield",
    summary: "A gunslinger with elite confidence and a quick release. Nussmeier thrived in LSU's pass-heavy offense, showing the ability to dissect defenses with anticipation throws and impressive ball placement. His swagger and leadership are undeniable, though his aggressive style can lead to turnovers.",
    pros: [
      "Lightning-quick release and compact mechanics",
      "Outstanding anticipation and timing",
      "Fearless in the pocket, stands tall in the face of pressure",
      "Excellent leader with infectious confidence",
    ],
    cons: [
      "Aggressive mentality leads to forced throws",
      "Below-average mobility outside the pocket",
      "Undersized frame raises durability questions",
      "Can lock onto primary read in high-pressure moments",
    ],
  },

  // ── RB ──
  "Jeremiyah Love": {
    age: 21, height: "5'11\"", weight: 210, class: "Junior",
    projected: "1st Round",
    comp: "Saquon Barkley",
    summary: "An explosive, home-run hitting back who was the engine of Notre Dame's offense. Love combines elite speed with surprising power between the tackles. His ability to break long runs at any moment makes him the most dynamic playmaker in this class. Also a capable receiver out of the backfield.",
    pros: [
      "Elite breakaway speed — home run threat every touch",
      "Explosive cutting ability and lateral agility",
      "Capable pass catcher with soft hands",
      "Competitive runner who fights for extra yards",
    ],
    cons: [
      "Can be inconsistent in pass protection",
      "Tends to dance behind the line instead of hitting holes",
      "Durability concerns with his running style",
      "Fumble issues need to be cleaned up",
    ],
  },

  // ── WR ──
  "Carnell Tate": {
    age: 21, height: "6'2\"", weight: 190, class: "Junior",
    projected: "Top 10 Pick",
    comp: "Chris Olave",
    summary: "A smooth route runner with elite body control and natural hands. Tate is the complete package at receiver — he wins at all three levels, creates consistent separation, and is a reliable target in contested catch situations. His football IQ and route-running nuance are well beyond his years.",
    pros: [
      "Silky smooth route runner with sharp breaks",
      "Excellent hands and body control at the catch point",
      "Creates natural separation with tempo changes",
      "Polished and pro-ready as a route technician",
    ],
    cons: [
      "Could add more physicality after the catch",
      "Not an elite deep speed burner",
      "Needs to be more consistent as a blocker",
      "Production dipped in a few high-profile games",
    ],
  },

  // ── TE ──
  "Kenyon Sadiq": {
    age: 22, height: "6'4\"", weight: 250, class: "Senior",
    projected: "1st Round",
    comp: "George Kittle",
    summary: "A physically dominant tight end who excels as both a receiver and blocker. Sadiq is a matchup nightmare with his combination of size, speed, and athleticism. He was a centerpiece of Oregon's offense and projects as a Day 1 starter who can immediately impact an NFL passing game.",
    pros: [
      "Excellent size-speed combination for the position",
      "Physical run blocker who embraces contact",
      "Dangerous after the catch with surprising speed",
      "Reliable hands in traffic and contested situations",
    ],
    cons: [
      "Route tree could use more refinement",
      "Occasionally loses focus on routine catches",
      "Inline blocking technique needs polish",
      "Can be slow off the line against press coverage",
    ],
  },

  // ── OT ──
  "Francis Mauigoa": {
    age: 21, height: "6'5\"", weight: 330, class: "Junior",
    projected: "Top 5 Pick",
    comp: "Tristan Wirfs",
    summary: "A massive, athletic tackle who has been a cornerstone of Miami's offensive line. Mauigoa combines rare physical tools with refined technique, making him one of the most complete tackle prospects in recent years. His ability to handle speed and power rushers equally well is what separates him from the pack.",
    pros: [
      "Elite combination of size and athleticism",
      "Excellent feet and lateral movement for his size",
      "Powerful hands that control defenders at the point of attack",
      "Versatile — can play either tackle spot at the next level",
    ],
    cons: [
      "Pad level can get high, losing leverage",
      "Occasional lapses in concentration on routine blocks",
      "Needs to improve recovery speed when beaten initially",
      "Run blocking can be inconsistent in space",
    ],
  },

  // ── EDGE ──
  "Rueben Bain": {
    age: 20, height: "6'3\"", weight: 250, class: "Junior",
    projected: "Top 5 Pick",
    comp: "Micah Parsons",
    summary: "An explosive, high-motor edge rusher who terrorized ACC offensive lines for three seasons at Miami. Bain is relentless in his pursuit of the quarterback, combining a devastating first step with a mature pass-rush arsenal. His versatility to rush from multiple alignments makes him scheme-proof at the next level.",
    pros: [
      "Elite first step and explosive get-off",
      "Diverse pass-rush move repertoire",
      "Relentless motor — never takes a play off",
      "Versatile alignment flexibility across the front",
    ],
    cons: [
      "Can be inconsistent against the run",
      "Needs to add functional strength for NFL power tackles",
      "Sometimes overruns the quarterback",
      "Could improve hand usage to counter bull rushes",
    ],
  },

  // ── DL ──
  "Peter Woods": {
    age: 21, height: "6'3\"", weight: 300, class: "Junior",
    projected: "1st Round",
    comp: "Javon Hargrave",
    summary: "A disruptive interior presence who lives in opposing backfields. Woods has rare explosiveness for a defensive lineman, consistently winning at the point of attack with a combination of quickness and power. His ability to collapse the pocket from the interior makes him a premium asset in today's pass-heavy NFL.",
    pros: [
      "Explosive first step wins the leverage battle immediately",
      "Excellent hand usage and counter moves",
      "Disruptive presence who collapses the pocket",
      "Motor runs hot — high effort on every snap",
    ],
    cons: [
      "Can be washed out against double teams",
      "Needs to improve anchor against power run schemes",
      "Somewhat limited as a pass rusher from wider alignments",
      "Inconsistent effort in run defense at times",
    ],
  },

  // ── LB ──
  "Arvell Reese": {
    age: 22, height: "6'3\"", weight: 235, class: "Senior",
    projected: "Top 5 Pick",
    comp: "Roquan Smith",
    summary: "A sideline-to-sideline linebacker with elite range and instincts. Reese is the quarterback of Ohio State's defense, consistently diagnosing plays before the snap and flying to the ball. His combination of size, speed, and football IQ makes him the most complete linebacker prospect in years.",
    pros: [
      "Elite range and sideline-to-sideline speed",
      "Outstanding instincts and play recognition",
      "Physical downhill run defender",
      "Capable in coverage against tight ends and backs",
    ],
    cons: [
      "Can struggle to shed blocks from bigger offensive linemen",
      "Overpursues at times, losing gap discipline",
      "Man coverage against quicker slot receivers is a concern",
      "Tackling technique can get loose in space",
    ],
  },

  // ── CB ──
  "Mansoor Delane": {
    age: 21, height: "6'1\"", weight: 190, class: "Junior",
    projected: "Top 15 Pick",
    comp: "Sauce Gardner",
    summary: "A long, physical corner with elite ball skills and shutdown potential. Delane has the ideal size and length that NFL teams covet, paired with fluid hips and the ability to mirror receivers at the line. His physicality in press coverage is his calling card, and he rarely gets beaten deep.",
    pros: [
      "Ideal size and length for an NFL corner",
      "Elite press-man coverage skills",
      "Excellent ball skills and playmaking ability",
      "Physical tackler who supports the run",
    ],
    cons: [
      "Can get grabby in off-coverage situations",
      "Recovery speed after false steps is average",
      "Zone coverage instincts still developing",
      "Penalty-prone due to aggressive play style",
    ],
  },

  // ── S ──
  "Caleb Downs": {
    age: 20, height: "6'0\"", weight: 200, class: "Junior",
    projected: "Top 10 Pick",
    comp: "Derwin James",
    summary: "A versatile, do-it-all safety who is equally comfortable in the box, in deep coverage, or as a slot defender. Downs has been one of college football's best defenders since he stepped on campus, combining elite instincts with physicality that belies his frame. His football IQ and range make him a true defensive centerpiece.",
    pros: [
      "Elite versatility — can play any secondary position",
      "Outstanding football IQ and instincts",
      "Physical enforcer who delivers big hits",
      "Excellent range in deep coverage",
    ],
    cons: [
      "Can be overly aggressive, biting on play-action",
      "Size may limit effectiveness against bigger tight ends",
      "Tackling technique can be reckless at times",
      "Needs to improve discipline in zone responsibilities",
    ],
  },

  // ── IOL ──
  "Olaivavega Ioane": {
    age: 22, height: "6'4\"", weight: 315, class: "Senior",
    projected: "1st Round",
    comp: "Quenton Nelson",
    summary: "A mauling interior lineman who dominates in the run game and has steadily improved as a pass protector. Ioane plays with a nasty streak and finishes blocks through the whistle. His combination of size, power, and nastiness makes him a tone-setter for any offensive line.",
    pros: [
      "Dominant run blocker with a nasty finishing mentality",
      "Excellent power and anchor at the point of attack",
      "Smart player who makes correct line calls",
      "Plays with an edge and physicality teams love",
    ],
    cons: [
      "Lateral mobility is below average for modern NFL",
      "Can struggle with speed rushers on pass sets",
      "Foot speed limits ability to reach second-level blocks",
      "Needs to improve hand placement consistency",
    ],
  },
};

export default PROFILES;
