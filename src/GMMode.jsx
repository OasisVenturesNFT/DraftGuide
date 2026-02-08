// ═══════════════════════════════════════════════════════════════════════
// GM MODE — Interactive Front Office Simulator  
// ═══════════════════════════════════════════════════════════════════════
// Flow: Pick Team → Review Roster/Cap/Cuts/Trades → Free Agency → Draft → Grade
// Session-based state (resets on exit). 50/50 FA competition.
// ═══════════════════════════════════════════════════════════════════════

import { useState, useMemo, useCallback, useEffect } from "react";
import { TEAM_GRADES, getGradeLetter, getGradeColor } from "./team-needs-grades.js";
import FREE_AGENTS from "./freeagents.js";
import { generateRoster } from "./roster-generator.js";

const POS_GROUPS = ["QB","RB","WR","TE","OL","EDGE","DL","LB","CB","S"];
const POS_LABELS = {QB:"Quarterback",RB:"Running Back",WR:"Wide Receiver",TE:"Tight End",OL:"Offensive Line",EDGE:"Edge Rusher",DL:"Defensive Line",LB:"Linebacker",CB:"Cornerback",S:"Safety",ST:"Special Teams"};

function faPosToGroup(p) {
  if (["IOL","OT","G","C","T"].includes(p)) return "OL";
  if (["ED","EDGE"].includes(p)) return "EDGE";
  if (["DI","DT","NT"].includes(p)) return "DL";
  if (["FS","SS"].includes(p)) return "S";
  return p;
}

function rosterPosToGroup(p) {
  if (["OT","IOL","G","C","T"].includes(p)) return "OL";
  if (["ED","EDGE","OLB"].includes(p)) return "EDGE";
  if (["DI","DT","NT","DE","DL"].includes(p)) return "DL";
  if (["FS","SS"].includes(p)) return "S";
  if (["FB"].includes(p)) return "RB";
  if (["K","P","LS"].includes(p)) return "ST";
  return p;
}

function estimateTradeValue(player) {
  const cap = player.cap || 0;
  const isStarter = player.starter;
  const pos = player.p;
  const premiumPos = ["QB","EDGE","OT","CB","WR"];
  const posMult = premiumPos.includes(pos) ? 1.3 : 1.0;
  let value = (cap / 1e6) * 2 * posMult;
  if (isStarter) value += 15;
  if (value >= 60) return { picks: ["2026 1st Round Pick", "2027 3rd Round Pick"], label: "1st + 3rd" };
  if (value >= 40) return { picks: ["2026 1st Round Pick"], label: "1st Round" };
  if (value >= 30) return { picks: ["2026 2nd Round Pick", "2027 4th Round Pick"], label: "2nd + 4th" };
  if (value >= 20) return { picks: ["2026 2nd Round Pick"], label: "2nd Round" };
  if (value >= 14) return { picks: ["2026 3rd Round Pick"], label: "3rd Round" };
  if (value >= 8) return { picks: ["2026 4th Round Pick"], label: "4th Round" };
  if (value >= 4) return { picks: ["2026 5th Round Pick"], label: "5th Round" };
  if (value >= 2) return { picks: ["2026 6th Round Pick"], label: "6th Round" };
  return { picks: ["2026 7th Round Pick"], label: "7th Round" };
}

function generateAIBids(fa, userTeam, allTeams) {
  const interested = [];
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
      const mult = 0.9 + Math.random() * 0.25;
      interested.push({ team: t, offer: Math.round(fa.aav * mult * 10) / 10, needFit, aggression: needFit * (0.7 + Math.random() * 0.6) });
    }
  });
  const allAbbrs = Object.keys(TEAM_GRADES).filter(t => t !== userTeam && !tagged.includes(t));
  const faGroup = faPosToGroup(fa.p);
  const needTeams = allAbbrs.filter(t => { const tg = TEAM_GRADES[t]; return tg && (tg.topNeeds || []).includes(faGroup); });
  const shuffled = needTeams.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1);
  shuffled.forEach(t => {
    const cap = allTeams[t]?.cap?.capSpace || 0;
    if (cap > fa.aav * 500000) {
      interested.push({ team: t, offer: Math.round(fa.aav * (0.85 + Math.random() * 0.3) * 10) / 10, needFit: 1.1, aggression: 0.8 + Math.random() * 0.5 });
    }
  });
  return interested.sort((a, b) => b.aggression - a.aggression).slice(0, 4);
}

function resolveFABid(userOffer, aiBids, faAAV) {
  if (aiBids.length === 0) return { winner: "user", offer: userOffer };
  const userOverpay = (userOffer / faAAV);
  const userScore = 50 + (userOverpay - 1) * 80 + Math.random() * 40;
  let bestAI = null;
  aiBids.forEach(ai => {
    const aiOverpay = (ai.offer / faAAV);
    const aiScore = 35 + ai.aggression * 20 + (aiOverpay - 1) * 80 + Math.random() * 40;
    if (!bestAI || aiScore > bestAI.score) bestAI = { ...ai, score: aiScore };
  });
  if (userScore >= (bestAI?.score || 0)) return { winner: "user", offer: userOffer };
  return { winner: bestAI.team, offer: bestAI.offer };
}

const PHASE_SELECT = 0, PHASE_REVIEW = 1, PHASE_FA = 2, PHASE_DRAFT = 3;
const TAB_GRADES = "grades", TAB_ROSTER = "roster";

export default function GMModePage({ teamData, teamInfo, teamColors, navigateToTeam }) {
  const [phase, setPhase] = useState(PHASE_SELECT);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [userNeeds, setUserNeeds] = useState([]);
  const [signings, setSignings] = useState([]);
  const [faBudgetUsed, setFaBudgetUsed] = useState(0);
  const [faResults, setFaResults] = useState([]);
  const [aiSignings, setAiSignings] = useState([]);
  const [availableFAs, setAvailableFAs] = useState([]);
  const [faFilter, setFaFilter] = useState("ALL");
  const [activeBid, setActiveBid] = useState(null);
  const [bidResult, setBidResult] = useState(null);
  const [hoverTeam, setHoverTeam] = useState(null);
  const [newsLog, setNewsLog] = useState([]);
  // Phase 1 roster management state
  const [reviewTab, setReviewTab] = useState(TAB_GRADES);
  const [cutPlayers, setCutPlayers] = useState([]);
  const [tradedPlayers, setTradedPlayers] = useState([]);
  const [rosterFilter, setRosterFilter] = useState("ALL");
  const [confirmAction, setConfirmAction] = useState(null);
  const [moveLog, setMoveLog] = useState([]);

  useEffect(() => { if (phase === PHASE_FA && availableFAs.length === 0) setAvailableFAs([...FREE_AGENTS]); }, [phase]);

  const teamGrades = selectedTeam ? TEAM_GRADES[selectedTeam] : null;
  const teamCap = selectedTeam && teamData[selectedTeam] ? teamData[selectedTeam].cap : null;
  const originalCap = teamCap ? teamCap.capSpace : 0;
  const cutCapSaved = cutPlayers.reduce((sum, p) => sum + (p.savings || 0), 0);
  const tradeCapSaved = tradedPlayers.reduce((sum, p) => sum + (p.savings || 0), 0);
  const totalRosterSavings = cutCapSaved + tradeCapSaved;
  const adjustedCap = originalCap + totalRosterSavings;
  const effectiveCap = adjustedCap - faBudgetUsed * 1000000;

  // Get or generate roster for selected team
  const teamRoster = useMemo(() => {
    if (!selectedTeam || !teamData[selectedTeam]) return [];
    // Use real roster data if available (e.g. Patriots)
    if (teamData[selectedTeam].roster) return teamData[selectedTeam].roster;
    // Otherwise generate from depth chart
    const depth = teamData[selectedTeam].depth;
    const cap = teamData[selectedTeam].cap;
    if (depth) return generateRoster(depth, cap);
    return [];
  }, [selectedTeam, teamData]);

  const activeRoster = useMemo(() => {
    if (!teamRoster.length) return [];
    const cutNames = new Set(cutPlayers.map(p => p.n));
    const tradeNames = new Set(tradedPlayers.map(p => p.n));
    return teamRoster.filter(p => !cutNames.has(p.n) && !tradeNames.has(p.n) && p.status !== "PS" && p.status !== "PS/IR");
  }, [teamRoster, cutPlayers, tradedPlayers]);

  // ── STYLE HELPERS ──
  const mono9 = {fontFamily:"'JetBrains Mono',monospace",fontSize:"9px"};
  const mono10 = {fontFamily:"'JetBrains Mono',monospace",fontSize:"10px"};
  const osw = (sz,wt=700) => ({fontFamily:"'Oswald',sans-serif",fontSize:sz+"px",fontWeight:wt});
  const card = {background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px"};
  const btn = (bg,c) => ({padding:"6px 12px",borderRadius:"6px",border:"none",cursor:"pointer",background:bg,color:c,...osw(12,600),letterSpacing:"0.5px",textTransform:"uppercase"});

  // ══════════════════════════════════════════════════════════
  // PHASE 0: TEAM SELECTION
  // ══════════════════════════════════════════════════════════
  if (phase === PHASE_SELECT) {
    const confs = { AFC: {}, NFC: {} };
    Object.entries(teamInfo).forEach(([abbr, t]) => { const div = t.div; const conf = t.conf; if (!confs[conf][div]) confs[conf][div] = []; confs[conf][div].push(abbr); });
    const divOrder = ["East","West","North","South"];
    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{...osw(36),color:"var(--dg-text)",letterSpacing:"2px",textTransform:"uppercase",lineHeight:1}}>GM Mode</div>
          <div style={{...mono9,color:"#2dd4bf",letterSpacing:"1.5px",textTransform:"uppercase",marginTop:"6px"}}>Take Control of a Franchise</div>
          <div style={{...mono10,color:"var(--dg-text-dim)",marginTop:"12px",maxWidth:"500px",margin:"12px auto 0",lineHeight:1.6}}>
            Select your team. Cut or trade players to create cap space. Set your priorities. Sign free agents against 31 competing front offices. Then draft your future.
          </div>
        </div>
        {["AFC","NFC"].map(conf => (
          <div key={conf} style={{marginBottom:"24px"}}>
            <div style={{...osw(14),color:"var(--dg-text-faint)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>{conf}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}} className="gm-conf-grid">
              {divOrder.map(d => {
                const divKey = `${conf} ${d}`;
                const teams = (confs[conf][divKey] || []).sort();
                return (
                  <div key={divKey}>
                    <div style={{...mono9,color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>{d}</div>
                    {teams.map(abbr => {
                      const tg = TEAM_GRADES[abbr]; const grade = tg ? getGradeLetter(tg.overall) : "?"; const cap = teamData[abbr]?.cap?.capSpace;
                      return (
                        <div key={abbr}
                          onClick={() => { setSelectedTeam(abbr); setPhase(PHASE_REVIEW); setUserNeeds([...(tg?.topNeeds || [])]); setReviewTab(TAB_GRADES); setCutPlayers([]); setTradedPlayers([]); setMoveLog([]); setConfirmAction(null); setRosterFilter("ALL"); }}
                          onMouseEnter={() => setHoverTeam(abbr)} onMouseLeave={() => setHoverTeam(null)}
                          style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",marginBottom:"4px",
                            background: hoverTeam === abbr ? "rgba(45,212,191,0.06)" : "var(--dg-card)",
                            border:`1px solid ${hoverTeam === abbr ? "rgba(45,212,191,0.2)" : "var(--dg-card-border)"}`,borderRadius:"8px",cursor:"pointer",transition:"all 0.15s"}}>
                          <div style={{width:"36px",height:"24px",borderRadius:"4px",background:teamColors[abbr]||"#333",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <span style={{...mono9,fontWeight:700,color:"#fff",fontSize:"8px"}}>{abbr}</span>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{...osw(12,600),color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{teamInfo[abbr]?.name?.split(" ").pop()}</div>
                            <div style={{...mono9,color:cap >= 0 ? "#22c55e" : "#ef4444"}}>{cap != null ? `${cap >= 0 ? "" : "-"}$${Math.abs(cap/1e6).toFixed(1)}M` : "\u2014"}</div>
                          </div>
                          <div style={{...osw(16),color:tg ? getGradeColor(grade) : "var(--dg-text-faint)"}}>{grade}</div>
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

  // ══════════════════════════════════════════════════════════
  // PHASE 1: ROSTER REVIEW + CUTS + TRADES + NEEDS
  // ══════════════════════════════════════════════════════════
  if (phase === PHASE_REVIEW && selectedTeam && teamGrades) {
    const tg = teamGrades;
    const hasRoster = teamRoster.length > 0;
    const hasRealRoster = !!(teamData[selectedTeam]?.roster);
    const rosterByGroup = {};
    activeRoster.forEach(p => { const g = rosterPosToGroup(p.p); if (!rosterByGroup[g]) rosterByGroup[g] = []; rosterByGroup[g].push(p); });
    const displayGroups = rosterFilter === "ALL" ? [...POS_GROUPS, "ST"] : [rosterFilter];

    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px"}}>
          <button onClick={() => { setPhase(PHASE_SELECT); setSelectedTeam(null); setUserNeeds([]); setCutPlayers([]); setTradedPlayers([]); setMoveLog([]); }} style={{background:"transparent",border:"1px solid var(--dg-card-border)",borderRadius:"6px",padding:"6px 12px",cursor:"pointer",...mono10,color:"var(--dg-text-dim)"}}>← Back</button>
          <div style={{width:"40px",height:"28px",borderRadius:"5px",background:teamColors[selectedTeam]||"#333",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{...mono9,fontWeight:700,color:"#fff"}}>{selectedTeam}</span>
          </div>
          <div>
            <div style={{...osw(22),color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>{teamInfo[selectedTeam]?.name}</div>
            <div style={{...mono10,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase"}}>GM Mode · Roster Management</div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"16px"}} className="gm-summary-grid">
          <div style={{...card,padding:"14px",textAlign:"center"}}>
            <div style={{...mono9,color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Overall</div>
            <div style={{...osw(32),color:getGradeColor(getGradeLetter(tg.overall)),lineHeight:1}}>{getGradeLetter(tg.overall)}</div>
            <div style={{...mono10,color:"var(--dg-text-dim)"}}>{tg.overall}/100</div>
          </div>
          <div style={{...card,padding:"14px",textAlign:"center"}}>
            <div style={{...mono9,color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Cap Space</div>
            <div style={{...osw(22),color:adjustedCap >= 0 ? "#22c55e" : "#ef4444",lineHeight:1}}>{adjustedCap >= 0 ? "" : "-"}${Math.abs(adjustedCap/1e6).toFixed(1)}M</div>
            {totalRosterSavings !== 0 && <div style={{...mono9,color:"#22c55e",marginTop:"2px"}}>+${(totalRosterSavings/1e6).toFixed(1)}M saved</div>}
          </div>
          <div style={{...card,padding:"14px",textAlign:"center"}}>
            <div style={{...mono9,color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Cuts</div>
            <div style={{...osw(22),color:cutPlayers.length > 0 ? "#f97316" : "var(--dg-text-dim)",lineHeight:1}}>{cutPlayers.length}</div>
          </div>
          <div style={{...card,padding:"14px",textAlign:"center"}}>
            <div style={{...mono9,color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Trades</div>
            <div style={{...osw(22),color:tradedPlayers.length > 0 ? "#3b82f6" : "var(--dg-text-dim)",lineHeight:1}}>{tradedPlayers.length}</div>
          </div>
        </div>

        {/* Move Log */}
        {moveLog.length > 0 && (
          <div style={{background:"rgba(45,212,191,0.04)",border:"1px solid rgba(45,212,191,0.12)",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",maxHeight:"140px",overflowY:"auto"}}>
            <div style={{...mono9,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>📋 Transactions</div>
            {moveLog.slice().reverse().map((msg, i) => <div key={i} style={{...mono10,color:"var(--dg-text-dim)",padding:"2px 0",lineHeight:1.4}}>{msg}</div>)}
          </div>
        )}

        {/* Tab Switch */}
        <div style={{display:"flex",gap:"4px",marginBottom:"16px"}}>
          {[{key:TAB_GRADES,label:"Position Grades"}, ...(hasRoster ? [{key:TAB_ROSTER,label:"Roster & Contracts"}] : [])].map(tab => (
            <button key={tab.key} onClick={() => setReviewTab(tab.key)} style={{
              padding:"8px 20px",borderRadius:"6px",border:"none",cursor:"pointer",
              background: reviewTab === tab.key ? "rgba(45,212,191,0.12)" : "var(--dg-card)",
              color: reviewTab === tab.key ? "#2dd4bf" : "var(--dg-text-dim)",
              ...osw(12, reviewTab === tab.key ? 700 : 400),letterSpacing:"0.5px",textTransform:"uppercase",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ── CONFIRM MODAL ── */}
        {confirmAction && (
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
            <div style={{background:"var(--dg-bg,#0f1729)",border:"1px solid var(--dg-card-border)",borderRadius:"16px",padding:"24px",maxWidth:"440px",width:"100%"}}>
              {confirmAction.type === "cut" && (<>
                <div style={{...osw(18),color:"#f97316",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>✂ Confirm Release</div>
                <div style={{...osw(16,600),color:"var(--dg-text)",marginBottom:"4px"}}>{confirmAction.player.n}</div>
                <div style={{...mono10,color:"var(--dg-text-dim)",marginBottom:"16px"}}>{confirmAction.player.p} · #{confirmAction.player.num}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
                  <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:"8px",padding:"12px",textAlign:"center"}}>
                    <div style={{...mono9,color:"#ef4444",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Dead Money</div>
                    <div style={{...osw(20),color:"#ef4444"}}>${((confirmAction.player.dead||0)/1e6).toFixed(1)}M</div>
                  </div>
                  <div style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:"8px",padding:"12px",textAlign:"center"}}>
                    <div style={{...mono9,color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Cap Savings</div>
                    <div style={{...osw(20),color:confirmAction.player.savings > 0 ? "#22c55e" : "#ef4444"}}>{confirmAction.player.savings > 0 ? "+" : ""}${((confirmAction.player.savings||0)/1e6).toFixed(1)}M</div>
                  </div>
                </div>
                {confirmAction.player.savings <= 0 && <div style={{...mono10,color:"#f97316",marginBottom:"12px",lineHeight:1.5}}>⚠ This cut creates negative cap savings — the dead money exceeds the cap relief.</div>}
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={() => setConfirmAction(null)} style={{flex:1,padding:"12px",borderRadius:"6px",background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",cursor:"pointer",...osw(12,600),color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cancel</button>
                  <button onClick={() => { const p = confirmAction.player; setCutPlayers(prev => [...prev, p]); setMoveLog(prev => [...prev, `✂ Released ${p.n} (${p.p}) — saved $${((p.savings||0)/1e6).toFixed(1)}M, $${((p.dead||0)/1e6).toFixed(1)}M dead`]); setConfirmAction(null); }}
                    style={{flex:2,padding:"12px",borderRadius:"6px",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#f97316,#ea580c)",...osw(13),color:"#fff",letterSpacing:"1px",textTransform:"uppercase"}}>Release Player</button>
                </div>
              </>)}
              {confirmAction.type === "trade" && (<>
                <div style={{...osw(18),color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>🔄 Confirm Trade</div>
                <div style={{...osw(16,600),color:"var(--dg-text)",marginBottom:"4px"}}>{confirmAction.player.n}</div>
                <div style={{...mono10,color:"var(--dg-text-dim)",marginBottom:"16px"}}>{confirmAction.player.p} · Cap: ${((confirmAction.player.cap||0)/1e6).toFixed(1)}M</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
                  <div style={{background:"rgba(59,130,246,0.06)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:"8px",padding:"12px"}}>
                    <div style={{...mono9,color:"#3b82f6",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>You Send</div>
                    <div style={{...osw(13,600),color:"var(--dg-text)"}}>{confirmAction.player.n}</div>
                  </div>
                  <div style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:"8px",padding:"12px"}}>
                    <div style={{...mono9,color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>You Receive</div>
                    {confirmAction.tradeReturn.picks.map((pick, i) => <div key={i} style={{...osw(12,600),color:"var(--dg-text)",marginBottom:"2px"}}>{pick}</div>)}
                  </div>
                </div>
                <div style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:"8px",padding:"10px",textAlign:"center",marginBottom:"16px"}}>
                  <div style={{...mono9,color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Cap Relief</div>
                  <div style={{...osw(18),color:"#22c55e"}}>+${((confirmAction.player.savings||0)/1e6).toFixed(1)}M</div>
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={() => setConfirmAction(null)} style={{flex:1,padding:"12px",borderRadius:"6px",background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",cursor:"pointer",...osw(12,600),color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cancel</button>
                  <button onClick={() => { const p = confirmAction.player; const ret = confirmAction.tradeReturn; setTradedPlayers(prev => [...prev, { ...p, tradeReturn: ret }]); setMoveLog(prev => [...prev, `🔄 Traded ${p.n} (${p.p}) → received ${ret.label} · saved $${((p.savings||0)/1e6).toFixed(1)}M`]); setConfirmAction(null); }}
                    style={{flex:2,padding:"12px",borderRadius:"6px",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#3b82f6,#2563eb)",...osw(13),color:"#fff",letterSpacing:"1px",textTransform:"uppercase"}}>Execute Trade</button>
                </div>
              </>)}
            </div>
          </div>
        )}

        {/* ── TAB: GRADES ── */}
        {reviewTab === TAB_GRADES && (<>
          {teamCap?.keyQuestions && (
            <div style={{background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:"10px",padding:"14px 16px",marginBottom:"16px"}}>
              <div style={{...mono9,color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>⚠ Cap Situation</div>
              {teamCap.keyQuestions.map((q,i) => <div key={i} style={{...mono10,color:"var(--dg-text-dim)",lineHeight:1.5,marginBottom:i < teamCap.keyQuestions.length - 1 ? "4px" : 0}}>• {q}</div>)}
            </div>
          )}
          <div style={{...card,borderRadius:"12px",overflow:"hidden",marginBottom:"20px"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid var(--dg-card-border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{...osw(15),color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Position Groups</div>
                <div style={{...mono10,color:"var(--dg-text-dim)",marginTop:"2px"}}>Click positions to toggle as a team need</div>
              </div>
              <div style={{...mono10,color:"#2dd4bf"}}>{userNeeds.length} need{userNeeds.length !== 1 ? "s" : ""} selected</div>
            </div>
            {POS_GROUPS.map((pos, idx) => {
              const data = tg.groups[pos]; if (!data) return null;
              const isNeed = userNeeds.includes(pos); const gradeColor = getGradeColor(data.grade);
              return (
                <div key={pos} onClick={() => setUserNeeds(prev => prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos])}
                  style={{display:"grid",gridTemplateColumns:"80px 44px 1fr",gap:"10px",alignItems:"center",padding:"12px 20px",cursor:"pointer",
                    borderBottom: idx < POS_GROUPS.length - 1 ? "1px solid var(--dg-card-border)" : "none",
                    background: isNeed ? "rgba(239,68,68,0.05)" : "transparent",transition:"background 0.15s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <div style={{width:"16px",height:"16px",borderRadius:"4px",border: isNeed ? "2px solid #ef4444" : "2px solid var(--dg-card-border)",
                      background: isNeed ? "rgba(239,68,68,0.15)" : "transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",flexShrink:0}}>
                      {isNeed && <span style={{color:"#ef4444",fontSize:"10px",fontWeight:700}}>✓</span>}
                    </div>
                    <span style={{...osw(14),color:"var(--dg-text)"}}>{pos}</span>
                  </div>
                  <div style={{textAlign:"center"}}><div style={{...osw(20),color:gradeColor,lineHeight:1}}>{data.grade}</div></div>
                  <div>
                    <div style={{...mono10,color:"var(--dg-text-dim)"}}>{data.starter}</div>
                    <div style={{display:"flex",gap:"12px",marginTop:"2px"}}>
                      {data.age && <span style={{...mono9,color:data.age>=32?"#f97316":data.age>=29?"#facc15":"var(--dg-text-faint)"}}>Age {data.age}</span>}
                      {data.capHit && <span style={{...mono9,color:"var(--dg-text-faint)"}}>Cap: ${data.capHit}</span>}
                    </div>
                    <div style={{...mono9,color:"var(--dg-text-faint)",marginTop:"2px"}}>{data.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {/* ── TAB: ROSTER ── */}
        {reviewTab === TAB_ROSTER && hasRoster && (<>
          {!hasRealRoster && (
            <div style={{background:"rgba(59,130,246,0.04)",border:"1px solid rgba(59,130,246,0.12)",borderRadius:"8px",padding:"10px 14px",marginBottom:"12px"}}>
              <div style={{...mono10,color:"#3b82f6",lineHeight:1.5}}>💡 Contract values are market-based estimates from depth chart data. Star player salaries use known values. Cap savings and dead money are approximations.</div>
            </div>
          )}
          <div style={{display:"flex",gap:"4px",marginBottom:"12px",flexWrap:"wrap"}}>
            {["ALL",...POS_GROUPS,"ST"].map(f => (
              <button key={f} onClick={() => setRosterFilter(f)} style={{
                padding:"5px 10px",borderRadius:"5px",border:"none",cursor:"pointer",
                background: rosterFilter === f ? "rgba(45,212,191,0.12)" : "var(--dg-card)",
                color: rosterFilter === f ? "#2dd4bf" : "var(--dg-text-dim)",
                ...osw(10, rosterFilter===f?700:400),letterSpacing:"0.5px",textTransform:"uppercase",
              }}>{f}</button>
            ))}
          </div>
          {displayGroups.map(group => {
            const players = rosterByGroup[group]; if (!players || players.length === 0) return null;
            const sorted = [...players].sort((a,b) => (b.cap||0) - (a.cap||0));
            return (
              <div key={group} style={{marginBottom:"12px"}}>
                <div style={{...osw(12),color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px",padding:"0 4px"}}>{POS_LABELS[group] || group} ({players.length})</div>
                {sorted.map(player => {
                  const capHit = (player.cap || 0) / 1e6;
                  const deadMoney = (player.dead || 0) / 1e6;
                  const savings = (player.savings || 0) / 1e6;
                  const tradeVal = estimateTradeValue(player);
                  const isCuttable = player.savings > 0;
                  const isTradeable = player.cap > 500000 && !player.flag;
                  return (
                    <div key={player.n} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"8px",alignItems:"center",
                      padding:"10px 14px",...card,borderRadius:"8px",marginBottom:"3px"}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                          <span style={{...osw(13,600),color:"var(--dg-text)"}}>{player.n}</span>
                          {player.starter && <span style={{...mono9,fontSize:"7px",color:"#22c55e",fontWeight:700,background:"rgba(34,197,94,0.1)",padding:"1px 4px",borderRadius:"2px"}}>STARTER</span>}
                          {player.flag && <span style={{...mono9,fontSize:"7px",color:"#f97316",fontWeight:700,background:"rgba(249,115,22,0.1)",padding:"1px 4px",borderRadius:"2px"}}>MIN</span>}
                        </div>
                        <div style={{display:"flex",gap:"10px",marginTop:"3px",flexWrap:"wrap"}}>
                          <span style={{...mono9,color:"var(--dg-text-faint)"}}>{player.p} · #{player.num || "\u2014"}</span>
                          <span style={{...mono9,color:capHit > 15 ? "#f97316" : capHit > 8 ? "#facc15" : "var(--dg-text-faint)"}}>Cap: ${capHit.toFixed(1)}M</span>
                          <span style={{...mono9,color:"var(--dg-text-faint)"}}>Dead: ${deadMoney.toFixed(1)}M</span>
                          <span style={{...mono9,color:savings > 0 ? "#22c55e" : "#ef4444"}}>Save: {savings > 0 ? "+" : ""}${savings.toFixed(1)}M</span>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:"4px",flexShrink:0}}>
                        {isCuttable && <button onClick={e => { e.stopPropagation(); setConfirmAction({type:"cut",player}); }} style={{padding:"5px 10px",borderRadius:"5px",border:"1px solid rgba(249,115,22,0.3)",cursor:"pointer",background:"rgba(249,115,22,0.08)",color:"#f97316",...mono9,fontWeight:700}}>✂ Cut</button>}
                        {isTradeable && <button onClick={e => { e.stopPropagation(); setConfirmAction({type:"trade",player,tradeReturn:tradeVal}); }} style={{padding:"5px 10px",borderRadius:"5px",border:"1px solid rgba(59,130,246,0.3)",cursor:"pointer",background:"rgba(59,130,246,0.08)",color:"#3b82f6",...mono9,fontWeight:700}}>🔄 Trade</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>)}

        {/* Proceed section */}
        <div style={{...card,borderRadius:"12px",padding:"16px 20px"}}>
          <div style={{...mono9,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"10px"}}>Your Draft & FA Priorities</div>
          {userNeeds.length === 0 ? (
            <div style={{...mono10,color:"var(--dg-text-faint)"}}>No needs selected. Switch to Position Grades and click positions to set priorities.</div>
          ) : (
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
              {userNeeds.map((n,i) => (
                <span key={n} style={{...osw(12,600),letterSpacing:"0.5px",padding:"5px 12px",borderRadius:"6px",
                  background:i===0?"rgba(239,68,68,0.15)":i===1?"rgba(249,115,22,0.12)":"rgba(250,204,21,0.08)",
                  color:i===0?"#ef4444":i===1?"#f97316":"#facc15",
                  border:`1px solid ${i===0?"rgba(239,68,68,0.3)":i===1?"rgba(249,115,22,0.25)":"rgba(250,204,21,0.15)"}`}}>#{i+1} {n}</span>
              ))}
            </div>
          )}
          {(cutPlayers.length > 0 || tradedPlayers.length > 0) && (
            <div style={{marginBottom:"12px",padding:"10px 14px",background:"rgba(45,212,191,0.04)",border:"1px solid rgba(45,212,191,0.1)",borderRadius:"8px"}}>
              <div style={{...mono9,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Offseason Moves</div>
              {cutPlayers.map(p => <div key={p.n} style={{...mono10,color:"#f97316",padding:"1px 0"}}>✂ Released {p.n} (+${((p.savings||0)/1e6).toFixed(1)}M)</div>)}
              {tradedPlayers.map(p => <div key={p.n} style={{...mono10,color:"#3b82f6",padding:"1px 0"}}>🔄 Traded {p.n} → {p.tradeReturn.label} (+${((p.savings||0)/1e6).toFixed(1)}M)</div>)}
              <div style={{...mono10,color:"#22c55e",marginTop:"4px",fontWeight:700}}>Net cap created: +${(totalRosterSavings/1e6).toFixed(1)}M</div>
            </div>
          )}
          <button onClick={() => setPhase(PHASE_FA)} disabled={userNeeds.length === 0}
            style={{width:"100%",padding:"14px",borderRadius:"8px",border:"none",cursor:userNeeds.length > 0 ? "pointer" : "not-allowed",
              background:userNeeds.length > 0 ? "linear-gradient(135deg,#2dd4bf,#14b8a6)" : "var(--dg-card-border)",
              color:userNeeds.length > 0 ? "#0c1222" : "var(--dg-text-faint)",
              ...osw(15),letterSpacing:"1.5px",textTransform:"uppercase",transition:"all 0.2s",opacity:userNeeds.length > 0 ? 1 : 0.5}}>
            Enter Free Agency →
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // PHASE 2: FREE AGENCY
  // ══════════════════════════════════════════════════════════
  if (phase === PHASE_FA && selectedTeam) {
    const posGroups = faFilter === "NEEDS" ? userNeeds : faFilter === "ALL" ? null : [faFilter];
    const displayFAs = availableFAs.filter(fa => {
      if (signings.find(s => s.n === fa.n)) return false;
      if (aiSignings.find(s => s.n === fa.n)) return false;
      if (posGroups === null) return true;
      const group = faPosToGroup(fa.p);
      return posGroups.includes(group) || posGroups.includes(fa.p);
    });

    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px",flexWrap:"wrap"}}>
          <button onClick={() => setPhase(PHASE_REVIEW)} style={{background:"transparent",border:"1px solid var(--dg-card-border)",borderRadius:"6px",padding:"6px 12px",cursor:"pointer",...mono10,color:"var(--dg-text-dim)"}}>← Roster</button>
          <div style={{width:"36px",height:"24px",borderRadius:"4px",background:teamColors[selectedTeam]||"#333",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{...mono9,fontSize:"8px",fontWeight:700,color:"#fff"}}>{selectedTeam}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{...osw(20),color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>Free Agency</div>
            <div style={{...mono10,color:"#2dd4bf",letterSpacing:"1px"}}>{signings.length} signing{signings.length !== 1 ? "s" : ""} · ${faBudgetUsed.toFixed(1)}M committed</div>
          </div>
          <button onClick={() => setPhase(PHASE_DRAFT)} style={{background:"linear-gradient(135deg,#2dd4bf,#14b8a6)",border:"none",borderRadius:"6px",padding:"8px 16px",cursor:"pointer",...osw(12),color:"#0c1222",letterSpacing:"1px",textTransform:"uppercase"}}>Proceed to Draft →</button>
        </div>

        {/* Cap + Needs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}} className="gm-summary-grid">
          <div style={{...card,padding:"12px 16px"}}>
            <div style={{...mono9,color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Available Cap</div>
            <div style={{...osw(22),color:effectiveCap>=0?"#22c55e":"#ef4444"}}>{effectiveCap>=0?"":"\u2212"}${Math.abs(effectiveCap/1e6).toFixed(1)}M</div>
            <div style={{...mono9,color:"var(--dg-text-faint)",marginTop:"2px"}}>Base: ${(originalCap/1e6).toFixed(1)}M{totalRosterSavings > 0 ? ` + $${(totalRosterSavings/1e6).toFixed(1)}M moves` : ""} \u2212 ${faBudgetUsed.toFixed(1)}M FA</div>
          </div>
          <div style={{...card,padding:"12px 16px"}}>
            <div style={{...mono9,color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Target Needs</div>
            <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
              {userNeeds.map((n, i) => { const filled = signings.some(s => faPosToGroup(s.p) === n);
                return <span key={n} style={{...osw(10,600),padding:"3px 8px",borderRadius:"4px",
                  background: filled ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                  color: filled ? "#22c55e" : "#ef4444",
                  border: `1px solid ${filled ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  textDecoration: filled ? "line-through" : "none"}}>{n}{filled ? " ✓" : ""}</span>;
              })}
            </div>
          </div>
        </div>

        {/* Signings */}
        {signings.length > 0 && (
          <div style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.12)",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px"}}>
            <div style={{...mono9,color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>✓ Your Signings</div>
            {signings.map(s => <div key={s.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
              <span style={{...osw(12,600),color:"var(--dg-text)"}}>{s.n} <span style={{...mono9,color:"var(--dg-text-dim)"}}>{s.p}</span></span>
              <span style={{...mono10,color:"#22c55e",fontWeight:700}}>${s.signedAAV}M/yr</span>
            </div>)}
          </div>
        )}

        {/* News */}
        {newsLog.length > 0 && (
          <div style={{background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.1)",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",maxHeight:"120px",overflowY:"auto"}}>
            <div style={{...mono9,color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>📰 FA Wire</div>
            {newsLog.slice().reverse().map((msg, i) => <div key={i} style={{...mono10,color:"var(--dg-text-dim)",padding:"2px 0",lineHeight:1.4}}>{msg}</div>)}
          </div>
        )}

        {/* Bid Result */}
        {bidResult && (
          <div style={{background: bidResult.winner === "user" ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
            border: `2px solid ${bidResult.winner === "user" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,borderRadius:"12px",padding:"20px",marginBottom:"16px",textAlign:"center"}}>
            {bidResult.winner === "user" ? (<>
              <div style={{...osw(20),color:"#22c55e",textTransform:"uppercase",letterSpacing:"1px"}}>✓ Signing Complete!</div>
              <div style={{...mono10,color:"var(--dg-text)",marginTop:"8px"}}>{bidResult.fa.n} signs with the {teamInfo[selectedTeam]?.name} — <strong>${bidResult.offer}M/yr</strong></div>
            </>) : (<>
              <div style={{...osw(20),color:"#ef4444",textTransform:"uppercase",letterSpacing:"1px"}}>✗ Outbid!</div>
              <div style={{...mono10,color:"var(--dg-text)",marginTop:"8px"}}>{bidResult.fa.n} signs with the {teamInfo[bidResult.winner]?.name || bidResult.winner} — <strong>${bidResult.offer}M/yr</strong></div>
            </>)}
            <button onClick={() => setBidResult(null)} style={{marginTop:"12px",...card,padding:"8px 20px",cursor:"pointer",...osw(12,600),color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Continue</button>
          </div>
        )}

        {/* Active Bid */}
        {activeBid && !bidResult && (
          <div style={{background:"rgba(45,212,191,0.04)",border:"2px solid rgba(45,212,191,0.2)",borderRadius:"12px",padding:"20px",marginBottom:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"}}>
              <div>
                <div style={{...osw(18),color:"var(--dg-text)"}}>{activeBid.fa.n}</div>
                <div style={{...mono10,color:"var(--dg-text-dim)"}}>{activeBid.fa.p} · Age {activeBid.fa.age} · {activeBid.fa.tm}</div>
                <div style={{...mono10,color:"var(--dg-text-faint)",marginTop:"4px"}}>{activeBid.fa.note}</div>
              </div>
              <button onClick={() => setActiveBid(null)} style={{background:"transparent",border:"none",cursor:"pointer",color:"var(--dg-text-dim)",fontSize:"18px"}}>×</button>
            </div>
            {activeBid.aiBids.length > 0 && (
              <div style={{marginBottom:"12px"}}>
                <div style={{...mono9,color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>⚠ Competing Offers</div>
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                  {activeBid.aiBids.map(ai => <span key={ai.team} style={{...mono10,padding:"3px 8px",borderRadius:"4px",background:teamColors[ai.team]||"#333",color:"#fff"}}>{ai.team}</span>)}
                </div>
              </div>
            )}
            <div style={{marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                <span style={{...mono9,color:"var(--dg-text-faint)"}}>Market Value: ${activeBid.fa.aav}M/yr</span>
                <span style={{...osw(16),color:"#2dd4bf"}}>${activeBid.userOffer.toFixed(1)}M/yr</span>
              </div>
              <input type="range" min={Math.max(activeBid.fa.aav * 0.7, 1)} max={activeBid.fa.aav * 1.4} step={0.5} value={activeBid.userOffer}
                onChange={e => setActiveBid(prev => ({ ...prev, userOffer: parseFloat(e.target.value) }))} style={{width:"100%",accentColor:"#2dd4bf"}} />
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{...mono9,color:"var(--dg-text-faint)"}}>Bargain</span>
                <span style={{...mono9,color:"var(--dg-text-faint)"}}>Overpay</span>
              </div>
            </div>
            {(() => {
              const ratio = activeBid.userOffer / activeBid.fa.aav;
              const hint = activeBid.aiBids.length === 0 ? "No competition — guaranteed signing" : ratio >= 1.15 ? "Strong offer — good chance" : ratio >= 1.0 ? "Fair offer — competitive" : ratio >= 0.9 ? "Below market — risky" : "Lowball — unlikely";
              const hintColor = activeBid.aiBids.length === 0 ? "#22c55e" : ratio >= 1.15 ? "#22c55e" : ratio >= 1.0 ? "#facc15" : "#ef4444";
              return <div style={{...mono10,color:hintColor,marginBottom:"12px",textAlign:"center"}}>{hint}</div>;
            })()}
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={() => setActiveBid(null)} style={{flex:1,padding:"12px",borderRadius:"6px",...card,cursor:"pointer",...osw(12,600),color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Pass</button>
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
                setBidResult({ ...result, fa: activeBid.fa }); setActiveBid(null);
              }} style={{flex:2,padding:"12px",borderRadius:"6px",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#2dd4bf,#14b8a6)",...osw(13),color:"#0c1222",letterSpacing:"1px",textTransform:"uppercase"}}>Submit Offer — ${activeBid.userOffer.toFixed(1)}M/yr</button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div style={{display:"flex",gap:"4px",marginBottom:"12px",flexWrap:"wrap"}}>
          {["ALL","NEEDS",...POS_GROUPS].map(f => {
            const active = faFilter === f;
            return <button key={f} onClick={() => setFaFilter(f)} style={{padding:"5px 12px",borderRadius:"5px",border:"none",cursor:"pointer",
              background: active ? "rgba(45,212,191,0.12)" : "var(--dg-card)",color: active ? "#2dd4bf" : "var(--dg-text-dim)",
              ...osw(11, active?700:400),letterSpacing:"0.5px",textTransform:"uppercase"}}>{f === "NEEDS" ? "🎯 My Needs" : f}</button>;
          })}
        </div>

        {/* FA List */}
        <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
          {displayFAs.length === 0 && <div style={{textAlign:"center",padding:"40px",color:"var(--dg-text-faint)",...mono10}}>No available free agents in this category.</div>}
          {displayFAs.map(fa => {
            const faGroup = faPosToGroup(fa.p); const isNeed = userNeeds.includes(faGroup);
            return (
              <div key={fa.n} onClick={() => { if (activeBid || bidResult) return; const aiBids = generateAIBids(fa, selectedTeam, teamData); setActiveBid({ fa, userOffer: Math.round(fa.aav * 10) / 10, aiBids }); }}
                style={{display:"grid",gridTemplateColumns:"1fr 60px 70px 40px",gap:"8px",alignItems:"center",padding:"12px 16px",borderRadius:"8px",
                  cursor:activeBid || bidResult ? "default" : "pointer",
                  background: isNeed ? "rgba(239,68,68,0.03)" : "var(--dg-card)",
                  border:`1px solid ${isNeed ? "rgba(239,68,68,0.1)" : "var(--dg-card-border)"}`,transition:"all 0.15s",opacity: activeBid || bidResult ? 0.5 : 1}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <span style={{...osw(13,600),color:"var(--dg-text)"}}>{fa.n}</span>
                    {isNeed && <span style={{...mono9,fontSize:"7px",color:"#ef4444",fontWeight:700,background:"rgba(239,68,68,0.1)",padding:"1px 4px",borderRadius:"2px"}}>NEED</span>}
                  </div>
                  <div style={{...mono9,color:"var(--dg-text-faint)",marginTop:"2px"}}>{fa.stats?.split("·")[0]?.trim()}</div>
                </div>
                <div style={{textAlign:"center"}}><span style={{...osw(11,600),color:"var(--dg-text-dim)",background:"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:"4px"}}>{fa.p}</span></div>
                <div style={{textAlign:"right"}}><span style={{...osw(14),color:"#2dd4bf"}}>${fa.aav}M</span></div>
                <div style={{textAlign:"center"}}><span style={{...mono10,color:"var(--dg-text-faint)"}}>Age {fa.age}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // PHASE 3: DRAFT (placeholder)
  // ══════════════════════════════════════════════════════════
  if (phase === PHASE_DRAFT) {
    return (
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",justifyContent:"center"}}>
          <button onClick={() => setPhase(PHASE_FA)} style={{background:"transparent",border:"1px solid var(--dg-card-border)",borderRadius:"6px",padding:"6px 12px",cursor:"pointer",...mono10,color:"var(--dg-text-dim)"}}>← Back to FA</button>
          <div style={{...osw(22),color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>Draft Day</div>
        </div>
        {(cutPlayers.length > 0 || tradedPlayers.length > 0 || signings.length > 0) && (
          <div style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.12)",borderRadius:"10px",padding:"16px",marginBottom:"20px",textAlign:"left",maxWidth:"500px",margin:"0 auto 20px"}}>
            <div style={{...mono9,color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>Offseason Recap</div>
            {cutPlayers.map(p => <div key={p.n} style={{display:"flex",justifyContent:"space-between",padding:"2px 0"}}><span style={{...mono10,color:"#f97316"}}>✂ Released {p.n}</span><span style={{...mono10,color:"#22c55e"}}>+${((p.savings||0)/1e6).toFixed(1)}M</span></div>)}
            {tradedPlayers.map(p => <div key={p.n} style={{display:"flex",justifyContent:"space-between",padding:"2px 0"}}><span style={{...mono10,color:"#3b82f6"}}>🔄 Traded {p.n} → {p.tradeReturn?.label}</span><span style={{...mono10,color:"#22c55e"}}>+${((p.savings||0)/1e6).toFixed(1)}M</span></div>)}
            {signings.map(s => <div key={s.n} style={{display:"flex",justifyContent:"space-between",padding:"2px 0"}}><span style={{...osw(11),color:"var(--dg-text)"}}>✓ Signed {s.n} <span style={{fontSize:"10px",color:"var(--dg-text-dim)"}}>{s.p}</span></span><span style={{...mono10,color:"#2dd4bf"}}>${s.signedAAV}M</span></div>)}
            <div style={{borderTop:"1px solid rgba(34,197,94,0.15)",marginTop:"8px",paddingTop:"8px",display:"flex",justifyContent:"space-between"}}>
              <span style={{...mono10,color:"var(--dg-text-dim)"}}>Effective Cap</span>
              <span style={{...osw(13),color:effectiveCap>=0?"#22c55e":"#ef4444"}}>${(effectiveCap/1e6).toFixed(1)}M</span>
            </div>
          </div>
        )}
        <div style={{...card,borderRadius:"10px",padding:"16px",marginBottom:"20px",maxWidth:"500px",margin:"0 auto 20px"}}>
          <div style={{...mono9,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>Updated Draft Needs</div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}}>
            {userNeeds.map((n, i) => { const filled = signings.some(s => faPosToGroup(s.p) === n);
              return <span key={n} style={{...osw(12,600),padding:"5px 12px",borderRadius:"6px",
                background: filled ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: filled ? "#22c55e" : "#ef4444",border: `1px solid ${filled ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                textDecoration: filled ? "line-through" : "none"}}>{n}{filled ? " ✓" : ""}</span>;
            })}
          </div>
          <div style={{...mono10,color:"var(--dg-text-faint)",marginTop:"10px"}}>Remaining needs will be prioritized in the draft.</div>
        </div>
        <div style={{...card,border:"1px dashed var(--dg-card-border)",borderRadius:"12px",padding:"40px 20px",maxWidth:"500px",margin:"0 auto"}}>
          <div style={{...osw(18),color:"var(--dg-text-dim)",marginBottom:"8px"}}>🏈 Draft Integration</div>
          <div style={{...mono10,color:"var(--dg-text-faint)",lineHeight:1.6}}>Draft simulator integration coming soon.<br/>Your cuts, trades, FA signings, and updated needs will feed directly into the mock draft engine.</div>
        </div>
        <button onClick={() => setPhase(PHASE_FA)} style={{marginTop:"20px",padding:"10px 24px",borderRadius:"6px",background:"transparent",border:"1px solid var(--dg-card-border)",cursor:"pointer",...osw(12,600),color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase"}}>← Return to Free Agency</button>
      </div>
    );
  }

  return null;
}
