#!/usr/bin/env bash
# ------------------------------------------------------------------
# 本地预览 PIKAQIANG'DOC（docsify v5）
# 仅使用 Python 自带的 http.server，无需 Node / npm。
# 用法:
#   ./serve.sh          # 默认 3000 端口
#   ./serve.sh 8080     # 指定端口
# ------------------------------------------------------------------
set -e
cd "$(dirname "$0")"
PORT="${1:-3000}"

echo "Docsify 文档已启动: http://localhost:${PORT}"
echo "按 Ctrl+C 停止服务"
echo

python3 -m http.server "$PORT"
