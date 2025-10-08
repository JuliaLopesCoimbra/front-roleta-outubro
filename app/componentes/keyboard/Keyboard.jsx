"use client";
import { useState } from "react";

const keyboardLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "´", "/"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç", "~", "^"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", ";", ":", "_"],
  // ⤵ adicionamos "Enter" aqui
  ["aA", "@", ".com", "Space", "Apagar", "Enter"],
];

const accentMap = {
  "´": { A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú", C: "Ć" },
  "`": { A: "À", E: "È", I: "Ì", O: "Ò", U: "Ù" },
  "~": { A: "Ã", O: "Õ", N: "Ñ" },
  "^": { A: "Â", E: "Ê", I: "Î", O: "Ô", U: "Û" },
};

function keyBg(letter) {
  if (letter === "Apagar")
    return "bg-gradient-to-br from-pink-600/80 to-fuchsia-600/70 ring-pink-400/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.45)]";
  if (letter === "aA")
    return "bg-gradient-to-br from-purple-600/80 to-indigo-600/70 ring-purple-400/40 hover:shadow-[0_0_30px_rgba(147,51,234,0.45)]";
  if (letter === "@" || letter === ".com")
    return "bg-gradient-to-br from-cyan-600/80 to-teal-600/70 ring-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]";
  if (letter === "Enter")
    return "bg-gradient-to-br from-emerald-600/80 to-lime-600/70 ring-emerald-400/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)]";
  if (letter === "Space")
    return "bg-gradient-to-br from-slate-800/80 to-slate-700/70 ring-white/10 hover:shadow-[0_0_28px_rgba(59,130,246,0.25)]";
  return "bg-gradient-to-br from-slate-800/85 to-slate-700/75 ring-white/10 hover:shadow-[0_0_22px_rgba(168,85,247,0.35)]";
}

function Keys({ letter, onKeyPressed }) {
  const size =
    letter === "Space"
      ? "basis-[36%]"
      : letter === "Enter" || letter === "Apagar"
      ? "basis-[18%]"
      : letter === ".com" || letter === "@"
      ? "basis-[12%]"
      : letter === "aA"
      ? "basis-[10%]"
      : "basis-[7%]";

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onKeyPressed(letter)}
      className={[
        "select-none",
        size,
        "px-4 py-5 rounded-2xl font-black text-white/90",
        "shadow-md ring-1 transition-all duration-100",
        "active:translate-y-0.5 focus:outline-none",
        keyBg(letter),
      ].join(" ")}
    >
      {letter}
    </button>
  );
}

function Rows({ row, onKeyPress }) {
  return (
    <li className="w-full flex items-center justify-between gap-3">
      {row.map((item) => (
        <Keys letter={item} key={item} onKeyPressed={onKeyPress} />
      ))}
    </li>
  );
}

export function Keyboard({
  setValue,
  activeField,
  value,
  valueSelectPosition,
  setSelectionPositionOfFocusedInput,
  onEnter, // ⤴ novo prop
}) {
  const [pendingAccent, setPendingAccent] = useState(null);
  const [isShifted, setIsShifted] = useState(false);

  function handleKeyPress(key) {
    // Enter funciona mesmo sem campo focado (para fechar/ignorar)
    if (key === "Enter") {
      if (typeof onEnter === "function") onEnter(activeField || null);
      return;
    }

    if (!activeField) return;

    let text = typeof value === "string" ? value : "";
    let pos = valueSelectPosition;
    let insert = "";

    if (pos < 0 || pos > text.length) pos = text.length;

    if (key === "Apagar") {
      if (pos > 0) {
        text = text.slice(0, pos - 1) + text.slice(pos);
        pos -= 1;
      }
      setPendingAccent(null);
    } else if (key === "Space") {
      insert = " ";
    } else if (key === "aA" || key === "Shift") {
      setIsShifted((v) => !v);
      return;
    } else if (accentMap[key]) {
      setPendingAccent(key);
      return;
    } else if (pendingAccent) {
      const upperKey = (key || "").toUpperCase();
      const accentCombo =
        accentMap[pendingAccent] && accentMap[pendingAccent][upperKey];
      insert = accentCombo
        ? isShifted
          ? accentCombo
          : accentCombo.toLowerCase()
        : isShifted
        ? key
        : key.toLowerCase();
      setPendingAccent(null);
      setIsShifted(false);
    } else {
      insert = isShifted ? key : key.toLowerCase();
      setPendingAccent(null);
      setIsShifted(false);
    }

    if (insert) {
      text = text.slice(0, pos) + insert + text.slice(pos);
      pos += insert.length;
    }

    setValue(activeField, text);
    setSelectionPositionOfFocusedInput(pos);
  }

  const visible = activeField !== null;

  return (
    <div
      className={`fixed bottom-0 left-0 w-full px-6 pb-6 pt-3 transition-transform ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-black/55 backdrop-blur-xl shadow-[0_0_60px_rgba(168,85,247,0.35)]">
        <div className="h-1.5 w-full rounded-t-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" />
        <ul className="w-full flex flex-col gap-3 p-5">
          {keyboardLayout.map((rows, index) => (
            <Rows onKeyPress={handleKeyPress} key={`rows:${index}`} row={rows} />
          ))}
        </ul>
      </div>
    </div>
  );
}
