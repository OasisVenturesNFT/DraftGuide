import { useState, useMemo, useRef, useEffect } from "react";
import PLAYERS from "./players.js";

const POS_COLORS = {
  QB: { bg: "#dc2626", text: "#fff" },
  RB: { bg: "#2563eb", text: "#fff" },
  WR: { bg: "#f59e0b", text: "#1a1a2e" },
  TE: { bg: "#f97316", text: "#fff" },
  OT: { bg: "#16a34a", text: "#fff" },
  IOL: { bg: "#15803d", text: "#fff" },
  DL: { bg: "#7c3aed", text: "#fff" },
  EDGE: { bg: "#a855f7", text: "#fff" },
  LB: { bg: "#0891b2", text: "#fff" },
  CB: { bg: "#db2777", text: "#fff" },
  S: { bg: "#e11d48", text: "#fff" },
  K: { bg: "#737373", text: "#fff" },
  P: { bg: "#737373", text: "#fff" },
  LS: { bg: "#737373", text: "#fff" },
};

const POSITION_GROUPS = [
  { label: "QB", positions: ["QB"] },
  { label: "RB", positions: ["RB"] },
  { label: "WR", positions: ["WR"] },
  { label: "TE", positions: ["TE"] },
  { label: "OT", positions: ["OT"] },
  { label: "IOL", positions: ["IOL"] },
  { label: "DL", positions: ["DL"] },
  { label: "EDGE", positions: ["EDGE"] },
  { label: "LB", positions: ["LB"] },
  { label: "CB", positions: ["CB"] },
  { label: "S", positions: ["S"] },
];

function PosBadge({ pos }) {
  const c = POS_COLORS[pos] || { bg: "#555", text: "#fff" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "3px 10px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        fontFamily: "'JetBrains Mono', monospace",
        display: "inline-block",
        minWidth: "42px",
        textAlign: "center",
      }}
    >
      {pos}
    </span>
  );
}

function RankBadge({ rank, posRank }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          color: "#2dd4bf",
          lineHeight: 1,
          minWidth: "32px",
          textAlign: "right",
        }}
      >
        #{rank}
      </span>
      {posRank && (
        <span
          style={{
            fontSize: "10px",
            color: "#64748b",
            fontFamily: "'JetBrains Mono', monospace",
            background: "rgba(45,212,191,0.08)",
            padding: "2px 6px",
            borderRadius: "3px",
          }}
        >
          P{posRank}
        </span>
      )}
    </div>
  );
}

function PlayerRow({ player, posRank, index, isPositionView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 52px 1fr 1fr",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        background: hovered
          ? "rgba(45,212,191,0.06)"
          : index % 2 === 0
          ? "transparent"
          : "rgba(255,255,255,0.015)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s ease",
        cursor: "default",
      }}
    >
      <RankBadge
        rank={isPositionView ? posRank : player.r}
        posRank={isPositionView ? null : posRank}
      />
      <PosBadge pos={player.p} />
      <div>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#f1f5f9",
            letterSpacing: "0.2px",
          }}
        >
          {player.n}
        </div>
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          color: "#94a3b8",
          textAlign: "right",
        }}
      >
        {player.s}
        {isPositionView && (
          <span style={{ marginLeft: "12px", color: "#475569", fontSize: "11px" }}>
            OVR #{player.r}
          </span>
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748b"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("BIG BOARD");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const tabBarRef = useRef(null);
  const contentRef = useRef(null);
  const TABS = ["BIG BOARD", ...POSITION_GROUPS.map((g) => g.label)];
  const PER_PAGE = 50;

  useEffect(() => {
    setPage(0);
  }, [activeTab, search]);

  useEffect(() => {
    if (tabBarRef.current) {
      const active = tabBarRef.current.querySelector('[data-active="true"]');
      if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab]);

  // Scroll to top of content on page change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  const positionRanks = useMemo(() => {
    const counters = {};
    const map = {};
    PLAYERS.forEach((p) => {
      counters[p.p] = (counters[p.p] || 0) + 1;
      map[p.r] = counters[p.p];
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = PLAYERS;
    if (activeTab !== "BIG BOARD") {
      const group = POSITION_GROUPS.find((g) => g.label === activeTab);
      if (group) list = list.filter((p) => group.positions.includes(p.p));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.n.toLowerCase().includes(q) ||
          p.s.toLowerCase().includes(q) ||
          p.p.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const isPositionView = activeTab !== "BIG BOARD";
  const posTopPlayer = isPositionView && filtered.length > 0 ? filtered[0] : null;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #111b33 0%, #0c1222 100%)",
          borderBottom: "1px solid rgba(45,212,191,0.15)",
          padding: "24px 24px 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* Logo + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "6px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1B2A4A, #234)",
                border: "1.5px solid #2dd4bf",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#2dd4bf",
                flexShrink: 0,
              }}
            >
              DG
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#f1f5f9",
                  margin: 0,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Draft Guide
              </h1>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#2dd4bf",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginTop: "1px",
                }}
              >
                2026 NFL Big Board
              </div>
            </div>
          </div>

          {/* Source badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(45,212,191,0.08)",
              border: "1px solid rgba(45,212,191,0.15)",
              borderRadius: "6px",
              padding: "5px 12px",
              marginTop: "12px",
              marginBottom: "16px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#2dd4bf",
                display: "inline-block",
              }}
            />
            NFL Mock Draft Database · 92 Sources · {PLAYERS.length} Prospects
          </div>

          {/* Tab Bar */}
          <div
            ref={tabBarRef}
            style={{
              display: "flex",
              gap: "2px",
              overflowX: "auto",
              paddingBottom: "0",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  data-active={active}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: active ? "rgba(45,212,191,0.12)" : "transparent",
                    color: active ? "#2dd4bf" : "#64748b",
                    border: "none",
                    borderBottom: active ? "2px solid #2dd4bf" : "2px solid transparent",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "13px",
                    fontWeight: active ? 600 : 400,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    borderRadius: "4px 4px 0 0",
                    flexShrink: 0,
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ maxWidth: "960px", margin: "0 auto", padding: "16px 24px 40px" }}>
        {/* Position Hero Card */}
        {isPositionView && posTopPlayer && (
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(27,42,74,0.4) 100%)",
              border: "1px solid rgba(45,212,191,0.12)",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#2dd4bf",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                #{activeTab}1 · Overall #{posTopPlayer.r}
              </div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#f1f5f9",
                  letterSpacing: "0.5px",
                }}
              >
                {posTopPlayer.n}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginTop: "2px",
                }}
              >
                {posTopPlayer.s}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "42px",
                  fontWeight: 700,
                  color: "rgba(45,212,191,0.2)",
                  lineHeight: 1,
                }}
              >
                {activeTab}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "#64748b",
                  marginTop: "2px",
                }}
              >
                {filtered.length} prospects ranked
              </div>
            </div>
          </div>
        )}

        {/* Search + Count Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: "1",
              minWidth: "200px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "8px 14px",
            }}
          >
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player, school, or position..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f1f5f9",
                fontSize: "13px",
                fontFamily: "'JetBrains Mono', monospace",
                width: "100%",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            )}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#64748b",
              whiteSpace: "nowrap",
            }}
          >
            {filtered.length} player{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 52px 1fr 1fr",
            gap: "12px",
            padding: "8px 20px",
            borderBottom: "1px solid rgba(45,212,191,0.15)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#475569",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          <div>{isPositionView ? "POS RNK" : "RANK"}</div>
          <div>POS</div>
          <div>PLAYER</div>
          <div style={{ textAlign: "right" }}>{isPositionView ? "SCHOOL / OVR" : "SCHOOL"}</div>
        </div>

        {/* Player Rows */}
        <div>
          {pageData.map((player, i) => {
            let posRank;
            if (isPositionView) {
              posRank = filtered.indexOf(player) + 1;
            } else {
              posRank = positionRanks[player.r];
            }
            return (
              <PlayerRow
                key={player.r}
                player={player}
                posRank={posRank}
                index={page * PER_PAGE + i}
                isPositionView={isPositionView}
              />
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: page === 0 ? "default" : "pointer",
                color: page === 0 ? "#334155" : "#f1f5f9",
                fontFamily: "'Oswald', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.5px",
                opacity: page === 0 ? 0.4 : 1,
                transition: "all 0.15s",
              }}
            >
              ← PREV
            </button>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#64748b",
                padding: "8px 16px",
              }}
            >
              {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: page >= totalPages - 1 ? "default" : "pointer",
                color: page >= totalPages - 1 ? "#334155" : "#f1f5f9",
                fontFamily: "'Oswald', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.5px",
                opacity: page >= totalPages - 1 ? 0.4 : 1,
                transition: "all 0.15s",
              }}
            >
              NEXT →
            </button>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#334155",
            letterSpacing: "0.5px",
          }}
        >
          DRAFT GUIDE © 2026 · Source: NFL Mock Draft Database (92 Big Boards)
        </div>
      </div>
    </div>
  );
}
