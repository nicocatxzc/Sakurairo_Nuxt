# 构建
FROM node:24.13.0-trixie AS builder

# 设置工作目录
WORKDIR /opt/hachimi

# 复制项目文件
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

# 安装项目依赖
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run build

# 运行时
FROM node:24.13.0-trixie-slim

WORKDIR /opt/hachimi

COPY --from=builder /opt/hachimi/.output ./.output

CMD ["node", ".output/server/index.mjs"]