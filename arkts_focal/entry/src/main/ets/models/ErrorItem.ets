export class ErrorItem {
  id: string
  question: string
  wrong: string
  correct: string
  createdAt: string
  revealed: boolean
  cardified: boolean

  constructor(id: string, question: string, wrong: string = '', correct: string = '', createdAt: string = '') {
    this.id = id
    this.question = question
    this.wrong = wrong
    this.correct = correct
    this.createdAt = createdAt
    this.revealed = false
    this.cardified = false
  }
}
