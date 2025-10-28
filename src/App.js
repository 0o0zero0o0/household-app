import React from "react";

export default function ListModal({ rows = [], onEdit, onDelete }) {
  return (
    <div className="w-[380px] bg-white p-4 rounded-2xl border border-sky-200 shadow-md">
      <h3 className="text-sky-700 font-bold mb-3">📋 내 기록 목록</h3>

      {/* 목록이 없을 때 */}
      {rows.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          해당 기간 내 기록 없음<br />
          <span className="text-xs">상단에서 기간을 넓혀봐</span>
        </div>
      )}

      {/* 목록 표시 */}
      {rows.map((r, i) => (
        <div
          key={r.id || i}
          className="p-3 hover:bg-sky-50 transition border-b border-sky-50 last:border-none"
        >
          <div className="grid grid-cols-[88px_1fr_auto_86px] items-center gap-3">
            {/* 날짜 */}
            <div className="text-gray-500 text-xs font-medium">
              {String(r.date).replaceAll("-", ".")}
            </div>

            {/* 사용자 / 장소 / 품목 */}
            <div className="text-xs truncate">
              <span className="text-sky-600 font-semibold mr-1">{r.user}</span>
              <span className="text-gray-700 truncate">
                {r.place} — {r.item}
              </span>
            </div>

            {/* 금액 */}
            <div className="font-bold text-sky-700 text-right whitespace-nowrap">
              ₩{Number(r.amount).toLocaleString("ko-KR")}
            </div>

            {/* 수정 / 삭제 버튼 */}
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => onEdit(r)}
                className="px-2.5 py-1.5 text-[11px] rounded-lg
                           bg-sky-50 text-sky-600 border border-sky-200
                           hover:bg-sky-100 active:scale-[0.98] transition"
                aria-label="수정"
              >
                수정
              </button>
              <button
                onClick={() => onDelete(r.id)}
                className="px-2.5 py-1.5 text-[11px] rounded-lg
                           bg-red-50 text-red-600 border border-red-200
                           hover:bg-red-100 active:scale-[0.98] transition"
                aria-label="삭제"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
