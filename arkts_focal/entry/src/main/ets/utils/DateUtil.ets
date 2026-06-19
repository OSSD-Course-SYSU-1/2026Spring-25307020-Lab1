export class DateUtil {
  static today(): string {
    return new Date().toISOString().slice(0, 10)
  }

  static daysUntil(dateStr: string | null | undefined): number | null {
    if (!dateStr) return null
    const target = new Date(dateStr + 'T00:00:00')
    const now = new Date(DateUtil.today() + 'T00:00:00')
    return Math.ceil((target.getTime() - now.getTime()) / 86400000)
  }

  static fmtDate(dateStr: string | null): string {
    if (!dateStr) return '—'
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  static tomorrow(): string {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  }

  static calcStreak(stats: Record<string, number>): number {
    let streak = 0
    const d = new Date()
    while (true) {
      const k = d.toISOString().slice(0, 10)
      if (!stats[k]) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }

  static weekDays(): string[] {
    const days: string[] = []
    let i = 6
    while (i >= 0) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().slice(0, 10))
      i--
    }
    return days
  }

  static isOverdue(due: string | null): boolean {
    if (!due) return false
    return due < DateUtil.today()
  }
}
