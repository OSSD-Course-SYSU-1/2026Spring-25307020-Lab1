# 新增功能：电影点赞功能

## 功能概述

在原有的电影元服务应用中，新增了电影点赞功能。用户可以在电影列表页、电影详情页和排行榜页面为电影点赞，点赞状态和点赞数会在所有页面同步更新。

## 功能特性

1. **点赞/取消点赞**: 用户可以点击点赞按钮切换点赞状态
2. **点赞计数**: 显示每部电影的点赞数量
3. **状态持久化**: 点赞状态在内存中维护（可扩展为本地存储）
4. **跨页面同步**: 点赞状态在所有页面实时同步
5. **UI反馈**: 点赞按钮有视觉状态变化（红色实心心形表示已点赞，灰色空心心形表示未点赞）

## 实现文件

### 1. 新增文件

#### LikeService.ets (`entry/src/main/ets/common/LikeService.ets`)
点赞服务类，提供点赞状态管理功能：
- `isLiked(movieId: string): boolean` - 检查电影是否已点赞
- `getLikeCount(movieId: string): number` - 获取电影点赞数
- `toggleLike(movieId: string): boolean` - 切换点赞状态
- `setLikeCount(movieId: string, count: number): void` - 设置点赞数
- `getLikedMovieIds(): string[]` - 获取所有已点赞电影ID
- `clearAll(): void` - 清除所有点赞数据（测试用）

### 2. 修改的接口定义

#### Movie.ts (`entry/src/main/ets/typings/Movie.ts`)
在Movie接口中添加点赞相关字段：
```typescript
export interface Movie {
  // ... 原有字段
  liked?: boolean;      // 是否已点赞
  likeCount?: number;   // 点赞数
}
```

#### MovieShowing.ts (`entry/src/main/ets/typings/MovieShowing.ts`)
在SubjectCollectionItem接口中添加点赞相关字段：
```typescript
export interface SubjectCollectionItem {
  // ... 原有字段
  liked?: boolean;      // 是否已点赞
  likeCount?: number;   // 点赞数
}
```

### 3. 修改的视图模型

#### Movie.ets (`entry/src/main/ets/viewmodel/Movie.ets`)
在Movie类中添加点赞相关属性：
```typescript
export class Movie {
  // ... 原有属性
  liked: boolean = false;      // 是否已点赞
  likeCount: number = 0;       // 点赞数
}
```

### 4. 修改的页面组件

#### Index.ets (`entry/src/main/ets/pages/Index.ets`)
在电影列表项中添加点赞按钮：
- 在`buildMovieItem`方法中添加点赞按钮UI
- 实现`handleLikeClick`方法处理点赞点击事件
- 更新电影数据时包含点赞状态

#### MovieDetail.ets (`entry/src/main/ets/pages/MovieDetail.ets`)
在电影详情页添加点赞功能：
- 在电影标题下方添加点赞按钮
- 实现点赞状态切换逻辑
- 显示点赞数量

#### Ranking.ets (`entry/src/main/ets/pages/Ranking.ets`)
在排行榜页面添加点赞功能：
- 在票房排行榜和评分排行榜的每个电影项中添加点赞按钮
- 实现`handleLikeClick`方法
- 加载数据时初始化点赞状态

### 5. 修改的页面路由

#### main_pages.json (`entry/src/main/resources/base/profile/main_pages.json`)
添加排行榜页面路由：
```json
{
  "src": [
    "pages/Index",
    "pages/MovieDetail", 
    "pages/Album",
    "pages/About",
    "pages/Ranking"  // 新增页面
  ]
}
```

## 技术实现细节

### 数据结构设计

```typescript
// 点赞服务内部数据结构
private static likedMovies: Set<string> = new Set<string>();
private static likeCounts: Map<string, number> = new Map<string, number>();
```

### 状态管理

1. **内存存储**: 使用Set和Map在内存中维护点赞状态
2. **数据同步**: 通过LikeService单例确保数据一致性
3. **UI更新**: 使用@State装饰器触发UI重新渲染

### UI组件设计

点赞按钮组件特点：
- 使用Button组件实现
- 根据点赞状态显示不同图标（♥/♡）
- 点赞数实时更新
- 点击时有状态反馈

### 事件处理流程

```
用户点击点赞按钮
    ↓
调用 LikeService.toggleLike(movieId)
    ↓
更新内存中的点赞状态和计数
    ↓
触发UI重新渲染
    ↓
更新所有相关页面中的点赞状态
```

## 代码示例

### 点赞按钮实现

```typescript
// 点赞按钮组件
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
  this.handleLikeClick(item, index);
})
```

### 点赞状态更新

```typescript
private handleLikeClick(item: Movie, index: number) {
  const newLiked = LikeService.toggleLike(item.id);
  const newLikeCount = LikeService.getLikeCount(item.id);
  
  // 更新当前电影的点赞状态
  const updatedItem: Movie = {
    ...item,
    liked: newLiked,
    likeCount: newLikeCount
  };
  
  // 更新列表数据，触发UI重新渲染
  this.movieList[index] = updatedItem;
  this.movieList = [...this.movieList];
}
```

## 扩展性设计

### 持久化存储

当前实现使用内存存储，可以轻松扩展为本地持久化存储：

```typescript
// 使用@ohos.data.preferences进行数据持久化
import { dataPreferences } from '@kit.ArkData';

private static async saveToStorage(): Promise<void> {
  const preferences = await dataPreferences.getPreferences(this.context, 'movie_likes');
  const likedMoviesArray = Array.from(LikeService.likedMovies);
  const likeCountsObj = Object.fromEntries(LikeService.likeCounts);
  
  await preferences.put('liked_movies', JSON.stringify(likedMoviesArray));
  await preferences.put('like_counts', JSON.stringify(likeCountsObj));
  await preferences.flush();
}
```

### 服务器同步

可以扩展为与服务器同步点赞数据：

```typescript
static async syncWithServer(movieId: string, liked: boolean): Promise<void> {
  try {
    await Request.post('/api/movies/like', {
      movieId,
      liked,
      timestamp: new Date().getTime()
    });
  } catch (error) {
    hilog.error(0x0000, '[LIKE_SERVICE]', '同步点赞状态失败: %{public}s', error.message);
  }
}
```

## 测试方案

### 单元测试

1. **点赞服务测试**:
   - 测试点赞状态切换
   - 测试点赞计数
   - 测试数据一致性

2. **UI测试**:
   - 测试点赞按钮点击效果
   - 测试点赞状态显示
   - 测试跨页面同步

### 集成测试

1. **页面集成测试**:
   - 在Index页面点赞，检查MovieDetail页面状态
   - 在MovieDetail页面点赞，检查Ranking页面状态
   - 测试页面刷新后状态保持

## 性能考虑

1. **内存优化**: 使用Set和Map存储，查找效率O(1)
2. **渲染优化**: 使用@State局部更新，避免全量重新渲染
3. **数据同步**: 使用单例模式，避免数据不一致

## 用户体验

1. **即时反馈**: 点击按钮后立即更新UI
2. **状态可见**: 清晰显示点赞状态和数量
3. **操作简单**: 单次点击切换点赞状态
4. **一致性**: 所有页面保持相同的点赞状态

## 兼容性

### 设备兼容性
- 支持所有HarmonyOS设备（手机、平板）
- 适配不同屏幕尺寸

### 系统版本兼容性
- 支持HarmonyOS API 5.0.0及以上
- 使用标准ArkUI组件，无版本兼容问题

## 已知限制

1. **数据持久化**: 当前为内存存储，应用重启后数据丢失
2. **多用户**: 当前为单用户设计，不支持多用户点赞
3. **离线支持**: 当前需要网络连接获取电影数据，但点赞操作可离线进行

## 未来改进

1. **数据持久化**: 集成@ohos.data.preferences实现本地存储
2. **服务器同步**: 与后端API同步点赞数据
3. **用户认证**: 支持多用户点赞系统
4. **数据分析**: 收集点赞数据进行分析
5. **社交分享**: 集成社交分享功能
6. **动画效果**: 添加点赞动画效果

## 部署说明

### 构建要求
- DevEco Studio 4.0+
- HarmonyOS SDK 6.0.2+

### 构建步骤
1. 确保所有修改的文件已保存
2. 运行构建命令：`hvigorw assembleHap`
3. 安装到模拟器或真机测试

### 测试验证
1. 启动应用，浏览电影列表
2. 点击点赞按钮，观察状态变化
3. 进入电影详情页，验证点赞状态同步
4. 进入排行榜页面，验证点赞状态同步
5. 重新启动应用，验证点赞状态（当前为内存存储，重启后重置）

## 总结

电影点赞功能的添加增强了应用的交互性和用户参与度。通过统一的LikeService管理点赞状态，确保了数据的一致性和可维护性。该功能设计具有良好的扩展性，可以方便地添加持久化存储、服务器同步等高级功能。