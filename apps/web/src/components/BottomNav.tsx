import { NavLink } from "react-router-dom";
import { useLanguage, type TranslationKey } from "../i18n";

const items = [
  { to: "/learn", icon: "school", label: "navLearn" },
  { to: "/train", icon: "fitness_center", label: "navTrain" },
  { to: "/classroom", icon: "groups", label: "navClassroom" },
  { to: "/play", icon: "sports_esports", label: "navPlay" },
  { to: "/profile", icon: "person", label: "navMe" },
  { to: "/ai", icon: "psychology", label: "navAi" }
];

export function BottomNav() {
  const { t } = useLanguage();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dfe9e8] bg-[#f8fdff]/95 px-2 py-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[390px] grid-cols-6">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-full py-1.5 text-[11px] font-bold ${isActive ? "text-primary" : "text-on-surface-variant"}`}>
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined text-[23px] ${isActive ? "fill" : ""}`}>{item.icon}</span>
                <span>{t(item.label as TranslationKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
