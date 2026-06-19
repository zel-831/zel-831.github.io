# 一泠技术个人主页

这是一个用于部署到 GitHub Pages 的个人主页项目。页面风格参考了 `hugoplate-main` 模板的简洁导航、大标题首页、图文 Feature Section、卡片列表和 Call To Action 区域。

项目仍然保持为纯静态实现，只使用 HTML、CSS 和少量原生 JavaScript，不需要 Hugo、Node.js、React、Vue 或 Vite。

## 项目结构

```text
.
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── images/
        ├── banner.png
        ├── service-1.png
        ├── service-2.png
        ├── service-3.png
        └── call-to-action.png
```

## 本地打开

不需要安装任何依赖，也不需要启动开发服务器。

直接在浏览器中打开 `index.html` 即可查看页面。

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库，建议仓库名称使用：

   ```text
   username.github.io
   ```

   其中 `username` 替换为你的 GitHub 用户名。

2. 将本项目文件上传到仓库根目录，至少包含：

   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `assets/images` 目录

3. 打开仓库的 `Settings` 页面。

4. 在左侧找到 `Pages`。

5. 在 `Build and deployment` 中选择：

   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`

6. 保存后等待 GitHub Pages 构建完成。

如果仓库名是 `username.github.io`，最终访问地址通常是：

```text
https://username.github.io
```

## 自定义建议

- 在 `index.html` 中替换姓名、邮箱、GitHub 链接和个人介绍。
- 在项目展示区域把 `#` 替换为真实项目链接。
- 在博客区域把 `#` 替换为真实文章链接。
- 如果不再需要模板源码，可以只保留根目录页面文件和 `assets/images` 目录用于部署。
