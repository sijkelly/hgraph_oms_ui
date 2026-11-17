import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Briefcase,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/credit", label: "Credit", icon: CreditCard },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/parties", label: "Counterparties", icon: Users },
  { to: "/portfolios", label: "Portfolios", icon: Briefcase },
];

export default function Sidebar() {
  const { displayName, entitlements, signOut } = useAuth();

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

      {/* User info */}
      <div className="border-t border-white/10 px-5 py-3">
        <div className="space-y-1">
          <div className="text-xs text-slate-400">Signed in as</div>
          <div className="text-sm font-medium truncate">{displayName}</div>
          {entitlements && (
            <div className="text-xs text-slate-500">{entitlements.role}</div>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mt-1"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
