import { Task } from '../../models/Task'
import { StorageService } from '../../services/StorageService'
import { DateUtil } from '../../utils/DateUtil'
import { UIDUtil } from '../../utils/UIDUtil'
import { Subject } from '../../models/Subject'

@Component
export struct TasksTab {
  @Prop subject: Subject
  @Prop isDarkMode: boolean
  @State tasks: Task[] = []
  @State newTaskText: string = ''
  @State newTaskDate: string = ''
  @State newTaskPriority: string = 'normal'

  aboutToAppear() {
    this.loadTasks()
  }

  loadTasks() {
    this.tasks = StorageService.load(`tasks_${this.subject.id}`, []) as Task[]
  }

  saveTasks() {
    StorageService.save(`tasks_${this.subject.id}`, this.tasks)
  }

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

  getTaskGroups() {
    let groups: Record<string, Task[]> = { today: [], tomorrow: [], later: [], done: [] }
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

  getBgColor(): ResourceColor { return this.isDarkMode ? '#0a0a0a' : '#F8FAFC' }
  getInkColor(): ResourceColor { return this.isDarkMode ? '#f0f0ee' : '#0e0e0e' }
  getInkMidColor(): ResourceColor { return this.isDarkMode ? '#9a9a96' : '#3a3a3a' }
  getInkDimColor(): ResourceColor { return this.isDarkMode ? '#505050' : '#888' }
  getBorderColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(20,20,20,0.08)' }
  getBorderHiColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.17)' : 'rgba(20,20,20,0.18)' }
  getKleinColor(): ResourceColor { return this.isDarkMode ? '#1055cc' : '#0047ab' }
  getRedColor(): ResourceColor { return '#b03030' }

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

  build() {
    Scroll() {
      Column() {
        Text('Tasks · 任务').fontSize(10).fontColor(this.getInkDimColor()).letterSpacing(2).margin({ bottom: 12 })

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
}
