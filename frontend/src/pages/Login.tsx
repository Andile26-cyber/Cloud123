import { CheckCircle2, ClipboardCheck, MessageSquareText, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { confirmSignUp, resendCode, signIn, signUp } from "../lib/auth";
import { demoMode } from "../lib/config";
import { Logo } from "../components/ui";

type Mode = "signin" | "signup" | "confirm";

const FEATURES = [
  { icon: <Users className="h-5 w-5" />, title: "One advisor, dozens of SMMEs", text: "Manage every client's tenders from a single hub dashboard." },
  { icon: <ClipboardCheck className="h-5 w-5" />, title: "Instant compliance checklists", text: "CSD, SARS TCS, B-BBEE, SBD/MBD forms and CIDB, all pulled from the tender itself." },
  { icon: <MessageSquareText className="h-5 w-5" />, title: "Ask the tender", text: "Answers based on the document, with page references you can check." },
];

export function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState(demoMode ? "advisor@hub.example" : "");
  const [password, setPassword] = useState(demoMode ? "DemoPassword1" : "");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signin") {
        if ((await signIn(email, password)) === "confirm") {
          await resendCode(email);
          setMode("confirm");
          setInfo("Please confirm your email address. We've sent you a new code.");
        } else onSignedIn();
      } else if (mode === "signup") {
        if ((await signUp(email, password, name)) === "confirm") {
          setMode("confirm");
          setInfo(`We've emailed a verification code to ${email}.`);
        } else onSignedIn();
      } else {
        await confirmSignUp(email, code);
        await signIn(email, password);
        onSignedIn();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative isolate grid min-h-screen overflow-hidden bg-[#091c25] lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/tenderready-cinematic.gif')" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#061820]/90 via-[#061820]/70 to-[#061820]/55" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#061820]/75 via-transparent to-[#061820]/20" aria-hidden="true" />
      <section className="relative hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="relative"><Logo light size="lg" /></div>
        <div className="relative max-w-lg rounded-[28px] border border-white/15 bg-[#11151b]/35 p-7 shadow-[0_20px_80px_rgba(0,0,0,.2)] backdrop-blur-[6px] lg:p-9">
          <h1 className="text-[42px] font-semibold leading-[1.1] tracking-[-.055em]">A digital compliance officer for SMME hubs and incubators.</h1>
          <p className="mt-4 text-base leading-7 text-slate-200">
            Help the businesses you support submit professional, compliant bids and avoid disqualification traps. Upload a tender and get a
            summary, checklist and risk list in minutes.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="rounded-[15px] border border-[#00dfe5]/25 bg-[#00dfe5]/15 p-3 text-[#00dfe5]">{f.icon}</span>
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-sm text-slate-300">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-slate-300/75">Built on Amazon Bedrock and AWS serverless · AWS AI Hackathon 2026</p>
      </section>

      <section className="cinematic-auth relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-[28px] border border-white/20 bg-[#0b2731]/90 p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
            <p className="mt-2 text-sm text-slate-500">A digital compliance officer for SMME hubs</p>
          </div>
          <h2 className="text-2xl font-semibold text-navy-900">
            {mode === "signin" ? "Sign in to your hub" : mode === "signup" ? "Create a hub account" : "Verify your email"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "signup" ? "For advisors at incubators, enterprise development programmes and business support centres." : mode === "confirm" ? "Enter the 6-digit code from your inbox." : "Welcome back."}
          </p>
          {demoMode && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
              Demo mode: any email and password will sign you in.
            </p>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="label" htmlFor="name">Your name</label>
                <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </div>
            )}
            {mode !== "confirm" && (
              <>
                <div>
                  <label className="label" htmlFor="email">Work email</label>
                  <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div>
                  <label className="label" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={10}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                  {mode === "signup" && <p className="mt-1 text-xs text-slate-500">At least 10 characters with upper case, lower case and a number.</p>}
                </div>
              </>
            )}
            {mode === "confirm" && (
              <div>
                <label className="label" htmlFor="code">Verification code</label>
                <input id="code" className="input tracking-widest" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} required autoComplete="one-time-code" />
              </div>
            )}

            {info && (
              <p className="flex items-center gap-2 text-sm text-ok-600">
                <CheckCircle2 className="h-4 w-4" /> {info}
              </p>
            )}
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Verify and sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {mode === "signin" ? (
              <>
                New to TenderReady?{" "}
                <button className="font-medium text-brand-600 hover:underline" onClick={() => setMode("signup")}>Create an account</button>
              </>
            ) : mode === "signup" ? (
              <>
                Already registered?{" "}
                <button className="font-medium text-brand-600 hover:underline" onClick={() => setMode("signin")}>Sign in</button>
              </>
            ) : (
              <button className="font-medium text-brand-600 hover:underline" onClick={() => resendCode(email).then(() => setInfo("A new code has been sent."))}>
                Resend code
              </button>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
