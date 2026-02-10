import { useState, useMemo, useEffect } from "react";
import PLAYERS from "./players.js";
import PROFILES from "./profiles.js";
import FREE_AGENTS from "./freeagents.js"; // Used by FreeAgencyPage (hidden from nav)
import { NE_ROSTER, NE_CAP, NE_DEPTH_CHART, NE_DEAD_MONEY } from "./patriots-roster.js";
import { BUF_CAP, BUF_DEPTH_CHART } from "./bills-roster.js";
import { NYJ_CAP, NYJ_DEPTH_CHART } from "./jets-roster.js";
import { MIA_CAP, MIA_DEPTH_CHART } from "./dolphins-roster.js";
import { DEN_CAP, DEN_DEPTH_CHART } from "./broncos-roster.js";
import { KC_CAP, KC_DEPTH_CHART } from "./chiefs-roster.js";
import { LV_CAP, LV_DEPTH_CHART } from "./raiders-roster.js";
import { LAC_CAP, LAC_DEPTH_CHART } from "./chargers-roster.js";
import { BAL_CAP, BAL_DEPTH_CHART } from "./ravens-roster.js";
import { CIN_CAP, CIN_DEPTH_CHART } from "./bengals-roster.js";
import { CLE_CAP, CLE_DEPTH_CHART } from "./browns-roster.js";
import { PIT_CAP, PIT_DEPTH_CHART } from "./steelers-roster.js";
import { HOU_CAP, HOU_DEPTH_CHART } from "./texans-roster.js";
import { IND_CAP, IND_DEPTH_CHART } from "./colts-roster.js";
import { JAX_CAP, JAX_DEPTH_CHART } from "./jaguars-roster.js";
import { TEN_CAP, TEN_DEPTH_CHART } from "./titans-roster.js";
import { DAL_CAP, DAL_DEPTH_CHART } from "./cowboys-roster.js";
import { NYG_CAP, NYG_DEPTH_CHART } from "./giants-roster.js";
import { PHI_CAP, PHI_DEPTH_CHART } from "./eagles-roster.js";
import { WAS_CAP, WAS_DEPTH_CHART } from "./commanders-roster.js";
import { ARI_CAP, ARI_DEPTH_CHART } from "./cardinals-roster.js";
import { LAR_CAP, LAR_DEPTH_CHART } from "./rams-roster.js";
import { SF_CAP, SF_DEPTH_CHART } from "./niners-roster.js";
import { SEA_CAP, SEA_DEPTH_CHART } from "./seahawks-roster.js";
import { CHI_CAP, CHI_DEPTH_CHART } from "./bears-roster.js";
import { DET_CAP, DET_DEPTH_CHART } from "./lions-roster.js";
import { GB_CAP, GB_DEPTH_CHART } from "./packers-roster.js";
import { MIN_CAP, MIN_DEPTH_CHART } from "./vikings-roster.js";
import { ATL_CAP, ATL_DEPTH_CHART } from "./falcons-roster.js";
import { CAR_CAP, CAR_DEPTH_CHART } from "./panthers-roster.js";
import { NO_CAP, NO_DEPTH_CHART } from "./saints-roster.js";
import { TB_CAP, TB_DEPTH_CHART } from "./bucs-roster.js";
import { TEAM_GRADES, getGradeLetter, getGradeColor } from "./team-needs-grades.js";
// import GMModePage from "./GMMode.jsx"; // Hidden: GM Mode removed from nav

/* ───── constants ───── */
const POS_COLORS = {
  QB:{bg:"#dc2626",text:"#fff"},RB:{bg:"#2563eb",text:"#fff"},WR:{bg:"#f59e0b",text:"#1a1a2e"},
  TE:{bg:"#f97316",text:"#fff"},OT:{bg:"#16a34a",text:"#fff"},IOL:{bg:"#15803d",text:"#fff"},
  DL:{bg:"#7c3aed",text:"#fff"},EDGE:{bg:"#a855f7",text:"#fff"},LB:{bg:"#0891b2",text:"#fff"},
  CB:{bg:"#db2777",text:"#fff"},S:{bg:"#e11d48",text:"#fff"},K:{bg:"#737373",text:"#fff"},
  P:{bg:"#737373",text:"#fff"},LS:{bg:"#737373",text:"#fff"},
};

const OFF_POSITIONS = ["QB","RB","WR","TE","OT","IOL"];
const DEF_POSITIONS = ["DL","EDGE","LB","CB","S"];

const PAGES = ["HOME","BIG BOARD","MOCK DRAFT"];

/* ───── small components ───── */
function PosBadge({ pos }) {
  const c = POS_COLORS[pos] || {bg:"#555",text:"#fff"};
  return (
    <span className="pos-badge" style={{
      fontSize:"11px",fontWeight:700,letterSpacing:"0.5px",
      fontFamily:"'JetBrains Mono',monospace",display:"inline-block",
      minWidth:"42px",textAlign:"center",
    }}>{pos}</span>
  );
}

function PlayerRow({ player, posRank, index, isPositionView, expanded, onToggle, navigateToTeam, compareMode, compareSelected, onCompareToggle }) {
  const [hovered, setHovered] = useState(false);
  const profile = PROFILES[player.n];
  const hasProfile = !!profile;
  const fitTeams = (POS_TO_TEAMS[player.p] || []).slice(0, 4);

  return (
    <div>
      <div
        className="player-row"
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        onClick={()=>{
          if (compareMode && onCompareToggle) { onCompareToggle(player); return; }
          if(hasProfile && onToggle) onToggle(player.r);
        }}
        style={{
          display:"grid",
          gridTemplateColumns: compareMode ? "28px 70px 52px 1fr 1fr" : "70px 52px 1fr 1fr",
          alignItems:"center",gap:"12px",padding:"12px 20px",
          background: compareSelected ? "rgba(245,158,11,0.08)" : expanded ? "rgba(45,212,191,0.08)" : hovered ? "rgba(45,212,191,0.06)" : index%2===0 ? "transparent" : "rgba(255,255,255,0.015)",
          borderBottom: expanded ? "none" : "1px solid rgba(255,255,255,0.04)",
          borderLeft: compareSelected ? "2px solid #f59e0b" : "2px solid transparent",
          transition:"background 0.15s ease",
          cursor: compareMode ? "pointer" : hasProfile ? "pointer" : "default",
        }}
      >
        {/* Compare checkbox */}
        {compareMode && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:"18px",height:"18px",borderRadius:"4px",border:compareSelected?"2px solid #f59e0b":"2px solid rgba(255,255,255,0.15)",background:compareSelected?"rgba(245,158,11,0.2)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
              {compareSelected && <span style={{color:"#f59e0b",fontSize:"12px",fontWeight:700}}>✓</span>}
            </div>
          </div>
        )}
        {/* Rank */}
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <span className="rank-number" style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,
            color:"#2dd4bf",lineHeight:1,minWidth:"32px",textAlign:"right",
          }}>#{isPositionView ? posRank : player.r}</span>
          {!isPositionView && posRank && (
            <span className="rank-badge" style={{
              fontSize:"10px",color:"var(--dg-text-dim)",fontFamily:"'JetBrains Mono',monospace",
              background:"rgba(45,212,191,0.08)",padding:"2px 6px",borderRadius:"3px",
            }}>P{posRank}</span>
          )}
          {isPositionView && (
            <span className="rank-badge" style={{
              fontSize:"10px",color:"var(--dg-text-dim)",fontFamily:"'JetBrains Mono',monospace",
              background:"rgba(45,212,191,0.08)",padding:"2px 6px",borderRadius:"3px",
            }}>#{player.r}</span>
          )}
        </div>
        <PosBadge pos={player.p} />
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div className="player-name" style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:500,
            color:"var(--dg-text)",letterSpacing:"0.2px",
          }}>{player.n}</div>
          {hasProfile && (
            <span style={{
              fontSize:"10px",color: expanded ? "#2dd4bf" : "#475569",
              transition:"transform 0.2s, color 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
              display:"inline-block",
            }}>▼</span>
          )}
        </div>
        <div className="player-school" style={{
          display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"8px",
          fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",
          color:"var(--dg-text-muted)",textAlign:"right",
        }}>
          <span>{player.s}</span>
          {isPositionView && (
            <span style={{color:"var(--dg-text-faint)",fontSize:"11px"}}>OVR #{player.r}</span>
          )}
          {fitTeams.length > 0 && navigateToTeam && (
            <span className="team-fits" style={{display:"inline-flex",gap:"2px",marginLeft:"4px"}}>
              {fitTeams.map(a => (
                <span key={a} onClick={e=>{e.stopPropagation();navigateToTeam(a);}} title={`${TEAM_INFO[a]?.name || a} needs ${player.p}`} style={{
                  width:"22px",height:"14px",borderRadius:"2px",background:TEAM_COLORS[a]||"#333",
                  display:"inline-flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",fontWeight:700,color:"#fff",
                  cursor:"pointer",opacity:0.7,transition:"opacity 0.15s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.opacity="1";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="0.7";}}
                >{a}</span>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Profile Card */}
      {expanded && profile && (
        <div style={{
          background:"linear-gradient(180deg, rgba(45,212,191,0.06) 0%, rgba(27,42,74,0.3) 100%)",
          borderBottom:"1px solid rgba(45,212,191,0.12)",
          padding:"20px 24px",
        }}>
          {/* Bio bar */}
          <div className="profile-bio-bar" style={{
            display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",
            marginBottom:"16px",paddingBottom:"14px",
            borderBottom:"1px solid var(--dg-card-border)",
          }}>
            <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
              {[
                {label:"AGE",value:profile.age},
                {label:"HT",value:profile.height},
                {label:"WT",value:`${profile.weight} lbs`},
                {label:"CLASS",value:profile.class},
              ].map(stat=>(
                <div key={stat.label} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>{stat.label}</div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:"var(--dg-text)",marginTop:"1px"}}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:"12px",flexWrap:"wrap",alignItems:"center"}}>
              {profile.projected && (
                <div style={{
                  background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.2)",
                  borderRadius:"6px",padding:"4px 12px",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#2dd4bf",fontWeight:600,
                }}>{profile.projected}</div>
              )}
              {profile.comp && (
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px"}}>NFL COMP</div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:"#f59e0b"}}>{profile.comp}</div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <p style={{
            fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-muted)",
            lineHeight:1.7,margin:"0 0 16px",
          }}>{profile.summary}</p>

          {/* Pros & Cons */}
          <div className="profile-pros-cons" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
            {/* Pros */}
            <div>
              <div style={{
                display:"flex",alignItems:"center",gap:"6px",marginBottom:"8px",
              }}>
                <span style={{color:"#22c55e",fontSize:"14px",fontWeight:700}}>✓</span>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"#22c55e",letterSpacing:"0.5px",textTransform:"uppercase"}}>Strengths</span>
              </div>
              {profile.pros.map((pro,i)=>(
                <div key={i} style={{
                  display:"flex",gap:"8px",marginBottom:"6px",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#cbd5e1",lineHeight:1.5,
                }}>
                  <span style={{color:"#22c55e",flexShrink:0,marginTop:"1px"}}>•</span>
                  <span>{pro}</span>
                </div>
              ))}
            </div>
            {/* Cons */}
            <div>
              <div style={{
                display:"flex",alignItems:"center",gap:"6px",marginBottom:"8px",
              }}>
                <span style={{color:"#ef4444",fontSize:"14px",fontWeight:700}}>✗</span>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"#ef4444",letterSpacing:"0.5px",textTransform:"uppercase"}}>Weaknesses</span>
              </div>
              {profile.cons.map((con,i)=>(
                <div key={i} style={{
                  display:"flex",gap:"8px",marginBottom:"6px",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#cbd5e1",lineHeight:1.5,
                }}>
                  <span style={{color:"#ef4444",flexShrink:0,marginTop:"1px"}}>•</span>
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

/* ───── position filter bar ───── */
function PositionFilter({ activePos, setActivePos }) {
  const btnStyle = (pos) => {
    const active = activePos === pos;
    const isAll = pos === "ALL";
    return {
      background: active ? (isAll ? "#2dd4bf" : (POS_COLORS[pos]?.bg || "#2dd4bf")) : "rgba(255,255,255,0.04)",
      color: active ? (isAll ? "#0c1222" : (POS_COLORS[pos]?.text || "#fff")) : "var(--dg-text-muted)",
      border: active ? "none" : "1px solid rgba(255,255,255,0.06)",
      borderRadius:"6px",padding:"6px 12px",cursor:"pointer",
      fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,
      letterSpacing:"0.5px",transition:"all 0.15s ease",whiteSpace:"nowrap",
    };
  };

  return (
    <div className="pos-filter" style={{
      display:"flex",flexDirection:"column",gap:"10px",
      background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",
      borderRadius:"10px",padding:"14px 16px",marginBottom:"16px",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
        <button className="pos-filter-btn" onClick={()=>setActivePos("ALL")} style={btnStyle("ALL")}>ALL</button>
        <div className="pos-divider" style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",
          letterSpacing:"1.5px",textTransform:"uppercase",marginRight:"2px",
        }}>OFF</span>
        {OFF_POSITIONS.map(pos=>(
          <button className="pos-filter-btn" key={pos} onClick={()=>setActivePos(activePos===pos?"ALL":pos)} style={btnStyle(pos)}>{pos}</button>
        ))}
        <div className="pos-divider" style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",
          letterSpacing:"1.5px",textTransform:"uppercase",marginRight:"2px",
        }}>DEF</span>
        {DEF_POSITIONS.map(pos=>(
          <button className="pos-filter-btn" key={pos} onClick={()=>setActivePos(activePos===pos?"ALL":pos)} style={btnStyle(pos)}>{pos}</button>
        ))}
      </div>
    </div>
  );
}

/* ───── Home Page ───── */
function HomePage({ setPage, navigateToTeam }) {
  const topByPos = useMemo(()=>{
    const result = {};
    PLAYERS.forEach(p=>{ if(!result[p.p]) result[p.p] = p; });
    return result;
  },[]);

  const top10 = PLAYERS.slice(0,10);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const togglePlayer = (id) => setExpandedPlayer(expandedPlayer===id?null:id);

  const renderProfile = (profile) => (
    <div style={{
      background:"linear-gradient(180deg, rgba(45,212,191,0.06) 0%, rgba(27,42,74,0.3) 100%)",
      borderBottom:"1px solid rgba(45,212,191,0.12)",
      padding:"16px 12px",marginTop:"4px",borderRadius:"8px",
    }}>
      <div className="profile-bio-bar" style={{
        display:"flex",flexWrap:"wrap",gap:"12px",alignItems:"center",
        marginBottom:"12px",paddingBottom:"10px",
        borderBottom:"1px solid var(--dg-card-border)",
      }}>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          {[
            {label:"AGE",value:profile.age},
            {label:"HT",value:profile.height},
            {label:"WT",value:`${profile.weight} lbs`},
            {label:"CLASS",value:profile.class},
          ].map(stat=>(
            <div key={stat.label} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px"}}>{stat.label}</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"var(--dg-text)",marginTop:"1px"}}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
          {profile.projected && (
            <div style={{
              background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.2)",
              borderRadius:"6px",padding:"3px 10px",
              fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",fontWeight:600,
            }}>{profile.projected}</div>
          )}
          {profile.comp && (
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px"}}>NFL COMP</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"#f59e0b"}}>{profile.comp}</div>
            </div>
          )}
        </div>
      </div>
      <p style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)",
        lineHeight:1.7,margin:"0 0 12px",
      }}>{profile.summary}</p>
      <div className="profile-pros-cons" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"6px"}}>
            <span style={{color:"#22c55e",fontSize:"12px",fontWeight:700}}>✓</span>
            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:600,color:"#22c55e",letterSpacing:"0.5px",textTransform:"uppercase"}}>Strengths</span>
          </div>
          {profile.pros.map((pro,i)=>(
            <div key={i} style={{display:"flex",gap:"6px",marginBottom:"4px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#cbd5e1",lineHeight:1.5}}>
              <span style={{color:"#22c55e",flexShrink:0}}>•</span><span>{pro}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"6px"}}>
            <span style={{color:"#ef4444",fontSize:"12px",fontWeight:700}}>✗</span>
            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:600,color:"#ef4444",letterSpacing:"0.5px",textTransform:"uppercase"}}>Weaknesses</span>
          </div>
          {profile.cons.map((con,i)=>(
            <div key={i} style={{display:"flex",gap:"6px",marginBottom:"4px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#cbd5e1",lineHeight:1.5}}>
              <span style={{color:"#ef4444",flexShrink:0}}>•</span><span>{con}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-content" style={{maxWidth:"960px",margin:"0 auto",padding:"24px 24px 60px"}}>
      {/* Hero */}
      <div className="hero-section" style={{
        background:"linear-gradient(135deg, rgba(45,212,191,0.06) 0%, rgba(27,42,74,0.5) 50%, rgba(45,212,191,0.03) 100%)",
        border:"1px solid rgba(45,212,191,0.12)",borderRadius:"16px",
        padding:"40px 32px",marginBottom:"32px",textAlign:"center",
      }}>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#2dd4bf",
          letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px",
        }}>2026 NFL Draft</div>
        <h2 style={{
          fontFamily:"'Oswald',sans-serif",fontSize:"clamp(28px,5vw,42px)",fontWeight:700,
          color:"var(--dg-text)",margin:"0 0 8px",letterSpacing:"1px",textTransform:"uppercase",
        }}>Consensus Big Board</h2>
        <p style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",color:"var(--dg-text-dim)",
          maxWidth:"500px",margin:"0 auto 24px",lineHeight:1.6,
        }}>
          Rankings aggregated from 92 expert big boards. Updated weekly.
        </p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setPage("BIG BOARD")} style={{
            background:"#2dd4bf",color:"#0c1222",border:"none",borderRadius:"8px",
            padding:"12px 28px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",
            fontSize:"14px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",
            transition:"all 0.2s ease",
          }}>View Big Board</button>
          <button onClick={()=>setPage("MOCK DRAFT")} style={{
            background:"transparent",color:"#2dd4bf",
            border:"1.5px solid rgba(45,212,191,0.3)",borderRadius:"8px",
            padding:"12px 28px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",
            fontSize:"14px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",
            transition:"all 0.2s ease",
          }}>Mock Draft</button>
        </div>
        {/* Team Quick Access */}
        {navigateToTeam && (
          <div style={{marginTop:"28px",paddingTop:"20px",borderTop:"1px solid rgba(45,212,191,0.08)"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"4px"}}>Team Draft Profiles</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",letterSpacing:"0.5px",marginBottom:"12px"}}>Draft capital · team needs · prospect fits</div>
            <div className="team-badges-grid" style={{display:"flex",flexWrap:"wrap",gap:"6px",justifyContent:"center",maxWidth:"800px",margin:"0 auto"}}>
              {Object.entries(TEAM_INFO).sort((a,b) => a[1].name.localeCompare(b[1].name)).map(([ab]) => (
                <span key={ab} onClick={()=>navigateToTeam(ab)} title={TEAM_INFO[ab]?.name} className="team-badge" style={{
                  width:"48px",height:"32px",borderRadius:"5px",background:TEAM_COLORS[ab]||"#333",
                  display:"inline-flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:700,color:"#fff",
                  cursor:"pointer",opacity:0.75,transition:"all 0.15s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="scale(1.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="0.75";e.currentTarget.style.transform="scale(1)";}}
                >{ab}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two-column: Top 10 + Position Leaders */}
      <div className="home-grid" style={{
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",marginBottom:"32px",
      }}>
        {/* Top 10 Overall */}
        <div style={{
          background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",
          borderRadius:"12px",padding:"20px",
        }}>
          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",
          }}>
            <h3 style={{
              fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,
              color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase",margin:0,
            }}>Top 10 Overall</h3>
            <button onClick={()=>setPage("BIG BOARD")} style={{
              background:"none",border:"none",color:"#2dd4bf",cursor:"pointer",
              fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",
            }}>View All →</button>
          </div>
          {top10.map((p,i)=>{
            const profile = PROFILES[p.n];
            const isExpanded = expandedPlayer === `top-${p.r}`;
            return (
              <div key={p.r}>
                <div onClick={()=>{ if(profile) togglePlayer(`top-${p.r}`); }} style={{
                  display:"flex",alignItems:"center",gap:"12px",
                  padding:"8px 0",borderBottom: i<9 && !isExpanded ? "1px solid rgba(255,255,255,0.04)" : isExpanded ? "none" : "none",
                  cursor: profile ? "pointer" : "default",
                  background: isExpanded ? "rgba(45,212,191,0.04)" : "transparent",
                  borderRadius: isExpanded ? "6px 6px 0 0" : "0",
                  padding: isExpanded ? "8px 8px" : "8px 0",
                  transition:"background 0.15s",
                }}>
                  <span style={{
                    fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,
                    color:"#2dd4bf",minWidth:"28px",textAlign:"right",
                  }}>#{p.r}</span>
                  <PosBadge pos={p.p}/>
                  <span style={{
                    fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,
                    color:"var(--dg-text)",flex:1,
                  }}>{p.n}</span>
                  {profile && (
                    <span style={{
                      fontSize:"9px",color: isExpanded ? "#2dd4bf" : "#475569",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                      display:"inline-block",transition:"transform 0.2s, color 0.2s",marginRight:"4px",
                    }}>▼</span>
                  )}
                  <span style={{
                    fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",
                  }}>{p.s}</span>
                </div>
                {isExpanded && profile && renderProfile(profile)}
                {(i<9 && !isExpanded) && <div style={{borderBottom:"1px solid var(--dg-divider)"}}/>}
              </div>
            );
          })}
        </div>

        {/* Position Leaders */}
        <div style={{
          background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",
          borderRadius:"12px",padding:"20px",
        }}>
          <h3 style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,
            color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase",
            margin:"0 0 16px",
          }}>#1 at Each Position</h3>
          {[...OFF_POSITIONS,...DEF_POSITIONS].map((pos,i,arr)=>{
            const p = topByPos[pos];
            if(!p) return null;
            const profile = PROFILES[p.n];
            const isExpanded = expandedPlayer === `pos-${pos}`;
            return (
              <div key={pos}>
                <div onClick={()=>{ if(profile) togglePlayer(`pos-${pos}`); }} style={{
                  display:"flex",alignItems:"center",gap:"12px",
                  padding: isExpanded ? "8px 8px" : "8px 0",
                  cursor: profile ? "pointer" : "default",
                  background: isExpanded ? "rgba(45,212,191,0.04)" : "transparent",
                  borderRadius: isExpanded ? "6px 6px 0 0" : "0",
                  transition:"background 0.15s",
                }}>
                  <PosBadge pos={pos}/>
                  <span style={{
                    fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,
                    color:"var(--dg-text)",flex:1,
                  }}>{p.n}</span>
                  {profile && (
                    <span style={{
                      fontSize:"9px",color: isExpanded ? "#2dd4bf" : "#475569",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                      display:"inline-block",transition:"transform 0.2s, color 0.2s",
                    }}>▼</span>
                  )}
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)"}}>{p.s}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-faint)"}}>#{p.r}</span>
                </div>
                {isExpanded && profile && renderProfile(profile)}
                {(i<arr.length-1 && !isExpanded) && <div style={{borderBottom:"1px solid var(--dg-divider)"}}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}}>
        {[
          {label:"Total Prospects",value:PLAYERS.length},
          {label:"NFL Teams",value:32},
          {label:"Positions Tracked",value:11},
        ].map(stat=>(
          <div key={stat.label} style={{
            background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",
            borderRadius:"10px",padding:"20px",textAlign:"center",
          }}>
            <div className="stat-value" style={{
              fontFamily:"'Oswald',sans-serif",fontSize:"32px",fontWeight:700,
              color:"#2dd4bf",lineHeight:1,
            }}>{stat.value}</div>
            <div style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",
              letterSpacing:"1px",textTransform:"uppercase",marginTop:"6px",
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── Big Board Page ───── */
function BigBoardPage({ navigateToTeam, openCompare }) {
  const [activePos, setActivePos] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [builderMode, setBuilderMode] = useState(false);
  const [myBoard, setMyBoard] = useState([]); // array of player objects in order
  const [builderSearch, setBuilderSearch] = useState("");
  const [builderPosFilter, setBuilderPosFilter] = useState("ALL");
  const [showBuilderResults, setShowBuilderResults] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelections, setCompareSelections] = useState([]); // array of player objects
  const PER_PAGE = 50;

  useEffect(()=>{ setPage(0); },[activePos, search]);

  const positionRanks = useMemo(()=>{
    const counters = {};
    const map = {};
    PLAYERS.forEach(p=>{
      counters[p.p] = (counters[p.p]||0)+1;
      map[p.r] = counters[p.p];
    });
    return map;
  },[]);

  const filtered = useMemo(()=>{
    let list = PLAYERS;
    if(activePos !== "ALL") list = list.filter(p=>p.p===activePos);
    if(search.trim()){
      const q = search.toLowerCase();
      list = list.filter(p=>p.n.toLowerCase().includes(q)||p.s.toLowerCase().includes(q)||p.p.toLowerCase().includes(q));
    }
    return list;
  },[activePos,search]);

  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const pageData = filtered.slice(page*PER_PAGE,(page+1)*PER_PAGE);
  const isPositionView = activePos !== "ALL";
  const posTopPlayer = isPositionView && filtered.length>0 ? filtered[0] : null;

  // Builder helpers
  const boardSet = useMemo(() => new Set(myBoard.map(p=>p.r)), [myBoard]);
  const builderAvailable = useMemo(() => {
    let list = PLAYERS.filter(p => !boardSet.has(p.r));
    if (builderPosFilter !== "ALL") list = list.filter(p => p.p === builderPosFilter);
    if (builderSearch.trim()) {
      const q = builderSearch.toLowerCase();
      list = list.filter(p => p.n.toLowerCase().includes(q) || p.s.toLowerCase().includes(q));
    }
    return list;
  }, [boardSet, builderPosFilter, builderSearch]);

  const addToBoard = (player) => {
    if (myBoard.length >= 100 || boardSet.has(player.r)) return;
    setMyBoard(prev => [...prev, player]);
  };
  const removeFromBoard = (index) => {
    setMyBoard(prev => prev.filter((_, i) => i !== index));
  };
  const moveUp = (index) => {
    if (index === 0) return;
    setMyBoard(prev => {
      const arr = [...prev];
      [arr[index-1], arr[index]] = [arr[index], arr[index-1]];
      return arr;
    });
  };
  const moveDown = (index) => {
    if (index >= myBoard.length - 1) return;
    setMyBoard(prev => {
      const arr = [...prev];
      [arr[index], arr[index+1]] = [arr[index+1], arr[index]];
      return arr;
    });
  };

  // Builder Results Screen
  if (showBuilderResults) {
    return (
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"var(--dg-bg)",zIndex:300,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflowY:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
          <div style={{width:"100%",maxWidth:"820px",margin:"0 auto",padding:"clamp(10px,2vw,20px)"}}>
            <div style={{textAlign:"center",marginBottom:"clamp(12px,2vw,20px)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"4px"}}>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(12px,2vw,16px)",fontWeight:700,color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>Draft Guide</div>
              </div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(16px,3vw,24px)",fontWeight:700,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.2}}>My Big Board</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1.2vw,10px)",color:"var(--dg-text-dim)",letterSpacing:"1px",textTransform:"uppercase",marginTop:"2px"}}>{myBoard.length} Prospects Ranked</div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"0",border:"1px solid var(--dg-card-border2)",borderRadius:"clamp(6px,1vw,10px)",overflow:"hidden"}}>
              {myBoard.map((player, idx) => {
                const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                const diff = player.r - (idx + 1);
                const row = Math.floor(idx / 4);
                const rows = Math.ceil(myBoard.length / 4);
                return (
                  <div key={player.r} style={{
                    padding:"clamp(5px,0.8vw,10px) clamp(6px,0.9vw,12px)",
                    background: row % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    borderBottom: row < rows - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    borderRight: idx % 4 < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:"clamp(3px,0.5vw,6px)",marginBottom:"clamp(2px,0.3vw,3px)"}}>
                      <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.3vw,14px)",fontWeight:700,color:"#2dd4bf"}}>{idx+1}</span>
                      <span style={{background:pc.bg,color:pc.text,padding:"1px clamp(3px,0.5vw,5px)",borderRadius:"2px",fontSize:"clamp(6px,0.85vw,8px)",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{player.p}</span>
                      <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.9vw,9px)",fontWeight:600,color:diff>0?"#22c55e":diff<0?"#ef4444":"#475569"}}>
                        {diff > 0 ? `↑${diff}` : diff < 0 ? `↓${Math.abs(diff)}` : "—"}
                      </span>
                    </div>
                    <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.3vw,13px)",fontWeight:600,color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.2}}>{player.n}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.85vw,9px)",color:"var(--dg-text-dim)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{player.s}</div>
                  </div>
                );
              })}
            </div>

            <div style={{marginTop:"clamp(8px,1.2vw,14px)",paddingTop:"clamp(6px,1vw,10px)",borderTop:"1px solid var(--dg-card-border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,1.1vw,11px)",color:"var(--dg-text-muted)",fontWeight:500}}>draft-guide.com</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",color:"var(--dg-text-faint)"}}>· Build your own big board</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                <svg width="clamp(11px,1.5vw,14px)" height="clamp(11px,1.5vw,14px)" viewBox="0 0 24 24" fill="#475569"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,1.1vw,11px)",color:"#2dd4bf",fontWeight:500}}>@DraftGuide_</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{borderTop:"1px solid var(--dg-card-border)",padding:"12px 20px",display:"flex",gap:"10px",justifyContent:"center",background:"var(--dg-bg)",flexShrink:0}}>
          <button onClick={()=>setShowBuilderResults(false)} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>← Back to Builder</button>
          <button onClick={()=>{setBuilderMode(false);setShowBuilderResults(false);}} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Exit Builder</button>
        </div>
      </div>
    );
  }

  // Builder Mode
  if (builderMode) {
    return (
      <div className="page-content" style={{maxWidth:"960px",margin:"0 auto",padding:"16px 24px 40px"}}>
        {/* Builder Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px",flexWrap:"wrap",gap:"10px"}}>
          <div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Big Board Builder</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",marginTop:"2px"}}>Rank your top 100 prospects · {myBoard.length}/100 added</div>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            {myBoard.length > 0 && (
              <button onClick={()=>setShowBuilderResults(true)} style={{background:"#2dd4bf",border:"none",borderRadius:"8px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#0c1222",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>View Board →</button>
            )}
            <button onClick={()=>setBuilderMode(false)} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Exit</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",marginBottom:"16px",overflow:"hidden"}}>
          <div style={{width:`${(myBoard.length/100)*100}%`,height:"100%",background:"#2dd4bf",borderRadius:"2px",transition:"width 0.3s"}}/>
        </div>

        {/* Split layout */}
        <div className="draft-split" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0",border:"1px solid var(--dg-card-border)",borderRadius:"12px",overflow:"hidden",minHeight:"calc(100vh - 220px)"}}>
          {/* Left - My Board */}
          <div style={{borderRight:"1px solid var(--dg-card-border)",overflowY:"auto",maxHeight:"calc(100vh - 220px)"}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid var(--dg-card-border)",fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"var(--dg-text)",letterSpacing:"0.8px",textTransform:"uppercase",position:"sticky",top:0,background:"var(--dg-bg)",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>My Board ({myBoard.length})</span>
              {myBoard.length > 0 && <button onClick={()=>setMyBoard([])} style={{background:"none",border:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)",cursor:"pointer",letterSpacing:"0.5px",textTransform:"uppercase"}}>Clear All</button>}
            </div>
            {myBoard.length === 0 ? (
              <div style={{padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-faint)",lineHeight:1.6}}>Click "Add" on any player<br/>to start building your board</div>
              </div>
            ) : (
              myBoard.map((player, idx) => {
                const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                const diff = player.r - (idx + 1);
                return (
                  <div key={player.r} style={{
                    display:"flex",alignItems:"center",gap:"8px",
                    padding:"8px 12px",
                    background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    borderBottom:"1px solid var(--dg-divider)",
                  }}>
                    <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:"#2dd4bf",minWidth:"24px",textAlign:"right"}}>{idx+1}</span>
                    <span style={{background:pc.bg,color:pc.text,padding:"2px 5px",borderRadius:"3px",fontSize:"8px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{player.p}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:500,color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{player.n}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)"}}>{player.s}</div>
                    </div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:600,color:diff>0?"#22c55e":diff<0?"#ef4444":"#475569",minWidth:"28px",textAlign:"center"}}>
                      {diff > 0 ? `↑${diff}` : diff < 0 ? `↓${Math.abs(diff)}` : "—"}
                    </span>
                    <div style={{display:"flex",flexDirection:"column",gap:"1px"}}>
                      <button onClick={()=>moveUp(idx)} disabled={idx===0} style={{background:"none",border:"none",color:idx===0?"#1e293b":"#64748b",cursor:idx===0?"default":"pointer",fontSize:"10px",padding:"0",lineHeight:1}}>▲</button>
                      <button onClick={()=>moveDown(idx)} disabled={idx>=myBoard.length-1} style={{background:"none",border:"none",color:idx>=myBoard.length-1?"#1e293b":"#64748b",cursor:idx>=myBoard.length-1?"default":"pointer",fontSize:"10px",padding:"0",lineHeight:1}}>▼</button>
                    </div>
                    <button onClick={()=>removeFromBoard(idx)} style={{background:"none",border:"none",color:"var(--dg-text-faint)",cursor:"pointer",fontSize:"14px",padding:"0 2px",lineHeight:1}}>×</button>
                  </div>
                );
              })
            )}
          </div>

          {/* Right - Available Players */}
          <div style={{overflowY:"auto",maxHeight:"calc(100vh - 220px)"}}>
            <div style={{padding:"10px 14px",borderBottom:"1px solid var(--dg-card-border)",position:"sticky",top:0,background:"var(--dg-bg)",zIndex:10}}>
              <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"6px",flex:1,background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"5px 8px"}}>
                  <SearchIcon/>
                  <input value={builderSearch} onChange={e=>setBuilderSearch(e.target.value)} placeholder="Search..." style={{background:"transparent",border:"none",outline:"none",color:"var(--dg-text)",fontSize:"11px",fontFamily:"'JetBrains Mono',monospace",width:"100%"}}/>
                  {builderSearch && <button onClick={()=>setBuilderSearch("")} style={{background:"none",border:"none",color:"var(--dg-text-dim)",cursor:"pointer",fontSize:"12px",padding:"0"}}>×</button>}
                </div>
                <select value={builderPosFilter} onChange={e=>setBuilderPosFilter(e.target.value)} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"5px 8px",color:"var(--dg-text)",fontSize:"10px",fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",outline:"none"}}>
                  <option value="ALL" style={{background:"#1a2332"}}>ALL</option>
                  {[...OFF_POSITIONS,...DEF_POSITIONS].map(pos=>(<option key={pos} value={pos} style={{background:"#1a2332"}}>{pos}</option>))}
                </select>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"0.5px"}}>{builderAvailable.length} available · {100 - myBoard.length} spots remaining</div>
            </div>
            <div>
              {builderAvailable.slice(0, 100).map((player, i) => {
                const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                const canAdd = myBoard.length < 100;
                const profile = PROFILES[player.n];
                return (
                  <div key={player.r} style={{
                    display:"flex",alignItems:"center",gap:"8px",
                    padding:"8px 14px",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    borderBottom:"1px solid var(--dg-divider)",
                  }}>
                    <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:700,color:"#2dd4bf",minWidth:"28px",textAlign:"right"}}>#{player.r}</span>
                    <span style={{background:pc.bg,color:pc.text,padding:"2px 5px",borderRadius:"3px",fontSize:"8px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{player.p}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:500,color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{player.n}</div>
                      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)"}}>{player.s}</span>
                        {profile && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)"}}>{profile.height} · {profile.weight}</span>}
                      </div>
                    </div>
                    {canAdd && (
                      <button onClick={()=>addToBoard(player)} style={{background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.2)",borderRadius:"5px",padding:"4px 10px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap",flexShrink:0}}>Add</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Big Board view
  return (
    <div className="page-content" style={{maxWidth:"960px",margin:"0 auto",padding:"16px 24px 40px"}}>
      {/* Position filter */}
      <PositionFilter activePos={activePos} setActivePos={setActivePos}/>

      {/* Position Hero */}
      {isPositionView && posTopPlayer && (
        <div className="pos-hero" style={{
          background:"linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(27,42,74,0.4) 100%)",
          border:"1px solid rgba(45,212,191,0.12)",borderRadius:"12px",
          padding:"20px 24px",marginBottom:"16px",
          display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",
        }}>
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"4px"}}>
              #{activePos}1 · Overall #{posTopPlayer.r}
            </div>
            <div className="pos-hero-name" style={{fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px"}}>
              {posTopPlayer.n}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-muted)",marginTop:"2px"}}>
              {posTopPlayer.s}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="pos-hero-big" style={{fontFamily:"'Oswald',sans-serif",fontSize:"42px",fontWeight:700,color:"rgba(45,212,191,0.2)",lineHeight:1}}>
              {activePos}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",marginTop:"2px"}}>
              {filtered.length} prospects
            </div>
          </div>
        </div>
      )}

      {/* Search + Builder CTA + Compare */}
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px",flexWrap:"wrap"}}>
        <div className="search-bar" style={{
          display:"flex",alignItems:"center",gap:"8px",flex:"1",minWidth:"200px",
          background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",
          borderRadius:"8px",padding:"8px 14px",
        }}>
          <SearchIcon/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search player, school, or position..."
            style={{
              background:"transparent",border:"none",outline:"none",
              color:"var(--dg-text)",fontSize:"13px",fontFamily:"'JetBrains Mono',monospace",width:"100%",
            }}
          />
          {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"var(--dg-text-dim)",cursor:"pointer",fontSize:"16px",padding:"0 4px"}}>×</button>}
        </div>
        <button onClick={()=>setBuilderMode(true)} style={{
          background:"linear-gradient(135deg, rgba(45,212,191,0.12), rgba(45,212,191,0.06))",
          border:"1px solid rgba(45,212,191,0.25)",borderRadius:"8px",padding:"8px 16px",
          cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#2dd4bf",
          fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap",
          transition:"all 0.15s",
        }}>✎ Build Your Board</button>
        <button onClick={()=>{setCompareMode(!compareMode);if(compareMode)setCompareSelections([]);}} style={{
          background:compareMode?"rgba(245,158,11,0.12)":"rgba(255,255,255,0.04)",
          border:compareMode?"1px solid rgba(245,158,11,0.3)":"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"8px 16px",
          cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:compareMode?"#f59e0b":"#94a3b8",
          fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap",
          transition:"all 0.15s",
        }}>{compareMode ? "Cancel" : "⚖ Compare"}</button>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",whiteSpace:"nowrap"}}>
          {filtered.length} player{filtered.length!==1?"s":""}
        </div>
      </div>

      {/* Compare Selection Bar */}
      {compareMode && (
        <div style={{
          background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",
          borderRadius:"10px",padding:"12px 16px",marginBottom:"12px",
          display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap",
        }}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#f59e0b",fontWeight:600}}>
            Select 2-3 players to compare
          </div>
          <div style={{display:"flex",gap:"6px",flex:1,flexWrap:"wrap"}}>
            {compareSelections.map((p, i) => {
              const pc = POS_COLORS[p.p]||{bg:"#555",text:"#fff"};
              return (
                <div key={p.r} style={{display:"flex",alignItems:"center",gap:"5px",background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"4px 8px"}}>
                  <span style={{background:pc.bg,color:pc.text,padding:"1px 4px",borderRadius:"2px",fontSize:"8px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{p.p}</span>
                  <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text)"}}>{p.n}</span>
                  <button onClick={()=>setCompareSelections(prev=>prev.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--dg-text-dim)",cursor:"pointer",fontSize:"12px",padding:0}}>×</button>
                </div>
              );
            })}
          </div>
          {compareSelections.length >= 2 && openCompare && (
            <button onClick={()=>{openCompare(compareSelections);setCompareMode(false);setCompareSelections([]);}} style={{
              background:"#f59e0b",border:"none",borderRadius:"8px",padding:"8px 20px",cursor:"pointer",
              fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#0c1222",fontWeight:600,
              letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap",
            }}>Compare →</button>
          )}
        </div>
      )}

      {/* Table Header */}
      <div className="table-header" style={{
        display:"grid",gridTemplateColumns:"70px 52px 1fr 1fr",
        gap:"12px",padding:"8px 20px",
        borderBottom:"1px solid rgba(45,212,191,0.15)",
        fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",
        letterSpacing:"1px",textTransform:"uppercase",
      }}>
        <div>{isPositionView?"POS RNK":"RANK"}</div>
        <div>POS</div>
        <div>PLAYER</div>
        <div className="table-header-school" style={{textAlign:"right"}}>{isPositionView?"SCHOOL / OVR":"SCHOOL"}</div>
      </div>

      {/* Rows */}
      <div>
        {pageData.map((player,i)=>{
          const posRank = isPositionView ? filtered.indexOf(player)+1 : positionRanks[player.r];
          return <PlayerRow key={player.r} player={player} posRank={posRank} index={page*PER_PAGE+i} isPositionView={isPositionView}
            expanded={expandedPlayer===player.r}
            onToggle={(id)=>setExpandedPlayer(expandedPlayer===id?null:id)}
            navigateToTeam={navigateToTeam}
            compareMode={compareMode}
            compareSelected={compareSelections.some(c=>c.r===player.r)}
            onCompareToggle={(p)=>{
              setCompareSelections(prev => {
                if (prev.some(c=>c.r===p.r)) return prev.filter(c=>c.r!==p.r);
                if (prev.length >= 3) return prev;
                return [...prev, p];
              });
            }}
          />;
        })}
      </div>

      {/* Pagination */}
      {totalPages>1 && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginTop:"20px"}}>
          <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0} style={{
            background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",
            borderRadius:"6px",padding:"8px 16px",cursor:page===0?"default":"pointer",
            color:page===0?"#334155":"#f1f5f9",fontFamily:"'Oswald',sans-serif",fontSize:"13px",
            letterSpacing:"0.5px",opacity:page===0?0.4:1,transition:"all 0.15s",
          }}>← PREV</button>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-dim)",padding:"8px 16px"}}>
            {page*PER_PAGE+1}–{Math.min((page+1)*PER_PAGE,filtered.length)} of {filtered.length}
          </div>
          <button onClick={()=>setPage(Math.min(totalPages-1,page+1))} disabled={page>=totalPages-1} style={{
            background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",
            borderRadius:"6px",padding:"8px 16px",cursor:page>=totalPages-1?"default":"pointer",
            color:page>=totalPages-1?"#334155":"#f1f5f9",fontFamily:"'Oswald',sans-serif",fontSize:"13px",
            letterSpacing:"0.5px",opacity:page>=totalPages-1?0.4:1,transition:"all 0.15s",
          }}>NEXT →</button>
        </div>
      )}
    </div>
  );
}

/* ───── Mock Draft Page ───── */
const DRAFT_ORDER = [
  {pick:1,round:1,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:2,round:1,team:"New York Jets",abbr:"NYJ"},
  {pick:3,round:1,team:"Arizona Cardinals",abbr:"ARI"},
  {pick:4,round:1,team:"Tennessee Titans",abbr:"TEN"},
  {pick:5,round:1,team:"New York Giants",abbr:"NYG"},
  {pick:6,round:1,team:"Cleveland Browns",abbr:"CLE"},
  {pick:7,round:1,team:"Washington Commanders",abbr:"WAS"},
  {pick:8,round:1,team:"New Orleans Saints",abbr:"NO"},
  {pick:9,round:1,team:"Kansas City Chiefs",abbr:"KC"},
  {pick:10,round:1,team:"Cincinnati Bengals",abbr:"CIN"},
  {pick:11,round:1,team:"Miami Dolphins",abbr:"MIA"},
  {pick:12,round:1,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:13,round:1,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:14,round:1,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:15,round:1,team:"Tampa Bay Buccaneers",abbr:"TB"},
  {pick:16,round:1,team:"New York Jets",abbr:"NYJ"},
  {pick:17,round:1,team:"Detroit Lions",abbr:"DET"},
  {pick:18,round:1,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:19,round:1,team:"Carolina Panthers",abbr:"CAR"},
  {pick:20,round:1,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:21,round:1,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:22,round:1,team:"Los Angeles Chargers",abbr:"LAC"},
  {pick:23,round:1,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:24,round:1,team:"Cleveland Browns",abbr:"CLE"},
  {pick:25,round:1,team:"Chicago Bears",abbr:"CHI"},
  {pick:26,round:1,team:"Buffalo Bills",abbr:"BUF"},
  {pick:27,round:1,team:"San Francisco 49ers",abbr:"SF"},
  {pick:28,round:1,team:"Houston Texans",abbr:"HOU"},
  {pick:29,round:1,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:30,round:1,team:"Denver Broncos",abbr:"DEN"},
  {pick:31,round:1,team:"New England Patriots",abbr:"NE"},
  {pick:32,round:1,team:"Seattle Seahawks",abbr:"SEA"},
  {pick:33,round:2,team:"New York Jets",abbr:"NYJ"},
  {pick:34,round:2,team:"Arizona Cardinals",abbr:"ARI"},
  {pick:35,round:2,team:"Tennessee Titans",abbr:"TEN"},
  {pick:36,round:2,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:37,round:2,team:"New York Giants",abbr:"NYG"},
  {pick:38,round:2,team:"Houston Texans",abbr:"HOU"},
  {pick:39,round:2,team:"Cleveland Browns",abbr:"CLE"},
  {pick:40,round:2,team:"Kansas City Chiefs",abbr:"KC"},
  {pick:41,round:2,team:"Cincinnati Bengals",abbr:"CIN"},
  {pick:42,round:2,team:"New Orleans Saints",abbr:"NO"},
  {pick:43,round:2,team:"Miami Dolphins",abbr:"MIA"},
  {pick:44,round:2,team:"New York Jets",abbr:"NYJ"},
  {pick:45,round:2,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:46,round:2,team:"Tampa Bay Buccaneers",abbr:"TB"},
  {pick:47,round:2,team:"Indianapolis Colts",abbr:"IND"},
  {pick:48,round:2,team:"Atlanta Falcons",abbr:"ATL"},
  {pick:49,round:2,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:50,round:2,team:"Detroit Lions",abbr:"DET"},
  {pick:51,round:2,team:"Carolina Panthers",abbr:"CAR"},
  {pick:52,round:2,team:"Green Bay Packers",abbr:"GB"},
  {pick:53,round:2,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:54,round:2,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:55,round:2,team:"Los Angeles Chargers",abbr:"LAC"},
  {pick:56,round:2,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:57,round:2,team:"Chicago Bears",abbr:"CHI"},
  {pick:58,round:2,team:"San Francisco 49ers",abbr:"SF"},
  {pick:59,round:2,team:"Houston Texans",abbr:"HOU"},
  {pick:60,round:2,team:"Buffalo Bills",abbr:"BUF"},
  {pick:61,round:2,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:62,round:2,team:"Denver Broncos",abbr:"DEN"},
  {pick:63,round:2,team:"New England Patriots",abbr:"NE"},
  {pick:64,round:2,team:"Seattle Seahawks",abbr:"SEA"},
  {pick:65,round:3,team:"Arizona Cardinals",abbr:"ARI"},
  {pick:66,round:3,team:"Tennessee Titans",abbr:"TEN"},
  {pick:67,round:3,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:68,round:3,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:69,round:3,team:"Houston Texans",abbr:"HOU"},
  {pick:70,round:3,team:"Cleveland Browns",abbr:"CLE"},
  {pick:71,round:3,team:"Washington Commanders",abbr:"WAS"},
  {pick:72,round:3,team:"Cincinnati Bengals",abbr:"CIN"},
  {pick:73,round:3,team:"New Orleans Saints",abbr:"NO"},
  {pick:74,round:3,team:"Kansas City Chiefs",abbr:"KC"},
  {pick:75,round:3,team:"Miami Dolphins",abbr:"MIA"},
  {pick:76,round:3,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:77,round:3,team:"Tampa Bay Buccaneers",abbr:"TB"},
  {pick:78,round:3,team:"Indianapolis Colts",abbr:"IND"},
  {pick:79,round:3,team:"Atlanta Falcons",abbr:"ATL"},
  {pick:80,round:3,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:81,round:3,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:82,round:3,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:83,round:3,team:"Carolina Panthers",abbr:"CAR"},
  {pick:84,round:3,team:"Green Bay Packers",abbr:"GB"},
  {pick:85,round:3,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:86,round:3,team:"Los Angeles Chargers",abbr:"LAC"},
  {pick:87,round:3,team:"Miami Dolphins",abbr:"MIA"},
  {pick:88,round:3,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:89,round:3,team:"Chicago Bears",abbr:"CHI"},
  {pick:90,round:3,team:"Miami Dolphins",abbr:"MIA"},
  {pick:91,round:3,team:"Buffalo Bills",abbr:"BUF"},
  {pick:92,round:3,team:"San Francisco 49ers",abbr:"SF"},
  {pick:93,round:3,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:94,round:3,team:"Denver Broncos",abbr:"DEN"},
  {pick:95,round:3,team:"New England Patriots",abbr:"NE"},
  {pick:96,round:3,team:"Seattle Seahawks",abbr:"SEA"},
  {pick:97,round:3,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:98,round:3,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:99,round:3,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:100,round:3,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:101,round:4,team:"Tennessee Titans",abbr:"TEN"},
  {pick:102,round:4,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:103,round:4,team:"New York Jets",abbr:"NYJ"},
  {pick:104,round:4,team:"Arizona Cardinals",abbr:"ARI"},
  {pick:105,round:4,team:"New York Giants",abbr:"NYG"},
  {pick:106,round:4,team:"Houston Texans",abbr:"HOU"},
  {pick:107,round:4,team:"Cleveland Browns",abbr:"CLE"},
  {pick:108,round:4,team:"Denver Broncos",abbr:"DEN"},
  {pick:109,round:4,team:"Kansas City Chiefs",abbr:"KC"},
  {pick:110,round:4,team:"Cincinnati Bengals",abbr:"CIN"},
  {pick:111,round:4,team:"Miami Dolphins",abbr:"MIA"},
  {pick:112,round:4,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:113,round:4,team:"Indianapolis Colts",abbr:"IND"},
  {pick:114,round:4,team:"Atlanta Falcons",abbr:"ATL"},
  {pick:115,round:4,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:116,round:4,team:"Tampa Bay Buccaneers",abbr:"TB"},
  {pick:117,round:4,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:118,round:4,team:"Detroit Lions",abbr:"DET"},
  {pick:119,round:4,team:"Carolina Panthers",abbr:"CAR"},
  {pick:120,round:4,team:"Green Bay Packers",abbr:"GB"},
  {pick:121,round:4,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:122,round:4,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:123,round:4,team:"Los Angeles Chargers",abbr:"LAC"},
  {pick:124,round:4,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:125,round:4,team:"New England Patriots",abbr:"NE"},
  {pick:126,round:4,team:"Buffalo Bills",abbr:"BUF"},
  {pick:127,round:4,team:"San Francisco 49ers",abbr:"SF"},
  {pick:128,round:4,team:"Houston Texans",abbr:"HOU"},
  {pick:129,round:4,team:"Chicago Bears",abbr:"CHI"},
  {pick:130,round:4,team:"Denver Broncos",abbr:"DEN"},
  {pick:131,round:4,team:"New England Patriots",abbr:"NE"},
  {pick:132,round:4,team:"New Orleans Saints",abbr:"NO"},
  {pick:133,round:4,team:"San Francisco 49ers",abbr:"SF"},
  {pick:134,round:4,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:135,round:4,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:136,round:4,team:"New Orleans Saints",abbr:"NO"},
  {pick:137,round:4,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:138,round:4,team:"San Francisco 49ers",abbr:"SF"},
  {pick:139,round:5,team:"Cleveland Browns",abbr:"CLE"},
  {pick:140,round:5,team:"Tennessee Titans",abbr:"TEN"},
  {pick:141,round:5,team:"Arizona Cardinals",abbr:"ARI"},
  {pick:142,round:5,team:"Tennessee Titans",abbr:"TEN"},
  {pick:143,round:5,team:"New York Giants",abbr:"NYG"},
  {pick:144,round:5,team:"Cleveland Browns",abbr:"CLE"},
  {pick:145,round:5,team:"Washington Commanders",abbr:"WAS"},
  {pick:146,round:5,team:"Kansas City Chiefs",abbr:"KC"},
  {pick:147,round:5,team:"Cleveland Browns",abbr:"CLE"},
  {pick:148,round:5,team:"New Orleans Saints",abbr:"NO"},
  {pick:149,round:5,team:"Miami Dolphins",abbr:"MIA"},
  {pick:150,round:5,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:151,round:5,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:152,round:5,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:153,round:5,team:"Tampa Bay Buccaneers",abbr:"TB"},
  {pick:154,round:5,team:"Indianapolis Colts",abbr:"IND"},
  {pick:155,round:5,team:"Detroit Lions",abbr:"DET"},
  {pick:156,round:5,team:"Carolina Panthers",abbr:"CAR"},
  {pick:157,round:5,team:"Carolina Panthers",abbr:"CAR"},
  {pick:158,round:5,team:"Green Bay Packers",abbr:"GB"},
  {pick:159,round:5,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:160,round:5,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:161,round:5,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:162,round:5,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:163,round:5,team:"Chicago Bears",abbr:"CHI"},
  {pick:164,round:5,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:165,round:5,team:"Houston Texans",abbr:"HOU"},
  {pick:166,round:5,team:"Buffalo Bills",abbr:"BUF"},
  {pick:167,round:5,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:168,round:5,team:"Denver Broncos",abbr:"DEN"},
  {pick:169,round:5,team:"New England Patriots",abbr:"NE"},
  {pick:170,round:5,team:"New Orleans Saints",abbr:"NO"},
  {pick:171,round:5,team:"San Francisco 49ers",abbr:"SF"},
  {pick:172,round:5,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:173,round:5,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:174,round:5,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:175,round:5,team:"New York Jets",abbr:"NYJ"},
  {pick:176,round:5,team:"Kansas City Chiefs",abbr:"KC"},
  {pick:177,round:5,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:178,round:5,team:"New York Jets",abbr:"NYJ"},
  {pick:179,round:5,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:180,round:6,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:181,round:6,team:"Arizona Cardinals",abbr:"ARI"},
  {pick:182,round:6,team:"Tennessee Titans",abbr:"TEN"},
  {pick:183,round:6,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:184,round:6,team:"New York Giants",abbr:"NYG"},
  {pick:185,round:6,team:"Washington Commanders",abbr:"WAS"},
  {pick:186,round:6,team:"Detroit Lions",abbr:"DET"},
  {pick:187,round:6,team:"Cincinnati Bengals",abbr:"CIN"},
  {pick:188,round:6,team:"New Orleans Saints",abbr:"NO"},
  {pick:189,round:6,team:"New England Patriots",abbr:"NE"},
  {pick:190,round:6,team:"New York Giants",abbr:"NYG"},
  {pick:191,round:6,team:"New York Giants",abbr:"NYG"},
  {pick:192,round:6,team:"New York Jets",abbr:"NYJ"},
  {pick:193,round:6,team:"Tampa Bay Buccaneers",abbr:"TB"},
  {pick:194,round:6,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:195,round:6,team:"Atlanta Falcons",abbr:"ATL"},
  {pick:196,round:6,team:"Washington Commanders",abbr:"WAS"},
  {pick:197,round:6,team:"Cincinnati Bengals",abbr:"CIN"},
  {pick:198,round:6,team:"Carolina Panthers",abbr:"CAR"},
  {pick:199,round:6,team:"Green Bay Packers",abbr:"GB"},
  {pick:200,round:6,team:"New England Patriots",abbr:"NE"},
  {pick:201,round:6,team:"Philadelphia Eagles",abbr:"PHI"},
  {pick:202,round:6,team:"Los Angeles Chargers",abbr:"LAC"},
  {pick:203,round:6,team:"Detroit Lions",abbr:"DET"},
  {pick:204,round:6,team:"Cleveland Browns",abbr:"CLE"},
  {pick:205,round:6,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:206,round:6,team:"New York Jets",abbr:"NYJ"},
  {pick:207,round:6,team:"New England Patriots",abbr:"NE"},
  {pick:208,round:6,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:209,round:6,team:"New York Jets",abbr:"NYJ"},
  {pick:210,round:6,team:"New England Patriots",abbr:"NE"},
  {pick:211,round:6,team:"Seattle Seahawks",abbr:"SEA"},
  {pick:212,round:6,team:"Detroit Lions",abbr:"DET"},
  {pick:213,round:6,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:214,round:6,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:215,round:6,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:216,round:6,team:"Indianapolis Colts",abbr:"IND"},
  {pick:217,round:7,team:"Arizona Cardinals",abbr:"ARI"},
  {pick:218,round:7,team:"New York Jets",abbr:"NYJ"},
  {pick:219,round:7,team:"Las Vegas Raiders",abbr:"LV"},
  {pick:220,round:7,team:"Buffalo Bills",abbr:"BUF"},
  {pick:221,round:7,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:222,round:7,team:"Detroit Lions",abbr:"DET"},
  {pick:223,round:7,team:"Washington Commanders",abbr:"WAS"},
  {pick:224,round:7,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:225,round:7,team:"Dallas Cowboys",abbr:"DAL"},
  {pick:226,round:7,team:"Cincinnati Bengals",abbr:"CIN"},
  {pick:227,round:7,team:"Miami Dolphins",abbr:"MIA"},
  {pick:228,round:7,team:"Buffalo Bills",abbr:"BUF"},
  {pick:229,round:7,team:"Tampa Bay Buccaneers",abbr:"TB"},
  {pick:230,round:7,team:"Indianapolis Colts",abbr:"IND"},
  {pick:231,round:7,team:"Atlanta Falcons",abbr:"ATL"},
  {pick:232,round:7,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:233,round:7,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:234,round:7,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:235,round:7,team:"Carolina Panthers",abbr:"CAR"},
  {pick:236,round:7,team:"Green Bay Packers",abbr:"GB"},
  {pick:237,round:7,team:"Pittsburgh Steelers",abbr:"PIT"},
  {pick:238,round:7,team:"Tennessee Titans",abbr:"TEN"},
  {pick:239,round:7,team:"Chicago Bears",abbr:"CHI"},
  {pick:240,round:7,team:"Minnesota Vikings",abbr:"MIN"},
  {pick:241,round:7,team:"Chicago Bears",abbr:"CHI"},
  {pick:242,round:7,team:"New York Jets",abbr:"NYJ"},
  {pick:243,round:7,team:"Houston Texans",abbr:"HOU"},
  {pick:244,round:7,team:"Houston Texans",abbr:"HOU"},
  {pick:245,round:7,team:"Jacksonville Jaguars",abbr:"JAX"},
  {pick:246,round:7,team:"Denver Broncos",abbr:"DEN"},
  {pick:247,round:7,team:"New England Patriots",abbr:"NE"},
  {pick:248,round:7,team:"Cleveland Browns",abbr:"CLE"},
  {pick:249,round:7,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:250,round:7,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:251,round:7,team:"Denver Broncos",abbr:"DEN"},
  {pick:252,round:7,team:"Baltimore Ravens",abbr:"BAL"},
  {pick:253,round:7,team:"Indianapolis Colts",abbr:"IND"},
  {pick:254,round:7,team:"Green Bay Packers",abbr:"GB"},
  {pick:255,round:7,team:"Denver Broncos",abbr:"DEN"},
  {pick:256,round:7,team:"Los Angeles Rams",abbr:"LAR"},
  {pick:257,round:7,team:"Green Bay Packers",abbr:"GB"},
];

// Team roster/cap data lookup — add entries as teams are built out
const TEAM_DATA = {
  NE:  { cap: NE_CAP, depth: NE_DEPTH_CHART, roster: NE_ROSTER },
  BUF: { cap: BUF_CAP, depth: BUF_DEPTH_CHART, roster: null },
  NYJ: { cap: NYJ_CAP, depth: NYJ_DEPTH_CHART, roster: null },
  MIA: { cap: MIA_CAP, depth: MIA_DEPTH_CHART, roster: null },
  DEN: { cap: DEN_CAP, depth: DEN_DEPTH_CHART, roster: null },
  KC:  { cap: KC_CAP,  depth: KC_DEPTH_CHART,  roster: null },
  LV:  { cap: LV_CAP,  depth: LV_DEPTH_CHART,  roster: null },
  LAC: { cap: LAC_CAP, depth: LAC_DEPTH_CHART, roster: null },
  BAL: { cap: BAL_CAP, depth: BAL_DEPTH_CHART, roster: null },
  CIN: { cap: CIN_CAP, depth: CIN_DEPTH_CHART, roster: null },
  CLE: { cap: CLE_CAP, depth: CLE_DEPTH_CHART, roster: null },
  PIT: { cap: PIT_CAP, depth: PIT_DEPTH_CHART, roster: null },
  HOU: { cap: HOU_CAP, depth: HOU_DEPTH_CHART, roster: null },
  IND: { cap: IND_CAP, depth: IND_DEPTH_CHART, roster: null },
  JAX: { cap: JAX_CAP, depth: JAX_DEPTH_CHART, roster: null },
  TEN: { cap: TEN_CAP, depth: TEN_DEPTH_CHART, roster: null },
  DAL: { cap: DAL_CAP, depth: DAL_DEPTH_CHART, roster: null },
  NYG: { cap: NYG_CAP, depth: NYG_DEPTH_CHART, roster: null },
  PHI: { cap: PHI_CAP, depth: PHI_DEPTH_CHART, roster: null },
  WAS: { cap: WAS_CAP, depth: WAS_DEPTH_CHART, roster: null },
  ARI: { cap: ARI_CAP, depth: ARI_DEPTH_CHART, roster: null },
  LAR: { cap: LAR_CAP, depth: LAR_DEPTH_CHART, roster: null },
  SF:  { cap: SF_CAP,  depth: SF_DEPTH_CHART,  roster: null },
  SEA: { cap: SEA_CAP, depth: SEA_DEPTH_CHART, roster: null },
  CHI: { cap: CHI_CAP, depth: CHI_DEPTH_CHART, roster: null },
  DET: { cap: DET_CAP, depth: DET_DEPTH_CHART, roster: null },
  GB:  { cap: GB_CAP,  depth: GB_DEPTH_CHART,  roster: null },
  MIN: { cap: MIN_CAP, depth: MIN_DEPTH_CHART, roster: null },
  ATL: { cap: ATL_CAP, depth: ATL_DEPTH_CHART, roster: null },
  CAR: { cap: CAR_CAP, depth: CAR_DEPTH_CHART, roster: null },
  NO:  { cap: NO_CAP,  depth: NO_DEPTH_CHART,  roster: null },
  TB:  { cap: TB_CAP,  depth: TB_DEPTH_CHART,  roster: null },
};

const TEAM_COLORS = {
  LV:"#a5acaf",NYJ:"#125740",ARI:"#97233f",TEN:"#4b92db",NYG:"#1b478c",
  CLE:"#311d00",WAS:"#5a1414",NO:"#d3bc8d",KC:"#e31837",CIN:"#fb4f14",
  MIA:"#008e97",DAL:"#003594",ATL:"#a71930",BAL:"#241773",TB:"#d50a0a",
  IND:"#002c5f",DET:"#0076b6",MIN:"#4f2683",CAR:"#0085ca",GB:"#203731",
  PIT:"#ffb612",LAC:"#0080c6",PHI:"#004c54",JAX:"#006778",CHI:"#0b162a",
  BUF:"#00338d",SF:"#aa0000",HOU:"#03202f",LAR:"#003594",DEN:"#fb4f14",
  SEA:"#002244",NE:"#002244",
};

const TEAM_NEEDS = {
  ARI:["T","ED","LB","QB","G","RB"],ATL:["WR","TE","G","CB","DI"],BAL:["DI","ED","G","WR","DB"],
  BUF:["WR","ED","LB","S"],CAR:["T","LB","ED","DL","WR"],CHI:["DI","DB","G","T"],
  CIN:["ED","DB","G","DI"],CLE:["QB","WR","G","T"],DAL:["CB","ED","WR","RB"],
  DEN:["TE","LB","RB","G"],DET:["T","G","ED","DB"],GB:["DI","ED","G","CB"],
  HOU:["DI","T","RB","G"],IND:["ED","LB","S","QB"],JAX:["DI","DB","RB","G"],
  KC:["RB","TE","WR","G"],LV:["QB","ED","G","T"],
  LAC:["G","T","DI","WR"],LAR:["WR","DB","LB","T"],MIA:["CB","TE","QB","G"],
  MIN:["LB","WR","DI","G"],NE:["WR","ED","T","G"],NO:["WR","G","RB","ED"],
  NYG:["T","G","WR","LB"],NYJ:["QB","DI","WR","CB"],
  PHI:["TE","ED","CB","G"],PIT:["QB","T","DB","G"],
  SF:["WR","T","DI","ED"],SEA:["DB","G","RB","T"],
  TB:["LB","ED","CB","G"],TEN:["ED","WR","CB","G","RB"],
  WAS:["WR","DB","ED","G"],
};

// Reverse lookup: player position → teams that need it
const NEEDS_MAP = {"QB":"QB","RB":"RB","WR":"WR","TE":"TE","OT":"T","IOL":"G","DL":"DL","EDGE":"ED","LB":"LB","CB":"CB","S":"S"};
const POS_TO_TEAMS = {};
Object.entries(TEAM_NEEDS).forEach(([abbr, needs]) => {
  needs.forEach(need => {
    // Map need codes to player positions
    const posKeys = Object.entries(NEEDS_MAP).filter(([,v]) => v === need).map(([k]) => k);
    // Also handle direct matches
    if (!POS_TO_TEAMS[need]) POS_TO_TEAMS[need] = [];
    POS_TO_TEAMS[need].push(abbr);
    posKeys.forEach(pk => {
      if (!POS_TO_TEAMS[pk]) POS_TO_TEAMS[pk] = [];
      if (!POS_TO_TEAMS[pk].includes(abbr)) POS_TO_TEAMS[pk].push(abbr);
    });
  });
});
// Extra mappings for position names used in PLAYERS vs TEAM_NEEDS
["DI","DL"].forEach(k=>{if(POS_TO_TEAMS[k]){if(!POS_TO_TEAMS["DL"])POS_TO_TEAMS["DL"]=[];POS_TO_TEAMS[k].forEach(a=>{if(!POS_TO_TEAMS["DL"].includes(a))POS_TO_TEAMS["DL"].push(a);});}});
["ED","EDGE"].forEach(k=>{if(POS_TO_TEAMS[k]){if(!POS_TO_TEAMS["EDGE"])POS_TO_TEAMS["EDGE"]=[];POS_TO_TEAMS[k].forEach(a=>{if(!POS_TO_TEAMS["EDGE"].includes(a))POS_TO_TEAMS["EDGE"].push(a);});}});
["DB","CB","S"].forEach(k=>{if(POS_TO_TEAMS[k]){["CB","S"].forEach(pk=>{if(!POS_TO_TEAMS[pk])POS_TO_TEAMS[pk]=[];POS_TO_TEAMS[k].forEach(a=>{if(!POS_TO_TEAMS[pk].includes(a))POS_TO_TEAMS[pk].push(a);});});}});
["G","C","T"].forEach(k=>{if(POS_TO_TEAMS[k]){["IOL","OT"].forEach(pk=>{if(!POS_TO_TEAMS[pk])POS_TO_TEAMS[pk]=[];POS_TO_TEAMS[k].forEach(a=>{if(!POS_TO_TEAMS[pk].includes(a))POS_TO_TEAMS[pk].push(a);});});}});

const PICK_VALUES = {1:3000,2:2600,3:2200,4:1800,5:1700,6:1600,7:1500,8:1400,9:1350,10:1300,11:1250,12:1200,13:1150,14:1100,15:1050,16:1000,17:950,18:900,19:875,20:850,21:800,22:780,23:760,24:740,25:720,26:700,27:680,28:660,29:640,30:620,31:600,32:585,33:580,34:560,35:550,36:540,37:530,38:520,39:510,40:500,41:490,42:480,43:470,44:460,45:450,46:440,47:430,48:420,49:410,50:400,51:390,52:380,53:370,54:360,55:350,56:340,57:330,58:320,59:310,60:300,61:292,62:284,63:276,64:270,65:265,66:260,67:255,68:250,69:245,70:240,71:235,72:230,73:225,74:220,75:215,76:210,77:205,78:200,79:195,80:190,81:185,82:180,83:175,84:170,85:165,86:160,87:155,88:150,89:145,90:140,91:136,92:132,93:128,94:124,95:120,96:116,97:112,98:108,99:104,100:100,101:96,102:92,103:88,104:86,105:84,106:82,107:80,108:78,109:76,110:74,111:72,112:70,113:68,114:66,115:64,116:62,117:60,118:58,119:56,120:54,121:52,122:50,123:49,124:48,125:47,126:46,127:45,128:44,129:43,130:42,131:41,132:40,133:39.5,134:39,135:38.5,136:38,137:37.5,138:37,139:36.5,140:36,141:35.5,142:35,143:34.5,144:34,145:33.5,146:33,147:32.5,148:32,149:31.5,150:31,151:30.5,152:30,153:29.5,154:29,155:28.5,156:28,157:27.5,158:27,159:26.5,160:26,161:25.5,162:25,163:24.5,164:24,165:23.5,166:23,167:22.5,168:22,169:21.5,170:21,171:20.5,172:20,173:19.5,174:19,175:18.5,176:18,177:17.5,178:17,179:16.5,180:16,181:15.6,182:15.2,183:14.8,184:14.4,185:14,186:13.6,187:13.2,188:12.8,189:12.4,190:12,191:11.6,192:11.2,193:10.8,194:10.4,195:10,196:9.6,197:9.2,198:8.8,199:8.4,200:8,201:7.8,202:7.6,203:7.4,204:7.2,205:7,206:6.8,207:6.6,208:6.4,209:6.2,210:6,211:5.8,212:5.6,213:5.4,214:5.2,215:5,216:4.8,217:4.6,218:4.5,219:4.4,220:4.4,221:4.3,222:4.2,223:4.1,224:4,225:4,226:3.9,227:3.8,228:3.7,229:3.6,230:3.6,231:3.5,232:3.4,233:3.3,234:3.2,235:3.2,236:3.1,237:3,238:2.9,239:2.8,240:2.8,241:2.7,242:2.6,243:2.5,244:2.4,245:2.4,246:2.3,247:2.2,248:2.1,249:2,250:2,251:1.9,252:1.8,253:1.7,254:1.6,255:1.6,256:1.5,257:1.4};

/* ───── Team Page Data ───── */
const TEAM_INFO = {
  ARI:{name:"Arizona Cardinals",conf:"NFC",div:"NFC West"},ATL:{name:"Atlanta Falcons",conf:"NFC",div:"NFC South"},
  BAL:{name:"Baltimore Ravens",conf:"AFC",div:"AFC North"},BUF:{name:"Buffalo Bills",conf:"AFC",div:"AFC East"},
  CAR:{name:"Carolina Panthers",conf:"NFC",div:"NFC South"},CHI:{name:"Chicago Bears",conf:"NFC",div:"NFC North"},
  CIN:{name:"Cincinnati Bengals",conf:"AFC",div:"AFC North"},CLE:{name:"Cleveland Browns",conf:"AFC",div:"AFC North"},
  DAL:{name:"Dallas Cowboys",conf:"NFC",div:"NFC East"},DEN:{name:"Denver Broncos",conf:"AFC",div:"AFC West"},
  DET:{name:"Detroit Lions",conf:"NFC",div:"NFC North"},GB:{name:"Green Bay Packers",conf:"NFC",div:"NFC North"},
  HOU:{name:"Houston Texans",conf:"AFC",div:"AFC South"},IND:{name:"Indianapolis Colts",conf:"AFC",div:"AFC South"},
  JAX:{name:"Jacksonville Jaguars",conf:"AFC",div:"AFC South"},KC:{name:"Kansas City Chiefs",conf:"AFC",div:"AFC West"},
  LV:{name:"Las Vegas Raiders",conf:"AFC",div:"AFC West"},LAC:{name:"Los Angeles Chargers",conf:"AFC",div:"AFC West"},
  LAR:{name:"Los Angeles Rams",conf:"NFC",div:"NFC West"},MIA:{name:"Miami Dolphins",conf:"AFC",div:"AFC East"},
  MIN:{name:"Minnesota Vikings",conf:"NFC",div:"NFC North"},NE:{name:"New England Patriots",conf:"AFC",div:"AFC East"},
  NO:{name:"New Orleans Saints",conf:"NFC",div:"NFC South"},NYG:{name:"New York Giants",conf:"NFC",div:"NFC East"},
  NYJ:{name:"New York Jets",conf:"AFC",div:"AFC East"},PHI:{name:"Philadelphia Eagles",conf:"NFC",div:"NFC East"},
  PIT:{name:"Pittsburgh Steelers",conf:"AFC",div:"AFC North"},SF:{name:"San Francisco 49ers",conf:"NFC",div:"NFC West"},
  SEA:{name:"Seattle Seahawks",conf:"NFC",div:"NFC West"},TB:{name:"Tampa Bay Buccaneers",conf:"NFC",div:"NFC South"},
  TEN:{name:"Tennessee Titans",conf:"AFC",div:"AFC South"},WAS:{name:"Washington Commanders",conf:"NFC",div:"NFC East"},
};

function TeamPage({ abbr, setActivePage, navigateToTeam, onClose }) {
  const [teamTab, setTeamTab] = useState("overview");
  const team = TEAM_INFO[abbr];
  if (!team) return <div style={{padding:"60px",textAlign:"center",color:"var(--dg-text-dim)",fontFamily:"'JetBrains Mono',monospace"}}>Team not found</div>;

  const teamColor = TEAM_COLORS[abbr] || "#333";
  const needs = TEAM_NEEDS[abbr] || [];
  const teamDraftPicks = DRAFT_ORDER.filter(s => s.abbr === abbr);
  const totalValue = teamDraftPicks.reduce((sum, s) => sum + (PICK_VALUES[s.pick] || 0), 0);
  const needsMapping = {"QB":"QB","RB":"RB","WR":"WR","TE":"TE","T":"OT","G":"IOL","C":"IOL","OL":"IOL","DL":"DL","DI":"DL","ED":"EDGE","EDGE":"EDGE","LB":"LB","CB":"CB","S":"S","DB":"S"};
  const mappedNeeds = needs.map(n => needsMapping[n] || n);

  // Find prospect fits: players whose position matches a team need, within realistic range of their picks
  const firstPick = teamDraftPicks[0]?.pick || 999;
  const lastPick = teamDraftPicks[teamDraftPicks.length - 1]?.pick || 0;

  // For each need, find top available prospects in a window around the team's picks
  const prospectFits = [];
  const seen = new Set();
  teamDraftPicks.forEach(slot => {
    const pickVal = PICK_VALUES[slot.pick] || 0;
    // Find players ranked near this pick's value range
    const rangeStart = Math.max(1, slot.pick - 15);
    const rangeEnd = Math.min(PLAYERS.length, slot.pick + 20);
    PLAYERS.slice(rangeStart - 1, rangeEnd).forEach(p => {
      if (seen.has(p.r)) return;
      if (mappedNeeds.includes(p.p)) {
        seen.add(p.r);
        prospectFits.push({ player: p, targetPick: slot.pick, targetRound: slot.round });
      }
    });
  });

  // Sort by rank
  prospectFits.sort((a, b) => a.player.r - b.player.r);

  // Division rivals for context
  const divTeams = Object.entries(TEAM_INFO).filter(([a, t]) => t.div === team.div && a !== abbr).map(([a]) => a);

  return (
    <div className="page-content" style={{maxWidth:"960px",margin:"0 auto",padding:"24px 24px 60px"}}>
      {/* Back nav */}
      <button onClick={onClose ? onClose : ()=>setActivePage("HOME")} style={{
        background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",
        fontFamily:onClose ? "'Oswald',sans-serif" : "'JetBrains Mono',monospace",
        fontSize:onClose ? "16px" : "11px",
        fontWeight:onClose ? 700 : 400,
        color:onClose ? "#2dd4bf" : "var(--dg-text-dim)",
        marginBottom:"20px",padding:0,
        letterSpacing:onClose ? "0.5px" : "normal",
        textTransform:onClose ? "uppercase" : "none",
      }}>
        {onClose ? "← Back to Draft" : "← All Teams"}
      </button>

      {/* Team Header */}
      <div style={{
        background:`linear-gradient(135deg, ${teamColor}22 0%, rgba(27,42,74,0.5) 50%, ${teamColor}11 100%)`,
        border:`1px solid ${teamColor}44`,borderRadius:"16px",
        padding:"32px",marginBottom:"24px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:teamColor}}/>
        <div style={{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
          <div style={{width:"60px",height:"60px",borderRadius:"12px",background:teamColor,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:"#fff",letterSpacing:"1px"}}>{abbr}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"4px"}}>{team.div}</div>
            <h1 style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:700,color:"var(--dg-text)",margin:"0 0 4px",letterSpacing:"1px",textTransform:"uppercase"}}>{team.name}</h1>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-muted)"}}>2026 NFL Draft Profile</div>
          </div>
          <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>Picks</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"28px",fontWeight:700,color:"#2dd4bf"}}>{teamDraftPicks.length}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>Capital</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"28px",fontWeight:700,color:"var(--dg-text)"}}>{Math.round(totalValue)}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>1st Pick</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"28px",fontWeight:700,color:"#f59e0b"}}>#{firstPick}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      {(TEAM_DATA[abbr]) && (
        <div style={{display:"flex",gap:"2px",marginBottom:"20px",background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"4px",overflow:"hidden"}}>
          {[{k:"overview",label:"Draft Profile"},{k:"depth",label:"Depth Chart"},{k:"needs",label:"Team Needs"},{k:"cap",label:"Cap Overview"}].map(tab=>(
            <button key={tab.k} onClick={()=>setTeamTab(tab.k)} style={{
              flex:1,padding:"10px 16px",border:"none",borderRadius:"8px",cursor:"pointer",
              background:teamTab===tab.k?teamColor:"transparent",
              color:teamTab===tab.k?"#fff":"var(--dg-text-muted)",
              fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",
              transition:"all 0.2s",
            }}>{tab.label}</button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {(teamTab === "overview" || !TEAM_DATA[abbr]) ? (
      <>
      {/* Two column layout */}
      <div className="team-page-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>

        {/* Draft Capital */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"14px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid var(--dg-card-border)"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Draft Capital</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"2px"}}>{teamDraftPicks.length} picks · {Math.round(totalValue)} total value</div>
          </div>
          <div style={{padding:"16px 20px"}}>
            {[1,2,3,4,5,6,7].map(r => {
              const roundP = teamDraftPicks.filter(s => s.round === r);
              if (roundP.length === 0) return null;
              return (
                <div key={r} style={{marginBottom:"12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                    <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"var(--dg-text)"}}>Round {r}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>{roundP.length} pick{roundP.length>1?"s":""}</span>
                  </div>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                    {roundP.map(s => (
                      <div key={s.pick} style={{
                        display:"flex",alignItems:"center",gap:"6px",
                        background:"rgba(255,255,255,0.03)",border:"1px solid var(--dg-card-border)",
                        borderRadius:"8px",padding:"6px 10px",
                      }}>
                        <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:700,color:"#2dd4bf"}}>#{s.pick}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>{Math.round(PICK_VALUES[s.pick]||0)} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Value Comparison */}
            <div style={{marginTop:"16px",paddingTop:"14px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>Division Capital Comparison</div>
              {[abbr, ...divTeams].map(a => {
                const picks = DRAFT_ORDER.filter(s => s.abbr === a);
                const val = picks.reduce((sum, s) => sum + (PICK_VALUES[s.pick] || 0), 0);
                const maxVal = Math.max(...[abbr, ...divTeams].map(t => DRAFT_ORDER.filter(s=>s.abbr===t).reduce((sum,s)=>sum+(PICK_VALUES[s.pick]||0),0)));
                return (
                  <div key={a} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
                    <span style={{width:"32px",height:"18px",borderRadius:"3px",background:TEAM_COLORS[a]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fontWeight:700,color:"#fff",flexShrink:0}}>{a}</span>
                    <div style={{flex:1,height:"6px",background:"var(--dg-input)",borderRadius:"3px",overflow:"hidden"}}>
                      <div style={{width:`${(val/maxVal)*100}%`,height:"100%",background:a===abbr?"#2dd4bf":"rgba(255,255,255,0.15)",borderRadius:"3px",transition:"width 0.3s"}}/>
                    </div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:a===abbr?"#2dd4bf":"#64748b",fontWeight:a===abbr?600:400,minWidth:"40px",textAlign:"right"}}>{Math.round(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Needs + Prospect Fits */}
        <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>

          {/* Team Needs */}
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"14px",overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid var(--dg-card-border)"}}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Team Needs</div>
            </div>
            <div style={{padding:"16px 20px",display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {needs.map((need, i) => (
                <div key={need} style={{
                  display:"flex",alignItems:"center",gap:"6px",
                  background: i < 2 ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.03)",
                  border: i < 2 ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius:"8px",padding:"8px 14px",
                }}>
                  <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:i<2?"#f59e0b":"#94a3b8"}}>{need}</span>
                  {i < 2 && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#f59e0b",letterSpacing:"0.5px",textTransform:"uppercase"}}>Priority</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Best Prospect Fits */}
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"14px",overflow:"hidden",flex:1}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid var(--dg-card-border)"}}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Best Prospect Fits</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"2px"}}>Consensus prospects matching team needs near draft position</div>
            </div>
            <div>
              {prospectFits.slice(0, 15).map((fit, i) => {
                const { player, targetPick, targetRound } = fit;
                const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                const profile = PROFILES[player.n];
                const valueDiff = player.r - targetPick;
                return (
                  <div key={player.r} style={{
                    display:"flex",alignItems:"center",gap:"10px",
                    padding:"10px 20px",
                    background: i%2===0 ? "transparent" : "rgba(255,255,255,0.015)",
                    borderBottom:"1px solid var(--dg-divider)",
                  }}>
                    <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:700,color:"#2dd4bf",minWidth:"28px",textAlign:"right"}}>#{player.r}</span>
                    <span style={{background:pc.bg,color:pc.text,padding:"2px 6px",borderRadius:"3px",fontSize:"9px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{player.p}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:500,color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{player.n}</div>
                      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)"}}>{player.s}</span>
                        {profile && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>{profile.height} · {profile.weight} lbs</span>}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-muted)"}}>R{targetRound} · #{targetPick}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:valueDiff<-5?"#22c55e":valueDiff>5?"#ef4444":"#475569"}}>
                        {valueDiff < -5 ? `↑ Value` : valueDiff > 5 ? `↓ Reach` : "≈ Match"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA to Mock Draft */}
      </>
      ) : teamTab === "depth" && TEAM_DATA[abbr] ? (
      <div>
        {/* Coaching Staff */}
        <div style={{display:"flex",gap:"12px",marginBottom:"16px",flexWrap:"wrap"}}>
          {[{label:"HC",val:TEAM_DATA[abbr].depth.coaching.hc},{label:"OC",val:TEAM_DATA[abbr].depth.coaching.oc},{label:"DC",val:TEAM_DATA[abbr].depth.coaching.dc}].map(c=>(
            <div key={c.label} style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"8px",padding:"8px 14px",display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:teamColor,fontWeight:700,letterSpacing:"0.5px"}}>{c.label}</span>
              <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text)",fontWeight:500}}>{c.val}</span>
            </div>
          ))}
        </div>

        {/* Offense Depth Chart */}
        {[{title:"Offense",sub:TEAM_DATA[abbr].depth.scheme.offense,data:TEAM_DATA[abbr].depth.offense},{title:"Defense",sub:TEAM_DATA[abbr].depth.scheme.defense,data:TEAM_DATA[abbr].depth.defense},{title:"Special Teams",sub:"",data:TEAM_DATA[abbr].depth.specialTeams}].map(section=>(
          <div key={section.title} style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"14px",overflow:"hidden",marginBottom:"16px"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid var(--dg-card-border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"6px"}}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>{section.title}</div>
              {section.sub && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)"}}>{section.sub}</div>}
            </div>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr 1fr",gap:"4px",padding:"8px 20px 4px",borderBottom:`1px solid ${teamColor}22`}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>POS</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>Starter</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>2nd</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>3rd+</div>
            </div>
            {section.data.map((row,i)=>{
              return (
                <div key={row.pos} style={{
                  display:"grid",gridTemplateColumns:"60px 1fr 1fr 1fr",gap:"4px",padding:"8px 20px",alignItems:"center",
                  background:i%2===0?"transparent":"var(--dg-row-alt)",borderBottom:"1px solid var(--dg-divider)",
                }}>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:700,color:teamColor}}>{row.pos}</div>
                  {[0,1,2].map(slot=>{
                    const name = row.players[slot];
                    if(!name) return <div key={slot}/>;
                    const rp = TEAM_DATA[abbr].roster ? TEAM_DATA[abbr].roster.find(p=>p.n===name) : null;
                    return (
                      <div key={slot}>
                        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:slot===0?"13px":"12px",fontWeight:slot===0?600:400,color:slot===0?"var(--dg-text)":"var(--dg-text-muted)"}}>{name}</div>
                        {rp && rp.num ? <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>#{rp.num}</div> : null}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      ) : teamTab === "needs" && TEAM_GRADES[abbr] ? (
      (() => {
        const tg = TEAM_GRADES[abbr];
        const overallGrade = getGradeLetter(tg.overall);
        const overallColor = getGradeColor(overallGrade);
        const groups = Object.entries(tg.groups).filter(([k]) => k !== "ST");
        const strengths = groups.filter(([,d]) => d.score >= 80).sort((a,b) => b[1].score - a[1].score);
        const weaknesses = groups.filter(([,d]) => d.score < 64).sort((a,b) => a[1].score - b[1].score);
        return (
      <div>
        {/* Summary Row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginBottom:"20px"}} className="team-page-grid">
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Overall Roster</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"42px",fontWeight:700,color:overallColor,lineHeight:1}}>{overallGrade}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",marginTop:"4px"}}>{tg.overall}/100</div>
          </div>
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"12px",padding:"16px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>★ Strengths</div>
            {strengths.slice(0,3).map(([pos,d]) => (
              <div key={pos} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text)"}}>{pos}</span>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:700,color:getGradeColor(d.grade)}}>{d.grade}</span>
              </div>
            ))}
            {strengths.length===0 && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)"}}>No groups above B+</div>}
          </div>
          <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"12px",padding:"16px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#ef4444",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>⚠ Weaknesses</div>
            {weaknesses.slice(0,3).map(([pos,d]) => (
              <div key={pos} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text)"}}>{pos}</span>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:700,color:getGradeColor(d.grade)}}>{d.grade}</span>
              </div>
            ))}
            {weaknesses.length===0 && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)"}}>No major weaknesses</div>}
          </div>
        </div>

        {/* Draft Priority */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>Draft Priority Analysis</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text)",lineHeight:1.6}}>{tg.draftPriority}</div>
          <div style={{display:"flex",gap:"6px",marginTop:"12px",flexWrap:"wrap"}}>
            {tg.topNeeds.map((n,i) => (
              <span key={n} style={{
                fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:600,letterSpacing:"0.5px",
                padding:"4px 10px",borderRadius:"6px",
                background:i===0?"rgba(239,68,68,0.15)":i===1?"rgba(249,115,22,0.12)":"rgba(250,204,21,0.08)",
                color:i===0?"#ef4444":i===1?"#f97316":"#facc15",
                border:`1px solid ${i===0?"rgba(239,68,68,0.3)":i===1?"rgba(249,115,22,0.25)":"rgba(250,204,21,0.15)"}`,
              }}>#{i+1} {n}</span>
            ))}
          </div>
        </div>

        {/* Position Group Detail Cards */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"12px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid var(--dg-card-border)"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Position Group Grades</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"2px"}}>Composite: Starter Quality · Depth · Age · Cap · Contract · Trajectory</div>
          </div>
          {Object.entries(tg.groups).map(([pos, data], idx, arr) => {
            const isNeed = tg.topNeeds.includes(pos);
            const gradeColor = getGradeColor(data.grade);
            const barWidth = Math.max(data.score, 5);
            return (
              <div key={pos} style={{
                padding:"14px 20px",
                borderBottom:idx < arr.length - 1 ? "1px solid var(--dg-card-border)" : "none",
                background:isNeed ? "rgba(239,68,68,0.03)" : "transparent",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"6px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",minWidth:"70px"}}>
                    <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:"var(--dg-text)"}}>{pos}</span>
                    {isNeed && <span style={{fontSize:"7px",color:"#ef4444",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,background:"rgba(239,68,68,0.12)",padding:"2px 4px",borderRadius:"3px",letterSpacing:"0.5px"}}>NEED</span>}
                  </div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:gradeColor,minWidth:"36px",textAlign:"center"}}>{data.grade}</div>
                  <div style={{flex:1,height:"6px",background:"rgba(255,255,255,0.05)",borderRadius:"3px",overflow:"hidden"}}>
                    <div style={{width:`${barWidth}%`,height:"100%",background:gradeColor,borderRadius:"3px",transition:"width 0.3s"}} />
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",minWidth:"24px",textAlign:"right"}}>{data.score}</span>
                </div>
                <div style={{display:"flex",gap:"16px",paddingLeft:"0",flexWrap:"wrap"}}>
                  {data.starter && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)"}}>★ {data.starter}</span>}
                  {data.age && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:data.age >= 32 ? "#f97316" : data.age >= 29 ? "#facc15" : "var(--dg-text-faint)"}}>Age {data.age}{data.age >= 32 ? " ⚠" : ""}</span>}
                  {data.capHit && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)"}}>Cap: ${data.capHit}</span>}
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"4px",lineHeight:1.4}}>{data.note}</div>
              </div>
            );
          })}
        </div>

        {/* Methodology Footer */}
        <div style={{marginTop:"16px",padding:"12px 16px",background:"rgba(45,212,191,0.04)",border:"1px solid rgba(45,212,191,0.1)",borderRadius:"10px"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Methodology</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",lineHeight:1.5}}>
            Draft Guide Composite Score (0-100): Starter quality via contract value, draft capital &amp; accolades (30%) · Depth chart thickness (20%) · Age curve from positional peak (15%) · Cap efficiency vs league avg (15%) · Contract security &amp; FA risk (10%) · Trajectory &amp; scheme fit (10%).
          </div>
        </div>
      </div>
        );
      })()
      ) : teamTab === "cap" && TEAM_DATA[abbr] ? (
      <div>
        {/* Cap Summary Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"12px",marginBottom:"20px"}}>
          {[
            {label:"Cap Space",val:`${TEAM_DATA[abbr].cap.capSpace<0?"-":""}$${Math.abs(TEAM_DATA[abbr].cap.capSpace/1e6).toFixed(1)}M`,color:TEAM_DATA[abbr].cap.capSpace>=0?"#22c55e":"#ef4444"},
            {label:"Cap Ceiling",val:`$${(TEAM_DATA[abbr].cap.capCeiling/1e6).toFixed(0)}M`,color:"var(--dg-text)"},
            {label:"Offense",val:`$${(TEAM_DATA[abbr].cap.offenseSpend/1e6).toFixed(1)}M`,color:"#f59e0b"},
            {label:"Defense",val:`$${(TEAM_DATA[abbr].cap.defenseSpend/1e6).toFixed(1)}M`,color:"#3b82f6"},
            {label:"Contracts",val:TEAM_DATA[abbr].cap.activeContracts,color:"var(--dg-text)"},
          ].map(s=>(
            <div key={s.label} style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px",padding:"12px 16px",textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>{s.label}</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:s.color}}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Cap Allocation Bar */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"14px",overflow:"hidden",marginBottom:"20px"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid var(--dg-card-border)"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cap Allocation</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"2px"}}>Source: Over The Cap</div>
          </div>
          <div style={{padding:"20px"}}>
            <div style={{display:"flex",height:"32px",borderRadius:"6px",overflow:"hidden",marginBottom:"16px"}}>
              <div style={{width:`${(TEAM_DATA[abbr].cap.offenseSpend/TEAM_DATA[abbr].cap.capCeiling)*100}%`,background:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:700,color:"#000"}}>OFF</div>
              <div style={{width:`${(TEAM_DATA[abbr].cap.defenseSpend/TEAM_DATA[abbr].cap.capCeiling)*100}%`,background:"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:700,color:"#fff"}}>DEF</div>
              <div style={{width:`${(TEAM_DATA[abbr].cap.specialSpend/TEAM_DATA[abbr].cap.capCeiling)*100}%`,background:"#8b5cf6",display:"flex",alignItems:"center",justifyContent:"center"}}/>
              <div style={{flex:1,background:TEAM_DATA[abbr].cap.capSpace>=0?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:700,color:TEAM_DATA[abbr].cap.capSpace>=0?"#22c55e":"#ef4444"}}>{TEAM_DATA[abbr].cap.capSpace>=0?"CAP SPACE":"OVER CAP"}</div>
            </div>
            {/* Legend */}
            <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
              {[
                {label:"Offense",val:`$${(TEAM_DATA[abbr].cap.offenseSpend/1e6).toFixed(1)}M`,color:"#f59e0b"},
                {label:"Defense",val:`$${(TEAM_DATA[abbr].cap.defenseSpend/1e6).toFixed(1)}M`,color:"#3b82f6"},
                {label:"Special Teams",val:`$${(TEAM_DATA[abbr].cap.specialSpend/1e6).toFixed(1)}M`,color:"#8b5cf6"},
                {label:"Cap Space",val:`${TEAM_DATA[abbr].cap.capSpace<0?"-":""}$${Math.abs(TEAM_DATA[abbr].cap.capSpace/1e6).toFixed(1)}M`,color:TEAM_DATA[abbr].cap.capSpace>=0?"#22c55e":"#ef4444"},
              ].map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <div style={{width:"8px",height:"8px",borderRadius:"2px",background:l.color}}/>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-muted)"}}>{l.label}: {l.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Offseason Questions */}
        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"14px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid var(--dg-card-border)"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Key Offseason Questions</div>
          </div>
          <div style={{padding:"16px 20px"}}>
            {TEAM_DATA[abbr].cap.keyQuestions.map((q,i)=>(
              <div key={i} style={{display:"flex",gap:"10px",padding:"8px 0",borderBottom:i<TEAM_DATA[abbr].cap.keyQuestions.length-1?"1px solid var(--dg-divider)":"none"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:teamColor,flexShrink:0}}>?</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)",lineHeight:1.6}}>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      ) : null}

      {/* CTA to Mock Draft */}
      <div style={{
        background:"linear-gradient(135deg, rgba(45,212,191,0.06) 0%, rgba(27,42,74,0.3) 100%)",
        border:"1px solid rgba(45,212,191,0.12)",borderRadius:"14px",
        padding:"24px 32px",marginTop:"24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",
      }}>
        <div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Draft for {team.name.split(" ").pop()}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",marginTop:"2px"}}>Run a mock draft as the {abbr} GM</div>
        </div>
        <button onClick={()=>setActivePage("MOCK DRAFT")} style={{
          background:"#2dd4bf",color:"#0c1222",border:"none",borderRadius:"8px",
          padding:"12px 28px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",
          fontSize:"14px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",
        }}>Start Mock Draft →</button>
      </div>

      {/* Division Rivals */}
      {navigateToTeam && divTeams.length > 0 && (
        <div style={{marginTop:"20px",display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>{team.div}</span>
          {divTeams.map(a => (
            <div key={a} onClick={()=>navigateToTeam(a)} style={{
              display:"flex",alignItems:"center",gap:"6px",padding:"6px 12px",
              background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",
              borderRadius:"8px",cursor:"pointer",transition:"all 0.15s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(45,212,191,0.2)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}
            >
              <span style={{width:"24px",height:"15px",borderRadius:"2px",background:TEAM_COLORS[a]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",fontWeight:700,color:"#fff"}}>{a}</span>
              <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text-muted)"}}>{TEAM_INFO[a]?.name.split(" ").pop()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MockDraftPage() {
  const TOTAL_PICKS = DRAFT_ORDER.length; // 257
  const ROUNDS = [1,2,3,4,5,6,7];
  const roundPicks = (r) => DRAFT_ORDER.filter(s=>s.round===r);
  const teamPicksOwned = (abbr) => DRAFT_ORDER.filter(s=> getPickOwner(s.pick) === abbr);

  const [draftMode, setDraftMode] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [drafting, setDrafting] = useState(false);
  const [picks, setPicks] = useState({});
  const [currentPick, setCurrentPick] = useState(1);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("ALL");
  const [confirmPlayer, setConfirmPlayer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [fullDraftToggle, setFullDraftToggle] = useState(false);
  const [autoPickAnimating, setAutoPickAnimating] = useState(false);
  const [activeRound, setActiveRound] = useState(1);
  const [resultRound, setResultRound] = useState(1);
  // Trade system state
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradePartner, setTradePartner] = useState(null);
  const [userTradeOffers, setUserTradeOffers] = useState(new Set());
  const [partnerTradeOffers, setPartnerTradeOffers] = useState(new Set());
  const [tradeHistory, setTradeHistory] = useState([]);
  const [pickOwnership, setPickOwnership] = useState({}); // {pickNum: abbr} overrides
  const [tradeBanner, setTradeBanner] = useState(null);
  // Draft length
  const [draftRounds, setDraftRounds] = useState(1);
  const [roundCompletePrompt, setRoundCompletePrompt] = useState(null);
  // Mock draft UI
  const [expandedMockPlayer, setExpandedMockPlayer] = useState(null);
  const [resultsView, setResultsView] = useState("my"); // "my" = my picks, "full" = full draft round-by-round
  const [teamProfileOverlay, setTeamProfileOverlay] = useState(null); // team abbr to show as overlay

  const pickedPlayerIds = useMemo(()=> new Set(Object.values(picks).map(p=>p.r)), [picks]);

  const available = useMemo(()=>{
    let list = PLAYERS.filter(p => !pickedPlayerIds.has(p.r));
    if (posFilter !== "ALL") list = list.filter(p => p.p === posFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.n.toLowerCase().includes(q) || p.s.toLowerCase().includes(q));
    }
    return list;
  }, [pickedPlayerIds, posFilter, search]);

  const picksCount = Object.keys(picks).length;
  const lastPickInScope = DRAFT_ORDER.filter(s => s.round <= draftRounds).length;
  const draftComplete = picksCount >= lastPickInScope;
  const currentRound = DRAFT_ORDER.find(s=>s.pick===currentPick)?.round || 1;

  // Resolve who owns a pick (accounting for trades)
  const getPickOwner = (pickNum) => pickOwnership[pickNum] || DRAFT_ORDER.find(s=>s.pick===pickNum)?.abbr;
  const getPickTeamName = (abbr) => DRAFT_ORDER.find(s=>s.abbr===abbr)?.team || abbr;

  // Get all picks owned by a team (accounting for trades), that haven't been used yet
  const getTeamAvailablePicks = (abbr) => {
    return DRAFT_ORDER.filter(s => {
      const owner = getPickOwner(s.pick);
      return owner === abbr && !picks[s.pick];
    }).map(s => s.pick);
  };

  // Calculate total trade value for a set of picks
  const getTradeValue = (pickSet) => {
    let total = 0;
    for (const p of pickSet) total += (PICK_VALUES[p] || 0);
    return total;
  };

  // Evaluate whether AI would accept a trade (flexible: 80-120% range)
  const evaluateTrade = (userPicksOffered, partnerPicksOffered) => {
    const userValue = getTradeValue(userPicksOffered);
    const partnerValue = getTradeValue(partnerPicksOffered);
    if (partnerValue === 0) return { acceptable: false, ratio: 0 };
    const ratio = userValue / partnerValue;
    return { acceptable: ratio >= 0.80 && ratio <= 1.25, ratio, userValue, partnerValue };
  };

  // Execute a trade
  const needsMapping = {"QB":"QB","RB":"RB","WR":"WR","TE":"TE","T":"OT","G":"IOL","C":"IOL","OL":"IOL","DL":"DL","DI":"DL","ED":"EDGE","EDGE":"EDGE","LB":"LB","CB":"CB","S":"S","DB":"S"};

  // Positional value multiplier (premium positions get drafted higher)
  const POS_VALUE = {QB:1.35,EDGE:1.2,OT:1.15,CB:1.12,WR:1.1,DL:1.05,S:1.0,LB:0.95,IOL:0.93,TE:0.9,RB:0.85};

  const getAutoPick = (slotAbbr, currentPicks, pickNum) => {
    const picked = new Set(Object.values(currentPicks).map(p=>p.r));
    const avail = PLAYERS.filter(p => !picked.has(p.r));
    if (avail.length === 0) return null;

    const needs = TEAM_NEEDS[slotAbbr] || [];
    const mappedNeeds = needs.map(n => needsMapping[n] || n);
    const round = DRAFT_ORDER.find(s=>s.pick===pickNum)?.round || 1;

    // Already-filled needs: if team already picked a position earlier, reduce that need
    const alreadyDrafted = new Set();
    Object.entries(currentPicks).forEach(([pn, player]) => {
      const slot = DRAFT_ORDER.find(s=>s.pick===Number(pn));
      const owner = pickOwnership[Number(pn)] || slot?.abbr;
      if (owner === slotAbbr) alreadyDrafted.add(player.p);
    });

    // Score each available player
    const scored = avail.slice(0, 80).map((player, idx) => {
      // BPA score: higher rank = higher score (inverse of rank position in available list)
      const bpaScore = 100 - (idx * (100 / Math.min(avail.length, 80)));

      // Need score: how well does this position match team needs?
      let needScore = 0;
      const needIdx = mappedNeeds.indexOf(player.p);
      if (needIdx !== -1) {
        // Priority bonus: 1st need = 40pts, 2nd = 30pts, 3rd = 22pts, 4th+ = 15pts
        needScore = needIdx === 0 ? 40 : needIdx === 1 ? 30 : needIdx === 2 ? 22 : 15;
        // Reduce if already drafted this position
        if (alreadyDrafted.has(player.p)) needScore *= 0.3;
      }

      // Positional value
      const posVal = (POS_VALUE[player.p] || 0.9) * 10;

      // Slight randomness: ±8 points (makes each mock unique)
      const jitter = (Math.random() - 0.5) * 16;

      // Weighting shifts by round: early rounds favor BPA more, late rounds favor need
      const bpaWeight = round <= 2 ? 0.55 : round <= 4 ? 0.45 : 0.35;
      const needWeight = round <= 2 ? 0.30 : round <= 4 ? 0.40 : 0.50;
      const posWeight = 0.10;
      const jitterWeight = 0.05;

      const total = (bpaScore * bpaWeight) + (needScore * needWeight) + (posVal * posWeight) + (jitter * jitterWeight);

      return { player, total };
    });

    scored.sort((a, b) => b.total - a.total);
    return scored[0]?.player || avail[0];
  };

  const executeTrade = () => {
    const userPicksArr = [...userTradeOffers];
    const partnerPicksArr = [...partnerTradeOffers];
    const eval_ = evaluateTrade(userPicksArr, partnerPicksArr);
    if (!eval_.acceptable || !tradePartner) return;

    const myTeam = draftMode === "team" ? userTeam : (DRAFT_ORDER.find(s=>s.pick===currentPick)?.abbr);
    const newOwnership = {...pickOwnership};
    userPicksArr.forEach(p => { newOwnership[p] = tradePartner; });
    partnerPicksArr.forEach(p => { newOwnership[p] = myTeam; });
    setPickOwnership(newOwnership);

    const trade = {
      team1: myTeam, team2: tradePartner,
      team1Gives: userPicksArr.sort((a,b)=>a-b),
      team2Gives: partnerPicksArr.sort((a,b)=>a-b),
      team1Value: eval_.userValue, team2Value: eval_.partnerValue,
    };
    setTradeHistory(prev => [...prev, trade]);

    // Show trade banner
    const t1Name = getPickTeamName(myTeam);
    const t2Name = getPickTeamName(tradePartner);
    const t1Picks = trade.team2Gives.map(p=>`#${p}`).join(", ");
    const t2Picks = trade.team1Gives.map(p=>`#${p}`).join(", ");
    setTradeBanner(`${t1Name} acquires ${t1Picks} from ${t2Name} for ${t2Picks}`);
    setTimeout(() => setTradeBanner(null), 5000);

    // Close modal and reset
    setTradeModalOpen(false);
    setTradePartner(null);
    setUserTradeOffers(new Set());
    setPartnerTradeOffers(new Set());

    // After trade: resolve who owns the current pick and continue the draft
    // Use newOwnership directly since React state hasn't flushed yet
    const resolveOwner = (pn) => newOwnership[pn] || DRAFT_ORDER.find(s=>s.pick===pn)?.abbr;

    if (draftMode === "team") {
      const currentOwner = resolveOwner(currentPick);
      if (currentOwner === myTeam) {
        // We still own the current pick (traded away future picks only). Stay here.
        return;
      }
      // We traded away our current pick. Auto-pick from currentPick forward until our next pick.
      let p = currentPick;
      let tmpPicks = {...picks};
      const autopickQueue = [];
      while (p <= TOTAL_PICKS) {
        if (tmpPicks[p]) { p++; continue; }
        const own = resolveOwner(p);
        if (own === myTeam) break;
        const ap = getAutoPick(own, tmpPicks, p);
        if (ap) { autopickQueue.push({pick:p, player:ap}); tmpPicks[p] = ap; }
        p++;
      }
      const nextUserPick = (p <= TOTAL_PICKS) ? p : null;

      if (autopickQueue.length > 0) {
        // Small delay before starting animation so trade banner renders first
        setTimeout(() => {
          setAutoPickAnimating(true);
          const delay = autopickQueue.length > 20 ? 80 : autopickQueue.length > 10 ? 150 : 350;
          autopickQueue.forEach((ap, idx) => {
            setTimeout(() => {
              setPicks(prev => ({...prev, [ap.pick]: ap.player}));
              setCurrentPick(ap.pick);
              const apRound = DRAFT_ORDER.find(s=>s.pick===ap.pick)?.round || 1;
              setActiveRound(apRound);
              if (idx === autopickQueue.length - 1) {
                setTimeout(() => {
                  setAutoPickAnimating(false);
                  if (nextUserPick) {
                    setCurrentPick(nextUserPick);
                    const nr = DRAFT_ORDER.find(s=>s.pick===nextUserPick)?.round || 1;
                    setActiveRound(nr);
                  }
                }, 200);
              }
            }, delay * (idx + 1));
          });
        }, 300);
      } else if (nextUserPick) {
        setCurrentPick(nextUserPick);
        const nr = DRAFT_ORDER.find(s=>s.pick===nextUserPick)?.round || 1;
        setActiveRound(nr);
      }
    }
    // In full draft mode, stay on current pick — user picks for whoever now owns it
  };

  // Shared auto-pick runner (can use a custom ownership map for post-trade scenarios)
  const runAutoPicks = (startPick, existingPicks, ownershipOverride) => {
    const resolveOwner = (pn) => (ownershipOverride || pickOwnership)[pn] || DRAFT_ORDER.find(s=>s.pick===pn)?.abbr;
    let p = startPick;
    let tmpPicks = {...existingPicks};
    const autopickQueue = [];
    while (p <= TOTAL_PICKS) {
      const slot = DRAFT_ORDER.find(s=>s.pick===p);
      if (!slot) { p++; continue; }
      if (slot.round > draftRounds) break; // past selected round scope
      if (tmpPicks[p]) { p++; continue; }
      const owner = resolveOwner(p);
      if (owner === userTeam) break;
      const autoPick = getAutoPick(owner, tmpPicks, p);
      if (autoPick) {
        autopickQueue.push({pick: p, player: autoPick});
        tmpPicks[p] = autoPick;
      }
      p++;
    }
    return { autopickQueue, nextUserPick: p <= TOTAL_PICKS && (DRAFT_ORDER.find(s=>s.pick===p)?.round || 99) <= draftRounds ? p : null, finalPicks: tmpPicks };
  };

  // Animate and apply an auto-pick queue, then land on nextUserPick
  const animateAutoPicks = (autopickQueue, nextUserPick, fromRound) => {
    // Only pause at round boundaries if the completing round equals the user's selected scope
    const shouldPauseAtRound = fromRound && fromRound === draftRounds;

    if (autopickQueue.length === 0) {
      if (nextUserPick) {
        const nr = DRAFT_ORDER.find(s=>s.pick===nextUserPick)?.round || 1;
        if (shouldPauseAtRound && nr > fromRound) {
          setRoundCompletePrompt(fromRound);
        }
        setCurrentPick(nextUserPick);
        setActiveRound(nr);
      }
      return;
    }

    // Check if the auto-pick queue crosses a round boundary we should pause at
    let truncatedQueue = autopickQueue;
    let truncatedNext = nextUserPick;
    if (shouldPauseAtRound) {
      const crossIdx = autopickQueue.findIndex(ap => {
        const r = DRAFT_ORDER.find(s=>s.pick===ap.pick)?.round || 1;
        return r > fromRound;
      });
      if (crossIdx >= 0) {
        truncatedQueue = autopickQueue.slice(0, crossIdx);
        truncatedNext = autopickQueue[crossIdx].pick;
      }
    }

    if (truncatedQueue.length === 0) {
      if (shouldPauseAtRound) setRoundCompletePrompt(fromRound);
      if (truncatedNext) {
        setCurrentPick(truncatedNext);
        const nr = DRAFT_ORDER.find(s=>s.pick===truncatedNext)?.round || 1;
        setActiveRound(nr);
      }
      return;
    }

    setAutoPickAnimating(true);
    const delay = truncatedQueue.length > 20 ? 80 : truncatedQueue.length > 10 ? 150 : 350;
    truncatedQueue.forEach((ap, idx) => {
      setTimeout(() => {
        setPicks(prev => ({...prev, [ap.pick]: ap.player}));
        setCurrentPick(ap.pick);
        const apRound = DRAFT_ORDER.find(s=>s.pick===ap.pick)?.round || 1;
        setActiveRound(apRound);
        if (idx === truncatedQueue.length - 1) {
          setTimeout(() => {
            setAutoPickAnimating(false);
            if (truncatedQueue.length < autopickQueue.length && shouldPauseAtRound) {
              setRoundCompletePrompt(fromRound);
              if (truncatedNext) {
                setCurrentPick(truncatedNext);
                const nr = DRAFT_ORDER.find(s=>s.pick===truncatedNext)?.round || 1;
                setActiveRound(nr);
              }
            } else if (truncatedNext) {
              const nr = DRAFT_ORDER.find(s=>s.pick===truncatedNext)?.round || 1;
              if (shouldPauseAtRound && nr > fromRound) {
                setRoundCompletePrompt(fromRound);
              }
              setCurrentPick(truncatedNext);
              setActiveRound(nr);
            }
          }, 200);
        }
      }, delay * (idx + 1));
    });
  };

  const handlePick = (player) => { setConfirmPlayer(player); };

  const confirmPick = () => {
    if (!confirmPlayer) return;
    const newPicks = {...picks, [currentPick]: confirmPlayer};
    setPicks(newPicks);
    setConfirmPlayer(null);
    setSearch("");
    setPosFilter("ALL");

    const newCount = Object.keys(newPicks).length;
    if (newCount >= lastPickInScope) return; // draft complete per selected rounds

    if (draftMode === "team") {
      const { autopickQueue, nextUserPick } = runAutoPicks(currentPick + 1, newPicks);
      // Check if auto-picks would cross a round boundary where we should pause
      const currentPickRound = DRAFT_ORDER.find(s=>s.pick===currentPick)?.round || 1;
      animateAutoPicks(autopickQueue, nextUserPick, currentPickRound);
    } else {
      // Full draft mode — advance to next unpicked slot within scope
      for (let i = currentPick + 1; i <= TOTAL_PICKS; i++) {
        const slot = DRAFT_ORDER.find(s=>s.pick===i);
        if (slot && !newPicks[i]) {
          const prevRound = DRAFT_ORDER.find(s=>s.pick===currentPick)?.round || 1;
          if (slot.round > prevRound && slot.round > draftRounds) return; // past scope
          // Only show round prompt if this round equals the selected draftRounds
          if (slot.round > prevRound && prevRound === draftRounds) {
            setRoundCompletePrompt(prevRound);
            setCurrentPick(i);
            setActiveRound(slot.round);
            return;
          }
          setCurrentPick(i);
          setActiveRound(slot.round);
          return;
        }
      }
    }
  };

  const undoPick = (pickNum) => {
    if (draftMode === "team") {
      const newPicks = {};
      for (let i = 1; i < pickNum; i++) { if (picks[i]) newPicks[i] = picks[i]; }
      setPicks(newPicks);
      setCurrentPick(pickNum);
      const r = DRAFT_ORDER.find(s=>s.pick===pickNum)?.round || 1;
      setActiveRound(r);
    } else {
      const newPicks = {...picks};
      delete newPicks[pickNum];
      setPicks(newPicks);
      setCurrentPick(pickNum);
    }
  };

  const resetDraft = () => {
    setPicks({});
    setCurrentPick(1);
    setSearch("");
    setPosFilter("ALL");
    setConfirmPlayer(null);
    setShowResults(false);
    setAutoPickAnimating(false);
    setActiveRound(1);
    setResultRound(1);
    setTradeModalOpen(false);
    setTradePartner(null);
    setUserTradeOffers(new Set());
    setPartnerTradeOffers(new Set());
    setTradeHistory([]);
    setPickOwnership({});
    setTradeBanner(null);
    setRoundCompletePrompt(null);
    setExpandedMockPlayer(null);
    setResultsView("my");
    // Re-trigger auto-picks after state clears
    setTimeout(() => {
      if (draftMode === "team" && userTeam) {
        const slot1 = DRAFT_ORDER[0];
        if (slot1.abbr === userTeam) { setCurrentPick(1); return; }
        let tmpPicks = {};
        const autopickQueue = [];
        for (let i = 0; i < DRAFT_ORDER.length; i++) {
          const slot = DRAFT_ORDER[i];
          if (slot.abbr === userTeam) break;
          const autoPick = getAutoPick(slot.abbr, tmpPicks, slot.pick);
          if (autoPick) {
            autopickQueue.push({pick: slot.pick, player: autoPick});
            tmpPicks[slot.pick] = autoPick;
          }
        }
        if (autopickQueue.length > 0) {
          setAutoPickAnimating(true);
          const delay = autopickQueue.length > 10 ? 150 : 350;
          autopickQueue.forEach((ap, idx) => {
            setTimeout(() => {
              setPicks(prev => ({...prev, [ap.pick]: ap.player}));
              setCurrentPick(ap.pick);
              const apRound = DRAFT_ORDER.find(s=>s.pick===ap.pick)?.round || 1;
              setActiveRound(apRound);
              if (idx === autopickQueue.length - 1) {
                setTimeout(() => {
                  setAutoPickAnimating(false);
                  const userSlot = DRAFT_ORDER.find(s => s.abbr === userTeam);
                  if (userSlot) {
                    setCurrentPick(userSlot.pick);
                    setActiveRound(userSlot.round);
                  }
                }, 200);
              }
            }, delay * (idx + 1));
          });
        }
      } else if (draftMode === "full") {
        setCurrentPick(1);
      }
    }, 50);
  };

  const exitToModal = () => {
    resetDraft();
    setDrafting(false);
    setDraftMode(null);
    setUserTeam(null);
    setFullDraftToggle(false);
  };

  const startDraft = (mode, team) => {
    setDraftMode(mode);
    setUserTeam(team);
    setDrafting(true);
    setActiveRound(1);

    if (mode === "team") {
      const slot1 = DRAFT_ORDER[0];
      if (slot1.abbr === team) { setCurrentPick(1); return; }
      let tmpPicks = {};
      const autopickQueue = [];
      for (let i = 0; i < DRAFT_ORDER.length; i++) {
        const slot = DRAFT_ORDER[i];
        if (slot.abbr === team) break;
        const autoPick = getAutoPick(slot.abbr, tmpPicks, slot.pick);
        if (autoPick) {
          autopickQueue.push({pick: slot.pick, player: autoPick});
          tmpPicks[slot.pick] = autoPick;
        }
      }
      if (autopickQueue.length > 0) {
        setAutoPickAnimating(true);
        const delay = autopickQueue.length > 10 ? 150 : 350;
        autopickQueue.forEach((ap, idx) => {
          setTimeout(() => {
            setPicks(prev => ({...prev, [ap.pick]: ap.player}));
            setCurrentPick(ap.pick);
            const apRound = DRAFT_ORDER.find(s=>s.pick===ap.pick)?.round || 1;
            setActiveRound(apRound);
            if (idx === autopickQueue.length - 1) {
              setTimeout(() => {
                setAutoPickAnimating(false);
                const userSlot = DRAFT_ORDER.find(s => s.abbr === team);
                if (userSlot) {
                  setCurrentPick(userSlot.pick);
                  setActiveRound(userSlot.round);
                }
              }, 200);
            }
          }, delay * (idx + 1));
        });
      }
    } else {
      setCurrentPick(1);
    }
  };

  // ── TEAM SELECTION MODAL ──
  if (!draftMode) {
    const divisions = {
      "AFC East": ["BUF","MIA","NE","NYJ"],
      "AFC North": ["BAL","CIN","CLE","PIT"],
      "AFC South": ["HOU","IND","JAX","TEN"],
      "AFC West": ["DEN","KC","LAC","LV"],
      "NFC East": ["DAL","NYG","PHI","WAS"],
      "NFC North": ["CHI","DET","GB","MIN"],
      "NFC South": ["ATL","CAR","NO","TB"],
      "NFC West": ["ARI","LAR","SF","SEA"],
    };

    return (
      <div className="page-content" style={{maxWidth:"960px",margin:"0 auto",padding:"24px 24px 60px"}}>
        <div style={{
          background:"linear-gradient(135deg, rgba(45,212,191,0.06) 0%, rgba(27,42,74,0.5) 50%, rgba(45,212,191,0.03) 100%)",
          border:"1px solid rgba(45,212,191,0.12)",borderRadius:"16px",
          padding:"40px 32px",marginBottom:"32px",textAlign:"center",
        }}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#2dd4bf",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>2026 NFL Draft</div>
          <h2 style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(28px,5vw,42px)",fontWeight:700,color:"var(--dg-text)",margin:"0 0 8px",letterSpacing:"1px",textTransform:"uppercase"}}>Mock Draft Simulator</h2>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",color:"var(--dg-text-dim)",maxWidth:"500px",margin:"0 auto 20px",lineHeight:1.6}}>
            Build your own mock draft. Select from {PLAYERS.length} ranked prospects.
          </p>
          {/* Round Selector */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>Rounds</span>
            {[{label:"Round 1",val:1,picks:32},{label:"3 Rounds",val:3,picks:DRAFT_ORDER.filter(s=>s.round<=3).length},{label:"Full Draft",val:7,picks:TOTAL_PICKS}].map(opt => (
              <button key={opt.val} onClick={()=>setDraftRounds(opt.val)} style={{
                background: draftRounds===opt.val ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.04)",
                border: draftRounds===opt.val ? "1px solid rgba(45,212,191,0.4)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius:"8px",padding:"8px 16px",cursor:"pointer",transition:"all 0.15s",
              }}>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:draftRounds===opt.val?"#2dd4bf":"#94a3b8",letterSpacing:"0.5px"}}>{opt.label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:draftRounds===opt.val?"rgba(45,212,191,0.7)":"#475569",marginTop:"2px"}}>{opt.picks} picks</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"16px",overflow:"hidden"}}>
          <div style={{padding:"20px 24px",borderBottom:"1px solid var(--dg-card-border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <h3 style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase",margin:"0 0 4px"}}>{fullDraftToggle ? "Full Draft Mode" : "Choose Your Team"}</h3>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",margin:0}}>{fullDraftToggle ? "You make every pick for all 32 teams" : "Draft for your team — AI handles the rest"}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"10px",flexShrink:0}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Full Draft</span>
              <div onClick={()=>setFullDraftToggle(!fullDraftToggle)} style={{width:"44px",height:"24px",borderRadius:"12px",background:fullDraftToggle?"#2dd4bf":"rgba(255,255,255,0.1)",cursor:"pointer",position:"relative",transition:"background 0.2s",border:fullDraftToggle?"none":"1px solid rgba(255,255,255,0.15)"}}>
                <div style={{width:"18px",height:"18px",borderRadius:"50%",background:fullDraftToggle?"#0c1222":"#64748b",position:"absolute",top:"3px",left:fullDraftToggle?"23px":"3px",transition:"all 0.2s"}}/>
              </div>
            </div>
          </div>

          {fullDraftToggle ? (
            <div style={{padding:"40px 24px",textAlign:"center"}}>
              <div style={{width:"80px",height:"80px",borderRadius:"50%",margin:"0 auto 20px",background:"linear-gradient(135deg, rgba(45,212,191,0.15), rgba(45,212,191,0.05))",border:"2px solid rgba(45,212,191,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:"32px"}}>🏈</span>
              </div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-muted)",maxWidth:"400px",margin:"0 auto 24px",lineHeight:1.6}}>
                Take full control. You'll make all {lastPickInScope} selections across {draftRounds === 1 ? "Round 1" : draftRounds === 7 ? "7 rounds" : `${draftRounds} rounds`} — pick the best player for each team.
              </p>
              <button onClick={()=>startDraft("full", null)} style={{background:"#2dd4bf",color:"#0c1222",border:"none",borderRadius:"8px",padding:"14px 36px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase"}}>Start Full Draft →</button>
            </div>
          ) : (
            <div style={{padding:"16px 20px 24px"}}>
              <div className="mock-team-grid" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"12px"}}>
                {Object.entries(divisions).map(([divName, teams]) => (
                  <div key={divName}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px",paddingBottom:"6px",borderBottom:"1px solid var(--dg-divider)"}}>{divName}</div>
                    <div className="mock-div-teams" style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                      {teams.map(abbr => {
                        const slot = DRAFT_ORDER.find(s=>s.abbr===abbr);
                        const shortName = slot ? slot.team.split(" ").pop() : abbr;
                        const totalTeamPicks = DRAFT_ORDER.filter(s=>s.abbr===abbr).length;
                        return (
                          <div key={abbr} style={{display:"flex",flexDirection:"column",gap:"0"}}>
                          <div onClick={()=>startDraft("team", abbr)}
                            style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 10px",borderRadius:"8px",background:"var(--dg-card)",border:"1px solid rgba(255,255,255,0.04)",cursor:"pointer",transition:"all 0.15s"}}
                            onMouseEnter={e=>{e.currentTarget.style.background="rgba(45,212,191,0.08)";e.currentTarget.style.borderColor="rgba(45,212,191,0.2)";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor="rgba(255,255,255,0.04)";}}
                          >
                            <span style={{width:"32px",height:"20px",borderRadius:"4px",background:TEAM_COLORS[abbr]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fontWeight:700,color:"#fff",letterSpacing:"0.3px",flexShrink:0}}>{abbr}</span>
                            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:500,color:"var(--dg-text)",flex:1}}>{shortName}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>{totalTeamPicks} picks</span>
                          </div>
                          <div style={{paddingLeft:"50px",paddingBottom:"2px"}}>
                            <span onClick={e=>{e.stopPropagation();setTeamProfileOverlay(abbr);}} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",cursor:"pointer",opacity:0.7,transition:"opacity 0.15s"}}
                              onMouseEnter={e=>{e.currentTarget.style.opacity="1";}}
                              onMouseLeave={e=>{e.currentTarget.style.opacity="0.7";}}
                            >View team profile →</span>
                          </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!drafting) return null;

  const currentSlot = DRAFT_ORDER.find(s=>s.pick===currentPick);
  const isUserPick = draftMode === "full" || (draftMode === "team" && currentSlot && getPickOwner(currentPick) === userTeam);
  const userTeamSlot = userTeam ? DRAFT_ORDER.find(s=>s.abbr===userTeam) : null;
  const currentRoundPicks = roundPicks(activeRound);

  return (
    <>
    <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0"}}>
      {/* Draft header bar */}
      <div style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid var(--dg-card-border)",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          {/* Round tabs */}
          <div style={{display:"flex",gap:"2px"}}>
            {ROUNDS.filter(r => r <= draftRounds).map(r => {
              const roundDone = roundPicks(r).every(s=>picks[s.pick]);
              const isCurrent = r === currentRound;
              return (
                <button key={r} onClick={()=>setActiveRound(r)} style={{
                  background: activeRound===r ? "rgba(45,212,191,0.15)" : roundDone ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
                  border: activeRound===r ? "1px solid rgba(45,212,191,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius:"4px",padding:"4px 8px",cursor:"pointer",
                  fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:600,
                  color: activeRound===r ? "#2dd4bf" : roundDone ? "#22c55e" : isCurrent ? "#f1f5f9" : "#64748b",
                  letterSpacing:"0.5px",minWidth:"28px",
                }}>R{r}</button>
              );
            })}
          </div>
          {draftMode === "team" && userTeamSlot && (
            <span style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"3px 10px"}}>
              <span style={{width:"22px",height:"14px",borderRadius:"3px",background:TEAM_COLORS[userTeam]||"#333",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",fontWeight:700,color:"#fff"}}>{userTeam}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-muted)"}}>{userTeamSlot.team}</span>
            </span>
          )}
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)"}}>{picksCount}/{lastPickInScope}</span>
          <div style={{width:"80px",height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{width:`${(picksCount/lastPickInScope)*100}%`,height:"100%",background:"#2dd4bf",borderRadius:"2px",transition:"width 0.3s ease"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={resetDraft} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"6px 14px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Reset</button>
          <button onClick={exitToModal} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"6px 14px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Exit</button>
        </div>
      </div>

      {/* Round Complete Prompt */}
      {roundCompletePrompt && !draftComplete && (
        <div style={{background:"rgba(45,212,191,0.06)",border:"1px solid rgba(45,212,191,0.15)",margin:"0",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px",borderBottom:"1px solid rgba(45,212,191,0.1)"}}>
          <div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:700,color:"#2dd4bf",letterSpacing:"0.5px",textTransform:"uppercase"}}>Round {roundCompletePrompt} Complete</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"2px"}}>{roundCompletePrompt < 7 ? `Continue to Round ${roundCompletePrompt + 1} or view your results` : "All rounds complete"}</div>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={()=>{setShowResults(true);setResultRound(1);}} style={{background:"var(--dg-input)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"8px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text)",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>View Results</button>
            {roundCompletePrompt < 7 && (
              <button onClick={()=>{
                const nextRd = roundCompletePrompt + 1;
                setDraftRounds(prev => Math.max(prev, nextRd));
                setRoundCompletePrompt(null);
                // If in team mode, continue auto-picking into the next round
                if (draftMode === "team") {
                  const { autopickQueue, nextUserPick } = runAutoPicks(currentPick, picks);
                  if (autopickQueue.length > 0 || nextUserPick) {
                    animateAutoPicks(autopickQueue, nextUserPick, nextRd);
                  }
                }
              }} style={{background:"#2dd4bf",border:"none",borderRadius:"8px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#0c1222",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Continue to Round {roundCompletePrompt + 1} →</button>
            )}
          </div>
        </div>
      )}

      {autoPickAnimating && (
        <div style={{background:"rgba(45,212,191,0.06)",borderBottom:"1px solid rgba(45,212,191,0.12)",padding:"8px 20px",display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#2dd4bf",animation:"pulse 1s infinite"}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#2dd4bf"}}>Simulating picks...</span>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
        </div>
      )}

      {confirmPlayer && currentSlot && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setConfirmPlayer(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1a2332",border:"1px solid rgba(45,212,191,0.2)",borderRadius:"16px",padding:"32px",maxWidth:"400px",width:"100%",textAlign:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px"}}>Round {currentSlot.round} · Pick #{currentPick}</div>
            <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"44px",height:"28px",borderRadius:"6px",background:TEAM_COLORS[currentSlot.abbr]||"#333",fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:700,color:"#fff",marginBottom:"12px"}}>{currentSlot.abbr}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",color:"var(--dg-text-muted)",marginBottom:"16px"}}>{currentSlot.team}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"var(--dg-text-dim)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>SELECTS</div>
            <PosBadge pos={confirmPlayer.p}/>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:700,color:"var(--dg-text)",margin:"8px 0 4px"}}>{confirmPlayer.n}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-muted)",marginBottom:"4px"}}>{confirmPlayer.s}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-faint)",marginBottom:"24px"}}>Big Board #{confirmPlayer.r}</div>
            <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
              <button onClick={()=>setConfirmPlayer(null)} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cancel</button>
              <button onClick={confirmPick} style={{background:"#2dd4bf",border:"none",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#0c1222",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Confirm Pick</button>
            </div>
          </div>
        </div>
      )}

      {/* Trade Banner */}
      {tradeBanner && (
        <div style={{background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",margin:"0",padding:"10px 20px",display:"flex",alignItems:"center",gap:"10px",borderBottom:"1px solid rgba(249,115,22,0.15)"}}>
          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:700,color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",flexShrink:0}}>TRADE</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#fb923c"}}>{tradeBanner}</span>
        </div>
      )}

      {/* Trade Modal */}
      {tradeModalOpen && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>{setTradeModalOpen(false);setTradePartner(null);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1a2332",border:"1px solid rgba(249,115,22,0.2)",borderRadius:"16px",maxWidth:"700px",width:"100%",maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Modal Header */}
            <div style={{padding:"20px 24px 16px",borderBottom:"1px solid var(--dg-card-border)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Propose Trade</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",marginTop:"2px"}}>Select picks to trade · AI accepts within fair value range</div>
                </div>
                <button onClick={()=>{setTradeModalOpen(false);setTradePartner(null);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());}} style={{background:"none",border:"none",color:"var(--dg-text-dim)",cursor:"pointer",fontSize:"20px",padding:"4px"}}>×</button>
              </div>

              {/* Trade Partner Selector */}
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",flexShrink:0}}>Trade with</span>
                <select
                  value={tradePartner || ""}
                  onChange={e=>{setTradePartner(e.target.value||null);setPartnerTradeOffers(new Set());}}
                  style={{flex:1,background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"8px 12px",color:"var(--dg-text)",fontSize:"12px",fontFamily:"'Oswald',sans-serif",cursor:"pointer",outline:"none"}}
                >
                  <option value="" style={{background:"#1a2332"}}>Select a team...</option>
                  {[...new Set(DRAFT_ORDER.map(s=>s.abbr))].sort().filter(a => {
                    const myTeam = draftMode === "team" ? userTeam : getPickOwner(currentPick);
                    return a !== myTeam && getTeamAvailablePicks(a).length > 0;
                  }).map(a => (
                    <option key={a} value={a} style={{background:"#1a2332"}}>{getPickTeamName(a)} ({getTeamAvailablePicks(a).length} picks)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trade Body */}
            <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
              {tradePartner ? (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:"16px"}}>
                  {/* Your Picks */}
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"10px",display:"flex",alignItems:"center",gap:"6px"}}>
                      <span style={{width:"20px",height:"12px",borderRadius:"2px",background:TEAM_COLORS[draftMode==="team"?userTeam:getPickOwner(currentPick)]||"#333"}}></span>
                      Your Picks
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                      {getTeamAvailablePicks(draftMode==="team"?userTeam:getPickOwner(currentPick)).map(pickNum => {
                        const slot = DRAFT_ORDER.find(s=>s.pick===pickNum);
                        const selected = userTradeOffers.has(pickNum);
                        return (
                          <div key={pickNum} onClick={()=>{
                            const next = new Set(userTradeOffers);
                            selected ? next.delete(pickNum) : next.add(pickNum);
                            setUserTradeOffers(next);
                          }} style={{
                            display:"flex",alignItems:"center",gap:"8px",padding:"8px 12px",borderRadius:"8px",cursor:"pointer",
                            background: selected ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.02)",
                            border: selected ? "1px solid rgba(45,212,191,0.3)" : "1px solid rgba(255,255,255,0.06)",
                            transition:"all 0.15s",
                          }}>
                            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:selected?"#2dd4bf":"#64748b"}}>#{pickNum}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-muted)"}}>R{slot?.round}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",marginLeft:"auto"}}>{Math.round(PICK_VALUES[pickNum]||0)} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Value Meter */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",minWidth:"80px"}}>
                    {(() => {
                      const eval_ = evaluateTrade([...userTradeOffers], [...partnerTradeOffers]);
                      const userVal = eval_.userValue || 0;
                      const partnerVal = eval_.partnerValue || 0;
                      const diff = userVal - partnerVal;
                      const isBalanced = eval_.acceptable;
                      return (
                        <>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>Value</div>
                          <div style={{width:"4px",height:"100px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",position:"relative"}}>
                            <div style={{
                              position:"absolute",left:"-8px",right:"-8px",height:"20px",borderRadius:"3px",
                              background: isBalanced ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
                              border: isBalanced ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(239,68,68,0.5)",
                              top: `${Math.max(0, Math.min(80, 50 - (diff / Math.max(1, partnerVal) * 50)))}px`,
                              transition:"all 0.2s",
                            }}/>
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color: isBalanced ? "#22c55e" : "#ef4444"}}>{Math.round(userVal)} : {Math.round(partnerVal)}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color: isBalanced ? "#22c55e" : "#ef4444",marginTop:"2px"}}>
                              {userVal === 0 && partnerVal === 0 ? "Select picks" : isBalanced ? "Fair trade ✓" : diff > 0 ? "Overpaying" : "Underpaying"}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Partner Picks */}
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"10px",display:"flex",alignItems:"center",gap:"6px"}}>
                      <span style={{width:"20px",height:"12px",borderRadius:"2px",background:TEAM_COLORS[tradePartner]||"#333"}}></span>
                      {getPickTeamName(tradePartner)}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                      {getTeamAvailablePicks(tradePartner).map(pickNum => {
                        const slot = DRAFT_ORDER.find(s=>s.pick===pickNum);
                        const selected = partnerTradeOffers.has(pickNum);
                        return (
                          <div key={pickNum} onClick={()=>{
                            const next = new Set(partnerTradeOffers);
                            selected ? next.delete(pickNum) : next.add(pickNum);
                            setPartnerTradeOffers(next);
                          }} style={{
                            display:"flex",alignItems:"center",gap:"8px",padding:"8px 12px",borderRadius:"8px",cursor:"pointer",
                            background: selected ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.02)",
                            border: selected ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.06)",
                            transition:"all 0.15s",
                          }}>
                            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:selected?"#f97316":"#64748b"}}>#{pickNum}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-muted)"}}>R{slot?.round}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",marginLeft:"auto"}}>{Math.round(PICK_VALUES[pickNum]||0)} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{textAlign:"center",padding:"40px 0"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-faint)"}}>Select a team to start building a trade</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{padding:"16px 24px",borderTop:"1px solid var(--dg-card-border)",display:"flex",gap:"10px",justifyContent:"flex-end"}}>
              <button onClick={()=>{setTradeModalOpen(false);setTradePartner(null);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());}} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cancel</button>
              <button
                onClick={executeTrade}
                disabled={!evaluateTrade([...userTradeOffers],[...partnerTradeOffers]).acceptable}
                style={{
                  background: evaluateTrade([...userTradeOffers],[...partnerTradeOffers]).acceptable ? "#f97316" : "rgba(255,255,255,0.04)",
                  border: evaluateTrade([...userTradeOffers],[...partnerTradeOffers]).acceptable ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius:"8px",padding:"10px 24px",cursor: evaluateTrade([...userTradeOffers],[...partnerTradeOffers]).acceptable ? "pointer" : "not-allowed",
                  fontFamily:"'Oswald',sans-serif",fontSize:"13px",
                  color: evaluateTrade([...userTradeOffers],[...partnerTradeOffers]).acceptable ? "#fff" : "#475569",
                  fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",opacity: evaluateTrade([...userTradeOffers],[...partnerTradeOffers]).acceptable ? 1 : 0.5,
                }}
              >Execute Trade</button>
            </div>
          </div>
        </div>
      )}

      {draftComplete && !showResults && (
        <div style={{background:"rgba(45,212,191,0.08)",border:"1px solid rgba(45,212,191,0.2)",borderRadius:"10px",margin:"12px 20px",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,color:"#2dd4bf",textTransform:"uppercase",letterSpacing:"0.5px"}}>Draft Complete!</div>
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={resetDraft} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text-muted)",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Start Over</button>
            <button onClick={()=>setShowResults(true)} style={{background:"#2dd4bf",border:"none",borderRadius:"6px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#0c1222",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>View Results →</button>
          </div>
        </div>
      )}

      {/* ── RESULTS SCREEN ── */}
      {showResults && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"var(--dg-bg)",zIndex:300,display:"flex",flexDirection:"column"}}>
          <div style={{flex:1,overflowY:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
            <div id="draft-results" style={{width:"100%",maxWidth:"820px",margin:"0 auto",padding:"clamp(10px,2vw,20px)"}}>
              {/* Header */}
              <div style={{textAlign:"center",marginBottom:"clamp(8px,1.5vw,14px)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"4px"}}>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(12px,2vw,16px)",fontWeight:700,color:"var(--dg-text)",letterSpacing:"1px",textTransform:"uppercase"}}>Draft Guide</div>
                </div>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(16px,3vw,24px)",fontWeight:700,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.2}}>2026 Mock Draft</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1.2vw,10px)",color:"var(--dg-text-dim)",letterSpacing:"1px",textTransform:"uppercase",marginTop:"2px"}}>
                  {resultsView === "my" && draftMode === "team"
                    ? `${userTeamSlot?.team || ""} · ${teamPicksOwned(userTeam).filter(s=>picks[s.pick]).length} Picks`
                    : `Round ${resultRound} · ${roundPicks(resultRound).length} Picks`
                  }
                </div>
              </div>

              {/* View Toggle (team mode) + Round tabs */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",marginBottom:"clamp(8px,1.2vw,12px)"}}>
                {/* My Picks / Full Draft toggle */}
                {draftMode === "team" && (
                  <div style={{display:"flex",borderRadius:"6px",overflow:"hidden",border:"1px solid var(--dg-card-border2)"}}>
                    <button onClick={()=>setResultsView("my")} style={{
                      background: resultsView==="my" ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.04)",
                      border:"none",borderRight:"1px solid rgba(255,255,255,0.08)",padding:"6px 16px",cursor:"pointer",
                      fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.2vw,12px)",fontWeight:600,
                      color: resultsView==="my" ? "#2dd4bf" : "#64748b",letterSpacing:"0.5px",textTransform:"uppercase",
                    }}>My Picks</button>
                    <button onClick={()=>{setResultsView("full");setResultRound(1);}} style={{
                      background: resultsView==="full" ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.04)",
                      border:"none",padding:"6px 16px",cursor:"pointer",
                      fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.2vw,12px)",fontWeight:600,
                      color: resultsView==="full" ? "#2dd4bf" : "#64748b",letterSpacing:"0.5px",textTransform:"uppercase",
                    }}>Full Draft</button>
                  </div>
                )}

                {/* Round tabs (full draft view or full draft mode) */}
                {(resultsView === "full" || draftMode === "full") && (
                  <div style={{display:"flex",justifyContent:"center",gap:"4px"}}>
                    {ROUNDS.filter(r => roundPicks(r).some(s => picks[s.pick])).map(r => (
                      <button key={r} onClick={()=>setResultRound(r)} style={{
                        background: resultRound===r ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.04)",
                        border: resultRound===r ? "1px solid rgba(45,212,191,0.3)" : "1px solid rgba(255,255,255,0.06)",
                        borderRadius:"4px",padding:"4px 10px",cursor:"pointer",
                        fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.2vw,12px)",fontWeight:600,
                        color: resultRound===r ? "#2dd4bf" : "#64748b",letterSpacing:"0.5px",
                      }}>R{r}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Draft Grade Card (team mode, my picks view) */}
              {draftMode === "team" && resultsView === "my" && (() => {
                const mySlots = teamPicksOwned(userTeam).filter(s => picks[s.pick]);
                if (mySlots.length === 0) return null;

                const mappedNeeds = (TEAM_NEEDS[userTeam] || []).map(n => needsMapping[n] || n);

                // Grade each pick: compare player rank vs pick position
                let totalValue = 0;
                let needsHit = 0;
                const pickGrades = mySlots.map(slot => {
                  const player = picks[slot.pick];
                  const rankDiff = slot.pick - player.r; // positive = got value (player ranked higher than pick)
                  const isNeed = mappedNeeds.includes(player.p);
                  if (isNeed) needsHit++;

                  // Value score: how much value did you get?
                  let valueScore;
                  if (rankDiff >= 20) valueScore = 10;      // massive steal
                  else if (rankDiff >= 10) valueScore = 9;   // great value
                  else if (rankDiff >= 5) valueScore = 8;    // good value
                  else if (rankDiff >= 0) valueScore = 7;    // fair pick
                  else if (rankDiff >= -5) valueScore = 6;   // slight reach
                  else if (rankDiff >= -15) valueScore = 5;  // reach
                  else valueScore = 4;                        // big reach

                  // Need bonus: +1 if fills a need
                  const needBonus = isNeed ? 1.0 : 0;

                  // Positional value bonus
                  const posBonus = ({"QB":0.5,"EDGE":0.3,"OT":0.3,"CB":0.2,"WR":0.2,"DL":0.1}[player.p]) || 0;

                  const pickScore = Math.min(10, valueScore + needBonus + posBonus);
                  totalValue += pickScore;

                  return { slot, player, rankDiff, isNeed, pickScore };
                });

                const avgScore = totalValue / mySlots.length;
                const needPct = Math.round((needsHit / mySlots.length) * 100);

                // Convert to letter grade
                let grade, gradeColor;
                if (avgScore >= 9.0) { grade = "A+"; gradeColor = "#22c55e"; }
                else if (avgScore >= 8.5) { grade = "A"; gradeColor = "#22c55e"; }
                else if (avgScore >= 8.0) { grade = "A-"; gradeColor = "#4ade80"; }
                else if (avgScore >= 7.5) { grade = "B+"; gradeColor = "#2dd4bf"; }
                else if (avgScore >= 7.0) { grade = "B"; gradeColor = "#2dd4bf"; }
                else if (avgScore >= 6.5) { grade = "B-"; gradeColor = "#38bdf8"; }
                else if (avgScore >= 6.0) { grade = "C+"; gradeColor = "#f59e0b"; }
                else if (avgScore >= 5.5) { grade = "C"; gradeColor = "#f59e0b"; }
                else if (avgScore >= 5.0) { grade = "C-"; gradeColor = "#f97316"; }
                else { grade = "D"; gradeColor = "#ef4444"; }

                // Find best pick (highest value over slot)
                const bestPick = pickGrades.reduce((a, b) => a.rankDiff > b.rankDiff ? a : b);
                // Find biggest reach
                const worstPick = pickGrades.reduce((a, b) => a.rankDiff < b.rankDiff ? a : b);

                return (
                  <div style={{marginBottom:"clamp(10px,1.5vw,16px)"}}>
                    {/* Grade header */}
                    <div style={{
                      background:"var(--dg-card)",border:"1px solid var(--dg-card-border2)",
                      borderRadius:"12px",padding:"clamp(14px,2vw,20px)",
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:"clamp(14px,2.5vw,24px)"}}>
                        {/* Big grade */}
                        <div style={{
                          width:"clamp(56px,8vw,72px)",height:"clamp(56px,8vw,72px)",
                          borderRadius:"12px",background:`${gradeColor}15`,
                          border:`2px solid ${gradeColor}40`,
                          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                        }}>
                          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(28px,4.5vw,38px)",fontWeight:700,color:gradeColor,lineHeight:1}}>{grade}</div>
                        </div>

                        {/* Stats */}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(14px,2vw,18px)",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"8px"}}>Draft Grade</div>
                          <div style={{display:"flex",gap:"clamp(12px,2vw,24px)",flexWrap:"wrap"}}>
                            <div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.9vw,9px)",color:"var(--dg-text-faint)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Value</div>
                              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(16px,2.2vw,22px)",fontWeight:700,color:"var(--dg-text)"}}>{avgScore.toFixed(1)}<span style={{fontSize:"clamp(10px,1.2vw,12px)",color:"var(--dg-text-faint)"}}>/10</span></div>
                            </div>
                            <div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.9vw,9px)",color:"var(--dg-text-faint)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Needs Filled</div>
                              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(16px,2.2vw,22px)",fontWeight:700,color:needPct >= 60 ? "#2dd4bf" : needPct >= 40 ? "#f59e0b" : "#ef4444"}}>{needPct}%</div>
                            </div>
                            <div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.9vw,9px)",color:"var(--dg-text-faint)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Picks</div>
                              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(16px,2.2vw,22px)",fontWeight:700,color:"var(--dg-text)"}}>{mySlots.length}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pick-by-pick value bars */}
                      <div style={{marginTop:"clamp(10px,1.5vw,16px)",borderTop:"1px solid var(--dg-card-border)",paddingTop:"clamp(8px,1.2vw,12px)"}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.9vw,9px)",color:"var(--dg-text-faint)",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"6px"}}>Pick-by-Pick Value</div>
                        <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                          {pickGrades.map(({slot, player, rankDiff, isNeed, pickScore}) => {
                            const barColor = pickScore >= 8.5 ? "#22c55e" : pickScore >= 7 ? "#2dd4bf" : pickScore >= 6 ? "#f59e0b" : "#ef4444";
                            const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                            return (
                              <div key={slot.pick} style={{display:"flex",alignItems:"center",gap:"clamp(4px,0.7vw,8px)"}}>
                                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",color:"var(--dg-text-faint)",minWidth:"clamp(18px,2.5vw,24px)",textAlign:"right"}}>#{slot.pick}</span>
                                <span style={{background:pc.bg,color:pc.text,padding:"0px 4px",borderRadius:"2px",fontSize:"clamp(6px,0.8vw,8px)",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",minWidth:"clamp(24px,3.5vw,32px)",textAlign:"center"}}>{player.p}</span>
                                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(9px,1.1vw,12px)",fontWeight:600,color:"var(--dg-text)",minWidth:"clamp(60px,10vw,100px)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{player.n}</span>
                                <div style={{flex:1,height:"clamp(6px,0.8vw,8px)",background:"rgba(255,255,255,0.06)",borderRadius:"4px",overflow:"hidden",minWidth:"40px"}}>
                                  <div style={{width:`${pickScore * 10}%`,height:"100%",background:barColor,borderRadius:"4px",transition:"width 0.3s"}}/>
                                </div>
                                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",fontWeight:600,color:barColor,minWidth:"clamp(18px,2.5vw,26px)",textAlign:"right"}}>{pickScore.toFixed(1)}</span>
                                {isNeed && <span style={{fontSize:"clamp(7px,0.8vw,9px)",color:"#2dd4bf"}} title="Fills a team need">✓</span>}
                                {rankDiff >= 10 && <span style={{fontSize:"clamp(7px,0.8vw,9px)",color:"#22c55e"}} title={`Steal! Ranked #${player.r}, picked #${slot.pick}`}>🔥</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div style={{marginTop:"clamp(8px,1.2vw,12px)",display:"flex",gap:"clamp(8px,1.2vw,16px)",flexWrap:"wrap"}}>
                        {bestPick.rankDiff > 0 && (
                          <div style={{flex:1,minWidth:"140px",background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:"8px",padding:"clamp(6px,1vw,10px)"}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.8vw,8px)",color:"#22c55e",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"2px"}}>Best Value</div>
                            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(11px,1.4vw,14px)",fontWeight:600,color:"var(--dg-text)"}}>{bestPick.player.n}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",color:"var(--dg-text-dim)"}}>Ranked #{bestPick.player.r}, picked #{bestPick.slot.pick} (+{bestPick.rankDiff})</div>
                          </div>
                        )}
                        {worstPick.rankDiff < -3 && (
                          <div style={{flex:1,minWidth:"140px",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:"8px",padding:"clamp(6px,1vw,10px)"}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.8vw,8px)",color:"#ef4444",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"2px"}}>Biggest Reach</div>
                            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(11px,1.4vw,14px)",fontWeight:600,color:"var(--dg-text)"}}>{worstPick.player.n}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",color:"var(--dg-text-dim)"}}>Ranked #{worstPick.player.r}, picked #{worstPick.slot.pick} ({worstPick.rankDiff})</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Results grid */}
              {(() => {
                const showMyPicks = draftMode === "team" && resultsView === "my";
                const displaySlots = showMyPicks
                  ? teamPicksOwned(userTeam).filter(s => picks[s.pick])
                  : roundPicks(resultRound).filter(s => picks[s.pick]);
                const cols = displaySlots.length <= 4 ? displaySlots.length : 4;
                const rows = Math.ceil(displaySlots.length / cols);
                if (displaySlots.length === 0) return <div style={{textAlign:"center",padding:"40px",fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-faint)"}}>No picks to display</div>;
                return (
                  <div style={{
                    display:"grid",gridTemplateColumns:`repeat(${cols}, 1fr)`,gap:"0",
                    border:"1px solid var(--dg-card-border2)",borderRadius:"clamp(6px,1vw,10px)",overflow:"hidden",
                  }}>
                    {displaySlots.map((slot, idx) => {
                      const player = picks[slot.pick];
                      if (!player) return null;
                      const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                      const owner = getPickOwner(slot.pick);
                      const isMyPick = draftMode === "team" && owner === userTeam;
                      const row = Math.floor(idx / cols);
                      return (
                        <div key={slot.pick} style={{
                          padding:"clamp(4px,0.7vw,8px) clamp(5px,0.8vw,10px)",
                          background: isMyPick && resultsView==="full" ? "rgba(45,212,191,0.04)" : row % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                          borderBottom: row < rows-1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          borderRight: idx%cols < cols-1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                          borderLeft: isMyPick && resultsView==="full" ? "2px solid rgba(45,212,191,0.3)" : "none",
                        }}>
                          <div style={{display:"flex",alignItems:"center",gap:"clamp(3px,0.5vw,6px)",marginBottom:"clamp(2px,0.3vw,4px)"}}>
                            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.3vw,13px)",fontWeight:700,color:"#2dd4bf",minWidth:"clamp(14px,2vw,20px)"}}>{slot.pick}</span>
                            <span style={{width:"clamp(22px,3.5vw,30px)",height:"clamp(13px,2vw,17px)",borderRadius:"2px",background:TEAM_COLORS[owner]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(6px,0.9vw,8px)",fontWeight:700,color:"#fff",flexShrink:0}}>{owner}</span>
                            <span style={{background:pc.bg,color:pc.text,padding:"0px clamp(3px,0.5vw,5px)",borderRadius:"2px",fontSize:"clamp(6px,0.85vw,8px)",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginLeft:"auto"}}>{player.p}</span>
                          </div>
                          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.3vw,13px)",fontWeight:600,color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.2}}>{player.n}</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.85vw,9px)",color:"var(--dg-text-dim)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.3}}>{player.s}</div>
                          {showMyPicks && (
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.8vw,8px)",color:"var(--dg-text-faint)",marginTop:"1px"}}>Rd {slot.round}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Trade History */}
              {tradeHistory.length > 0 && resultsView === "my" && draftMode === "team" && (
                <div style={{marginTop:"clamp(8px,1.2vw,12px)"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#f97316",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Trades Made</div>
                  {tradeHistory.map((t, i) => (
                    <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",color:"var(--dg-text-muted)",lineHeight:1.6}}>
                      <span style={{color:"#f97316"}}>⇄</span> {getPickTeamName(t.team1)} sent {t.team1Gives.map(p=>`#${p}`).join(", ")} to {getPickTeamName(t.team2)} for {t.team2Gives.map(p=>`#${p}`).join(", ")}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div style={{marginTop:"clamp(8px,1.2vw,14px)",paddingTop:"clamp(6px,1vw,10px)",borderTop:"1px solid var(--dg-card-border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,1.1vw,11px)",color:"var(--dg-text-muted)",fontWeight:500}}>draft-guide.com</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",color:"var(--dg-text-faint)"}}>· Create your own mock draft</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                  <svg width="clamp(11px,1.5vw,14px)" height="clamp(11px,1.5vw,14px)" viewBox="0 0 24 24" fill="#475569"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,1.1vw,11px)",color:"#2dd4bf",fontWeight:500}}>@DraftGuide_</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{borderTop:"1px solid var(--dg-card-border)",padding:"12px 20px",display:"flex",gap:"10px",justifyContent:"center",background:"var(--dg-bg)",flexShrink:0}}>
            <button onClick={()=>setShowResults(false)} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>← Back to Draft</button>
            <button onClick={resetDraft} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>New Draft</button>
          </div>
        </div>
      )}

      {/* Split screen */}
      <div className="draft-split" style={{display:"grid",gridTemplateColumns:"360px 1fr",minHeight:"calc(100vh - 160px)"}}>
        {/* Left - Draft Board */}
        <div style={{borderRight:"1px solid var(--dg-card-border)",overflowY:"auto",maxHeight:"calc(100vh - 160px)"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid var(--dg-card-border)",fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"var(--dg-text)",letterSpacing:"0.8px",textTransform:"uppercase",position:"sticky",top:0,background:"var(--dg-bg)",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>Round {activeRound}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",fontWeight:400}}>{currentRoundPicks.filter(s=>picks[s.pick]).length}/{currentRoundPicks.length}</span>
          </div>

          {currentRoundPicks.map((slot) => {
            const picked = picks[slot.pick];
            const isCurrent = slot.pick === currentPick && !draftComplete;
            const owner = getPickOwner(slot.pick);
            const wasTraded = owner !== slot.abbr;
            const isUserTeamRow = draftMode === "team" && owner === userTeam;
            return (
              <div key={slot.pick}
                onClick={()=>{ if(!draftComplete && draftMode === "full") { setCurrentPick(slot.pick); } }}
                style={{
                  display:"flex",alignItems:"center",gap:"10px",
                  padding: isCurrent ? "12px 16px" : "8px 16px",
                  background: isCurrent ? "rgba(45,212,191,0.08)" : isUserTeamRow && picked ? "rgba(45,212,191,0.03)" : "transparent",
                  borderLeft: isCurrent ? "3px solid #2dd4bf" : isUserTeamRow ? "3px solid rgba(45,212,191,0.25)" : "3px solid transparent",
                  borderBottom:"1px solid var(--dg-divider)",
                  cursor: draftMode === "full" ? "pointer" : "default",transition:"all 0.15s",
                }}
              >
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:isCurrent?"16px":"13px",fontWeight:700,color:isCurrent?"#2dd4bf":"#475569",minWidth:"24px",textAlign:"right"}}>{slot.pick}</span>
                <div style={{display:"flex",alignItems:"center",gap:"2px",flexShrink:0}}>
                  <span style={{width:"32px",height:"20px",borderRadius:"3px",background:TEAM_COLORS[owner]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fontWeight:700,color:"#fff",letterSpacing:"0.3px",boxShadow:isUserTeamRow?"0 0 0 1.5px rgba(45,212,191,0.5)":"none"}}>{owner}</span>
                  {wasTraded && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",color:"#f97316",marginLeft:"2px"}} title={`Traded from ${slot.abbr}`}>⇄</span>}
                </div>
                {picked ? (
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:"8px",minWidth:0}}>
                    <PosBadge pos={picked.p}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:500,color:"var(--dg-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{picked.n}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)"}}>{picked.s}</div>
                    </div>
                    {((draftMode === "full") || (draftMode === "team" && isUserTeamRow)) && (
                      <button onClick={(e)=>{e.stopPropagation();undoPick(slot.pick);}} style={{background:"none",border:"none",color:"var(--dg-text-faint)",cursor:"pointer",fontSize:"14px",padding:"2px 4px",flexShrink:0}} title="Undo pick">×</button>
                    )}
                  </div>
                ) : (
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:isCurrent?"#94a3b8":"#334155"}}>
                      {isCurrent ? (isUserPick ? "Your pick..." : "Simulating...") : slot.team}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right - Available Players */}
        <div style={{overflowY:"auto",maxHeight:"calc(100vh - 160px)"}}>
          {!draftComplete && currentSlot && (
            <div style={{padding:"14px 20px",borderBottom:"1px solid var(--dg-card-border)",background:isUserPick?"var(--dg-bg)":"var(--dg-card)",position:"sticky",top:0,zIndex:10}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"#2dd4bf"}}>#{currentPick}</span>
                <span style={{width:"40px",height:"26px",borderRadius:"5px",background:TEAM_COLORS[getPickOwner(currentPick)]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:700,color:"#fff"}}>{getPickOwner(currentPick)}</span>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:600,color:"var(--dg-text)"}}>{getPickTeamName(getPickOwner(currentPick))}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:isUserPick?"#2dd4bf":"#64748b"}}>
                    {isUserPick ? `Round ${currentSlot.round} · Your pick — select a player` : autoPickAnimating ? "Simulating pick..." : `Round ${currentSlot.round}`}
                  </div>
                </div>
                {draftMode === "team" && isUserPick && (
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px"}}>
                    <button onClick={()=>{setTradeModalOpen(true);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());setTradePartner(null);}} style={{background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:"6px",padding:"4px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#f97316",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>⇄ Trade</button>
                    <button onClick={()=>setTeamProfileOverlay(userTeam)} style={{background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.25)",borderRadius:"6px",padding:"4px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Team Profile</button>
                  </div>
                )}
                {draftMode === "full" && isUserPick && !draftComplete && (
                  <button onClick={()=>{setTradeModalOpen(true);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());setTradePartner(null);}} style={{marginLeft:"auto",background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:"6px",padding:"4px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#f97316",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>⇄ Trade Pick</button>
                )}
              </div>
              {TEAM_NEEDS[currentSlot.abbr] && (
                <div style={{marginTop:"10px",display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>NEEDS</span>
                  {TEAM_NEEDS[currentSlot.abbr].map(need=>(
                    <span key={need} style={{background:"rgba(255,255,255,0.06)",border:"1px solid var(--dg-card-border2)",borderRadius:"4px",padding:"2px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:600,color:"#f59e0b",letterSpacing:"0.3px"}}>{need}</span>
                  ))}
                </div>
              )}
              {/* Already drafted roster for current picking team */}
              {(() => {
                const pickingAbbr = draftMode === "team" ? userTeam : currentSlot.abbr;
                const alreadyDrafted = DRAFT_ORDER
                  .filter(s => getPickOwner(s.pick) === pickingAbbr && picks[s.pick])
                  .map(s => ({ pick: s.pick, round: s.round, player: picks[s.pick] }));
                if (alreadyDrafted.length === 0) return null;
                return (
                  <div style={{marginTop:"10px",paddingTop:"10px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"6px"}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>
                        {draftMode === "team" ? "Your Roster" : `${currentSlot.abbr} Picks`}
                      </span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-ghost)"}}>({alreadyDrafted.length})</span>
                    </div>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                      {alreadyDrafted.map(d => {
                        const pc = POS_COLORS[d.player.p] || {bg:"#555",text:"#fff"};
                        return (
                          <div key={d.pick} style={{
                            display:"flex",alignItems:"center",gap:"5px",
                            background:"rgba(255,255,255,0.03)",border:"1px solid var(--dg-card-border)",
                            borderRadius:"6px",padding:"4px 8px",
                          }}>
                            <span style={{
                              background:pc.bg,color:pc.text,
                              padding:"1px 4px",borderRadius:"3px",
                              fontSize:"8px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",
                            }}>{d.player.p}</span>
                            <span style={{
                              fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:500,color:"#e2e8f0",
                            }}>{d.player.n.split(" ").pop()}</span>
                            <span style={{
                              fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--dg-text-faint)",
                            }}>R{d.round}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div style={{padding:"12px 20px",borderBottom:"1px solid var(--dg-divider)",display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center",position:"sticky",top:draftComplete?0:"90px",zIndex:9,background:"var(--dg-bg)"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",flex:1,minWidth:"160px",background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"6px 10px"}}>
              <SearchIcon/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search players..." style={{background:"transparent",border:"none",outline:"none",color:"var(--dg-text)",fontSize:"12px",fontFamily:"'JetBrains Mono',monospace",width:"100%"}}/>
              {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"var(--dg-text-dim)",cursor:"pointer",fontSize:"14px",padding:"0"}}>×</button>}
            </div>
            <select value={posFilter} onChange={e=>setPosFilter(e.target.value)} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"6px 10px",color:"var(--dg-text)",fontSize:"11px",fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",outline:"none"}}>
              <option value="ALL" style={{background:"#1a2332"}}>All Positions</option>
              {[...OFF_POSITIONS,...DEF_POSITIONS].map(pos=>(<option key={pos} value={pos} style={{background:"#1a2332"}}>{pos}</option>))}
            </select>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)"}}>{available.length} available</span>
          </div>

          <div>
            {available.slice(0, 100).map((player, i) => {
              const canPick = isUserPick && !draftComplete && !picks[currentPick] && !autoPickAnimating;
              const profile = PROFILES[player.n];
              return (
              <div key={player.r}>
              <div onClick={()=>{ if(canPick) handlePick(player); }}
                style={{display:"grid",gridTemplateColumns:"40px 44px 1fr auto",alignItems:"center",gap:"10px",padding:"10px 20px",background:i%2===0?"transparent":"rgba(255,255,255,0.015)",borderBottom:"1px solid var(--dg-divider)",cursor:canPick?"pointer":"default",opacity:canPick?1:0.6,transition:"background 0.1s"}}
                onMouseEnter={e=>{if(canPick) e.currentTarget.style.background="rgba(45,212,191,0.06)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.015)";}}
              >
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:"#2dd4bf",textAlign:"right"}}>#{player.r}</span>
                <PosBadge pos={player.p}/>
                <div>
                  <div style={{display:"flex",alignItems:"baseline",gap:"8px"}}>
                    <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,color:"var(--dg-text)"}}>{player.n}</span>
                    {profile && (
                      <button onClick={e=>{e.stopPropagation();setExpandedMockPlayer(prev=>prev===player.n?null:player.n);}} style={{background:"none",border:"none",padding:0,cursor:"pointer",color:"var(--dg-text-faint)",fontSize:"11px",fontFamily:"'JetBrains Mono',monospace",display:"flex",alignItems:"center",gap:"2px"}} title="View profile">
                        <span style={{fontSize:"10px"}}>{expandedMockPlayer===player.n?"▼":"▶"}</span>
                      </button>
                    )}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)"}}>{player.s}</span>
                    {profile && (
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)"}}>
                        {profile.height} · {profile.weight} lbs{profile.class ? ` · ${profile.class}` : ""}
                      </span>
                    )}
                  </div>
                </div>
                {canPick && (
                  <button onClick={(e)=>{e.stopPropagation();handlePick(player);}} style={{background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.2)",borderRadius:"6px",padding:"5px 12px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#2dd4bf",letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Draft</button>
                )}
              </div>
              {/* Expandable Profile */}
              {expandedMockPlayer === player.n && profile && (
                <div style={{background:"linear-gradient(180deg, rgba(45,212,191,0.04) 0%, rgba(27,42,74,0.2) 100%)",borderBottom:"1px solid rgba(45,212,191,0.08)",padding:"14px 20px"}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"14px",alignItems:"center",marginBottom:"12px",paddingBottom:"10px",borderBottom:"1px solid var(--dg-divider)"}}>
                    <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
                      {[{label:"AGE",value:profile.age},{label:"HT",value:profile.height},{label:"WT",value:`${profile.weight} lbs`},{label:"CLASS",value:profile.class}].filter(s=>s.value).map(stat=>(
                        <div key={stat.label} style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>{stat.label}</div>
                          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"var(--dg-text)",marginTop:"1px"}}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginLeft:"auto",display:"flex",gap:"12px",flexWrap:"wrap",alignItems:"center"}}>
                      {profile.projected && <span style={{background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.2)",borderRadius:"5px",padding:"3px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",fontWeight:600}}>{profile.projected}</span>}
                      {profile.comp && (
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",color:"var(--dg-text-faint)",letterSpacing:"1px"}}>NFL COMP</div>
                          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"#f59e0b"}}>{profile.comp}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {profile.summary && <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)",lineHeight:1.6,margin:"0 0 10px"}}>{profile.summary}</p>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                    {profile.pros && (
                      <div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#22c55e",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Strengths</div>
                        {profile.pros.slice(0,3).map((pro,i)=><div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",lineHeight:1.5}}>+ {pro}</div>)}
                      </div>
                    )}
                    {profile.cons && (
                      <div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#ef4444",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>Weaknesses</div>
                        {profile.cons.slice(0,3).map((con,i)=><div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",lineHeight:1.5}}>− {con}</div>)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

    {/* Team Profile Overlay */}
    {teamProfileOverlay && (
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"var(--dg-bg)",zIndex:500,overflowY:"auto"}}>
        <TeamPage abbr={teamProfileOverlay} setActivePage={()=>{}} navigateToTeam={(ab)=>setTeamProfileOverlay(ab)} onClose={()=>setTeamProfileOverlay(null)}/>
      </div>
    )}
    </>
  );
}

/* ───── Free Agency Page ───── */
function FreeAgencyPage({ navigateToTeam }) {
  const [activePos, setActivePos] = useState("ALL");
  const [search, setSearch] = useState("");
  const [expandedFA, setExpandedFA] = useState(null);
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("r");
  const [sortDir, setSortDir] = useState("asc");
  const PER_PAGE = 50;

  const FA_POSITIONS = ["QB","RB","WR","TE","OT","IOL","DL","EDGE","LB","CB","S","K","P"];

  useEffect(()=>{ setPage(0); },[activePos, search, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir(field === "r" ? "asc" : field === "aav" ? "desc" : "asc");
    }
  };

  const filtered = useMemo(()=>{
    let list = [...FREE_AGENTS];
    if (activePos !== "ALL") list = list.filter(p=>p.p===activePos);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p=>p.n.toLowerCase().includes(q)||p.tm.toLowerCase().includes(q)||p.p.toLowerCase().includes(q));
    }
    list.sort((a,b)=>{
      let av, bv;
      if (sortField === "r") { av = a.r; bv = b.r; }
      else if (sortField === "n") { av = a.n.toLowerCase(); bv = b.n.toLowerCase(); }
      else if (sortField === "p") { av = a.p; bv = b.p; }
      else if (sortField === "age") { av = a.age; bv = b.age; }
      else if (sortField === "aav") { av = a.aav; bv = b.aav; }
      else { av = a.r; bv = b.r; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  },[activePos,search,sortField,sortDir]);

  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const pageData = filtered.slice(page*PER_PAGE,(page+1)*PER_PAGE);

  // Position counts
  const posCounts = useMemo(()=>{
    const m = {};
    FREE_AGENTS.forEach(p=>{m[p.p]=(m[p.p]||0)+1;});
    return m;
  },[]);

  // Top AAV for scale
  const maxAAV = useMemo(()=> Math.max(...FREE_AGENTS.map(p=>p.aav)), []);

  return (
    <div className="page-content" style={{maxWidth:"960px",margin:"0 auto",padding:"16px 24px 40px"}}>
      {/* Hero */}
      <div style={{
        background:"linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(27,42,74,0.5) 50%, rgba(249,115,22,0.04) 100%)",
        border:"1px solid rgba(249,115,22,0.15)",borderRadius:"16px",
        padding:"32px",marginBottom:"20px",textAlign:"center",
      }}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#f97316",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>2026 NFL</div>
        <h2 style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(28px,5vw,42px)",fontWeight:700,color:"var(--dg-text)",margin:"0 0 8px",letterSpacing:"1px",textTransform:"uppercase"}}>Free Agency</h2>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",color:"var(--dg-text-dim)",maxWidth:"500px",margin:"0 auto",lineHeight:1.6}}>
          Top {FREE_AGENTS.length} free agents ranked by projected market value.
        </p>
        <div style={{display:"flex",justifyContent:"center",gap:"24px",marginTop:"16px",flexWrap:"wrap"}}>
          {[
            {label:"Total FAs",value:FREE_AGENTS.length},
            {label:"Positions",value:Object.keys(posCounts).length},
            {label:"Top AAV",value:`$${maxAAV}M`},
          ].map(s=>(
            <div key={s.label}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:"#f97316"}}>{s.value}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Position filter */}
      <div className="pos-filter" style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"12px",padding:"10px 14px",background:"var(--dg-card)",border:"1px solid var(--dg-card-border)",borderRadius:"10px"}}>
        <button onClick={()=>setActivePos("ALL")} style={{
          background:activePos==="ALL"?"#f97316":"transparent",
          color:activePos==="ALL"?"#fff":"var(--dg-text-muted)",
          border:"none",borderRadius:"4px",padding:"5px 10px",cursor:"pointer",
          fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:600,letterSpacing:"0.5px",
        }}>ALL ({FREE_AGENTS.length})</button>
        {FA_POSITIONS.filter(pos=>posCounts[pos]).map(pos=>{
          const pc = POS_COLORS[pos]||{bg:"#555",text:"#fff"};
          const active = activePos===pos;
          return (
            <button key={pos} onClick={()=>setActivePos(pos)} style={{
              background:active?pc.bg:"transparent",
              color:active?pc.text:"var(--dg-text-muted)",
              border:"none",borderRadius:"4px",padding:"5px 10px",cursor:"pointer",
              fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:600,letterSpacing:"0.5px",
            }}>{pos} ({posCounts[pos]})</button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px",flexWrap:"wrap"}}>
        <div className="search-bar" style={{
          display:"flex",alignItems:"center",gap:"8px",flex:"1",minWidth:"200px",
          background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",
          borderRadius:"8px",padding:"8px 14px",
        }}>
          <SearchIcon/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search player, team, or position..."
            style={{background:"transparent",border:"none",outline:"none",color:"var(--dg-text)",fontSize:"13px",fontFamily:"'JetBrains Mono',monospace",width:"100%"}}
          />
          {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"var(--dg-text-dim)",cursor:"pointer",fontSize:"16px",padding:"0 4px"}}>×</button>}
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",whiteSpace:"nowrap"}}>
          {filtered.length} player{filtered.length!==1?"s":""}
        </div>
      </div>

      {/* Table Header */}
      <div className="table-header fa-table-header" style={{
        display:"grid",gridTemplateColumns:"60px 52px 1fr 60px 90px",
        gap:"12px",padding:"8px 20px",
        borderBottom:"1px solid rgba(249,115,22,0.2)",
        fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",
        letterSpacing:"1px",textTransform:"uppercase",
      }}>
        {[{k:"r",label:"RANK"},{k:"p",label:"POS"},{k:"n",label:"PLAYER"},{k:"age",label:"AGE",align:"center"},{k:"aav",label:"PROJ AAV",align:"right"}].map(col=>(
          <div key={col.k} onClick={()=>handleSort(col.k)} style={{cursor:"pointer",textAlign:col.align||"left",display:"flex",alignItems:"center",gap:"3px",justifyContent:col.align==="right"?"flex-end":col.align==="center"?"center":"flex-start",userSelect:"none"}}>
            {col.label}
            <span style={{fontSize:"8px",opacity:sortField===col.k?1:0.3}}>{sortField===col.k?(sortDir==="asc"?"▲":"▼"):"▲"}</span>
          </div>
        ))}
      </div>

      {/* Rows */}
      <div>
        {pageData.map((fa, i) => {
          const pc = POS_COLORS[fa.p]||{bg:"#555",text:"#fff"};
          const expanded = expandedFA === fa.r;
          const aavPct = (fa.aav / maxAAV) * 100;
          return (
            <div key={fa.r}>
              <div
                onClick={()=>setExpandedFA(expanded?null:fa.r)}
                style={{
                  display:"grid",gridTemplateColumns:"60px 52px 1fr 60px 90px",
                  alignItems:"center",gap:"12px",padding:"12px 20px",
                  background:expanded?"rgba(249,115,22,0.06)":i%2===0?"transparent":"var(--dg-row-alt)",
                  borderBottom:expanded?"none":"1px solid var(--dg-divider)",
                  cursor:"pointer",transition:"background 0.15s",
                }}
                onMouseEnter={e=>{if(!expanded)e.currentTarget.style.background="rgba(249,115,22,0.04)";}}
                onMouseLeave={e=>{if(!expanded)e.currentTarget.style.background=i%2===0?"transparent":"var(--dg-row-alt)";}}
              >
                <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                  <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,color:"#f97316"}}>{fa.r}</span>
                </div>
                <span style={{background:pc.bg,color:pc.text,padding:"3px 8px",borderRadius:"4px",fontSize:"10px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",textAlign:"center",minWidth:"40px",display:"inline-block"}}>{fa.p}</span>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,color:"var(--dg-text)",letterSpacing:"0.3px"}}>{fa.n}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:"1px"}}>
                    <span style={{width:"22px",height:"14px",borderRadius:"2px",background:TEAM_COLORS[fa.tm]||"#333",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",fontWeight:700,color:"#fff"}}>{fa.tm}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)"}}>{TEAM_INFO[fa.tm]?.name||fa.tm}</span>
                  </div>
                </div>
                <div style={{textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-muted)"}}>{fa.age}</div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:fa.aav>=20?"#f97316":fa.aav>=10?"#f59e0b":"var(--dg-text-muted)"}}>${fa.aav}M</div>
                  <div style={{height:"3px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",marginTop:"3px",overflow:"hidden"}}>
                    <div style={{width:`${aavPct}%`,height:"100%",background:fa.aav>=20?"#f97316":fa.aav>=10?"#f59e0b":"var(--dg-text-faint)",borderRadius:"2px"}}/>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded && (
                  <div style={{
                  padding:"16px 20px",background:"rgba(249,115,22,0.03)",
                  borderBottom:"1px solid var(--dg-card-border)",
                  borderLeft:"3px solid #f97316",
                }}>
                  <div style={{display:"flex",gap:"20px",flexWrap:"wrap",marginBottom:"12px"}}>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"3px"}}>2025 Stats</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-muted)"}}>{fa.stats}</div>
                    </div>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"3px"}}>Projected AAV</div>
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"#f97316"}}>${fa.aav}M/yr</div>
                    </div>
                  </div>
                  {fa.note && (
                    <div style={{marginBottom:"12px"}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"3px"}}>Scouting Notes</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)",lineHeight:1.6}}>{fa.note}</div>
                    </div>
                  )}
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-faint)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Projected Landing Spots</div>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                      {fa.tags.filter(t=>t!=="RETIRE"&&t!=="RETIRED").map(tm=>(
                        <span key={tm} onClick={navigateToTeam?()=>navigateToTeam(tm):undefined} style={{
                          display:"inline-flex",alignItems:"center",gap:"5px",
                          background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",
                          borderRadius:"6px",padding:"4px 10px",cursor:navigateToTeam?"pointer":"default",
                          transition:"all 0.15s",
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(249,115,22,0.3)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--dg-card-border2)";}}
                        >
                          <span style={{width:"20px",height:"13px",borderRadius:"2px",background:TEAM_COLORS[tm]||"#333",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",fontWeight:700,color:"#fff"}}>{tm}</span>
                          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"var(--dg-text)"}}>{TEAM_INFO[tm]?.name?.split(" ").pop()||tm}</span>
                        </span>
                      ))}
                      {fa.tags.includes("RETIRE") && (
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",padding:"4px 10px",border:"1px dashed var(--dg-card-border2)",borderRadius:"6px"}}>Possible Retirement</span>
                      )}
                      {fa.tags.includes("RETIRED") && (
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",padding:"4px 10px",border:"1px dashed var(--dg-card-border2)",borderRadius:"6px"}}>Retired</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages>1 && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginTop:"20px"}}>
          <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0} style={{
            background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",
            borderRadius:"6px",padding:"8px 16px",cursor:page===0?"default":"pointer",
            color:page===0?"var(--dg-text-ghost)":"var(--dg-text)",fontFamily:"'Oswald',sans-serif",fontSize:"13px",
            letterSpacing:"0.5px",opacity:page===0?0.4:1,
          }}>← PREV</button>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--dg-text-dim)",padding:"8px 16px"}}>
            {page*PER_PAGE+1}–{Math.min((page+1)*PER_PAGE,filtered.length)} of {filtered.length}
          </div>
          <button onClick={()=>setPage(Math.min(totalPages-1,page+1))} disabled={page>=totalPages-1} style={{
            background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",
            borderRadius:"6px",padding:"8px 16px",cursor:page>=totalPages-1?"default":"pointer",
            color:page>=totalPages-1?"var(--dg-text-ghost)":"var(--dg-text)",fontFamily:"'Oswald',sans-serif",fontSize:"13px",
            letterSpacing:"0.5px",opacity:page>=totalPages-1?0.4:1,
          }}>NEXT →</button>
        </div>
      )}
    </div>
  );
}

/* ───── Prospect Comparison Overlay ───── */
function CompareOverlay({ players, onClose, onUpdate }) {
  const [addSearch, setAddSearch] = useState("");
  const count = players.length;

  const searchResults = addSearch.trim().length > 1
    ? PLAYERS.filter(p => !players.some(s=>s.r===p.r) && (p.n.toLowerCase().includes(addSearch.toLowerCase()) || p.s.toLowerCase().includes(addSearch.toLowerCase()))).slice(0, 6)
    : [];

  const removePlayer = (idx) => {
    if (players.length <= 2) return;
    onUpdate(players.filter((_,i)=>i!==idx));
  };

  const addPlayer = (p) => {
    if (players.length >= 3) return;
    onUpdate([...players, p]);
    setAddSearch("");
  };

  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"var(--dg-bg)",zIndex:400,overflowY:"auto"}}>
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"20px 24px 60px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px",flexWrap:"wrap",gap:"10px"}}>
          <div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Prospect Comparison</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-dim)",marginTop:"2px"}}>{count} prospects · Side-by-side analysis</div>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            {players.length < 3 && (
              <div style={{position:"relative"}}>
                <input value={addSearch} onChange={e=>setAddSearch(e.target.value)} placeholder="Add player..." style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"6px",padding:"6px 10px",color:"var(--dg-text)",fontSize:"11px",fontFamily:"'JetBrains Mono',monospace",width:"160px",outline:"none"}}/>
                {searchResults.length > 0 && (
                  <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#1a2332",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"6px",marginTop:"4px",zIndex:10,maxHeight:"200px",overflowY:"auto"}}>
                    {searchResults.map(p => {
                      const pc = POS_COLORS[p.p]||{bg:"#555",text:"#fff"};
                      return (
                        <div key={p.r} onClick={()=>addPlayer(p)} style={{display:"flex",alignItems:"center",gap:"6px",padding:"6px 10px",cursor:"pointer",borderBottom:"1px solid var(--dg-divider)"}}
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(45,212,191,0.08)";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
                        >
                          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",fontWeight:700,color:"#2dd4bf"}}>#{p.r}</span>
                          <span style={{background:pc.bg,color:pc.text,padding:"1px 4px",borderRadius:"2px",fontSize:"8px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{p.p}</span>
                          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text)"}}>{p.n}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--dg-text-dim)",marginLeft:"auto"}}>{p.s}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <button onClick={onClose} style={{background:"var(--dg-input)",border:"1px solid var(--dg-card-border2)",borderRadius:"8px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"var(--dg-text-muted)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Close</button>
          </div>
        </div>

        {/* Player Headers */}
        <div style={{display:"grid",gridTemplateColumns:`200px repeat(${count}, 1fr)`,gap:"0",marginBottom:"0"}}>
          <div/>
          {players.map((p, idx) => {
            const pc = POS_COLORS[p.p]||{bg:"#555",text:"#fff"};
            const profile = PROFILES[p.n];
            return (
              <div key={p.r} style={{
                background:`linear-gradient(180deg, ${pc.bg}22 0%, transparent 100%)`,
                borderTop:`3px solid ${pc.bg}`,
                borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                padding:"20px 16px",textAlign:"center",
              }}>
                {players.length > 2 && (
                  <button onClick={()=>removePlayer(idx)} style={{position:"relative",float:"right",background:"none",border:"none",color:"var(--dg-text-faint)",cursor:"pointer",fontSize:"14px"}}>×</button>
                )}
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#2dd4bf",letterSpacing:"1px",marginBottom:"4px"}}>#{p.r} OVERALL</div>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"var(--dg-text)",letterSpacing:"0.5px",lineHeight:1.2,marginBottom:"4px"}}>{p.n}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",marginBottom:"4px"}}>
                  <span style={{background:pc.bg,color:pc.text,padding:"2px 8px",borderRadius:"3px",fontSize:"10px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{p.p}</span>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)"}}>{p.s}</div>
                {profile && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-faint)",marginTop:"4px"}}>{profile.projected}</div>}
              </div>
            );
          })}
        </div>

        {/* Comparison Rows */}
        {(() => {
          const profiles = players.map(p => PROFILES[p.n]);
          const hasAnyProfile = profiles.some(p => p);

          const rows = [
            {label:"Age",values:profiles.map(p=>p?.age||"—")},
            {label:"Height",values:profiles.map(p=>p?.height||"—")},
            {label:"Weight",values:profiles.map(p=>p?.weight ? `${p.weight} lbs` : "—")},
            {label:"Class",values:profiles.map(p=>p?.class||"—")},
            {label:"Draft Range",values:profiles.map(p=>p?.projected||"—")},
            {label:"NFL Comparison",values:profiles.map(p=>p?.comp||"—"),highlight:true},
          ];

          return (
            <div style={{border:"1px solid var(--dg-card-border)",borderRadius:"0 0 12px 12px",overflow:"hidden"}}>
              {/* Bio stats */}
              {rows.map((row, ri) => (
                <div key={row.label} style={{
                  display:"grid",gridTemplateColumns:`200px repeat(${count}, 1fr)`,
                  background: ri % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  borderBottom:"1px solid var(--dg-divider)",
                }}>
                  <div style={{padding:"10px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase",display:"flex",alignItems:"center"}}>{row.label}</div>
                  {row.values.map((val, vi) => (
                    <div key={vi} style={{padding:"10px 16px",borderLeft:"1px solid var(--dg-card-border)",fontFamily:row.highlight?"'Oswald',sans-serif":"'JetBrains Mono',monospace",fontSize:row.highlight?"14px":"12px",color:row.highlight?"#f59e0b":"#f1f5f9",fontWeight:row.highlight?600:400,display:"flex",alignItems:"center"}}>{val}</div>
                  ))}
                </div>
              ))}

              {/* Scouting Summary */}
              <div style={{display:"grid",gridTemplateColumns:`200px repeat(${count}, 1fr)`,borderBottom:"1px solid var(--dg-divider)",background:"var(--dg-row-alt)"}}>
                <div style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-dim)",letterSpacing:"0.5px",textTransform:"uppercase"}}>Scouting Report</div>
                {profiles.map((prof, vi) => (
                  <div key={vi} style={{padding:"12px 16px",borderLeft:"1px solid var(--dg-card-border)",fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)",lineHeight:1.5}}>{prof?.summary || "No scouting report available"}</div>
                ))}
              </div>

              {/* Strengths */}
              <div style={{display:"grid",gridTemplateColumns:`200px repeat(${count}, 1fr)`,borderBottom:"1px solid var(--dg-divider)"}}>
                <div style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#22c55e",letterSpacing:"0.5px",textTransform:"uppercase"}}>Strengths</div>
                {profiles.map((prof, vi) => (
                  <div key={vi} style={{padding:"12px 16px",borderLeft:"1px solid var(--dg-card-border)"}}>
                    {(prof?.pros || []).map((pro, pi) => (
                      <div key={pi} style={{display:"flex",alignItems:"flex-start",gap:"6px",marginBottom:"6px"}}>
                        <span style={{color:"#22c55e",fontSize:"10px",marginTop:"2px",flexShrink:0}}>+</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)",lineHeight:1.4}}>{pro}</span>
                      </div>
                    ))}
                    {!prof && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-ghost)"}}>No data</span>}
                  </div>
                ))}
              </div>

              {/* Weaknesses */}
              <div style={{display:"grid",gridTemplateColumns:`200px repeat(${count}, 1fr)`,borderBottom:"1px solid var(--dg-divider)",background:"var(--dg-row-alt)"}}>
                <div style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#ef4444",letterSpacing:"0.5px",textTransform:"uppercase"}}>Weaknesses</div>
                {profiles.map((prof, vi) => (
                  <div key={vi} style={{padding:"12px 16px",borderLeft:"1px solid var(--dg-card-border)"}}>
                    {(prof?.cons || []).map((con, ci) => (
                      <div key={ci} style={{display:"flex",alignItems:"flex-start",gap:"6px",marginBottom:"6px"}}>
                        <span style={{color:"#ef4444",fontSize:"10px",marginTop:"2px",flexShrink:0}}>−</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-muted)",lineHeight:1.4}}>{con}</span>
                      </div>
                    ))}
                    {!prof && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--dg-text-ghost)"}}>No data</span>}
                  </div>
                ))}
              </div>

              {/* Consensus rank comparison bar */}
              <div style={{display:"grid",gridTemplateColumns:`200px repeat(${count}, 1fr)`,background:"rgba(45,212,191,0.04)"}}>
                <div style={{padding:"14px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",letterSpacing:"0.5px",textTransform:"uppercase"}}>Consensus Rank</div>
                {players.map((p, vi) => {
                  const maxRank = Math.max(...players.map(pl=>pl.r));
                  return (
                    <div key={vi} style={{padding:"14px 16px",borderLeft:"1px solid var(--dg-card-border)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"22px",fontWeight:700,color:"#2dd4bf"}}>#{p.r}</span>
                      </div>
                      <div style={{height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",marginTop:"6px",overflow:"hidden"}}>
                        <div style={{width:`${Math.max(5,100 - ((p.r/Math.max(maxRank,100))*100))}%`,height:"100%",background:"#2dd4bf",borderRadius:"2px"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        <div style={{marginTop:"16px",textAlign:"center"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--dg-text-ghost)"}}>
            DRAFT GUIDE © 2026 · draft-guide.com · @DraftGuide_
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── Main App ───── */
const HASH_TO_PAGE = {"":"HOME","#/board":"BIG BOARD","#/mock":"MOCK DRAFT"};
const PAGE_TO_HASH = {"HOME":"","BIG BOARD":"#/board","MOCK DRAFT":"#/mock"};

export default function App() {
  const [activePage, setActivePage] = useState("HOME");
  const [teamPageAbbr, setTeamPageAbbr] = useState(null);
  const [comparePlayers, setComparePlayers] = useState(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("dg-theme") || "dark"; } catch { return "dark"; }
  });

  const isDark = theme === "dark";

  // Persist theme
  useEffect(() => {
    try { localStorage.setItem("dg-theme", theme); } catch {}
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = isDark ? "#0c1222" : "#f8fafc";
    document.body.style.color = isDark ? "#f1f5f9" : "#1e293b";
  }, [theme, isDark]);

  // Hash-based routing for ALL pages
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      // Team pages
      const teamMatch = hash.match(/^#\/team\/([A-Z]{2,3})$/i);
      if (teamMatch) {
        const abbr = teamMatch[1].toUpperCase();
        if (TEAM_INFO[abbr]) {
          setTeamPageAbbr(abbr);
          setActivePage("TEAM");
          return;
        }
      }
      // Standard pages
      const page = HASH_TO_PAGE[hash];
      if (page !== undefined) {
        setActivePage(page);
        setTeamPageAbbr(null);
        return;
      }
      // Unknown hash — go home
      setActivePage("HOME");
      setTeamPageAbbr(null);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigateToTeam = (abbr) => {
    window.location.hash = `/team/${abbr}`;
    setTeamPageAbbr(abbr);
    setActivePage("TEAM");
    window.scrollTo(0, 0);
  };

  const handleSetPage = (page) => {
    const hash = PAGE_TO_HASH[page];
    if (hash !== undefined) {
      window.location.hash = hash;
    } else if (page !== "TEAM") {
      window.location.hash = "";
    }
    if (page !== "TEAM") setTeamPageAbbr(null);
    setActivePage(page);
    window.scrollTo(0, 0);
  };

  // Theme colors
  const t = isDark ? {
    bg: "#0c1222", headerBg: "#0c1222", headerBorder: "rgba(255,255,255,0.06)",
    headerShadow: "none", text: "#f1f5f9", textMuted: "var(--dg-text-muted)", textDim: "#64748b",
    textFaint: "#475569", textGhost: "#334155", navActive: "#f1f5f9", navInactive: "#64748b",
    navActiveBg: "rgba(45,212,191,0.08)", cardBg: "rgba(255,255,255,0.02)",
    cardBorder: "rgba(255,255,255,0.06)", rowAlt: "rgba(255,255,255,0.015)",
    logo: "/logo-light.png",
  } : {
    bg: "#f8fafc", headerBg: "#ffffff", headerBorder: "#e5e7eb",
    headerShadow: "0 1px 3px rgba(0,0,0,0.08)", text: "#1e293b", textMuted: "#475569",
    textDim: "#64748b", textFaint: "var(--dg-text-muted)", textGhost: "#cbd5e1", navActive: "#1B2A4A",
    navInactive: "var(--dg-text-muted)", navActiveBg: "rgba(27,42,74,0.08)", cardBg: "rgba(0,0,0,0.02)",
    cardBorder: "rgba(0,0,0,0.08)", rowAlt: "rgba(0,0,0,0.02)",
    logo: "/logo.png",
  };

  return (
    <div style={{minHeight:"100vh",background:t.bg,transition:"background 0.2s"}}>
      {/* ── Sticky Header ── */}
      <header className="site-header" style={{
        background:t.headerBg,
        borderBottom:`1px solid ${t.headerBorder}`,
        padding:"0 24px",position:"sticky",top:0,zIndex:100,
        boxShadow:t.headerShadow,
        transition:"background 0.2s, border-color 0.2s",
      }}>
        <div style={{
          maxWidth:"960px",margin:"0 auto",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          height:"60px",
        }}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:"12px",cursor:"pointer"}}
            onClick={()=>handleSetPage("HOME")}>
            <img src={t.logo} alt="Draft Guide" style={{
              height:"36px",width:"auto",flexShrink:0,
            }}/>
            <div className="logo-text">
              <div style={{
                fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,
                color:t.text,letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.1,
                transition:"color 0.2s",
              }}>Draft Guide</div>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",
                letterSpacing:"1.5px",textTransform:"uppercase",
              }}>2026 NFL Draft</div>
            </div>
          </div>

          {/* Main Nav + Theme Toggle */}
          <nav style={{display:"flex",gap:"4px",alignItems:"center"}}>
            {PAGES.map(pg=>{
              const active = activePage===pg;
              return (
                <button className="nav-btn" key={pg} onClick={()=>handleSetPage(pg)} style={{
                  background: active ? t.navActiveBg : "transparent",
                  color: active ? t.navActive : t.navInactive,
                  border:"none",
                  borderBottom: active ? "2px solid #2dd4bf" : "2px solid transparent",
                  padding:"18px 20px",cursor:"pointer",
                  fontFamily:"'Oswald',sans-serif",fontSize:"13px",
                  fontWeight: active ? 600 : 400,letterSpacing:"1px",
                  textTransform:"uppercase",whiteSpace:"nowrap",
                  transition:"all 0.15s ease",
                }}>
                  {pg}
                </button>
              );
            })}
            <button className="theme-toggle" onClick={()=>setTheme(isDark?"light":"dark")} title={isDark?"Switch to light mode":"Switch to dark mode"} style={{
              background:"transparent",border:"none",cursor:"pointer",
              padding:"8px",marginLeft:"8px",borderRadius:"6px",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"background 0.15s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ── Page Content ── */}
      {activePage==="HOME" && <HomePage setPage={handleSetPage} navigateToTeam={navigateToTeam}/>}
      {activePage==="BIG BOARD" && <BigBoardPage navigateToTeam={navigateToTeam} openCompare={setComparePlayers}/>}
      {activePage==="MOCK DRAFT" && <MockDraftPage/>}
      {activePage==="TEAM" && teamPageAbbr && <TeamPage abbr={teamPageAbbr} setActivePage={handleSetPage} navigateToTeam={navigateToTeam}/>}

      {/* ── Compare Overlay ── */}
      {comparePlayers && <CompareOverlay players={comparePlayers} onClose={()=>setComparePlayers(null)} onUpdate={setComparePlayers}/>}

      {/* ── Footer ── */}
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"0 24px 40px"}}>
        <div style={{
          borderTop:`1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"}`,
          paddingTop:"16px",textAlign:"center",
          fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",
          color:t.textGhost,letterSpacing:"0.5px",
          transition:"color 0.2s",
        }}>
          DRAFT GUIDE © 2026 · draft-guide.com
        </div>
      </div>
    </div>
  );
}
