# Contributing

感谢参与智档馆项目。提交变更前，请先搜索现有 Issue，避免重复工作。

## 本地检查

后端：

```bash
cd smart-doc-backend
python -m pip install -r requirements-test.txt
python -m pip install pytest pytest-cov pytest-flask
python -m pytest -v
```

前端：

```bash
cd smart-doc-frontend
npm install
npm run lint
npm run build
```

## Pull Request

- 一个 PR 只处理一个明确主题。
- 描述行为变化、验证方式和相关 Issue。
- UI 变更请附截图。
- 不要提交 `.env`、访问令牌、真实用户数据或上传文件。
