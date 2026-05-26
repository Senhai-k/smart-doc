# 📜 智档馆 - 智能文档分析平台

> 一个以档案馆为隐喻、集成 OCR 与大模型的智能文档工作台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-green.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3-green.svg)](https://flask.palletsprojects.com/)

## 📖 项目简介

**智档馆**是一个面向文档工作流的智能处理平台，将 AI 能力封装为具体的档案事务（誊录、摘要、判词、索引、译作），帮助企业或个人从非结构化的文档中高效提取、整理和再利用信息。

### 核心特性

- 📄 **多格式原生支持**：直接上传 PDF、Word、PPT、TXT、图片，无需预转换
- 🤖 **双深度模型**：PaddleOCR（文字识别）+ DeepSeek 大模型（文本理解）
- 📊 **批量处理**：一次处理多个文件，自动提取结构化信息，一键导出 Excel/CSV
- 🔐 **完整权限体系**：馆员/馆长分级，JWT 认证，操作日志审计
- 🎨 **档案室风格 UI**：纸质暖色调，沉浸式档案工作体验

### 功能模块（14个）

| 类别 | 功能 | 说明 |
|------|------|------|
| 档案工作 | 案卷总览 | 数据仪表盘，统计使用趋势 |
| | 影像誊录 | OCR 图片文字识别 |
| | 批量案卷 | 多格式文档批量处理 |
| 智识工坊 | 摘要案卷 | AI 智能文本总结 |
| | 判词倾向 | 情感分析 |
| | 索引标签 | 关键词提取 |
| | 译作副本 | 多语言翻译 |
| 馆务管理 | 归档索引 | 历史记录查询 |
| | 馆员名录 | 用户管理 |
| | 值班日志 | 操作审计 |

---

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- Ant Design 5.x（档案室定制主题）
- Zustand（状态管理）
- ECharts（数据可视化）
- Vite（构建工具）

### 后端
- Flask 2.3（Python Web 框架）
- MySQL 8.0 + SQLAlchemy
- JWT（身份认证）
- PaddleOCR（文字识别）
- DeepSeek API（大语言模型）

---

## 📦 环境要求

| 软件 | 版本 |
|------|------|
| Python | 3.10+ |
| Node.js | 18+ |
| MySQL | 8.0 |

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Senhai-k/smart-doc.git
cd smart-doc
```

### 2. 后端部署

```bash
# 进入后端目录
cd smart-doc-backend

# 创建虚拟环境
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量（创建 .env 文件）
# 复制以下内容，填入你的配置
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=smart_doc
DEEPSEEK_API_KEY=your-deepseek-api-key

# 初始化数据库
mysql -u root -p < ../smart-doc-database/smart-doc-database.sql

# 启动后端
python run.py
```

### 3. 前端部署

```bash
# 新开终端，进入前端目录
cd smart-doc-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. 访问系统

打开浏览器访问 `http://localhost:5173`

默认测试账号：

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 管理员 |
| test | test123 | 普通用户 |

---

## 📁 项目结构

```
smart-doc/
├── smart-doc-backend/          # 后端项目
│   ├── app/
│   │   ├── api/                # API 接口
│   │   ├── services/           # 业务服务
│   │   ├── models.py           # 数据库模型
│   │   └── config.py           # 配置文件
│   ├── migrations/             # 数据库迁移
│   ├── requirements.txt        # Python 依赖
│   └── run.py                  # 启动入口
│
├── smart-doc-frontend/         # 前端项目
│   ├── src/
│   │   ├── api/                # API 调用封装
│   │   ├── components/         # 公共组件
│   │   ├── pages/              # 页面组件
│   │   ├── stores/             # 状态管理
│   │   └── styles/             # 全局样式
│   ├── package.json
│   └── vite.config.ts
│
└── smart-doc-database/         # 数据库脚本
    └── smart-doc-database.sql
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 📧 联系方式

项目作者：Senhai-k

项目链接：https://github.com/Senhai-k/smart-doc
