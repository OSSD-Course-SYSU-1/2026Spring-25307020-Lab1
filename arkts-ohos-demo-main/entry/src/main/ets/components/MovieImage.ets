import { hilog } from '@kit.PerformanceAnalysisKit';

/**
 * 电影封面图片组件
 * 支持占位图、错误处理和加载状态显示
 */
@Component
export struct MovieImage {
  // 图片URL
  @Prop imageUrl: string = '';
  // 图片宽度
  @Prop imageWidth: number = 86;
  // 图片高度
  @Prop imageHeight: number = 120;
  // 圆角半径
  @Prop imageBorderRadius: number = 4;
  // 是否显示加载状态
  @Prop showLoading: boolean = false;
  
  // 内部状态
  @State private isLoading: boolean = true;
  @State private hasError: boolean = false;
  
  build() {
    Stack() {
      // 占位图（加载中或加载失败时显示）
      if (this.isLoading || this.hasError || !this.imageUrl) {
        Image($r('app.media.movie_placeholder'))
          .width(this.imageWidth)
          .height(this.imageHeight)
          .borderRadius(this.imageBorderRadius)
          .objectFit(ImageFit.Cover)
        
        // 加载状态指示器
        if (this.showLoading && this.isLoading && this.imageUrl) {
          LoadingProgress()
            .width(30)
            .height(30)
            .color(Color.White)
        }
        
        // 错误提示图标
        if (this.hasError) {
          Column() {
            Image($r('app.media.blank'))
              .width(24)
              .height(24)
              .fillColor(Color.Gray)
            Text('加载失败')
              .fontSize(10)
              .fontColor(Color.Gray)
              .margin({ top: 4 })
          }
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        }
      }
      
      // 实际图片
      if (this.imageUrl) {
        Image(this.imageUrl)
          .width(this.imageWidth)
          .height(this.imageHeight)
          .borderRadius(this.imageBorderRadius)
          .objectFit(ImageFit.Cover)
          .visibility(this.isLoading || this.hasError ? Visibility.None : Visibility.Visible)
          .onComplete(() => {
            this.isLoading = false;
            this.hasError = false;
            hilog.info(0x0000, '[MOVIE_IMAGE]', '图片加载成功: %{public}s', this.imageUrl);
          })
          .onError(() => {
            this.isLoading = false;
            this.hasError = true;
            hilog.error(0x0000, '[MOVIE_IMAGE]', '图片加载失败: %{public}s', this.imageUrl);
          })
      }
    }
    .width(this.imageWidth)
    .height(this.imageHeight)
  }
}

/**
 * 大尺寸电影封面图片组件（用于详情页）
 */
@Component
export struct MovieImageLarge {
  @Prop imageUrl: string = '';
  @Prop imageWidth: number = 106;
  @Prop imageHeight: number = 150;
  @Prop imageBorderRadius: number = 4;
  @Prop showLoading: boolean = false;
  
  @State private isLoading: boolean = true;
  @State private hasError: boolean = false;
  
  build() {
    Stack() {
      // 占位图
      if (this.isLoading || this.hasError || !this.imageUrl) {
        Image($r('app.media.movie_placeholder_large'))
          .width(this.imageWidth)
          .height(this.imageHeight)
          .borderRadius(this.imageBorderRadius)
          .objectFit(ImageFit.Cover)
        
        if (this.showLoading && this.isLoading && this.imageUrl) {
          LoadingProgress()
            .width(30)
            .height(30)
            .color(Color.White)
        }
        
        if (this.hasError) {
          Column() {
            Image($r('app.media.blank'))
              .width(24)
              .height(24)
              .fillColor(Color.Gray)
            Text('加载失败')
              .fontSize(10)
              .fontColor(Color.Gray)
              .margin({ top: 4 })
          }
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        }
      }
      
      // 实际图片
      if (this.imageUrl) {
        Image(this.imageUrl)
          .width(this.imageWidth)
          .height(this.imageHeight)
          .borderRadius(this.imageBorderRadius)
          .objectFit(ImageFit.Cover)
          .visibility(this.isLoading || this.hasError ? Visibility.None : Visibility.Visible)
          .onComplete(() => {
            this.isLoading = false;
            this.hasError = false;
            hilog.info(0x0000, '[MOVIE_IMAGE_LARGE]', '图片加载成功: %{public}s', this.imageUrl);
          })
          .onError(() => {
            this.isLoading = false;
            this.hasError = true;
            hilog.error(0x0000, '[MOVIE_IMAGE_LARGE]', '图片加载失败: %{public}s', this.imageUrl);
          })
      }
    }
    .width(this.imageWidth)
    .height(this.imageHeight)
  }
}
