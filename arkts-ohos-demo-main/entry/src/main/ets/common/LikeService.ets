import { hilog } from '@kit.PerformanceAnalysisKit';

/**
 * 点赞服务类
 * 用于管理电影的点赞状态和点赞数
 */
export class LikeService {
  private static likedMovies: Set<string> = new Set<string>();
  private static likeCounts: Map<string, number> = new Map<string, number>();

  /**
   * 初始化点赞服务
   */
  static init(): void {
    // 从本地存储加载点赞状态
    // 这里使用模拟数据，实际项目中应该从持久化存储加载
    hilog.info(0x0000, '[LIKE_SERVICE]', '点赞服务初始化');
  }

  /**
   * 检查电影是否已点赞
   * @param movieId 电影ID
   * @returns 是否已点赞
   */
  static isLiked(movieId: string): boolean {
    return LikeService.likedMovies.has(movieId);
  }

  /**
   * 获取电影的点赞数
   * @param movieId 电影ID
   * @returns 点赞数
   */
  static getLikeCount(movieId: string): number {
    return LikeService.likeCounts.get(movieId) || 0;
  }

  /**
   * 切换点赞状态
   * @param movieId 电影ID
   * @returns 新的点赞状态
   */
  static toggleLike(movieId: string): boolean {
    const isLiked = LikeService.isLiked(movieId);
    let newLikeCount = LikeService.getLikeCount(movieId);
    
    if (isLiked) {
      // 取消点赞
      LikeService.likedMovies.delete(movieId);
      newLikeCount = Math.max(0, newLikeCount - 1);
      hilog.info(0x0000, '[LIKE_SERVICE]', '取消点赞电影: %{public}s', movieId);
    } else {
      // 点赞
      LikeService.likedMovies.add(movieId);
      newLikeCount += 1;
      hilog.info(0x0000, '[LIKE_SERVICE]', '点赞电影: %{public}s', movieId);
    }
    
    LikeService.likeCounts.set(movieId, newLikeCount);
    
    // 保存到本地存储
    LikeService.saveToStorage();
    
    return !isLiked;
  }

  /**
   * 设置点赞数
   * @param movieId 电影ID
   * @param count 点赞数
   */
  static setLikeCount(movieId: string, count: number): void {
    LikeService.likeCounts.set(movieId, count);
    hilog.info(0x0000, '[LIKE_SERVICE]', '设置电影点赞数: %{public}s = %{public}d', movieId, count);
  }

  /**
   * 获取所有已点赞的电影ID
   * @returns 已点赞的电影ID数组
   */
  static getLikedMovieIds(): string[] {
    return Array.from(LikeService.likedMovies);
  }

  /**
   * 清除所有点赞数据（用于测试）
   */
  static clearAll(): void {
    LikeService.likedMovies.clear();
    LikeService.likeCounts.clear();
    hilog.info(0x0000, '[LIKE_SERVICE]', '清除所有点赞数据');
  }

  /**
   * 保存点赞数据到本地存储
   */
  private static saveToStorage(): void {
    // 实际项目中应该使用持久化存储，这里只是模拟
    const likedMoviesArray = Array.from(LikeService.likedMovies);
    hilog.debug(0x0000, '[LIKE_SERVICE]', '保存点赞数据，已点赞电影数: %{public}d', likedMoviesArray.length);
    
    // 这里可以添加实际的数据持久化逻辑，例如使用@ohos.data.preferences
    // 示例：
    // const preferences = await dataPreferences.getPreferences(this.context, 'movie_likes');
    // await preferences.put('liked_movies', JSON.stringify(likedMoviesArray));
    // await preferences.put('like_counts', JSON.stringify(Array.from(LikeService.likeCounts.entries())));
  }

  /**
   * 从本地存储加载点赞数据
   */
  private static async loadFromStorage(): Promise<void> {
    // 实际项目中应该从持久化存储加载，这里只是模拟
    hilog.debug(0x0000, '[LIKE_SERVICE]', '从存储加载点赞数据');
    
    // 这里可以添加实际的数据加载逻辑，例如使用@ohos.data.preferences
    // 示例：
    // try {
    //   const preferences = await dataPreferences.getPreferences(this.context, 'movie_likes');
    //   const likedMoviesJson = await preferences.get('liked_movies', '[]');
    //   const likeCountsJson = await preferences.get('like_counts', '{}');
    //   
    //   const likedMoviesArray = JSON.parse(likedMoviesJson);
    //   const likeCountsObj = JSON.parse(likeCountsJson);
    //   
    //   LikeService.likedMovies = new Set(likedMoviesArray);
    //   LikeService.likeCounts = new Map(Object.entries(likeCountsObj));
    // } catch (error) {
    //   hilog.error(0x0000, '[LIKE_SERVICE]', '加载点赞数据失败: %{public}s', error.message);
    // }
  }
}