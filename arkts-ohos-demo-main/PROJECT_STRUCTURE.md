# HarmonyOS 电影应用项目结构

## 📁 项目根目录
```
arkts-ohos-demo-main/
├── 📄 build-profile.json5          # 构建配置文件
├── 📄 hvigorfile.ts               # 构建脚本
├── 📄 oh-package.json5            # 项目依赖配置
├── 📄 code-linter.json5           # 代码检查配置
├── 📄 README.md                   # 项目说明文档
│
├── 📂 AppScope/                   # 应用全局配置
│   ├── 📄 app.json5              # 应用配置（包名、版本等）
│   └── 📂 resources/             # 全局资源
│       └── 📂 base/
│           ├── 📂 element/       # 字符串资源
│           │   └── string.json
│           └── 📂 media/         # 媒体资源
│               └── icon.png      # 应用图标
│
├── 📂 entry/                      # 主模块（HAP）
│   ├── 📄 build-profile.json5    # 模块构建配置
│   ├── 📄 hvigorfile.ts         # 模块构建脚本
│   ├── 📄 oh-package.json5      # 模块依赖
│   ├── 📄 obfuscation-rules.txt # 代码混淆规则
│   ├── 📄 patch.json            # 补丁配置
│   │
│   └── 📂 src/main/              # 主源码目录
│       ├── 📄 module.json5       # 模块配置（权限、Ability等）
│       │
│       ├── 📂 ets/               # ArkTS源码
│       │   ├── 📂 common/        # 公共工具类
│       │   │   ├── Constants.ets    # 常量定义
│       │   │   ├── Request.ets      # 网络请求封装
│       │   │   └── Index.ets        # 导出文件
│       │   │
│       │   ├── 📂 components/     # 可复用组件
│       │   │   ├── CelebritiesList.ets  # 影人列表组件
│       │   │   ├── Copyright.ets        # 版权信息组件
│       │   │   ├── MovieImage.ets       # 电影图片组件（支持占位图）
│       │   │   ├── PhotosList.ets       # 预告/剧照列表组件
│       │   │   ├── RelativeList.ets     # 相关推荐组件
│       │   │   └── ReviewsList.ets      # 观影评价组件 ⭐新增
│       │   │
│       │   ├── 📂 pages/          # 页面
│       │   │   ├── Index.ets          # 首页（电影列表）
│       │   │   └── MovieDetail.ets    # 电影详情页
│       │   │
│       │   ├── 📂 viewmodel/      # 数据模型
│       │   │   ├── Celebrities.ets    # 影人数据模型
│       │   │   ├── Movie.ets          # 电影数据模型
│       │   │   ├── Photos.ets         # 剧照数据模型
│       │   │   ├── Relative.ets       # 相关推荐数据模型
│       │   │   └── Review.ets         # 评论数据模型 ⭐新增
│       │   │
│       │   ├── 📂 typings/        # 类型定义
│       │   │   ├── IdRouterParams.ets  # 路由参数类型
│       │   │   └── MovieShowing.ets    # 电影列表响应类型
│       │   │
│       │   └── 📂 entryability/   # 应用入口
│       │       ├── EntryAbility.ets      # 主Ability
│       │       └── EntryFormAbility.ets  # 卡片Ability
│       │
│       └── 📂 resources/          # 资源文件
│           └── 📂 base/
│               ├── 📂 element/    # 字符串资源
│               │   ├── color.json     # 颜色定义
│               │   └── string.json    # 字符串定义
│               │
│               └── 📂 media/      # 媒体资源
│                   ├── icon.png              # 默认图标
│                   ├── blank.png             # 空白图片
│                   ├── ic_back.png           # 返回图标
│                   ├── chevron_right.png     # 右箭头图标
│                   ├── movie_placeholder.svg      # 电影占位图（小）⭐新增
│                   └── movie_placeholder_large.svg # 电影占位图（大）⭐新增
│
├── 📂 .idea/                      # IDE配置
│   ├── 📄 modules.xml
│   ├── 📄 vcs.xml
│   └── 📂 .deveco/               # DevEco配置
│
├── 📂 .hvigor/                    # 构建缓存
│   ├── 📂 cache/                 # 缓存文件
│   ├── 📂 outputs/               # 构建输出
│   └── 📂 report/                # 构建报告
│
└── 📂 .screenshot/                # 截图目录
    ├── img-1.jpg
    ├── img-2.jpg
    ├── img-3.jpg
    ├── img-4.jpg
    └── img-5.jpg
```

## 🎯 核心目录说明

### 1. AppScope/ - 应用全局配置
- **app.json5**: 应用级配置
  - `bundleName`: 应用包名
  - `vendor`: 开发者信息
  - `versionCode/versionName`: 版本信息

### 2. entry/ - 主模块
#### 2.1 src/main/ets/ - ArkTS源码

**common/** - 公共工具类
- `Constants.ets`: API地址、常量定义
- `Request.ets`: HTTP请求封装（支持泛型）

**components/** - 可复用组件
- `MovieImage.ets`: 电影图片组件（支持占位图、错误处理）
- `CelebritiesList.ets`: 影人列表
- `PhotosList.ets`: 预告/剧照列表
- `RelativeList.ets`: 相关推荐列表
- `ReviewsList.ets`: 观影评价列表 ⭐新增
- `Copyright.ets`: 版权信息

**pages/** - 页面
- `Index.ets`: 首页（电影列表展示）
- `MovieDetail.ets`: 电影详情页

**viewmodel/** - 数据模型
- `Movie.ets`: 电影详情数据模型
- `Review.ets`: 评论数据模型 ⭐新增
- `Celebrities.ets`: 影人数据模型
- `Photos.ets`: 剧照数据模型
- `Relative.ets`: 相关推荐数据模型

**typings/** - 类型定义
- `MovieShowing.ets`: 电影列表响应类型
- `IdRouterParams.ets`: 路由参数类型

#### 2.2 src/main/resources/ - 资源文件

**media/** - 媒体资源
- `movie_placeholder.svg`: 电影占位图（小尺寸）
- `movie_placeholder_large.svg`: 电影占位图（大尺寸）
- `icon.png`, `blank.png`, `ic_back.png`, `chevron_right.png`

### 3. 配置文件说明

#### module.json5 - 模块配置
```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "abilities": [...],      // Ability配置
    "requestPermissions": [...] // 权限配置
  }
}
```

#### build-profile.json5 - 构建配置
```json5
{
  "app": {
    "signingConfigs": [...],
    "products": [...]
  },
  "modules": [...]
}
```

## 📊 项目架构

### 架构层次
```
┌─────────────────────────────────────┐
│           Pages (页面层)             │
│  Index.ets, MovieDetail.ets         │
├─────────────────────────────────────┤
│       Components (组件层)            │
│  MovieImage, ReviewsList, etc.      │
├─────────────────────────────────────┤
│       ViewModel (数据模型层)         │
│  Movie, Review, Celebrities, etc.   │
├─────────────────────────────────────┤
│        Common (工具层)               │
│  Request, Constants                 │
└─────────────────────────────────────┘
```

### 数据流向
```
API Server
    ↓
Request.ets (网络请求)
    ↓
ViewModel (数据模型)
    ↓
Components (组件展示)
    ↓
Pages (页面组合)
```

## 🔧 技术栈

- **语言**: ArkTS (TypeScript扩展)
- **框架**: ArkUI (声明式UI)
- **构建**: Hvigor
- **网络**: HTTP + Promise
- **路由**: @kit.ArkUI router
- **日志**: @kit.PerformanceAnalysisKit hilog

## 📱 功能模块

### 已实现功能
1. ✅ 电影列表展示
2. ✅ 电影详情页
3. ✅ 影人列表
4. ✅ 预告/剧照展示
5. ✅ 相关推荐
6. ✅ 观影评价 ⭐新增
7. ✅ 图片占位图 ⭐新增
8. ✅ 错误处理
9. ✅ 加载状态

### 待开发功能
- 🔲 评论详情页
- 🔲 用户登录
- 🔲 收藏功能
- 🔲 搜索功能
- 🔲 分享功能

## 📝 开发规范

### 命名规范
- **文件名**: PascalCase (如 `MovieDetail.ets`)
- **组件名**: PascalCase (如 `MovieDetail`)
- **变量名**: camelCase (如 `movieId`)
- **常量名**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

### 目录规范
- `pages/`: 页面组件（带@Entry装饰器）
- `components/`: 可复用组件（带@Component装饰器）
- `viewmodel/`: 数据模型类
- `common/`: 工具类和常量
- `typings/`: 类型定义

### 组件规范
- 使用 `@State` 管理内部状态
- 使用 `@Prop` 接收外部传入的只读数据
- 使用 `@Link` 实现双向数据绑定
- 统一使用 `hilog` 记录日志

## 🚀 快速开始

### 环境要求
- DevEco Studio 3.1+
- HarmonyOS SDK API 9+
- Node.js 14+

### 运行项目
1. 打开 DevEco Studio
2. 导入项目目录
3. 等待依赖同步
4. 点击运行按钮

### 构建命令
```bash
# 调试构建
hvigorw assembleHap

# 发布构建
hvigorw assembleHap -p product=default
```

## 📖 相关文档

- [PLACEHOLDER_IMAGE_UPDATE.md](./PLACEHOLDER_IMAGE_UPDATE.md) - 占位图功能说明
- [REVIEWS_FEATURE_UPDATE.md](./REVIEWS_FEATURE_UPDATE.md) - 观影评价功能说明
- [IMAGE_DIAGNOSIS_REPORT.md](./IMAGE_DIAGNOSIS_REPORT.md) - 图片诊断报告
- [README.md](./README.md) - 项目说明
