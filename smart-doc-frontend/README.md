# 🖥️ 智档馆 - 前端

> 智档馆智能文档分析平台的前端项目

## 技术栈

- **框架**：React 18 + TypeScript
- **UI 组件库**：Ant Design 5.x（档案室定制主题）
- **状态管理**：Zustand
- **数据可视化**：ECharts
- **构建工具**：Vite
- **HTTP 客户端**：Axios

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── api/          # API 调用封装
├── components/   # 公共组件（ErrorBoundary、LoadingOverlay 等）
├── layouts/      # 布局组件
├── pages/        # 页面组件
├── stores/       # Zustand 状态管理
├── styles/       # 全局样式 & Ant Design 主题定制
├── types/        # TypeScript 类型定义
└── utils/        # 工具函数
```

## 环境变量

创建 `.env` 文件（可选）：

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> 详细项目说明请参见 [根目录 README](../README.md)