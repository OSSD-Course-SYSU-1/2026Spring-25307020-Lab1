import { Request } from '../common/Index';
import { Relative } from '../viewmodel/Relative';
import { router } from '@kit.ArkUI';
import { MovieImage } from './MovieImage';

@Component
export struct RelativeList {
  @Prop itemId: string;
  @State items: Relative[] = [];

  aboutToAppear(): void {
    Request.get<Relative[]>(`/movie/${this.itemId}/recommendations`).then((result: Relative[]) => {
      this.items = result;
    })
  }

  build() {

    Column({ space: 10 }) {
      Text('相关推荐').fontWeight(FontWeight.Bold).padding({ left: 10 })

      List({ space: 10 }) {
        ForEach(this.items, (item: Relative, index: number) => {
          ListItem() {
            Column() {
              // 使用自定义图片组件
              MovieImage({ 
                imageUrl: item.pic?.normal || '',
                imageWidth: 80,
                imageHeight: 120,
                imageBorderRadius: 4
              })
              Blank().height(10)
              Column() {
                Text(item.title)
                  .fontWeight(FontWeight.Bold)
                  .fontSize(12)
                  .wordBreak(WordBreak.BREAK_ALL)
                  .maxLines(2)
                Blank().height(5)
                Row() {
                  Rating({ rating: item.rating.star_count, indicator: true }).stars(5)
                  Text(`${item.rating.value}`).fontColor(Color.Gray).fontSize(12)
                }.justifyContent(FlexAlign.SpaceBetween)
                .flexGrow(1)
              }.justifyContent(FlexAlign.SpaceBetween)
              .height(60)
              .width(80)
            }.alignItems(HorizontalAlign.Start)
            .onClick((event) => {
              router.pushUrl({ url: 'pages/MovieDetail', params: { id: item.id } })
            })
          }.padding({ left: index == 0 ? 10 : 0 })
        })
      }.listDirection(Axis.Horizontal)
      .scrollBar(BarState.Off)
    }.alignItems(HorizontalAlign.Start)
  }
}