@Entry
@Component
struct SimplePage {
  @State message: string = 'Hello World'

  build() {
    Column() {
      Text('SIMPLE PAGE')
        .fontSize(40)
        .fontColor('#000000')
        .backgroundColor('#ffff00')
        .margin({ top: 100 })

      Text('This should be visible')
        .fontSize(20)
        .fontColor('#000000')
        .backgroundColor('#00ff00')
        .margin({ top: 20 })

      Button('Click')
        .margin({ top: 30 })
        .onClick(() => this.message = 'Clicked')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#ff0000')
  }
}
