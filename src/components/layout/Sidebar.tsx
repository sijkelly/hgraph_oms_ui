import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Briefcase,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/credit", label: "Credit", icon: CreditCard },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/parties", label: "Counterparties", icon: Users },
  { to: "/portfolios", label: "Portfolios", icon: Briefcase },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)] flex flex-col">
      <div className="px-5 py-4 text-lg font-semibold tracking-tight border-b border-white/10">
        hgraph OMS
      </div>

      <nav className="flex-1 py-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "hover:bg-[var(--color-sidebar-hover)]",
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-3 text-xs text-slate-500 border-t border-white/10">
        v0.1.0
      </div>
    </aside>
  );
}
