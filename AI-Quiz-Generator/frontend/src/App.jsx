import { useCallback, useEffect, useMemo, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const TOKEN_KEY = 'quiz_generator_token'
const USER_KEY = 'quiz_generator_user'

const readStored = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

const request = async (path, options = {}) => {
  const token = localStorage.getItem(TOKEN_KEY)
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Something went wrong')
  return body
}

const navigate = (path) => {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function Logo() {
  return <button className="brand" onClick={() => navigate('/')}><span className="brand-mark">✦</span> quizly</button>
}

function Header({ user, onSignOut }) {
  return (
    <header className="site-header">
      <Logo />
      <nav>
        {user ? (
          <>
            <button className="nav-link" onClick={() => navigate('/generate')}>Create quiz</button>
            <button className="nav-link" onClick={() => navigate('/attempts')}>My attempts</button>
            <span className="user-pill">{user.username}</span>
            <button className="button button-quiet" onClick={onSignOut}>Sign out</button>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => navigate('/signin')}>Sign in</button>
            <button className="button button-dark small" onClick={() => navigate('/signup')}>Get started</button>
          </>
        )}
      </nav>
    </header>
  )
}

function Shell({ children, user, onSignOut }) {
  return <><Header user={user} onSignOut={onSignOut} /><main>{children}</main><footer><span>quizly</span><span>Learn something new today.</span></footer></>
}

function Home({ user }) {
  return (
    <section className="home-page">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> Your curious side, powered up</p>
        <h1>Turn curiosity<br /><em>into mastery.</em></h1>
        <p className="hero-text">Create a focused quiz on anything you want to learn. Get smarter, one question at a time.</p>
        <div className="hero-actions">
          <button className="button button-dark" onClick={() => navigate(user ? '/generate' : '/signup')}>Start learning <span>↗</span></button>
          <span className="microcopy">Free to start · No credit card</span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="glow" />
        <img src={heroImg} alt="" />
        <div className="floating-card card-top"><span className="card-icon purple">✦</span><div><strong>AI generated</strong><small>Just for you</small></div></div>
        <div className="floating-card card-bottom"><span className="check">✓</span><div><strong>Keep growing</strong><small>Every day counts</small></div></div>
      </div>
      <div className="feature-strip">
        <div><b>01</b><span>Pick a topic</span><small>Anything you’re curious about</small></div>
        <div><b>02</b><span>Take the quiz</span><small>Thoughtful questions, no fluff</small></div>
        <div><b>03</b><span>See yourself grow</span><small>Track every attempt</small></div>
      </div>
    </section>
  )
}

function AuthPage({ mode, onAuth }) {
  const isSignup = mode === 'signup'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = isSignup ? form : { email: form.email, password: form.password }
      const result = await request(`/api/auth/${isSignup ? 'signup' : 'signin'}`, { method: 'POST', body: JSON.stringify(body) })
      onAuth(result)
      navigate('/generate')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-intro"><p className="eyebrow"><span className="eyebrow-dot" /> Welcome to quizly</p><h1>{isSignup ? 'Make learning<br /><em>your thing.</em>' : 'Good to see<br /><em>you again.</em>'}</h1><p>Small steps. Better questions.<br />A sharper you.</p></div>
      <form className="auth-card" onSubmit={submit}>
        <div><p className="eyebrow">Your account</p><h2>{isSignup ? 'Create your account' : 'Sign in to continue'}</h2><p className="muted">{isSignup ? 'Start your learning journey in under a minute.' : 'Your next great question is waiting.'}</p></div>
        {isSignup && <label>Username<input required minLength="2" maxLength="30" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="alex" /></label>}
        <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
        {error && <p className="error">{error}</p>}
        <button className="button button-dark full" disabled={loading}>{loading ? 'Please wait…' : isSignup ? 'Create account ↗' : 'Sign in ↗'}</button>
        <p className="form-switch">{isSignup ? 'Already have an account?' : 'New to quizly?'} <button type="button" onClick={() => navigate(isSignup ? '/signin' : '/signup')}>{isSignup ? 'Sign in' : 'Create one'}</button></p>
      </form>
    </section>
  )
}

function GenerateQuiz({ onQuiz }) {
  const [topic, setTopic] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const suggestions = ['The science of sleep', 'Modern architecture', 'JavaScript basics', 'Ancient Egypt']

  const submit = async (event) => {
    event.preventDefault()
    if (!topic.trim()) return
    setError('')
    setLoading(true)
    try {
      const quiz = await request('/api/quizzes/generate', { method: 'POST', body: JSON.stringify({ topic: topic.trim() }) })
      onQuiz(quiz)
      navigate('/quiz')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return <section className="generator-page"><div className="generator-heading"><p className="eyebrow"><span className="eyebrow-dot" /> The blank canvas</p><h1>What do you want<br /><em>to know?</em></h1><p className="hero-text">Give us a topic and we’ll turn it into a quick, thoughtful quiz.</p></div><form className="topic-form" onSubmit={submit}><div className="input-wrap"><span>⌕</span><input autoFocus value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Try “The psychology of habits”" maxLength="200" /><button className="button button-dark" disabled={loading}>{loading ? 'Creating…' : 'Create quiz ↗'}</button></div><div className="suggestions"><span>Try one of these</span>{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => setTopic(suggestion)}>{suggestion}</button>)}</div>{error && <p className="error">{error}</p>}</form></section>
}

function QuizPage({ quiz, onSubmitted }) {
  const [answers, setAnswers] = useState(() => Array(quiz.questions.length).fill(''))
  const [seconds, setSeconds] = useState(600)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const submit = useCallback(async () => {
    if (submitting || submitted) return
    setSubmitting(true)
    const finalScore = quiz.questions.reduce((total, question, index) => total + (answers[index] === question.correctOption ? 1 : 0), 0)
    try {
      await request('/api/quizzes/attempts', { method: 'POST', body: JSON.stringify({ topic: quiz.topic, questions: quiz.questions, answers, score: finalScore }) })
      setScore(finalScore)
      setSubmitted(true)
      onSubmitted()
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }, [answers, onSubmitted, quiz, submitted, submitting])

  useEffect(() => {
    if (seconds <= 0) {
      const timeout = window.setTimeout(submit, 0)
      return () => window.clearTimeout(timeout)
    }
    const timer = setInterval(() => setSeconds((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [seconds, submit])

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  if (submitted) return <section className="result-page"><div className="result-orb">✦</div><p className="eyebrow">Quiz complete</p><h1>You scored <em>{score}/{quiz.questions.length}</em></h1><p className="hero-text">Nice work. Every attempt is another step forward.</p><div className="result-actions"><button className="button button-dark" onClick={() => navigate('/generate')}>Try another topic ↗</button><button className="button button-light" onClick={() => navigate('/attempts')}>View attempts</button></div></section>

  return <section className="quiz-page"><div className="quiz-top"><div><p className="eyebrow"><span className="eyebrow-dot" /> Your quiz</p><h1>{quiz.topic}</h1></div><div className={`timer ${seconds < 60 ? 'urgent' : ''}`}><span>◷</span>{formattedTime}<small>remaining</small></div></div><div className="progress"><span style={{ width: `${(answers.filter(Boolean).length / quiz.questions.length) * 100}%` }} /></div><div className="question-list">{quiz.questions.map((question, index) => <article className="question-card" key={`${question.question}-${index}`}><div className="question-number">0{index + 1}</div><div className="question-body"><p>{question.question}</p><div className="options">{['option1', 'option2', 'option3', 'option4'].map((option) => <label className={answers[index] === option ? 'selected' : ''} key={option}><input type="radio" name={`question-${index}`} checked={answers[index] === option} onChange={() => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? option : answer))} /><span>{question[option]}</span><b>{String.fromCharCode(65 + Number(option.slice(-1)) - 1)}</b></label>)}</div></div></article>)}</div>{error && <p className="error">{error}</p>}<div className="quiz-submit"><span>{answers.filter(Boolean).length} of {quiz.questions.length} answered</span><button className="button button-dark" onClick={submit} disabled={submitting}>{submitting ? 'Saving…' : 'Submit quiz ↗'}</button></div></section>
}

function Attempts() {
  const [attempts, setAttempts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { request('/api/quizzes/attempts').then(setAttempts).catch((err) => setError(err.message)) }, [])
  return <section className="attempts-page"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Your progress</p><h1>Past <em>attempts.</em></h1></div><button className="button button-dark" onClick={() => navigate('/generate')}>New quiz ↗</button></div>{error && <p className="error">{error}</p>}{attempts.length === 0 && !error ? <div className="empty-state"><div>✦</div><h2>No attempts yet</h2><p>Your first quiz is just a question away.</p><button className="button button-light" onClick={() => navigate('/generate')}>Create your first quiz</button></div> : <div className="attempt-grid">{attempts.map((attempt) => <article className="attempt-card" key={attempt._id}><div className="attempt-icon">✦</div><div><h3>{attempt.topic}</h3><p>{new Date(attempt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {attempt.questions.length} questions</p></div><strong>{attempt.score}<small> / {attempt.questions.length}</small></strong></article>)}</div>}</section>
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [user, setUser] = useState(() => readStored(USER_KEY))
  const [quiz, setQuiz] = useState(null)
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop) }, [])

  const onAuth = (result) => { localStorage.setItem(TOKEN_KEY, result.token); localStorage.setItem(USER_KEY, JSON.stringify(result.user)); setUser(result.user) }
  const signOut = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null); navigate('/') }
  const protectedPage = ['/generate', '/quiz', '/attempts'].includes(path)
  const page = useMemo(() => {
    if (protectedPage && !user) return <AuthPage mode="signin" onAuth={onAuth} />
    if (path === '/signup') return <AuthPage mode="signup" onAuth={onAuth} />
    if (path === '/signin') return <AuthPage mode="signin" onAuth={onAuth} />
    if (path === '/generate') return <GenerateQuiz onQuiz={setQuiz} />
    if (path === '/quiz' && quiz) return <QuizPage quiz={quiz} onSubmitted={() => {}} />
    if (path === '/quiz') return <GenerateQuiz onQuiz={setQuiz} />
    if (path === '/attempts') return <Attempts />
    return <Home user={user} />
  }, [path, protectedPage, user, quiz])

  return <Shell user={user} onSignOut={signOut}>{page}</Shell>
}

export default App
