# 智档馆：智能文档分析平台

[![CI](https://github.com/Senhai-k/smart-doc/actions/workflows/ci.yml/badge.svg)](https://github.com/Senhai-k/smart-doc/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Senhai-k/smart-doc/actions/workflows/codeql.yml/badge.svg)](https://github.com/Senhai-k/smart-doc/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

智档馆是一个面向文档处理流程的课程项目，提供 OCR、文本摘要、情感分析、关键词提取、翻译、批量会议文档处理、历史记录及用户管理功能。

## 界面预览

### 登录与注册

![智档馆登录界面](docs/images/login.png)

## 技术栈

- 前端：React 19、TypeScript 6、Ant Design 6、Vite 8、ECharts、Zustand
- 后端：Python 3.11、Flask 2.3、SQLAlchemy、JWT
- 数据与 AI：MySQL 8、PaddleOCR、DeepSeek API
- 工程化：Docker Compose、GitHub Actions、CodeQL、Dependabot

## 功能

- OCR 图片文字识别
- 摘要、情感分析、关键词和翻译
- PDF、Word、PPT、TXT 批量会议文档处理
- 使用趋势、历史记录和操作日志
- JWT 登录、用户和角色管理

## 快速开始

### Docker Compose

需要 Docker Desktop 或兼容的 Docker Compose 环境。

```bash
git clone https://github.com/Senhai-k/smart-doc.git
cd smart-doc
cp .env.example .env
docker compose up --build -d
```

启动后访问：

- Web：<http://localhost>
- 健康检查：<http://localhost:5000/api/health>

在 `.env` 中配置 `DEEPSEEK_API_KEY` 才能调用大模型功能。部署到公网前必须替换 `JWT_SECRET_KEY` 与 `SECRET_KEY`。

### 本地开发

后端：

```bash
cd smart-doc-backend
python -m venv venv
# Windows PowerShell: venv\Scripts\Activate.ps1
# macOS/Linux: source venv/bin/activate
python -m pip install -r requirements.txt
python run.py
```

前端：

```bash
cd smart-doc-frontend
npm install
# 独立开发时，在 .env 中设置 VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

## 测试与构建

```bash
cd smart-doc-backend
python -m pip install -r requirements-test.txt
python -m pip install pytest pytest-cov pytest-flask
python -m pytest -v
```

```bash
cd smart-doc-frontend
npm run lint
npm run build
```

GitHub Actions 会在向 `main` 提交或创建 Pull Request 时运行相同检查。

## 演示账号

数据库初始化脚本包含仅供本地演示的账号：`admin/admin123` 与 `test/test123`。这些不是生产凭据。部署到共享或公网环境前，应删除或修改这些账号并替换所有默认密钥。

## 项目结构

```text
smart-doc/
|-- .github/                 # CI、安全扫描和协作模板
|-- smart-doc-backend/       # Flask API、服务与测试
|-- smart-doc-frontend/      # React 前端
|-- smart-doc-database/      # MySQL 初始化脚本
|-- docker-compose.yml
`-- README.md
```

## 协作与安全

- 贡献说明：[CONTRIBUTING.md](CONTRIBUTING.md)
- 安全报告：[SECURITY.md](SECURITY.md)
- 开源许可：[MIT License](LICENSE)

请勿提交 `.env`、API Key、访问令牌、数据库密码、上传文件或真实用户数据。
