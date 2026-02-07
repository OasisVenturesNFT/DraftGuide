import { useState, useMemo, useEffect } from "react";
import PLAYERS from "./players.js";
import PROFILES from "./profiles.js";

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

function PlayerRow({ player, posRank, index, isPositionView, expanded, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const profile = PROFILES[player.n];
  const hasProfile = !!profile;

  return (
    <div>
      <div
        className="player-row"
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        onClick={()=>{ if(hasProfile && onToggle) onToggle(player.r); }}
        style={{
          display:"grid",
          gridTemplateColumns:"70px 52px 1fr 1fr",
          alignItems:"center",gap:"12px",padding:"12px 20px",
          background: expanded ? "rgba(45,212,191,0.08)" : hovered ? "rgba(45,212,191,0.06)" : index%2===0 ? "transparent" : "rgba(255,255,255,0.015)",
          borderBottom: expanded ? "none" : "1px solid rgba(255,255,255,0.04)",
          transition:"background 0.15s ease",
          cursor: hasProfile ? "pointer" : "default",
        }}
      >
        {/* Rank */}
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <span className="rank-number" style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,
            color:"#2dd4bf",lineHeight:1,minWidth:"32px",textAlign:"right",
          }}>#{isPositionView ? posRank : player.r}</span>
          {!isPositionView && posRank && (
            <span className="rank-badge" style={{
              fontSize:"10px",color:"#64748b",fontFamily:"'JetBrains Mono',monospace",
              background:"rgba(45,212,191,0.08)",padding:"2px 6px",borderRadius:"3px",
            }}>P{posRank}</span>
          )}
          {isPositionView && (
            <span className="rank-badge" style={{
              fontSize:"10px",color:"#64748b",fontFamily:"'JetBrains Mono',monospace",
              background:"rgba(45,212,191,0.08)",padding:"2px 6px",borderRadius:"3px",
            }}>#{player.r}</span>
          )}
        </div>
        <PosBadge pos={player.p} />
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div className="player-name" style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:500,
            color:"#f1f5f9",letterSpacing:"0.2px",
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
          fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",
          color:"#94a3b8",textAlign:"right",
        }}>
          {player.s}
          {isPositionView && (
            <span style={{marginLeft:"12px",color:"#475569",fontSize:"11px"}}>OVR #{player.r}</span>
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
            borderBottom:"1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
              {[
                {label:"AGE",value:profile.age},
                {label:"HT",value:profile.height},
                {label:"WT",value:`${profile.weight} lbs`},
                {label:"CLASS",value:profile.class},
              ].map(stat=>(
                <div key={stat.label} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>{stat.label}</div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:"#f1f5f9",marginTop:"1px"}}>{stat.value}</div>
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
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#475569",letterSpacing:"1px"}}>NFL COMP</div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:"#f59e0b"}}>{profile.comp}</div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <p style={{
            fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#94a3b8",
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
      color: active ? (isAll ? "#0c1222" : (POS_COLORS[pos]?.text || "#fff")) : "#94a3b8",
      border: active ? "none" : "1px solid rgba(255,255,255,0.06)",
      borderRadius:"6px",padding:"6px 12px",cursor:"pointer",
      fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,
      letterSpacing:"0.5px",transition:"all 0.15s ease",whiteSpace:"nowrap",
    };
  };

  return (
    <div className="pos-filter" style={{
      display:"flex",flexDirection:"column",gap:"10px",
      background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:"10px",padding:"14px 16px",marginBottom:"16px",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
        <button className="pos-filter-btn" onClick={()=>setActivePos("ALL")} style={btnStyle("ALL")}>ALL</button>
        <div className="pos-divider" style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",
          letterSpacing:"1.5px",textTransform:"uppercase",marginRight:"2px",
        }}>OFF</span>
        {OFF_POSITIONS.map(pos=>(
          <button className="pos-filter-btn" key={pos} onClick={()=>setActivePos(activePos===pos?"ALL":pos)} style={btnStyle(pos)}>{pos}</button>
        ))}
        <div className="pos-divider" style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",
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
function HomePage({ setPage }) {
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
        borderBottom:"1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          {[
            {label:"AGE",value:profile.age},
            {label:"HT",value:profile.height},
            {label:"WT",value:`${profile.weight} lbs`},
            {label:"CLASS",value:profile.class},
          ].map(stat=>(
            <div key={stat.label} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#475569",letterSpacing:"1px"}}>{stat.label}</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"#f1f5f9",marginTop:"1px"}}>{stat.value}</div>
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
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#475569",letterSpacing:"1px"}}>NFL COMP</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"#f59e0b"}}>{profile.comp}</div>
            </div>
          )}
        </div>
      </div>
      <p style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#94a3b8",
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
          color:"#f1f5f9",margin:"0 0 8px",letterSpacing:"1px",textTransform:"uppercase",
        }}>Consensus Big Board</h2>
        <p style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",color:"#64748b",
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
      </div>

      {/* Two-column: Top 10 + Position Leaders */}
      <div className="home-grid" style={{
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",marginBottom:"32px",
      }}>
        {/* Top 10 Overall */}
        <div style={{
          background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:"12px",padding:"20px",
        }}>
          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",
          }}>
            <h3 style={{
              fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,
              color:"#f1f5f9",letterSpacing:"0.5px",textTransform:"uppercase",margin:0,
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
                    color:"#f1f5f9",flex:1,
                  }}>{p.n}</span>
                  {profile && (
                    <span style={{
                      fontSize:"9px",color: isExpanded ? "#2dd4bf" : "#475569",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                      display:"inline-block",transition:"transform 0.2s, color 0.2s",marginRight:"4px",
                    }}>▼</span>
                  )}
                  <span style={{
                    fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b",
                  }}>{p.s}</span>
                </div>
                {isExpanded && profile && renderProfile(profile)}
                {(i<9 && !isExpanded) && <div style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}/>}
              </div>
            );
          })}
        </div>

        {/* Position Leaders */}
        <div style={{
          background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:"12px",padding:"20px",
        }}>
          <h3 style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,
            color:"#f1f5f9",letterSpacing:"0.5px",textTransform:"uppercase",
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
                    color:"#f1f5f9",flex:1,
                  }}>{p.n}</span>
                  {profile && (
                    <span style={{
                      fontSize:"9px",color: isExpanded ? "#2dd4bf" : "#475569",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                      display:"inline-block",transition:"transform 0.2s, color 0.2s",
                    }}>▼</span>
                  )}
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b"}}>{p.s}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#475569"}}>#{p.r}</span>
                </div>
                {isExpanded && profile && renderProfile(profile)}
                {(i<arr.length-1 && !isExpanded) && <div style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}}>
        {[
          {label:"Total Prospects",value:PLAYERS.length},
          {label:"Expert Sources",value:92},
          {label:"Positions Tracked",value:11},
        ].map(stat=>(
          <div key={stat.label} style={{
            background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:"10px",padding:"20px",textAlign:"center",
          }}>
            <div className="stat-value" style={{
              fontFamily:"'Oswald',sans-serif",fontSize:"32px",fontWeight:700,
              color:"#2dd4bf",lineHeight:1,
            }}>{stat.value}</div>
            <div style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b",
              letterSpacing:"1px",textTransform:"uppercase",marginTop:"6px",
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── Big Board Page ───── */
function BigBoardPage() {
  const [activePos, setActivePos] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
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
            <div className="pos-hero-name" style={{fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:700,color:"#f1f5f9",letterSpacing:"0.5px"}}>
              {posTopPlayer.n}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#94a3b8",marginTop:"2px"}}>
              {posTopPlayer.s}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="pos-hero-big" style={{fontFamily:"'Oswald',sans-serif",fontSize:"42px",fontWeight:700,color:"rgba(45,212,191,0.2)",lineHeight:1}}>
              {activePos}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b",marginTop:"2px"}}>
              {filtered.length} prospects
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px",flexWrap:"wrap"}}>
        <div className="search-bar" style={{
          display:"flex",alignItems:"center",gap:"8px",flex:"1",minWidth:"200px",
          background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"8px",padding:"8px 14px",
        }}>
          <SearchIcon/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search player, school, or position..."
            style={{
              background:"transparent",border:"none",outline:"none",
              color:"#f1f5f9",fontSize:"13px",fontFamily:"'JetBrains Mono',monospace",width:"100%",
            }}
          />
          {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:"16px",padding:"0 4px"}}>×</button>}
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b",whiteSpace:"nowrap"}}>
          {filtered.length} player{filtered.length!==1?"s":""}
        </div>
      </div>

      {/* Table Header */}
      <div className="table-header" style={{
        display:"grid",gridTemplateColumns:"70px 52px 1fr 1fr",
        gap:"12px",padding:"8px 20px",
        borderBottom:"1px solid rgba(45,212,191,0.15)",
        fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569",
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
          />;
        })}
      </div>

      {/* Pagination */}
      {totalPages>1 && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginTop:"20px"}}>
          <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0} style={{
            background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"6px",padding:"8px 16px",cursor:page===0?"default":"pointer",
            color:page===0?"#334155":"#f1f5f9",fontFamily:"'Oswald',sans-serif",fontSize:"13px",
            letterSpacing:"0.5px",opacity:page===0?0.4:1,transition:"all 0.15s",
          }}>← PREV</button>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#64748b",padding:"8px 16px"}}>
            {page*PER_PAGE+1}–{Math.min((page+1)*PER_PAGE,filtered.length)} of {filtered.length}
          </div>
          <button onClick={()=>setPage(Math.min(totalPages-1,page+1))} disabled={page>=totalPages-1} style={{
            background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
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
  ARI:["QB","RB","G","T"],ATL:["WR","TE","DI","CB"],BAL:["WR","G","DL"],
  BUF:["WR","ED","LB","DB"],CAR:["WR","DL","LB"],CHI:["DL","LB","S"],
  CIN:["C","G","DI","S"],CLE:["QB","WR","G","T"],DAL:["RB","ED","LB","S"],
  DEN:["RB","TE","C","LB"],DET:["C","T","ED","CB"],GB:["T","DI","CB"],
  HOU:["RB","C","G","DI"],IND:["QB","DI","LB","S"],JAX:["C","G","DI","S"],
  KC:["RB","WR","G","T","DL"],LV:["QB","WR","G","T","DI","LB","CB"],
  LAC:["G","C","DL"],LAR:["QB","T","CB"],MIA:["QB","WR","G","CB"],
  MIN:["RB","C","DB"],NE:["G","T","ED","LB"],NO:["WR","G","DL"],
  NYG:["WR","G","T","CB"],NYJ:["QB","WR","DI","LB","CB"],
  PHI:["TE","G","ED","CB"],PIT:["QB","WR","T","DB"],
  SF:["WR","G","ED","S"],SEA:["RB","C","G","LB","CB"],
  TB:["TE","G","ED","LB","CB"],TEN:["RB","WR","C","G","ED","CB"],
  WAS:["TE","G","ED","LB","DB"],
};

const PICK_VALUES = {1:3000,2:2600,3:2200,4:1800,5:1700,6:1600,7:1500,8:1400,9:1350,10:1300,11:1250,12:1200,13:1150,14:1100,15:1050,16:1000,17:950,18:900,19:875,20:850,21:800,22:780,23:760,24:740,25:720,26:700,27:680,28:660,29:640,30:620,31:600,32:585,33:580,34:560,35:550,36:540,37:530,38:520,39:510,40:500,41:490,42:480,43:470,44:460,45:450,46:440,47:430,48:420,49:410,50:400,51:390,52:380,53:370,54:360,55:350,56:340,57:330,58:320,59:310,60:300,61:292,62:284,63:276,64:270,65:265,66:260,67:255,68:250,69:245,70:240,71:235,72:230,73:225,74:220,75:215,76:210,77:205,78:200,79:195,80:190,81:185,82:180,83:175,84:170,85:165,86:160,87:155,88:150,89:145,90:140,91:136,92:132,93:128,94:124,95:120,96:116,97:112,98:108,99:104,100:100,101:96,102:92,103:88,104:86,105:84,106:82,107:80,108:78,109:76,110:74,111:72,112:70,113:68,114:66,115:64,116:62,117:60,118:58,119:56,120:54,121:52,122:50,123:49,124:48,125:47,126:46,127:45,128:44,129:43,130:42,131:41,132:40,133:39.5,134:39,135:38.5,136:38,137:37.5,138:37,139:36.5,140:36,141:35.5,142:35,143:34.5,144:34,145:33.5,146:33,147:32.5,148:32,149:31.5,150:31,151:30.5,152:30,153:29.5,154:29,155:28.5,156:28,157:27.5,158:27,159:26.5,160:26,161:25.5,162:25,163:24.5,164:24,165:23.5,166:23,167:22.5,168:22,169:21.5,170:21,171:20.5,172:20,173:19.5,174:19,175:18.5,176:18,177:17.5,178:17,179:16.5,180:16,181:15.6,182:15.2,183:14.8,184:14.4,185:14,186:13.6,187:13.2,188:12.8,189:12.4,190:12,191:11.6,192:11.2,193:10.8,194:10.4,195:10,196:9.6,197:9.2,198:8.8,199:8.4,200:8,201:7.8,202:7.6,203:7.4,204:7.2,205:7,206:6.8,207:6.6,208:6.4,209:6.2,210:6,211:5.8,212:5.6,213:5.4,214:5.2,215:5,216:4.8,217:4.6,218:4.5,219:4.4,220:4.4,221:4.3,222:4.2,223:4.1,224:4,225:4,226:3.9,227:3.8,228:3.7,229:3.6,230:3.6,231:3.5,232:3.4,233:3.3,234:3.2,235:3.2,236:3.1,237:3,238:2.9,239:2.8,240:2.8,241:2.7,242:2.6,243:2.5,244:2.4,245:2.4,246:2.3,247:2.2,248:2.1,249:2,250:2,251:1.9,252:1.8,253:1.7,254:1.6,255:1.6,256:1.5,257:1.4};

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
  const [roundCompletePrompt, setRoundCompletePrompt] = useState(null); // round number that just ended

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

  const getAutoPick = (slotAbbr, currentPicks) => {
    const picked = new Set(Object.values(currentPicks).map(p=>p.r));
    const avail = PLAYERS.filter(p => !picked.has(p.r));
    const needs = TEAM_NEEDS[slotAbbr] || [];
    const mappedNeeds = needs.map(n => needsMapping[n] || n);
    const needMatch = avail.find(p => mappedNeeds.includes(p.p));
    return needMatch || avail[0];
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
        const ap = getAutoPick(own, tmpPicks);
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
      const autoPick = getAutoPick(owner, tmpPicks);
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
    if (autopickQueue.length === 0) {
      if (nextUserPick) {
        const nr = DRAFT_ORDER.find(s=>s.pick===nextUserPick)?.round || 1;
        // Check if we crossed into a new round
        if (fromRound && nr > fromRound) {
          setRoundCompletePrompt(fromRound);
        }
        setCurrentPick(nextUserPick);
        setActiveRound(nr);
      }
      return;
    }

    // Check if the auto-pick queue crosses a round boundary — if so, truncate and pause
    let truncatedQueue = autopickQueue;
    let truncatedNext = nextUserPick;
    if (fromRound) {
      const crossIdx = autopickQueue.findIndex(ap => {
        const r = DRAFT_ORDER.find(s=>s.pick===ap.pick)?.round || 1;
        return r > fromRound;
      });
      if (crossIdx >= 0) {
        // Truncate: only animate picks in the current round, then pause
        truncatedQueue = autopickQueue.slice(0, crossIdx);
        // The next pick after truncation is the first pick of the new round
        truncatedNext = autopickQueue[crossIdx].pick;
      }
    }

    if (truncatedQueue.length === 0) {
      // All auto-picks are in the next round — go straight to round prompt
      if (fromRound) setRoundCompletePrompt(fromRound);
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
            // Did we truncate due to round boundary?
            if (truncatedQueue.length < autopickQueue.length && fromRound) {
              setRoundCompletePrompt(fromRound);
              if (truncatedNext) {
                setCurrentPick(truncatedNext);
                const nr = DRAFT_ORDER.find(s=>s.pick===truncatedNext)?.round || 1;
                setActiveRound(nr);
              }
            } else if (truncatedNext) {
              const nr = DRAFT_ORDER.find(s=>s.pick===truncatedNext)?.round || 1;
              if (fromRound && nr > fromRound) {
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
          // Check if we crossed a round boundary
          const prevRound = DRAFT_ORDER.find(s=>s.pick===currentPick)?.round || 1;
          if (slot.round > prevRound && slot.round > draftRounds) return; // past scope
          if (slot.round > prevRound && slot.round <= draftRounds) {
            // Just finished a round - show prompt to continue or view results
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
    setDraftRounds(1);
    setRoundCompletePrompt(null);
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
        const autoPick = getAutoPick(slot.abbr, tmpPicks);
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
          <h2 style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(28px,5vw,42px)",fontWeight:700,color:"#f1f5f9",margin:"0 0 8px",letterSpacing:"1px",textTransform:"uppercase"}}>Mock Draft Simulator</h2>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",color:"#64748b",maxWidth:"500px",margin:"0 auto 20px",lineHeight:1.6}}>
            Build your own mock draft. Select from {PLAYERS.length} consensus-ranked prospects.
          </p>
          {/* Round Selector */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>Rounds</span>
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

        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",overflow:"hidden"}}>
          <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <h3 style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"#f1f5f9",letterSpacing:"0.5px",textTransform:"uppercase",margin:"0 0 4px"}}>{fullDraftToggle ? "Full Draft Mode" : "Choose Your Team"}</h3>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b",margin:0}}>{fullDraftToggle ? "You make every pick for all 32 teams" : "Draft for your team — AI handles the rest"}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"10px",flexShrink:0}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b",letterSpacing:"0.5px",textTransform:"uppercase"}}>Full Draft</span>
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
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#94a3b8",maxWidth:"400px",margin:"0 auto 24px",lineHeight:1.6}}>
                Take full control. You'll make all {lastPickInScope} selections across {draftRounds === 1 ? "Round 1" : draftRounds === 7 ? "7 rounds" : `${draftRounds} rounds`} — pick the best player for each team.
              </p>
              <button onClick={()=>startDraft("full", null)} style={{background:"#2dd4bf",color:"#0c1222",border:"none",borderRadius:"8px",padding:"14px 36px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase"}}>Start Full Draft →</button>
            </div>
          ) : (
            <div style={{padding:"16px 20px 24px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"12px"}}>
                {Object.entries(divisions).map(([divName, teams]) => (
                  <div key={divName}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px",paddingBottom:"6px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{divName}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                      {teams.map(abbr => {
                        const slot = DRAFT_ORDER.find(s=>s.abbr===abbr);
                        const shortName = slot ? slot.team.split(" ").pop() : abbr;
                        const totalTeamPicks = DRAFT_ORDER.filter(s=>s.abbr===abbr).length;
                        return (
                          <div key={abbr} onClick={()=>startDraft("team", abbr)}
                            style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 10px",borderRadius:"8px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",cursor:"pointer",transition:"all 0.15s"}}
                            onMouseEnter={e=>{e.currentTarget.style.background="rgba(45,212,191,0.08)";e.currentTarget.style.borderColor="rgba(45,212,191,0.2)";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor="rgba(255,255,255,0.04)";}}
                          >
                            <span style={{width:"32px",height:"20px",borderRadius:"4px",background:TEAM_COLORS[abbr]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fontWeight:700,color:"#fff",letterSpacing:"0.3px",flexShrink:0}}>{abbr}</span>
                            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:500,color:"#f1f5f9",flex:1}}>{shortName}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569"}}>{totalTeamPicks} picks</span>
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
    <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0"}}>
      {/* Draft header bar */}
      <div style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
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
            <span style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"3px 10px"}}>
              <span style={{width:"22px",height:"14px",borderRadius:"3px",background:TEAM_COLORS[userTeam]||"#333",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",fontWeight:700,color:"#fff"}}>{userTeam}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#94a3b8"}}>{userTeamSlot.team}</span>
            </span>
          )}
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b"}}>{picksCount}/{lastPickInScope}</span>
          <div style={{width:"80px",height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{width:`${(picksCount/lastPickInScope)*100}%`,height:"100%",background:"#2dd4bf",borderRadius:"2px",transition:"width 0.3s ease"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={resetDraft} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"6px 14px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#94a3b8",letterSpacing:"0.5px",textTransform:"uppercase"}}>Reset</button>
          <button onClick={exitToModal} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"6px 14px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#94a3b8",letterSpacing:"0.5px",textTransform:"uppercase"}}>Exit</button>
        </div>
      </div>

      {/* Round Complete Prompt */}
      {roundCompletePrompt && !draftComplete && (
        <div style={{background:"rgba(45,212,191,0.06)",border:"1px solid rgba(45,212,191,0.15)",margin:"0",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px",borderBottom:"1px solid rgba(45,212,191,0.1)"}}>
          <div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:700,color:"#2dd4bf",letterSpacing:"0.5px",textTransform:"uppercase"}}>Round {roundCompletePrompt} Complete</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b",marginTop:"2px"}}>{roundCompletePrompt < 7 ? `Continue to Round ${roundCompletePrompt + 1} or view your results` : "All rounds complete"}</div>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={()=>{setShowResults(true);setResultRound(1);}} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"8px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#f1f5f9",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>View Results</button>
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
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px"}}>Round {currentSlot.round} · Pick #{currentPick}</div>
            <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"44px",height:"28px",borderRadius:"6px",background:TEAM_COLORS[currentSlot.abbr]||"#333",fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:700,color:"#fff",marginBottom:"12px"}}>{currentSlot.abbr}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",color:"#94a3b8",marginBottom:"16px"}}>{currentSlot.team}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#64748b",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>SELECTS</div>
            <PosBadge pos={confirmPlayer.p}/>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:700,color:"#f1f5f9",margin:"8px 0 4px"}}>{confirmPlayer.n}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#94a3b8",marginBottom:"4px"}}>{confirmPlayer.s}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#475569",marginBottom:"24px"}}>Big Board #{confirmPlayer.r}</div>
            <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
              <button onClick={()=>setConfirmPlayer(null)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#94a3b8",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cancel</button>
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
            <div style={{padding:"20px 24px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,color:"#f1f5f9",letterSpacing:"0.5px",textTransform:"uppercase"}}>Propose Trade</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b",marginTop:"2px"}}>Select picks to trade · AI accepts within fair value range</div>
                </div>
                <button onClick={()=>{setTradeModalOpen(false);setTradePartner(null);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());}} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:"20px",padding:"4px"}}>×</button>
              </div>

              {/* Trade Partner Selector */}
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase",flexShrink:0}}>Trade with</span>
                <select
                  value={tradePartner || ""}
                  onChange={e=>{setTradePartner(e.target.value||null);setPartnerTradeOffers(new Set());}}
                  style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"8px 12px",color:"#f1f5f9",fontSize:"12px",fontFamily:"'Oswald',sans-serif",cursor:"pointer",outline:"none"}}
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
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#94a3b8"}}>R{slot?.round}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",marginLeft:"auto"}}>{Math.round(PICK_VALUES[pickNum]||0)} pts</span>
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
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>Value</div>
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
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#94a3b8"}}>R{slot?.round}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",marginLeft:"auto"}}>{Math.round(PICK_VALUES[pickNum]||0)} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{textAlign:"center",padding:"40px 0"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#475569"}}>Select a team to start building a trade</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{padding:"16px 24px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:"10px",justifyContent:"flex-end"}}>
              <button onClick={()=>{setTradeModalOpen(false);setTradePartner(null);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());}} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#94a3b8",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cancel</button>
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
            <button onClick={resetDraft} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#94a3b8",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Start Over</button>
            <button onClick={()=>setShowResults(true)} style={{background:"#2dd4bf",border:"none",borderRadius:"6px",padding:"8px 20px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#0c1222",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>View Results →</button>
          </div>
        </div>
      )}

      {/* ── RESULTS SCREEN ── */}
      {showResults && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"#0c1222",zIndex:300,display:"flex",flexDirection:"column"}}>
          <div style={{flex:1,overflowY:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
            <div id="draft-results" style={{width:"100%",maxWidth:"820px",margin:"0 auto",padding:"clamp(10px,2vw,20px)"}}>
              {/* Header */}
              <div style={{textAlign:"center",marginBottom:"clamp(8px,1.5vw,14px)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"4px"}}>
                  <img src="/logo-light.png" alt="Draft Guide" style={{height:"clamp(20px,3vw,28px)",width:"auto"}}/>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(12px,2vw,16px)",fontWeight:700,color:"#f1f5f9",letterSpacing:"1px",textTransform:"uppercase"}}>Draft Guide</div>
                </div>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(16px,3vw,24px)",fontWeight:700,color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.2}}>2026 Mock Draft</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1.2vw,10px)",color:"#64748b",letterSpacing:"1px",textTransform:"uppercase",marginTop:"2px"}}>
                  {draftMode === "team" ? `${userTeamSlot?.team || ""} · ${teamPicksOwned(userTeam).length} Picks` : `Round ${resultRound} · ${roundPicks(resultRound).length} Picks`}
                </div>
              </div>

              {/* Round tabs (full draft mode, or team mode with multi-round) */}
              {draftMode === "full" && (
                <div style={{display:"flex",justifyContent:"center",gap:"4px",marginBottom:"clamp(8px,1.2vw,12px)"}}>
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

              {/* Results grid */}
              {(() => {
                const displaySlots = draftMode === "team" ? teamPicksOwned(userTeam) : roundPicks(resultRound);
                const cols = draftMode === "team" ? Math.min(displaySlots.length, 4) : displaySlots.length <= 32 ? 4 : displaySlots.length <= 36 ? 4 : 4;
                const rows = Math.ceil(displaySlots.length / cols);
                return (
                  <div style={{
                    display:"grid",gridTemplateColumns:`repeat(${cols}, 1fr)`,gap:"0",
                    border:"1px solid rgba(255,255,255,0.08)",borderRadius:"clamp(6px,1vw,10px)",overflow:"hidden",
                  }}>
                    {displaySlots.map((slot, idx) => {
                      const player = picks[slot.pick];
                      if (!player) return <div key={slot.pick} style={{padding:"clamp(4px,0.7vw,8px) clamp(5px,0.8vw,10px)",borderBottom:Math.floor(idx/cols)<rows-1?"1px solid rgba(255,255,255,0.04)":"none",borderRight:idx%cols<cols-1?"1px solid rgba(255,255,255,0.06)":"none"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#334155"}}>—</div></div>;
                      const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                      const isUserTeamPick = draftMode === "team" && getPickOwner(slot.pick) === userTeam;
                      const row = Math.floor(idx / cols);
                      return (
                        <div key={slot.pick} style={{
                          padding:"clamp(4px,0.7vw,8px) clamp(5px,0.8vw,10px)",
                          background: row % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                          borderBottom: row < rows-1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          borderRight: idx%cols < cols-1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        }}>
                          <div style={{display:"flex",alignItems:"center",gap:"clamp(3px,0.5vw,6px)",marginBottom:"clamp(2px,0.3vw,4px)"}}>
                            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.3vw,13px)",fontWeight:700,color:"#2dd4bf",minWidth:"clamp(14px,2vw,20px)"}}>{slot.pick}</span>
                            <span style={{width:"clamp(22px,3.5vw,30px)",height:"clamp(13px,2vw,17px)",borderRadius:"2px",background:TEAM_COLORS[getPickOwner(slot.pick)]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(6px,0.9vw,8px)",fontWeight:700,color:"#fff",flexShrink:0}}>{getPickOwner(slot.pick)}</span>
                            <span style={{background:pc.bg,color:pc.text,padding:"0px clamp(3px,0.5vw,5px)",borderRadius:"2px",fontSize:"clamp(6px,0.85vw,8px)",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginLeft:"auto"}}>{player.p}</span>
                          </div>
                          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"clamp(10px,1.3vw,13px)",fontWeight:600,color:"#f1f5f9",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.2}}>{player.n}</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.85vw,9px)",color:"#64748b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.3}}>{player.s}</div>
                          {draftMode === "team" && (
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(7px,0.8vw,8px)",color:"#475569",marginTop:"1px"}}>Rd {slot.round}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Footer */}
              <div style={{marginTop:"clamp(8px,1.2vw,14px)",paddingTop:"clamp(6px,1vw,10px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,1.1vw,11px)",color:"#94a3b8",fontWeight:500}}>draft-guide.com</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",color:"#475569"}}>· Create your own mock draft</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                  <svg width="clamp(11px,1.5vw,14px)" height="clamp(11px,1.5vw,14px)" viewBox="0 0 24 24" fill="#475569"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,1.1vw,11px)",color:"#2dd4bf",fontWeight:500}}>@DraftGuide_</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"12px 20px",display:"flex",gap:"10px",justifyContent:"center",background:"#0c1222",flexShrink:0}}>
            <button onClick={()=>setShowResults(false)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#94a3b8",letterSpacing:"0.5px",textTransform:"uppercase"}}>← Back to Draft</button>
            <button onClick={resetDraft} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#94a3b8",letterSpacing:"0.5px",textTransform:"uppercase"}}>New Draft</button>
          </div>
        </div>
      )}

      {/* Split screen */}
      <div className="draft-split" style={{display:"grid",gridTemplateColumns:"360px 1fr",minHeight:"calc(100vh - 160px)"}}>
        {/* Left - Draft Board */}
        <div style={{borderRight:"1px solid rgba(255,255,255,0.06)",overflowY:"auto",maxHeight:"calc(100vh - 160px)"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,color:"#f1f5f9",letterSpacing:"0.8px",textTransform:"uppercase",position:"sticky",top:0,background:"#0c1222",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>Round {activeRound}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569",fontWeight:400}}>{currentRoundPicks.filter(s=>picks[s.pick]).length}/{currentRoundPicks.length}</span>
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
                  borderBottom:"1px solid rgba(255,255,255,0.03)",
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
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:500,color:"#f1f5f9",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{picked.n}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#64748b"}}>{picked.s}</div>
                    </div>
                    {((draftMode === "full") || (draftMode === "team" && isUserTeamRow)) && (
                      <button onClick={(e)=>{e.stopPropagation();undoPick(slot.pick);}} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"14px",padding:"2px 4px",flexShrink:0}} title="Undo pick">×</button>
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
            <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:isUserPick?"#0c1222":"rgba(255,255,255,0.02)",position:"sticky",top:0,zIndex:10}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"#2dd4bf"}}>#{currentPick}</span>
                <span style={{width:"40px",height:"26px",borderRadius:"5px",background:TEAM_COLORS[getPickOwner(currentPick)]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:700,color:"#fff"}}>{getPickOwner(currentPick)}</span>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:600,color:"#f1f5f9"}}>{getPickTeamName(getPickOwner(currentPick))}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:isUserPick?"#2dd4bf":"#64748b"}}>
                    {isUserPick ? `Round ${currentSlot.round} · Your pick — select a player` : autoPickAnimating ? "Simulating pick..." : `Round ${currentSlot.round}`}
                  </div>
                </div>
                {draftMode === "team" && isUserPick && (
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px"}}>
                    <button onClick={()=>{setTradeModalOpen(true);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());setTradePartner(null);}} style={{background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:"6px",padding:"4px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#f97316",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>⇄ Trade</button>
                    <span style={{background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.25)",borderRadius:"6px",padding:"4px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Your Pick</span>
                  </div>
                )}
                {draftMode === "full" && isUserPick && !draftComplete && (
                  <button onClick={()=>{setTradeModalOpen(true);setUserTradeOffers(new Set());setPartnerTradeOffers(new Set());setTradePartner(null);}} style={{marginLeft:"auto",background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:"6px",padding:"4px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#f97316",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>⇄ Trade Pick</button>
                )}
              </div>
              {TEAM_NEEDS[currentSlot.abbr] && (
                <div style={{marginTop:"10px",display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>NEEDS</span>
                  {TEAM_NEEDS[currentSlot.abbr].map(need=>(
                    <span key={need} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"4px",padding:"2px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:600,color:"#f59e0b",letterSpacing:"0.3px"}}>{need}</span>
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
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>
                        {draftMode === "team" ? "Your Roster" : `${currentSlot.abbr} Picks`}
                      </span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#334155"}}>({alreadyDrafted.length})</span>
                    </div>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                      {alreadyDrafted.map(d => {
                        const pc = POS_COLORS[d.player.p] || {bg:"#555",text:"#fff"};
                        return (
                          <div key={d.pick} style={{
                            display:"flex",alignItems:"center",gap:"5px",
                            background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",
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
                              fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#475569",
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

          <div style={{padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center",position:"sticky",top:draftComplete?0:"90px",zIndex:9,background:"#0c1222"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",flex:1,minWidth:"160px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"6px 10px"}}>
              <SearchIcon/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search players..." style={{background:"transparent",border:"none",outline:"none",color:"#f1f5f9",fontSize:"12px",fontFamily:"'JetBrains Mono',monospace",width:"100%"}}/>
              {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:"14px",padding:"0"}}>×</button>}
            </div>
            <select value={posFilter} onChange={e=>setPosFilter(e.target.value)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"6px 10px",color:"#f1f5f9",fontSize:"11px",fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",outline:"none"}}>
              <option value="ALL" style={{background:"#1a2332"}}>All Positions</option>
              {[...OFF_POSITIONS,...DEF_POSITIONS].map(pos=>(<option key={pos} value={pos} style={{background:"#1a2332"}}>{pos}</option>))}
            </select>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569"}}>{available.length} available</span>
          </div>

          <div>
            {available.slice(0, 100).map((player, i) => {
              const canPick = isUserPick && !draftComplete && !picks[currentPick] && !autoPickAnimating;
              return (
              <div key={player.r} onClick={()=>{ if(canPick) handlePick(player); }}
                style={{display:"grid",gridTemplateColumns:"40px 44px 1fr auto",alignItems:"center",gap:"10px",padding:"10px 20px",background:i%2===0?"transparent":"rgba(255,255,255,0.015)",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:canPick?"pointer":"default",opacity:canPick?1:0.6,transition:"background 0.1s"}}
                onMouseEnter={e=>{if(canPick) e.currentTarget.style.background="rgba(45,212,191,0.06)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.015)";}}
              >
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,color:"#2dd4bf",textAlign:"right"}}>#{player.r}</span>
                <PosBadge pos={player.p}/>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,color:"#f1f5f9"}}>{player.n}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b"}}>{player.s}</div>
                </div>
                {canPick && (
                  <button onClick={(e)=>{e.stopPropagation();handlePick(player);}} style={{background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.2)",borderRadius:"6px",padding:"5px 12px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#2dd4bf",letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Draft</button>
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

/* ───── Main App ───── */
export default function App() {
  const [activePage, setActivePage] = useState("HOME");

  return (
    <div style={{minHeight:"100vh"}}>
      {/* ── Sticky Header ── */}
      <header className="site-header" style={{
        background:"#ffffff",
        borderBottom:"1px solid #e5e7eb",
        padding:"0 24px",position:"sticky",top:0,zIndex:100,
        boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
      }}>
        <div style={{
          maxWidth:"960px",margin:"0 auto",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          height:"60px",
        }}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:"12px",cursor:"pointer"}}
            onClick={()=>setActivePage("HOME")}>
            <img src="/logo.png" alt="Draft Guide" style={{
              height:"36px",width:"auto",flexShrink:0,
            }}/>
            <div className="logo-text">
              <div style={{
                fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,
                color:"#1B2A4A",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.1,
              }}>Draft Guide</div>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#2dd4bf",
                letterSpacing:"1.5px",textTransform:"uppercase",
              }}>2026 NFL Draft</div>
            </div>
          </div>

          {/* Main Nav */}
          <nav style={{display:"flex",gap:"4px",alignItems:"center"}}>
            {PAGES.map(pg=>{
              const active = activePage===pg;
              return (
                <button className="nav-btn" key={pg} onClick={()=>setActivePage(pg)} style={{
                  background: active ? "rgba(27,42,74,0.08)" : "transparent",
                  color: active ? "#1B2A4A" : "#94a3b8",
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
          </nav>
        </div>
      </header>

      {/* ── Source Badge (below header on Big Board) ── */}
      {activePage==="BIG BOARD" && (
        <div style={{maxWidth:"960px",margin:"0 auto",padding:"16px 24px 0"}}>
          <div className="source-badge" style={{
            display:"inline-flex",alignItems:"center",gap:"6px",
            background:"rgba(45,212,191,0.08)",border:"1px solid rgba(45,212,191,0.15)",
            borderRadius:"6px",padding:"5px 12px",
            fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#94a3b8",
          }}>
            <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#2dd4bf",display:"inline-block"}}/>
            NFL Mock Draft Database · 92 Sources · {PLAYERS.length} Prospects
          </div>
        </div>
      )}

      {/* ── Page Content ── */}
      {activePage==="HOME" && <HomePage setPage={setActivePage}/>}
      {activePage==="BIG BOARD" && <BigBoardPage/>}
      {activePage==="MOCK DRAFT" && <MockDraftPage/>}

      {/* ── Footer ── */}
      <div style={{maxWidth:"960px",margin:"0 auto",padding:"0 24px 40px"}}>
        <div style={{
          borderTop:"1px solid rgba(255,255,255,0.04)",
          paddingTop:"16px",textAlign:"center",
          fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",
          color:"#334155",letterSpacing:"0.5px",
        }}>
          DRAFT GUIDE © 2026 · draft-guide.com
        </div>
      </div>
    </div>
  );
}
