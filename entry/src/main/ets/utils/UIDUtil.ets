export class UIDUtil {
  static uid(): string {
    return Math.random().toString(36).slice(2, 10)
  }

  static taskId(): string {
    return 'T-' + Math.random().toString(36).slice(2, 6).toUpperCase()
  }

  static noteId(): string {
    return 'note_' + Date.now()
  }

  static cardId(): string {
    return 'fc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
  }

  static errorId(counter: number): string {
    return 'E-' + (counter < 10 ? '000' : counter < 100 ? '00' : counter < 1000 ? '0' : '') + counter
  }

  static sessionId(): string {
    return 'ai_' + UIDUtil.uid()
  }

  static subjectId(): string {
    return 'fcl_' + Date.now()
  }
}
