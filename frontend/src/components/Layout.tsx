import { Bell, Building2, ChevronDown, CircleHelp, FolderCheck, LayoutDashboard, LogOut, Menu, Search, Settings, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { resetDemo } from "../api/demo";
import { signOut, type SessionUser } from "../lib/auth";
import { demoMode, exitDemo } from "../lib/config";
import { cx } from "../lib/format";
import { useHub } from "../lib/queries";
import { Logo } from "./ui";

const NAV: Array<{ to: string; label: string; icon: ReactNode; end?: boolean }> = [
  { to: "/", label: "Hub dashboard", icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { to: "/clients", label: "SMME clients", icon: <Building2 className="h-4 w-4" /> },
  { to: "/readiness", label: "Document readiness", icon: <FolderCheck className="h-4 w-4" /> },
  { to: "/settings", label: "Hub settings", icon: <Settings className="h-4 w-4" /> },
];

function DemoBanner() {
  if (!demoMode) return null;
  return (
    <div className="no-print flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-400 px-4 py-1.5 text-center text-xs font-medium text-amber-950">
      <span>Demo mode: simulated data and AI responses, with no AWS backend.</span>
      <button
        className="underline underline-offset-2"
        onClick={() => {
          resetDemo();
          window.location.reload();
        }}
      >
        Reset demo data
      </button>
      <button className="underline underline-offset-2" onClick={exitDemo}>
        Use live backend
      </button>
    </div>
  );
}

export function Layout({ user, onSignedOut }: { user: SessionUser; onSignedOut: () => void }) {
  const [open, setOpen] = useState(false);
  const hub = useHub();
  const navigate = useNavigate();

  const nav = (
    <nav className="flex flex-col gap-1.5"><p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#6d737f]">Workspace</p>
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cx(
              "group flex items-center gap-3 rounded-[15px] px-4 py-3 text-[13px] font-medium transition-all duration-200",
              isActive ? "bg-[#00dfe5] text-[#07262b] shadow-[0_5px_18px_rgba(183,251,69,.14)]" : "text-[#aeb3be] hover:bg-white/[.07] hover:text-white",
            )
          }
        >
          {n.icon}
          {n.label}
        </NavLink>
      ))}
    </nav>
  );

  const account = (
    <div className="rounded-[18px] border border-white/10 bg-white/[.045] p-4">
      <p className="truncate text-sm font-medium text-white">{hub.data?.hubName || "Your hub"}</p>
      <p className="truncate text-xs text-slate-400">{user.name ? `${user.name} · ` : ""}{user.email}</p>
      <button
        className="mt-3 flex items-center gap-2 text-sm text-slate-300 hover:text-white"
        onClick={async () => {
          await signOut();
          onSignedOut();
          navigate("/");
        }}
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );

  return (
    <div className="app-shell min-h-screen lg:p-5 xl:p-7">
      <DemoBanner />
      {/* Mobile header */}
      <header className="no-print sticky top-0 z-30 flex items-center justify-between bg-[#102631] px-5 py-4 lg:hidden">
        <Logo light />
        <button className="rounded-lg p-2 text-white hover:bg-white/10" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>
      {open && (
        <div className="no-print fixed inset-0 z-40 bg-navy-950/60 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="flex h-full w-72 flex-col justify-between bg-[#102631] p-5" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="mb-6 flex items-center justify-between">
                <Logo light />
                <button className="rounded-lg p-2 text-white hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {nav}
            </div>
            {account}
          </aside>
        </div>
      )}
      <div className="app-frame flex min-h-[calc(100vh-56px)] overflow-hidden bg-white lg:rounded-[30px]">
        <aside className="no-print hidden w-[258px] shrink-0 flex-col justify-between bg-[#102631] px-5 py-7 lg:flex">
          <div>
            <div className="mb-14 px-2">
              <Logo light />
              <p className="mt-2 text-[11px] tracking-wide text-[#777f8d]">Your procurement workspace</p>
            </div>
            {nav}
          </div>
          {account}
        </aside>
        <main className="app-main min-w-0 flex-1">
          <div className="no-print flex min-h-[76px] items-center justify-between gap-3 border-b border-[#e9eaee] bg-white px-5 sm:px-8">
            <div className="flex items-center gap-2 text-xs font-medium text-[#8b9099]"><span className="hidden sm:inline">Workspace</span><span className="hidden sm:inline">/</span><span className="text-[#292d34]">Overview</span><ChevronDown className="h-3 w-3" /></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-[#eaecf0] bg-[#f5fafb] px-4 py-2 text-xs text-[#9a9fa7] md:flex"><Search className="h-4 w-4" /> Search workspace</span>
              <span className="rounded-full border border-[#eaecf0] p-2 text-[#707783]"><CircleHelp className="h-4 w-4" /></span>
              <span className="rounded-full border border-[#eaecf0] p-2 text-[#707783]"><Bell className="h-4 w-4" /></span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163a44] text-xs font-bold text-[#00dfe5]">{(user.name || user.email || "T").slice(0, 1).toUpperCase()}</span>
            </div>
          </div>
          <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
