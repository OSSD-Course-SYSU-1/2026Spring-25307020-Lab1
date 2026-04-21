import { router } from '@kit.ArkUI';
import { Request } from '../common/Request';
import { Photo, PhotoResponse } from '../viewmodel/Photos';
import { IdRouterParams } from '../typings/IdRouterParams';
import hilog from '@ohos.hilog';
import { DefaultMediaModel, MediaPreview, MediaPreviewOptions } from '@lyb/media-preview';
import { Copyright } from '../components/Copyright';

@Entry
@Component
struct Album {
  @State items: Photo[] = [];
  @State start: number = 1;
  @State index: number = -1
  options: MediaPreviewOptions = new MediaPreviewOptions()
  private itemId: string = (router.getParams() as IdRouterParams).id;

  aboutToAppear(): void {
    hilog.debug(0x0000, '[MOVIE_SHOWING][itemId]:%s', this.itemId)
    this.fetchData(1);
  }

  fetchData(start: number) {
    Request.get<PhotoResponse>(`movie/${this.itemId}/photos?start=${start}`)
      .then((value: PhotoResponse) => {
        // console.log(value.photos);
        hilog.debug(0x0000, '[MOVIE_SHOWING]%s', value.photos.toString())
        this.items = this.start == 1 ? value.photos : this.items.concat(value.photos);
        this.start = value.start + value.photos.length;
      })
  }

  getPreviewResources(): DefaultMediaModel[] {
    return this.items.map<DefaultMediaModel>(e => new DefaultMediaModel(e.image.large.url, e.image.normal.url))
  }

  build() {
    RelativeContainer() {
      Column() {
        Row() {
          Image($r('app.media.ic_back')).width(24).height(24).margin({ left: 8, right: 16 }).onClick(() => {
            router.back()
          })
          Text('剧照').fontWeight(FontWeight.Bold).fontSize(20)

        }.margin({ left: 16, top: 16 })
        .width('100%')
        .justifyContent(FlexAlign.Start)

        Blank().height(36)
        Scroll() {
          Column() {
            if (this.items.length == 0) {
              Image($r("app.media.blank")).width(126).height(88)
              Blank().height(24)
              Text('暂时没有记录').fontSize(14)
            }
            if (this.items.length > 0) {

              Grid() {
                ForEach(this.items, (item: Photo, index: number) => {
                  GridItem() {
                    Image(item.image.normal.url)
                      .width('100%')
                      .height(140)
                      .objectFit(ImageFit.Cover)
                      .clickEffect({ level: ClickEffectLevel.MIDDLE, scale: 1.1 })
                      .visibility(index == this.index ? Visibility.Hidden : Visibility.Visible)
                      .onClick((event) => {
                        this.options
                          .setInitIndex(index)
                          .setMedias(this.getPreviewResources())
                          .setIndicator(false)
                        MediaPreview.open(this.getUIContext(), this.options)
                      })
                  }
                })
              }
              .columnsTemplate('1fr 1fr 1fr')
              .columnsGap(2)
              .rowsGap(2)
              .scrollBar(BarState.Off)


              Blank().height(20)
              Copyright()
              Blank().height(40)

            }
          }.alignItems(HorizontalAlign.Center)
          .justifyContent(FlexAlign.Center)
          .padding(10)
          .flexGrow(1)
        }.scrollBar(BarState.Off)
        .onReachEnd(() => {
          this.fetchData(this.start);
        })

      }.height('100%').width('100%')
      .alignItems(HorizontalAlign.Center)

    }
    .expandSafeArea([SafeAreaType.SYSTEM])
    .height('100%')
  }
}