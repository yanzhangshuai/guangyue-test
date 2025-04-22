#!/bin/sh
set -e


# 调试信息：显示变量状态（非强制校验）
echo "=== ENV VARS ==="
echo "API_SERVER_NAME=${API_SERVER_NAME-(未设置)}"
echo "FILE_SERVER_NAME=${FILE_SERVER_NAME-(未设置)}"
# 仅警告而不退出
if [ -z "${API_SERVER_NAME}" ] || [ -z "${FILE_SERVER_NAME}" ]; then
    echo "WARN: API_SERVER_NAME or FILE_SERVER_NAME not set, using template defaults"
fi


normalize_url() {
  local url="${1}"
  local default="${2}"
  
  # 设置默认值
  url="${url:-$default}"
  
  # 移除尾部斜杠（兼容http://和https://）
  url="${url%/}"
  
  # 空协议检查（如果只传了域名如 example.com）
  if [[ "$url" != http://* && "$url" != https://* ]]; then
    url="http://${url}"
  fi
  
  echo "$url"
}

export API_SERVER_NAME=$(normalize_url "$API_SERVER_NAME" "http://fallback-api:8080")
export FILE_SERVER_NAME=$(normalize_url "$FILE_SERVER_NAME" "http://fallback-file:8080")

# 调试信息：显示标准化后的变量
echo "=== NORMALIZED ENV VARS ==="
echo "API_SERVER_NAME=${API_SERVER_NAME}"
echo "FILE_SERVER_NAME=${FILE_SERVER_NAME}"


# 多变量替换（白名单模式）
envsubst '${API_SERVER_NAME} ${FILE_SERVER_NAME}' < /etc/nginx/templates/http-servers.conf.template > /etc/nginx/conf.d/http-servers.conf

nginx -t
# 启动应用
exec "$@"
