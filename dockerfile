# 构建
FROM node:krypton-trixie AS builder

# 设置工作目录
WORKDIR /opt/hachimi

# 复制项目文件
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

# 安装项目依赖
COPY . .
RUN pnpm run build

# 运行时
FROM node:krypton-trixie-slim

WORKDIR /opt/hachimi

COPY --from=builder /opt/hachimi/.output ./.output

CMD ["node", ".output/server/index.mjs"]