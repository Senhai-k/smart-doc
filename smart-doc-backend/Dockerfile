# 后端 Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖（PaddleOCR 需要）
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 安装 Python 依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制源码
COPY . .

# 暴露端口
EXPOSE 5000

# Production WSGI server. Use python run.py only for local development.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "run:app"]
