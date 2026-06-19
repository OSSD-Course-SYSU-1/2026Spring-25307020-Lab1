import { Context } from '@ohos.ability'

@Entry
@Component
struct TestPage {
  @State message: string = 'Hello ArkTS!'

  build() {
    Column() {
      Text(this.message)
        .fontSize(30)
        .fontColor('#0047ab')
        .margin({ top: 100 })
      
      Button('Click Me')
        .margin({ top: 20 })
        .onClick(() => this.message = 'Clicked!')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F8FAFC')
  }
}
