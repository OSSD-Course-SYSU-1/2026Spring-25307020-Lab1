import { Task } from '../../models/Task'
import { Subject } from '../../models/Subject'
import { StorageService } from '../../services/StorageService'
import { DateUtil } from '../../utils/DateUtil'

@Component
export struct PlannerTab {
  @Prop subject: Subject
  @Prop isDarkMode: boolean
  @State tasks: Task[] = []
  @State planView: string = 'month'
  @State calDate: Date = new Date()
  @State allSubjects: Subject[] = []
  @State planFilterSubject: string = ''

  aboutToAppear() {
    this.tasks = StorageService.load(`tasks_${this.subject.id}`, []) as Task[]
    this.allSubjects = StorageService.load('subjects', []) as Subject[]
  }

  getBgColor(): ResourceColor { return this.isDarkMode ? '#0a0a0a' : '#F8FAFC' }
  getInkColor(): ResourceColor { return this.isDarkMode ? '#f0f0ee' : '#0e0e0e' }
  getInkMidColor(): ResourceColor { return this.isDarkMode ? '#9a9a96' : '#3a3a3a' }
  getInkDimColor(): ResourceColor { return this.isDarkMode ? '#505050' : '#888' }
  getBorderColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(20,20,20,0.08)' }
  getBorderHiColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.17)' : 'rgba(20,20,20,0.18)' }
  getKleinColor(): ResourceColor { return this.isDarkMode ? '#1055cc' : '#0047ab' }

  getCalendarDays(): number[] {
    const start = new Date(this.calDate.getFullYear(), this.calDate.getMonth(), 1)
    const end = new Date(this.calDate.getFullYear(), this.calDate.getMonth() + 1, 0)
    const startDay = start.getDay()
    const days: number[] = []
    let i = 0
    while (i < startDay) { days.push(0); i++ }
    let j = 1
    while (j <= end.getDate()) { days.push(j); j++ }
    return days
  }

  @Builder
  MiniCalendar() {
    Column() {
      Text('Mini Calendar').fontSize(10).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 8 })
      Text(`${this.calDate.getFullYear()}-${this.calDate.getMonth() + 1 < 10 ? '0' + (this.calDate.getMonth() + 1) : '' + (this.calDate.getMonth() + 1)}`)
        .fontSize(12).fontColor(this.getInkColor()).margin({ bottom: 8 })
      Grid() {
        ForEach(this.getCalendarDays(), (day: number) => {
          GridItem() {
            Text(day ? `${day}` : '')
              .fontSize(10)
              .fontColor(day === new Date().getDate() ? '#fff' : this.getInkColor())
              .textAlign(TextAlign.Center)
              .width('100%')
              .height('100%')
              .backgroundColor(day === new Date().getDate() ? this.getKleinColor() : Color.Transparent)
          }
        }, (day: number, index: number) => index.toString())
      }
      .columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr')
      .width('100%')
      .height(200)
    }
    .width('100%')
    .padding(16)
    .border({ width: 0.5, color: this.getBorderHiColor() })
    .margin({ bottom: 16 })
  }

  @Builder
  ExamTimeline() {
    Column() {
      Text('Exam Timeline · 考试时间轴').fontSize(10).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 8 })
      const upcoming = this.allSubjects.filter(s => s.examDate && DateUtil.daysUntil(s.examDate) !== null && DateUtil.daysUntil(s.examDate)! >= 0)
        .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
      if (upcoming.length === 0) {
        Text('暂无即将到来的考试').fontSize(9).fontColor(this.getInkDimColor()).padding(8)
      } else {
        ForEach(upcoming, (s: Subject) => {
          Row() {
            Text(s.name).fontSize(12).fontColor(this.getInkColor()).layoutWeight(1)
            Text(`${DateUtil.daysUntil(s.examDate)} days`).fontSize(9).fontColor(this.getKleinColor())
          }
          .width('100%')
          .padding(8)
          .border({ width: { bottom: 0.5 }, color: this.getBorderColor() })
        })
      }
    }
    .width('100%')
    .padding(16)
    .border({ width: 0.5, color: this.getBorderHiColor() })
    .margin({ bottom: 16 })
  }

  @Builder
  PlanColumns() {
    Column() {
      Row() {
        Button('月计划')
          .fontSize(9)
          .fontColor(this.planView === 'month' ? this.getKleinColor() : this.getInkDimColor())
          .backgroundColor(Color.Transparent)
          .border({ width: { bottom: this.planView === 'month' ? 1.5 : 0 }, color: this.getKleinColor() })
          .layoutWeight(1)
          .onClick(() => this.planView = 'month')
        Button('周计划')
          .fontSize(9)
          .fontColor(this.planView === 'week' ? this.getKleinColor() : this.getInkDimColor())
          .backgroundColor(Color.Transparent)
          .border({ width: { bottom: this.planView === 'week' ? 1.5 : 0 }, color: this.getKleinColor() })
          .layoutWeight(1)
          .onClick(() => this.planView = 'week')
        Button('今日')
          .fontSize(9)
          .fontColor(this.planView === 'day' ? this.getKleinColor() : this.getInkDimColor())
          .backgroundColor(Color.Transparent)
          .border({ width: { bottom: this.planView === 'day' ? 1.5 : 0 }, color: this.getKleinColor() })
          .layoutWeight(1)
          .onClick(() => this.planView = 'day')
      }
      .width('100%')
      .margin({ bottom: 12 })

      Row() {
        ForEach(['all', ...this.allSubjects.map(s => s.id)], (id: string) => {
          Button(id === 'all' ? 'All' : this.allSubjects.find(s => s.id === id)?.name || '')
            .fontSize(8)
            .fontColor(this.planFilterSubject === id ? '#fff' : this.getInkDimColor())
            .backgroundColor(this.planFilterSubject === id ? this.getInkColor() : Color.Transparent)
            .border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .margin({ right: 6 })
            .onClick(() => this.planFilterSubject = id)
        })
      }
      .width('100%')
      .margin({ bottom: 12 })

      if (this.planView === 'day') {
        Text(`Today · ${DateUtil.today()}`).fontSize(9).fontColor(this.getInkMidColor()).margin({ bottom: 8 })
        const todayTasks = this.tasks.filter(t => !t.done && t.due && t.due <= DateUtil.today())
        if (todayTasks.length === 0) {
          Text('No tasks for today').fontSize(10).fontColor(this.getInkDimColor())
        } else {
          ForEach(todayTasks, (t: Task) => {
            Text(t.text).fontSize(12).fontColor(this.getInkColor()).padding(4).width('100%')
          })
        }
      } else {
        Text('Plan view rendering is simplified').fontSize(10).fontColor(this.getInkDimColor()).padding(8)
      }
    }
    .width('100%')
    .padding(16)
    .border({ width: 0.5, color: this.getBorderHiColor() })
  }

  build() {
    Scroll() {
      Column() {
        Text('Planner · 规划').fontSize(10).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 12 })
        this.MiniCalendar()
        this.ExamTimeline()
        this.PlanColumns()
      }
      .padding(24)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
  }
}
