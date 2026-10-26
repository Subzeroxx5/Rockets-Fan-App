import { describe, expect, it } from 'vitest'
import { applyCheckIn, applyQuizResult, getCountdown, initialFanStats } from './engagement'

describe('engagement logic', () => {
  it('awards check-in points only once per day', () => {
    const date = new Date('2026-10-26T12:00:00.000Z')
    const firstCheckIn = applyCheckIn(initialFanStats, date)
    const secondCheckIn = applyCheckIn(firstCheckIn.stats, date)

    expect(firstCheckIn.awarded).toBe(true)
    expect(firstCheckIn.stats.points).toBe(5)
    expect(secondCheckIn.awarded).toBe(false)
    expect(secondCheckIn.stats.points).toBe(5)
  })

  it('extends streak on consecutive-day activity', () => {
    const dayOne = new Date('2026-10-26T09:00:00.000Z')
    const dayTwo = new Date('2026-10-27T09:00:00.000Z')

    const first = applyCheckIn(initialFanStats, dayOne)
    const second = applyQuizResult(first.stats, true, dayTwo)

    expect(second.streak).toBe(2)
    expect(second.points).toBe(15)
  })

  it('returns live state once countdown target has passed', () => {
    const target = new Date('2026-11-05T01:00:00.000Z')
    const now = new Date('2026-11-05T01:00:01.000Z')

    expect(getCountdown(target, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLive: true,
    })
  })
})
