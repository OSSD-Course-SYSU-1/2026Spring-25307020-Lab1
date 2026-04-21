import { Celebrities, Celebrity } from '../viewmodel/Celebrities';
import { Request } from '../common/Index';
import { MovieImage } from './MovieImage';

@Component
export struct CelebritiesList {
  @Prop itemId: string;
  @State items: Celebrity[] = [];

  aboutToAppear(): void {
    Request.get<Celebrities>(`/movie/${this.itemId}/celebrities`).then((result: Celebrities) => {
      this.items = result.directors.concat(result.actors)
    })
  }

  build() {

    Column({ space: 10 }) {
      Text('影人').fontWeight(FontWeight.Bold).padding({ left: 10 })

      List({ space: 5 }) {
        ForEach(this.items, (item: Celebrity, index: number) => {
          ListItem() {
            Column() {
              // 使用自定义图片组件
              MovieImage({ 
                imageUrl: item.avatar?.normal || '',
                imageWidth: 100,
                imageHeight: 150,
                imageBorderRadius: 4
              })
              Blank().height(10)
              Text(item.name).fontSize(12)
              Blank().height(5)
              Text(item.character)
                .fontColor(Color.Gray)
                .fontSize(12)
                .maxLines(3)
                .wordBreak(WordBreak.BREAK_ALL)
                .flexShrink(1)
            }.alignItems(HorizontalAlign.Start)
            .height(220)
            .width(100)
          }.margin({ left: index == 0 ? 10 : 0 })
        })
      }.listDirection(Axis.Horizontal)
      .scrollBar(BarState.Off)
    }.alignItems(HorizontalAlign.Start)
  }
}