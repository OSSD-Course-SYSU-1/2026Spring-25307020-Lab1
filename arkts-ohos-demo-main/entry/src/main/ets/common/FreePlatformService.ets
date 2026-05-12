/**
 * 免费播放源服务
 * 提供电影免费播放平台信息
 */
export class FreePlatformService {
  /**
   * 根据电影ID获取免费播放平台列表
   * @param movieId 电影ID
   * @returns 平台名称数组
   */
  static getFreePlatforms(movieId: string): string[] {
    // 模拟数据，实际中可以从API获取
    // 这里可以根据电影ID返回不同的平台
    const platformMap: Record<string, string[]> = {
      '123': ['爱奇艺', '腾讯视频'],
      '456': ['优酷', '芒果TV'],
      '789': ['哔哩哔哩', '西瓜视频'],
    };

    return platformMap[movieId] || ['爱奇艺', '腾讯视频', '优酷'];
  }

  /**
   * 获取所有可用的免费平台
   */
  static getAllPlatforms(): string[] {
    return ['爱奇艺', '腾讯视频', '优酷', '芒果TV', '哔哩哔哩', '西瓜视频'];
  }
}