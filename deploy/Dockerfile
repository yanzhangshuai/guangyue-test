
# 阶段1: 基础配置
FROM node:22-slim AS base

ARG ALLOWED_PM=npm
ARG REGISTRY_URL=https://registry.npmjs.org/

WORKDIR /app

COPY package*.json .npmrc* ./
COPY pnpm-lock.yaml* yarn.lock* package-lock.json* ./ 

# 自动检包管理器类型 配置仓库
RUN sed -i "s/\"preinstall\": \".*\"/\"preinstall\": \"npx only-allow ${ALLOWED_PM}\"/" package.json && \
    echo "registry=${REGISTRY_URL}" > .npmrc && \
    [ -n "${NPM_AUTH}" ] && echo "//${REGISTRY_URL#*://}:_authToken=${NPM_AUTH}" >> .npmrc || true


# 阶段2: 安装阶段   
FROM base AS builder
COPY --from=base /app ./node_modules


# 根据 ALLOWED_PM 选择安装方式
RUN case "${ALLOWED_PM}" in \
    "pnpm") \
      [ -f "pnpm-lock.yaml" ] || { echo "Error: pnpm-lock.yaml not found"; exit 1; } && \
      npm install -g pnpm --registry=${REGISTRY_URL} && \
      pnpm install --frozen-lockfile --registry=${REGISTRY_URL} ;; \
    "yarn") \
      [ -f "yarn.lock" ] || { echo "Error: yarn.lock not found"; exit 1; } && \
      npm install -g yarn --registry=${REGISTRY_URL} && \
      yarn install --frozen-lockfile --registry=${REGISTRY_URL} ;; \
    *) \
      [ -f "package-lock.json" ] || { echo "Error: package-lock.json not found"; exit 1; } && \
      npm ci --registry=${REGISTRY_URL} ;; \
    esac


COPY . .
RUN ${ALLOWED_PM} run build:gz


# 阶段2: 生产阶段
FROM nginx:alpine-slim

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html

RUN mkdir -p /etc/nginx/templates /etc/nginx/conf.d

COPY ./deploy/nginx.conf /etc/nginx/nginx.conf
COPY ./deploy/templates /etc/nginx/templates/
COPY ./deploy/entrypoint.sh /


RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
