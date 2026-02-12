# Hachimi headless WordPress theme

基于[WordPress Theme Sakurairo](https://github.com/mirai-mamori/Sakurairo)的样式重构的Nuxt headless WordPress主题

## 功能

目前主题外观已基本和Sakurairo对齐，且额外实现了大量性能相关工作，不过仍然有部分原版支持功能未实现:

额外功能：

- 全站webp性能优化
- 全站CSR性能优化
- 简洁风文章卡片

未实现的功能：

- WordPress前端功能插件
- 带前端脚本的古腾堡区块
- 说说文章类型支持
- 纪念模式
- 导航岛样式
- WP小组件
- 更多的前台背景
- 3.0新版的页尾
- 页尾负载占用查询
- 页尾音乐播放器
- 页尾一言
- 评论和页面搜索
- 预加载动画
- 封面开关/下拉箭头/半屏/动画
- 封面信息栏多样式
- 封面滤镜/切换/视频
- 首页区域标题图标
- 展示区胶囊
- 文章字数和预计阅读时间
- 文章Sakura/Github样式
- 页面动画
- 文章拓展区
- 友链多样式和申请表
- Steam游戏库
- 评论区图床
- Vcaptcha验证码支持
- 评论区邮件通知
- 定制登录和后台
- 所有的AI功能
- Github卡片
- Gravatar代理

## 如何使用

你需要为你的WordPress安装并启用以下两个插件才能正常使用本主题:

- [hachimi_rest](https://github.com/nicocatxzc/hachimi_rest)
- [WPGraphQL](https://github.com/wp-graphql/wp-graphql)

### 方法1

使用仓库中的`docker-compose.yml`编排模板，填上其中的后端连接信息环境变量，然后启动编排，创建反代服务器代理至8886接口即可（如果你没有改编排模板中的网络信息）

### 方法2

编辑项目中的.env.example,将其中的配置项改为你的WordPress连接信息,并保存为.env
或者随后在你的运行环境添加以下变量,其中对应的值换成你自己的站点连接信息,管理员名称,以及管理员的应用程序密码:

```env
NUXT_WORDPRESS_URL="https://your.wordpress.site/"
NUXT_WORDPRESS_USER_NAME="administrator"
NUXT_WORDPRESS_AUTH_TOKEN="yourAdminToken"
```

你可以在WordPress后台的编辑个人资料页面的底部找到应用程序密码设置,你可以在这里创建一个应用程序密码

然后使用`pnpm run build`，在构建完成后将`.output`目录中的内容上传至你的服务器,然后在目录下使用`cd server&&node index.mjs`来启动应用程序

如果遇到图片无法正常加载的情况,请在server目录下运行`pnpm install sharp`来安装正确的二进制模块,然后重新启动应用程序

你可以添加`PORT`环境变量来指定监听端口

应用程序启动完成后放行其监听端口,为其创建正确的反代服务器即可正常使用

## 使用相关

第一次使用请使用你的wordpress管理员账户登录应用并初始化主题设置

在后台的`外观——导航栏`中你可以看到插件自行创建或分配的导航栏，你可以编辑菜单来修改导航栏的内容（最大两层），
如果你没有给主题导航栏分配菜单，那么插件将自动创建或给自己分配一个可用的菜单

本主题没有页面模板，你可以在对应页面使用短代码或古腾堡区块来渲染模板

### 模板短代码列表

- [friend_link] 友情链接
- [bangumi] 追番
- [favlist] bilibili收藏

你可以继续使用古腾堡编辑器排版，插入任何内容以及下载链接，本主题完全支持渲染
