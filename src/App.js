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
  Plus, // ← 내역 작성 버튼 아이콘
} from "lucide-react";
import "./App.css";

export default function App() {
  // ---- Auth ----
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // ---- UI Modals ----
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openEom, setOpenEom] = useState(false);
  const [openAdd, setOpenAdd] = useState(false); // ← 새로 추가: 내역 작성 모달

  // ---- Firestore tx ----
  const [tx, setTx] = useState([]); // Firestore에서 채움

  async function loadTx() {
    const q = query(collection(db, "tx"), orderBy("date", "asc"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTx(list);
  }

  async function addTx(record) {
    // record 예: { date, user, category, place, item, amount }
    await addDoc(collection(db, "tx"), {
      ...record,
      amount: Number(record.amount) || 0,
      createdAt: Timestamp.now(),
    });
    await loadTx();
  }

  useEffect(() => {
    // 초기 로드 (원하면 로그인 이후로 옮겨도 됨)
    loadTx().catch(console.error);
  }, []);

  // ---- Password Submit ----
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === "!0121") {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  // ---- 한도/지출 합산(실제 데이터 기반) ----
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

  // ---- Login Gate ----
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            {/* SVG 로고 (JSX 안전형) */}
            <svg
              className="h-12 w-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 566.9 234.9"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M565.1,234.9H1.8v-18.8h563.2V234.9z M348.8,167.3h-42.1v26.4h-16v-26.4h-42.1v-13h100.3V167.3z M555.6,193.6h-15.3V93
                h15.3V193.6z M26.7,180.6H97v12.6H11.4v-32.7h15.3V180.6z M137.2,158.5h52.7v-9.8h15.3v44.5h-83.4v-44.5h15.3V158.5z M413.7,176.9
                h42.1v13H355.6v-13h42.1V155h16V176.9z M481.9,127.8h29.5V95.6h15.3v90.9h-60.2V95.6h15.3V127.8z M137.2,181h52.7v-10.4h-52.7V181z
                M481.9,173.7h29.5v-33h-29.5V173.7z M94.8,120.5h13.5v13.7H94.8v32.4H79.5V93h15.3V120.5z M413.6,108.5c0,4.9,1,9.4,2.9,13.5
                c2,4.1,4.6,7.8,8,10.9c3.4,3.2,7.3,5.8,11.8,7.9c4.5,2,9.3,3.4,14.4,4.2v12.3c-4.4-0.5-8.8-1.4-13.1-2.7c-4.3-1.4-8.4-3-12.3-5.1
                c-3.9-2-7.5-4.4-10.9-7.1c-3.3-2.8-6.2-5.9-8.8-9.2c-2.6,3.4-5.5,6.5-8.9,9.2c-3.4,2.7-7,5.1-10.9,7.1c-3.8,2-7.9,3.7-12.3,5.1
                c-4.3,1.3-8.6,2.2-13,2.7V145c5-0.8,9.8-2.1,14.3-4.2c4.5-2.1,8.4-4.7,11.8-7.9c3.4-3.2,6.1-6.8,8-10.9c2-4.1,3-8.6,3-13.5V92.9
                h15.8V108.5z M44,113.2c3.6,0,6.9,0.4,9.9,1.3c3.1,0.8,5.7,2.1,7.9,3.8c2.3,1.7,4,3.9,5.2,6.5c1.3,2.6,1.9,5.7,1.9,9.1
                c0,3.5-0.6,6.6-1.9,9.2c-1.2,2.6-2.9,4.7-5.2,6.4c-2.2,1.7-4.8,3-7.9,3.9c-3,0.8-6.3,1.2-9.9,1.2H31.8c-3.6,0-7-0.4-10-1.2
                c-3-0.9-5.6-2.2-7.9-3.9c-2.2-1.7-3.9-3.9-5.2-6.4c-1.2-2.6-1.8-5.7-1.8-9.2c0-3.5,0.6-6.5,1.8-9.1c1.3-2.6,3-4.8,5.2-6.5
                c2.3-1.7,4.9-3,7.9-3.8c3.1-0.9,6.4-1.3,10-1.3H44z M205.2,145.3h-15.3V93h15.3V145.3z M176.4,106.3h-22.6v1.8c0,2.9,0.5,5.5,1.6,8
                c1.1,2.5,2.7,4.7,4.7,6.6c2,2,4.5,3.6,7.3,5.1c2.9,1.4,6.1,2.5,9.6,3.3v12.3c-6.3-1.1-12.2-3.1-17.7-5.9
                c-5.4-2.8-9.9-6.2-13.5-10.1c-3.8,4.5-8.4,8.1-13.9,10.9c-5.5,2.8-11.6,4.8-18.5,6V132c3.5-0.5,6.8-1.5,9.8-3
                c3-1.5,5.6-3.3,7.8-5.4c2.2-2.1,3.9-4.5,5.1-7.1c1.2-2.6,1.8-5.4,1.8-8.3v-1.8H114V94.2h62.4V106.3z M340.9,108h-68.6v22.9h70.3
                v12.8H257V95.2h83.9V108z M33.9,125.4c-3.6,0-6.5,0.8-8.6,2.3c-2.1,1.5-3.2,3.6-3.2,6.4c0,2.8,1.1,4.9,3.2,6.4
                c2.1,1.5,5,2.2,8.6,2.2h7.9c3.8,0,6.6-0.7,8.7-2.2c2-1.5,3-3.6,3-6.4c0-2.8-1-4.9-3-6.4c-2-1.5-4.9-2.3-8.7-2.3H33.9z M46,98.1
                h25.1v11.6H4.7V98.1h25.1v-8.2H46V98.1z M285.3,0.4l281.6,56.3l-3.7,18.4l-279.8-56L3.7,75.1L0,56.7L281.6,0.4l1.8-0.4L285.3,0.4z"
                fill="currentColor"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            비밀번호를 입력하세요
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  passwordError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">
                  비밀번호가 올바르지 않습니다
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition active:scale-98"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---- Main App ----
  return (
{/* 헤더: 기록목록 / 로고 / 달력 + 내역작성 */}
<div className="w-full grid grid-cols-[36px_1fr_72px] items-center">
  {/* 왼쪽 버튼: 목록 */}
  <button
    aria-label="내 기록 목록"
    onClick={() => setOpenList(true)}
    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50"
  >
    <List className="w-5 h-5 text-gray-700" />
  </button>

  {/* 중앙 로고 */}
  <div className="justify-self-center">
    <svg
      className="h-8 md:h-10 w-auto"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 566.9 234.9"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M565.1,234.9H1.8v-18.8h563.2V234.9z M348.8,167.3h-42.1v26.4h-16v-26.4h-42.1v-13h100.3V167.3z M555.6,193.6h-15.3V93
        h15.3V193.6z M26.7,180.6H97v12.6H11.4v-32.7h15.3V180.6z M137.2,158.5h52.7v-9.8h15.3v44.5h-83.4v-44.5h15.3V158.5z M413.7,176.9
        h42.1v13H355.6v-13h42.1V155h16V176.9z M481.9,127.8h29.5V95.6h15.3v90.9h-60.2V95.6h15.3V127.8z M137.2,181h52.7v-10.4h-52.7V181z
        M481.9,173.7h29.5v-33h-29.5V173.7z M94.8,120.5h13.5v13.7H94.8v32.4H79.5V93h15.3V120.5z M413.6,108.5c0,4.9,1,9.4,2.9,13.5
        c2,4.1,4.6,7.8,8,10.9c3.4,3.2,7.3,5.8,11.8,7.9c4.5,2,9.3,3.4,14.4,4.2v12.3c-4.4-0.5-8.8-1.4-13.1-2.7c-4.3-1.4-8.4-3-12.3-5.1
        c-3.9-2-7.5-4.4-10.9-7.1c-3.3-2.8-6.2-5.9-8.8-9.2c-2.6,3.4-5.5,6.5-8.9,9.2c-3.4,2.7-7,5.1-10.9,7.1c-3.8,2-7.9,3.7-12.3,5.1
        c-4.3,1.3-8.6,2.2-13,2.7V145c5-0.8,9.8-2.1,14.3-4.2c4.5-2.1,8.4-4.7,11.8-7.9c3.4-3.2,6.1-6.8,8-10.9c2-4.1,3-8.6,3-13.5V92.9
        h15.8V108.5z M44,113.2c3.6,0,6.9,0.4,9.9,1.3c3.1,0.8,5.7,2.1,7.9,3.8c2.3,1.7,4,3.9,5.2,6.5c1.3,2.6,1.9,5.7,1.9,9.1
        c0,3.5-0.6,6.6-1.9,9.2c-1.2,2.6-2.9,4.7-5.2,6.4c-2.2,1.7-4.8,3-7.9,3.9c-3,0.8-6.3,1.2-9.9,1.2H31.8c-3.6,0-7-0.4-10-1.2
        c-3-0.9-5.6-2.2-7.9-3.9c-2.2-1.7-3.9-3.9-5.2-6.4c-1.2-2.6-1.8-5.7-1.8-9.2c0-3.5,0.6-6.5,1.8-9.1c1.3-2.6,3-4.8,5.2-6.5
        c2.3-1.7,4.9-3,7.9-3.8c3.1-0.9,6.4-1.3,10-1.3H44z M205.2,145.3h-15.3V93h15.3V145.3z M176.4,106.3h-22.6v1.8c0,2.9,0.5,5.5,1.6,8
        c1.1,2.5,2.7,4.7,4.7,6.6c2,2,4.5,3.6,7.3,5.1c2.9,1.4,6.1,2.5,9.6,3.3v12.3c-6.3-1.1-12.2-3.1-17.7-5.9
        c-5.4-2.8-9.9-6.2-13.5-10.1c-3.8,4.5-8.4,8.1-13.9,10.9c-5.5,2.8-11.6,4.8-18.5,6V132c3.5-0.5,6.8-1.5,9.8-3
        c3-1.5,5.6-3.3,7.8-5.4c2.2-2.1,3.9-4.5,5.1-7.1c1.2-2.6,1.8-5.4,1.8-8.3v-1.8H114V94.2h62.4V106.3z M340.9,108h-68.6v22.9h70.3
        v12.8H257V95.2h83.9V108z M33.9,125.4c-3.6,0-6.5,0.8-8.6,2.3c-2.1,1.5-3.2,3.6-3.2,6.4c0,2.8,1.1,4.9,3.2,6.4
        c2.1,1.5,5,2.2,8.6,2.2h7.9c3.8,0,6.6-0.7,8.7-2.2c2-1.5,3-3.6,3-6.4c0-2.8-1-4.9-3-6.4c-2-1.5-4.9-2.3-8.7-2.3H33.9z M46,98.1
        h25.1v11.6H4.7V98.1h25.1v-8.2H46V98.1z M285.3,0.4l281.6,56.3l-3.7,18.4l-279.8-56L3.7,75.1L0,56.7L281.6,0.4l1.8-0.4L285.3,0.4z"
        fill="currentColor"
      />
    </svg>
  </div>

  {/* 오른쪽 버튼들: 내역 작성 + 달력 */}
  <div className="flex items-center gap-2 justify-self-end">
    <button
      aria-label="내역 작성"
      onClick={() => setOpenAdd(true)}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50"
    >
      <Plus className="w-5 h-5 text-gray-700" />
    </button>
    <button
      aria-label="달력 열기"
      onClick={() => setOpenCalendar(true)}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50"
    >
      <Calendar className="w-5 h-5 text-gray-700" />
    </button>
  </div>
</div>

        {/* 알림 카드: 실제 지출 있을 때만 표시 */}
        {alerts.length > 0 && (
          <div className="w-full bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" />
              <strong>알림</strong>
            </div>
            {alerts.map((a, i) => (
              <p key={i}>• {a}</p>
            ))}
          </div>
        )}

        {/* Firestore 테스트 버튼 (원하면 삭제해도 됨) */}
        <div className="w-full flex gap-2">
          <button
            onClick={() =>
              addTx({
                date: "2025-10-23",
                user: "지영",
                category: "외식",
                place: "카페",
                item: "디저트",
                amount: 9000,
              })
            }
            className="px-3 py-2 rounded-md border"
          >
            샘플 저장
          </button>
          <button onClick={loadTx} className="px-3 py-2 rounded-md border">
            새로고침(불러오기)
          </button>
        </div>

        {/* 사용자 카드 */}
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

        {/* 액션 */}
        <div className="w-full flex flex-col gap-3">
          <ActionCard
            icon={<PieChart className="w-5 h-5" />}
            text="월말 요약"
            onClick={() => setOpenEom(true)}
          />
        </div>
      </div>

      {openCalendar && <CalendarModal onClose={() => setOpenCalendar(false)} tx={tx} />}
      {openList && <ListModal onClose={() => setOpenList(false)} tx={tx} />}
      {openEom && <EomSummaryModal onClose={() => setOpenEom(false)} tx={tx} />}
      {openAdd && <AddTxModal onClose={() => setOpenAdd(false)} onSubmit={addTx} />}
    </div>
  );
}

// ---------- Components ----------
function UserCard({ name, living, livingLimit, dining, diningLimit }) {
  const leftLiving = Math.max(0, livingLimit - living);
  const leftDining = Math.max(0, diningLimit - dining);

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4">
      <h3 className="text-base font-semibold mb-2">{name}</h3>
      <div className="mb-4">
        <div className="flex items-center gap-1 text-blue-600 mb-1">
          <Wallet className="w-4 h-4" /> <span className="text-sm">생활비</span>
        </div>
        <ProgressBar value={(living / livingLimit) * 100} />
        <p className="text-xs text-gray-700 mt-1">
          {living.toLocaleString()} / {livingLimit.toLocaleString()}원
        </p>
        <p className="text-xs text-green-600">
          남은 금액: {leftLiving.toLocaleString()}원
        </p>
      </div>
      <div>
        <div className="flex items-center gap-1 text-orange-600 mb-1">
          <Utensils className="w-4 h-4" /> <span className="text-sm">외식비</span>
        </div>
        <ProgressBar value={(dining / diningLimit) * 100} />
        <p className="text-xs text-gray-700 mt-1">
          {dining.toLocaleString()} / {diningLimit.toLocaleString()}원
        </p>
        <p className="text-xs text-green-600">
          남은 금액: {leftDining.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gray-800 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function ActionCard({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-lg border border-green-200 text-left hover:bg-green-100"
    >
      <div className="text-green-600 flex-shrink-0">{icon}</div>
      <p className="text-gray-700 text-sm">{text}</p>
    </button>
  );
}

function CalendarModal({ onClose, tx }) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selected, setSelected] = useState(formatDate(today));

  const { year, month, grid } = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const daily = useMemo(() => summarizeByDate(tx), [tx]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-medium">달력</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              className="px-2 py-1 rounded hover:bg-gray-50"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
            >
              ◀
            </button>
            <div className="font-semibold">
              {year}년 {month + 1}월
            </div>
            <button
              className="px-2 py-1 rounded hover:bg-gray-50"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, idx) => {
              if (!cell) return <div key={idx} className="h-10" />;
              const iso = formatDate(cell);
              const isToday = sameDate(cell, today);
              const isSelected = iso === selected;
              const sum = daily[iso]?.total || 0;
              return (
                <button
                  key={idx}
                  onClick={() => setSelected(iso)}
                  className={`h-10 rounded-md text-sm relative border transition ${
                    isSelected ? "border-blue-600" : "border-transparent"
                  } hover:bg-gray-50`}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className={`relative px-2 ${isToday ? "text-white" : ""}`}>
                      {cell.getDate()}
                      {isToday && (
                        <span className="absolute inset-0 -z-10 rounded-full bg-blue-600" />
                      )}
                    </span>
                  </div>
                  {sum > 0 && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-green-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t pt-3 text-sm">
            <div className="font-medium mb-1">
              {selected.replaceAll("-", ".")} 사용 내역
            </div>
            <DateBreakdown selected={selected} tx={tx} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListModal({ onClose, tx }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-medium">내 기록 목록</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div>
            <div className="text-xs text-gray-600 mb-1">이름</div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={who === "all"}
                  onChange={() => setWho("all")}
                />{" "}
                전체
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={who === "지영"}
                  onChange={() => setWho("지영")}
                />{" "}
                지영
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={who === "지원"}
                  onChange={() => setWho("지원")}
                />{" "}
                지원
              </label>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 mb-1">기간</div>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={period === "week"}
                  onChange={() => applyPreset("week")}
                />{" "}
                이번 주
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={period === "month"}
                  onChange={() => applyPreset("month")}
                />{" "}
                이번 달
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={period === "custom"}
                  onChange={() => applyPreset("custom")}
                />{" "}
                직접 설정
              </label>
            </div>
            {period === "custom" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="border rounded-md px-2 py-2"
                />
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="border rounded-md px-2 py-2"
                />
              </div>
            )}
          </div>

          <div className="border rounded-lg divide-y max-h-72 overflow-auto">
            {rows.length === 0 && (
              <div className="p-3 text-gray-500">해당 기간 내 기록 없음</div>
            )}
            {rows.map((r, i) => (
              <div
                key={i}
                className="p-3 grid grid-cols-[88px_1fr_auto] items-center gap-2"
              >
                <div className="text-gray-500 text-xs">
                  {String(r.date).replaceAll("-", ".")}
                </div>
                <div className="text-xs">
                  <span className="text-gray-600 mr-1">{r.user}</span>
                  <span className="text-gray-800">
                    {r.place} — {r.item}
                  </span>
                </div>
                <div className="font-medium">
                  ₩{Number(r.amount).toLocaleString("ko-KR")}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between font-semibold">
            <span>합계</span>
            <span>₩{total.toLocaleString("ko-KR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EomSummaryModal({ onClose, tx }) {
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-medium">월말 요약</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 text-sm space-y-3">
          <div className="flex items-center justify-between font-semibold">
            <span>이번 달 총 사용</span>
            <span>₩{totals.total.toLocaleString("ko-KR")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded-lg p-3">
              <div className="font-medium mb-2">사용자별</div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">지영</span>
                <span>₩{totals.byUser.지영.toLocaleString("ko-KR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">지원</span>
                <span>₩{totals.byUser.지원.toLocaleString("ko-KR")}</span>
              </div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-medium mb-2">카테고리별</div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">생활</span>
                <span>₩{(totals.byCategory.생활 || 0).toLocaleString("ko-KR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">외식</span>
                <span>₩{(totals.byCategory.외식 || 0).toLocaleString("ko-KR")}</span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="font-medium mb-2">어디서 많이 썼나요? (Top 3 사용처)</div>
            {topPlaces.length === 0 && <div className="text-gray-500">데이터 없음</div>}
            {topPlaces.map(([place, amt]) => (
              <div key={place} className="flex items-center justify-between">
                <span className="text-gray-600">{place}</span>
                <span>₩{amt.toLocaleString("ko-KR")}</span>
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
    await onSubmit({
      ...form,
      amount: Number(form.amount) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-medium">내역 작성</div>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">날짜</div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full border rounded-md px-2 py-2"
              />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">사용자</div>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    checked={form.user === "지영"}
                    onChange={() => handleChange("user", "지영")}
                  />{" "}
                  지영
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    checked={form.user === "지원"}
                    onChange={() => handleChange("user", "지원")}
                  />{" "}
                  지원
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 mb-1">카테고리</div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={form.category === "생활"}
                  onChange={() => handleChange("category", "생활")}
                />{" "}
                생활
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  checked={form.category === "외식"}
                  onChange={() => handleChange("category", "외식")}
                />{" "}
                외식
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">사용처</div>
              <input
                type="text"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="이마트 / 카페 등"
                className="w-full border rounded-md px-2 py-2"
              />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">구매 물건</div>
              <input
                type="text"
                value={form.item}
                onChange={(e) => handleChange("item", e.target.value)}
                placeholder="계란 / 디저트 등"
                className="w-full border rounded-md px-2 py-2"
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 mb-1">금액(원)</div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0"
              className="w-full border rounded-md px-2 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-2 rounded-md text-white ${
              canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
            }`}
          >
            저장
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
    <div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">지영</span>
        <span>₩{totalBy.byUser.지영.toLocaleString("ko-KR")}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">지원</span>
        <span>₩{totalBy.byUser.지원.toLocaleString("ko-KR")}</span>
      </div>
      <div className="flex items-center justify-between font-semibold mt-1">
        <span>합계</span>
        <span>₩{totalBy.total.toLocaleString("ko-KR")}</span>
      </div>
    </div>
  );
}

// ---------- Helpers ----------
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

/* --------------------------------------------------------
   🧪 Quick Console Tests (브라우저 콘솔에서 정상 동작 확인용)
   -------------------------------------------------------- */
(function devTests() {
  try {
    console.assert(
      formatDate(new Date(2025, 0, 5)) === "2025-01-05",
      "formatDate 실패"
    );
    const grid = buildMonthGrid(new Date(2025, 0, 1));
    console.assert(grid.grid.length % 7 === 0, "달력 그리드 7의 배수 아님");
    const sum = summarizeByDate([
      { date: "2025-10-01", user: "지영", amount: 1000 },
      { date: "2025-10-01", user: "지원", amount: 2000 },
      { date: "2025-10-02", user: "지영", amount: 3000 },
    ]);
    console.assert(sum["2025-10-01"].total === 3000, "요약 합계 오류");
    console.assert(sum["2025-10-01"].byUser.지영 === 1000, "사용자별 합계 오류");
    console.assert(sum["2025-10-02"].total === 3000, "다음날 합계 오류");
    // eslint-disable-next-line no-console
    console.log("✅ Quick tests passed");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("❌ Quick tests failed:", e);
  }
})();
