import { NavLink } from "react-router-dom";

const links = [
  ["/", "Dashboard"],
  ["/career-gps", "Career GPS"],
  ["/matchmaker", "Matchmaker"],
  ["/resources", "Resources"],
  ["/admin", "Admin"],
  ["/simulator", "Simulator"],
  ["/career-fair", "Career Fair"],
  ["/mentors", "Mentors"]
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0">
      <nav className="grid gap-1">
        {links.map(([to, label]) => (
          <NavLink className="rounded px-3 py-2 text-sm hover:bg-slate-100" key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
