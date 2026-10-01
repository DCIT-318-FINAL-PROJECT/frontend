"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Hash,
  Home,
  Image as ImageIcon,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type IDRecord = {
  id: string;
  name: string;
  index: string;
  institution: string;
  location: string;
  time: string;
  status: "Found" | "Solved" | "Lost";
  photo?: string;
  own?: boolean;
};
type Profile = { name: string; email: string; index: string };
const initialRecords: IDRecord[] = [
  {
    id: "ama",
    name: "Ama Mensah",
    index: "22012345",
    institution: "University of Ghana",
    location: "Balme Library, Legon",
    time: "Today, 2:15 PM",
    status: "Found",
  },
  {
    id: "kwame",
    name: "Kwame Asante",
    index: "23012345",
    institution: "University of Ghana",
    location: "Campus security office",
    time: "2 hours ago",
    status: "Found",
  },
  {
    id: "abena",
    name: "Abena Mansa",
    index: "24012345",
    institution: "University of Ghana",
    location: "Akuafo Hall reception",
    time: "Yesterday",
    status: "Found",
  },
  {
    id: "marcus",
    name: "Marcus Thompson",
    index: "22000928",
    institution: "State University of Technology",
    location: "Campus security office",
    time: "15 mins ago",
    status: "Found",
  },
  {
    id: "sarah",
    name: "Sarah Jenkins",
    index: "22000104",
    institution: "Metropolitan Arts College",
    location: "Student services",
    time: "2 hours ago",
    status: "Solved",
  },
];
const defaultProfile = {
  name: "Ama Mensah",
  email: "ama@st.ug.edu.gh",
  index: "22012345",
};
function IconBox({
  icon: Icon,
  tone = "",
  children,
}: {
  icon: LucideIcon;
  tone?: string;
  children?: ReactNode;
}) {
  return (
    <span className={`icon-box ${tone}`}>
      <Icon size={21} />
      {children}
    </span>
  );
}
function Notice({
  children,
  kind = "info",
}: {
  children: ReactNode;
  kind?: string;
}) {
  return (
    <div className={`notice ${kind}`}>
      <IconBox
        icon={
          kind === "success"
            ? CheckCircle2
            : kind === "warning"
              ? Info
              : ShieldCheck
        }
      />
      <div>{children}</div>
    </div>
  );
}
function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <span
      className={`avatar ${large ? "large" : ""} ${name === "Ama Mensah" ? "ama" : ""}`}
    >
      {name === "Ama Mensah"
        ? ""
        : name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
    </span>
  );
}
function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        {Icon && <Icon size={21} />}
        {children}
      </div>
    </label>
  );
}
function Password({
  label = "Password",
  name = "password",
}: {
  label?: string;
  name?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} icon={Lock}>
      <input
        name={name}
        type={show ? "text" : "password"}
        placeholder={
          label === "Confirm Password"
            ? "Re-enter your password"
            : "Enter your password"
        }
        minLength={8}
        required
        autoComplete={name === "confirm" ? "new-password" : "current-password"}
      />
      <button
        type="button"
        className="plain eye"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </Field>
  );
}

export default function FindMyID() {
  const pathname = usePathname();
  const router = useRouter();
  const page = pathname.split("/")[1] || "welcome";
  const [records, setRecords] = useState(initialRecords);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<IDRecord>({
    id: "",
    name: "",
    index: "",
    institution: "University of Ghana",
    location: "",
    time: "",
    status: "Found",
    own: true,
  });
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("ama");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [panel, setPanel] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    alerts: true,
    email: true,
    dark: false,
  });
  useEffect(() => {
    try {
      const r = localStorage.getItem("findmyid-records");
      if (r) setRecords(JSON.parse(r));
      const p = localStorage.getItem("findmyid-profile");
      if (p) setProfile(JSON.parse(p));
      const s = localStorage.getItem("findmyid-prefs");
      if (s) setPrefs(JSON.parse(s));
      const d = sessionStorage.getItem("findmyid-draft");
      if (d) setDraft(JSON.parse(d));
      const id = sessionStorage.getItem("findmyid-selected");
      if (id) setSelected(id);
    } catch {
      setToast("Saved demo data could not be loaded.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("findmyid-records", JSON.stringify(records));
      localStorage.setItem("findmyid-profile", JSON.stringify(profile));
      localStorage.setItem("findmyid-prefs", JSON.stringify(prefs));
      sessionStorage.setItem("findmyid-draft", JSON.stringify(draft));
      sessionStorage.setItem("findmyid-selected", selected);
    } catch {
      setError("Browser storage is full. Try a smaller ID photo.");
    }
  }, [records, profile, prefs, draft, selected, ready]);
  useEffect(() => {
    setError("");
    setPanel("");
    setSent(false);
  }, [page]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const record = records.find((r) => r.id === selected) || records[0];
  const openRecord = (r: IDRecord) => {
    setSelected(r.id);
    router.push("/details");
  };
  const logout = () => {
    setProfile(defaultProfile);
    setToast("Signed out of the demo session.");
    router.push("/");
  };
  const titles: Record<string, string> = {
    login: "FindMyID",
    "create-account": "Create Account",
    home: "FindMyID",
    search: "Search Results",
    report: "Report Found ID",
    review: "Review Report",
    success: "Success",
    details: "ID Details",
    contact: "Contact Finder",
    reports: "My Reports",
    notifications: "Notifications",
    profile: "FindMyID",
    settings: "Settings",
  };
  const brand = ["welcome", "profile", "home"].includes(page);
  const nav = !["welcome", "login", "create-account"].includes(page);
  const desktopLinks = [
    { icon: Home, label: "Overview", href: "/home", pages: ["home"] },
    {
      icon: Search,
      label: "Find an ID",
      href: "/search",
      pages: ["search", "details", "contact"],
    },
    {
      icon: PlusCircle,
      label: "Report Found ID",
      href: "/report",
      pages: ["report", "review", "success"],
    },
    {
      icon: FileText,
      label: "My Reports",
      href: "/reports",
      pages: ["reports"],
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      pages: ["notifications"],
    },
    { icon: User, label: "My Profile", href: "/profile", pages: ["profile"] },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      pages: ["settings"],
    },
  ];
  const footer = (
    <footer className="university">
      <span />
      UNIVERSITY OF GHANA
    </footer>
  );
  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push("/search");
  };
  const matches = records.filter(
    (r) =>
      r.status !== "Solved" &&
      (r.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        r.index === query.trim() ||
        (/^\d{4,8}$/.test(query.trim()) &&
          r.index.slice(-4) === query.trim().slice(-4))),
  );
  const toggle = (key: string) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  const reportCards = (list: IDRecord[]) =>
    list.map((r) => (
      <button className="result-card" key={r.id} onClick={() => openRecord(r)}>
        <div className="person-row">
          <Avatar name={r.name} />
          <div>
            <h3>{r.name}</h3>
            <p>{r.institution}</p>
            <small>
              <ShieldCheck size={14} /> {r.index.slice(0, 4)}****
            </small>
            <small>
              <Clock size={14} /> Found {r.time.toLowerCase()}
            </small>
          </div>
        </div>
        <div className="card-action">
          <span className={r.status === "Solved" ? "green" : ""}>
            ● {r.status === "Solved" ? "Recovered" : "Found · Awaiting claim"}
          </span>
          <span>
            View Details <ArrowRight size={17} />
          </span>
        </div>
      </button>
    ));
  const settingRow = (
    title: string,
    subtitle: string,
    Icon: LucideIcon,
    key?: string,
  ) => (
    <button
      className="setting-row"
      onClick={() => (key ? toggle(key) : setPanel(title))}
      key={title}
    >
      <IconBox icon={Icon} />
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      {key ? (
        <span
          className={`toggle ${prefs[key] ? "on" : ""}`}
          role="switch"
          aria-checked={!!prefs[key]}
          aria-label={title}
        />
      ) : (
        <ChevronRight size={19} />
      )}
    </button>
  );
  return (
    <div
      className={`app-shell ${nav ? "workspace" : "public-shell"} ${prefs.dark ? "dark" : ""}`}
    >
      {nav && (
        <aside className="desktop-sidebar">
          <Link href="/home" className="brand">
            <span className="brand-mark">
              <CreditCard size={23} />
            </span>
            <span>
              FindMyID<small>UNIVERSITY OF GHANA</small>
            </span>
          </Link>
          <p className="eyebrow sidebar-label">STUDENT WORKSPACE</p>
          <nav aria-label="Desktop navigation">
            {desktopLinks.map(({ icon: Icon, label, href, pages }) => (
              <Link
                key={href}
                href={href}
                className={pages.includes(page) ? "active" : ""}
                aria-current={pages.includes(page) ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{label}</span>
                {pages.includes(page) && <span className="nav-dot" />}
              </Link>
            ))}
          </nav>
          <div className="sidebar-community">
            <IconBox icon={ShieldCheck} tone="blue" />
            <strong>A little help goes a long way.</strong>
            <p>Help a fellow student get back to campus life.</p>
            <Link href="/report">
              Report an ID <ArrowRight size={15} />
            </Link>
          </div>
          <div className="sidebar-account">
            <Link href="/profile">
              <Avatar name={profile.name} />
              <span>
                <strong>{profile.name}</strong>
                <small>Student account</small>
              </span>
            </Link>
            <button className="plain" aria-label="Sign out" onClick={logout}>
              <LogOut size={18} />
            </button>
          </div>
        </aside>
      )}
      {["login", "create-account"].includes(page) && (
        <aside className="desktop-auth-story">
          <span className="eyebrow">YOUR CAMPUS. YOUR COMMUNITY.</span>
          <h2>
            One lost card.
            <br />A whole community
            <br />
            ready to help.
          </h2>
          <div
            className="welcome-art"
            role="img"
            aria-label="A student holding a recovered ID and a phone"
          />
          <p>
            Find your ID. Help someone find theirs.
            <br />
            Stay connected to the University of Ghana community.
          </p>
          <div>
            <ShieldCheck size={18} /> Made for a safer handover.
          </div>
        </aside>
      )}
      <header className="app-header">
        {nav && (
          <span className="desktop-page-label">
            {desktopLinks.find((link) => link.pages.includes(page))?.label}
            <small>University of Ghana / {titles[page]}</small>
          </span>
        )}
        {brand ? (
          <Link href="/" className="brand">
            <span className="brand-mark">
              <CreditCard size={21} />
            </span>
            <span>
              FindMyID{page !== "home" && <small>UNIVERSITY OF GHANA</small>}
            </span>
          </Link>
        ) : (
          <>
            <button
              className="plain back"
              aria-label="Go back"
              onClick={() =>
                router.push(
                  (
                    {
                      login: "/",
                      "create-account": "/",
                      review: "/report",
                      success: "/home",
                      details: "/search",
                      contact: "/details",
                      settings: "/profile",
                      reports: "/profile",
                      notifications: "/home",
                    } as Record<string, string>
                  )[page] || "/home",
                )
              }
            >
              <ArrowLeft size={23} />
            </button>
            <strong>{titles[page]}</strong>
          </>
        )}
        {![
          "login",
          "create-account",
          "report",
          "review",
          "settings",
          "reports",
          "contact",
        ].includes(page) && (
          <Link
            className="notification-link"
            href="/notifications"
            aria-label="Notifications"
          >
            <Bell size={22} />
            {prefs.alerts && <i />}
          </Link>
        )}
        {brand && page !== "home" && (
          <Link
            href="/profile"
            aria-label="Profile"
            className="mobile-header-profile"
          >
            <Avatar name={profile.name} />
          </Link>
        )}
        {nav && (
          <div className="desktop-header-account">
            <Link href="/notifications" aria-label="View notifications">
              <Bell size={21} />
            </Link>
            <span className="header-divider" />
            <Link href="/profile">
              <Avatar name={profile.name} />
              <span>
                {profile.name}
                <small>University of Ghana</small>
              </span>
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </header>
      <main className={`screen screen-${page}`}>
        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}
        {page === "welcome" && (
          <>
            <div
              className="welcome-art"
              role="img"
              aria-label="A student holding a recovered ID and a phone"
            />
            <h1>
              Find your ID. Help someone
              <br className="wide-break" /> find theirs.
            </h1>
            <p className="welcome-copy">
              FindMyID helps University of Ghana students report, search for and
              safely recover lost student IDs.
            </p>
            <div className="welcome-actions">
              <Link className="button" href="/create-account">
                Create Account
              </Link>
              <Link className="login-link" href="/login">
                Log In <ChevronRight size={20} />
              </Link>
              <Link className="demo-link" href="/home">
                Explore the demo <ArrowRight size={14} />
              </Link>
            </div>
            {footer}
          </>
        )}
        {["login", "create-account"].includes(page) && (
          <>
            <h1>{page === "login" ? "Welcome back" : "Join FindMyID"}</h1>
            <p className="intro">
              {page === "login"
                ? "Log in to find your ID, track reports and receive match alerts."
                : "Create your account to report and recover student IDs within the University of Ghana community."}
            </p>
            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                if (
                  page === "create-account" &&
                  data.get("password") !== data.get("confirm")
                )
                  return setError("Your passwords do not match.");
                const email = String(data.get("email"));
                if (!/^[^@]+@(?:st\.)?ug\.edu\.gh$/i.test(email))
                  return setError(
                    "Use your University of Ghana email address.",
                  );
                setProfile({
                  name: String(data.get("name") || profile.name),
                  email,
                  index: String(data.get("index") || profile.index),
                });
                setToast("Demo session started.");
                router.push("/home");
              }}
            >
              {page === "create-account" && (
                <Field label="Full Name" icon={User}>
                  <input
                    name="name"
                    placeholder="Enter your full name"
                    required
                  />
                </Field>
              )}
              <Field label="University Email" icon={Mail}>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your UG student email"
                  required
                />
              </Field>
              {page === "create-account" && (
                <Field label="Index Number" icon={Hash}>
                  <input
                    name="index"
                    placeholder="Enter your 8-digit index number"
                    inputMode="numeric"
                    pattern="[0-9]{8}"
                    required
                    maxLength={8}
                  />
                </Field>
              )}
              <Password />
              {page === "create-account" ? (
                <>
                  <Password label="Confirm Password" name="confirm" />
                  <label className="consent">
                    <input type="checkbox" required />
                    <span>
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => setPanel("Terms and Privacy Policy")}
                      >
                        Terms and Privacy Policy.
                      </button>
                    </span>
                  </label>
                </>
              ) : (
                <button
                  type="button"
                  className="text-link forgot"
                  onClick={() => setPanel("Password recovery")}
                >
                  Forgot Password?
                </button>
              )}
              <button className="button">
                {page === "login" ? "Log In" : "Create Account"}
              </button>
            </form>
            <p className="auth-switch">
              {page === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <Link href="/create-account">Create Account</Link>
                </>
              ) : (
                <>
                  Already have an account? <Link href="/login">Log In</Link>
                </>
              )}
            </p>
            <Notice>
              <strong>DEMO ACCOUNT</strong>
              <p>
                This prototype saves profile details on this browser. Passwords
                are not stored. Use sample information.
              </p>
            </Notice>
            {footer}
          </>
        )}
        {page === "home" && (
          <>
            <div className="desktop-overview-heading">
              <span className="eyebrow">WELCOME TO YOUR CAMPUS COMMUNITY</span>
              <h2>A small act. A big difference.</h2>
              <p>
                Find what’s yours and help return what matters to someone else.
              </p>
            </div>
            <section className="home-search-panel">
              <h1>Find your ID</h1>
              <p className="intro">
                Search our community database by name or index number to see if
                your lost card has been reported.
              </p>
              <form onSubmit={submitSearch} className="search-form">
                <div className="input-wrap">
                  <Search size={22} />
                  <input
                    aria-label="Name or index number"
                    placeholder="Enter name or index number..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                  />
                </div>
                <button className="button compact">Search for ID</button>
              </form>
            </section>
            <section className="found-card">
              <div className="person-row">
                <IconBox icon={PlusCircle} tone="blue" />
                <div>
                  <h3>Found someone’s ID?</h3>
                  <p>
                    Submit a report to help us return it to the rightful owner
                    safely.
                  </p>
                </div>
              </div>
              <Link className="button outline compact" href="/report">
                Report Found ID
              </Link>
            </section>
            <div className="section-title">
              <h2>Recently Reported</h2>
              <Link
                href="/search"
                onClick={() => {
                  setQuery("");
                }}
              >
                VIEW ALL
              </Link>
            </div>
            <div className="recent-list">
              {[
                ...records.filter((r) => r.own),
                ...records.filter((r) => ["marcus", "sarah"].includes(r.id)),
              ]
                .slice(0, 4)
                .map((r) => (
                  <button
                    className="recent-card"
                    onClick={() => openRecord(r)}
                    key={r.id}
                  >
                    <Avatar name={r.name} />
                    <div>
                      <h3>{r.name}</h3>
                      <p>{r.institution}</p>
                      <small>
                        <ShieldCheck size={13} />
                        {r.index.slice(0, 3)}-****-{r.index.slice(-3)}{" "}
                        <Clock size={13} />
                        {r.time}
                      </small>
                    </div>
                    <span
                      className={`badge ${r.status === "Solved" ? "green" : ""}`}
                    >
                      {r.status === "Solved" ? "RECOVERED" : "PENDING"}
                    </span>
                  </button>
                ))}
            </div>
          </>
        )}
        {page === "search" && (
          <>
            <form onSubmit={submitSearch} className="search-form">
              <div className="input-wrap">
                <Search size={20} />
                <input
                  aria-label="Search IDs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Name or index number"
                />
                <button className="text-link" type="submit">
                  Search
                </button>
              </div>
            </form>
            <div className="section-title">
              <h2>
                {query ? `${matches.length} possible matches` : "Reported IDs"}
              </h2>
            </div>
            <Notice>
              Matches may share the same last four digits. Verify identity
              carefully.
            </Notice>
            <p className="eyebrow">MATCHING ID RECORDS</p>
            <div className="results-grid">
              {matches.length ? (
                reportCards(matches)
              ) : (
                <section className="empty">
                  <Search size={40} />
                  <h2>No matching IDs yet</h2>
                  <p>
                    Try another name or index number. New reports will appear
                    here.
                  </p>
                  <Link className="button outline" href="/home">
                    Back to Home
                  </Link>
                </section>
              )}
            </div>
            <div className="muted-panel">
              Can’t find your exact ID? Check back later or ask at the campus
              security office.
            </div>
          </>
        )}
        {page === "report" && (
          <>
            <div className="section-heading">
              <IconBox icon={ShieldCheck} tone="solid" />
              <h1>Help return this ID</h1>
            </div>
            <p className="intro">
              Fill in the details exactly as they appear on the card to help us
              find the owner.
            </p>
            <form
              className="report-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.photo)
                  return setError(
                    "Add a clear photo of the ID before continuing.",
                  );
                router.push("/review");
              }}
            >
              <Field label="NAME ON ID" icon={User}>
                <input
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Enter name shown on ID"
                />
              </Field>
              <Field label="INDEX NUMBER" icon={Hash}>
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  value={draft.index}
                  onChange={(e) =>
                    setDraft({ ...draft, index: e.target.value })
                  }
                  placeholder="Enter 8-digit index number"
                />
              </Field>
              <Field label="INSTITUTION" icon={Building2}>
                <input value="University of Ghana" disabled />
              </Field>
              <div className="section-title">
                <h2>ID Photo</h2>
                <span className="eyebrow blue-text">REQUIRED</span>
              </div>
              <div className="upload-box">
                {draft.photo ? (
                  <img src={draft.photo} alt="Uploaded ID preview" />
                ) : (
                  <>
                    <span className="camera-circle">
                      <Camera size={27} />
                    </span>
                    <strong>Add a clear photo of the ID</strong>
                    <p>
                      Make sure the name and index
                      <br /> number are visible.
                    </p>
                  </>
                )}
              </div>
              <div className="upload-actions">
                {[true, false].map((camera) => (
                  <label
                    className="button outline compact"
                    key={String(camera)}
                  >
                    {camera ? <Camera size={18} /> : <ImageIcon size={18} />}{" "}
                    {camera ? "Take Photo" : "Gallery"}
                    <input
                      className="file-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      capture={camera ? "environment" : undefined}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        if (
                          !["image/jpeg", "image/png", "image/webp"].includes(
                            f.type,
                          )
                        )
                          return setError("Choose a JPG, PNG, or WebP image.");
                        if (f.size > 2 * 1024 * 1024)
                          return setError("Choose an image smaller than 2 MB.");
                        const reader = new FileReader();
                        reader.onload = () => {
                          setDraft((d) => ({
                            ...d,
                            photo: String(reader.result),
                          }));
                          setError("");
                        };
                        reader.readAsDataURL(f);
                      }}
                    />
                  </label>
                ))}
              </div>
              <Field label="LOCATION FOUND" icon={MapPin}>
                <input
                  required
                  value={draft.location}
                  onChange={(e) =>
                    setDraft({ ...draft, location: e.target.value })
                  }
                  placeholder="e.g. Balme Library, Legon"
                />
              </Field>
              <button
                className="button"
                disabled={
                  !draft.name ||
                  !/^\d{8}$/.test(draft.index) ||
                  !draft.photo ||
                  !draft.location
                }
              >
                Continue <ArrowRight size={19} />
              </button>
            </form>
          </>
        )}
        {page === "review" && (
          <>
            <div className="section-heading">
              <IconBox icon={FileText} tone="solid" />
              <h1>Check the details</h1>
            </div>
            <p className="intro">
              Check the details before submitting. Make sure the index number
              and institution are correct.
            </p>
            {draft.name ? (
              <>
                <section className="card top-accent">
                  <div className="person-row">
                    <Avatar name={draft.name} />
                    <div>
                      <h2>{draft.name}</h2>
                      <span className="blue-text">Report Summary</span>
                    </div>
                  </div>
                  <div className="detail-list inset">
                    <Detail icon={User} label="FULL NAME" value={draft.name} />
                    <Detail
                      icon={Hash}
                      label="INDEX NUMBER"
                      value={draft.index}
                    />
                    <Detail
                      icon={Building2}
                      label="INSTITUTION"
                      value={draft.institution}
                    />
                    <Detail
                      icon={MapPin}
                      label="LOCATION"
                      value={draft.location}
                    />
                  </div>
                  <Link className="change-link" href="/report">
                    CHANGE INFORMATION <ChevronRight size={16} />
                  </Link>
                </section>
                <Notice kind="success">
                  <strong>Ready to submit</strong>
                </Notice>
                <Notice>
                  <strong>Privacy Note</strong>
                  <p>
                    This demo stores the report and photo on this browser only.
                    Use sample ID data.
                  </p>
                </Notice>
                <button
                  className="button"
                  onClick={() => {
                    if (
                      !draft.photo ||
                      !/^\d{8}$/.test(draft.index) ||
                      !draft.location
                    )
                      return setError("Complete all report details first.");
                    const r = {
                      ...draft,
                      id: crypto.randomUUID(),
                      time: "Just now",
                      own: true,
                    };
                    setRecords((prev) => [r, ...prev]);
                    setSelected(r.id);
                    setDraft({ ...draft, id: r.id });
                    router.push("/success");
                  }}
                >
                  Submit Report <CheckCircle2 size={20} />
                </button>
              </>
            ) : (
              <EmptyReport />
            )}
          </>
        )}
        {page === "success" && (
          <>
            <div className="success-hero">
              <span>
                <CheckCircle2 size={49} />
              </span>
              <h1>Report submitted</h1>
              <p>
                Thank you for helping return a student ID.
                <br />
                Your report is now saved in this demo.
              </p>
            </div>
            <section className="card top-accent">
              <div className="section-title">
                <span className="eyebrow">REPORT SUMMARY</span>
                <span className="badge green">Active</span>
              </div>
              <div className="person-row inset">
                <CreditCard size={32} />
                <div>
                  <small className="blue-text">REPORTED IDENTITY</small>
                  <h2>{draft.name || record.name}</h2>
                </div>
              </div>
              <div className="detail-list">
                <Detail
                  icon={Hash}
                  label="INDEX NO."
                  value={"••••" + (draft.index || record.index).slice(-4)}
                />
                <Detail
                  icon={Building2}
                  label="INSTITUTION"
                  value="University of Ghana"
                />
                <Detail
                  icon={ShieldCheck}
                  label="STATUS"
                  value="Reported · Awaiting claim"
                />
              </div>
            </section>
            <Link className="button" href="/reports">
              View My Reports
            </Link>
            <Link className="center-link" href="/home">
              Back to Home
            </Link>
            {footer}
          </>
        )}
        {page === "details" && (
          <>
            <section className="student-card">
              <div className="section-title">
                <div>
                  <span className="eyebrow">STUDENT IDENTIFICATION</span>
                  <h3>{record.institution}</h3>
                </div>
                <IconBox icon={Building2} />
              </div>
              <div className="person-row">
                <Avatar name={record.name} large />
                <div>
                  <h1>{record.name}</h1>
                  <span className="eyebrow">INDEX NUMBER</span>
                  <strong className="masked-index">
                    ••••{record.index.slice(-4)}
                  </strong>
                </div>
              </div>
              <small>
                — — — <span>FINDMYID DEMO · STUDENT ID</span>
              </small>
            </section>
            <Notice>
              Some student information is hidden to protect privacy. Verify
              ownership before arranging a handover.
            </Notice>
            <section className="card">
              <div className="section-title">
                <span className="eyebrow">REPORTED DISCOVERY</span>
                <span className="badge green">DEMO REPORT</span>
              </div>
              <div className="detail-list">
                <Detail icon={Clock} label="TIME FOUND" value={record.time} />
                <Detail
                  icon={MapPin}
                  label="LOCATION"
                  value={record.location}
                />
                <Detail
                  icon={ShieldCheck}
                  label="STATUS"
                  value={
                    record.status === "Solved"
                      ? "Recovered"
                      : "Found · Awaiting claim"
                  }
                />
              </div>
            </section>
            <section className="card">
              <div className="person-row">
                <IconBox icon={Info} tone="orange" />
                <h3>Recovery Instruction</h3>
              </div>
              <p className="intro">
                Arrange a handover at the campus security office or another
                approved University of Ghana location. Bring proof of your
                identity.
              </p>
            </section>
            {record.status !== "Solved" && (
              <Link className="button" href="/contact">
                Contact Finder <MessageCircle size={20} />
              </Link>
            )}
          </>
        )}
        {page === "contact" && (
          <>
            <div className="section-heading">
              <CheckCircle2 className="blue-text" size={22} />
              <h2>Match Summary</h2>
            </div>
            <section className="card match-card">
              <div className="match-heading">
                <small className="blue-text">STATUS: POSSIBLE MATCH</small>
                <h2>Your ID may have been found</h2>
              </div>
              <div className="person-row">
                <IconBox icon={CreditCard} />
                <div>
                  <h3>{record.institution}</h3>
                  <code>Index No. ••••{record.index.slice(-4)}</code>
                </div>
              </div>
            </section>
            <div className="section-heading">
              <Users className="blue-text" size={22} />
              <h2>Reported By</h2>
            </div>
            <section className="card person-row">
              <Avatar name="Kwame Owusu" />
              <div>
                <h2>{record.own ? "You" : "Kwame Owusu"}</h2>
                <p>Reported {record.time.toLowerCase()}</p>
                <span className="badge">Demo Student</span>
              </div>
            </section>
            <div className="section-heading">
              <MapPin className="blue-text" size={22} />
              <h2>Arrange a safe handover</h2>
            </div>
            <section className="card">
              <p className="intro">
                Use the message option below to agree on a suitable pickup
                location and time.
              </p>
              <button
                className="button"
                onClick={() => setPanel("Send Message")}
              >
                <MessageCircle size={20} /> Send Message
              </button>
              <button
                className="button outline"
                onClick={() => {
                  setRecords((rs) =>
                    rs.map((r) =>
                      r.id === record.id ? { ...r, status: "Solved" } : r,
                    ),
                  );
                  setToast("ID marked as resolved.");
                  router.push("/reports");
                }}
              >
                Mark as Resolved
              </button>
            </section>
            <Notice>
              <strong>SAFETY FIRST</strong>
              <p>
                Arrange handover at an approved <b>University of Ghana</b>{" "}
                location or with campus security. Do not share unnecessary
                personal information.
              </p>
            </Notice>
            {footer}
          </>
        )}
        {page === "reports" && (
          <>
            <h1>Track Reports</h1>
            <p className="intro">
              Track your reported IDs and their current status.
            </p>
            <p className="filter-label">Filter by category</p>
            <div className="tabs">
              {["All", "Lost", "Found", "Solved"].map((f) => (
                <button
                  className={filter === f ? "active" : ""}
                  onClick={() => setFilter(f)}
                  key={f}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="eyebrow">
              YOUR REPORTS (
              {
                records.filter(
                  (r) => r.own && (filter === "All" || r.status === filter),
                ).length
              }
              )
            </p>
            {records
              .filter((r) => r.own && (filter === "All" || r.status === filter))
              .map((r) => (
                <section className="card report-card" key={r.id}>
                  <div className="report-type">
                    <span
                      className={r.status === "Solved" ? "green" : "blue-text"}
                    >
                      ●
                    </span>{" "}
                    {r.status.toUpperCase()} ID
                  </div>
                  <div className="person-row">
                    <IconBox icon={CreditCard} />
                    <div>
                      <h2>{r.index}</h2>
                      <p>{r.name}</p>
                    </div>
                  </div>
                  <span className="badge">
                    {r.status === "Solved" ? "Recovered" : "Awaiting Claim"}
                  </span>
                  <button
                    className="card-action plain"
                    onClick={() => openRecord(r)}
                  >
                    View details <ArrowRight size={18} />
                  </button>
                </section>
              ))}
            {!records.some(
              (r) => r.own && (filter === "All" || r.status === filter),
            ) && (
              <section className="empty">
                <FileText size={36} />
                <h2>
                  No {filter === "All" ? "" : filter.toLowerCase()} reports yet
                </h2>
                <p>IDs you report will appear here.</p>
                <Link href="/report" className="button outline">
                  Report Found ID
                </Link>
              </section>
            )}
            <Notice>
              <strong>PRIVACY ALERT</strong>
              <p>
                Your demo reports are stored only on this browser. No contact
                details are shared.
              </p>
            </Notice>
            {footer}
          </>
        )}
        {page === "notifications" && (
          <>
            <section className="card person-row">
              <IconBox icon={Bell} tone="solid" />
              <div>
                <h3>Stay updated</h3>
                <p>
                  {prefs.alerts
                    ? "Match alerts are enabled in this demo."
                    : "Match alerts are off. Change this in Settings."}
                </p>
              </div>
            </section>
            <p className="eyebrow">TODAY</p>
            {records
              .filter((r) => r.own)
              .slice(0, 5)
              .map((r) => (
                <button
                  className="card notification-card"
                  key={r.id}
                  onClick={() => openRecord(r)}
                >
                  <IconBox icon={CheckCircle2} tone="green" />
                  <div>
                    <h3>
                      {r.status === "Solved"
                        ? "ID recovered"
                        : "Report submitted"}
                    </h3>
                    <p>
                      Your report for {r.name}{" "}
                      {r.status === "Solved"
                        ? "has been resolved."
                        : "is awaiting a claim."}
                    </p>
                    <small>
                      <Clock size={14} />
                      {r.time}
                    </small>
                    <span className="text-link">
                      View Report <ArrowRight size={15} />
                    </span>
                  </div>
                </button>
              ))}
            {!records.some((r) => r.own) && (
              <div className="empty">
                <Bell size={38} />
                <h2>You’re all caught up</h2>
                <p>Updates to your reports will appear here.</p>
              </div>
            )}
            <Link href="/settings" className="center-link">
              Manage notification preferences
            </Link>
          </>
        )}
        {page === "profile" && (
          <>
            <section className="profile-card">
              <Avatar name={profile.name} large />
              <h1>{profile.name}</h1>
              <p>
                <GraduationCap size={18} /> University of Ghana
              </p>
              <small>
                INDEX NO. <b>••••{profile.index.slice(-4)}</b>
              </small>
            </section>
            <div className="profile-stats">
              <div>
                <IconBox icon={ShieldCheck} tone="blue" />
                <small>VERIFICATION</small>
                <strong>Demo Profile</strong>
              </div>
              <div>
                <IconBox icon={CreditCard} />
                <small>ACTIVE ID</small>
                <strong>Main ID</strong>
              </div>
            </div>
            <h2 className="management-heading">Settings &amp; Management</h2>
            <section className="settings-group">
              {[
                [FileText, "My Reports", "/reports"],
                [Bell, "Notifications", "/notifications"],
                [ShieldCheck, "Privacy & Security", "privacy"],
                [Info, "Help & Support", "help"],
                [Settings, "Settings", "/settings"],
              ].map(([I, label, url]) => {
                const Icon = I as LucideIcon;
                return (
                  <button
                    className="setting-row"
                    key={String(label)}
                    onClick={() =>
                      String(url).startsWith("/")
                        ? router.push(String(url))
                        : setPanel(String(label))
                    }
                  >
                    <IconBox icon={Icon} />
                    <strong>{String(label)}</strong>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
              <button className="setting-row danger" onClick={logout}>
                <IconBox icon={LogOut} />
                <strong>Sign Out</strong>
                <ChevronRight size={18} />
              </button>
            </section>
            {footer}
            <small className="version">FINDMYID · V1.0.0 · DEMO</small>
          </>
        )}
        {page === "settings" && (
          <>
            <p className="eyebrow">NOTIFICATIONS</p>
            <section className="settings-group">
              {settingRow(
                "Match Alerts",
                "Notify when a potential ID is found",
                Bell,
                "alerts",
              )}
              {settingRow(
                "Email Updates",
                "Enable email preference for a future backend",
                Mail,
                "email",
              )}
            </section>
            <p className="eyebrow">PRIVACY & SECURITY</p>
            <section className="settings-group">
              {settingRow(
                "Profile Visibility",
                "Manage local profile information",
                Eye,
              )}
              {settingRow(
                "Two-Factor Auth",
                "Account security information",
                ShieldCheck,
              )}
            </section>
            <p className="eyebrow">APP PREFERENCES</p>
            <section className="settings-group">
              {settingRow(
                "Dark Mode",
                "Easier on the eyes in low light",
                Moon,
                "dark",
              )}
              {settingRow("Language", "English (Primary)", GraduationCap)}
              {settingRow(
                "App Permissions",
                "Camera, storage, and location",
                Smartphone,
              )}
            </section>
            <p className="eyebrow">ABOUT</p>
            <section className="settings-group">
              {settingRow("Help Center", "FAQs and usage guides", Info)}
              {settingRow(
                "Feedback",
                "Report bugs or suggest features",
                MessageCircle,
              )}
              {settingRow(
                "Privacy Policy",
                "How this prototype handles your data",
                ShieldCheck,
              )}
            </section>
            <button className="setting-row logout-row danger" onClick={logout}>
              <IconBox icon={LogOut} />
              <span>
                <strong>Log Out</strong>
                <small>Sign out of your demo session</small>
              </span>
              <ChevronRight size={18} />
            </button>
            <div className="about">
              <strong>FINDMYID V1.0.0</strong>
              <p>
                Student ID Recovery Prototype for the
                <br />
                University of Ghana Community
              </p>
            </div>
            {footer}
          </>
        )}
      </main>
      {nav && (
        <nav className="bottom-nav" aria-label="Main navigation">
          {[
            [Home, "Home", "/home"],
            [FileText, "Report", "/report"],
            [Search, "Search", "/search"],
            [User, "Profile", "/profile"],
          ].map(([I, label, href]) => {
            const Icon = I as LucideIcon;
            const active =
              (label === "Home" && page === "home") ||
              (label === "Report" &&
                ["report", "review", "success", "reports"].includes(page)) ||
              (label === "Search" &&
                ["search", "details", "contact"].includes(page)) ||
              (label === "Profile" &&
                ["profile", "settings", "notifications"].includes(page));
            return (
              <Link
                key={String(label)}
                href={String(href)}
                className={active ? "active" : ""}
              >
                <Icon size={23} />
                <span>{String(label)}</span>
              </Link>
            );
          })}
        </nav>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
          <button
            className="plain"
            onClick={() => setToast("")}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {panel && (
        <div className="modal-backdrop" onClick={() => setPanel("")}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="plain close"
              onClick={() => setPanel("")}
              aria-label="Close"
            >
              <X />
            </button>
            <h2 id="panel-title">{panel}</h2>
            {panel === "Send Message" ? (
              <>
                <p className="intro">
                  Demo conversation with the finder. Messages stay on this
                  browser and are not delivered.
                </p>
                {sent ? (
                  <Notice kind="success">Message saved in this demo.</Notice>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      try {
                        localStorage.setItem(
                          "findmyid-message-" + record.id,
                          message,
                        );
                        setSent(true);
                      } catch {
                        setError("Unable to save your message.");
                      }
                    }}
                  >
                    <textarea
                      autoFocus
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi, can we meet at campus security to collect the ID?"
                      required
                    />
                    <button className="button">Save Demo Message</button>
                  </form>
                )}
              </>
            ) : panel === "Feedback" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setToast("Thank you. Your feedback was saved locally.");
                  const data = new FormData(e.currentTarget);
                  localStorage.setItem(
                    "findmyid-feedback",
                    String(data.get("feedback")),
                  );
                  setPanel("");
                }}
              >
                <p className="intro">Leave feedback about this prototype.</p>
                <textarea
                  name="feedback"
                  placeholder="Your feedback"
                  required
                />
                <button className="button">Save Feedback</button>
              </form>
            ) : (
              <>
                <p className="intro">
                  {panel === "Password recovery"
                    ? "Password recovery will be available when real authentication is connected. You can explore this prototype using a sample UG email and any password of at least eight characters."
                    : panel === "Help Center" || panel === "Help & Support"
                      ? "Search by a name or 8-digit index number. If you find an ID, upload a clear photo, add the location, and review your report. Arrange any real handover through campus security."
                      : panel === "Language"
                        ? "This prototype is currently available in English."
                        : panel === "App Permissions"
                          ? "The camera or gallery opens only when you choose a photo. Location is entered manually. Demo data is saved in your browser."
                          : panel === "Two-Factor Auth"
                            ? "This prototype has no authentication server. Two-factor authentication must be connected to an identity provider before production use."
                            : "This prototype stores profile details, reports, photos, and preferences in your browser. It does not verify identities or share messages. Use sample data. Real authentication, consent policies, and secure storage must be connected before using real student information."}
                </p>
                {panel === "Profile Visibility" && (
                  <button
                    className="button outline"
                    onClick={() => {
                      localStorage.removeItem("findmyid-profile");
                      setProfile(defaultProfile);
                      setPanel("");
                      setToast("Local profile reset.");
                    }}
                  >
                    Reset Local Profile
                  </button>
                )}
                <button className="button" onClick={() => setPanel("")}>
                  Got it
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="detail-row">
      <IconBox icon={Icon} />
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function EmptyReport() {
  return (
    <section className="empty">
      <FileText size={36} />
      <h2>No report to review</h2>
      <Link className="button" href="/report">
        Start a Report
      </Link>
    </section>
  );
}
