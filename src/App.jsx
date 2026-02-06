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
    <span className="pos-badge" style={{
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
      className="player-row"
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
      <div className="player-name" style={{
        fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:500,
        color:"#f1f5f9",letterSpacing:"0.2px",
      }}>{player.n}</div>
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

/* ───── Mock Draft Page ───── */
const DRAFT_ORDER = [
  {pick:1,team:"Las Vegas Raiders",abbr:"LV",record:"3-14"},
  {pick:2,team:"New York Jets",abbr:"NYJ",record:"3-14"},
  {pick:3,team:"Arizona Cardinals",abbr:"ARI",record:"3-14"},
  {pick:4,team:"Tennessee Titans",abbr:"TEN",record:"3-14"},
  {pick:5,team:"New York Giants",abbr:"NYG",record:"4-13"},
  {pick:6,team:"Cleveland Browns",abbr:"CLE",record:"5-12"},
  {pick:7,team:"Washington Commanders",abbr:"WAS",record:"5-12"},
  {pick:8,team:"New Orleans Saints",abbr:"NO",record:"6-11"},
  {pick:9,team:"Kansas City Chiefs",abbr:"KC",record:"6-11"},
  {pick:10,team:"Cincinnati Bengals",abbr:"CIN",record:"6-11"},
  {pick:11,team:"Miami Dolphins",abbr:"MIA",record:"7-10"},
  {pick:12,team:"Dallas Cowboys",abbr:"DAL",record:"7-9-1"},
  {pick:13,team:"Atlanta Falcons",abbr:"ATL",record:"8-9",note:"via LAR"},
  {pick:14,team:"Baltimore Ravens",abbr:"BAL",record:"8-9"},
  {pick:15,team:"Tampa Bay Buccaneers",abbr:"TB",record:"8-9"},
  {pick:16,team:"Indianapolis Colts",abbr:"IND",record:"8-9",note:"via NYJ"},
  {pick:17,team:"Detroit Lions",abbr:"DET",record:"9-8"},
  {pick:18,team:"Minnesota Vikings",abbr:"MIN",record:"9-8"},
  {pick:19,team:"Carolina Panthers",abbr:"CAR",record:"8-9"},
  {pick:20,team:"Green Bay Packers",abbr:"GB",record:"9-7-1",note:"via DAL"},
  {pick:21,team:"Pittsburgh Steelers",abbr:"PIT",record:"10-7"},
  {pick:22,team:"Los Angeles Chargers",abbr:"LAC",record:"11-6"},
  {pick:23,team:"Philadelphia Eagles",abbr:"PHI",record:"11-6"},
  {pick:24,team:"Jacksonville Jaguars",abbr:"JAX",record:"13-4",note:"via CLE"},
  {pick:25,team:"Chicago Bears",abbr:"CHI",record:"11-6"},
  {pick:26,team:"Buffalo Bills",abbr:"BUF",record:"12-5"},
  {pick:27,team:"San Francisco 49ers",abbr:"SF",record:"12-5"},
  {pick:28,team:"Houston Texans",abbr:"HOU",record:"12-5"},
  {pick:29,team:"Los Angeles Rams",abbr:"LAR",record:"12-5"},
  {pick:30,team:"Denver Broncos",abbr:"DEN",record:"14-3"},
  {pick:31,team:"Seattle Seahawks",abbr:"SEA",record:"14-3"},
  {pick:32,team:"New England Patriots",abbr:"NE",record:"14-3"},
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

function MockDraftPage() {
  const [drafting, setDrafting] = useState(false);
  const [picks, setPicks] = useState({});
  const [currentPick, setCurrentPick] = useState(1);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("ALL");
  const [confirmPlayer, setConfirmPlayer] = useState(null);
  const [showResults, setShowResults] = useState(false);

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

  const draftComplete = Object.keys(picks).length === 32;

  const handlePick = (player) => {
    setConfirmPlayer(player);
  };

  const confirmPick = () => {
    if (!confirmPlayer) return;
    const newPicks = {...picks, [currentPick]: confirmPlayer};
    setPicks(newPicks);
    setConfirmPlayer(null);
    setSearch("");
    // Auto advance to next unpicked slot
    for (let i = currentPick + 1; i <= 32; i++) {
      if (!newPicks[i]) { setCurrentPick(i); return; }
    }
    for (let i = 1; i < currentPick; i++) {
      if (!newPicks[i]) { setCurrentPick(i); return; }
    }
  };

  const undoPick = (pickNum) => {
    const newPicks = {...picks};
    delete newPicks[pickNum];
    setPicks(newPicks);
    setCurrentPick(pickNum);
  };

  const resetDraft = () => {
    setPicks({});
    setCurrentPick(1);
    setSearch("");
    setPosFilter("ALL");
    setConfirmPlayer(null);
    setShowResults(false);
  };

  // Pre-draft overview
  if (!drafting) {
    return (
      <div className="page-content" style={{maxWidth:"960px",margin:"0 auto",padding:"24px 24px 60px"}}>
        {/* Hero */}
        <div style={{
          background:"linear-gradient(135deg, rgba(45,212,191,0.06) 0%, rgba(27,42,74,0.5) 50%, rgba(45,212,191,0.03) 100%)",
          border:"1px solid rgba(45,212,191,0.12)",borderRadius:"16px",
          padding:"40px 32px",marginBottom:"32px",textAlign:"center",
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#2dd4bf",
            letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px",
          }}>2026 NFL Draft · Round 1</div>
          <h2 style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"clamp(28px,5vw,42px)",fontWeight:700,
            color:"#f1f5f9",margin:"0 0 8px",letterSpacing:"1px",textTransform:"uppercase",
          }}>Mock Draft Simulator</h2>
          <p style={{
            fontFamily:"'JetBrains Mono',monospace",fontSize:"13px",color:"#64748b",
            maxWidth:"500px",margin:"0 auto 24px",lineHeight:1.6,
          }}>
            Build your own first-round mock draft. Select from {PLAYERS.length} consensus-ranked prospects.
          </p>
          <button onClick={()=>setDrafting(true)} style={{
            background:"#2dd4bf",color:"#0c1222",border:"none",borderRadius:"8px",
            padding:"14px 36px",cursor:"pointer",fontFamily:"'Oswald',sans-serif",
            fontSize:"16px",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",
            transition:"all 0.2s ease",
          }}>Start Draft →</button>
        </div>

        {/* Draft Order Preview */}
        <div style={{
          background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:"12px",padding:"20px",
        }}>
          <h3 style={{
            fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,
            color:"#f1f5f9",letterSpacing:"0.5px",textTransform:"uppercase",margin:"0 0 16px",
          }}>2026 Draft Order · Round 1</h3>
          {DRAFT_ORDER.map((slot,i)=>(
            <div key={slot.pick} style={{
              display:"flex",alignItems:"center",gap:"12px",
              padding:"10px 8px",
              borderBottom: i<31 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <span style={{
                fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,
                color:"#2dd4bf",minWidth:"28px",textAlign:"right",
              }}>#{slot.pick}</span>
              <span style={{
                width:"36px",height:"22px",borderRadius:"4px",
                background:TEAM_COLORS[slot.abbr]||"#333",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:700,
                color:"#fff",letterSpacing:"0.5px",
              }}>{slot.abbr}</span>
              <span style={{
                fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,
                color:"#f1f5f9",flex:1,
              }}>{slot.team}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b"}}>{slot.record}</span>
              {slot.note && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569"}}>({slot.note})</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Draft mode - split screen
  const currentSlot = DRAFT_ORDER.find(s=>s.pick===currentPick);

  return (
    <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0"}}>
      {/* Draft header bar */}
      <div style={{
        background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.06)",
        padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",
        flexWrap:"wrap",gap:"8px",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:600,color:"#f1f5f9",textTransform:"uppercase",letterSpacing:"0.5px"}}>
            Round 1
          </span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#64748b"}}>
            {Object.keys(picks).length}/32 picks made
          </span>
          {/* Progress bar */}
          <div style={{width:"120px",height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{width:`${(Object.keys(picks).length/32)*100}%`,height:"100%",background:"#2dd4bf",borderRadius:"2px",transition:"width 0.3s ease"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={resetDraft} style={{
            background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"6px",padding:"6px 14px",cursor:"pointer",
            fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#94a3b8",
            letterSpacing:"0.5px",textTransform:"uppercase",
          }}>Reset</button>
          <button onClick={()=>{setDrafting(false);resetDraft();}} style={{
            background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"6px",padding:"6px 14px",cursor:"pointer",
            fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#94a3b8",
            letterSpacing:"0.5px",textTransform:"uppercase",
          }}>Exit</button>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmPlayer && currentSlot && (
        <div style={{
          position:"fixed",top:0,left:0,right:0,bottom:0,
          background:"rgba(0,0,0,0.7)",zIndex:200,
          display:"flex",alignItems:"center",justifyContent:"center",
          padding:"20px",
        }} onClick={()=>setConfirmPlayer(null)}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:"#1a2332",border:"1px solid rgba(45,212,191,0.2)",
            borderRadius:"16px",padding:"32px",maxWidth:"400px",width:"100%",textAlign:"center",
          }}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px"}}>
              Pick #{currentPick}
            </div>
            <div style={{
              display:"inline-flex",alignItems:"center",justifyContent:"center",
              width:"44px",height:"28px",borderRadius:"6px",
              background:TEAM_COLORS[currentSlot.abbr]||"#333",
              fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:700,color:"#fff",
              marginBottom:"12px",
            }}>{currentSlot.abbr}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",color:"#94a3b8",marginBottom:"16px"}}>{currentSlot.team}</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#64748b",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"4px"}}>SELECTS</div>
            <PosBadge pos={confirmPlayer.p}/>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"24px",fontWeight:700,color:"#f1f5f9",margin:"8px 0 4px"}}>{confirmPlayer.n}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#94a3b8",marginBottom:"4px"}}>{confirmPlayer.s}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"#475569",marginBottom:"24px"}}>Big Board #{confirmPlayer.r}</div>
            <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
              <button onClick={()=>setConfirmPlayer(null)} style={{
                background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:"8px",padding:"10px 24px",cursor:"pointer",
                fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#94a3b8",
                letterSpacing:"0.5px",textTransform:"uppercase",
              }}>Cancel</button>
              <button onClick={confirmPick} style={{
                background:"#2dd4bf",border:"none",borderRadius:"8px",
                padding:"10px 24px",cursor:"pointer",
                fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#0c1222",
                fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",
              }}>Confirm Pick</button>
            </div>
          </div>
        </div>
      )}

      {/* Draft complete overlay */}
      {draftComplete && !showResults && (
        <div style={{
          background:"rgba(45,212,191,0.08)",border:"1px solid rgba(45,212,191,0.2)",
          borderRadius:"10px",margin:"12px 20px",padding:"16px 20px",
          display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",
        }}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:600,color:"#2dd4bf",textTransform:"uppercase",letterSpacing:"0.5px"}}>
            Draft Complete!
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={resetDraft} style={{
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"6px",padding:"8px 20px",
              cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#94a3b8",
              fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",
            }}>Start Over</button>
            <button onClick={()=>setShowResults(true)} style={{
              background:"#2dd4bf",border:"none",borderRadius:"6px",padding:"8px 20px",
              cursor:"pointer",fontFamily:"'Oswald',sans-serif",fontSize:"12px",color:"#0c1222",
              fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",
            }}>View Results →</button>
          </div>
        </div>
      )}

      {/* ── RESULTS SCREEN ── */}
      {showResults && (
        <div style={{
          position:"fixed",top:0,left:0,right:0,bottom:0,
          background:"#0c1222",zIndex:300,overflowY:"auto",
        }}>
          <div id="draft-results" style={{
            maxWidth:"640px",margin:"0 auto",padding:"24px 20px 20px",
          }}>
            {/* Results header */}
            <div style={{textAlign:"center",marginBottom:"20px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",marginBottom:"8px"}}>
                <img src="/logo.png" alt="Draft Guide" style={{height:"28px",width:"auto"}}/>
                <div style={{
                  fontFamily:"'Oswald',sans-serif",fontSize:"16px",fontWeight:700,
                  color:"#f1f5f9",letterSpacing:"1px",textTransform:"uppercase",
                }}>Draft Guide</div>
              </div>
              <div style={{
                fontFamily:"'Oswald',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:700,
                color:"#2dd4bf",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.2,
              }}>2026 Mock Draft</div>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b",
                letterSpacing:"1px",textTransform:"uppercase",marginTop:"4px",
              }}>Round 1 · 32 Picks</div>
            </div>

            {/* Results grid - two columns */}
            <div style={{
              display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0",
              border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",
              overflow:"hidden",
            }}>
              {DRAFT_ORDER.map((slot) => {
                const player = picks[slot.pick];
                if (!player) return null;
                const pc = POS_COLORS[player.p] || {bg:"#555",text:"#fff"};
                return (
                  <div key={slot.pick} style={{
                    display:"flex",alignItems:"center",gap:"8px",
                    padding:"7px 10px",
                    background: slot.pick % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    borderBottom:"1px solid rgba(255,255,255,0.04)",
                    borderRight: slot.pick % 2 === 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                    {/* Pick # */}
                    <span style={{
                      fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:700,
                      color:"#2dd4bf",minWidth:"18px",textAlign:"right",
                    }}>{slot.pick}</span>

                    {/* Team badge */}
                    <span style={{
                      width:"28px",height:"17px",borderRadius:"3px",
                      background:TEAM_COLORS[slot.abbr]||"#333",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontFamily:"'JetBrains Mono',monospace",fontSize:"7px",fontWeight:700,
                      color:"#fff",letterSpacing:"0.3px",flexShrink:0,
                    }}>{slot.abbr}</span>

                    {/* Position badge */}
                    <span style={{
                      background:pc.bg,color:pc.text,
                      padding:"1px 5px",borderRadius:"3px",
                      fontSize:"8px",fontWeight:700,letterSpacing:"0.3px",
                      fontFamily:"'JetBrains Mono',monospace",
                      minWidth:"30px",textAlign:"center",flexShrink:0,
                    }}>{player.p}</span>

                    {/* Player name */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{
                        fontFamily:"'Oswald',sans-serif",fontSize:"12px",fontWeight:500,
                        color:"#f1f5f9",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                      }}>{player.n}</div>
                      <div style={{
                        fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"#64748b",
                      }}>{player.s}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with branding */}
            <div style={{
              marginTop:"16px",paddingTop:"12px",
              borderTop:"1px solid rgba(255,255,255,0.06)",
              display:"flex",alignItems:"center",justifyContent:"space-between",
            }}>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569",
              }}>draft-guide.com</div>
              <div style={{
                display:"flex",alignItems:"center",gap:"6px",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#475569">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span style={{
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",
                  color:"#2dd4bf",fontWeight:500,
                }}>@DraftGuide_</span>
              </div>
            </div>
          </div>

          {/* Action buttons - outside the screenshot area */}
          <div style={{
            maxWidth:"640px",margin:"0 auto",padding:"16px 20px 40px",
            display:"flex",gap:"10px",justifyContent:"center",
          }}>
            <button onClick={()=>setShowResults(false)} style={{
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"8px",padding:"10px 24px",cursor:"pointer",
              fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#94a3b8",
              letterSpacing:"0.5px",textTransform:"uppercase",
            }}>← Back to Draft</button>
            <button onClick={resetDraft} style={{
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"8px",padding:"10px 24px",cursor:"pointer",
              fontFamily:"'Oswald',sans-serif",fontSize:"13px",color:"#94a3b8",
              letterSpacing:"0.5px",textTransform:"uppercase",
            }}>New Draft</button>
          </div>
        </div>
      )}

      {/* Split screen */}
      <div className="draft-split" style={{
        display:"grid",gridTemplateColumns:"360px 1fr",
        minHeight:"calc(100vh - 160px)",
      }}>
        {/* Left - Draft Board */}
        <div style={{
          borderRight:"1px solid rgba(255,255,255,0.06)",
          overflowY:"auto",maxHeight:"calc(100vh - 160px)",
        }}>
          <div style={{
            padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",
            fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:600,
            color:"#f1f5f9",letterSpacing:"0.8px",textTransform:"uppercase",
            position:"sticky",top:0,background:"#0c1222",zIndex:10,
          }}>Draft Board</div>

          {DRAFT_ORDER.map((slot) => {
            const picked = picks[slot.pick];
            const isCurrent = slot.pick === currentPick && !draftComplete;
            return (
              <div key={slot.pick}
                onClick={()=>{ if(!draftComplete) setCurrentPick(slot.pick); }}
                style={{
                  display:"flex",alignItems:"center",gap:"10px",
                  padding: isCurrent ? "12px 16px" : "8px 16px",
                  background: isCurrent ? "rgba(45,212,191,0.08)" : "transparent",
                  borderLeft: isCurrent ? "3px solid #2dd4bf" : "3px solid transparent",
                  borderBottom:"1px solid rgba(255,255,255,0.03)",
                  cursor:"pointer",transition:"all 0.15s",
                }}
              >
                {/* Pick number */}
                <span style={{
                  fontFamily:"'Oswald',sans-serif",fontSize:isCurrent?"16px":"13px",
                  fontWeight:700,color:isCurrent?"#2dd4bf":"#475569",
                  minWidth:"24px",textAlign:"right",
                }}>{slot.pick}</span>

                {/* Team badge */}
                <span style={{
                  width:"32px",height:"20px",borderRadius:"3px",
                  background:TEAM_COLORS[slot.abbr]||"#333",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fontWeight:700,
                  color:"#fff",letterSpacing:"0.3px",flexShrink:0,
                }}>{slot.abbr}</span>

                {/* Pick content */}
                {picked ? (
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:"8px",minWidth:0}}>
                    <PosBadge pos={picked.p}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"13px",fontWeight:500,color:"#f1f5f9",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{picked.n}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#64748b"}}>{picked.s}</div>
                    </div>
                    <button onClick={(e)=>{e.stopPropagation();undoPick(slot.pick);}} style={{
                      background:"none",border:"none",color:"#475569",cursor:"pointer",
                      fontSize:"14px",padding:"2px 4px",flexShrink:0,
                    }} title="Undo pick">×</button>
                  </div>
                ) : (
                  <div style={{flex:1}}>
                    <div style={{
                      fontFamily:"'Oswald',sans-serif",fontSize:"12px",
                      color: isCurrent ? "#94a3b8" : "#334155",
                    }}>{isCurrent ? "On the clock..." : slot.team}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right - Available Players */}
        <div style={{
          overflowY:"auto",maxHeight:"calc(100vh - 160px)",
        }}>
          {/* Current pick banner */}
          {!draftComplete && currentSlot && (
            <div style={{
              padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",
              background:"rgba(45,212,191,0.04)",
              position:"sticky",top:0,zIndex:10,
            }}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"20px",fontWeight:700,color:"#2dd4bf"}}>#{currentPick}</span>
                <span style={{
                  width:"40px",height:"26px",borderRadius:"5px",
                  background:TEAM_COLORS[currentSlot.abbr]||"#333",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:700,color:"#fff",
                }}>{currentSlot.abbr}</span>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"15px",fontWeight:600,color:"#f1f5f9"}}>{currentSlot.team}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b"}}>On the clock · Select a player below</div>
                </div>
              </div>
              {/* Team Needs */}
              {TEAM_NEEDS[currentSlot.abbr] && (
                <div style={{
                  marginTop:"10px",display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap",
                }}>
                  <span style={{
                    fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"#475569",
                    letterSpacing:"1px",textTransform:"uppercase",
                  }}>NEEDS</span>
                  {TEAM_NEEDS[currentSlot.abbr].map(need=>(
                    <span key={need} style={{
                      background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",
                      borderRadius:"4px",padding:"2px 8px",
                      fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",fontWeight:600,
                      color:"#f59e0b",letterSpacing:"0.3px",
                    }}>{need}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search + filter */}
          <div style={{
            padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",
            display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center",
            position:"sticky",top: draftComplete ? 0 : "90px",zIndex:9,background:"#0c1222",
          }}>
            <div style={{
              display:"flex",alignItems:"center",gap:"6px",flex:1,minWidth:"160px",
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"6px",padding:"6px 10px",
            }}>
              <SearchIcon/>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search players..."
                style={{background:"transparent",border:"none",outline:"none",color:"#f1f5f9",fontSize:"12px",fontFamily:"'JetBrains Mono',monospace",width:"100%"}}
              />
              {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:"14px",padding:"0"}}>×</button>}
            </div>
            <select value={posFilter} onChange={e=>setPosFilter(e.target.value)} style={{
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"6px",padding:"6px 10px",color:"#f1f5f9",fontSize:"11px",
              fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",outline:"none",
            }}>
              <option value="ALL" style={{background:"#1a2332"}}>All Positions</option>
              {[...OFF_POSITIONS,...DEF_POSITIONS].map(pos=>(
                <option key={pos} value={pos} style={{background:"#1a2332"}}>{pos}</option>
              ))}
            </select>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#475569"}}>
              {available.length} available
            </span>
          </div>

          {/* Available player list */}
          <div>
            {available.slice(0, 100).map((player, i) => (
              <div key={player.r}
                onClick={()=>{ if(!draftComplete && !picks[currentPick]) handlePick(player); }}
                style={{
                  display:"grid",gridTemplateColumns:"40px 44px 1fr auto",
                  alignItems:"center",gap:"10px",padding:"10px 20px",
                  background: i%2===0 ? "transparent" : "rgba(255,255,255,0.015)",
                  borderBottom:"1px solid rgba(255,255,255,0.03)",
                  cursor: draftComplete || picks[currentPick] ? "default" : "pointer",
                  transition:"background 0.1s",
                }}
                onMouseEnter={e=>{if(!draftComplete && !picks[currentPick]) e.currentTarget.style.background="rgba(45,212,191,0.06)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.015)";}}
              >
                <span style={{
                  fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:700,
                  color:"#2dd4bf",textAlign:"right",
                }}>#{player.r}</span>
                <PosBadge pos={player.p}/>
                <div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"14px",fontWeight:500,color:"#f1f5f9"}}>{player.n}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#64748b"}}>{player.s}</div>
                </div>
                {!draftComplete && !picks[currentPick] && (
                  <button onClick={(e)=>{e.stopPropagation();handlePick(player);}} style={{
                    background:"rgba(45,212,191,0.1)",border:"1px solid rgba(45,212,191,0.2)",
                    borderRadius:"6px",padding:"5px 12px",cursor:"pointer",
                    fontFamily:"'Oswald',sans-serif",fontSize:"11px",color:"#2dd4bf",
                    letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap",
                  }}>Draft</button>
                )}
              </div>
            ))}
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
