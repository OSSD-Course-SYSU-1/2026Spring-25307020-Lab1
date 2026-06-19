# Focal Study System - HarmonyOS Edition

<div align="center">

![HarmonyOS](https://img.shields.io/badge/HarmonyOS-6.0.1-blue)
![ArkTS](https://img.shields.io/badge/ArkTS-Latest-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**一款基于 HarmonyOS 的智能学习管理系统**

[功能特性](#功能特性) • [快速开始](#快速开始) • [项目结构](#项目结构) • [技术栈](#技术栈)

</div>

---

## 📖 项目简介

Focal Study System 是一款专为 HarmonyOS 平台设计的智能学习管理应用，集成了番茄工作法、AI 辅助学习、间隔重复记忆系统（SRS）等功能，帮助用户高效管理学习时间和提升学习效果。

## ✨ 功能特性

### 🎯 核心功能

- **番茄工作法 (Pomodoro)**
  - 可自定义番茄钟时长和休息时间
  - 统计学习时长和完成情况
  - 支持长休息和短休息模式

- **任务管理 (Task Management)**
  - 创建、编辑、删除学习任务
  - 任务分类和标签管理
  - 任务进度跟踪

- **智能笔记 (Smart Notes)**
  - Markdown 格式支持
  - 笔记分类管理
  - 快速搜索功能

- **闪卡记忆 (Flash Cards)**
  - 基于间隔重复算法（SRS）
  - 自定义卡片组
  - 学习进度统计

### 🤖 AI 功能

- **AI 学习助手**
  - 智能问答
  - 学习建议生成
  - 内容摘要提取

### 📊 数据管理

- 本地数据持久化存储
- 跨设备数据同步（分布式能力）
- 数据导入导出

## 🚀 快速开始

### 环境要求

- DevEco Studio 5.0 或更高版本
- HarmonyOS SDK 6.0.1(21) 或更高版本
- Node.js 14.x 或更高版本

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/arkts_focal.git
cd arkts_focal
```

2. **打开项目**
   - 使用 DevEco Studio 打开项目目录
   - 等待项目初始化和依赖下载完成

3. **配置签名**
   - 在 DevEco Studio 中配置应用签名
   - 参考 `build-profile.json5` 中的签名配置

4. **运行应用**
   - 连接 HarmonyOS 设备或启动模拟器
   - 点击运行按钮安装应用

## 📁 项目结构

```
arkts_focal/
├── AppScope/                 # 应用全局资源
│   └── resources/           # 全局资源配置
├── entry/                   # 主模块
│   └── src/main/
│       ├── ets/             # ArkTS 源代码
│       │   ├── entryability/  # 应用入口
│       │   ├── models/        # 数据模型
│       │   │   ├── AIConfig.ets
│       │   │   ├── AISession.ets
│       │   │   ├── FlashCard.ets
│       │   │   ├── Note.ets
│       │   │   ├── Subject.ets
│       │   │   └── Task.ets
│       │   ├── pages/        # 页面组件
│       │   │   ├── HomePage.ets
│       │   │   ├── SubjectPage.ets
│       │   │   └── subject/  # 子页面
│       │   ├── services/     # 业务服务
│       │   │   ├── AIService.ets
│       │   │   ├── SRSService.ets
│       │   │   └── StorageService.ets
│       │   └── utils/        # 工具类
│       ├── resources/        # 资源文件
│       └── module.json5      # 模块配置
├── app.json5                # 应用配置
├── build-profile.json5      # 构建配置
└── oh-package.json5         # 依赖管理
```

## 🛠 技术栈

### 核心技术

- **HarmonyOS 6.0.1** - 华为鸿蒙操作系统
- **ArkTS** - HarmonyOS 应用开发语言
- **ArkUI** - HarmonyOS UI 框架

### 架构特点

- **MVVM 架构** - 清晰的视图与业务逻辑分离
- **响应式编程** - 基于 @State、@Prop、@Link 的状态管理
- **组件化开发** - 可复用的 UI 组件设计
- **分布式能力** - 支持跨设备协同

### 权限说明

应用需要以下权限：

- `ohos.permission.INTERNET` - 网络访问（AI 功能）
- `ohos.permission.DISTRIBUTED_DATASYNC` - 分布式数据同步

## 🎨 设计理念

- **简洁高效** - 遵循 HarmonyOS 设计语言，界面简洁直观
- **响应式布局** - 适配手机、平板、2合1设备
- **流畅体验** - 优化的动画和交互设计
- **无障碍支持** - 符合无障碍设计规范

## 📝 开发指南

### 代码规范

- 遵循 ArkTS 编码规范
- 使用 ES Module 模块化
- 组件命名采用 PascalCase
- 文件命名采用 PascalCase.ets

### 状态管理

```typescript
@State private count: number = 0;        // 本地状态
@Prop private title: string;             // 单向传递
@Link private data: string;              // 双向绑定
@Provide private global: string;         // 跨组件共享
```

### 生命周期

```typescript
aboutToAppear() {
  // 组件即将出现
}

aboutToDisappear() {
  // 组件即将消失
}
```

## 🔧 配置说明

### AI 功能配置

在 `AIConfig.ets` 中配置 AI 服务参数：

```typescript
export class AIConfig {
  static readonly API_ENDPOINT: string = 'your-api-endpoint';
  static readonly API_KEY: string = 'your-api-key';
}
```

### SRS 参数配置

在 `SRSService.ets` 中可调整间隔重复算法参数：

- 最小间隔天数
- 简单卡片倍数
- 困难卡片倍数

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢华为 HarmonyOS 团队提供的优秀开发平台
- 感谢所有贡献者的付出

## 📞 联系方式

如有问题或建议，欢迎：

- 提交 Issue
- 发送邮件至：your.email@example.com

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star ⭐**

Made with ❤️ by Focal Team

</div>
