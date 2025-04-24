# 树形拖拽组件
基于 Vue3 和 Ant Design Vue 实现的树形拖拽组件，支持以下功能：
1. 节点拖拽移动
2. 节点合并
3. 拖拽提示效果(⚠️ TODO: 待实现功能)
## 功能说明
- **节点合并**：拖拽节点到目标节点上方松开，将拖拽节点所有子节点合并目标节点，并删除拖拽节点
- **节点移动**：拖拽节点到目标节点上/下方松开，节点将移动位置
- **层级限制**：只能在同一层级节点之间拖拽
## 安装与使用
1. node 版本要求：`v22.x.x` 以上
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 运行测试：`npm run test`
## 技术栈
- Vue 3.X
- Ant Design Vue 4.X
- Vitest (单元测试)

功能主要在 `src/components/tree/index.vue` 中实现，在home.page.vue 中使用，路由为 `/home`
## 目录结构
```bash
├── deploy                                     docker部署目录
│   ├── Dockerfile
│   ├── nginx.conf
├── mock                                       mock数据目录
│   ├── tree.ts
├── src                                        工作目录
│   ├── main.ts
│   ├── app.vue
│   ├── app.less
│   ├── components
│   │   ├── tree
│   │   │   ├── index.vue
│   │   │   ├── index.test.ts
│   │   │   ├── useDragTree.ts
│   │   │   └── utils.ts
│   ├── pages
│   │   ├── home.page.vue
│   ├── router
│   │   ├── index.ts
│   ├── styles
│   │   ├── uno.less
│   ├── utils
│   │   └── cache-tree.ts

```

对于tree结构，为了方便查询，内部使用了缓存机制: `UniversalTreeCache`
