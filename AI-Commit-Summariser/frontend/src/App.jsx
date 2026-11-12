import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  History,
  LoaderCircle,
  LogOut,
  Moon,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const AuthContext = createContext(null)

function normalizeGithubUrl(value) {
  const trimmed = value.trim()
  return trimmed && !/^https?:\/\//i.test(trimmed) ? `https://${trimmed}` : trimmed
}

function GithubMark({ size = 20, className = '' }) {
  return <svg aria-hidden="true" className={className} fill="currentColor" height={size} viewBox="0 0 24 24" width={size}><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.28c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" /></svg>
}

async function request(path, options = {}) {
  const { headers, ...requestOptions } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.msg || 'Something went wrong')
  return data
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('commit-session')) || null
    } catch {
      return null
    }
  })

  const value = useMemo(
    () => ({
      session,
      signIn: (data) => {
        localStorage.setItem('commit-session', JSON.stringify(data))
        setSession(data)
      },
      signOut: () => {
        localStorage.removeItem('commit-session')
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  return useContext(AuthContext)
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      className="icon-button"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
      onClick={() => setDark((value) => !value)}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-950 dark:text-white">
      <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
        <GithubMark size={21} />
      </span>
      <span className="text-[15px]">commit<span className="text-violet-600">lens</span></span>
    </Link>
  )
}

function Navbar() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          <Link className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`} to="/">Home</Link>
          {session && <Link className={`nav-link ${location.pathname === '/generate' ? 'nav-link-active' : ''}`} to="/generate">Generate</Link>}
          {session && <Link className={`nav-link ${location.pathname === '/history' ? 'nav-link-active' : ''}`} to="/history">History</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <>
              <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:flex">
                <UserRound size={15} /> {session.user?.username}
              </span>
              <button className="button-secondary hidden sm:flex" onClick={() => { signOut(); navigate('/') }}>
                <LogOut size={15} /> Sign out
              </button>
            </>
          ) : (
            <Link className="button-primary" to="/signin">Get started <ArrowRight size={16} /></Link>
          )}
        </div>
      </div>
    </header>
  )
}

function PageShell({ children, className = '' }) {
  return <main className={`mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-5 py-12 lg:px-8 ${className}`}>{children}</main>
}

function Home() {
  const { session } = useAuth()
  return (
    <PageShell className="relative overflow-hidden">
      <div className="hero-glow" />
      <section className="relative grid items-center gap-14 pb-20 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:pt-20">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> AI-powered commit intelligence</div>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.06] tracking-[-.045em] text-slate-950 dark:text-white sm:text-6xl lg:text-[70px]">
            Read the story behind every <span className="gradient-text">commit.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Turn a GitHub repository into a clear, human-friendly timeline. Commitlens uses AI to make code history easy to understand.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className="button-primary px-5 py-3.5" to={session ? '/generate' : '/signup'}>Summarise a repository <ArrowRight size={17} /></Link>
            <a className="button-secondary px-5 py-3.5" href="#how-it-works">How it works <BookOpen size={16} /></a>
          </div>
          <div className="mt-9 flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Private by default</span>
            <span className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Built for developers</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-violet-500/10 blur-3xl" />
          <div className="relative rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-violet-950/10 dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold"><GithubMark size={18} /> ZayeemMohd / small-test</div>
                <span className="status-pill">Analysed</span>
              </div>
              {['Initialize pdfviewer in frontend.js', 'Add authentication module', 'Enhance comments in auth file'].map((commit, index) => (
                <div key={commit} className="commit-preview">
                  <div className="commit-dot">{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{commit}</p>
                    <p className="mt-1 truncate font-mono text-xs text-slate-500">{index === 0 ? 'Added a PDF viewer initialization [frontend.js]' : index === 1 ? 'Added basic authentication logic [authentication]' : 'Clarified authentication methods and usage'}</p>
                  </div>
                  <span className="hidden text-xs text-slate-400 sm:block">{index + 1}d ago</span>
                </div>
              ))}
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-xs text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"><Sparkles size={14} /> AI summaries are ready to explore</div>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="border-t border-slate-200 py-20 dark:border-slate-800">
        <div className="mb-10 max-w-xl"><p className="eyebrow">Simple by design</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">From repository to clarity in seconds.</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          {[['01', 'Paste a repository', 'Drop in any public GitHub repository URL and let us handle the rest.'], ['02', 'Let AI do the reading', 'We inspect the commit history and translate each change into a useful summary.'], ['03', 'Understand the journey', 'Browse a clean, visual timeline of decisions, changes, and progress.']].map(([number, title, copy]) => (
            <div className="feature-card" key={number}><span className="text-sm font-bold text-violet-600">{number}</span><h3 className="mt-7 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3><p className="mt-2 leading-7 text-slate-500 dark:text-slate-400">{copy}</p></div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

function AuthPage({ mode }) {
  const isSignUp = mode === 'signup'
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/generate" replace />
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await request(`/api/auth/${isSignUp ? 'signup' : 'signin'}`, { method: 'POST', body: JSON.stringify(form) })
      signIn(data)
      navigate('/generate')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell className="grid place-items-center">
      <div className="w-full max-w-[440px]">
        <div className="mb-8 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950"><GithubMark size={26} /></div><h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{isSignUp ? 'Create your account' : 'Welcome back'}</h1><p className="mt-2 text-slate-500 dark:text-slate-400">{isSignUp ? 'Start making sense of your code history.' : 'Continue exploring your commit history.'}</p></div>
        <form className="panel p-7" onSubmit={submit}>
          {isSignUp && <Field label="Username" icon={<UserRound size={16} />} value={form.username} onChange={(value) => setForm({ ...form, username: value })} placeholder="your-username" />}
          <Field label="Email address" type="email" icon={<span className="text-sm">@</span>} value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" />
          <Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder={isSignUp ? 'At least 6 characters' : 'Your password'} />
          {error && <div className="error-box"><X size={16} /> {error}</div>}
          <button className="button-primary mt-2 w-full justify-center py-3.5" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={17} /> : null}{loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}</button>
          <p className="mt-5 text-center text-sm text-slate-500">{isSignUp ? 'Already have an account?' : 'New to commitlens?'} <Link className="font-semibold text-violet-600 hover:text-violet-500" to={isSignUp ? '/signin' : '/signup'}>{isSignUp ? 'Sign in' : 'Create one'}</Link></p>
        </form>
      </div>
    </PageShell>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', icon }) {
  return <label className="mb-4 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}<span className="relative mt-2 block"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span><input className="input pl-10" type={type} required value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></span></label>
}

function ProtectedRoute({ children }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/signin" replace />
}

function SummaryCard({ commit }) {
  const points = (commit.summary || '').split('\n').map((line) => line.replace(/^[*_-\s]+/, '').trim()).filter(Boolean)
  return (
    <article className="summary-card">
      <div className="flex items-start gap-4">
        <div className="commit-avatar">{commit.commitAuthorImg ? <img src={commit.commitAuthorImg} alt="" /> : <GithubMark size={17} />}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500"><span><strong className="text-slate-700 dark:text-slate-300">{commit.commitAuthorName || 'GitHub contributor'}</strong> committed</span><span>{commit.commitDate ? new Date(commit.commitDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</span></div>
          <h3 className="mt-2 text-base font-semibold leading-6 text-slate-900 dark:text-white">{commit.commitMessage || 'Untitled commit'}</h3>
          <ul className="mt-3 space-y-2">{points.length ? points.map((point, index) => <li className="summary-point" key={`${point}-${index}`}><span>✦</span>{point}</li>) : <li className="summary-point"><span>✦</span>No summary details available.</li>}</ul>
          {commit.commitHash && <a className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-violet-600" href={`https://github.com/commit/${commit.commitHash}`} target="_blank" rel="noreferrer">{commit.commitHash.slice(0, 7)} <ArrowRight size={11} /></a>}
        </div>
      </div>
    </article>
  )
}

function LoadingCards() {
  return <div className="space-y-4">{[1, 2, 3].map((item) => <div className="summary-card animate-pulse" key={item}><div className="flex gap-4"><div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800" /><div className="flex-1 space-y-3"><div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" /><div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" /></div></div></div>)}</div>
}

function Generate() {
  const [githubURL, setGithubURL] = useState('')
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { session } = useAuth()

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await request('/api/summaries/generate', { method: 'POST', headers: { Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ githubURL: normalizeGithubUrl(githubURL) }) })
      setSummary(data.finalSummaryArray || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return <PageShell>
    <div className="mx-auto max-w-3xl">
      <div className="mb-9"><div className="eyebrow"><Sparkles size={14} /> Commit intelligence</div><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">What changed?</h1><p className="mt-3 max-w-xl text-lg leading-8 text-slate-500 dark:text-slate-400">Paste a public GitHub repository and get an AI-powered explanation of its commit history.</p></div>
      <form className="generator-form" onSubmit={submit}><div className="flex flex-1 items-center gap-3"><GithubMark className="shrink-0 text-slate-400" size={20} /><input className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" required value={githubURL} onChange={(event) => setGithubURL(event.target.value)} placeholder="https://github.com/owner/repository" /><button className="button-primary shrink-0" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={16} /> : <Send size={16} />}{loading ? 'Reading...' : 'Generate'}</button></div></form>
      {error && <div className="error-box mt-4"><X size={16} /> {error}</div>}
      <div className="mt-12">{loading ? <><div className="section-label"><LoaderCircle className="animate-spin" size={15} /> Reading commit history...</div><LoadingCards /></> : summary.length ? <><div className="section-label"><Check size={15} className="text-emerald-500" /> {summary.length} commits summarised</div><div className="space-y-4">{summary.map((commit) => <SummaryCard commit={commit} key={commit.commitHash} />)}</div></> : <div className="empty-state"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/40"><Search size={21} /></div><p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Your summaries will appear here</p><p className="mt-1 text-sm text-slate-500">Enter a repository URL above to get started.</p></div>}</div>
    </div>
  </PageShell>
}

function HistoryPage() {
  const { session } = useAuth()
  const [history, setHistory] = useState([])
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    request('/api/summaries/history', { headers: { Authorization: `Bearer ${session.token}` } }).then((data) => {
      setHistory(data.history || [])
      if (data.history?.length) setOpen(data.history[0]._id)
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [session.token])

  return <PageShell><div className="mx-auto max-w-4xl"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow"><History size={14} /> Your archive</div><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Summary history</h1><p className="mt-3 text-slate-500 dark:text-slate-400">Every repository you have explored, in one place.</p></div><Link className="button-secondary" to="/generate"><Plus size={16} /> New summary</Link></div>{error && <div className="error-box mb-4"><X size={16} /> {error}</div>}{loading ? <LoadingCards /> : history.length ? <div className="space-y-3">{history.map((entry) => <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" key={entry._id}><button className="flex w-full items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60" onClick={() => setOpen(open === entry._id ? null : entry._id)}><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><GithubMark size={20} /></div><div className="min-w-0 flex-1"><p className="truncate font-mono text-sm font-medium text-slate-800 dark:text-slate-200">{entry.githubURL}</p><p className="mt-1 text-xs text-slate-500">{entry.finalSummaryArray?.length || 0} commits · {new Date(entry.createdAt).toLocaleDateString()}</p></div><ChevronDown className={`shrink-0 text-slate-400 transition-transform ${open === entry._id ? 'rotate-180' : ''}`} size={19} /></button>{open === entry._id && <div className="border-t border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50 sm:p-5"><div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /> Commit summaries <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /></div><div className="space-y-4">{(entry.finalSummaryArray || []).map((commit) => <SummaryCard commit={commit} key={commit.commitHash} />)}</div></div>}</div>)}</div> : <div className="empty-state"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800"><History size={21} /></div><p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">No summaries yet</p><p className="mt-1 text-sm text-slate-500">Generate your first repository summary to see it here.</p><Link className="button-primary mt-5" to="/generate">Generate summary <ArrowRight size={16} /></Link></div>}</div></PageShell>
}

function App() {
  return <BrowserRouter><AuthProvider><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/signin" element={<AuthPage mode="signin" />} /><Route path="/signup" element={<AuthPage mode="signup" />} /><Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} /><Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider></BrowserRouter>
}

export default App
