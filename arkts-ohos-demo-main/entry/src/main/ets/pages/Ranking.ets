import { MovieShowingResponse, SubjectCollectionItem, Rating } from '../typings/MovieShowing';
import { router } from '@kit.ArkUI';
import { Request } from '../common/Index';
import { Copyright } from '../components/Copyright';
import { MovieImage } from '../components/MovieImage';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { LikeService } from '../common/LikeService';

@Entry
@Component
struct Ranking {
  @State boxOfficeItems: SubjectCollectionItem[] = [];
  @State ratingItems: SubjectCollectionItem[] = [];
  @State currentTabIndex: number = 0;

  aboutToAppear() {
    hilog.info(0x0000, '[RANKING]', '开始加载排行榜数据');
    // 初始化点赞服务
    LikeService.init();
    this.loadBoxOfficeRanking();
    this.loadRatingRanking();
  }

  private loadBoxOfficeRanking() {
    // 模拟票房排行榜数据
    Request.get<MovieShowingResponse>(`/subject_collection/movie_showing/items?start=NaN&count=20`)
      .then((result: MovieShowingResponse) => {
        // 为模拟数据添加票房信息
        const itemsWithBoxOffice = result.subject_collection_items.map((item, index) => {
          // 模拟票房数据：根据索引生成不同的票房值
          const boxOffice = 10000 + (20 - index) * 5000; // 从10000万元递减
          // 获取点赞状态
          const liked = LikeService.isLiked(item.id);
          const likeCount = LikeService.getLikeCount(item.id);
          // 手动创建新对象，复制所有属性
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
            boxOffice: boxOffice, // 添加票房字段
            liked: liked, // 添加点赞状态
            likeCount: likeCount // 添加点赞数
          };
          return newItem;
        });
        
        // 按票房降序排序
        this.boxOfficeItems = itemsWithBoxOffice.sort((a, b) => {
          const boxOfficeA = a.boxOffice || 0;
          const boxOfficeB = b.boxOffice || 0;
          return boxOfficeB - boxOfficeA;
        });
        
        hilog.info(0x0000, '[RANKING]', '票房排行榜数据加载成功，数量: %{public}d', this.boxOfficeItems.length);
      })
      .catch((error: Error) => {
        hilog.error(0x0000, '[RANKING]', '票房排行榜数据加载失败: %{public}s', error.message);
      });
  }

  private loadRatingRanking() {
    // 模拟评分排行榜数据
    Request.get<MovieShowingResponse>(`/subject_collection/movie_showing/items?start=NaN&count=20`)
      .then((result: MovieShowingResponse) => {
        // 为每个电影项设置点赞状态
        const itemsWithLikes = result.subject_collection_items.map((item) => {
          const liked = LikeService.isLiked(item.id);
          const likeCount = LikeService.getLikeCount(item.id);
          // 手动创建新对象，复制所有属性
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
        
        // 按评分降序排序
        this.ratingItems = itemsWithLikes.sort((a, b) => {
          const ratingA = a.rating?.value || 0;
          const ratingB = b.rating?.value || 0;
          return ratingB - ratingA;
        });
        
        hilog.info(0x0000, '[RANKING]', '评分排行榜数据加载成功，数量: %{public}d', this.ratingItems.length);
      })
      .catch((error: Error) => {
        hilog.error(0x0000, '[RANKING]', '评分排行榜数据加载失败: %{public}s', error.message);
      });
  }

  private formatBoxOffice(boxOffice: number | undefined): string {
    if (!boxOffice) return '暂无票房数据';
    if (boxOffice >= 10000) {
      return `${(boxOffice / 10000).toFixed(1)}亿元`;
    }
    return `${boxOffice.toFixed(0)}万元`;
  }

  private formatRating(rating: Rating | undefined): string {
    if (!rating || !rating.value) return '暂无评分';
    return rating.value.toFixed(1);
  }

  private handleLikeClick(item: SubjectCollectionItem, index: number, isBoxOfficeList: boolean) {
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
    
    if (isBoxOfficeList) {
      this.boxOfficeItems[index] = updatedItem;
      this.boxOfficeItems = [...this.boxOfficeItems];
    } else {
      this.ratingItems[index] = updatedItem;
      this.ratingItems = [...this.ratingItems];
    }
    
    hilog.info(0x0000, '[RANKING]', '电影点赞状态更新: %{public}s, 点赞: %{public}s, 点赞数: %{public}d', 
      item.title, newLiked ? '是' : '否', newLikeCount);
  }

  build() {
    Column() {
      // 标题
      Text('电影排行榜')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 10 })
        .width('100%')
        .textAlign(TextAlign.Center)

      // 标签页切换
      Row() {
        Button('票房排行榜', { type: ButtonType.Capsule })
          .fontSize(16)
          .fontColor(this.currentTabIndex === 0 ? Color.White : Color.Black)
          .backgroundColor(this.currentTabIndex === 0 ? Color.Blue : Color.Gray)
          .width('50%')
          .height(40)
          .onClick(() => {
            this.currentTabIndex = 0;
          })

        Button('评分排行榜', { type: ButtonType.Capsule })
          .fontSize(16)
          .fontColor(this.currentTabIndex === 1 ? Color.White : Color.Black)
          .backgroundColor(this.currentTabIndex === 1 ? Color.Blue : Color.Gray)
          .width('50%')
          .height(40)
          .onClick(() => {
            this.currentTabIndex = 1;
          })
      }
      .width('100%')
      .margin({ bottom: 10 })

      // 内容区域
      if (this.currentTabIndex === 0) {
        // 票房排行榜
        this.buildBoxOfficeRanking()
      } else {
        // 评分排行榜
        this.buildRatingRanking()
      }

      // 版权信息
      Copyright()
      Blank().height(20)
    }
    .width('100%')
    .height('100%')
    .padding(10)
    .backgroundColor('#F5F5F5')
  }

  @Builder
  buildBoxOfficeRanking() {
    Column() {
      Text('票房排行榜')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .margin({ top: 10, bottom: 10 })
        .width('100%')
        .textAlign(TextAlign.Center)

      if (this.boxOfficeItems.length === 0) {
        Column() {
          LoadingProgress()
            .width(50)
            .height(50)
          Text('加载中...')
            .fontSize(14)
            .fontColor(Color.Gray)
            .margin({ top: 10 })
        }
        .width('100%')
        .height(200)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.boxOfficeItems, (item: SubjectCollectionItem, index: number) => {
              this.buildMovieItem(item, index, true)
            })
          }
          .width('100%')
          .padding(10)
        }
        .scrollBar(BarState.Off)
        .height('100%')
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  buildRatingRanking() {
    Column() {
      Text('评分排行榜')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .margin({ top: 10, bottom: 10 })
        .width('100%')
        .textAlign(TextAlign.Center)

      if (this.ratingItems.length === 0) {
        Column() {
          LoadingProgress()
            .width(50)
            .height(50)
          Text('加载中...')
            .fontSize(14)
            .fontColor(Color.Gray)
            .margin({ top: 10 })
        }
        .width('100%')
        .height(200)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.ratingItems, (item: SubjectCollectionItem, index: number) => {
              this.buildMovieItem(item, index, false)
            })
          }
          .width('100%')
          .padding(10)
        }
        .scrollBar(BarState.Off)
        .height('100%')
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  buildMovieItem(item: SubjectCollectionItem, index: number, showBoxOffice: boolean) {
    Column() {
      Row() {
        // 排名序号
        Text(`${index + 1}`)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.Blue)
          .width(40)
          .textAlign(TextAlign.Center)

        // 电影图片
        MovieImage({ 
          imageUrl: item.cover?.url || '',
          imageWidth: 70,
          imageHeight: 100,
          imageBorderRadius: 4,
          showLoading: true
        })
        Blank().width(10)

        Column({ space: 6 }) {
          Row() {
            Text(`${item.title}`)
              .fontWeight(FontWeight.Bold)
              .fontSize(16)
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .flexShrink(1)
            Blank().width(2)
            Text(`(${item.year})`)
              .fontColor(Color.Gray)
              .fontSize(12)
          }
          .width('100%')
          .justifyContent(FlexAlign.Start)

          // 评分显示
          if (item.rating?.value) {
            Row() {
              Text('评分:')
                .fontSize(12)
                .fontColor(Color.Gray)
              Blank().width(4)
              Text(this.formatRating(item.rating))
                .fontSize(14)
                .fontColor(Color.Red)
                .fontWeight(FontWeight.Bold)
              Blank().width(4)
              Text(`(${item.rating?.count || 0}人评价)`)
                .fontSize(12)
                .fontColor(Color.Gray)
            }
          }

          Text(`导演：${item.directors.join(" ")}`)
            .fontSize(12)
            .fontColor(Color.Gray)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })

          Text(`主演：${item.actors.join(" ")}`)
            .fontSize(12)
            .fontColor(Color.Gray)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })

          // 票房或评分排名信息
          if (showBoxOffice && item.boxOffice) {
            Text(`票房：${this.formatBoxOffice(item.boxOffice)}`)
              .fontSize(14)
              .fontColor(Color.Green)
              .fontWeight(FontWeight.Bold)
          } else if (!showBoxOffice && item.rating?.value) {
            Text(`评分：${this.formatRating(item.rating)}`)
              .fontSize(14)
              .fontColor(Color.Red)
              .fontWeight(FontWeight.Bold)
          }
          
          // 点赞按钮
          Row() {
            Button({
              type: ButtonType.Normal,
              stateEffect: true
            }) {
              Row() {
                Text(item.liked ? '♥' : '♡')
                  .fontSize(12)
                  .fontColor(item.liked ? Color.Red : Color.Gray)
                Blank().width(4)
                Text(`${item.likeCount || 0}`)
                  .fontSize(12)
                  .fontColor(item.liked ? Color.Red : Color.Gray)
              }
            }
            .width(70)
            .height(24)
            .backgroundColor(Color.Transparent)
            .borderRadius(12)
            .border({
              width: 1,
              color: item.liked ? Color.Red : Color.Gray
            })
            .onClick(() => {
              this.handleLikeClick(item, index, showBoxOffice);
            })
          }
          .width('100%')
          .justifyContent(FlexAlign.Start)
          .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)
        .flexShrink(1)
        .justifyContent(FlexAlign.SpaceBetween)
        .height(100)
      }
      .alignItems(VerticalAlign.Top)
      .width('100%')
      .padding({ top: 8, bottom: 8 })
    }
    .width('100%')
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 8 })
    .shadow({ radius: 4, color: Color.Gray, offsetX: 0, offsetY: 2 })
    .onClick(() => {
      router.pushUrl({
        url: 'pages/MovieDetail',
        params: {
          id: item.id
        }
      })
    })
  }
}