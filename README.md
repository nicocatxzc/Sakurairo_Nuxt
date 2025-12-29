# Hachimi headless WordPress theme

基于[WordPress Theme Sakurairo](https://github.com/mirai-mamori/Sakurairo)的样式重构的Nuxt headless WordPress主题

## 功能

目前已支持:

- 文章列表浏览
- 文章和页面浏览
- 评论浏览
- 登录支持
- 内建验证码支持
- 可视化设置支持
- 站点地图
- IPX图像优化

## 如何使用

你需要为你的WordPress安装该插件:[hachimi_rest](https://github.com/nicocatxzc/hachimi_rest)

然后编辑项目中的.env.example,将其中的配置项改为你的WordPress连接信息,并保存为.env
或者随后在你的运行环境添加以下变量,其中对应的值换成你自己的站点连接信息,管理员名称,以及管理员的应用程序密码:

```env
NUXT_WORDPRESS_URL="https://your.wordpress.site/"
NUXT_WORDPRESS_USER_NAME="administrator"
NUXT_WORDPRESS_AUTH_TOKEN="yourAdminToken"
```

你可以在WordPress后台的编辑个人资料页面的底部找到应用程序密码设置,你可以在这里创建一个应用程序密码

如果你的服务器性能足够强劲,你可以在服务端使用pnpm run preview来启动,
或者在本地构建完成后将`.output`目录中的内容上传至你的服务器,然后在目录下使用`cd server&&node index.mjs`来启动应用程序

如果遇到图片无法正常加载的情况,请在server目录下运行`pnpm install sharp`来安装正确的二进制模块,然后重新启动应用程序

你可以添加`PORT`环境变量来指定监听端口

应用程序启动完成后放行其监听端口,为其创建正确的反代服务器即可正常使用

第一次使用请使用你的wordpress管理员账户登录应用并初始化主题设置