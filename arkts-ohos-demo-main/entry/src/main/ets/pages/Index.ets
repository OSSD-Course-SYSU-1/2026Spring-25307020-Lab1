import { MovieShowingResponse, SubjectCollectionItem } from '../typings/MovieShowing';
import { router } from '@kit.ArkUI';
import { Request } from '../common/Index';
import { Copyright } from '../components/Copyright';
import { MovieImage } from '../components/MovieImage';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { FreePlatformService } from '../common/FreePlatformService';
import { LikeService } from '../common/LikeService';

@Entry
@Component
struct Index {
  @State items: SubjectCollectionItem[] = [];

  private getFreePlatforms(item: SubjectCollectionItem): string[] {
    // 使用免费播放源服务获取平台列表
    return FreePlatformService.getFreePlatforms(item.id);
  }

  build() {
    RelativeContainer() {
      Column() {
        Blank().height(20)
        Row() {
          Text('影院热映')
            .id('HelloWorld')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .flexShrink(1)

          Blank().width(20)

          Button('排行榜', { type: ButtonType.Capsule })
            .fontSize(14)
            .fontColor(Color.White)
            .backgroundColor(Color.Blue)
            .width(80)
            .height(32)
            .onClick(() => {
              router.pushUrl({
                url: 'pages/Ranking'
              })
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .margin({ bottom: 10 })

        Scroll() {
          Column() {
            Blank().height(40)
            List({ space: 16 }) {
              ForEach(this.items, (item: SubjectCollectionItem, index: number) => {
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

                        Text(`免费播放源：${this.getFreePlatforms(item).join('、')}`)
                          .fontSize(12)
                          .fontColor(Color.Gray)
                          
                        // 点赞按钮
                        Row() {
                          Button({
                            type: ButtonType.Normal,
                            stateEffect: true
                          }) {
                            Row() {
                              Text(item.liked ? '♥' : '♡')
                                .fontSize(14)
                                .fontColor(item.liked ? Color.Red : Color.Gray)
                              Blank().width(4)
                              Text(`${item.likeCount || 0}`)
                                .fontSize(12)
                                .fontColor(item.liked ? Color.Red : Color.Gray)
                            }
                          }
                          .width(80)
                          .height(28)
                          .backgroundColor(Color.Transparent)
                          .borderRadius(14)
                          .border({
                            width: 1,
                            color: item.liked ? Color.Red : Color.Gray
                          })
                          .onClick(() => {
                            this.handleLikeClick(item, index);
                          })
                          
                          Blank().width(8)
                          
                          // 票房信息（如果有）
                          if (item.boxOffice) {
                            Text(`票房：${this.formatBoxOffice(item.boxOffice)}`)
                              .fontSize(12)
                              .fontColor(Color.Green)
                          }
                        }
                        .width('100%')
                        .justifyContent(FlexAlign.Start)
                        .alignItems(VerticalAlign.Center)
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
    // 初始化点赞服务
    LikeService.init();
    
    Request.get<MovieShowingResponse>(`/subject_collection/movie_showing/items?start=NaN&count=20`)
      .then((result: MovieShowingResponse) => {
        hilog.info(0x0000, '[INDEX]', '数据加载成功，数量: %{public}d', result.subject_collection_items.length);
        
        // 为每个电影项设置点赞状态
        const itemsWithLikes = result.subject_collection_items.map((item) => {
          const liked = LikeService.isLiked(item.id);
          const likeCount = LikeService.getLikeCount(item.id);
          // 手动复制所有属性
          const newItem: SubjectCollectionItem = {
            original_price: item.original_price,
            rating: item.rating,
            cover: item.cover,
            actions: item.actions,
            year: item.year,
            card_subtitle: item.card_subtitle,
            id: item.id,
            title: item.title,
            comments: item.comments,
            label: item.label,
            actors: item.actors,
            interest: item.interest,
            type: item.type,
            description: item.description,
            has_linewatch: item.has_linewatch,
            price: item.price,
            date: item.date,
            info: item.info,
            rating_data: item.rating_data,
            url: item.url,
            release_date: item.release_date,
            original_title: item.original_title,
            uri: item.uri,
            subtype: item.subtype,
            directors: item.directors,
            reviewer_name: item.reviewer_name,
            null_rating_reason: item.null_rating_reason,
            freePlatforms: item.freePlatforms,
            boxOffice: item.boxOffice,
            liked: liked,
            likeCount: likeCount
          };
          return newItem;
        });
        
        this.items = itemsWithLikes;
        
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

  private handleLikeClick(item: SubjectCollectionItem, index: number) {
    const newLiked = LikeService.toggleLike(item.id);
    const newLikeCount = LikeService.getLikeCount(item.id);
    
    // 更新当前电影的点赞状态
    const updatedItem: SubjectCollectionItem = {
      original_price: item.original_price,
      rating: item.rating,
      cover: item.cover,
      actions: item.actions,
      year: item.year,
      card_subtitle: item.card_subtitle,
      id: item.id,
      title: item.title,
      comments: item.comments,
      label: item.label,
      actors: item.actors,
      interest: item.interest,
      type: item.type,
      description: item.description,
      has_linewatch: item.has_linewatch,
      price: item.price,
      date: item.date,
      info: item.info,
      rating_data: item.rating_data,
      url: item.url,
      release_date: item.release_date,
      original_title: item.original_title,
      uri: item.uri,
      subtype: item.subtype,
      directors: item.directors,
      reviewer_name: item.reviewer_name,
      null_rating_reason: item.null_rating_reason,
      freePlatforms: item.freePlatforms,
      boxOffice: item.boxOffice,
      liked: newLiked,
      likeCount: newLikeCount
    };
    this.items[index] = updatedItem;
    
    // 强制刷新UI
    this.items = [...this.items];
    
    hilog.info(0x0000, '[INDEX]', '电影点赞状态更新: %{public}s, 点赞: %{public}s, 点赞数: %{public}d', 
      item.title, newLiked ? '是' : '否', newLikeCount);
  }

  private formatBoxOffice(boxOffice: number | undefined): string {
    if (!boxOffice) return '暂无票房数据';
    if (boxOffice >= 10000) {
      return `${(boxOffice / 10000).toFixed(1)}亿元`;
    }
    return `${boxOffice.toFixed(0)}万元`;
  }
}