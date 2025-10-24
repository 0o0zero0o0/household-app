import React, { useMemo, useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import {
  PieChart,
  Calendar,
  X,
  AlertCircle,
  Wallet,
  Utensils,
  List,
  Plus,
  LogOut,
} from "lucide-react";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("auth") === "1";
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [openCalendar, setOpenCalendar] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openEom, setOpenEom] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [tx, setTx] = useState([]);

  async function loadTx() {
    const q = query(collection(db, "tx"), orderBy("date", "asc"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTx(list);
  }

  async function addTx(record) {
    await addDoc(collection(db, "tx"), {
      ...record,
      amount: Number(record.amount) || 0,
      createdAt: Timestamp.now(),
    });
    await loadTx();
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
      if (!t?.date?.startsWith?.(monthKey)) continue;
      if (t.user !== "지영" && t.user !== "지원") continue;
      if (t.category !== "생활" && t.category !== "외식") continue;
      s[t.user][t.category] += Number(t.amount) || 0;
    }
    return s;
  }, [tx, monthKey]);

  const alerts = [];
  if (LIMITS.jiyoung.diningLimit - spent.지영.외식 <= 10000 && spent.지영.외식 > 0) {
    alerts.push("지영의 외식비 한도가 얼마 남지 않았습니다.");
  }
  if (LIMITS.jiwon.diningLimit - spent.지원.외식 <= 10000 && spent.지원.외식 > 0) {
    alerts.push("지원의 외식비 한도가 얼마 남지 않았습니다.");
  }
  if (spent.지영.외식 > LIMITS.jiyoung.diningLimit)
    alerts.push("지영의 외식비가 한도를 초과했습니다.");
  if (spent.지원.외식 > LIMITS.jiwon.diningLimit)
    alerts.push("지원의 외식비가 한도를 초과했습니다.");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 border-2 border-sky-100">
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="TwinWallet 로고"
              className="h-10 w-auto"
            />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            🔐 환영합니다!
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            비밀번호를 입력해주세요
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 transition shadow-sm ${
                  passwordError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-sky-200 focus:border-sky-400 focus:ring-sky-200"
                }`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  비밀번호가 올바르지 않습니다
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold py-3 rounded-2xl transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 text-gray-900 flex items-start justify-center p-4 pt-5">
      <div className="w-full max-w-md flex flex-col items-center gap-5">

        {/* 상단바 (프레임 없는 버전) */}
        <div className="w-full relative flex items-center justify-between px-3 pt-2">
          <button
            aria-label="내 기록 목록"
            onClick={() => setOpenList(true)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 transition text-sky-600"
          >
            <List className="w-4 h-4" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="bg-[#189EFF] rounded-lg p-1.5 shadow-sm">
              <img
                src="/logo.png"
                alt="TwinWallet 로고"
                className="h-5 md:h-6 w-auto"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              aria-label="내역 작성"
              onClick={() => setOpenAdd(true)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 transition text-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              aria-label="달력 열기"
              onClick={() => setOpenCalendar(true)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 transition text-sky-600"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              aria-label="로그아웃"
              onClick={logout}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 transition text-red-500"
              title="로그아웃"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 나머지 기존 카드/기능 그대로 */}
        {alerts.length > 0 && (
          <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-amber-800 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <strong className="text-base">알림</strong>
            </div>
            {alerts.map((a, i) => (
              <p key={i} className="ml-10 text-sm">• {a}</p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
        </div>

        <div className="w-full flex flex-col gap-3">
          <ActionCard
            icon={<PieChart className="w-5 h-5" />}
            text="월말 요약 보기"
            onClick={() => setOpenEom(true)}
          />
        </div>
      </div>
    </div>
  );
}

function UserCard({ name, living, livingLimit, dining, diningLimit }) {
  const leftLiving = Math.max(0, livingLimit - living);
  const leftDining = Math.max(0, diningLimit - dining);

  return (
    <div className="bg-white shadow-md border-2 border-sky-100 rounded-2xl p-5 hover:shadow-lg transition">
      <h3 className="text-lg font-bold mb-3 text-sky-600">💙 {name}</h3>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sky-600 mb-2">
          <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">생활비</span>
        </div>
        <ProgressBar value={(living / livingLimit) * 100} color="sky" />
        <p className="text-xs text-gray-600 mt-2">
          {living.toLocaleString()} / {livingLimit.toLocaleString()}원
        </p>
        <p className="text-xs text-green-600 font-semibold">
          💰 남은 금액: {leftLiving.toLocaleString()}원
        </p>
      </div>
      <div>
        <div className="flex items-center gap-2 text-orange-500 mb-2">
          <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">외식비</span>
        </div>
        <ProgressBar value={(dining / diningLimit) * 100} color="orange" />
        <p className="text-xs text-gray-600 mt-2">
          {dining.toLocaleString()} / {diningLimit.toLocaleString()}원
        </p>
        <p className="text-xs text-green-600 font-semibold">
          💰 남은 금액: {leftDining.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ value, color = "sky" }) {
  const bgColor = color === "sky" ? "bg-sky-100" : "bg-orange-100";
  const barColor =
    color === "sky"
      ? "bg-gradient-to-r from-sky-400 to-blue-500"
      : "bg-gradient-to-r from-orange-400 to-red-500";

  return (
    <div className={`h-3 w-full ${bgColor} rounded-full overflow-hidden shadow-inner`}>
      <div
        className={`h-full ${barColor} transition-all duration-500 rounded-full`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function ActionCard({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 text-left hover:from-purple-100 hover:to-pink-100 hover:shadow-md transition"
    >
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm">
        {icon}
      </div>
      <p className="text-gray-800 text-sm font-semibold">{text}</p>
    </button>
  );
}

function CalendarModal({ onClose, tx }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(formatDate(today));

  const { year, month, grid } = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const daily = useMemo(() => summarizeByDate(tx), [tx]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-sky-100">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="font-bold text-sky-700">📅 달력</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              className="px-3 py-2 rounded-xl hover:bg-sky-50 font-semibold text-sky-600"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              ◀
            </button>
            <div className="font-bold text-lg">
              {year}년 {month + 1}월
            </div>
            <button
              className="px-3 py-2 rounded-xl hover:bg-sky-50 font-semibold text-sky-600"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, idx) => {
              if (!cell) return <div key={idx} className="h-11" />;
              const iso = formatDate(cell);
              const isToday = sameDate(cell, today);
              const isSelected = iso === selected;
              const sum = daily[iso]?.total || 0;
              return (
                <button
                  key={idx}
                  onClick={() => setSelected(iso)}
                  className={`h-11 rounded-xl text-sm relative border-2 transition font-medium ${
                    isSelected
                      ? "border-sky-400 bg-sky-50 text-sky-700 shadow-sm"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className={`relative ${isToday ? "text-white" : ""}`}>
                      {cell.getDate()}
                      {isToday && (
                        <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 scale-110" />
                      )}
                    </span>
                  </div>
                  {sum > 0 && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t-2 pt-4 text-sm bg-sky-50 rounded-xl p-4">
            <div className="font-bold mb-2 text-sky-700">
              {selected.replaceAll("-", ".")} 사용 내역
            </div>
            <DateBreakdown selected={selected} tx={tx} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListModal({ onClose, tx, onEdit }) {
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
    }
    if (p === "month") {
      setStart(formatDate(new Date(today.getFullYear(), today.getMonth(), 1)));
      setEnd(formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)));
    }
  };

  const rows = useMemo(() => {
    return tx
      .filter((t) => (who === "all" ? true : t.user === who))
      .filter((t) => t.date >= start && t.date <= end)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [tx, who, start, end]);

  const total = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-sky-100">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="font-bold text-sky-700">📋 내 기록 목록</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">이름</div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={who === "all"} onChange={() => setWho("all")} className="text-sky-500" />
                전체
              </label>
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={who === "지영"} onChange={() => setWho("지영")} className="text-sky-500" />
                지영
              </label>
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={who === "지원"} onChange={() => setWho("지원")} className="text-sky-500" />
                지원
              </label>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">기간</div>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={period === "week"} onChange={() => applyPreset("week")} className="text-sky-500" />
                이번 주
              </label>
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={period === "month"} onChange={() => applyPreset("month")} className="text-sky-500" />
                이번 달
              </label>
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={period === "custom"} onChange={() => applyPreset("custom")} className="text-sky-500" />
                직접 설정
              </label>
            </div>
            {period === "custom" && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
                />
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
                />
              </div>
            )}
          </div>

          <div className="border-2 border-sky-100 rounded-2xl divide-y divide-sky-100 max-h-72 overflow-auto">
            {rows.length === 0 && (
              <div className="p-4 text-center text-gray-400">해당 기간 내 기록 없음</div>
            )}
            {rows.map((r, i) => (
              <div
                key={i}
                className="p-3 grid grid-cols-[88px_1fr_auto_auto] items-center gap-3 hover:bg-sky-50 transition"
              >
                <div className="text-gray-500 text-xs font-medium">
                  {String(r.date).replaceAll("-", ".")}
                </div>
                <div className="text-xs">
                  <span className="text-sky-600 font-semibold mr-1">{r.user}</span>
                  <span className="text-gray-700">
                    {r.place} — {r.item}
                  </span>
                </div>
                <div className="font-bold text-sky-700 whitespace-nowrap">
                  ₩{Number(r.amount).toLocaleString("ko-KR")}
                </div>
                <button
                  aria-label="수정"
                  onClick={() => onEdit(r)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50"
                  title="수정"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  수정
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between font-bold text-base bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-2xl border-2 border-sky-200">
            <span>합계</span>
            <span className="text-sky-600">₩{total.toLocaleString("ko-KR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const topPlaces = Object.entries(totals.byPlace).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-100">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="font-bold text-purple-700">📊 월말 요약</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 text-sm space-y-4">
          <div className="flex items-center justify-between font-bold text-lg bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-2xl border-2 border-sky-200">
            <span>💸 이번 달 총 사용</span>
            <span className="text-sky-600">₩{totals.total.toLocaleString("ko-KR")}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-sky-100 rounded-2xl p-4 bg-sky-50">
              <div className="font-bold mb-3 text-sky-700">👥 사용자별</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">지영</span>
                <span className="font-semibold">₩{totals.byUser.지영.toLocaleString("ko-KR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">지원</span>
                <span className="font-semibold">₩{totals.byUser.지원.toLocaleString("ko-KR")}</span>
              </div>
            </div>
            <div className="border-2 border-orange-100 rounded-2xl p-4 bg-orange-50">
              <div className="font-bold mb-3 text-orange-700">📑 카테고리별</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">생활</span>
                <span className="font-semibold">₩{(totals.byCategory.생활 || 0).toLocaleString("ko-KR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">외식</span>
                <span className="font-semibold">₩{(totals.byCategory.외식 || 0).toLocaleString("ko-KR")}</span>
              </div>
            </div>
          </div>
          <div className="border-2 border-purple-100 rounded-2xl p-4 bg-purple-50">
            <div className="font-bold mb-3 text-purple-700">🏆 어디서 많이 썼나요? (Top 3)</div>
            {topPlaces.length === 0 && <div className="text-gray-400 text-center py-2">데이터 없음</div>}
            {topPlaces.map(([place, amt], idx) => (
              <div key={place} className="flex items-center justify-between mb-2">
                <span className="text-gray-600">
                  <span className="inline-block w-6 font-bold text-purple-500">{idx + 1}.</span>
                  {place}
                </span>
                <span className="font-semibold">₩{amt.toLocaleString("ko-KR")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-sky-100">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="font-bold text-sky-700">✏️ 내역 작성</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">날짜</div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">사용자</div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition text-xs">
                  <input type="radio" checked={form.user === "지영"} onChange={() => handleChange("user", "지영")} className="text-sky-500" />
                  지영
                </label>
                <label className="inline-flex items-center gap-1 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition text-xs">
                  <input type="radio" checked={form.user === "지원"} onChange={() => handleChange("user", "지원")} className="text-sky-500" />
                  지원
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">카테고리</div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={form.category === "생활"} onChange={() => handleChange("category", "생활")} className="text-sky-500" />
                생활
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl cursor-pointer hover:bg-orange-100 transition">
                <input type="radio" checked={form.category === "외식"} onChange={() => handleChange("category", "외식")} className="text-orange-500" />
                외식
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">사용처</div>
              <input
                type="text"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="이마트"
                className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">구매 물건</div>
              <input
                type="text"
                value={form.item}
                onChange={(e) => handleChange("item", e.target.value)}
                placeholder="계란"
                className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">금액(원)</div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="10000"
              className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none text-lg font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 rounded-2xl text-white font-bold transition shadow-lg ${
              canSubmit
                ? "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 hover:shadow-xl transform hover:scale-[1.02]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            💾 저장하기
          </button>
        </form>
      </div>
    </div>
  );
}

function EditTxModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({
    date: String(initial.date || ""),
    user: initial.user || "지영",
    category: initial.category || "생활",
    place: initial.place || "",
    item: initial.item || "",
    amount: initial.amount ?? "",
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
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-sky-100">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="font-bold text-sky-700">🛠 내역 수정</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">날짜</div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">사용자</div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition text-xs">
                  <input type="radio" checked={form.user === "지영"} onChange={() => handleChange("user", "지영")} />
                  지영
                </label>
                <label className="inline-flex items-center gap-1 px-3 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition text-xs">
                  <input type="radio" checked={form.user === "지원"} onChange={() => handleChange("user", "지원")} />
                  지원
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">카테고리</div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-xl cursor-pointer hover:bg-sky-100 transition">
                <input type="radio" checked={form.category === "생활"} onChange={() => handleChange("category", "생활")} />
                생활
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl cursor-pointer hover:bg-orange-100 transition">
                <input type="radio" checked={form.category === "외식"} onChange={() => handleChange("category", "외식")} />
                외식
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">사용처</div>
              <input
                type="text"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
                className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">구매 물건</div>
              <input
                type="text"
                value={form.item}
                onChange={(e) => handleChange("item", e.target.value)}
                className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">금액(원)</div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="w-full border-2 border-sky-200 rounded-xl px-3 py-2 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none text-lg font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 rounded-2xl text-white font-bold transition shadow-lg ${
              canSubmit
                ? "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 hover:shadow-xl transform hover:scale-[1.02]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            ✅ 수정 저장
          </button>
        </form>
      </div>
    </div>
  );
}

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sky-600 font-semibold">지영</span>
        <span className="font-bold">₩{totalBy.byUser.지영.toLocaleString("ko-KR")}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sky-600 font-semibold">지원</span>
        <span className="font-bold">₩{totalBy.byUser.지원.toLocaleString("ko-KR")}</span>
      </div>
      <div className="flex items-center justify-between font-bold text-base pt-2 border-t-2 border-sky-200">
        <span>합계</span>
        <span className="text-sky-600">₩{totalBy.total.toLocaleString("ko-KR")}</span>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
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
  const cells = Array(startIdx).fill(null).concat(Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)));
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
