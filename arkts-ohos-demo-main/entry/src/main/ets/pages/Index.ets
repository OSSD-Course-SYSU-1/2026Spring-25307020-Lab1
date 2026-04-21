import { MovieShowingResponse, SubjectCollectionItem } from '../typings/MovieShowing';
import { router } from '@kit.ArkUI';
import { Request } from '../common/Index';
import { Copyright } from '../components/Copyright';
import { MovieImage } from '../components/MovieImage';
import { hilog } from '@kit.PerformanceAnalysisKit';

@Entry
@Component
struct Index {
  @State items: SubjectCollectionItem[] = [];

  build() {
    RelativeContainer() {
      Column() {
        Blank().height(20)
        Text('影院热映')
          .id('HelloWorld')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .alignRules({
            center: { anchor: '__container__', align: VerticalAlign.Center },
            middle: { anchor: '__container__', align: HorizontalAlign.Center }
          })

        Scroll() {
          Column() {
            Blank().height(40)
            List({ space: 16 }) {
              ForEach(this.items, (item: SubjectCollectionItem) => {
                ListItem() {
                  Column() {
                    Row() {
                      // 使用自定义图片组件，支持占位图和错误处理
                      MovieImage({ 
                        imageUrl: item.cover?.url || '',
                        imageWidth: 86,
                        imageHeight: 120,
                        imageBorderRadius: 4,
                        showLoading: true
                      })
                      Blank().width(10)
                      Column({ space: 10 }) {
                        Row() {
                          Text(`${item.title}`).fontWeight(FontWeight.Bold).fontSize(16)
                          Blank().width(2)
                          Text(`(${item.year})`).fontColor(Color.Gray)
                        }

                        Rating({ rating: item.rating?.star_count, indicator: true }).stars(5)

                        Text(`导演：${item.directors.join(" ")}`).fontSize(12)
                        Text(`主演：${item.actors.join(" ")}`).fontSize(12)

                        Text(item.card_subtitle)
                          .fontSize(12)
                          .fontColor(Color.Gray)
                          .maxLines(2)
                          .lineBreakStrategy(LineBreakStrategy.HIGH_QUALITY)
                      }
                      .alignItems(HorizontalAlign.Start)
                      .flexShrink(1)
                      .justifyContent(FlexAlign.SpaceBetween)
                      .height(120)
                      .padding({ top: 2, bottom: 4 })
                    }
                    .alignItems(VerticalAlign.Top)
                    .width('100%')
                  }

                }.onClick((event) => {
                  router.pushUrl({
                    url: 'pages/MovieDetail',
                    params: {
                      id: item.id
                    }
                  })
                })
              })
            }.scrollBar(BarState.Off)

            Blank().height(20)
            Copyright()
            Blank().height(40)
          }
        }.scrollBar(BarState.Off)

      }.padding(10)
      .flexGrow(1)

    }
  }

  aboutToAppear() {
    hilog.info(0x0000, '[INDEX]', '开始加载数据');
    Request.get<MovieShowingResponse>(`/subject_collection/movie_showing/items?start=NaN&count=20`)
      .then((result: MovieShowingResponse) => {
        hilog.info(0x0000, '[INDEX]', '数据加载成功，数量: %{public}d', result.subject_collection_items.length);
        this.items = result.subject_collection_items;
        // 打印第一个电影的封面URL用于调试
        if (this.items.length > 0) {
          hilog.info(0x0000, '[INDEX]', '第一个电影: %{public}s', this.items[0].title);
          hilog.info(0x0000, '[INDEX]', '封面URL: %{public}s', this.items[0].cover?.url || '无封面');
        }
      })
      .catch((error: Error) => {
        hilog.error(0x0000, '[INDEX]', '数据加载失败: %{public}s', error.message);
      });
  }
}