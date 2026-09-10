import type { ReactNode } from "react";
import guideMascot from "../../assets/learn/guide-mascot.png";
import type { Language } from "../../i18n";
import type { Copy } from "../../data/learningLessons";

function text(copy: Copy, language: Language) { return copy[language]; }

export function LessonFrame({ language, lessonNumber, title, page, pageCount, message, board, primaryLabel, primaryDisabled, onBack, onPrimary, onHint, onRetry, onToggleLanguage }: {
  language: Language;
  lessonNumber: number;
  title: Copy;
  page: number;
  pageCount: number;
  message: Copy;
  board: ReactNode;
  primaryLabel: string;
  primaryDisabled?: boolean;
  onBack: () => void;
  onPrimary: () => void;
  onHint: () => void;
  onRetry: () => void;
  onToggleLanguage: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f2f2f2]" role="dialog" aria-modal="true" aria-label={text(title, language)}>
      <main className="mx-auto flex min-h-[792px] w-full max-w-[398px] flex-col bg-[#fbfaf6] px-5 pb-7 pt-3 text-[#293444] shadow-[0_0_40px_rgba(42,54,66,.12)]">
        <div className="flex h-7 items-center justify-between px-1 text-[15px] font-black"><span>9:41</span><div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">signal_cellular_alt</span><span className="material-symbols-outlined text-[18px]">wifi</span><span className="material-symbols-outlined text-[21px]">battery_full</span></div></div>
        <header className="relative mt-2 flex min-h-[72px] items-center justify-between">
          <button type="button" onClick={onBack} className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#e1e7ed] bg-white text-2xl font-black shadow-sm" aria-label={language === "zh" ? "返回课程列表" : "Back to lessons"}>‹</button>
          <div className="absolute inset-x-14 top-2 text-center"><h1 className="text-[18px] font-black leading-tight">{String(lessonNumber).padStart(2, "0")}. {text(title, language)}</h1><p className="mt-1 text-[10px] font-semibold text-[#8290a3]">{language === "zh" ? "国际跳棋入门基础" : "International draughts basics"}</p></div>
          <div className="ml-auto flex flex-col items-end gap-2"><button type="button" onClick={onToggleLanguage} className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#2b6c00] shadow" aria-label={language === "zh" ? "Switch to English" : "切换中文"}>{language === "zh" ? "EN" : "中文"}</button><span className="rounded-full bg-[#dff6df] px-3 py-1 text-xs font-black text-[#4fbd8d]">☆ {page + 1} / {pageCount}</span></div>
        </header>

        <section className="mt-3 grid grid-cols-[112px_1fr] items-center gap-3">
          <div className="text-center"><img src={guideMascot} alt="" className="mx-auto h-[96px] w-[112px] object-contain object-center" /><p className="-mt-1 text-sm font-black text-[#48bd89]">{language === "zh" ? "小德拉夫：" : "Draff:"}</p></div>
          <div className="flex min-h-[118px] items-center rounded-[18px] border-2 border-[#e3e9ef] bg-white px-4 py-3 text-[14px] font-semibold leading-[1.65] text-[#455044] shadow-[0_7px_18px_rgba(52,64,76,.08)]">{text(message, language)}</div>
        </section>

        <section className="mt-4 flex-1">{board}</section>

        <div className="mt-6 space-y-3">
          <button type="button" disabled={primaryDisabled} onClick={onPrimary} className="w-full rounded-full bg-[#4fbd8d] py-3.5 text-lg font-black text-white shadow-[0_7px_18px_rgba(79,189,141,.32)] active:translate-y-0.5 disabled:bg-[#b9d9ca]">{primaryLabel}</button>
          <div className="grid grid-cols-2 gap-3"><button type="button" onClick={onHint} className="rounded-full border-2 border-[#e0e7ed] bg-white py-3 text-sm font-black shadow-sm">💡 {language === "zh" ? "获得提示" : "Get hint"}</button><button type="button" onClick={onRetry} className="rounded-full border-2 border-[#e0e7ed] bg-white py-3 text-sm font-black shadow-sm">↻ {language === "zh" ? "重做一次" : "Try again"}</button></div>
        </div>
      </main>
    </div>
  );
}
