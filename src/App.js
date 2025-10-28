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

/* ------------------------------ 심플 아이콘 ------------------------------ */
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
  if (name === "plus") return (<svg {...common}><path d="M12 5v14M5 12h14"/></svg>);
  if (name === "list") return (<svg {...common}><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>);
  if (name === "calendar") return (<svg {...common}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>);
  if (name === "logout") return (<svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>);
  if (name === "x") return (<svg {...common}><path d="M18 6 6 18M6 6l12 12"/></svg>);
  if (name === "alert") return (<svg {...common}><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>);
  if (name === "wallet") return (<svg {...common}><path d="M4 7h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><path d="M16 11h4"/></svg>);
  if (name === "utensils") return (<svg {...common}><path d="M4 3v7a2 2 0 0 0 2 2h0v9"/><path d="M11 3v7a2 2 0 0 0 2 2h0v9"/><path d="M18 3v18"/></svg>);
  if (name === "pie") return (<svg {...common}><path d="M21.21 15.89A10 10 0 1 1 12 2v10z"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>);
  return null;
}

/* ------------------------------ 로고 ------------------------------ */
function Logo({ className = "", color = "#189EFF" }) {
  return (
    <svg
      viewBox="0 0 356.008 51.313"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TwinWallet logo"
    >
      <g fill={color}>
        <path d="m41.372,12.494h-15.398v38.004h-10.575V12.494H0V3.141h41.372v9.353Z"/>
        <path d="m94.553,16.446l-11.39,34.052h-10.401l-6.16-19.465-6.101,19.465h-10.345l-11.387-34.052h10.924l6.042,21.906,5.927-21.906h10.578l5.983,22.024,6.045-22.024h10.286Z"/>
        <path d="m110.782,6.334c0,3.663-2.671,6.334-6.334,6.334s-6.334-2.671-6.334-6.334,2.674-6.334,6.334-6.334,6.334,2.674,6.334,6.334Zm-1.163,44.279h-10.342V16.446h10.342v34.167Z"/>
        <path d="m117.411,16.446h10.342v3.486c2.037-2.73,5.174-4.3,9.531-4.3,7.904,0,13.309,5.752,13.309,15.168v19.699h-10.345v-17.957c0-5.171-2.093-8.016-5.986-8.016-4.067,0-6.508,3.193-6.508,8.483v17.491h-10.342V16.446Z"/>
        <path d="m216.147,3.141l-13.654,47.357h-10.693l-8.483-29.692-8.483,29.692h-10.694l-13.654-47.357h11.331l8.134,30.97,8.134-30.97h10.983l8.078,30.855,8.194-30.855h10.806Z"/>
        <path d="m215.35,33.47c0-10.342,6.801-17.839,16.561-17.839,4.475,0,7.73,1.57,9.764,4.3v-3.486h10.342v34.052h-10.342v-3.486c-2.034,2.73-5.289,4.3-9.764,4.3-9.761,0-16.561-7.497-16.561-17.842Zm26.499,0c0-5.227-3.256-9.005-8.308-9.005-4.941,0-8.078,3.778-8.078,9.005s3.137,9.008,8.078,9.008c5.053,0,8.308-3.778,8.308-9.008Z"/>
        <path d="m270.158,50.498h-10.342V1.685h10.342v48.813Z"/>
        <path d="m288.293,50.498h-10.342V1.685h10.342v48.813Z"/>
        <path d="m294.341,33.47c0-10.342,7.323-17.839,17.724-17.839s17.724,7.438,17.724,17.839c0,.989-.059,2.093-.233,3.315h-24.929c.815,3.949,3.545,6.216,7.438,6.216,2.963,0,5.404-1.045,6.275-2.671h10.401c-1.741,6.508-8.424,10.983-16.676,10.983-10.401,0-17.724-7.438-17.724-17.842Zm25.336-3.368c-.871-4.07-3.545-6.278-7.612-6.278s-6.623,2.208-7.497,6.278h15.109Z"/>
        <path d="m356.008,25.336h-6.741v25.162h-10.342v-25.162h-6.741v-8.89h6.741V6.334h10.342v10.112h6.741v8.89Z"/>
      </g>
    </svg>
  );
}

/* ------------------------------ App ------------------------------ */
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
    if (passwordInput === "!0121") {
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
    } catch {}
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
      <div className="app-bg center">
        <div className="card-lg">
          <div className="center mb16">
            <Logo color="#189EFF" />
          </div>

          <h2 className="title center mb4">🔐 환영합니다!</h2>
          <p className="sub center mb12">비밀번호를 입력해주세요</p>

          <form onSubmit={handlePasswordSubmit} className="col gap12">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                className="input"
                autoFocus
              />
              {passwordError && (
                <p className="err">
                  <Icon name="alert" size={16} />
                  비밀번호가 올바르지 않습니다
                </p>
              )}
            </div>
            <button type="submit" className="button w100">확인</button>
          </form>
        </div>
      </div>
    );
  }

  /* 메인 화면 */
  return (
    <div className="app-bg">
      <div className="shell">
        {/* 상단바 */}
        <div className="topbar">
          <div className="row gap4">
            <button aria-label="내역 작성" onClick={() => setOpenAdd(true)} className="iconbtn primary">
              <Icon name="plus" />
            </button>
            <button aria-label="내 기록 목록" onClick={() => setOpenList(true)} className="iconbtn ghost">
              <Icon name="list" />
            </button>
          </div>

          <div className="logo-wrap">
            <Logo color="#189EFF" />
          </div>

          <div className="row gap4">
            <button aria-label="달력 열기" onClick={() => setOpenCalendar(true)} className="iconbtn ghost">
              <Icon name="calendar" />
            </button>
            <button aria-label="로그아웃" onClick={logout} className="iconbtn danger" title="로그아웃">
              <Icon name="logout" />
            </button>
          </div>
        </div>

        {/* 알림 */}
        {alerts.length > 0 && (
          <div className="notice">
            <div className="row gap8 mb8">
              <div className="notice-ico"><Icon name="alert" /></div>
              <strong className="text-base">알림</strong>
            </div>
            {alerts.map((a, i) => (
              <p key={i} className="text-sm ml40">• {a}</p>
            ))}
          </div>
        )}

        {/* 사용자 카드 */}
        <div className="grid">
          <UserCard
            name="지영"
            living={spent.지영.생활}
            livingLimit={LIMITS.jiyoung.livingLimit}
            dining={spent.지영.외식}
            diningLimit={LIMITS.jiyoung.diningLimit}
          />
        </div>
        <div className="grid mtneg8">
          <UserCard
            name="지원"
            living={spent.지원.생활}
            livingLimit={LIMITS.jiwon.livingLimit}
            dining={spent.지원.외식}
            diningLimit={LIMITS.jiwon.diningLimit}
          />
        </div>

        {/* 액션 */}
        <div className="col gap12 w100">
          <ActionCard icon={<Icon name="pie" />} text="월말 요약 보기" onClick={() => setOpenEom(true)} />
        </div>
      </div>

      {/* 모달 */}
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

/* -------------------------- 하위 컴포넌트 -------------------------- */
function UserCard({ name, living, livingLimit, dining, diningLimit }) {
  const leftLiving = Math.max(0, livingLimit - living);
  const leftDining = Math.max(0, diningLimit - dining);

  return (
    <div className="card">
      <h3 className="card-title">💙 {name}</h3>

      <div className="mb12">
        <div className="row gap8 title-sky mb8">
          <div className="pill-sky">
            <Icon name="wallet" size={14} />
          </div>
          <span className="text-sm fw600">생활비</span>
        </div>
        <ProgressBar value={(living / livingLimit) * 100} color="sky" />
        <p className="muted mt8">
          {living.toLocaleString()} / {livingLimit.toLocaleString()}원
        </p>
        <p className="left-money">💰 남은 금액: {leftLiving.toLocaleString()}원</p>
      </div>

      <div>
        <div className="row gap8 title-orange mb8">
          <div className="pill-orange">
            <Icon name="utensils" size={14} />
          </div>
          <span className="text-sm fw600">외식비</span>
        </div>
        <ProgressBar value={(dining / diningLimit) * 100} color="orange" />
        <p className="muted mt8">
          {dining.toLocaleString()} / {diningLimit.toLocaleString()}원
        </p>
        <p className="left-money">💰 남은 금액: {leftDining.toLocaleString()}원</p>
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

function ActionCard({ icon, text, onClick }) {
  return (
    <button className="action" onClick={onClick}>
      <div className="action-ico">{icon}</div>
      <p className="text-sm fw600 text-900">{text}</p>
    </button>
  );
}

/* ------------------------------ 달력 모달 ------------------------------ */
function CalendarModal({ onClose, tx }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(formatDate(today));
  const { year, month, grid } = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const daily = useMemo(() => summarizeByDate(tx), [tx]);

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-head">
          <div>📅 달력</div>
          <button className="iconbtn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <div className="modal-body">
          <div className="row between mb12">
            <button
              className="btn-mini"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
            >
              ◀
            </button>
            <div className="text-lg fw700">
              {year}년 {month + 1}월
            </div>
            <button
              className="btn-mini"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
            >
              ▶
            </button>
          </div>

          <div className="cal-head">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="cal-head-cell">
                {d}
              </div>
            ))}
          </div>

          <div className="cal-grid">
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
                  className={`cal-cell ${isSelected ? "sel" : ""}`}
                >
                  <div className={`cal-num ${isToday ? "today" : ""}`}>
                    {cell.getDate()}
                  </div>
                  {sum > 0 && <span className="cal-dot" />}
                </button>
              );
            })}
          </div>

          <div className="cal-bottom">
            <div className="cal-bottom-title">
              {selected.replaceAll("-", ".")} 사용 내역
            </div>
            <DateBreakdown selected={selected} tx={tx} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ DateBreakdown 컴포넌트 */
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
    <div className="col gap6">
      <div className="row between">
        <span className="text-sky fw600">지영</span>
        <span className="fw700">
          ₩{totalBy.byUser.지영.toLocaleString("ko-KR")}
        </span>
      </div>
      <div className="row between">
        <span className="text-sky fw600">지원</span>
        <span className="fw700">
          ₩{totalBy.byUser.지원.toLocaleString("ko-KR")}
        </span>
      </div>
      <div className="row between total-line">
        <span>합계</span>
        <span className="text-sky-strong">
          ₩{totalBy.total.toLocaleString("ko-KR")}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ 목록 모달 (수정/삭제 포함) ------------------------------ */
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-head">
          <div>📋 내 기록 목록</div>
          <button className="iconbtn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <div className="modal-body">
          {/* 필터 */}
          <div className="mb12">
            <div className="label">이름</div>
            <div className="row gap8">
              {[
                { label: "전체", value: "all" },
                { label: "지영", value: "지영" },
                { label: "지원", value: "지원" },
              ].map((opt) => (
                <label key={opt.value} className="chip">
                  <input
                    type="radio"
                    checked={who === opt.value}
                    onChange={() => setWho(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mb12">
            <div className="label">기간</div>
            <div className="row gap8 wrap">
              {[
                { label: "이번 주", value: "week" },
                { label: "이번 달", value: "month" },
                { label: "직접 설정", value: "custom" },
              ].map((opt) => (
                <label key={opt.value} className="chip">
                  <input
                    type="radio"
                    checked={period === opt.value}
                    onChange={() => applyPreset(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {period === "custom" && (
              <div className="grid2 mt8">
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="date"
                />
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="date"
                />
              </div>
            )}
          </div>

          {/* 리스트 */}
          <div className="listbox">
            {rows.length === 0 && (
              <div className="empty">해당 기간 내 기록 없음</div>
            )}

            {rows.map((r) => (
              <div key={r.id || `${r.date}-${r.item}-${r.amount}`} className="rowline">
                <div className="row-date">
                  {String(r.date).replaceAll("-", ".")}
                </div>

                <div className="row-main">
                  <div className="row-text">
                    <span className="user-tag">{r.user}</span>
                    {r.place} — {r.item}
                  </div>
                  <div className="row-money">
                    ₩{Number(r.amount).toLocaleString("ko-KR")}
                  </div>
                </div>

                {/* ✅ 작게/슬림하게 바꾼 버튼들 */}
                <div className="row-actions">
                  <button className="btn-mini edit" onClick={() => onEdit(r)}>
                    수정
                  </button>
                  <button className="btn-mini del" onClick={() => onDelete(r.id)}>
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sumline">
            <span>합계</span>
            <span className="text-sky-strong">
              ₩{total.toLocaleString("ko-KR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ 월말 요약 모달 ------------------------------ */
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
    <div className="modal-overlay">
      <div className="modal purple">
        <div className="modal-head">
          <div>📊 월말 요약</div>
          <button className="iconbtn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <div className="modal-body">
          <div className="sumcard">
            <span>💸 이번 달 총 사용</span>
            <span className="text-sky-strong">
              ₩{totals.total.toLocaleString("ko-KR")}
            </span>
          </div>

          <div className="grid2 gap12">
            <div className="box sky">
              <div className="box-title">👥 사용자별</div>
              <div className="row between mb6">
                <span className="muted-600">지영</span>
                <span className="fw600">
                  ₩{totals.byUser.지영.toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="row between">
                <span className="muted-600">지원</span>
                <span className="fw600">
                  ₩{totals.byUser.지원.toLocaleString("ko-KR")}
                </span>
              </div>
            </div>

            <div className="box orange">
              <div className="box-title">📑 카테고리별</div>
              <div className="row between mb6">
                <span className="muted-600">생활</span>
                <span className="fw600">
                  ₩{(totals.byCategory.생활 || 0).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="row between">
                <span className="muted-600">외식</span>
                <span className="fw600">
                  ₩{(totals.byCategory.외식 || 0).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>
          </div>

          <div className="box purple mt12">
            <div className="box-title">🏆 어디서 많이 썼나요? (Top 3)</div>
            {topPlaces.length === 0 && (
              <div className="empty">데이터 없음</div>
            )}
            {topPlaces.map(([place, amt], idx) => (
              <div key={place} className="row between mb6">
                <span className="muted-600">
                  <span className="rank">{idx + 1}.</span>
                  {place}
                </span>
                <span className="fw600">₩{amt.toLocaleString("ko-KR")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ 추가/수정 모달 ------------------------------ */
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
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-head">
          <div>✏️ 내역 작성</div>
          <button className="iconbtn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body col gap12">
          <div className="grid2 gap8">
            <div>
              <div className="label">날짜</div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <div className="label">사용자</div>
              <div className="row gap8">
                {["지영", "지원"].map((u) => (
                  <label key={u} className="chip">
                    <input
                      type="radio"
                      checked={form.user === u}
                      onChange={() => handleChange("user", u)}
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="label">카테고리</div>
            <div className="row gap8">
              <label className="chip sky">
                <input
                  type="radio"
                  checked={form.category === "생활"}
                  onChange={() => handleChange("category", "생활")}
                />
                생활
              </label>
              <label className="chip orange">
                <input
                  type="radio"
                  checked={form.category === "외식"}
                  onChange={() => handleChange("category", "외식")}
                />
                외식
              </label>
            </div>
          </div>

          <div className="grid2 gap8">
            <div>
              <div className="label">사용처</div>
              <input
                type="text"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="이마트"
                className="input"
              />
            </div>
            <div>
              <div className="label">구매 물건</div>
              <input
                type="text"
                value={form.item}
                onChange={(e) => handleChange("item", e.target.value)}
                placeholder="계란"
                className="input"
              />
            </div>
          </div>

          <div>
            <div className="label">금액(원)</div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="10000"
              className="input big"
            />
          </div>

          <button type="submit" disabled={!canSubmit} className={`button w100 ${!canSubmit ? "disabled" : ""}`}>
            💾 저장하기
          </button>
        </form>
      </div>
    </div>
  );
}

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
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-head blue">
          <div>✏️ 내역 수정</div>
          <button className="iconbtn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body col gap12">
          <div className="grid2 gap8">
            <div>
              <div className="label">날짜</div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <div className="label">사용자</div>
              <div className="row gap8">
                {["지영", "지원"].map((u) => (
                  <label key={u} className="chip">
                    <input
                      type="radio"
                      checked={form.user === u}
                      onChange={() => handleChange("user", u)}
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="label">카테고리</div>
            <div className="row gap8">
              <label className="chip sky">
                <input
                  type="radio"
                  checked={form.category === "생활"}
                  onChange={() => handleChange("category", "생활")}
                />
                생활
              </label>
              <label className="chip orange">
                <input
                  type="radio"
                  checked={form.category === "외식"}
                  onChange={() => handleChange("category", "외식")}
                />
                외식
              </label>
            </div>
          </div>

          <div className="grid2 gap8">
            <div>
              <div className="label">사용처</div>
              <input
                type="text"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="이마트"
                className="input"
              />
            </div>
            <div>
              <div className="label">구매 물건</div>
              <input
                type="text"
                value={form.item}
                onChange={(e) => handleChange("item", e.target.value)}
                placeholder="계란"
                className="input"
              />
            </div>
          </div>

          <div>
            <div className="label">금액(원)</div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="10000"
              className="input big"
            />
          </div>

          <button type="submit" disabled={!canSubmit} className={`button w100 ${!canSubmit ? "disabled" : ""}`}>
            💾 수정하기
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------ utils ------------------------------ */
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
