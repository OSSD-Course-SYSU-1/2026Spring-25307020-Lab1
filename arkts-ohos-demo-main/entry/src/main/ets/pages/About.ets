import { router } from '@kit.ArkUI';
import { Request } from '../common/Request';
import { Copyright } from '../components/Copyright';
import { AppInfo } from '../viewmodel/AppInfo';
import { BusinessError } from '@kit.BasicServicesKit';
import { common } from '@kit.AbilityKit';

@Entry
@Component
struct About {
  @State items: AppInfo[] = [];

  aboutToAppear(): void {
    Request.get<AppInfo[]>('https://ohos.nutpi.net/privacy/applinking/atomicdata.json').then((value: AppInfo[]) => {
      this.items = value;
    })
  }

  build() {
    RelativeContainer() {
      Column() {
        Row() {
          Image($r('app.media.ic_back')).width(24).height(24).margin({ left: 8, right: 16 }).onClick(() => {
            router.back()
          })
          Text('坚果派出品').fontWeight(FontWeight.Bold).fontSize(20)

        }.margin({ left: 16, top: 16 })
        .width('100%')
        .justifyContent(FlexAlign.Start)

        Blank().height(36)
        Column() {
          if (this.items.length == 0) {
            Image($r("app.media.blank")).width(126).height(88)
            Blank().height(24)
            Text('暂时没有记录').fontSize(14)
          }
          if (this.items.length > 0) {

            List({ space: 16 }) {
              ForEach(this.items, (item: AppInfo, index: number) => {
                ListItem() {
                  Row() {
                    Row() {
                      Image(item.logo).width(40)
                      Blank().width(10)
                      Column() {
                        Text(item.appName).fontWeight(FontWeight.Bold)
                        Blank().height(8)
                        Text(item.desc)
                          .maxLines(2)
                          .wordBreak(WordBreak.BREAK_WORD)
                          .ellipsisMode(EllipsisMode.END)
                          .fontColor(Color.Gray)
                          .fontSize(12)
                      }.alignItems(HorizontalAlign.Start)
                      .flexShrink(1)
                      .flexGrow(1)
                    }.width('85%')

                    Image($r('app.media.chevron_right'))
                      .width(6)
                      .padding(8)
                      .margin({ left: 40 })
                      .flexShrink(0)
                      .flexGrow(1)
                  }.justifyContent(FlexAlign.SpaceBetween)
                  .width('100%')
                }
                .padding(15)
                .backgroundColor(Color.White)
                .borderRadius(16)
                .onClick((event) => {
                  let context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
                  context.openLink(item.appLinking)
                    .then(() => {
                      console.info('openlink success.');
                    })
                    .catch((error: BusinessError) => {
                      console.error(`openlink failed. error:${JSON.stringify(error)}`);
                    });
                })
              })
            }.padding(10)

            Blank().height(20)
            Copyright()

          }
        }.alignItems(HorizontalAlign.Center)
        .justifyContent(FlexAlign.SpaceBetween)
        .padding(10)
        .flexGrow(1)

      }.height('100%').width('100%')
      .alignItems(HorizontalAlign.Center)

    }
    .expandSafeArea([SafeAreaType.SYSTEM])
    .height('100%')
    .backgroundColor($r('app.color.default_background'))
  }

  @Builder
  columChild() {
    Column() {
      Image($r('app.media.icon'))
    }
  }
}