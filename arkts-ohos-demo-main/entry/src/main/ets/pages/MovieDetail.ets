import { router } from '@kit.ArkUI';
import { Movie } from '../viewmodel/Movie';
import { CelebritiesList } from '../components/CelebritiesList';
import { Request } from '../common/Index';
import { PhotosList } from '../components/PhotosList';
import { RelativeList } from '../components/RelativeList';
import { ReviewsList } from '../components/ReviewsList';
import { IdRouterParams } from '../typings/IdRouterParams';
import { Copyright } from '../components/Copyright';
import { MovieImageLarge } from '../components/MovieImage';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { FreePlatformService } from '../common/FreePlatformService';
import { LikeService } from '../common/LikeService';

@Entry
@Component
struct MovieDetail {
  @State item: Movie = new Movie();
  private itemId: string = (router.getParams() as IdRouterParams).id;

  private getFreePlatforms(): string[] {
    // 使用免费播放源服务获取平台列表
    return FreePlatformService.getFreePlatforms(this.itemId);
  }

  aboutToAppear() {
    hilog.info(0x0000, '[MOVIE_DETAIL]', '加载电影详情，ID: %{public}s', this.itemId);
    // 初始化点赞服务
    LikeService.init();
    
    Request.get<Movie>(`/movie/${this.itemId}`)
      .then((value: Movie) => {
        // 设置点赞状态
        value.liked = LikeService.isLiked(this.itemId);
        value.likeCount = LikeService.getLikeCount(this.itemId);
        this.item = value;
        hilog.info(0x0000, '[MOVIE_DETAIL]', '电影标题: %{public}s', this.item.title);
        hilog.info(0x0000, '[MOVIE_DETAIL]', '封面URL: %{public}s', this.item.pic?.normal || '无封面');
        hilog.info(0x0000, '[MOVIE_DETAIL]', '点赞状态: %{public}s, 点赞数: %{public}d', 
          this.item.liked ? '已点赞' : '未点赞', this.item.likeCount);
      })
      .catch((error: Error) => {
        hilog.error(0x0000, '[MOVIE_DETAIL]', '加载失败: %{public}s', error.message);
      })
  }

  private handleLikeClick() {
    const newLiked = LikeService.toggleLike(this.itemId);
    const newLikeCount = LikeService.getLikeCount(this.itemId);
    
    // 更新当前电影的点赞状态
    this.item.liked = newLiked;
    this.item.likeCount = newLikeCount;
    
    hilog.info(0x0000, '[MOVIE_DETAIL]', '电影点赞状态更新: %{public}s, 点赞: %{public}s, 点赞数: %{public}d', 
      this.item.title, newLiked ? '是' : '否', newLikeCount);
  }

  build() {
    RelativeContainer() {
      Column({ space: 20 }) {
        Row() {
          Image($r('app.media.ic_back')).width(24).height(24).margin({ left: 8, right: 16 }).onClick(() => {
            router.back()
          })
        }.margin({ left: 16, top: 16 })
        .width('100%')
        .justifyContent(FlexAlign.Start)

        Scroll() {
          Column({ space: 20 }) {

            Column({ space: 20 }) {

              Column({ space: 10 }) {
                Row() {
                  Text(`${this.item.title}`).fontWeight(FontWeight.Bold).fontSize(20)
                  Blank().width(2)
                  Text(`(${this.item.year})`).fontColor(Color.Gray)
                }

                Row() {
                  Rating({ rating: this.item.rating?.star_count, indicator: true }).stars(5)
                  Blank().width(10)
                  Text(`${this.item.rating?.value}`).fontSize(14).fontColor(Color.Grey)
                  Blank().width(20)
                  
                  // 点赞按钮
                  Button({
                    type: ButtonType.Normal,
                    stateEffect: true
                  }) {
                    Row() {
                      Text(this.item.liked ? '♥' : '♡')
                        .fontSize(16)
                        .fontColor(this.item.liked ? Color.Red : Color.Gray)
                      Blank().width(4)
                      Text(`${this.item.likeCount || 0}`)
                        .fontSize(14)
                        .fontColor(this.item.liked ? Color.Red : Color.Gray)
                    }
                  }
                  .width(100)
                  .height(32)
                  .backgroundColor(Color.Transparent)
                  .borderRadius(16)
                  .border({
                    width: 1,
                    color: this.item.liked ? Color.Red : Color.Gray
                  })
                  .onClick(() => {
                    this.handleLikeClick();
                  })
                }

                Text(this.item.card_subtitle)
                  .fontSize(12)
                  .fontColor(Color.Gray)
                  .maxLines(2)
                  .lineBreakStrategy(LineBreakStrategy.HIGH_QUALITY)

              }.padding({ left: 10 })
              .alignItems(HorizontalAlign.Start)


              Row() {
                // 使用自定义图片组件，支持占位图和错误处理
                MovieImageLarge({ 
                  imageUrl: this.item.pic?.normal || '',
                  imageWidth: 106,
                  imageHeight: 150,
                  imageBorderRadius: 4,
                  showLoading: true
                })
                Blank().width(10)
                Column({ space: 10 }) {
                  Text(`导演：${this.item.directors.map(e => e.name).join(" ")}`).fontSize(12)

                  Text(`类型：${this.item.genres.join(" ")}`).fontSize(12)
                  Text(`地区：${this.item.countries.join(" ")}`).fontSize(12)

                  Text(`片长：${this.item.durations.join("/")}`).fontSize(12)
                  Text(`免费播放源：${this.getFreePlatforms().join('、')}`).fontSize(12)

                  if (this.item.aka.length > 0) {
                    Text(`又名：${this.item.aka.join("/")}`).fontSize(12)
                  }


                }.alignItems(HorizontalAlign.Start)
                .flexShrink(1)
              }.justifyContent(FlexAlign.SpaceBetween)
              .alignItems(VerticalAlign.Top)
              .width('100%')

              Text('简介').fontWeight(FontWeight.Bold)
              Text(this.item.intro)
                .fontSize(12)
                .fontColor(Color.Gray)
                .lineBreakStrategy(LineBreakStrategy.HIGH_QUALITY)
                .maxLines(7)
                .height(120)
            }.padding({ left: 10, right: 10 })
            .alignItems(HorizontalAlign.Start)

            CelebritiesList({ itemId: this.itemId })

            PhotosList({ itemId: this.itemId })

            RelativeList({ itemId: this.itemId })

            // 观影评价
            ReviewsList({ itemId: this.itemId })

            Blank().height(20)
            Copyright()
            Blank().height(40)

          }.alignItems(HorizontalAlign.Start)
        }
        .scrollBar(BarState.Off)

      }
    }

  }
}