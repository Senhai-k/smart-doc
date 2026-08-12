# 智档馆前端

基于 React 19、TypeScript 6、Ant Design 6 和 Vite 8 的智能文档分析前端。

## 开发

建议使用 Node.js 24。

```bash
npm install
npm run dev
```

开发服务器默认运行于 <http://localhost:5173>。

## 环境变量

复制 `.env.example` 为 `.env`。独立连接本地后端时使用：

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Docker/Nginx 部署使用默认的 `/api` 反向代理。

## 质量检查

```bash
npm run lint
npm run build
```

详细部署和后端说明见[项目根 README](../README.md)。
