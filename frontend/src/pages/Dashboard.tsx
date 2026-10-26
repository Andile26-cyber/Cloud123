import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronRight, Clock3, FileStack, Plus, ShieldCheck, Sparkles, Users2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, EmptyState, ErrorBox, ProgressBar, Spinner, StatusBadge } from "../components/ui";
import { closingLabel, formatDateTime } from "../lib/format";
import { useDashboard } from "../lib/queries";
import { HubSetupCard } from "./Settings";

export function Dashboard() {
  const q = useDashboard();
  if (q.isPending) return <Spinner />;
  if (q.isError) return <ErrorBox error={q.error} onRetry={() => q.refetch()} />;
  const { stats, upcoming, hub } = q.data;
  const metrics = [
    { label: "SMME clients", value: stats.clients, icon: Users2, note: "Businesses in your hub", trend: "Portfolio" },
    { label: "Active tenders", value: stats.activeTenders, icon: FileStack, note: "Currently being tracked", trend: "Live" },
    { label: "Closing in 7 days", value: stats.closingIn7Days, icon: Clock3, note: "Need your attention", trend: "This week" },
    { label: "Open mandatory items", value: stats.openMandatory, icon: ShieldCheck, note: "Requirements to complete", trend: "Compliance" },
  ];
  return (
    <div className="relative isolate -m-4 min-h-screen overflow-hidden rounded-[28px] bg-gradient-to-br from-[#E8F8F8]/95 via-[#DDF3F3]/85 to-[#C8EAEA]/75 p-4 sm:-m-6 sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-8 -z-10 h-80 w-80 rounded-full bg-[#00DFE5]/15 blur-3xl" />
      <div className="relative space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.19em] text-[#8a9098]"><span className="h-1.5 w-1.5 rounded-full bg-[#18C7B7]" /> Hub intelligence <span className="text-[#b7bac1]">/</span> Overview</div>
          <h1 className="text-[32px] font-semibold leading-tight tracking-[-.05em] text-[#1b1e24] sm:text-[38px]">{hub?.hubName || "Your workspace"}<span className="text-[#a5a9b0]">.</span></h1>
          <p className="mt-2 text-[13px] text-[#858b94]">A clearer view of your clients, tenders and compliance priorities.</p>
        </div>
        <Link to="/clients?new=1" className="btn-primary"><Plus className="h-4 w-4" /> Add SMME client <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
      {!hub?.hubName && <HubSetupCard />}

      <section className="dashboard-dark relative overflow-hidden rounded-[28px] p-5 sm:p-7">
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-28 h-64 w-64 rounded-full border border-white/10" />
        <div aria-hidden className="pointer-events-none absolute -right-2 -top-14 h-48 w-48 rounded-full border border-white/10" />
        <div className="relative mb-7 flex flex-wrap items-center justify-between gap-3">
          <div><div className="flex items-center gap-2 text-xs font-medium text-[#b8bdc7]"><Sparkles className="h-4 w-4 text-[#00dfe5]" /> Performance snapshot</div><h2 className="mt-1 text-[23px] font-semibold tracking-[-.04em] text-white">The numbers that matter.</h2></div>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-[11px] text-[#d5d8dd]"><span className="h-1.5 w-1.5 rounded-full bg-[#00dfe5]" /> Live workspace data</span>
        </div>
        <div className="relative grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <div key={metric.label} className="group rounded-[22px] border border-white/[.08] bg-white/[.055] p-4 transition hover:bg-white/[.09] sm:p-5">
              <div className="mb-6 flex items-start justify-between gap-2"><span className="text-[11px] font-medium text-[#afb4bf]">{metric.label}</span><span className="rounded-full border border-white/10 p-2 text-[#00dfe5]"><metric.icon className="h-4 w-4" /></span></div>
              <div className="flex items-end gap-2"><span className="text-[37px] font-semibold leading-none tracking-[-.065em] text-white sm:text-[43px]">{metric.value}</span><span className="mb-1.5 rounded-full bg-[#00dfe5]/10 px-2 py-1 text-[10px] font-semibold text-[#00dfe5]">{i === 2 && stats.closingIn7Days ? <ArrowDownRight className="inline h-3 w-3" /> : <ArrowUpRight className="inline h-3 w-3" />} {metric.trend}</span></div>
              <p className="mt-3 text-[11px] text-[#858d9b]">{metric.note}</p>
              <div className="mt-5 flex h-1.5 items-end gap-1 overflow-hidden rounded-full bg-white/[.08]">{Array.from({length:10},(_,n)=><span key={n} className="h-full flex-1 rounded-full" style={{background: n < (i===0?8:i===1?6:i===2?3:5) ? '#00dfe5' : '#414752'}} />)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_295px]">
        <div className="dashboard-deadlines min-w-0 rounded-[26px] border border-[#18C7B7]/25 !bg-white/55 p-5 shadow-[0_12px_40px_rgba(11,38,48,0.08)] backdrop-blur-xl sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div><div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#9ba0a9]"><CalendarDays className="h-3.5 w-3.5" /> Deadline tracker</div><h2 className="text-[23px] font-semibold tracking-[-.045em] text-[#20232a]">Upcoming tenders</h2></div>
            <Link to="/clients" className="inline-flex items-center gap-2 rounded-full border border-[#18C7B7]/30 bg-white/45 px-4 py-2 text-xs font-semibold text-[#173B43] transition hover:bg-[#D6F6F5]/75">View clients <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState title="No active tenders yet" action={<Link to="/clients" className="btn-primary">Go to clients <ArrowRight className="h-4 w-4" /></Link>}>Add an SMME client, then upload a tender or RFQ PDF to generate its compliance checklist.</EmptyState>
          ) : (
            <div className="space-y-2">
              {upcoming.map((u) => {
                const closing = closingLabel(u.closingDate);
                return <Link key={u.tenderId} to={`/tenders/${u.tenderId}`} className="group flex flex-col gap-4 rounded-[18px] border border-[#18C7B7]/20 bg-white/50 p-4 shadow-sm backdrop-blur-md transition hover:border-[#18C7B7]/55 hover:bg-[#E3F8F7]/80 sm:flex-row sm:items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#20242d] text-[#00dfe5]"><FileStack className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-[#242832]">{u.title ?? u.fileName}</p><p className="mt-1 truncate text-xs text-[#90959f]">{u.clientName}</p></div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">{u.status === "READY" ? <><Badge tone={closing.tone}>{closing.text}</Badge>{u.highRisks > 0 && <Badge tone="red"><AlertTriangle className="h-3 w-3" />{u.highRisks} high risk{u.highRisks === 1 ? "" : "s"}</Badge>}</> : <StatusBadge status={u.status} />}</div>
                  <div className="min-w-[120px] sm:w-32">{u.checklistProgress !== null ? <><div className="mb-2 flex justify-between text-[11px] text-[#858b95]"><span>Checklist</span><span className="font-semibold text-[#272c34]">{u.checklistProgress}%</span></div><ProgressBar value={u.checklistProgress} /></> : <p className="text-xs text-[#9298a2]">{u.closingDate ? formatDateTime(u.closingDate) : "Analysing…"}</p>}</div>
                  <ChevronRight className="hidden h-4 w-4 text-[#9299a2] transition group-hover:translate-x-1 sm:block" />
                </Link>;
              })}
            </div>
          )}
          <p className="mt-5 text-[11px] leading-relaxed text-[#9ca2aa]">Checklist progress counts requirements ticked off. It does not predict bid eligibility or award.</p>
        </div>
        <aside className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-[26px] bg-[#00dfe5] p-6 text-[#1a2020]"><div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[20px] border-[#102631]/[.08]" /><span className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#1d2225] text-[#00dfe5]"><Sparkles className="h-5 w-5" /></span><h3 className="relative mt-8 text-[24px] font-semibold leading-[1.08] tracking-[-.05em]">Every document.<br />One clear view.</h3><p className="relative mt-3 text-xs leading-relaxed text-[#3f512e]">Keep your client compliance records organised and ready for the next opportunity.</p><Link to="/readiness" className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-[#1c2223] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#313a36]">Document readiness <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
          <div className="rounded-[24px] border border-[#18C7B7]/25 bg-white/55 p-5 shadow-sm backdrop-blur-xl"><div className="mb-3 flex items-center gap-2"><span className="rounded-full bg-[#18C7B7]/15 p-2 text-[#078D89]"><Check className="h-4 w-4" /></span><span className="text-[13px] font-semibold text-[#292d34]">Built for better bids</span></div><p className="text-xs leading-relaxed text-[#9298a2]">From tender review to document checks, keep the details connected across your workspace.</p><Link to="/clients" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#087F83]">Explore clients <ArrowRight className="h-3.5 w-3.5" /></Link></div>
        </aside>
      </section>
      </div>
    </div>
  );
}
