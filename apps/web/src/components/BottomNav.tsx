import { NavLink } from "react-router-dom";

const items = [
  { to: "/learn", icon: "school", label: "Learn" },
  { to: "/train", icon: "fitness_center", label: "Train" },
  { to: "/play", icon: "sports_esports", label: "Play" },
  { to: "/ai", icon: "psychology", label: "AI" }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t-0 bg-surface/85 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-4 rounded-full bg-surface-container-lowest px-3 py-2 shadow-[0_8px_32px_rgba(45,47,47,0.08)]">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-full py-2 text-xs font-bold ${isActive ? "text-primary" : "text-on-surface-variant"}`}>
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined ${isActive ? "fill -translate-y-1" : ""}`}>{item.icon}</span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

