import { useState, useMemo, useEffect } from "react";
import PLAYERS from "./players.js";

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
    <span style={{
      background:c.bg,color:c.text,padding:"3px 10px",borderRadius:"4px",
      fontSize:"11px",fontWeight:700,letterSpacing:"0.5px",
      fontFamily:"'JetBrains Mono',monospace",display:"inline-block",
      minWidth:"42px",textAlign:"center",
    }}>{pos}</span>
  );
}

function PlayerRow({ player, posRank, index, isPositionView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{
        display:"grid",
        gridTemplateColumns:"70px 52px 1fr 1fr",
        alignItems:"center",gap:"12px",padding:"12px 20px",
        background: hovered ? "rgba(45,212,191,0.06)" : index%2===0 ? "transparent" : "rgba(255,255,255,0.015)",
        borderBottom:"1px solid rgba(255,255,255,0.04)",
        transition:"background 0.15s ease",cursor:"default",
      }}
    >
      {/* Rank */}
      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
        <span style={{
          fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,
          color:"#2dd4bf",lineHeight:1,minWidth:"32px",textAlign:"right",
        }}>#{isPositionView ? posRank : player.r}</span>
        {!isPositionView && posRank && (
          <span style={{
            fontSize:"10px",color:"#64748b",fontFamily:"'JetBrains Mono',monospace",
            background:"rgba(45,212,191,0.08)",padding:"2px 6px",borderRadius:"3px",
          }}>P{posRank}</span>
        )}
      </div>
      <PosBadge pos={player.p} />
      <div style={{
        fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:500,
        color:"#f1f5f9",letterSpacing:"0.2px",
      }}>{player.n}</div>
      <div style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",
        color:"#94a3b8",textAlign:"right",
      }}>
        {player.s}
        {isPositionView && (
          <span style={{marginLeft:"12px",color:"#475569",fontSize:"11px"}}>OVR #{player.r}</span>
        )}
      </div>
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
    <div style={{
      display:"flex",flexDirection:"column",gap:"10px",
      background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:"10px",padding:"14px 16px",marginBottom:"16px",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
        <button onClick={()=>setActivePos("ALL")} style={btnStyle("ALL")}>ALL</button>
        <div style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",
          letterSpacing:"1.5px",textTransform:"uppercase",marginRight:"2px",
        }}>OFF</span>
        {OFF_POSITIONS.map(pos=>(
          <button key={pos} onClick={()=>setActivePos(activePos===pos?"ALL":pos)} style={btnStyle(pos)}>{pos}</button>
        ))}
        <div style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",
          letterSpacing:"1.5px",textTransform:"uppercase",marginRight:"2px",
        }}>DEF</span>
        {DEF_POSITIONS.map(pos=>(
          <button key={pos} onClick={()=>setActivePos(activePos===pos?"ALL":pos)} style={btnStyle(pos)}>{pos}</button>
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

  return (
    <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px 24px 60px"}}>
      {/* Hero */}
      <div style={{
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
      <div style={{
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
          {top10.map((p,i)=>(
            <div key={p.r} style={{
              display:"flex",alignItems:"center",gap:"12px",
              padding:"8px 0",borderBottom: i<9 ? "1px solid rgba(255,255,255,0.04)" : "none",
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
              <span style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b",
              }}>{p.s}</span>
            </div>
          ))}
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
            return (
              <div key={pos} style={{
                display:"flex",alignItems:"center",gap:"12px",
                padding:"8px 0",
                borderBottom: i<arr.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <PosBadge pos={pos}/>
                <span style={{
                  fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,
                  color:"#f1f5f9",flex:1,
                }}>{p.n}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b"}}>{p.s}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#475569"}}>#{p.r}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}}>
        {[
          {label:"Total Prospects",value:PLAYERS.length},
          {label:"Expert Sources",value:92},
          {label:"Positions Tracked",value:11},
        ].map(stat=>(
          <div key={stat.label} style={{
            background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:"10px",padding:"20px",textAlign:"center",
          }}>
            <div style={{
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
    <div style={{maxWidth:"960px",margin:"0 auto",padding:"16px 24px 40px"}}>
      {/* Position filter */}
      <PositionFilter activePos={activePos} setActivePos={setActivePos}/>

      {/* Position Hero */}
      {isPositionView && posTopPlayer && (
        <div style={{
          background:"linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(27,42,74,0.4) 100%)",
          border:"1px solid rgba(45,212,191,0.12)",borderRadius:"12px",
          padding:"20px 24px",marginBottom:"16px",
          display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",
        }}>
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2dd4bf",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"4px"}}>
              #{activePos}1 · Overall #{posTopPlayer.r}
            </div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:700,color:"#f1f5f9",letterSpacing:"0.5px"}}>
              {posTopPlayer.n}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#94a3b8",marginTop:"2px"}}>
              {posTopPlayer.s}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"42px",fontWeight:700,color:"rgba(45,212,191,0.2)",lineHeight:1}}>
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
        <div style={{
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
      <div style={{
        display:"grid",gridTemplateColumns:"70px 52px 1fr 1fr",
        gap:"12px",padding:"8px 20px",
        borderBottom:"1px solid rgba(45,212,191,0.15)",
        fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569",
        letterSpacing:"1px",textTransform:"uppercase",
      }}>
        <div>{isPositionView?"POS RNK":"RANK"}</div>
        <div>POS</div>
        <div>PLAYER</div>
        <div style={{textAlign:"right"}}>{isPositionView?"SCHOOL / OVR":"SCHOOL"}</div>
      </div>

      {/* Rows */}
      <div>
        {pageData.map((player,i)=>{
          const posRank = isPositionView ? filtered.indexOf(player)+1 : positionRanks[player.r];
          return <PlayerRow key={player.r} player={player} posRank={posRank} index={page*PER_PAGE+i} isPositionView={isPositionView}/>;
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

/* ───── Mock Draft Page (placeholder) ───── */
function MockDraftPage() {
  return (
    <div style={{maxWidth:"960px",margin:"0 auto",padding:"40px 24px",textAlign:"center"}}>
      <div style={{
        background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:"16px",padding:"60px 32px",
      }}>
        <div style={{
          fontFamily:"'Oswald',sans-serif",fontSize:"48px",fontWeight:700,
          color:"rgba(45,212,191,0.15)",lineHeight:1,marginBottom:"16px",
        }}>MOCK DRAFT</div>
        <h2 style={{
          fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:600,
          color:"#f1f5f9",margin:"0 0 8px",letterSpacing:"0.5px",textTransform:"uppercase",
        }}>Coming Soon</h2>
        <p style={{
          fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",color:"#64748b",
          maxWidth:"420px",margin:"0 auto",lineHeight:1.6,
        }}>
          Consensus mock draft with projected picks for all 32 teams, powered by data from top analysts.
        </p>
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
      <header style={{
        background:"linear-gradient(180deg, #111b33 0%, #0f1729 100%)",
        borderBottom:"1px solid rgba(45,212,191,0.15)",
        padding:"0 24px",position:"sticky",top:0,zIndex:100,
      }}>
        <div style={{
          maxWidth:"960px",margin:"0 auto",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          height:"60px",
        }}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:"12px",cursor:"pointer"}}
            onClick={()=>setActivePage("HOME")}>
            <div style={{
              width:"36px",height:"36px",borderRadius:"8px",
              background:"linear-gradient(135deg,#1B2A4A,#234)",
              border:"1.5px solid #2dd4bf",display:"flex",alignItems:"center",
              justifyContent:"center",fontFamily:"'Oswald',sans-serif",
              fontWeight:700,fontSize:"14px",color:"#2dd4bf",flexShrink:0,
            }}>DG</div>
            <div>
              <div style={{
                fontFamily:"'Oswald',sans-serif",fontSize:"18px",fontWeight:700,
                color:"#f1f5f9",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.1,
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
                <button key={pg} onClick={()=>setActivePage(pg)} style={{
                  background: active ? "rgba(45,212,191,0.1)" : "transparent",
                  color: active ? "#2dd4bf" : "#94a3b8",
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
          <div style={{
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
