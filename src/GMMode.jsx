// ═══════════════════════════════════════════════════════════════════════
// GM MODE — Interactive Front Office Simulator
// ═══════════════════════════════════════════════════════════════════════
// Flow: Pick Team → Review Roster/Cap/Needs → Free Agency → Draft → Grade
// Session-based state (resets on exit). 50/50 FA competition.
// ═══════════════════════════════════════════════════════════════════════

import { useState, useMemo, useCallback, useEffect } from "react";
import { TEAM_GRADES, getGradeLetter, getGradeColor } from "./team-needs-grades.js";
import FREE_AGENTS from "./freeagents.js";

// ── Position group labels ──
const POS_GROUPS = ["QB","RB","WR","TE","OL","EDGE","DL","LB","CB","S"];
const POS_LABELS = {QB:"Quarterback",RB:"Running Back",WR:"Wide Receiver",TE:"Tight End",OL:"Offensive Line",EDGE:"Edge Rusher",DL:"Defensive Line",LB:"Linebacker",CB:"Cornerback",S:"Safety"};

// ── Map FA positions to our 10 position groups ──
function faPosToGroup(p) {
  if (["IOL","OT","G","C","T"].includes(p)) return "OL";
  if (["ED","EDGE"].includes(p)) return "EDGE";
  if (["DI","DT","NT"].includes(p)) return "DL";
  if (["FS","SS"].includes(p)) return "S";
  return p;
}

// ── AI team needs from TEAM_GRADES ──
function getAITeamNeeds(abbr) {
  const tg = TEAM_GRADES[abbr];
  if (!tg) return [];
  return tg.topNeeds || [];
}

// ── Generate AI bids for a free agent ──
function generateAIBids(fa, userTeam, allTeams) {
  const interested = [];
  // Teams from fa.tags that aren't the user
  const tagged = (fa.tags || []).filter(t => t !== userTeam && t !== "RETIRE" && allTeams[t]);
  tagged.forEach(t => {
    const tg = TEAM_GRADES[t];
    if (!tg) return;
    const cap = allTeams[t]?.cap?.capSpace || 0;
    const needs = tg.topNeeds || [];
    const faGroup = faPosToGroup(fa.p);
    const needFit = needs.includes(faGroup) ? 1.3 : needs.includes(fa.p) ? 1.2 : 0.8;
    const canAfford = cap > fa.aav * 1000000;
    if (canAfford || Math.random() > 0.5) {
      // AI offer varies from 90% to 115% of projected AAV
      const mult = 0.9 + Math.random() * 0.25;
      interested.push({
        team: t,
        offer: Math.round(fa.aav * mult * 10) / 10,
        needFit,
        aggression: needFit * (0.7 + Math.random() * 0.6),
      });
    }
  });
  // Also add 1-2 random teams based on need
  const allAbbrs = Object.keys(TEAM_GRADES).filter(t => t !== userTeam && !tagged.includes(t));
  const faGroup = faPosToGroup(fa.p);
  const needTeams = allAbbrs.filter(t => {
    const tg = TEAM_GRADES[t];
    return tg && (tg.topNeeds || []).includes(faGroup);
  });
  const shuffled = needTeams.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1);
  shuffled.forEach(t => {
    const cap = allTeams[t]?.cap?.capSpace || 0;
    if (cap > fa.aav * 500000) {
      interested.push({
        team: t,
        offer: Math.round(fa.aav * (0.85 + Math.random() * 0.3) * 10) / 10,
        needFit: 1.1,
        aggression: 0.8 + Math.random() * 0.5,
      });
    }
  });
  return interested.sort((a, b) => b.aggression - a.aggression).slice(0, 4);
}

// ── Determine FA signing winner ──
// User wins ~50% with slight edge; higher offer = better odds
function resolveFABid(userOffer, aiBids, faAAV) {
  if (aiBids.length === 0) return { winner: "user", offer: userOffer };
  
  // User's score: base 50 + bonus for overpaying
  const userOverpay = (userOffer / faAAV);
  const userScore = 50 + (userOverpay - 1) * 80 + Math.random() * 40;
  
  // Each AI score
  let bestAI = null;
  aiBids.forEach(ai => {
    const aiOverpay = (ai.offer / faAAV);
    const aiScore = 35 + ai.aggression * 20 + (aiOverpay - 1) * 80 + Math.random() * 40;
    if (!bestAI || aiScore > bestAI.score) {
      bestAI = { ...ai, score: aiScore };
    }
  });
  
  if (userScore >= (bestAI?.score || 0)) {
    return { winner: "user", offer: userOffer };
  }
  return { winner: bestAI.team, offer: bestAI.offer };
}

// ── Phase constants ──
const PHASE_SELECT = 0;
const PHASE_REVIEW = 1;
const PHASE_FA = 2;
const PHASE_DRAFT = 3;
const PHASE_RESULTS = 4;

export default function GMModePage({ teamData, teamInfo, teamColors, navigateToTeam }) {
  // ── Core state ──
  const [phase, setPhase] = useState(PHASE_SELECT);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [userNeeds, setUserNeeds] = useState([]);
  const [signings, setSignings] = useState([]);
  const [faBudgetUsed, setFaBudgetUsed] = useState(0);
  const [faResults, setFaResults] = useState([]); // history of all FA outcomes
  const [aiSignings, setAiSignings] = useState([]); // AI teams' signings
  const [availableFAs, setAvailableFAs] = useState([]);
  const [faFilter, setFaFilter] = useState("ALL");
  const [activeBid, setActiveBid] = useState(null); // { fa, userOffer, aiBids }
  const [bidResult, setBidResult] = useState(null); // { winner, offer, fa }
  const [hoverTeam, setHoverTeam] = useState(null);
  const [newsLog, setNewsLog] = useState([]);

  // Initialize FAs when entering FA phase
  useEffect(() => {
    if (phase === PHASE_FA && availableFAs.length === 0) {
      setAvailableFAs([...FREE_AGENTS]);
    }
  }, [phase]);

  // ── Computed values ──
  const teamGrades = selectedTeam ? TEAM_GRADES[selectedTeam] : null;
  const teamCap = selectedTeam && teamData[selectedTeam] ? teamData[selectedTeam].cap : null;
  const originalCap = teamCap ? teamCap.capSpace : 0;
  const effectiveCap = originalCap - faBudgetUsed * 1000000;

  // ── Phase 0: Team Selection ──
  if (phase === PHASE_SELECT) {
    const confs = { AFC: {}, NFC: {} };
    Object.entries(teamInfo).forEach(([abbr, t]) => {
      const div = t.div; // e.g. "AFC East"
      const conf = t.conf;
      if (!confs[conf][div]) confs[conf][div] = [];
      confs[conf][div].push(abbr);
    });
    // Sort divisions
    const divOrder = ["East","West","North","South"];

    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"36px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"2px",textTransform:"uppercase",lineHeight:1}}>GM Mode</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#2dd4bf",letterSpacing:"1.5px",textTransform:"uppercase",marginTop:"6px"}}>Take Control of a Franchise</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",marginTop:"12px",maxWidth:"500px",margin:"12px auto 0",lineHeight:1.6}}>
            Select your team. Review the roster and cap situation. Set your priorities. Sign free agents against 31 competing front offices. Then draft your future.
          </div>
        </div>

        {/* Conference Grid */}
        {["AFC","NFC"].map(conf => (
          <div key={conf} style={{marginBottom:"24px"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:"var(--dg-text-faint)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>{conf}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}} className="gm-conf-grid">
              {divOrder.map(d => {
                const divKey = `${conf} ${d}`;
                const teams = (confs[conf][divKey] || []).sort();
                return (
                  <div key={divKey}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>{d}</div>
                    {teams.map(abbr => {
                      const tg = TEAM_GRADES[abbr];
                      const grade = tg ? getGradeLetter(tg.overall) : "?";
                      const cap = teamData[abbr]?.cap?.capSpace;
                      return (
                        <div key={abbr}
                          onClick={() => { setSelectedTeam(abbr); setPhase(PHASE_REVIEW); setUserNeeds([...(tg?.topNeeds || [])]); }}
                          onMouseEnter={() => setHoverTeam(abbr)}
                          onMouseLeave={() => setHoverTeam(null)}
                          style={{
                            display:"flex",alignItems:"center",gap:"10px",
                            padding:"10px 12px",marginBottom:"4px",
                            background: hoverTeam === abbr ? "rgba(45,212,191,0.06)" : "var(--dg-card)",
                            border:`1px solid ${hoverTeam === abbr ? "rgba(45,212,191,0.2)" : "var(--dg-card-border)"}`,
                            borderRadius:"8px",cursor:"pointer",
                            transition:"all 0.15s",
                          }}>
                          <div style={{width:"36px",height:"24px",borderRadius:"4px",background:teamColors[abbr]||"#333",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fontWeight:700,color:"#fff"}}>{abbr}</span>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:600,color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{teamInfo[abbr]?.name?.split(" ").pop()}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:cap >= 0 ? "#22c55e" : "#ef4444"}}>
                              {cap != null ? `${cap >= 0 ? "" : "-"}$${Math.abs(cap/1e6).toFixed(1)}M` : "—"}
                            </div>
                          </div>
                          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:tg ? getGradeColor(grade) : "var(--dg-text-faint)"}}>{grade}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Phase 1: Roster Review + Needs Selection ──
  if (phase === PHASE_REVIEW && selectedTeam && teamGrades) {
    const tg = teamGrades;
    const depth = teamData[selectedTeam]?.depth;

    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px"}}>
        {/* Back + Header */}
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px"}}>
          <button onClick={() => { setPhase(PHASE_SELECT); setSelectedTeam(null); setUserNeeds([]); }} style={{
            background:"transparent",border:"1px solid var(--dg-card-border)",borderRadius:"6px",
            padding:"6px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",
            color:"var(--dg-text-dim)",
          }}>← Back</button>
          <div style={{width:"40px",height:"28px",borderRadius:"5px",background:teamColors[selectedTeam]||"#333",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:700,color:"#fff"}}>{selectedTeam}</span>
          </div>
          <div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>{teamInfo[selectedTeam]?.name}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase"}}>GM Mode · Roster Review</div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"20px"}} className="gm-summary-grid">
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"14px",textAlign:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Overall</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"32px",fontWeight:700,color:getGradeColor(getGradeLetter(tg.overall)),lineHeight:1}}>{getGradeLetter(tg.overall)}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)"}}>{tg.overall}/100</div>
          </div>
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"14px",textAlign:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Cap Space</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:700,color:originalCap >= 0 ? "#22c55e" : "#ef4444",lineHeight:1}}>
              {originalCap >= 0 ? "" : "-"}${Math.abs(originalCap/1e6).toFixed(1)}M
            </div>
          </div>
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"14px",textAlign:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Offense</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"#f59e0b",lineHeight:1}}>${(teamCap?.offenseSpend/1e6||0).toFixed(0)}M</div>
          </div>
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"14px",textAlign:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Defense</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"#3b82f6",lineHeight:1}}>${(teamCap?.defenseSpend/1e6||0).toFixed(0)}M</div>
          </div>
        </div>

        {/* Key Cap Questions */}
        {teamCap?.keyQuestions && (
          <div style={{background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:"10px",padding:"14px 16px",marginBottom:"20px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>⚠ Cap Situation</div>
            {teamCap.keyQuestions.map((q,i) => (
              <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",lineHeight:1.5,marginBottom:i < teamCap.keyQuestions.length - 1 ? "4px" : 0}}>• {q}</div>
            ))}
          </div>
        )}

        {/* Position Group Grades — clickable needs */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"12px",overflow:"hidden",marginBottom:"20px"}}>
          <div style={{padding:"14px 20px",borderBottom:"1px solid var(--dg-card-border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Position Groups</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"2px"}}>Click positions to toggle as a team need</div>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf"}}>{userNeeds.length} need{userNeeds.length !== 1 ? "s" : ""} selected</div>
          </div>
          {POS_GROUPS.map((pos, idx) => {
            const data = tg.groups[pos];
            if (!data) return null;
            const isNeed = userNeeds.includes(pos);
            const gradeColor = getGradeColor(data.grade);
            return (
              <div key={pos}
                onClick={() => {
                  setUserNeeds(prev =>
                    prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
                  );
                }}
                style={{
                  display:"grid",gridTemplateColumns:"80px 44px 1fr",gap:"10px",alignItems:"center",
                  padding:"12px 20px",cursor:"pointer",
                  borderBottom: idx < POS_GROUPS.length - 1 ? "1px solid var(--dg-card-border)" : "none",
                  background: isNeed ? "rgba(239,68,68,0.05)" : "transparent",
                  transition:"background 0.15s",
                }}>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <div style={{
                    width:"16px",height:"16px",borderRadius:"4px",
                    border: isNeed ? "2px solid #ef4444" : "2px solid var(--dg-card-border)",
                    background: isNeed ? "rgba(239,68,68,0.15)" : "transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"all 0.15s",flexShrink:0,
                  }}>
                    {isNeed && <span style={{color:"#ef4444",fontSize:"10px",fontWeight:700}}>✓</span>}
                  </div>
                  <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:"var(--dg-text)"}}>{pos}</span>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:gradeColor,lineHeight:1}}>{data.grade}</div>
                </div>
                <div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)"}}>{data.starter}</div>
                  <div style={{display:"flex",gap:"12px",marginTop:"2px"}}>
                    {data.age && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:data.age>=32?"#f97316":data.age>=29?"#facc15":"var(--dg-text-faint)"}}>Age {data.age}</span>}
                    {data.capHit && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>Cap: ${data.capHit}</span>}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",marginTop:"2px"}}>{data.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Needs Summary + Proceed */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"12px",padding:"16px 20px"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"10px"}}>Your Draft & FA Priorities</div>
          {userNeeds.length === 0 ? (
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-faint)"}}>
              No needs selected. Click position groups above to set your priorities.
            </div>
          ) : (
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
              {userNeeds.map((n,i) => (
                <span key={n} style={{
                  fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:600,letterSpacing:"0.5px",
                  padding:"5px 12px",borderRadius:"6px",
                  background:i===0?"rgba(239,68,68,0.15)":i===1?"rgba(249,115,22,0.12)":"rgba(250,204,21,0.08)",
                  color:i===0?"#ef4444":i===1?"#f97316":"#facc15",
                  border:`1px solid ${i===0?"rgba(239,68,68,0.3)":i===1?"rgba(249,115,22,0.25)":"rgba(250,204,21,0.15)"}`,
                }}>#{i+1} {n}</span>
              ))}
            </div>
          )}
          <button
            onClick={() => setPhase(PHASE_FA)}
            disabled={userNeeds.length === 0}
            style={{
              width:"100%",padding:"14px",borderRadius:"8px",border:"none",cursor:userNeeds.length > 0 ? "pointer" : "not-allowed",
              background:userNeeds.length > 0 ? "linear-gradient(135deg,#2dd4bf,#14b8a6)" : "var(--dg-card-border)",
              color:userNeeds.length > 0 ? "#0c1222" : "var(--dg-text-faint)",
              fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",
              transition:"all 0.2s",
              opacity:userNeeds.length > 0 ? 1 : 0.5,
            }}>
            Enter Free Agency →
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 2: Free Agency ──
  if (phase === PHASE_FA && selectedTeam) {
    // Filter FAs
    const posGroups = faFilter === "NEEDS"
      ? userNeeds
      : faFilter === "ALL" ? null : [faFilter];

    const displayFAs = availableFAs.filter(fa => {
      // Remove already signed
      if (signings.find(s => s.n === fa.n)) return false;
      if (aiSignings.find(s => s.n === fa.n)) return false;
      if (posGroups === null) return true;
      const group = faPosToGroup(fa.p);
      return posGroups.includes(group) || posGroups.includes(fa.p);
    });

    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px",flexWrap:"wrap"}}>
          <button onClick={() => setPhase(PHASE_REVIEW)} style={{
            background:"transparent",border:"1px solid var(--dg-card-border)",borderRadius:"6px",
            padding:"6px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",
          }}>← Roster</button>
          <div style={{width:"36px",height:"24px",borderRadius:"4px",background:teamColors[selectedTeam]||"#333",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fontWeight:700,color:"#fff"}}>{selectedTeam}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>Free Agency</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",letterSpacing:"1px"}}>
              {signings.length} signing{signings.length !== 1 ? "s" : ""} · ${faBudgetUsed.toFixed(1)}M committed
            </div>
          </div>
          <button onClick={() => setPhase(PHASE_DRAFT)} style={{
            background:"linear-gradient(135deg,#2dd4bf,#14b8a6)",border:"none",borderRadius:"6px",
            padding:"8px 16px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:700,
            color:"#0c1222",letterSpacing:"1px",textTransform:"uppercase",
          }}>Proceed to Draft →</button>
        </div>

        {/* Cap + Needs Bar */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}} className="gm-summary-grid">
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"12px 16px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Available Cap</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:effectiveCap>=0?"#22c55e":"#ef4444"}}>
              {effectiveCap>=0?"":"−"}${Math.abs(effectiveCap/1e6).toFixed(1)}M
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",marginTop:"2px"}}>
              Original: ${(originalCap/1e6).toFixed(1)}M · Committed: ${faBudgetUsed.toFixed(1)}M
            </div>
          </div>
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"12px 16px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Target Needs</div>
            <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
              {userNeeds.map((n, i) => {
                const filled = signings.some(s => faPosToGroup(s.p) === n);
                return (
                  <span key={n} style={{
                    fontFamily:"'Oswald',sans-serif",fontSize:"10px",fontWeight:600,
                    padding:"3px 8px",borderRadius:"4px",
                    background: filled ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                    color: filled ? "#22c55e" : "#ef4444",
                    border: `1px solid ${filled ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    textDecoration: filled ? "line-through" : "none",
                  }}>{n}{filled ? " ✓" : ""}</span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Signings so far */}
        {signings.length > 0 && (
          <div style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.12)",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>✓ Your Signings</div>
            {signings.map(s => (
              <div key={s.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text)"}}>{s.n} <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)"}}>{s.p}</span></span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#22c55e",fontWeight:700}}>${s.signedAAV}M/yr</span>
              </div>
            ))}
          </div>
        )}

        {/* News Log */}
        {newsLog.length > 0 && (
          <div style={{background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.1)",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",maxHeight:"120px",overflowY:"auto"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>📰 FA Wire</div>
            {newsLog.slice().reverse().map((msg, i) => (
              <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",padding:"2px 0",lineHeight:1.4}}>
                {msg}
              </div>
            ))}
          </div>
        )}

        {/* Bid Result Overlay */}
        {bidResult && (
          <div style={{
            background: bidResult.winner === "user" ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
            border: `2px solid ${bidResult.winner === "user" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            borderRadius:"12px",padding:"20px",marginBottom:"16px",textAlign:"center",
          }}>
            {bidResult.winner === "user" ? (
              <>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"#22c55e",textTransform:"uppercase",letterSpacing:"1px"}}>✓ Signing Complete!</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text)",marginTop:"8px"}}>
                  {bidResult.fa.n} signs with the {teamInfo[selectedTeam]?.name} — <strong>${bidResult.offer}M/yr</strong>
                </div>
              </>
            ) : (
              <>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"#ef4444",textTransform:"uppercase",letterSpacing:"1px"}}>✗ Outbid!</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text)",marginTop:"8px"}}>
                  {bidResult.fa.n} signs with the {teamInfo[bidResult.winner]?.name || bidResult.winner} — <strong>${bidResult.offer}M/yr</strong>
                </div>
              </>
            )}
            <button onClick={() => setBidResult(null)} style={{
              marginTop:"12px",background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",
              borderRadius:"6px",padding:"8px 20px",cursor:"pointer",
              fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:600,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase",
            }}>Continue</button>
          </div>
        )}

        {/* Active Bid Panel */}
        {activeBid && !bidResult && (
          <div style={{
            background:"rgba(45,212,191,0.04)",border:"2px solid rgba(45,212,191,0.2)",
            borderRadius:"12px",padding:"20px",marginBottom:"16px",
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"}}>
              <div>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"var(--dg-text)"}}>{activeBid.fa.n}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)"}}>{activeBid.fa.p} · Age {activeBid.fa.age} · {activeBid.fa.tm}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",marginTop:"4px"}}>{activeBid.fa.note}</div>
              </div>
              <button onClick={() => setActiveBid(null)} style={{background:"transparent",border:"none",cursor:"pointer",color:"var(--dg-text-dim)",fontSize:"18px"}}>×</button>
            </div>

            {/* Competition */}
            {activeBid.aiBids.length > 0 && (
              <div style={{marginBottom:"12px"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>⚠ Competing Offers</div>
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                  {activeBid.aiBids.map(ai => (
                    <span key={ai.team} style={{
                      fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",
                      padding:"3px 8px",borderRadius:"4px",
                      background:teamColors[ai.team]||"#333",color:"#fff",
                    }}>{ai.team}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Offer Slider */}
            <div style={{marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>Market Value: ${activeBid.fa.aav}M/yr</span>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"#2dd4bf"}}>${activeBid.userOffer.toFixed(1)}M/yr</span>
              </div>
              <input type="range"
                min={Math.max(activeBid.fa.aav * 0.7, 1)}
                max={activeBid.fa.aav * 1.4}
                step={0.5}
                value={activeBid.userOffer}
                onChange={e => setActiveBid(prev => ({ ...prev, userOffer: parseFloat(e.target.value) }))}
                style={{width:"100%",accentColor:"#2dd4bf"}}
              />
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>Bargain</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>Overpay</span>
              </div>
            </div>

            {/* Win probability hint */}
            {(() => {
              const ratio = activeBid.userOffer / activeBid.fa.aav;
              const hint = activeBid.aiBids.length === 0 ? "No competition — guaranteed signing"
                : ratio >= 1.15 ? "Strong offer — good chance to win"
                : ratio >= 1.0 ? "Fair offer — competitive"
                : ratio >= 0.9 ? "Below market — risky"
                : "Lowball — unlikely to land";
              const hintColor = activeBid.aiBids.length === 0 ? "#22c55e"
                : ratio >= 1.15 ? "#22c55e" : ratio >= 1.0 ? "#facc15" : "#ef4444";
              return (
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:hintColor,marginBottom:"12px",textAlign:"center"}}>{hint}</div>
              );
            })()}

            {/* Submit Bid */}
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={() => setActiveBid(null)} style={{
                flex:1,padding:"12px",borderRadius:"6px",
                background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",
                cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:600,
                color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase",
              }}>Pass</button>
              <button onClick={() => {
                const result = resolveFABid(activeBid.userOffer, activeBid.aiBids, activeBid.fa.aav);
                if (result.winner === "user") {
                  const signed = { ...activeBid.fa, signedAAV: activeBid.userOffer };
                  setSignings(prev => [...prev, signed]);
                  setFaBudgetUsed(prev => prev + activeBid.userOffer);
                  setNewsLog(prev => [...prev, `✓ ${activeBid.fa.n} (${activeBid.fa.p}) signs with ${teamInfo[selectedTeam]?.name.split(" ").pop()} — $${activeBid.userOffer}M/yr`]);
                } else {
                  const aiSigned = { ...activeBid.fa, signedBy: result.winner, signedAAV: result.offer };
                  setAiSignings(prev => [...prev, aiSigned]);
                  setNewsLog(prev => [...prev, `✗ ${activeBid.fa.n} (${activeBid.fa.p}) signs with ${teamInfo[result.winner]?.name?.split(" ").pop() || result.winner} — $${result.offer}M/yr`]);
                }
                setBidResult({ ...result, fa: activeBid.fa });
                setActiveBid(null);
              }} style={{
                flex:2,padding:"12px",borderRadius:"6px",border:"none",cursor:"pointer",
                background:"linear-gradient(135deg,#2dd4bf,#14b8a6)",
                fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:700,
                color:"#0c1222",letterSpacing:"1px",textTransform:"uppercase",
              }}>Submit Offer — ${activeBid.userOffer.toFixed(1)}M/yr</button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{display:"flex",gap:"4px",marginBottom:"12px",flexWrap:"wrap"}}>
          {["ALL","NEEDS",...POS_GROUPS].map(f => {
            const active = faFilter === f;
            return (
              <button key={f} onClick={() => setFaFilter(f)} style={{
                padding:"5px 12px",borderRadius:"5px",border:"none",cursor:"pointer",
                background: active ? "rgba(45,212,191,0.12)" : "var(--dg-card)",
                color: active ? "#2dd4bf" : "var(--dg-text-dim)",
                fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:active?700:400,
                letterSpacing:"0.5px",textTransform:"uppercase",
              }}>{f === "NEEDS" ? "🎯 My Needs" : f}</button>
            );
          })}
        </div>

        {/* FA List */}
        <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
          {displayFAs.length === 0 && (
            <div style={{textAlign:"center",padding:"40px",color:"var(--dg-text-faint)",fontFamily:"'JetBrains Mono',monospace",fontSize:"11px"}}>
              No available free agents in this category.
            </div>
          )}
          {displayFAs.map(fa => {
            const faGroup = faPosToGroup(fa.p);
            const isNeed = userNeeds.includes(faGroup);
            return (
              <div key={fa.n}
                onClick={() => {
                  if (activeBid || bidResult) return;
                  const aiBids = generateAIBids(fa, selectedTeam, teamData);
                  setActiveBid({ fa, userOffer: Math.round(fa.aav * 10) / 10, aiBids });
                }}
                style={{
                  display:"grid",gridTemplateColumns:"1fr 60px 70px 40px",gap:"8px",alignItems:"center",
                  padding:"12px 16px",borderRadius:"8px",cursor:activeBid || bidResult ? "default" : "pointer",
                  background: isNeed ? "rgba(239,68,68,0.03)" : "var(--dg-card)",
                  border:`1px solid ${isNeed ? "rgba(239,68,68,0.1)" : "var(--dg-card-border)"}`,
                  transition:"all 0.15s",
                  opacity: activeBid || bidResult ? 0.5 : 1,
                }}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"var(--dg-text)"}}>{fa.n}</span>
                    {isNeed && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",color:"#ef4444",fontWeight:700,background:"rgba(239,68,68,0.1)",padding:"1px 4px",borderRadius:"2px"}}>NEED</span>}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",marginTop:"2px"}}>{fa.stats?.split("·")[0]?.trim()}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:600,color:"var(--dg-text-dim)",
                    background:"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:"4px"}}>{fa.p}</span>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:"#2dd4bf"}}>${fa.aav}M</span>
                </div>
                <div style={{textAlign:"center"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)"}}>Age {fa.age}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Phase 3: Draft (placeholder — hooks into existing mock draft) ──
  if (phase === PHASE_DRAFT) {
    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",justifyContent:"center"}}>
          <button onClick={() => setPhase(PHASE_FA)} style={{
            background:"transparent",border:"1px solid var(--dg-card-border)",borderRadius:"6px",
            padding:"6px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",
          }}>← Back to FA</button>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>Draft Day</div>
        </div>

        {/* Signings Recap */}
        {signings.length > 0 && (
          <div style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.12)",borderRadius:"10px",padding:"16px",marginBottom:"20px",textAlign:"left",maxWidth:"500px",margin:"0 auto 20px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>FA Signings Recap</div>
            {signings.map(s => (
              <div key={s.n} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text)"}}>{s.n} <span style={{fontSize:"10px",color:"var(--dg-text-dim)"}}>{s.p}</span></span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#22c55e"}}>${s.signedAAV}M</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid rgba(34,197,94,0.15)",marginTop:"8px",paddingTop:"8px",display:"flex",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)"}}>Total Committed</span>
              <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:700,color:"#22c55e"}}>${faBudgetUsed.toFixed(1)}M</span>
            </div>
          </div>
        )}

        {/* Updated Needs */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"16px",marginBottom:"20px",maxWidth:"500px",margin:"0 auto 20px"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>Updated Draft Needs</div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}}>
            {userNeeds.map((n, i) => {
              const filled = signings.some(s => faPosToGroup(s.p) === n);
              return (
                <span key={n} style={{
                  fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:600,
                  padding:"5px 12px",borderRadius:"6px",
                  background: filled ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: filled ? "#22c55e" : "#ef4444",
                  border: `1px solid ${filled ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  textDecoration: filled ? "line-through" : "none",
                }}>{n}{filled ? " ✓" : ""}</span>
              );
            })}
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",marginTop:"10px"}}>
            Remaining needs will be prioritized in the draft.
          </div>
        </div>

        <div style={{
          background:"var(--dg-card)",border:"1px dashed var(--dg-card-border)",borderRadius:"12px",
          padding:"40px 20px",maxWidth:"500px",margin:"0 auto",
        }}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"var(--dg-text-dim)",marginBottom:"8px"}}>🏈 Draft Integration</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-faint)",lineHeight:1.6}}>
            Draft simulator integration coming in Phase 3.<br/>
            Your FA signings and updated needs will feed directly into the mock draft engine.
          </div>
        </div>

        <button onClick={() => setPhase(PHASE_FA)} style={{
          marginTop:"20px",padding:"10px 24px",borderRadius:"6px",
          background:"transparent",border:"1px solid var(--dg-card-border)",cursor:"pointer",
          fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:600,color:"var(--dg-text-dim)",
          letterSpacing:"0.5px",textTransform:"uppercase",
        }}>← Return to Free Agency</button>
      </div>
    );
  }

  // Fallback
  return null;
}
