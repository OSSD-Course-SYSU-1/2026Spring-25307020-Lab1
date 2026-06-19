import hilog from '@ohos.hilog';

const TAG = 'Index';
const DOMAIN = 0xFF00;

@Entry
@Component
struct Index {
  aboutToAppear() {
    hilog.info(DOMAIN, TAG, '>>> Index aboutToAppear');
  }

  build() {
    Column() {
      Text('Hello').fontSize(30).fontColor('#000')
      Text('World').fontSize(20).fontColor('#00aa00')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#ff0000')
  }
}
