

         import { Subject } from '../../models/Subject'
import { PomodoroService } from '../../services/PomodoroService'
import { DateUtil } from '../../utils/DateUtil'

@Component
export struct PomodoroTab {
  @Prop subject: Subject
  @Prop isDarkMode: boolean
  @State pomoRunning: boolean = false
  @State pomoMode: string = 'focus'
  @State pomoRemaining: number = 25 * 60
  @State pomoTotal: number = 25 * 60
  @State pomoSessions: number = 0
  @State pomoDurations: Record<string, number> = { focus: 25, short: 5, long: 15 }
  @State pomoStats: Record<string, number> = {}
  @State customFocus: number = 25
  @State customShort: number = 5
  @State customLong: number = 15
  @State artMode: string = 'contour'

  private service: PomodoroService = PomodoroService.getInstance()

  aboutToAppear() {
    this.pomoStats = this.service.loadStats(this.subject.id)
    const saved = this.service.loadDurations()
    this.pomoDurations = saved
    this.customFocus = saved.focus
    this.customShort = saved.short
    this.customLong = saved.long
    this.resetTimer()
  }

  aboutToDisappear() {
    this.service.stop()
  }

  resetTimer() {
    this.service.stop()
    this.pomoRunning = false
    this.pomoRemaining = this.pomoDurations[this.pomoMode] * 60
    this.pomoTotal = this.pomoRemaining
  }

  toggleTimer() {
    if (this.pomoRunning) {
      this.service.stop()
      this.pomoRunning = false
    } else {
      this.pomoRunning = true
      this.service.start(this.pomoRemaining, (remaining) => {
        this.pomoRemaining = remaining
      }, () => {
        this.pomoRunning = false
        if (this.pomoMode === 'focus') {
          this.pomoSessions++
          this.service.recordSession(this.subject.id, this.pomoMode)
          this.pomoStats = this.service.loadStats(this.subject.id)
        }
      })
    }
  }

  setMode(mode: string) {
    this.pomoMode = mode
    this.resetTimer()
  }

  saveCustomDurations() {
    const dur = {
      focus: Math.max(1, Math.min(120, this.customFocus)),
      short: Math.max(1, Math.min(60, this.customShort)),
      long: Math.max(1, Math.min(120, this.customLong))
    }
    this.pomoDurations = dur
    this.service.saveDurations(dur)
    this.resetTimer()
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

  getBgColor(): ResourceColor { return this.isDarkMode ? '#0a0a0a' : '#F8FAFC' }
  getInkColor(): ResourceColor { return this.isDarkMode ? '#f0f0ee' : '#0e0e0e' }
  getInkMidColor(): ResourceColor { return this.isDarkMode ? '#9a9a96' : '#3a3a3a' }
  getInkDimColor(): ResourceColor { return this.isDarkMode ? '#505050' : '#888' }
  getBorderColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(20,20,20,0.08)' }
  getBorderHiColor(): ResourceColor { return this.isDarkMode ? 'rgba(255,255,255,0.17)' : 'rgba(20,20,20,0.18)' }
  getKleinColor(): ResourceColor { return this.isDarkMode ? '#1055cc' : '#0047ab' }

  build() {
    Scroll() {
      Column() {
        Column() {
          // 倒计时数字 - 在上方，纯白色
          Text(this.pomoDisplay)
            .fontSize(24).fontWeight(FontWeight.Bold).fontColor('#ffffff').letterSpacing(2).margin({ bottom: 12 })
          // 模式标签
          Text(this.pomoMode === 'focus' ? 'FOCUS · 专注' : this.pomoMode === 'short' ? 'SHORT BREAK · 短休息' : 'LONG BREAK · 长休息')
            .fontSize(12).fontWeight(FontWeight.Normal).fontColor('#ffffff').letterSpacing(4).margin({ bottom: 16 })

          Row() {
            ForEach([0, 1, 2, 3], (i: number) => {
              Text('')
                .width(6).height(6).border({ width: 0.5, color: 'rgba(255,255,255,0.4)' })
                .backgroundColor(this.pomoSessions % 4 > i ? 'rgba(255,255,255,0.9)' : Color.Transparent)
                .margin({ right: 4 })
            }, (i: number) => i.toString())
          }
          .margin({ bottom: 12 })

          Row() {
            Button('↺')
              .fontSize(14).width(40).height(40).fontColor('rgba(255,255,255,0.9)').backgroundColor('rgba(0,0,0,0.12)').border({ width: 0.5, color: 'rgba(255,255,255,0.3)' })
              .onClick(() => this.resetTimer())
            Button(this.pomoRunning ? '⏸' : '▶')
              .fontSize(16).width(48).height(48).fontColor('rgba(255,255,255,0.9)').backgroundColor('rgba(0,0,0,0.12)').border({ width: 0.5, color: 'rgba(255,255,255,0.5)' })
              .margin({ left: 10, right: 10 })
              .onClick(() => this.toggleTimer())
            Button('⏭')
              .fontSize(14).width(40).height(40).fontColor('rgba(255,255,255,0.9)').backgroundColor('rgba(0,0,0,0.12)').border({ width: 0.5, color: 'rgba(255,255,255,0.3)' })
              .onClick(() => { this.setMode(this.pomoMode === 'focus' ? 'short' : 'focus') })
          }
        }
        .width('100%').height(240).backgroundColor(this.getKleinColor()).justifyContent(FlexAlign.Center).margin({ bottom: 0 })

        Row() {
          Text('').width(`${this.pomoProgress * 100}%`).height('100%').backgroundColor(this.getKleinColor())
        }
        .width('100%').height(1).backgroundColor(this.getBorderColor())

        Row() {
          Button('专注 · Focus')
            .fontSize(9).fontColor(this.pomoMode === 'focus' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.pomoMode === 'focus' ? 1.5 : 0 }, color: this.getKleinColor() })
            .layoutWeight(1)
            .onClick(() => this.setMode('focus'))
          Button('短休息 · Short')
            .fontSize(9).fontColor(this.pomoMode === 'short' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.pomoMode === 'short' ? 1.5 : 0 }, color: this.getKleinColor() })
            .layoutWeight(1)
            .onClick(() => this.setMode('short'))
          Button('长休息 · Long')
            .fontSize(9).fontColor(this.pomoMode === 'long' ? this.getKleinColor() : this.getInkDimColor())
            .backgroundColor(Color.Transparent)
            .border({ width: { bottom: this.pomoMode === 'long' ? 1.5 : 0 }, color: this.getKleinColor() })
            .layoutWeight(1)
            .onClick(() => this.setMode('long'))
        }
        .width('100%').border({ width: { bottom: 0.5 }, color: this.getBorderHiColor() })

        Row() {
          Text('Focus').fontSize(8).fontColor(this.getInkDimColor()).margin({ right: 4 })
          TextInput({ text: this.customFocus.toString() }).width(50).fontSize(11).onChange((v) => this.customFocus = parseInt(v) || 0)
          Text('Short').fontSize(8).fontColor(this.getInkDimColor()).margin({ left: 8, right: 4 })
          TextInput({ text: this.customShort.toString() }).width(50).fontSize(11).onChange((v) => this.customShort = parseInt(v) || 0)
          Text('Long').fontSize(8).fontColor(this.getInkDimColor()).margin({ left: 8, right: 4 })
          TextInput({ text: this.customLong.toString() }).width(50).fontSize(11).onChange((v) => this.customLong = parseInt(v) || 0)
          Blank()
          Button('Save')
            .fontSize(9).fontColor(this.getInkDimColor()).backgroundColor(Color.Transparent).border({ width: 0.5, color: this.getBorderHiColor() })
            .padding({ left: 10, right: 10, top: 5, bottom: 5 })
            .onClick(() => this.saveCustomDurations())
        }
        .width('100%').padding(16).margin({ bottom: 16 })

        Grid() {
          GridItem() {
            Column() {
              Text('Today').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoTodaySessions}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getKleinColor()).letterSpacing(-2)
              Text('sessions').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() { Text('').width(`${Math.min(this.pomoTodaySessions * 25, 100)}%`).height('100%').backgroundColor(this.getKleinColor()) }
              .width('100%').height(1).backgroundColor(this.getBorderHiColor()).margin({ top: 8 })
            }
            .padding(14).backgroundColor(this.getBgColor()).width('100%').height('100%')
          }
          GridItem() {
            Column() {
              Text('Streak').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoStreak}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getInkColor()).letterSpacing(-2)
              Text('days').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() { Text('').width(`${Math.min(this.pomoStreak / 30 * 100, 100)}%`).height('100%').backgroundColor(this.getInkColor()) }
              .width('100%').height(1).backgroundColor(this.getBorderHiColor()).margin({ top: 8 })
            }
            .padding(14).backgroundColor(this.getBgColor()).width('100%').height('100%')
          }
          GridItem() {
            Column() {
              Text('Week Avg').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoWeekAvg}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getInkColor()).letterSpacing(-2)
              Text('min/day').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() { Text('').width(`${Math.min(this.pomoWeekAvg / 120 * 100, 100)}%`).height('100%').backgroundColor(this.getInkColor()) }
              .width('100%').height(1).backgroundColor(this.getBorderHiColor()).margin({ top: 8 })
            }
            .padding(14).backgroundColor(this.getBgColor()).width('100%').height('100%')
          }
          GridItem() {
            Column() {
              Text('Total').fontSize(8).fontColor(this.getInkDimColor()).letterSpacing(1).margin({ bottom: 6 })
              Text(`${this.pomoTotalSessions}`).fontSize(32).fontWeight(FontWeight.Lighter).fontColor(this.getInkColor()).letterSpacing(-2)
              Text('sessions').fontSize(8).fontColor(this.getInkDimColor()).margin({ top: 4 })
              Row() { Text('').width(`${Math.min(this.pomoTotalSessions / 50 * 100, 100)}%`).height('100%').backgroundColor(this.getInkColor()) }
              .width('100%').height(1).backgroundColor(this.getBorderHiColor()).margin({ top: 8 })
            }
            .padding(14).backgroundColor(this.getBgColor()).width('100%').height('100%')
          }
        }
        .columnsTemplate('1fr 1fr')
        .columnsGap(1).rowsGap(1).backgroundColor(this.getBorderColor()).padding(24).width('100%')
      }
      .width('100%')
    }
    .width('100%').height('100%').scrollBar(BarState.Off)
  }
}
