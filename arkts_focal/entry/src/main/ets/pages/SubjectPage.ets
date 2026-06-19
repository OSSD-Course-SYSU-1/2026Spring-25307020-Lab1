import { router } from '@kit.ArkUI'
import { Subject } from '../models/Subject'
import { StorageService } from '../services/StorageService'
import { DateUtil } from '../utils/DateUtil'
import { Task } from '../models/Task'
import { Note } from '../models/Note'
import { FlashCard } from '../models/FlashCard'
import { ErrorItem } from '../models/ErrorItem'
import { Resource } from '../models/Resource'
import { Constants } from '../utils/Constants'
import { UIDUtil } from '../utils/UIDUtil'
import { SRSService } from '../services/SRSService'
import { MarkdownService } from '../services/MarkdownService'
import { Attachment } from '../models/Note'
import { AISession, AIMessage } from '../models/AISession'
import { AIConfig } from '../models/AIConfig'

interface PomoDurations {
  focus: number
  short: number
  long: number
}

interface TaskGroups {
  today: Task[]
  tomorrow: Task[]
  later: Task[]
  done: Task[]
}

@Entry
@Component
struct SubjectPage {
  @State subjectId: string = ''
  @State subject: Subject | null = null
  @State isDarkMode: boolean = false
  @State currentTabIndex: number = 0
  @State showEditDialog: boolean = false

  // Tasks state
  @State tasks: Task[] = []
  @State newTaskText: string = ''
  @State newTaskDate: string = ''
  @State newTaskPriority: string = 'normal'

  // Notes state
  @State notes: Note[] = []
  @State currentNoteId: string = ''
  @State noteMode: string = 'rich'
  @State noteContent: string = ''
  @State mdInput: string = ''
  @State plainInput: string = ''

  // Flashcards state
  @State cards: FlashCard[] = []
  @State fcIndex: number = 0
  @State fcFlipped: boolean = false
  @State srsMode: string = 'all'
  @State srsDeck: FlashCard[] = []
  @State newCardFront: string = ''
  @State newCardBack: string = ''

  // Error log state
  @State errors: ErrorItem[] = []
  @State errQuestion: string = ''
  @State errWrong: string = ''
  @State errCorrect: string = ''
  @State errorCounter: number = 0

  // Resources state
  @State resources: Resource[] = []
  @State resFilter: string = 'all'
  @State customResources: Resource[] = []

  // AI state
  @State aiSessions: AISession[] = []
  @State currentAISessionId: string = ''
  @State aiInput: string = ''
  @State aiMessages: AIMessage[] = []
  @State aiCtx: string = 'general'
  @State aiIsTyping: boolean = false
  @State aiSubTab: string = 'chat'

  // Pomodoro state
  @State pomoRunning: boolean = false
  @State pomoMode: string = 'focus'
  @State pomoRemaining: number = 25 * 60
  @State pomoTotal: number = 25 * 60
  @State pomoSessions: number = 0
  @State pomoDurations: PomoDurations = { focus: 25, short: 5, long: 15 }
  @State pomoStats: Record<string, number> = {}
  @State pomoTimerId: number = -1
  @State showPomoSettings: boolean = false
  @State tempFocusDuration: number = 25
  @State tempShortDuration: number = 5
  @State tempLongDuration: number = 15

  aboutToAppear() {
    try {
      const params = router.getParams() as Record<string, string>
      if (params && params['subjectId']) {
        this.subjectId = params['subjectId']
        this.loadData()
        // 保存接续状态
        AppStorage.setOrCreate('continueSubjectId', this.subjectId)
      }
    } catch (e) {
      console.error('Router params error:', e)
    }
    this.isDarkMode = StorageService.loadString('theme', 'light') === 'dark'
  }

  loadData() {
    const subjects: Subject[] = StorageService.load('subjects', []) as Subject[]
    this.subject = subjects.find(s => s.id === this.subjectId) || null
    this.loadTasks()
    this.loadNotes()
    this.loadCards()
    this.loadErrors()
    this.loadResources()
    this.loadAISessions()
    this.loadPomoStats()
    const defaultDurations: PomoDurations = { focus: 25, short: 5, long: 15 }
    const savedDurations = StorageService.load('pomo_durations', defaultDurations) as PomoDurations
    if (savedDurations && savedDurations.focus !== undefined) {
      this.pomoDurations = savedDurations
      this.pomoRemaining = this.getPomoDuration(this.pomoMode) * 60
      this.pomoTotal = this.pomoRemaining
    }
  }

  loadTasks() { this.tasks = StorageService.load(`tasks_${this.subjectId}`, []) as Task[] }
  saveTasks() { StorageService.save(`tasks_${this.subjectId}`, this.tasks) }

  loadNotes() { this.notes = StorageService.load(`notes_${this.subjectId}`, []) as Note[] }
  saveNotes() { StorageService.save(`notes_${this.subjectId}`, this.notes) }

  loadCards() {
    this.cards = StorageService.load(`cards_${this.subjectId}`, []) as FlashCard[]
    this.updateSRDeck()
  }
  saveCards() { StorageService.save(`cards_${this.subjectId}`, this.cards) }

  updateSRDeck() {
    if (this.srsMode === 'due') this.srsDeck = this.cards.filter(c => SRSService.isDue(c))
    else if (this.srsMode === 'new') this.srsDeck = this.cards.filter(c => !c.dueDate)
    else this.srsDeck = [...this.cards]
    if (this.fcIndex >= this.srsDeck.length) this.fcIndex = 0
  }

  loadErrors() { this.errors = StorageService.load(`errors_${this.subjectId}`, []) as ErrorItem[] }
  saveErrors() { StorageService.save(`errors_${this.subjectId}`, this.errors) }

  loadResources() {
    this.customResources = StorageService.load(`custom_resources_${this.subjectId}`, []) as Resource[]
    this.filterResources()
  }

  filterResources() {
    const custom = this.customResources
    let items: Resource[] = []
    if (this.resFilter === 'custom') items = custom
    else if (this.resFilter === 'all') {
      items = [...Constants.BUILTIN_RESOURCES.map(r => new Resource(r.name, r.name, r.school, r.url, r.desc, r.cat, r.lang)), ...custom]
    } else {
      items = Constants.BUILTIN_RESOURCES.filter(r => r.cat === this.resFilter).map(r => new Resource(r.name, r.name, r.school, r.url, r.desc, r.cat, r.lang))
    }
    this.resources = items
  }

  loadAISessions() { this.aiSessions = StorageService.load('ai_sessions', []) as AISession[] }
  saveAISessions() { StorageService.save('ai_sessions', this.aiSessions) }

  loadPomoStats() {
    const emptyStats: Record<string, number> = {}
    this.pomoStats = StorageService.load(`pomo_stats_${this.subjectId}`, emptyStats) as Record<string, number>
  }
  savePomoStats() { StorageService.save(`pomo_stats_${this.subjectId}`, this.pomoStats) }

  getBgColor(): ResourceColor { return this.isDarkMode ? '#0a0a0a' : '#F8FAFC' }
  getInkColor(): ResourceColor { return this.isDarkMode ? '#f0f0ee' : '#0e0e0e' }
  getInkMidColor(): ResourceColor { return this.isDarkMode ? '#9a9a96' : '#3a3a3a' }
  getInkDimColor(): ResourceColor { return this.isDarkMode ? '#505050' : '#888' }
  getBorderColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(20,20,20,0.08)' }
  getBorderHiColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.17)' : 'rgba(20,20,20,0.18)' }
  getKleinColor(): ResourceColor { return this.isDarkMode ? '#1055cc' : '#0047ab' }
  getBg2Color(): ResourceColor { return this.isDarkMode ? '#111' : '#EEF2F7' }
  getRedColor(): ResourceColor { return '#b03030' }
  getGreenColor(): ResourceColor { return '#3a7a3a' }
  getAmberColor(): ResourceColor { return '#8a6a00' }

  // Check if color is light (for contrast text)
  isColorLight(color: string): boolean {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
  }

  // Get contrast text color for pomo background
  getPomoTextColor(): string {
    const bgColor = this.subject?.color || '#0047ab'
    return this.isColorLight(bgColor) ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'
  }

  getPomoTextColorStrong(): string {
    const bgColor = this.subject?.color || '#0047ab'
    return this.isColorLight(bgColor) ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)'
  }

  getDaysUntil(): number | null {
    if (!this.subject) return null
    return DateUtil.daysUntil(this.subject.examDate)
  }

  getDaysUntilStr(): string {
    const d = this.getDaysUntil()
    if (d === null) return '—'
    if (d < 0) return 'Past'
    if (d === 0) return 'Today!'
    return `${d} days`
  }

  // ── TASKS ──
  addTask() {
    if (!this.newTaskText.trim()) return
    const task = new Task(UIDUtil.uid(), this.newTaskText.trim(), this.newTaskPriority, this.newTaskDate || null, 'later', DateUtil.today())
    this.tasks.push(task)
    this.saveTasks()
    this.newTaskText = ''
    this.newTaskDate = ''
  }

  toggleTask(id: string) {
    const t = this.tasks.find(x => x.id === id)
    if (t) { t.done = !t.done; this.saveTasks() }
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id)
    this.saveTasks()
  }

  getTaskGroups(): TaskGroups {
    const groups: TaskGroups = { today: [], tomorrow: [], later: [], done: [] }
    const tomStr = DateUtil.tomorrow()
    this.tasks.forEach(t => {
      if (t.done) { groups.done.push(t); return }
      if (!t.due) groups.later.push(t)
      else if (t.due <= DateUtil.today()) groups.today.push(t)
      else if (t.due === tomStr) groups.tomorrow.push(t)
      else groups.later.push(t)
    })
    return groups
  }

  // ── NOTES ──
  addNote() {
    const note = new Note(UIDUtil.noteId(), 'Untitled Note', '', 'rich', DateUtil.today())
    this.notes.unshift(note)
    this.saveNotes()
    this.openNote(note.id)
  }

  openNote(id: string) {
    this.currentNoteId = id
    const n = this.notes.find(x => x.id === id)
    if (!n) return
    this.noteMode = n.mode || 'rich'
    this.noteContent = n.content || ''
    this.mdInput = n.content || ''
    this.plainInput = n.content || ''
  }

  setNoteMode(mode: string) {
    this.saveCurrentNote()
    this.noteMode = mode
    const n = this.notes.find(x => x.id === this.currentNoteId)
    if (n) { n.mode = mode; this.saveNotes() }
  }

  saveCurrentNote() {
    if (!this.currentNoteId) return
    const n = this.notes.find(x => x.id === this.currentNoteId)
    if (!n) return
    if (this.noteMode === 'rich') n.content = this.noteContent
    else if (this.noteMode === 'md') n.content = this.mdInput
    else n.content = this.plainInput
    n.title = MarkdownService.extractTitle(n.content, this.noteMode)
    n.updatedAt = DateUtil.today()
    this.saveNotes()
  }

  deleteCurrentNote() {
    if (!this.currentNoteId) return
    this.notes = this.notes.filter(n => n.id !== this.currentNoteId)
    this.saveNotes()
    this.currentNoteId = ''
  }

  // ── FLASHCARDS ──
  addCard() {
    if (!this.newCardFront.trim() || !this.newCardBack.trim()) return
    const card = new FlashCard(UIDUtil.cardId(), this.newCardFront.trim(), this.newCardBack.trim(), DateUtil.today())
    this.cards.push(card)
    this.saveCards()
    this.updateSRDeck()
    this.newCardFront = ''
    this.newCardBack = ''
  }

  flipCard(): void { this.fcFlipped = !this.fcFlipped }
  nextCard() { if (!this.srsDeck.length) return; this.fcIndex = (this.fcIndex + 1) % this.srsDeck.length; this.fcFlipped = false }
  prevCard() { if (!this.srsDeck.length) return; this.fcIndex = (this.fcIndex - 1 + this.srsDeck.length) % this.srsDeck.length; this.fcFlipped = false }

  get currentCard(): FlashCard | null {
    if (this.srsDeck.length === 0 || this.fcIndex >= this.srsDeck.length) return null
    return this.srsDeck[this.fcIndex]
  }

  rateCard(quality: number) {
    if (!this.srsDeck.length) return
    const card = this.srsDeck[this.fcIndex]
    if (!card) return
    const updated = SRSService.sm2Update(card, quality)
    this.cards = this.cards.map(c => c.id === card.id ? updated : c)
    this.saveCards()
    this.fcFlipped = false
    this.updateSRDeck()
  }

  deleteCard(id: string) {
    this.cards = this.cards.filter(c => c.id !== id)
    this.saveCards()
    this.updateSRDeck()
  }

  shuffleCards() {
    let i = this.cards.length - 1
    while (i > 0) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
      i--
    }
    this.saveCards()
    this.fcIndex = 0
    this.fcFlipped = false
  }

  // ── ERROR LOG ──
  addError() {
    if (!this.errQuestion.trim()) return
    this.errorCounter = StorageService.loadNumber('errorCounter', 0) + 1
    StorageService.save('errorCounter', this.errorCounter)
    const error = new ErrorItem(UIDUtil.errorId(this.errorCounter), this.errQuestion.trim(), this.errWrong.trim(), this.errCorrect.trim(), DateUtil.today())
    this.errors.unshift(error)
    this.saveErrors()
    this.errQuestion = ''
    this.errWrong = ''
    this.errCorrect = ''
  }

  toggleErrorReveal(id: string) {
    const e = this.errors.find(x => x.id === id)
    if (e) { e.revealed = !e.revealed; this.saveErrors() }
  }

  deleteError(id: string) {
    this.errors = this.errors.filter(e => e.id !== id)
    this.saveErrors()
  }

  errorToCard(id: string) {
    const e = this.errors.find(x => x.id === id)
    if (!e || e.cardified) return
    const back = `【正确解法】${e.correct || '—'}${e.wrong ? '\n【常见错误】' + e.wrong : ''}`
    const card = new FlashCard(UIDUtil.cardId(), e.question, back, DateUtil.today())
    card.dueDate = DateUtil.today()
    this.cards.push(card)
    this.saveCards()
    e.cardified = true
    this.saveErrors()
  }

  // ── RESOURCES ──
  addCustomResource(name: string, url: string, school: string, desc: string, cat: string) {
    if (!name || !url) return
    const res = new Resource(UIDUtil.uid(), name, school || 'Custom', url, desc, cat, '—')
    res.custom = true
    this.customResources.push(res)
    StorageService.save(`custom_resources_${this.subjectId}`, this.customResources)
    this.filterResources()
  }

  // ── AI ──
  newAISession() {
    const session = new AISession(UIDUtil.uid(), '新对话', 'general', [], DateUtil.today())
    this.aiSessions.unshift(session)
    this.saveAISessions()
    this.currentAISessionId = session.id
    this.aiMessages = []
  }

  openAISession(id: string) {
    this.currentAISessionId = id
    const s = this.aiSessions.find(x => x.id === id)
    if (s) {
      this.aiCtx = s.ctx || 'general'
      this.aiMessages = s.messages
    }
  }

  deleteAISession(id: string) {
    this.aiSessions = this.aiSessions.filter(s => s.id !== id)
    this.saveAISessions()
    if (this.currentAISessionId === id) { this.currentAISessionId = ''; this.aiMessages = [] }
  }

  setAICtx(ctx: string) {
    this.aiCtx = ctx
    if (this.currentAISessionId) {
      const s = this.aiSessions.find(x => x.id === this.currentAISessionId)
      if (s) { s.ctx = ctx; this.saveAISessions() }
    }
  }

  sendAIMsg() {
    const text = this.aiInput.trim()
    if (!text || this.aiIsTyping) return
    if (!this.currentAISessionId) this.newAISession()
    const session = this.aiSessions.find(s => s.id === this.currentAISessionId)
    if (!session) return
    const now = new Date()
    const h = now.getHours()
    const min = now.getMinutes()
    const nowStr = `${h < 10 ? '0' + h : '' + h}:${min < 10 ? '0' + min : '' + min}`
    session.messages.push(new AIMessage('user', text, nowStr))
    if (!session.title || session.title === '新对话') session.title = text.slice(0, 22) + (text.length > 22 ? '…' : '')
    this.aiInput = ''
    this.saveAISessions()
    this.aiMessages = session.messages
    this.aiIsTyping = true
    // Simulate streaming response
    setTimeout(() => {
      const reply = '这是 AI 的模拟回复。在实际实现中，这里将调用 AI 服务进行流式响应。'
      session.messages.push(new AIMessage('assistant', reply, nowStr))
      this.saveAISessions()
      this.aiMessages = session.messages
      this.aiIsTyping = false
    }, 1500)
  }

  // ── POMODORO ──
  togglePomo() {
    if (this.pomoRunning) {
      this.pomoRunning = false
      if (this.pomoTimerId !== -1) clearInterval(this.pomoTimerId)
    } else {
      this.pomoRunning = true
      this.pomoTimerId = setInterval(() => {
        if (this.pomoRemaining > 0) {
          this.pomoRemaining--
        } else {
          this.onPomoEnd()
        }
      }, 1000)
    }
  }

  onPomoEnd() {
    this.pomoRunning = false
    if (this.pomoTimerId !== -1) clearInterval(this.pomoTimerId)
    if (this.pomoMode === 'focus') {
      this.pomoSessions++
      this.pomoStats[DateUtil.today()] = (this.pomoStats[DateUtil.today()] || 0) + 1
      this.savePomoStats()
    }
  }

  getPomoDuration(mode: string): number {
    if (mode === 'focus') return this.pomoDurations.focus
    if (mode === 'short') return this.pomoDurations.short
    if (mode === 'long') return this.pomoDurations.long
    return this.pomoDurations.focus
  }

  resetPomo() {
    this.pomoRunning = false
    if (this.pomoTimerId !== -1) clearInterval(this.pomoTimerId)
    this.pomoRemaining = this.getPomoDuration(this.pomoMode) * 60
    this.pomoTotal = this.pomoRemaining
  }

  setPomoMode(mode: string) {
    this.pomoMode = mode
    this.pomoRunning = false
    if (this.pomoTimerId !== -1) clearInterval(this.pomoTimerId)
    this.pomoRemaining = this.getPomoDuration(mode) * 60
    this.pomoTotal = this.pomoRemaining
  }

  saveCustomDurations(focus: number, short: number, long: number): void {
    const dur: PomoDurations = {
      focus: Math.max(1, Math.min(120, focus)),
      short: Math.max(1, Math.min(60, short)),
      long: Math.max(1, Math.min(120, long))
    }
    this.pomoDurations = dur
    StorageService.save('pomo_durations', dur)
    this.resetPomo()
  }

  get pomoDisplay(): string {
    const m = Math.floor(this.pomoRemaining / 60)
    const s = this.pomoRemaining % 60
    return `${m < 10 ? '0' + m : '' + m}:${s < 10 ? '0' + s : '' + s}`
  }

  get pomoProgress(): number {
    return 1 - this.pomoRemaining / this.pomoTotal
  }

  get pomoTodaySessions(): number {
    return this.pomoStats[DateUtil.today()] || 0
  }

  get pomoStreak(): number {
    return DateUtil.calcStreak(this.pomoStats)
  }

  get pomoWeekAvg(): number {
    const days = DateUtil.weekDays()
    const total = days.reduce((sum, d) => sum + (this.pomoStats[d] || 0), 0)
    return Math.round(total / 7 * 25)
  }

  get pomoTotalSessions(): number {
    let total = 0
    Object.keys(this.pomoStats).forEach((k: string) => { total += this.pomoStats[k] })
    return total
  }

  // ── EDIT SUBJECT ──
  confirmEditSubject(name: string, date: string, score: string, knowledge: string) {
    if (!this.subject) return
    this.subject.name = name.trim() || this.subject.name
    this.subject.examDate = date
    this.subject.targetScore = score.trim()
    this.subject.knowledgePoints = knowledge.trim()
    const subjects: Subject[] = StorageService.load('subjects', []) as Subject[]
    const idx = subjects.findIndex(s => s.id === this.subjectId)
    if (idx >= 0) { subjects[idx] = this.subject; StorageService.save('subjects', subjects) }
    this.showEditDialog = false
  }



  // ── TASKS TAB ──
  @Builder
  TasksTab() {
    Scroll() {
      Column() {
        Text('Tasks · 任务').fontSize(10).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 12 })

        // Add task row
        Row() {
          TextInput({ text: this.newTaskText, placeholder: 'New task…' })
            .layoutWeight(1)
            .fontSize(12)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })
          TextInput({ text: this.newTaskDate, placeholder: 'YYYY-MM-DD' })
            .width(120)
            .fontSize(12)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })
            .margin({ left: 8 })
          Select([{ value: 'normal' }, { value: 'critical' }, { value: 'easy' }])
            .selected(this.newTaskPriority === 'normal' ? 0 : this.newTaskPriority === 'critical' ? 1 : 2)
            .onSelect((index: number) => {
              this.newTaskPriority = ['normal', 'critical', 'easy'][index]
            })
            .margin({ left: 8 })
            .width(100)
          Button('Add →')
            .fontSize(9)
            .fontColor('#fff')
            .backgroundColor(this.getInkColor())
            .padding({ left: 12, right: 12, top: 6, bottom: 6 })
            .margin({ left: 8 })
            .onClick(() => this.addTask())
        }
        .width('100%')
        .margin({ bottom: 16 })

        // Task groups
        this.TaskGroup('Today', '01', this.getTaskGroups().today)
        this.TaskGroup('Tomorrow', '02', this.getTaskGroups().tomorrow)
        this.TaskGroup('Later', '03', this.getTaskGroups().later)
        this.TaskGroup('Done', '04', this.getTaskGroups().done)
      }
      .padding(24)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
  }

  @Builder
  TaskGroup(label: string, id: string, items: Task[]) {
    if (items.length > 0) {
      Column() {
        Row() {
          Text(`§${id}`).fontSize(9).fontColor(this.getInkMidColor())
          Divider().color(this.getBorderColor()).layoutWeight(1).margin({ left: 8, right: 8 }).strokeWidth(0.5)
          Text(label).fontSize(9).fontColor(this.getInkColor()).fontWeight(FontWeight.Medium).letterSpacing(2)
          Divider().color(this.getBorderColor()).layoutWeight(1).margin({ left: 8, right: 8 }).strokeWidth(0.5)
        }
        .width('100%')
        .margin({ bottom: 8 })

        ForEach(items, (t: Task) => {
          Row() {
            Text(t.done ? '✓' : '')
              .width(20)
              .height(20)
              .fontSize(10)
              .fontColor(t.done ? '#fff' : this.getInkColor())
              .backgroundColor(t.done ? this.getInkColor() : Color.Transparent)
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .textAlign(TextAlign.Center)
              .onClick(() => this.toggleTask(t.id))

            Text(t.text)
              .fontSize(13)
              .fontColor(t.done ? this.getInkDimColor() : this.getInkColor())
              .decoration({ type: t.done ? TextDecorationType.LineThrough : TextDecorationType.None })
              .layoutWeight(1)
              .margin({ left: 8 })

            if (t.due) {
              Text(DateUtil.fmtDate(t.due))
                .fontSize(9)
                .fontColor(DateUtil.isOverdue(t.due) && !t.done ? this.getRedColor() : this.getInkMidColor())
                .margin({ right: 8 })
            }

            Text(t.priority)
              .fontSize(8)
              .fontColor(
                t.priority === 'critical' ? this.getKleinColor() :
                t.priority === 'easy' ? '#5a8a5a' : this.getInkDimColor()
              )
              .border({ width: 0.5, color: t.priority === 'critical' ? this.getKleinColor() : this.getInkDimColor() })
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .margin({ right: 8 })

            Text('×')
              .fontSize(14)
              .fontColor(this.getInkDimColor())
              .onClick(() => this.deleteTask(t.id))
          }
          .width('100%')
          .padding({ top: 8, bottom: 8 })
          .border({ width: { bottom: 0.5 }, color: this.getBorderColor() })
        }, (t: Task) => t.id)
      }
      .width('100%')
      .margin({ bottom: 16 })
    }
  }

  // ── POMODORO TAB ──
  @Builder
  PomodoroTab() {
    Scroll() {
      Column() {
        // Timer strip
        Column() {
          // Main time display
          Text(this.pomoDisplay)
            .fontSize(72)
            .fontWeight(FontWeight.Lighter)
            .fontColor(this.getPomoTextColorStrong())
            .letterSpacing(-2)
            .margin({ bottom: 8 })

          // Mode label
          Text(this.pomoMode === 'focus' ? 'FOCUS · 专注' : this.pomoMode === 'short' ? 'SHORT BREAK · 短休息' : 'LONG BREAK · 长休息')
            .fontSize(10)
            .fontColor(this.getPomoTextColorStrong())
            .letterSpacing(3)
            .margin({ bottom: 20 })

            // Session indicators
            Row() {
              Text('').width(10).height(10).borderRadius(5)
                .backgroundColor(this.pomoSessions % 4 >= 1 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)')
                .margin({ right: 8 })
              Text('').width(10).height(10).borderRadius(5)
                .backgroundColor(this.pomoSessions % 4 >= 2 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)')
                .margin({ right: 8 })
              Text('').width(10).height(10).borderRadius(5)
                .backgroundColor(this.pomoSessions % 4 >= 3 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)')
                .margin({ right: 8 })
              Text('').width(10).height(10).borderRadius(5)
                .backgroundColor(this.pomoSessions % 4 >= 0 && this.pomoSessions > 0 ? this.getPomoTextColorStrong() : 'rgba(128,128,128,0.4)')
            }
            .margin({ bottom: 24 })

            // Control buttons
            Row() {
              Button('↺')
                .fontSize(18)
                .width(52)
                .height(52)
                .fontColor(this.getPomoTextColorStrong())
                .backgroundColor('rgba(128,128,128,0.25)')
                .borderRadius(26)
                .onClick(() => this.resetPomo())
              Button(this.pomoRunning ? '⏸' : '▶')
                .fontSize(24)
                .width(72)
                .height(72)
                .fontColor(this.getPomoTextColorStrong())
                .backgroundColor('rgba(128,128,128,0.35)')
                .borderRadius(36)
                .margin({ left: 20, right: 20 })
                .onClick(() => this.togglePomo())
              Button('⏭')
                .fontSize(18)
                .width(52)
                .height(52)
                .fontColor(this.getPomoTextColorStrong())
                .backgroundColor('rgba(128,128,128,0.25)')
                .borderRadius(26)
                .onClick(() => {
                  if (this.pomoMode === 'focus') {
                    this.setPomoMode(this.pomoSessions % 4 === 3 ? 'long' : 'short')
                  } else {
                    this.setPomoMode('focus')
                  }
                })
            }
          }
          .width('100%')
          .padding({ top: 60, bottom: 40 })

          // Progress bar
          Row() {
            Text('')
              .width(`${(1 - this.pomoProgress) * 100}%`)
              .height('100%')
              .backgroundColor('rgba(255,255,255,0.4)')
          }
          .width('100%')
          .height(4)
        .backgroundColor(this.getBorderColor())

        // Mode pills
        Row() {
          Button('专注 · Focus')
            .fontSize(9)
            .fontColor(this.pomoMode === 'focus' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.pomoMode === 'focus' ? 1.5 : 0 }, color: this.getKleinColor() })
            .layoutWeight(1)
            .onClick(() => this.setPomoMode('focus'))
          Button('短休息 · Short')
            .fontSize(9)
            .fontColor(this.pomoMode === 'short' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.pomoMode === 'short' ? 1.5 : 0 }, color: this.getKleinColor() })
            .layoutWeight(1)
            .onClick(() => this.setPomoMode('short'))
          Button('长休息 · Long')
            .fontSize(9)
            .fontColor(this.pomoMode === 'long' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.pomoMode === 'long' ? 1.5 : 0 }, color: this.getKleinColor() })
            .layoutWeight(1)
            .onClick(() => this.setPomoMode('long'))
        }
        .width('100%')
        .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })

        // Stats grid
        Grid() {
          GridItem() {
            Column() {
              Text('Today').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoTodaySessions}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getKleinColor()).letterSpacing(-2)
              Text('sessions').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() {
                Text('').width(`${Math.min(this.pomoTodaySessions * 25, 100)}%`).height('100%').backgroundColor(this.getKleinColor())
              }
              .width('100%')
              .height(1)
              .backgroundColor(this.getBorderHiColor())
              .margin({ top: 8 })
            }
            .padding(14)
            .backgroundColor(this.getBgColor())
            .width('100%')
            .height('100%')
          }
          GridItem() {
            Column() {
              Text('Streak').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoStreak}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getInkColor()).letterSpacing(-2)
              Text('days').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() {
                Text('').width(`${Math.min(this.pomoStreak / 30 * 100, 100)}%`).height('100%').backgroundColor(this.getInkColor())
              }
              .width('100%')
              .height(1)
              .backgroundColor(this.getBorderHiColor())
              .margin({ top: 8 })
            }
            .padding(14)
            .backgroundColor(this.getBgColor())
            .width('100%')
            .height('100%')
          }
          GridItem() {
            Column() {
              Text('Week Avg').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoWeekAvg}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getInkColor()).letterSpacing(-2)
              Text('min/day').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() {
                Text('').width(`${Math.min(this.pomoWeekAvg / 120 * 100, 100)}%`).height('100%').backgroundColor(this.getInkColor())
              }
              .width('100%')
              .height(1)
              .backgroundColor(this.getBorderHiColor())
              .margin({ top: 8 })
            }
            .padding(14)
            .backgroundColor(this.getBgColor())
            .width('100%')
            .height('100%')
          }
          GridItem() {
            Column() {
              Text('Total').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoTotalSessions}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getInkColor()).letterSpacing(-2)
              Text('sessions').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() {
                Text('').width(`${Math.min(this.pomoTotalSessions / 50 * 100, 100)}%`).height('100%').backgroundColor(this.getInkColor())
              }
              .width('100%')
              .height(1)
              .backgroundColor(this.getBorderHiColor())
              .margin({ top: 8 })
            }
            .padding(14)
            .backgroundColor(this.getBgColor())
            .width('100%')
            .height('100%')
          }
        }
        .width('100%')

        // Settings button
        Button('⚙ 时间设置 · Time Settings')
          .fontSize(10)
          .fontColor(this.getInkDimColor())
          .backgroundColor(Color.Transparent)
          .border({ width: 0.5, color: this.getBorderHiColor() })
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
          .margin({ top: 16 })
          .onClick(() => {
            this.tempFocusDuration = this.pomoDurations.focus
            this.tempShortDuration = this.pomoDurations.short
            this.tempLongDuration = this.pomoDurations.long
            this.showPomoSettings = true
          })
      }
      .width('100%')
      .padding(24)
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
    .backgroundColor(this.subject?.color || '#0047ab')
  }

  // ── POMODORO SETTINGS DIALOG ──
  @Builder
  PomoSettingsDialog() {
    Column() {
      Column() {
        Text('时间设置 · Time Settings').fontSize(18).fontColor(this.getInkColor()).margin({ bottom: 20 })

        // Focus duration
        Column() {
          Text('专注时长 · Focus Duration').fontSize(12).fontColor(this.getInkDimColor()).margin({ bottom: 8 })
          Row() {
            Button('-')
              .fontSize(16)
              .width(40)
              .height(40)
              .fontColor(this.getInkColor())
              .backgroundColor(this.getBg2Color())
              .onClick(() => {
                if (this.tempFocusDuration > 1) this.tempFocusDuration--
              })
            Text(`${this.tempFocusDuration} 分钟`)
              .fontSize(16)
              .fontColor(this.getInkColor())
              .layoutWeight(1)
              .textAlign(TextAlign.Center)
            Button('+')
              .fontSize(16)
              .width(40)
              .height(40)
              .fontColor(this.getInkColor())
              .backgroundColor(this.getBg2Color())
              .onClick(() => {
                if (this.tempFocusDuration < 120) this.tempFocusDuration++
              })
          }
          .width('100%')
        }
        .margin({ bottom: 20 })

        // Short break duration
        Column() {
          Text('短休息时长 · Short Break').fontSize(12).fontColor(this.getInkDimColor()).margin({ bottom: 8 })
          Row() {
            Button('-')
              .fontSize(16)
              .width(40)
              .height(40)
              .fontColor(this.getInkColor())
              .backgroundColor(this.getBg2Color())
              .onClick(() => {
                if (this.tempShortDuration > 1) this.tempShortDuration--
              })
            Text(`${this.tempShortDuration} 分钟`)
              .fontSize(16)
              .fontColor(this.getInkColor())
              .layoutWeight(1)
              .textAlign(TextAlign.Center)
            Button('+')
              .fontSize(16)
              .width(40)
              .height(40)
              .fontColor(this.getInkColor())
              .backgroundColor(this.getBg2Color())
              .onClick(() => {
                if (this.tempShortDuration < 60) this.tempShortDuration++
              })
          }
          .width('100%')
        }
        .margin({ bottom: 20 })

        // Long break duration
        Column() {
          Text('长休息时长 · Long Break').fontSize(12).fontColor(this.getInkDimColor()).margin({ bottom: 8 })
          Row() {
            Button('-')
              .fontSize(16)
              .width(40)
              .height(40)
              .fontColor(this.getInkColor())
              .backgroundColor(this.getBg2Color())
              .onClick(() => {
                if (this.tempLongDuration > 1) this.tempLongDuration--
              })
            Text(`${this.tempLongDuration} 分钟`)
              .fontSize(16)
              .fontColor(this.getInkColor())
              .layoutWeight(1)
              .textAlign(TextAlign.Center)
            Button('+')
              .fontSize(16)
              .width(40)
              .height(40)
              .fontColor(this.getInkColor())
              .backgroundColor(this.getBg2Color())
              .onClick(() => {
                if (this.tempLongDuration < 120) this.tempLongDuration++
              })
          }
          .width('100%')
        }
        .margin({ bottom: 24 })

        // Buttons
        Row() {
          Button('取消 · Cancel')
            .fontSize(12)
            .fontColor(this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 20, right: 20, top: 10, bottom: 10 })
            .onClick(() => this.showPomoSettings = false)
          Button('保存 · Save')
            .fontSize(12)
            .fontColor('#fff')
            .backgroundColor(this.getKleinColor())
            .padding({ left: 20, right: 20, top: 10, bottom: 10 })
            .margin({ left: 12 })
            .onClick(() => {
              this.saveCustomDurations(this.tempFocusDuration, this.tempShortDuration, this.tempLongDuration)
              this.showPomoSettings = false
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
      }
      .width('85%')
      .padding(24)
      .backgroundColor(this.getBgColor())
      .border({ width: 0.5, color: this.getBorderHiColor() })
      .borderRadius(8)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0,0,0,0.5)')
    .justifyContent(FlexAlign.Center)
    .onClick(() => this.showPomoSettings = false)
  }

  // ── NOTES TAB ──
  @Builder
  NotesTab() {
    Row() {
      // Sidebar
      Column() {
        Text('Notes · REC').fontSize(9).fontColor(this.getInkMidColor()).letterSpacing(2).fontWeight(FontWeight.Medium).margin({ bottom: 8 })
        Scroll() {
          Column() {
            if (this.notes.length === 0) {
              Text('No notes yet').fontSize(10).fontColor(this.getInkDimColor()).padding(8)
            } else {
              ForEach(this.notes, (n: Note) => {
                Row() {
                  Column() {
                    Text(n.title)
                      .fontSize(13)
                      .fontColor(this.getInkColor())
                      .maxLines(1)
                      .textOverflow({ overflow: TextOverflow.Ellipsis })
                    Text(n.createdAt)
                      .fontSize(9)
                      .fontColor(this.getInkMidColor())
                      .margin({ top: 2 })
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)
                }
                .width('100%')
                .padding(10)
                .backgroundColor(n.id === this.currentNoteId ? (this.isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,71,171,0.08)') : Color.Transparent)
                .border({ width: { left: n.id === this.currentNoteId ? 2 : 0 }, color: this.getKleinColor() })
                .onClick(() => this.openNote(n.id))
              }, (n: Note) => n.id)
            }
          }
          .width('100%')
        }
        .width('100%')
        .layoutWeight(1)

        Button('+ New Note')
          .fontSize(9)
          .fontColor(this.getInkDimColor())
          .backgroundColor(Color.Transparent)
          .border({ width: 0.5, color: this.getBorderHiColor() })
          .padding({ left: 10, right: 10, top: 6, bottom: 6 })
          .margin({ top: 8 })
          .onClick(() => this.addNote())
      }
      .width(200)
      .height('100%')
      .padding(16)
      .border({ width: { right: 0.5 }, color: this.getBorderHiColor() })

      // Editor area
      Column() {
        // Mode bar
        Row() {
          Button('Rich Text')
            .fontSize(9)
            .fontColor(this.noteMode === 'rich' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.noteMode === 'rich' ? 1.5 : 0 }, color: this.getKleinColor() })
            .padding({ left: 10, right: 10, top: 8, bottom: 8 })
            .onClick(() => this.setNoteMode('rich'))
          Button('Markdown')
            .fontSize(9)
            .fontColor(this.noteMode === 'md' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.noteMode === 'md' ? 1.5 : 0 }, color: this.getKleinColor() })
            .padding({ left: 10, right: 10, top: 8, bottom: 8 })
            .onClick(() => this.setNoteMode('md'))
          Button('Plain Text')
            .fontSize(9)
            .fontColor(this.noteMode === 'plain' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.noteMode === 'plain' ? 1.5 : 0 }, color: this.getKleinColor() })
            .padding({ left: 10, right: 10, top: 8, bottom: 8 })
            .onClick(() => this.setNoteMode('plain'))
          Blank()
          Button('Delete')
            .fontSize(9)
            .fontColor(this.getRedColor())
            .backgroundColor(Color.Transparent)
            .padding({ left: 10, right: 10, top: 8, bottom: 8 })
            .onClick(() => this.deleteCurrentNote())
        }
        .width('100%')
        .border({ width: { bottom: 0.5 }, color: this.getBorderColor() })

        if (this.noteMode === 'rich') {
          TextArea({ text: this.noteContent, placeholder: 'Start writing…' })
            .fontSize(14)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .layoutWeight(1)
            .padding(16)
            .onChange((value: string) => {
              this.noteContent = value
              this.saveCurrentNote()
            })
        } else if (this.noteMode === 'md') {
          Row() {
            TextArea({ text: this.mdInput, placeholder: 'Write Markdown here…' })
              .fontSize(13)
              .fontColor(this.getInkColor())
              .backgroundColor(Color.Transparent)
              .layoutWeight(1)
              .padding(16)
              .onChange((value: string) => {
                this.mdInput = value
                this.saveCurrentNote()
              })
            Scroll() {
              Column() {
                Text(MarkdownService.parse(this.mdInput))
                  .fontSize(14)
                  .fontColor(this.getInkColor())
                  .padding(16)
                  .width('100%')
              }
              .width('100%')
            }
            .layoutWeight(1)
            .border({ width: { left: 0.5 }, color: this.getBorderColor() })
          }
          .layoutWeight(1)
        } else {
          TextArea({ text: this.plainInput, placeholder: 'Plain text…' })
            .fontSize(13)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .layoutWeight(1)
            .padding(16)
            .onChange((value: string) => {
              this.plainInput = value
              this.saveCurrentNote()
            })
        }
      }
      .layoutWeight(1)
      .height('100%')
    }
    .width('100%')
    .height('100%')
  }

  // ── FLASH CARDS TAB ──
  @Builder
  FlashCardsTab() {
    Scroll() {
      Column() {
        // Sub-tabs
        Row() {
          Button('知识点 · Concepts')
            .fontSize(9)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .padding({ left: 10, right: 10, top: 8, bottom: 8 })
            .layoutWeight(1)
          Button('错题 · Errors')
            .fontSize(9)
            .fontColor(this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .padding({ left: 10, right: 10, top: 8, bottom: 8 })
            .layoutWeight(1)
        }
        .width('100%')
        .backgroundColor(this.getBorderColor())
        .margin({ bottom: 16 })

        // FC controls
        Row() {
          Text(`${this.cards.length} 张 · 今日待复习 ${this.cards.filter(c => SRSService.isDue(c)).length}`)
            .fontSize(9)
            .fontColor(this.getInkDimColor())
          Blank()
          Button('Shuffle')
            .fontSize(9)
            .fontColor(this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 10, right: 10, top: 5, bottom: 5 })
            .margin({ right: 8 })
            .onClick(() => this.shuffleCards())
          Button('Reset')
            .fontSize(9)
            .fontColor(this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 10, right: 10, top: 5, bottom: 5 })
            .onClick(() => { this.fcIndex = 0; this.fcFlipped = false })
        }
        .width('100%')
        .margin({ bottom: 12 })

        // SRS mode bar
        Row() {
          Button('全部')
            .fontSize(9)
            .fontColor(this.srsMode === 'all' ? '#fff' : this.getInkDimColor())
            .backgroundColor(this.srsMode === 'all' ? this.getInkColor() : Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 10, right: 10, top: 4, bottom: 4 })
            .onClick(() => { this.srsMode = 'all'; this.updateSRDeck() })
          Button('今日待复习')
            .fontSize(9)
            .fontColor(this.srsMode === 'due' ? '#fff' : this.getInkDimColor())
            .backgroundColor(this.srsMode === 'due' ? this.getInkColor() : Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 10, right: 10, top: 4, bottom: 4 })
            .margin({ left: 6 })
            .onClick(() => { this.srsMode = 'due'; this.updateSRDeck() })
          Button('新卡片')
            .fontSize(9)
            .fontColor(this.srsMode === 'new' ? '#fff' : this.getInkDimColor())
            .backgroundColor(this.srsMode === 'new' ? this.getInkColor() : Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 10, right: 10, top: 4, bottom: 4 })
            .margin({ left: 6 })
            .onClick(() => { this.srsMode = 'new'; this.updateSRDeck() })
        }
        .width('100%')
        .margin({ bottom: 12 })

        // Flashcard
        Column() {
          if (this.srsDeck.length > 0 && this.currentCard) {
            Column() {
              Text(this.fcFlipped ? 'DEFINITION · 解释' : 'CONCEPT · 概念')
                .fontSize(9)
                .fontColor(this.getInkMidColor())
                .letterSpacing(2)
                .margin({ bottom: 12 })
              Text(this.fcFlipped ? this.currentCard.back : this.currentCard.front)
                .fontSize(18)
                .fontColor(this.getInkColor())
                .textAlign(TextAlign.Center)
                .lineHeight(1.5)
              Text(this.fcFlipped ? '← Tap to flip back' : 'Tap to flip →')
                .fontSize(9)
                .fontColor(this.getInkDimColor())
                .margin({ top: 12 })
            }
            .width('100%')
            .padding(24)
            .constraintSize({ minHeight: 180 })
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .justifyContent(FlexAlign.Center)
            .onClick(() => this.flipCard())

            // SRS info
            if (this.currentCard) {
              Row() {
                Text(`⏱ 间隔 ${this.currentCard.interval || 1}天`).fontSize(8).fontColor(this.getInkDimColor())
                Text(`🔄 复习 ${this.currentCard.repetitions || 0}次`).fontSize(8).fontColor(this.getInkDimColor()).margin({ left: 8 })
                Text(`⚡ EF ${(this.currentCard.easeFactor || 2.5).toFixed(1)}`).fontSize(8).fontColor(this.getInkDimColor()).margin({ left: 8 })
              }
              .width('100%')
              .margin({ top: 8 })
            }

            // Navigation
            Row() {
              Button('← Prev')
                .fontSize(9)
                .fontColor(this.getInkDimColor())
                .backgroundColor(Color.Transparent)
                .border({ width: 0.5, color: this.getBorderHiColor() })
                .padding({ left: 12, right: 12, top: 6, bottom: 6 })
                .onClick(() => this.prevCard())
              Text(`${this.srsDeck.length ? this.fcIndex + 1 : 0} / ${this.srsDeck.length}`)
                .fontSize(9)
                .fontColor(this.getInkDimColor())
                .layoutWeight(1)
                .textAlign(TextAlign.Center)
              Button('Next →')
                .fontSize(9)
                .fontColor(this.getInkDimColor())
                .backgroundColor(Color.Transparent)
                .border({ width: 0.5, color: this.getBorderHiColor() })
                .padding({ left: 12, right: 12, top: 6, bottom: 6 })
                .onClick(() => this.nextCard())
            }
            .width('100%')
            .margin({ top: 12, bottom: 12 })

            // Rate buttons
            Row() {
              Button('✗ Again')
                .fontSize(9)
                .fontColor(this.getRedColor())
                .backgroundColor(Color.Transparent)
                .border({ width: 0.5, color: this.getRedColor() })
                .padding({ left: 10, right: 10, top: 5, bottom: 5 })
                .layoutWeight(1)
                .onClick(() => this.rateCard(0))
              Button('△ Hard')
                .fontSize(9)
                .fontColor(this.getAmberColor())
                .backgroundColor(Color.Transparent)
                .border({ width: 0.5, color: this.getAmberColor() })
                .padding({ left: 10, right: 10, top: 5, bottom: 5 })
                .layoutWeight(1)
                .margin({ left: 6 })
                .onClick(() => this.rateCard(1))
              Button('✓ Good')
                .fontSize(9)
                .fontColor(this.getInkColor())
                .backgroundColor(Color.Transparent)
                .border({ width: 0.5, color: this.getBorderHiColor() })
                .padding({ left: 10, right: 10, top: 5, bottom: 5 })
                .layoutWeight(1)
                .margin({ left: 6 })
                .onClick(() => this.rateCard(2))
              Button('★ Easy')
                .fontSize(9)
                .fontColor(this.getGreenColor())
                .backgroundColor(Color.Transparent)
                .border({ width: 0.5, color: this.getGreenColor() })
                .padding({ left: 10, right: 10, top: 5, bottom: 5 })
                .layoutWeight(1)
                .margin({ left: 6 })
                .onClick(() => this.rateCard(3))
            }
            .width('100%')
            .margin({ bottom: 16 })
          } else {
            Text(this.srsMode === 'due' ? '🎉 今日复习完成！' : this.srsMode === 'new' ? '没有新卡片了' : '先添加闪卡吧')
              .fontSize(16)
              .fontColor(this.getInkDimColor())
              .padding(24)
          }
        }
        .width('100%')
        .margin({ bottom: 16 })

        // Add card
        Text('§A · Add Card').fontSize(9).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 8 })
        Row() {
          TextArea({ text: this.newCardFront, placeholder: 'Concept / 概念…' })
            .layoutWeight(1)
            .fontSize(13)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding(10)
            .height(80)
          TextArea({ text: this.newCardBack, placeholder: 'Definition / 解释…' })
            .layoutWeight(1)
            .fontSize(13)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding(10)
            .height(80)
            .margin({ left: 1 })
        }
        .width('100%')
        .backgroundColor(this.getBorderColor())
        .margin({ bottom: 1 })

        Button('Add Card →')
          .fontSize(9)
          .fontColor('#fff')
          .backgroundColor(this.getInkColor())
          .padding({ left: 12, right: 12, top: 8, bottom: 8 })
          .width('100%')
          .margin({ bottom: 16 })
          .onClick(() => this.addCard())

        // Error log section (inline in flash tab)
        Text('§B · Error Log').fontSize(9).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 8 })
        Column() {
          Text('Add Error · 新增错题').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 8 })
          TextArea({ text: this.errQuestion, placeholder: '题目内容 / Question…' })
            .fontSize(13)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding(10)
            .height(60)
            .margin({ bottom: 1 })
          Row() {
            TextArea({ text: this.errWrong, placeholder: '错误原因 / Why wrong…' })
              .layoutWeight(1)
              .fontSize(13)
              .fontColor(this.getInkColor())
              .backgroundColor(Color.Transparent)
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .padding(10)
              .height(60)
            TextArea({ text: this.errCorrect, placeholder: '正确解法 / Correct solution…' })
              .layoutWeight(1)
              .fontSize(13)
              .fontColor(this.getInkColor())
              .backgroundColor(Color.Transparent)
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .padding(10)
              .height(60)
              .margin({ left: 1 })
          }
          .width('100%')
          .backgroundColor(this.getBorderColor())
          .margin({ bottom: 8 })

          Button('Add to Log →')
            .fontSize(9)
            .fontColor('#fff')
            .backgroundColor(this.getInkColor())
            .padding({ left: 12, right: 12, top: 8, bottom: 8 })
            .width('100%')
            .margin({ bottom: 16 })
            .onClick(() => this.addError())
        }
        .width('100%')
        .padding(16)
        .border({ width: 0.5, color: this.getBorderHiColor() })
        .margin({ bottom: 16 })

        // Error list
        if (this.errors.length === 0) {
          Text('No errors logged yet.').fontSize(10).fontColor(this.getInkDimColor()).padding(8)
        } else {
          ForEach(this.errors, (e: ErrorItem) => {
            Column() {
              Row() {
                Text(e.id).fontSize(9).fontColor(this.getInkMidColor()).width(56)
                Text(e.question)
                  .fontSize(14)
                  .fontColor(this.getInkColor())
                  .layoutWeight(1)
                  .maxLines(2)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                Button(e.revealed ? 'Hide ↑' : 'Answer →')
                  .fontSize(8)
                  .fontColor(e.revealed ? this.getKleinColor() : this.getInkDimColor())
                  .backgroundColor(Color.Transparent)
                  .border({ width: 0.5, color: e.revealed ? this.getKleinColor() : this.getBorderHiColor() })
                  .padding({ left: 8, right: 8, top: 3, bottom: 3 })
                  .onClick(() => this.toggleErrorReveal(e.id))
                Button(e.cardified ? '✓卡片' : '→卡片')
                  .fontSize(8)
                  .fontColor(e.cardified ? this.getInkDimColor() : this.getKleinColor())
                  .backgroundColor(Color.Transparent)
                  .margin({ left: 6 })
                  .onClick(() => this.errorToCard(e.id))
                Text('×')
                  .fontSize(14)
                  .fontColor(this.getInkDimColor())
                  .margin({ left: 6 })
                  .onClick(() => this.deleteError(e.id))
              }
              .width('100%')

              if (e.revealed) {
                Row() {
                  Column() {
                    Text('错误原因').fontSize(8).fontColor(this.getInkMidColor()).letterSpacing(1).margin({ bottom: 6 })
                    Text(e.wrong || '—').fontSize(13).fontColor(this.getInkMidColor()).lineHeight(1.6)
                  }
                  .layoutWeight(1)
                  .padding(10)
                  Column() {
                    Text('正确解法').fontSize(8).fontColor(this.getInkMidColor()).letterSpacing(1).margin({ bottom: 6 })
                    Text(e.correct || '—').fontSize(13).fontColor(this.getInkMidColor()).lineHeight(1.6)
                  }
                  .layoutWeight(1)
                  .padding(10)
                  .margin({ left: 1 })
                }
                .width('100%')
                .backgroundColor(this.getBorderColor())
                .margin({ top: 8 })
                Text(e.createdAt).fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 6 })
              }
            }
            .width('100%')
            .padding({ top: 12, bottom: 12 })
            .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })
          }, (e: ErrorItem) => e.id)
        }
      }
      .padding(24)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
  }

  // ── AI TAB ──
  @Builder
  AITab() {
    Column() {
      // AI sub-tabs
      Row() {
        Button('💬 对话')
          .fontSize(9)
          .fontColor(this.aiSubTab === 'chat' ? '#fff' : this.getInkDimColor())
          .backgroundColor(this.aiSubTab === 'chat' ? this.getInkColor() : Color.Transparent)
          .padding({ left: 10, right: 10, top: 8, bottom: 8 })
          .layoutWeight(1)
          .onClick(() => this.aiSubTab = 'chat')
        Button('📄 真题批改')
          .fontSize(9)
          .fontColor(this.aiSubTab === 'paper' ? '#fff' : this.getInkDimColor())
          .backgroundColor(this.aiSubTab === 'paper' ? this.getInkColor() : Color.Transparent)
          .padding({ left: 10, right: 10, top: 8, bottom: 8 })
          .layoutWeight(1)
          .onClick(() => this.aiSubTab = 'paper')
        Button('🎯 出题预测')
          .fontSize(9)
          .fontColor(this.aiSubTab === 'predict' ? '#fff' : this.getInkDimColor())
          .backgroundColor(this.aiSubTab === 'predict' ? this.getInkColor() : Color.Transparent)
          .padding({ left: 10, right: 10, top: 8, bottom: 8 })
          .layoutWeight(1)
          .onClick(() => this.aiSubTab = 'predict')
        Button('⚡ 模板库')
          .fontSize(9)
          .fontColor(this.aiSubTab === 'prompts' ? '#fff' : this.getInkDimColor())
          .backgroundColor(this.aiSubTab === 'prompts' ? this.getInkColor() : Color.Transparent)
          .padding({ left: 10, right: 10, top: 8, bottom: 8 })
          .layoutWeight(1)
          .onClick(() => this.aiSubTab = 'prompts')
      }
      .width('100%')
      .backgroundColor(this.getBorderColor())

      if (this.aiSubTab === 'chat') {
        this.AIChatSubTab()
      } else if (this.aiSubTab === 'paper') {
        this.AIPaperSubTab()
      } else if (this.aiSubTab === 'predict') {
        this.AIPredictSubTab()
      } else {
        this.AIPromptsSubTab()
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  AIChatSubTab() {
    Row() {
      // Sidebar
      Column() {
        Row() {
          Text('历史对话').fontSize(9).fontColor(this.getInkMidColor()).letterSpacing(1).fontWeight(FontWeight.Medium)
          Blank()
          Button('+')
            .fontSize(10)
            .fontColor(this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .onClick(() => this.newAISession())
        }
        .width('100%')
        .margin({ bottom: 8 })

        Scroll() {
          Column() {
            if (this.aiSessions.length === 0) {
              Text('暂无历史').fontSize(9).fontColor(this.getInkDimColor()).padding(8)
            } else {
              ForEach(this.aiSessions, (s: AISession) => {
                Row() {
                  Column() {
                    Text(s.title || '新对话')
                      .fontSize(12)
                      .fontColor(this.getInkColor())
                      .maxLines(1)
                      .textOverflow({ overflow: TextOverflow.Ellipsis })
                      .layoutWeight(1)
                    Text(`${s.messages.length}条 · ${s.date || ''}`)
                      .fontSize(8)
                      .fontColor(this.getInkDimColor())
                      .margin({ top: 2 })
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)
                  Text('×')
                    .fontSize(12)
                    .fontColor(this.getInkDimColor())
                    .onClick(() => this.deleteAISession(s.id))
                }
                .width('100%')
                .padding(8)
                .backgroundColor(s.id === this.currentAISessionId ? (this.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,71,171,0.08)') : Color.Transparent)
                .border({ width: { left: s.id === this.currentAISessionId ? 2 : 0 }, color: this.getKleinColor() })
                .onClick(() => this.openAISession(s.id))
              }, (s: AISession) => s.id)
            }
          }
          .width('100%')
        }
        .width('100%')
        .layoutWeight(1)
      }
      .width(180)
      .height('100%')
      .padding(12)
      .border({ width: { right: 0.5 }, color: this.getBorderHiColor() })

      // Chat area
      Column() {
        // Context chips
        Row() {
          Button('自由问答')
            .fontSize(8)
            .fontColor(this.aiCtx === 'general' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(this.aiCtx === 'general' ? 'rgba(0,71,171,0.12)' : Color.Transparent)
            .border({ width: 0.5, color: this.aiCtx === 'general' ? this.getKleinColor() : this.getBorderHiColor() })
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .onClick(() => this.setAICtx('general'))
          Button('科目知识库')
            .fontSize(8)
            .fontColor(this.aiCtx === 'subject' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(this.aiCtx === 'subject' ? 'rgba(0,71,171,0.12)' : Color.Transparent)
            .border({ width: 0.5, color: this.aiCtx === 'subject' ? this.getKleinColor() : this.getBorderHiColor() })
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .margin({ left: 6 })
            .onClick(() => this.setAICtx('subject'))
          Button('学习规划')
            .fontSize(8)
            .fontColor(this.aiCtx === 'plan' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(this.aiCtx === 'plan' ? 'rgba(0,71,171,0.12)' : Color.Transparent)
            .border({ width: 0.5, color: this.aiCtx === 'plan' ? this.getKleinColor() : this.getBorderHiColor() })
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .margin({ left: 6 })
            .onClick(() => this.setAICtx('plan'))
        }
        .width('100%')
        .padding({ left: 12, right: 12, top: 8, bottom: 8 })
        .border({ width: { bottom: 0.5 }, color: this.getBorderColor() })

        // Messages
        Scroll() {
          Column() {
            if (this.aiMessages.length === 0) {
              Text('选择历史对话或点击 + 开始新对话')
                .fontSize(10)
                .fontColor(this.getInkDimColor())
                .padding(24)
                .textAlign(TextAlign.Center)
            } else {
              ForEach(this.aiMessages, (m: AIMessage) => {
                Row() {
                  Column() {
                    Text(m.role === 'assistant' ? 'AI' : '我')
                      .fontSize(8)
                      .fontColor(m.role === 'assistant' ? '#fff' : this.getInkDimColor())
                      .width(24)
                      .height(24)
                      .backgroundColor(m.role === 'assistant' ? this.getKleinColor() : Color.Transparent)
                      .border({ width: 0.5, color: this.getBorderHiColor() })
                      .textAlign(TextAlign.Center)
                      .margin({ right: 8 })
                  }
                  .alignSelf(ItemAlign.Start)

                  Column() {
                    Text(m.content)
                      .fontSize(13)
                      .fontColor(this.getInkColor())
                      .lineHeight(1.7)
                      .maxLines(100)
                    Text(m.time || '')
                      .fontSize(8)
                      .fontColor(this.getInkDimColor())
                      .margin({ top: 4 })
                  }
                  .layoutWeight(1)
                  .padding(10)
                  .backgroundColor(m.role === 'assistant' ? Color.Transparent : 'rgba(0,71,171,0.08)')
                  .border({ width: 0.5, color: m.role === 'assistant' ? this.getBorderHiColor() : this.getKleinColor() })
                  .margin({ left: m.role === 'user' ? 20 : 0, right: m.role === 'user' ? 0 : 20 })
                }
                .width('100%')
                .margin({ bottom: 8 })
                .direction(m.role === 'user' ? Direction.Rtl : Direction.Ltr)
              }, (m: AIMessage, i: number) => i.toString())
            }

            if (this.aiIsTyping) {
              Row() {
                Text('AI')
                  .fontSize(8)
                  .fontColor('#fff')
                  .width(24)
                  .height(24)
                  .backgroundColor(this.getKleinColor())
                  .border({ width: 0.5, color: this.getKleinColor() })
                  .textAlign(TextAlign.Center)
                  .margin({ right: 8 })
                Text('...')
                  .fontSize(13)
                  .fontColor(this.getInkDimColor())
              }
              .width('100%')
              .margin({ bottom: 8 })
            }
          }
          .padding(12)
          .width('100%')
        }
        .layoutWeight(1)
        .width('100%')

        // Input area
        Column() {
          Row() {
            TextArea({ text: this.aiInput, placeholder: '输入问题…' })
              .layoutWeight(1)
              .fontSize(12)
              .fontColor(this.getInkColor())
              .backgroundColor(Color.Transparent)
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .padding(8)
              .maxLines(4)
            Button('发送 ↑')
              .fontSize(8)
              .fontColor('#fff')
              .backgroundColor(this.getInkColor())
              .padding({ left: 12, right: 12, top: 8, bottom: 8 })
              .margin({ left: 8 })
              .enabled(!this.aiIsTyping)
              .onClick(() => this.sendAIMsg())
          }
          .width('100%')

          Text('AI 回答仅供参考，重要内容请自行核实')
            .fontSize(8)
            .fontColor(this.getInkDimColor())
            .textAlign(TextAlign.Center)
            .margin({ top: 6 })
        }
        .padding(12)
        .border({ width: { top: 0.5 }, color: this.getBorderHiColor() })
        .width('100%')
      }
      .layoutWeight(1)
      .height('100%')
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  AIPaperSubTab() {
    Scroll() {
      Column() {
        Text('§01 · Past Papers · 真题批改').fontSize(9).fontColor(this.getInkMidColor()).letterSpacing(2).margin({ bottom: 12 })
        Column() {
          Text('📄').fontSize(28).fontColor(this.getInkDimColor()).opacity(0.5).margin({ bottom: 8 })
          Text('Upload Past Paper · 上传真题').fontSize(10).fontColor(this.getInkMidColor()).fontWeight(FontWeight.Medium).letterSpacing(2).margin({ bottom: 4 })
          Text('PDF or Image').fontSize(9).fontColor(this.getInkDimColor())
        }
        .width('100%')
        .padding(32)
        .border({ width: 0.5, style: BorderStyle.Dashed, color: this.getBorderHiColor() })
        .justifyContent(FlexAlign.Center)
        .margin({ bottom: 16 })

        Row() {
          Button('AI 批改 →')
            .fontSize(9)
            .fontColor('#fff')
            .backgroundColor(this.getKleinColor())
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
          Button('Clear')
            .fontSize(9)
            .fontColor(this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 12, right: 12, top: 8, bottom: 8 })
            .margin({ left: 8 })
        }
        .width('100%')
        .margin({ bottom: 16 })
      }
      .padding(24)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
  }

  @Builder
  AIPredictSubTab() {
    Scroll() {
      Column() {
        Text('§01 · AI Prediction · 出题预测').fontSize(9).fontColor(this.getInkMidColor()).letterSpacing(2).margin({ bottom: 12 })
        Column() {
          Row() {
            Text('AI Exam Prediction').fontSize(9).fontColor(this.getInkMidColor()).letterSpacing(2)
            Blank()
            Text('AI').fontSize(8).fontColor(this.getKleinColor()).border({ width: 0.5, color: this.getKleinColor() }).padding({ left: 6, right: 6, top: 2, bottom: 2 })
            Button('Generate →')
              .fontSize(9)
              .fontColor(this.getInkDimColor())
              .backgroundColor(Color.Transparent)
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .padding({ left: 12, right: 12, top: 7, bottom: 7 })
              .margin({ left: 8 })
          }
          .width('100%')
          .margin({ bottom: 12 })

          TextInput({ placeholder: 'Paste syllabus or key topics…' })
            .fontSize(11)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })
            .margin({ bottom: 12 })

          Text('Click Generate to predict likely exam questions.')
            .fontSize(14)
            .fontColor(this.getInkDimColor())
            .fontStyle(FontStyle.Italic)
            .height(60)
        }
        .padding(20)
        .border({ width: 0.5, color: this.getBorderHiColor() })
        .width('100%')
      }
      .padding(24)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
  }

  @Builder
  AIPromptsSubTab() {
    Scroll() {
      Column() {
        Text('§01 · Mr. Ranedeer · 深度家教系统').fontSize(9).fontColor(this.getInkMidColor()).letterSpacing(2).margin({ bottom: 12 })
        Column() {
          Text('Mr. Ranedeer AI Tutor').fontSize(18).fontColor(this.getInkColor()).margin({ bottom: 6 })
          Text('高度可定制的家教系统 prompt。设定深度档位、辅导风格、语言，直接注入对话作为本次的主控系统。')
            .fontSize(12)
            .fontColor(this.getInkMidColor())
            .lineHeight(1.6)
            .margin({ bottom: 12 })

          Row() {
            Column() {
              Text('深度档位').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 6 })
              Select([{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }, { value: '6' }, { value: '7' }, { value: '8' }])
                .selected(4)
                .width('100%')
            }
            .layoutWeight(1)
            .margin({ right: 6 })
            Column() {
              Text('辅导风格').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 6 })
              Select([{ value: 'Socratic' }, { value: 'Feynman' }, { value: 'Active' }, { value: 'Spaced' }, { value: 'Visual' }, { value: 'Debate' }])
                .selected(1)
                .width('100%')
            }
            .layoutWeight(1)
            .margin({ right: 6 })
            Column() {
              Text('回答语言').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 6 })
              Select([{ value: 'Chinese' }, { value: 'English' }, { value: 'Bilingual' }])
                .selected(0)
                .width('100%')
            }
            .layoutWeight(1)
          }
          .width('100%')
          .margin({ bottom: 12 })

          TextInput({ placeholder: '例：帮我掌握线性代数的特征值/向量' })
            .fontSize(11)
            .fontColor(this.getInkColor())
            .backgroundColor(Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .margin({ bottom: 12 })

          Row() {
            Button('预览 Prompt')
              .fontSize(9)
              .fontColor(this.getInkDimColor())
              .backgroundColor(Color.Transparent)
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .padding({ left: 10, right: 10, top: 5, bottom: 5 })
            Button('注入 AI Chat →')
              .fontSize(9)
              .fontColor(this.getKleinColor())
              .backgroundColor(Color.Transparent)
              .border({ width: 0.5, color: this.getKleinColor() })
              .padding({ left: 10, right: 10, top: 5, bottom: 5 })
              .margin({ left: 8 })
          }
        }
        .padding(16)
        .border({ width: 0.5, color: this.getBorderHiColor() })
        .margin({ bottom: 16 })
        .width('100%')

        Text('§02 · Awesome Prompts · 精选库').fontSize(9).fontColor(this.getInkMidColor()).letterSpacing(2).margin({ bottom: 12 })
        Text('Prompt library content would be loaded here from Constants.')
          .fontSize(12)
          .fontColor(this.getInkDimColor())
          .padding(8)
      }
      .padding(24)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
  }

  // ── RESOURCES TAB ──
  @Builder
  ResourcesTab() {
    Scroll() {
      Column() {
        Text('§01 · Open Courseware · 开放课程').fontSize(10).fontColor(this.getInkMidColor()).letterSpacing(2).margin({ bottom: 12 })

        // Filter
        Row() {
          ForEach(['all', 'math', 'cs', 'physics', 'english', 'econ', 'custom'], (cat: string) => {
            Button(cat === 'all' ? 'All' : cat === 'math' ? '数学' : cat === 'cs' ? '计算机' : cat === 'physics' ? '物理' : cat === 'english' ? '英语' : cat === 'econ' ? '经济' : 'My Links')
              .fontSize(10)
              .fontColor(this.resFilter === cat ? '#fff' : this.getInkDimColor())
              .backgroundColor(this.resFilter === cat ? this.getInkColor() : Color.Transparent)
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .padding({ left: 10, right: 10, top: 5, bottom: 5 })
              .margin({ right: 6 })
              .onClick(() => { this.resFilter = cat; this.filterResources() })
          }, (cat: string) => cat)
        }
        .width('100%')
        .margin({ bottom: 16 })

        // Resources grid
        if (this.resources.length === 0) {
          Text('No resources in this category.').fontSize(12).fontColor(this.getInkDimColor()).padding(16)
        } else {
          Grid() {
            ForEach(this.resources, (r: Resource) => {
              GridItem() {
                Column() {
                  Text(r.school).fontSize(10).fontColor(this.getKleinColor()).letterSpacing(2).margin({ bottom: 6 })
                  Text(r.name).fontSize(13).fontColor(this.getInkColor()).margin({ bottom: 6 }).lineHeight(20)
                  Text(r.desc).fontSize(12).fontColor(this.getInkMidColor()).lineHeight(18).margin({ bottom: 10 })
                  Row() {
                    Text(r.cat).fontSize(9).fontColor(this.getInkDimColor()).border({ width: 0.5, color: this.getBorderHiColor() }).padding({ left: 6, right: 6, top: 3, bottom: 3 }).margin({ right: 8 })
                    Text(r.lang).fontSize(9).fontColor(this.getInkDimColor())
                    Blank()
                    Text('↗').fontSize(12).fontColor(this.getInkDimColor())
                  }
                  .width('100%')
                }
                .padding(16)
                .backgroundColor(this.isDarkMode ? 'rgba(255,255,255,0.04)' : Color.Transparent)
                .width('100%')
                .height('100%')
              }
            }, (r: Resource) => r.id)
          }
          .columnsTemplate('1fr 1fr')
          .columnsGap(12)
          .rowsGap(12)
          .backgroundColor(this.getBorderColor())
          .width('100%')
          .margin({ bottom: 16 })
        }

        // Add custom
        Text('§02 · Add Custom Link').fontSize(10).fontColor(this.getInkMidColor()).letterSpacing(2).margin({ bottom: 12 })
        Column() {
          // Simplified custom resource add form
          Text('Add custom resource form').fontSize(12).fontColor(this.getInkDimColor()).padding(8)
        }
        .padding(16)
        .border({ width: 0.5, color: this.getBorderHiColor() })
        .width('100%')
      }
      .padding(24)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
  }

  // ── EDIT SUBJECT DIALOG ──
  @Builder
  EditSubjectDialog() {
    Column() {
      Column() {
        Text('SUBJECT SETTINGS').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 8 })
        Text('Edit Subject').fontSize(22).fontColor(this.getInkColor()).margin({ bottom: 20 })

        Text('Subject Name · 科目名称').fontSize(8).fontColor(this.getInkDimColor()).margin({ bottom: 8 })
        TextInput({ text: this.subject?.name || '', placeholder: '科目名称' })
          .fontSize(16)
          .fontColor(this.getInkColor())
          .backgroundColor(Color.Transparent)
          .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })
          .margin({ bottom: 16 })

        Text('Exam Date · 考试日期').fontSize(8).fontColor(this.getInkDimColor()).margin({ bottom: 8 })
        TextInput({ text: this.subject?.examDate || '', placeholder: 'YYYY-MM-DD' })
          .fontSize(14)
          .fontColor(this.getInkColor())
          .backgroundColor(Color.Transparent)
          .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })
          .margin({ bottom: 16 })

        Text('目标分数 · Target Score').fontSize(8).fontColor(this.getInkDimColor()).margin({ bottom: 8 })
        TextInput({ text: this.subject?.targetScore || '', placeholder: 'e.g. 90 / A+' })
          .fontSize(14)
          .fontColor(this.getInkColor())
          .backgroundColor(Color.Transparent)
          .border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })
          .margin({ bottom: 16 })

        Text('知识点范围 · Knowledge Scope').fontSize(8).fontColor(this.getInkDimColor()).margin({ bottom: 8 })
        TextArea({ text: this.subject?.knowledgePoints || '', placeholder: '一行一个知识点' })
          .fontSize(12)
          .fontColor(this.getInkColor())
          .backgroundColor(Color.Transparent)
          .border({ width: 0.5, color: this.getBorderHiColor() })
          .height(80)
          .margin({ bottom: 16 })

        Row() {
          Button('Cancel')
            .fontSize(10)
            .fontColor(this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .onClick(() => this.showEditDialog = false)
          Blank()
          Button('Save →')
            .fontSize(10)
            .fontColor('#fff')
            .backgroundColor(this.getKleinColor())
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .onClick(() => {
              // In real implementation, capture values from inputs
              this.showEditDialog = false
            })
        }
        .width('100%')
      }
      .width('90%')
      .constraintSize({ maxWidth: 480 })
      .padding(24)
      .backgroundColor(this.getBgColor())
      .border({ width: 0.5, color: this.getBorderHiColor() })
      .borderRadius(2)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0,0,0,0.32)')
    .justifyContent(FlexAlign.Center)
    .onClick(() => this.showEditDialog = false)
  }

  build() {
    Column() {
      if (!this.subject) {
        Column() {
          Text('Loading...').fontSize(16).fontColor(this.getInkDimColor())
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .backgroundColor(this.getBgColor())
        .layoutWeight(1)
      } else {
        Column() {
          // Detail Topbar
          Row() {
            Button('← Back')
              .fontSize(10)
              .fontColor(this.getInkDimColor())
              .backgroundColor(Color.Transparent)
              .onClick(() => {
                try {
                  router.back()
                } catch (e) {
                  console.error('Router back error:', e)
                }
              })

            Text(this.subject.name)
              .fontSize(18)
              .fontColor(this.getInkColor())
              .layoutWeight(1)
              .margin({ left: 12 })

            Text(this.getDaysUntilStr())
              .fontSize(9)
              .fontColor(this.getDaysUntil() !== null && this.getDaysUntil()! <= 7 ? this.getKleinColor() : this.getInkMidColor())
              .border({ width: 0.5, color: this.getBorderHiColor() })
              .padding({ left: 8, right: 8, top: 3, bottom: 3 })

            Button('⚙ 设置')
              .fontSize(10)
              .fontColor(this.getInkDimColor())
              .backgroundColor(Color.Transparent)
              .margin({ left: 8 })
              .onClick(() => this.showEditDialog = true)
          }
          .width('100%')
          .padding({ left: 24, right: 24, top: 12, bottom: 12 })
          .backgroundColor(this.isDarkMode ? 'rgba(10,10,10,0.88)' : 'rgba(248,250,252,0.92)')

          // Module Tabs
          Tabs({ barPosition: BarPosition.Start }) {
            TabContent() {
              this.TasksTab()
            }
            .tabBar('📋 Tasks')

            TabContent() {
              this.PomodoroTab()
            }
            .tabBar('🍅 Pomodoro')

            TabContent() {
              this.NotesTab()
            }
            .tabBar('📝 Notes')

            TabContent() {
              this.FlashCardsTab()
            }
            .tabBar('⭐ Flash Cards')

            TabContent() {
              this.AITab()
            }
            .tabBar('🤖 AI')

            TabContent() {
              this.ResourcesTab()
            }
            .tabBar('📚 Resources')
          }
          .width('100%')
          .layoutWeight(1)
          .backgroundColor(this.getBgColor())
          .onChange((index: number) => this.currentTabIndex = index)
          .barMode(BarMode.Scrollable)
          .scrollable(true)

          // Edit Subject Dialog
          if (this.showEditDialog) {
            this.EditSubjectDialog()
          }

          // Pomodoro Settings Dialog
          if (this.showPomoSettings) {
            this.PomoSettingsDialog()
          }
        }
        .width('100%')
        .height('100%')
        .backgroundColor(this.getBgColor())
      }
    }
    .width('100%')
    .height('100%')
  }
}
