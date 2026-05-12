# HarmonyOS ArkTS 电影元服务项目 - 工程文件描述

## 项目概述

这是一个基于HarmonyOS ArkTS开发的电影元服务应用，模仿豆瓣电影小程序。应用展示了影院热映电影、电影详情、海报浏览、排行榜等功能。

## 项目结构

```
arkts-ohos-demo-main/
├── AppScope/                    # 应用全局资源
│   ├── app.json5               # 应用配置
│   └── resources/              # 资源文件
│       └── base/
│           ├── element/        # 字符串资源
│           └── media/          # 图片资源
├── entry/                      # 主模块
│   ├── src/main/
│   │   ├── ets/               # ArkTS 源代码
│   │   │   ├── common/        # 公共工具类
│   │   │   ├── components/    # 自定义组件
│   │   │   ├── entryability/  # 应用入口能力
│   │   │   ├── entryformability/ # 服务卡片能力
│   │   │   ├── pages/         # 页面组件
│   │   │   ├── quickaction/   # 快捷操作
│   │   │   ├── typings/       # TypeScript 类型定义
│   │   │   └── viewmodel/     # 视图模型
│   │   ├── resources/         # 模块资源
│   │   └── module.json5       # 模块配置
│   ├── build-profile.json5    # 构建配置
│   └── oh-package.json5       # 依赖管理
├── EntryCard/                  # 服务卡片模块
├── hvigor/                    # 构建脚本
├── oh_modules/                # 依赖包
├── build-profile.json5        # 项目构建配置
├── hvigorfile.ts              # 构建任务配置
├── oh-package.json5           # 项目依赖配置
├── README.md                  # 项目说明文档
└── PROJECT_DESCRIPTION.md     # 本文件
```

## 配置文件详解

### 1. 应用级配置 (AppScope/app.json5)
```json5
{
  "app": {
    "bundleName": "com.atomicservice.studentarktsdemo2026",
    "bundleType": "atomicService",
    "vendor": "example",
    "versionCode": 1000000,
    "versionName": "1.0.0",
    "icon": "$media:icon",
    "label": "$string:app_name"
  }
}
```

### 2. 项目构建配置 (build-profile.json5)
- 定义了构建模式和产品配置
- 支持 debug 和 release 两种构建模式
- 目标SDK版本：6.0.2(22)
- 兼容SDK版本：5.0.0(12)

### 3. 模块配置 (entry/src/main/module.json5)
- 模块类型：entry（入口模块）
- 设备类型：phone、tablet
- 支持免安装特性
- 定义了两个能力：
  - EntryAbility：主应用能力
  - EntryFormAbility：服务卡片能力
- 请求网络权限：ohos.permission.INTERNET

### 4. 页面路由配置 (entry/src/main/resources/base/profile/main_pages.json)
```json
{
  "src": [
    "pages/Index",
    "pages/MovieDetail",
    "pages/Album",
    "pages/About",
    "pages/Ranking"
  ]
}
```

## 源代码文件说明

### 公共工具类 (common/)
- **Constants.ets**: 定义应用常量
- **Request.ets**: 网络请求封装，支持泛型
- **FreePlatformService.ets**: 免费播放平台服务
- **LikeService.ets**: 点赞服务（新增功能）
- **Index.ets**: 导出所有公共模块

### 页面组件 (pages/)
- **Index.ets**: 首页，展示电影列表
- **MovieDetail.ets**: 电影详情页
- **Album.ets**: 海报浏览页
- **About.ets**: 关于页面
- **Ranking.ets**: 排行榜页面（新增）

### 自定义组件 (components/)
- **CelebritiesList.ets**: 演职人员列表组件
- **Copyright.ets**: 版权声明组件
- **MovieImage.ets**: 电影图片组件
- **PhotosList.ets**: 照片列表组件
- **RelativeList.ets**: 相关电影列表组件
- **ReviewsList.ets**: 评论列表组件

### 类型定义 (typings/)
- **Movie.ts**: 电影数据类型定义
- **MovieShowing.ts**: 正在上映电影数据类型定义
- **IdRouterParams.ets**: 路由参数类型定义

### 视图模型 (viewmodel/)
- **AppInfo.ets**: 应用信息模型
- **Celebrities.ets**: 演职人员模型
- **Movie.ets**: 电影模型
- **Photos.ets**: 照片模型
- **Relative.ets**: 相关电影模型
- **Review.ets**: 评论模型

### 能力 (entryability/)
- **EntryAbility.ets**: 应用主能力，处理生命周期

### 服务卡片 (entryformability/)
- **EntryFormAbility.ets**: 服务卡片能力

### 快捷操作 (quickaction/)
- **QuickActionCard.ets**: 服务卡片页面

## 资源文件

### 字符串资源 (AppScope/resources/base/element/string.json)
包含应用中使用的所有文本字符串。

### 图片资源 (AppScope/resources/base/media/)
- icon.png: 应用图标

## 第三方依赖

### oh-package.json5
```json5
{
  "modelVersion": "6.0.2",
  "name": "entry",
  "version": "1.0.0",
  "dependencies": {
    "@lyb/media-preview": "^1.0.5"
  }
}
```

使用的外部库：
- **@lyb/media-preview**: 图片预览组件库，用于Album页面的图片幻灯片展示

## 构建系统

### hvigorfile.ts
定义构建任务和配置。

### 构建命令
- `hvigorw assembleHap`: 构建HAP包
- `hvigorw assembleApp`: 构建应用

## 开发环境
- HarmonyOS SDK: 6.0.2
- 开发语言: ArkTS (TypeScript)
- 构建工具: Hvigor
- 目标设备: 手机、平板

## 功能特性

### 核心功能
1. **电影列表展示**: 首页展示当前热映电影
2. **电影详情查看**: 点击电影进入详情页，包含演职人员、海报、相关推荐
3. **海报浏览**: 支持图片网格展示和幻灯片预览
4. **排行榜功能**: 票房排行榜和评分排行榜
5. **点赞功能**: 用户可以为电影点赞（新增功能）
6. **关于页面**: 应用信息展示

### 技术特性
- 使用ArkUI声明式UI框架
- 组件化开发，复用性高
- 使用ViewModel进行数据管理
- 支持服务卡片
- 支持免安装运行
- 响应式布局，适配手机和平板

## 数据流设计

### 数据获取
- 通过网络请求获取电影数据
- 使用Request类封装HTTP请求
- 数据类型通过TypeScript接口定义

### 状态管理
- 使用@State、@Prop、@Link装饰器
- 页面级状态管理
- 组件间数据传递

## 页面导航
- 使用router进行页面跳转
- 支持参数传递
- 页面路由在main_pages.json中配置

## 性能优化
- 图片懒加载
- 列表虚拟滚动
- 组件复用
- 内存管理优化

## 兼容性
- 支持HarmonyOS API 5.0.0及以上
- 适配手机和平板设备
- 支持浅色/深色主题

## 项目特点
1. **完整的元服务案例**: 展示了HarmonyOS元服务的完整开发流程
2. **良好的代码结构**: 模块化、组件化设计
3. **丰富的UI组件**: 使用了ArkUI的各种组件
4. **实际业务场景**: 电影信息展示的真实应用场景
5. **扩展性强**: 易于添加新功能和页面

## 运行要求
- DevEco Studio 4.0及以上
- HarmonyOS SDK 6.0.2
- 支持HarmonyOS的设备或模拟器

## 项目来源
原始项目来自Gitee: https://gitee.com/zacks/arkts-ohos-demo

## 注意事项
1. 需要开启元服务豁免管控：系统-开发者选项-开发中元服务豁免管控
2. 需要网络权限访问电影数据API
3. 服务卡片需要在form_config.json中配置