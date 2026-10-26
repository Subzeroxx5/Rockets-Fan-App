import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  applyCheckIn,
  applyQuizResult,
  getCountdown,
  initialFanStats,
} from './lib/engagement'

const nextGameTipoff = new Date('2026-11-05T01:00:00.000Z')

const quizQuestion = {
  prompt: 'Which Rockets legend is known as The Dream?',
  choices: ['Tracy McGrady', 'Yao Ming', 'Hakeem Olajuwon', 'James Harden'],
  answer: 'Hakeem Olajuwon',
}

const spotlightPlayers = [
  {
    name: 'Jalen Green',
    vibe: '⚡ Fast-break highlights',
  },
  {
    name: 'Alperen Şengün',
    vibe: '🎯 Creative passing wizard',
  },
  {
    name: 'Amen Thompson',
    vibe: '🚀 Future star energy',
  },
]

function App() {
  const [now, setNow] = useState(() => new Date())
  const [fanStats, setFanStats] = useState(initialFanStats)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [quizFeedback, setQuizFeedback] = useState('')
  const [checkInMessage, setCheckInMessage] = useState('Tap daily to build your streak!')

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const countdown = useMemo(() => getCountdown(nextGameTipoff, now), [now])

  const handleCheckIn = () => {
    const result = applyCheckIn(fanStats, new Date())
    setFanStats(result.stats)
    setCheckInMessage(
      result.awarded
        ? 'Nice! +5 points earned for today.'
        : 'You already checked in today. Come back tomorrow for more points!',
    )
  }

  const handleQuizSubmit = () => {
    if (!selectedAnswer) {
      setQuizFeedback('Pick an answer before submitting!')
      return
    }

    const isCorrect = selectedAnswer === quizQuestion.answer
    setFanStats((currentStats) => applyQuizResult(currentStats, isCorrect, new Date()))
    setQuizFeedback(
      isCorrect
        ? 'Correct! You unlocked 10 fan points. 🔥'
        : `Not this time. Correct answer: ${quizQuestion.answer}. +2 points for trying!`,
    )
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Houston Rockets Fan Zone</p>
        <h1>Game Day Starts Here</h1>
        <p>
          A quick daily hub for younger fans to play, learn, and level up their fan score.
        </p>
      </header>

      <section className="stats" aria-label="fan stats">
        <article>
          <h2>Fan Score</h2>
          <p className="metric">{fanStats.points}</p>
        </article>
        <article>
          <h2>Current Streak</h2>
          <p className="metric">{fanStats.streak} day(s)</p>
        </article>
      </section>

      <section className="card" aria-live="polite">
        <h2>Next Tipoff Countdown</h2>
        {countdown.isLive ? (
          <p className="metric">LIVE NOW 🏀</p>
        ) : (
          <p className="countdown">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
          </p>
        )}
      </section>

      <section className="card">
        <h2>Daily Check-In</h2>
        <p>{checkInMessage}</p>
        <button type="button" onClick={handleCheckIn}>
          Check in (+5)
        </button>
      </section>

      <section className="card">
        <h2>Rocket Quiz</h2>
        <p>{quizQuestion.prompt}</p>
        <fieldset>
          <legend className="visually-hidden">Rocket quiz answers</legend>
          {quizQuestion.choices.map((choice) => (
            <label key={choice}>
              <input
                type="radio"
                name="rocket-quiz"
                value={choice}
                checked={selectedAnswer === choice}
                onChange={(event) => setSelectedAnswer(event.target.value)}
              />
              {choice}
            </label>
          ))}
        </fieldset>
        <button type="button" onClick={handleQuizSubmit}>
          Submit quiz answer
        </button>
        {quizFeedback && <p>{quizFeedback}</p>}
      </section>

      <section className="card">
        <h2>Player Spotlight</h2>
        <ul>
          {spotlightPlayers.map((player) => (
            <li key={player.name}>
              <strong>{player.name}</strong>
              <span>{player.vibe}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
