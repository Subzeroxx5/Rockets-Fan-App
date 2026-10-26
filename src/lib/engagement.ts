export type FanStats = {
  points: number
  streak: number
  lastActiveDate: string | null
}

export const initialFanStats: FanStats = {
  points: 0,
  streak: 0,
  lastActiveDate: null,
}

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  isLive: boolean
}

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10)

const isConsecutiveDate = (previousDateKey: string, nextDateKey: string): boolean => {
  const previousDate = new Date(`${previousDateKey}T00:00:00.000Z`)
  const nextDate = new Date(`${nextDateKey}T00:00:00.000Z`)
  const msPerDay = 1000 * 60 * 60 * 24

  return (nextDate.getTime() - previousDate.getTime()) / msPerDay === 1
}

const nextStreak = (stats: FanStats, actionDateKey: string): number => {
  if (!stats.lastActiveDate) {
    return 1
  }

  if (stats.lastActiveDate === actionDateKey) {
    return stats.streak
  }

  return isConsecutiveDate(stats.lastActiveDate, actionDateKey) ? stats.streak + 1 : 1
}

export const applyCheckIn = (
  stats: FanStats,
  actionDate: Date,
): { stats: FanStats; awarded: boolean } => {
  const actionDateKey = toDateKey(actionDate)

  if (stats.lastActiveDate === actionDateKey) {
    return {
      stats,
      awarded: false,
    }
  }

  return {
    stats: {
      points: stats.points + 5,
      streak: nextStreak(stats, actionDateKey),
      lastActiveDate: actionDateKey,
    },
    awarded: true,
  }
}

export const applyQuizResult = (
  stats: FanStats,
  isCorrect: boolean,
  actionDate: Date,
): FanStats => {
  const actionDateKey = toDateKey(actionDate)

  return {
    points: stats.points + (isCorrect ? 10 : 2),
    streak: nextStreak(stats, actionDateKey),
    lastActiveDate: actionDateKey,
  }
}

export const getCountdown = (target: Date, now: Date): Countdown => {
  const remainingMs = target.getTime() - now.getTime()

  if (remainingMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLive: true,
    }
  }

  const totalSeconds = Math.floor(remainingMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    isLive: false,
  }
}
