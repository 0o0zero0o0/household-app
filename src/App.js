// src/App.js
import React, { useMemo, useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

/* =============== 공용 아이콘 =============== */
function Icon({ name, size = 16 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "plus")
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  if (name === "list")
    return (
      <svg {...common}>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    );
  if (name === "calendar")
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    );
  if (name === "logout")
    return (
      <svg {...common}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
    );
  if (name === "x")
    return (
      <svg {...common}>
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    );
  if (name === "alert")
    return (
      <svg {...common}>
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    );
  if (name === "wallet")
    return (
      <svg {...common}>
        <path d="M4 7h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
        <path d="M16 11h4" />
      </svg>
    );
  if (name === "utensils")
    return (
      <svg {...common}>
        <path d="M4 3v7a2 2 0 0 0 2 2h0v9" />
        <path d="M11 3v7a2 2 0 0 0 2 2h0v9" />
        <path d="M18 3v18" />
      </svg>
    );
  if (name === "pie")
    return (
      <svg {...common}>
        <path d="M21.21 15.89A10 10 0 1 1 12 2v10z" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    );
  return null;
}

/* =============== 로고 =============== */
function Logo({ className = "", color = "#189EFF" }) {
  return (
    <svg
      viewBox="0 0 356.008 51.313"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TwinWallet logo"
      style={{ height: 24 }}
    >
      <g fill={color}>
        <path d="m41.372,12.494h-15.398v38.004h-10.575V12.494H0V3.141h41.372v9.353Z" />
        <path d="m94.553,16.446l-11.39,34.052h-10.401l-6.16-19.465-6.101,19.465h-10.345l-11.387-34.052h10.924l6.042,21.906,5.927-21.906h10.578l5.983,22.024,6.045-22.024h10.286Z" />
        <path d="m110.782,6.334c0,3.663-2.671,6.334-6.334,6.334s-6.334-2.671-6.334-6.334,2.674-6.334,6.334-6.334,6.334,2.674,6.334,6.334Zm-1.163,44.279h-10.342V16.446h10.342v34.167Z" />
        <path d="m117.411,16.446h10.342v3.486c2.037-2.73,5.174-4.3,9.531-4.3,7.904,0,13.309,5.752,13.309,15.168v19.699h-10.345v-17.957c0-5.171-2.093-8.016-5.986-8.016-4.067,0-6.508,3.193-6.508,8.483v17.491h-10.342V16.446Z" />
        <path d="m216.147,3.141l-13.654,47.357h-10.693l-8.483-29.692-8.483,29.692h-10.694l-13.654-47.357h11.331l8.134,30.97,8.134-30.97h10.983l8.078,30.855,8.194-30.855h10.806Z" />
        <path d="m215.35,33.47c0-10.342,6.801-17.839,16.561-17.839,4.475,0,7.73,1.57,9.764,4.3v-3.486h10.342v34.052h-10.342v-3.486c-2.034,2.73-5.289,4.3-9.764,4.3-9.761,0-16.561-7.497-16.561-17.842Zm26.499,0c0-5.227-3.256-9.005-8.308-9.005-4.941,0-8.078,3.778-8.078,9.005s3.137,9.008,8.078,9.008c5.053,0,8.308-3.778,8.308-9.008Z" />
        <path d="m270.158,50.498h-10.342V1.685h10.342v48.813Z" />
        <path d="m288.293,50.498h-10.342V1.685h10.342v48.813Z" />
        <path d="m294.341,33.47c0-10.342,7.323-17.839,17.724-17.839s17.724,7.438,17.724,17.839c0,.989-.059,2.093-.233,3.315h-24.929c.815,3.949,3.545,6.216,7.438,6.216,2.963,0,5.404-1.045,6.275-2.671h10.401c-1.741,6.508-8.424,10.983-16.676,10.983-10.401,0-17.724-7.438-17.724-17.842Zm25.336-3.368c-.871-4.07-3.545-6.278-7.612-6.278s-6.623,2.208-7.497,6.278h15.109Z" />
        <path d="m356.008,25.336h-6.741v25.162h-10.342v-25.162h-6.741v-8.89h6.741V6.334h10.342v10.112h6.741v8.89Z" />
      </g>
    </svg>
  );
}

/* =============== App =============== */
export default function App() {
  /* auth */
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("auth") === "1";
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  /* modals */
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openEom, setOpenEom] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  /* data */
  const [tx, setTx] = useState([]);

  async function loadTx() {
    const q = query(collection(db, "tx"), orderBy("date", "asc"));
    const snap = await getDocs(q);
    setTx(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function addTx(record) {
    await addDoc(collection(db, "tx"), {
      ...record,
      amount: Number(record.amount) || 0,
      createdAt: Timestamp.now(),
    });
    await loadTx();
  }

  async function deleteTx(id) {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "tx", id));
      await loadTx();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  }

  async function updateTx(id, record) {
    try {
      await updateDoc(doc(db, "tx", id), {
        ...record,
        amount: Number(record.amount) || 0,
      });
      await loadTx();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === "0121") {
      setIsAuthenticated(true);
      try {
        localStorage.setItem("auth", "1");
      } catch {}
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("auth");
    } catch (error) {
      console.error("Error removing auth from localStorage:", error);
    }
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (isAuthenticated) loadTx().catch(console.error);
  }, [isAuthenticated]);

  /* constants & computed */
  const LIMITS = {
    jiyoung: { livingLimit: 120000, diningLimit: 50000 },
    jiwon: { livingLimit: 120000, diningLimit: 50000 },
  };

  const monthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const spent = useMemo(() => {
    const s = { 지영: { 생활: 0, 외식: 0 }, 지원: { 생활: 0, 외식: 0 } };
    for (const t of tx) {
      if (!String(t.date).startsWith(monthKey)) continue;
      if (!["지영", "지원"].includes(t.user)) continue;
      if (!["생활", "외식"].includes(t.category)) continue;
      s[t.user][t.category] += Number(t.amount) || 0;
    }
    return s;
  }, [tx, monthKey]);

  const alerts = [];
  if (LIMITS.jiyoung.diningLimit - spent.지영.외식 <= 10000 && spent.지영.외식 > 0)
    alerts.push("지영의 외식비 한도가 얼마 남지 않았습니다.");
  if (LIMITS.jiwon.diningLimit - spent.지원.외식 <= 10000 && spent.지원.외식 > 0)
    alerts.push("지원의 외식비 한도가 얼마 남지 않았습니다.");
  if (spent.지영.외식 > LIMITS.jiyoung.diningLimit)
    alerts.push("지영의 외식비가 한도를 초과했습니다.");
  if (spent.지원.외식 > LIMITS.jiwon.diningLimit)
    alerts.push("지원의 외식비가 한도를 초과했습니다.");

  /* 로그인 화면 */
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#eff6ff,#ffffff,#e0f2fe)",
          display: "grid",
          placeItems: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 12px 32px rgba(2,132,199,.12)",
            border: "2px solid #bae6fd",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Logo color="#189EFF" />
          </div>

          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 16 }}>
            비밀번호를 입력해주세요
          </p>

          <form onSubmit={handlePasswordSubmit}>
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: `2px solid ${passwordError ? "#fecaca" : "#bae6fd"}`,
                  borderRadius: 14,
                  outline: "none",
                }}
              />
              {passwordError && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  <Icon name="alert" size={16} />
                  비밀번호가 올바르지 않습니다
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: 12,
                background: "linear-gradient(90deg,#38bdf8,#3b82f6)",
                color: "#fff",
                fontWeight: 800,
                padding: "12px 14px",
                borderRadius: 14,
                border: "none",
                boxShadow: "0 6px 16px rgba(59,130,246,.25)",
                cursor: "pointer",
              }}
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* 메인 화면 */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eff6ff,#ffffff,#e0f2fe)",
        color: "#111827",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 16,
        paddingTop: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 상단바 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 4px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              aria-label="내역 작성"
              onClick={() => setOpenAdd(true)}
              title="내역 작성"
              style={styles.iconBtnPrimary}
            >
              <Icon name="plus" />
            </button>
            <button
              aria-label="내 기록 목록"
              onClick={() => setOpenList(true)}
              title="내 기록 목록"
              style={styles.iconBtnGhost}
            >
              <Icon name="list" />
            </button>
          </div>

          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Logo color="#189EFF" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              aria-label="달력 열기"
              onClick={() => setOpenCalendar(true)}
              title="달력 열기"
              style={styles.iconBtnGhost}
            >
              <Icon name="calendar" />
            </button>
            <button
              aria-label="로그아웃"
              onClick={logout}
              title="로그아웃"
              style={styles.iconBtnDanger}
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>

        {/* 알림 */}
        {alerts.length > 0 && (
          <div
            style={{
              width: "100%",
              background: "#fff",
              borderRadius: 20,
              border: "2px solid #fde68a",
              boxShadow: "0 8px 24px rgba(0,0,0,.04)",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "#FEF3C7",
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  color: "#b45309",
                }}
              >
                <Icon name="alert" />
              </div>
              <strong style={{ fontSize: 15 }}>알림</strong>
            </div>
            {alerts.map((a, i) => (
              <p key={i} style={{ marginLeft: 40, fontSize: 13, color: "#7c2d12" }}>
                • {a}
              </p>
            ))}
          </div>
        )}

        {/* 사용자 카드 */}
        <UserCard
          name="지영"
          living={spent.지영.생활}
          livingLimit={LIMITS.jiyoung.livingLimit}
          dining={spent.지영.외식}
          diningLimit={LIMITS.jiyoung.diningLimit}
        />
        <UserCard
          name="지원"
          living={spent.지원.생활}
          livingLimit={LIMITS.jiwon.livingLimit}
          dining={spent.지원.외식}
          diningLimit={LIMITS.jiwon.diningLimit}
        />

        {/* 액션 */}
        <button onClick={() => setOpenEom(true)} style={styles.actionCard}>
          <div style={styles.actionIcon}>
            <Icon name="pie" />
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1f2937" }}>월말 요약 보기</p>
        </button>
      </div>

      {/* 모달들 */}
      {openCalendar && <CalendarModal onClose={() => setOpenCalendar(false)} tx={tx} />}
      {openList && (
        <ListModal
          onClose={() => setOpenList(false)}
          tx={tx}
          onDelete={deleteTx}
          onEdit={(item) => {
            setEditTarget(item);
            setOpenEdit(true);
          }}
        />
      )}
      {openEom && <EomSummaryModal onClose={() => setOpenEom(false)} tx={tx} />}
      {openAdd && <AddTxModal onClose={() => setOpenAdd(false)} onSubmit={addTx} />}
      {openEdit && (
        <EditTxModal
          onClose={() => {
            setOpenEdit(false);
            setEditTarget(null);
          }}
          onSubmit={updateTx}
          initialData={editTarget}
        />
      )}
    </div>
  );
}

/* =============== 하위 컴포넌트 =============== */

function UserCard({ name, living, livingLimit, dining, diningLimit }) {
  const leftLiving = Math.max(0, livingLimit - living);
  const leftDining = Math.max(0, diningLimit - dining);

  return (
    <div style={styles.card}>
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, marginBottom: 12, color: "#0284c7" }}>
        💙 {name}
      </h3>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0284c7", marginBottom: 8 }}>
          <div style={styles.bulletIcon("#f0f9ff")}>
            <Icon name="wallet" size={14} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>생활비</span>
        </div>
        <ProgressBar value={(living / livingLimit) * 100} color="sky" />
        <p style={{ fontSize: 12, color: "#4b5563", margin: "8px 0 0" }}>
          {living.toLocaleString()} / {livingLimit.toLocaleString()}원
        </p>
        <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 800, margin: 0 }}>
          💰 남은 금액: {leftLiving.toLocaleString()}원
        </p>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ea580c", marginBottom: 8 }}>
          <div style={styles.bulletIcon("#fff7ed")}>
            <Icon name="utensils" size={14} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>외식비</span>
        </div>
        <ProgressBar value={(dining / diningLimit) * 100} color="orange" />
        <p style={{ fontSize: 12, color: "#4b5563", margin: "8px 0 0" }}>
          {dining.toLocaleString()} / {diningLimit.toLocaleString()}원
        </p>
        <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 800, margin: 0 }}>
          💰 남은 금액: {leftDining.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ value, color = "sky" }) {
  const bg = color === "sky" ? "#e0f2fe" : "#ffedd5";
  const gradFrom = color === "sky" ? "#38bdf8" : "#fb923c";
  const gradTo = color === "sky" ? "#3b82f6" : "#ef4444";
  return (
    <div
      style={{
        height: 10,
        width: "100%",
        background: bg,
        borderRadius: 999,
        overflow: "hidden",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
          transition: "width .5s ease",
          borderRadius: 999,
        }}
      />
    </div>
  );
}

/* -------- 달력 모달 -------- */
function CalendarModal({ onClose, tx }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(formatDate(today));
  const { year, month, grid } = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const daily = useMemo(() => summarizeByDate(tx), [tx]);

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modal, maxWidth: 420 }}>
        <div style={styles.modalHead}>
          <div>📅 달력</div>
          <button onClick={onClose} style={styles.iconBtn}>
            <Icon name="x" />
          </button>
        </div>

        <div style={styles.modalBody}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button
              style={styles.btnMini}
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              ◀
            </button>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {year}년 {month + 1}월
            </div>
            <button
              style={styles.btnMini}
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              ▶
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              textAlign: "center",
              fontSize: 12,
              color: "#6b7280",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} style={{ padding: "8px 0" }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
            {grid.map((cell, idx) => {
              if (!cell) return <div key={idx} style={{ height: 44 }} />;
              const iso = formatDate(cell);
              const isToday = sameDate(cell, today);
              const isSelected = iso === selected;
              const sum = daily[iso]?.total || 0;

              return (
                <button
                  key={idx}
                  onClick={() => setSelected(iso)}
                  style={{
                    height: 44,
                    border: "2px solid",
                    borderColor: isSelected ? "#7dd3fc" : "transparent",
                    borderRadius: 12,
                    position: "relative",
                    background: isSelected ? "#f0f9ff" : "white",
                    fontWeight: 700,
                    color: isSelected ? "#0369a1" : "#111827",
                  }}
                >
                  <div style={{ display: "grid", placeItems: "center", height: "100%", position: "relative" }}>
                    <span style={{ position: "relative", color: isToday ? "white" : undefined }}>
                      {cell.getDate()}
                      {isToday && (
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: -1,
                            background: "linear-gradient(135deg,#38bdf8,#3b82f6)",
                            borderRadius: 999,
                          }}
                        />
                      )}
                    </span>
                  </div>
                  {sum > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 6,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 6,
                        height: 6,
                        background: "#22c55e",
                        borderRadius: 999,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 16,
              borderTop: "2px solid #bae6fd",
              paddingTop: 12,
              background: "#f0f9ff",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 800, color: "#0369a1", marginBottom: 8 }}>
              {selected.replaceAll("-", ".")} 사용 내역
            </div>
            <DateBreakdown selected={selected} tx={tx} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 달력 하단 당일 합계 */
function DateBreakdown({ selected, tx }) {
  const filtered = tx.filter((t) => String(t.date) === selected);
  const totalBy = filtered.reduce(
    (acc, t) => {
      const amt = Number(t.amount) || 0;
      acc.total += amt;
      acc.byUser[t.user] = (acc.byUser[t.user] || 0) + amt;
      return acc;
    },
    { total: 0, byUser: { 지영: 0, 지원: 0 } }
  );

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#0284c7", fontWeight: 700 }}>지영</span>
        <span style={{ fontWeight: 800 }}>₩{totalBy.byUser.지영.toLocaleString("ko-KR")}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#0284c7", fontWeight: 700 }}>지원</span>
        <span style={{ fontWeight: 800 }}>₩{totalBy.byUser.지원.toLocaleString("ko-KR")}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 900,
          fontSize: 16,
          paddingTop: 8,
          borderTop: "2px solid #bae6fd",
        }}
      >
        <span>합계</span>
        <span style={{ color: "#0284c7" }}>₩{totalBy.total.toLocaleString("ko-KR")}</span>
      </div>
    </div>
  );
}

/* -------- 목록 모달 (수정/삭제 포함) -------- */
function ListModal({ onClose, tx, onDelete, onEdit }) {
  const today = new Date();
  const [who, setWho] = useState("all");
  const [period, setPeriod] = useState("week");
  const [start, setStart] = useState(formatDate(getWeekStart(today)));
  const [end, setEnd] = useState(formatDate(getWeekEnd(today)));

  const applyPreset = (p) => {
    setPeriod(p);
    if (p === "week") {
      setStart(formatDate(getWeekStart(today)));
      setEnd(formatDate(getWeekEnd(today)));
    } else if (p === "month") {
      setStart(formatDate(new Date(today.getFullYear(), today.getMonth(), 1)));
      setEnd(formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)));
    }
  };

  const rows = useMemo(() => {
    return tx
      .filter((t) => (who === "all" ? true : t.user === who))
      .filter((t) => String(t.date) >= start && String(t.date) <= end)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [tx, who, start, end]);

  const total = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHead}>
          <div>📋 내 기록 목록</div>
          <button onClick={onClose} style={styles.iconBtn}>
            <Icon name="x" />
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* 필터 - 이름 */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>이름</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {[
                { label: "전체", value: "all" },
                { label: "지영", value: "지영" },
                { label: "지원", value: "지원" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    background: "#f0f9ff",
                    borderRadius: 12,
                    cursor: "pointer",
                    border: who === opt.value ? "2px solid #7dd3fc" : "2px solid transparent",
                  }}
                >
                  <input
                    type="radio"
                    checked={who === opt.value}
                    onChange={() => setWho(opt.value)}
                    style={{ accentColor: "#38bdf8" }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* 필터 - 기간 */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>기간</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "이번 주", value: "week" },
                { label: "이번 달", value: "month" },
                { label: "직접 설정", value: "custom" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    background: "#f0f9ff",
                    borderRadius: 12,
                    cursor: "pointer",
                    border: period === opt.value ? "2px solid #7dd3fc" : "2px solid transparent",
                  }}
                >
                  <input
                    type="radio"
                    checked={period === opt.value}
                    onChange={() => applyPreset(opt.value)}
                    style={{ accentColor: "#38bdf8" }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {period === "custom" && (
              <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  style={styles.date}
                />
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={styles.date} />
              </div>
            )}
          </div>

          {/* 리스트 */}
          <div style={{ border: "2px solid #bae6fd", borderRadius: 16, maxHeight: 340, overflow: "auto" }}>
            {rows.length === 0 && (
              <div style={{ padding: 16, textAlign: "center", color: "#9ca3af" }}>해당 기간 내 기록 없음</div>
            )}

            {rows.map((r) => (
              <div
                key={r.id || `${r.date}-${r.item}-${r.amount}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "84px 1fr 110px", // 날짜 | 내용 | 액션(수정/삭제)
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {/* 날짜 */}
                <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                  {String(r.date).replaceAll("-", ".")}
                </div>

                {/* 내용 + 금액(오른쪽 정렬) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#111827",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={`${r.user} ${r.place} — ${r.item}`}
                  >
                    <span style={{ color: "#0284c7", fontWeight: 800, marginRight: 4 }}>{r.user}</span>
                    {r.place} — {r.item}
                  </div>
                  <div style={{ fontWeight: 800, color: "#075985", whiteSpace: "nowrap" }}>
                    ₩{Number(r.amount).toLocaleString("ko-KR")}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                  <button
                    onClick={() => onEdit(r)}
                    style={{
                      ...styles.btnMini,
                      background: "#eff6ff",
                      color: "#2563eb",
                      borderColor: "#bfdbfe",
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    style={{
                      ...styles.btnMini,
                      background: "#fef2f2",
                      color: "#dc2626",
                      borderColor: "#fecaca",
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 합계 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 900,
              fontSize: 16,
              background: "linear-gradient(90deg,#f0f9ff,#eff6ff)",
              padding: "12px 16px",
              borderRadius: 16,
              border: "2px solid #bae6fd",
              marginTop: 12,
            }}
          >
            <span>합계</span>
            <span style={{ color: "#0284c7" }}>₩{total.toLocaleString("ko-KR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- 월말 요약 -------- */
function EomSummaryModal({ onClose, tx }) {
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const monthTx = tx.filter((t) => String(t.date).startsWith(monthKey));
  const totals = monthTx.reduce(
    (acc, t) => {
      const amt = Number(t.amount) || 0;
      acc.total += amt;
      acc.byUser[t.user] = (acc.byUser[t.user] || 0) + amt;
      acc.byCategory[t.category] = (acc.byCategory[t.category] || 0) + amt;
      acc.byPlace[t.place] = (acc.byPlace[t.place] || 0) + amt;
      return acc;
    },
    { total: 0, byUser: { 지영: 0, 지원: 0 }, byCategory: { 생활: 0, 외식: 0 }, byPlace: {} }
  );
  const topPlaces = Object.entries(totals.byPlace)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modal, borderColor: "#e9d5ff" }}>
        <div style={{ ...styles.modalHead, background: "linear-gradient(90deg,#faf5ff,#fdf2f8)" }}>
          <div style={{ color: "#7e22ce", fontWeight: 800 }}>📊 월말 요약</div>
          <button onClick={onClose} style={styles.iconBtn}>
            <Icon name="x" />
          </button>
        </div>

        <div style={styles.modalBody}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 900,
              fontSize: 18,
              background: "linear-gradient(90deg,#f0f9ff,#eff6ff)",
              padding: "14px 16px",
              borderRadius: 16,
              border: "2px solid #bae6fd",
              marginBottom: 12,
            }}
          >
            <span>💸 이번 달 총 사용</span>
            <span style={{ color: "#0284c7" }}>₩{totals.total.toLocaleString("ko-KR")}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ border: "2px solid #bae6fd", borderRadius: 16, padding: 12, background: "#f0f9ff" }}>
              <div style={{ fontWeight: 800, marginBottom: 8, color: "#0369a1" }}>👥 사용자별</div>
              <div style={styles.kvRow}>
                <span>지영</span>
                <span style={{ fontWeight: 800 }}>
                  ₩{(totals.byUser.지영 || 0).toLocaleString("ko-KR")}
                </span>
              </div>
              <div style={styles.kvRow}>
                <span>지원</span>
                <span style={{ fontWeight: 800 }}>
                  ₩{(totals.byUser.지원 || 0).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>

            <div style={{ border: "2px solid #fdba74", borderRadius: 16, padding: 12, background: "#fff7ed" }}>
              <div style={{ fontWeight: 800, marginBottom: 8, color: "#9a3412" }}>📑 카테고리별</div>
              <div style={styles.kvRow}>
                <span>생활</span>
                <span style={{ fontWeight: 800 }}>
                  ₩{(totals.byCategory.생활 || 0).toLocaleString("ko-KR")}
                </span>
              </div>
              <div style={styles.kvRow}>
                <span>외식</span>
                <span style={{ fontWeight: 800 }}>
                  ₩{(totals.byCategory.외식 || 0).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>
          </div>

          <div style={{ border: "2px solid #e9d5ff", borderRadius: 16, padding: 12, background: "#faf5ff", marginTop: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: "#7e22ce" }}>🏆 어디서 많이 썼나요? (Top 3)</div>
            {topPlaces.length === 0 && (
              <div style={{ textAlign: "center", color: "#9ca3af", padding: 8 }}>데이터 없음</div>
            )}
            {topPlaces.map(([place, amt], idx) => (
              <div key={place} style={styles.kvRow}>
                <span>
                  <span style={{ display: "inline-block", width: 18, fontWeight: 900, color: "#6d28d9" }}>
                    {idx + 1}.
                  </span>
                  {place}
                </span>
                <span style={{ fontWeight: 800 }}>₩{amt.toLocaleString("ko-KR")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- 내역 추가 -------- */
function AddTxModal({ onClose, onSubmit }) {
  const todayIso = formatDate(new Date());
  const [form, setForm] = useState({
    date: todayIso,
    user: "지영",
    category: "생활",
    place: "",
    item: "",
    amount: "",
  });

  const canSubmit =
    form.date &&
    form.user &&
    form.category &&
    form.place.trim() &&
    form.item.trim() &&
    String(form.amount).trim() !== "" &&
    !Number.isNaN(Number(form.amount));

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({ ...form, amount: Number(form.amount) || 0 });
    onClose();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHead}>
          <div>✏️ 내역 작성</div>
          <button onClick={onClose} style={styles.iconBtn}>
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.modalBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={styles.label}>날짜</div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <div style={styles.label}>사용자</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["지영", "지원"].map((u) => (
                  <label key={u} style={styles.choice}>
                    <input
                      type="radio"
                      checked={form.user === u}
                      onChange={() => handleChange("user", u)}
                      style={{ accentColor: "#38bdf8" }}
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={styles.label}>카테고리</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["생활", "외식"].map((c) => (
                <label key={c} style={styles.choice}>
                  <input
                    type="radio"
                    checked={form.category === c}
                    onChange={() => handleChange("category", c)}
                    style={{ accentColor: "#38bdf8" }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={styles.label}>사용처</div>
              <input
                type="text"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="이마트"
                style={styles.input}
              />
            </div>
            <div>
              <div style={styles.label}>구매 물건</div>
              <input
                type="text"
                value={form.item}
                onChange={(e) => handleChange("item", e.target.value)}
                placeholder="계란"
                style={styles.input}
              />
            </div>
          </div>

          <div>
            <div style={styles.label}>금액(원)</div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="10000"
              style={{ ...styles.input, fontSize: 16, fontWeight: 800 }}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              color: "#fff",
              fontWeight: 900,
              background: canSubmit ? "linear-gradient(90deg,#38bdf8,#3b82f6)" : "#9ca3af",
              cursor: canSubmit ? "pointer" : "not-allowed",
              border: "none",
              boxShadow: canSubmit ? "0 6px 16px rgba(59,130,246,.25)" : "none",
            }}
          >
            💾 저장하기
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------- 내역 수정 -------- */
function EditTxModal({ onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    date: initialData?.date || "",
    user: initialData?.user || "지영",
    category: initialData?.category || "생활",
    place: initialData?.place || "",
    item: initialData?.item || "",
    amount: String(initialData?.amount || ""),
  });

  const canSubmit =
    form.date &&
    form.user &&
    form.category &&
    form.place.trim() &&
    form.item.trim() &&
    String(form.amount).trim() !== "" &&
    !Number.isNaN(Number(form.amount));

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit(initialData.id, {
      date: form.date,
      user: form.user,
      category: form.category,
      place: form.place,
      item: form.item,
      amount: Number(form.amount) || 0,
    });
    onClose();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modal, borderColor: "#bfdbfe" }}>
        <div style={{ ...styles.modalHead, background: "linear-gradient(90deg,#eff6ff,#e0e7ff)" }}>
          <div style={{ color: "#1d4ed8", fontWeight: 800 }}>✏️ 내역 수정</div>
          <button onClick={onClose} style={styles.iconBtn}>
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.modalBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={styles.label}>날짜</div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                style={styles.inputBlue}
              />
            </div>
            <div>
              <div style={styles.label}>사용자</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["지영", "지원"].map((u) => (
                  <label key={u} style={styles.choiceBlue}>
                    <input
                      type="radio"
                      checked={form.user === u}
                      onChange={() => handleChange("user", u)}
                      style={{ accentColor: "#3b82f6" }}
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={styles.label}>카테고리</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["생활", "외식"].map((c) => (
                <label key={c} style={c === "생활" ? styles.choiceSky : styles.choiceOrange}>
                  <input
                    type="radio"
                    checked={form.category === c}
                    onChange={() => handleChange("category", c)}
                    style={{ accentColor: c === "생활" ? "#38bdf8" : "#fb923c" }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={styles.label}>사용처</div>
              <input
                type="text"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="이마트"
                style={styles.inputBlue}
              />
            </div>
            <div>
              <div style={styles.label}>구매 물건</div>
              <input
                type="text"
                value={form.item}
                onChange={(e) => handleChange("item", e.target.value)}
                placeholder="계란"
                style={styles.inputBlue}
              />
            </div>
          </div>

          <div>
            <div style={styles.label}>금액(원)</div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="10000"
              style={{ ...styles.inputBlue, fontSize: 16, fontWeight: 800 }}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              color: "#fff",
              fontWeight: 900,
              background: canSubmit ? "linear-gradient(90deg,#60a5fa,#4f46e5)" : "#9ca3af",
              cursor: canSubmit ? "pointer" : "not-allowed",
              border: "none",
              boxShadow: canSubmit ? "0 6px 16px rgba(79,70,229,.25)" : "none",
            }}
          >
            💾 수정하기
          </button>
        </form>
      </div>
    </div>
  );
}

/* =============== utils =============== */
function sameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function buildMonthGrid(anchor) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startIdx = first.getDay();
  const days = last.getDate();
  const cells = Array(startIdx)
    .fill(null)
    .concat(Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)));
  while (cells.length % 7 !== 0) cells.push(null);
  return { year, month, grid: cells };
}
function summarizeByDate(tx) {
  const map = {};
  for (const t of tx) {
    const key = String(t.date);
    map[key] = map[key] || { total: 0, byUser: { 지영: 0, 지원: 0 } };
    const amt = Number(t.amount) || 0;
    map[key].total += amt;
    if (t.user === "지영" || t.user === "지원") map[key].byUser[t.user] += amt;
  }
  return map;
}
function getWeekStart(d) {
  const day = (d.getDay() + 6) % 7;
  const s = new Date(d);
  s.setDate(d.getDate() - day);
  return s;
}
function getWeekEnd(d) {
  const s = getWeekStart(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  return e;
}

/* =============== 스타일 모음 =============== */
const styles = {
  iconBtn: {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    cursor: "pointer",
  },
  iconBtnGhost: {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "#eaf4ff",
    color: "#0ea5e9",
    border: "none",
    cursor: "pointer",
  },
  iconBtnPrimary: {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "linear-gradient(135deg,#38bdf8,#3b82f6)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(59,130,246,.25)",
  },
  iconBtnDanger: {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "#fee2e2",
    color: "#ef4444",
    border: "none",
    cursor: "pointer",
  },
  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    background: "linear-gradient(90deg,#faf5ff,#fdf2f8)",
    borderRadius: 16,
    border: "2px solid #e9d5ff",
    cursor: "pointer",
  },
  actionIcon: {
    width: 36,
    height: 36,
    background: "#fff",
    color: "#8b5cf6",
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
  },
  card: {
    background: "#fff",
    border: "2px solid #bae6fd",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,.04)",
  },
  bulletIcon: (bg) => ({
    width: 24,
    height: 24,
    background: bg,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
  }),
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    backdropFilter: "blur(2px)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 16px 48px rgba(0,0,0,.12)",
    border: "2px solid #bae6fd",
    overflow: "hidden",
  },
  modalHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "linear-gradient(90deg,#f0f9ff,#eff6ff)",
    fontWeight: 800,
    color: "#0ea5e9",
  },
  modalBody: {
    padding: 16,
    fontSize: 14,
    display: "grid",
    gap: 12,
  },
  btnMini: {
    padding: "6px 10px",
    borderRadius: 10,
    border: "2px solid #e5e7eb",
    background: "#f9fafb",
    fontWeight: 700,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #bae6fd",
    borderRadius: 12,
    outline: "none",
  },
  inputBlue: {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #bfdbfe",
    borderRadius: 12,
    outline: "none",
  },
  date: {
    width: "100%",
    padding: "10px 12px",
    border: "2px solid #bae6fd",
    borderRadius: 12,
    outline: "none",
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    marginBottom: 6,
  },
  choice: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    background: "#f0f9ff",
    borderRadius: 12,
    cursor: "pointer",
  },
  choiceBlue: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    background: "#eff6ff",
    borderRadius: 12,
    cursor: "pointer",
    border: "2px solid #bfdbfe",
  },
  choiceSky: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    background: "#f0f9ff",
    borderRadius: 12,
    cursor: "pointer",
    border: "2px solid #bae6fd",
  },
  choiceOrange: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    background: "#fff7ed",
    borderRadius: 12,
    cursor: "pointer",
    border: "2px solid #fdba74",
  },
  kvRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 14,
  },
};
