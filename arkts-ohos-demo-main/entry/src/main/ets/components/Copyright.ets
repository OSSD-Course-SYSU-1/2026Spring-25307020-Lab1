import { router } from '@kit.ArkUI'

@Component
export struct Copyright {
  build() {
    Row() {
      Image($r('app.media.nutpi')).width(32)
      Blank().width(8)
      Text('坚果派出品').fontWeight(FontWeight.Bold).fontColor(Color.Gray)
    }.justifyContent(FlexAlign.Center)
    .width('100%')
    .onClick((event) => {
      router.pushUrl({ url: 'pages/About' })
    })
  }
}