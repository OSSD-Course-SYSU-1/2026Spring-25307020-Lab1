import { router } from '@kit.ArkUI'
import { Subject } from '../models/Subject'
import { StorageService } from '../services/StorageService'
import { DateUtil } from '../utils/DateUtil'
import { Constants, ColorDef } from '../utils/Constants'
import { UIDUtil } from '../utils/UIDUtil'

@Entry
@Component
struct HomePage {
  @State subjects: Subject[] = []
  @State isDarkMode: boolean = false
  @State selectedColor: ColorDef = Constants.DEFAULT_COLORS[5]
  @State newSubjectName: string = ''
  @State newSubjectDate: string = ''
  @State showAddDialog: boolean = false

  aboutToAppear() {
    try {
      this.isDarkMode = StorageService.loadString('theme', 'light') === 'dark'
      this.loadSubjects()
    } catch (e) {
      console.error('HomePage init error:', e)
    }
  }

  loadSubjects(): void {
    try {
      this.subjects = StorageService.load('subjects', []) as Subject[]
    } catch (e) {
      this.subjects = []
    }
  }

  saveSubjects(): void {
    try {
      StorageService.save('subjects', this.subjects)
    } catch (e) {}
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode
    try {
      StorageService.save('theme', this.isDarkMode ? 'dark' : 'light')
    } catch (e) {}
  }

  confirmAddSubject(): void {
    if (!this.newSubjectName.trim()) return
    const subject = new Subject(
      UIDUtil.uid(),
      this.newSubjectName.trim(),
      this.selectedColor.hex,
      this.newSubjectDate || '',
      DateUtil.today()
    )
    this.subjects.push(subject)
    this.saveSubjects()
    this.newSubjectName = ''
    this.newSubjectDate = ''
    this.showAddDialog = false
  }

  deleteSubject(id: string): void {
    const newSubjects: Subject[] = []
    for (let i = 0; i < this.subjects.length; i++) {
      if (this.subjects[i].id !== id) {
        newSubjects.push(this.subjects[i])
      }
    }
    this.subjects = newSubjects
    this.saveSubjects()
  }

  getBgColor(): ResourceColor {
    return this.isDarkMode ? '#0a0a0a' : '#F8FAFC'
  }

  getInkColor(): ResourceColor {
    return this.isDarkMode ? '#f0f0ee' : '#0e0e0e'
  }

  getInkDimColor(): ResourceColor {
    return this.isDarkMode ? '#505050' : '#888'
  }

  getKleinColor(): ResourceColor {
    return this.isDarkMode ? '#1055cc' : '#0047ab'
  }

  getSurfaceColor(): ResourceColor {
    return this.isDarkMode ? 'rgba(20,20,20,0.7)' : 'rgba(255,255,255,0.5)'
  }

  build() {
    Column() {
      // Topbar
      Row() {
        Text('Focal').fontSize(18).fontColor(this.getInkColor())
        Blank()
        Button(this.isDarkMode ? 'LIGHT' : 'DARK')
          .fontSize(10)
          .fontColor(this.getInkDimColor())
          .backgroundColor(Color.Transparent)
          .onClick(() => this.toggleTheme())
      }
      .width('100%')
      .padding(12)

      // Title
      Text('Focal Study System')
        .fontSize(30)
        .fontColor(this.getKleinColor())
        .margin({ top: 20 })

      Text('v7.0 - ArkTS Edition')
        .fontSize(14)
        .fontColor(this.getInkDimColor())
        .margin({ top: 8 })

      // Add Button
      Button('+ Add Subject')
        .margin({ top: 20 })
        .fontColor('#ffffff')
        .backgroundColor(this.getKleinColor())
        .onClick(() => this.showAddDialog = true)

      // Subject List
      Column() {
        if (this.subjects.length === 0) {
          Text('No subjects yet').fontSize(14).fontColor(this.getInkDimColor()).margin({ top: 20 })
        } else {
          ForEach(this.subjects, (s: Subject, index: number) => {
            Row() {
              Text('').width(12).height(12).borderRadius(6).backgroundColor(s.color).margin({ right: 12 })
              Text(s.name).fontSize(14).fontColor(this.getInkColor()).layoutWeight(1)
              Button('Delete')
                .fontSize(10)
                .fontColor('#b03030')
                .backgroundColor(Color.Transparent)
                .onClick(() => this.deleteSubject(s.id))
            }
            .width('100%')
            .padding(12)
            .backgroundColor(this.getSurfaceColor())
            .margin({ top: 8 })
            .onClick(() => {
              router.pushUrl({
                url: 'pages/SubjectPage',
                params: { subjectId: s.id }
              })
            })
          }, (s: Subject) => s.id)
        }
      }
      .width('100%')
      .padding(24)
      .layoutWeight(1)

      // Add Dialog
      if (this.showAddDialog) {
        Column() {
          Column() {
            Text('Add New Subject').fontSize(18).fontColor(this.getInkColor()).margin({ bottom: 16 })
            TextInput({ text: this.newSubjectName, placeholder: 'Subject name' })
              .fontSize(16)
              .margin({ bottom: 8 })
              .onChange((value: string) => this.newSubjectName = value)

            TextInput({ text: this.newSubjectDate, placeholder: 'Exam date (YYYY-MM-DD)' })
              .fontSize(14)
              .margin({ bottom: 8 })
              .onChange((value: string) => this.newSubjectDate = value)

            Row() {
              ForEach(Constants.DEFAULT_COLORS, (c: ColorDef, idx: number) => {
                Text('')
                  .width(24)
                  .height(24)
                  .borderRadius(12)
                  .backgroundColor(c.hex)
                  .border({ width: this.selectedColor.name === c.name ? 2 : 0, color: '#000' })
                  .margin({ right: 8 })
                  .onClick(() => this.selectedColor = c)
              }, (c: ColorDef) => c.name)
            }
            .width('100%')
            .margin({ bottom: 16 })

            Row() {
              Button('Cancel')
                .onClick(() => this.showAddDialog = false)
              Button('Create')
                .fontColor('#ffffff')
                .backgroundColor(this.getKleinColor())
                .margin({ left: 8 })
                .onClick(() => this.confirmAddSubject())
            }
          }
          .padding(24)
          .backgroundColor('#ffffff')
          .border({ width: 1, color: '#cccccc' })
          .width('90%')
        }
        .width('100%')
        .height('100%')
        .backgroundColor('rgba(0,0,0,0.5)')
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(this.getBgColor())
  }
}
