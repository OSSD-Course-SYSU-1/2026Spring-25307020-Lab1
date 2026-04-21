import { Request } from '../common/Index';
import { Photo, PhotoResponse } from '../viewmodel/Photos';
import { router } from '@kit.ArkUI';
import { MovieImage } from './MovieImage';

@Component
export struct PhotosList {
  @Prop itemId: string;
  @State total: number = 0;
  @State items: Photo[] = [];

  aboutToAppear(): void {
    Request.get<PhotoResponse>(`/movie/${this.itemId}/photos`).then((result: PhotoResponse) => {
      this.items = result.photos;
      this.total = result.total;
    })
  }

  build() {

    Column({ space: 10 }) {
      Row() {
        Text('预告/剧照').fontWeight(FontWeight.Bold)
        Row() {
          Text(`全部 ${this.total}`).fontColor(Color.Gray).fontSize(12)
          Blank().width(8)
          Image($r('app.media.chevron_right')).width(10)
        }.onClick((event) => {
          router.pushUrl({ url: 'pages/Album', params: { id: this.itemId } })
        })
      }.justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
      .padding({ left: 10, right: 10 })

      List({ space: 10 }) {
        ForEach(this.items, (item: Photo, index: number) => {
          ListItem() {
            Column() {
              // 使用自定义图片组件
              MovieImage({ 
                imageUrl: item.image?.normal?.url || '',
                imageWidth: 200,
                imageHeight: 120,
                imageBorderRadius: 4
              })
              Blank().height(10)
            }.alignItems(HorizontalAlign.Start)
          }.padding({ left: index == 0 ? 10 : 0 })
        })
      }.listDirection(Axis.Horizontal)
      .scrollBar(BarState.Off)
      .height(140)
    }

  }
}