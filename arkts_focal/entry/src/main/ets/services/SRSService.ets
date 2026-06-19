import { FlashCard } from '../models/FlashCard'
import { DateUtil } from '../utils/DateUtil'

export class SRSService {
  // SM-2 Algorithm
  static sm2Update(card: FlashCard, quality: number): FlashCard {
    let interval = card.interval || 1
    let repetitions = card.repetitions || 0
    let easeFactor = card.easeFactor || 2.5

    if (quality < 2) {
      repetitions = 0
      interval = 1
    } else {
      if (repetitions === 0) interval = 1
      else if (repetitions === 1) interval = 6
      else interval = Math.ceil(interval * easeFactor)
      repetitions++
      easeFactor = Math.max(1.3, easeFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
    }

    const due = new Date()
    due.setDate(due.getDate() + interval)

    const result = new FlashCard(card.id, card.front, card.back, card.created)
    result.interval = interval
    result.repetitions = repetitions
    result.easeFactor = easeFactor
    result.dueDate = due.toISOString().slice(0, 10)
    result.lastReviewed = DateUtil.today()
    return result
  }

  static isDue(card: FlashCard): boolean {
    if (!card.dueDate) return true
    return card.dueDate <= DateUtil.today()
  }

  static dueCount(cards: FlashCard[]): number {
    return cards.filter(c => SRSService.isDue(c)).length
  }

  static forecast(cards: FlashCard[], days: number = 7): number[] {
    const result: number[] = []
    let d = 0
    while (d < days) {
      const dt = new Date()
      dt.setDate(dt.getDate() + d)
      const ds = dt.toISOString().split('T')[0]
      result.push(cards.filter(c => c.dueDate === ds).length)
      d++
    }
    return result
  }
}
