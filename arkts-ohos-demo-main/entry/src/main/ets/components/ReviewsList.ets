import { Request } from '../common/Index';
import { ReviewsResponse, Review } from '../viewmodel/Review';
import { hilog } from '@kit.PerformanceAnalysisKit';

/**
 * 电影评论列表组件
 */
@Component
export struct ReviewsList {
  @Prop itemId: string = '';
  @State private reviews: Review[] = [];
  @State private total: number = 0;
  @State private isLoading: boolean = true;
  @State private hasError: boolean = false;
  
  aboutToAppear() {
    this.loadReviews();
  }
  
  /**
   * 加载评论数据
   */
  private loadReviews() {
    if (!this.itemId) {
      hilog.warn(0x0000, '[REVIEWS]', '电影ID为空，无法加载评论');
      return;
    }
    
    this.isLoading = true;
    this.hasError = false;
    
    hilog.info(0x0000, '[REVIEWS]', '开始加载评论，电影ID: %{public}s', this.itemId);
    
    Request.get<ReviewsResponse>(`/subject/${this.itemId}/reviews?start=0&count=5`)
      .then((response: ReviewsResponse) => {
        this.reviews = response.reviews || [];
        this.total = response.total || 0;
        this.isLoading = false;
        hilog.info(0x0000, '[REVIEWS]', '评论加载成功，总数: %{public}d，当前: %{public}d', 
          this.total, this.reviews.length);
      })
      .catch((error: Error) => {
        this.isLoading = false;
        this.hasError = true;
        hilog.error(0x0000, '[REVIEWS]', '评论加载失败: %{public}s', error.message);
      });
  }
  
  /**
   * 格式化时间显示
   */
  private formatTime(timeStr: string): string {
    if (!timeStr) return '';
    
    try {
      // 格式: "2023-12-01 10:30:00"
      const date = new Date(timeStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else if (days < 30) {
        return `${days}天前`;
      } else {
        return timeStr.substring(0, 10); // 返回日期部分
      }
    } catch (error) {
      return timeStr.substring(0, 10);
    }
  }
  
  /**
   * 生成星星评分显示
   */
  private getStarText(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '☆';
    }
    stars += '☆'.repeat(emptyStars);
    
    return stars;
  }
  
  build() {
    Column({ space: 15 }) {
      // 标题栏
      Row() {
        Text('观影评价')
          .fontWeight(FontWeight.Bold)
          .fontSize(16)
        
        Blank()
        
        if (this.total > 0) {
          Text(`共${this.total}条`)
            .fontSize(12)
            .fontColor(Color.Gray)
        }
      }
      .width('100%')
      .padding({ left: 10, right: 10 })
      
      // 加载状态
      if (this.isLoading) {
        Row() {
          LoadingProgress()
            .width(24)
            .height(24)
          Text('加载中...')
            .fontSize(12)
            .fontColor(Color.Gray)
            .margin({ left: 8 })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding({ top: 20, bottom: 20 })
      }
      
      // 错误状态
      if (this.hasError) {
        Row() {
          Image($r('app.media.blank'))
            .width(20)
            .height(20)
            .fillColor(Color.Gray)
          Text('加载失败')
            .fontSize(12)
            .fontColor(Color.Gray)
            .margin({ left: 8 })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding({ top: 20, bottom: 20 })
      }
      
      // 评论列表
      if (!this.isLoading && !this.hasError && this.reviews.length > 0) {
        ForEach(this.reviews, (review: Review, index: number) => {
          Column({ space: 10 }) {
            // 评论头部：作者和评分
            Row() {
              // 作者头像
              if (review.author?.avatar) {
                Image(review.author.avatar)
                  .width(36)
                  .height(36)
                  .borderRadius(18)
                  .alt($r('app.media.blank'))
              } else {
                // 默认头像
                Column() {
                  Text(review.author?.name?.charAt(0) || '匿')
                    .fontSize(14)
                    .fontColor(Color.White)
                }
                .width(36)
                .height(36)
                .borderRadius(18)
                .backgroundColor('#4A90E2')
                .justifyContent(FlexAlign.Center)
              }
              
              Column({ space: 4 }) {
                // 作者名
                Text(review.author?.name || '匿名用户')
                  .fontSize(14)
                  .fontWeight(FontWeight.Medium)
                
                // 评分和时间
                Row() {
                  // 星星评分
                  Text(this.getStarText(review.rating?.value || 0))
                    .fontSize(12)
                    .fontColor('#F5A623')
                  
                  Blank().width(8)
                  
                  // 时间
                  Text(this.formatTime(review.created_at))
                    .fontSize(10)
                    .fontColor(Color.Gray)
                }
              }
              .alignItems(HorizontalAlign.Start)
              .margin({ left: 10 })
              .layoutWeight(1)
              
              // 有用数
              Column() {
                Row() {
                  Image($r('app.media.blank'))
                    .width(14)
                    .height(14)
                    .fillColor(Color.Gray)
                  Text(`${review.useful_count || 0}`)
                    .fontSize(10)
                    .fontColor(Color.Gray)
                    .margin({ left: 4 })
                }
              }
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)
            
            // 评论标题
            if (review.title) {
              Text(review.title)
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .width('100%')
            }
            
            // 评论摘要
            if (review.abstract) {
              Text(review.abstract)
                .fontSize(12)
                .fontColor('#666666')
                .maxLines(4)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .lineHeight(18)
                .width('100%')
            }
            
            // 分割线
            if (index < this.reviews.length - 1) {
              Divider()
                .color('#E0E0E0')
                .strokeWidth(0.5)
                .margin({ top: 5 })
            }
          }
          .width('100%')
          .padding({ left: 10, right: 10 })
        }, (review: Review) => review.id)
        
        // 查看更多提示
        if (this.total > this.reviews.length) {
          Row() {
            Text(`查看全部${this.total}条评价`)
              .fontSize(12)
              .fontColor('#4A90E2')
            
            Image($r('app.media.chevron_right'))
              .width(16)
              .height(16)
              .fillColor('#4A90E2')
          }
          .width('100%')
          .justifyContent(FlexAlign.Center)
          .padding({ top: 10, bottom: 10 })
        }
      }
      
      // 无评论状态
      if (!this.isLoading && !this.hasError && this.reviews.length === 0) {
        Column() {
          Image($r('app.media.blank'))
            .width(40)
            .height(40)
            .fillColor('#CCCCCC')
          
          Text('暂无评价')
            .fontSize(12)
            .fontColor(Color.Gray)
            .margin({ top: 8 })
        }
        .width('100%')
        .padding({ top: 20, bottom: 20 })
      }
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }
}
