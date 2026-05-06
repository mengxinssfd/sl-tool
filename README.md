# Electron React Template

一个现代化的 Electron + React 桌面应用模板，采用 Vite 构建，支持 TypeScript、Tailwind CSS、国际化等特性。

## ✨ 特性

- ⚡ **快速开发**: 使用 Vite 实现极速热更新
- 🎯 **TypeScript**: 完整的类型支持
- 🎨 **Tailwind CSS 4.x**: 现代化 CSS 框架
- 🗃️ **状态管理**: Zustand 轻量级状态管理
- 🌐 **国际化**: i18next 支持多语言切换
- 🔄 **IPC 通信**: 安全的主进程与渲染进程通信
- 🧪 **测试**: Vitest + React Testing Library
- ✅ **代码质量**: ESLint + Prettier + Husky

## 🛠️ 技术栈

| 技术 | 版本 |
|------|------|
| Electron | ^41.5.0 |
| React | ^19.2.5 |
| TypeScript | ^6.0.3 |
| Vite | ^8.0.10 |
| Tailwind CSS | ^4.2.4 |
| React Router DOM | ^7.14.2 |
| Zustand | ^5.0.13 |
| i18next | ^26.0.8 |
| Vitest | ^4.1.5 |

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 📖 可用命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 完整构建（类型检查 + Vite + Electron） |
| `pnpm build:only` | 跳过类型检查快速构建 |
| `pnpm build:mac` | 构建 macOS 版本 |
| `pnpm build:win` | 构建 Windows 版本 |
| `pnpm build:linux` | 构建 Linux 版本 |
| `pnpm test` | 运行单元测试 |
| `pnpm test:watch` | 监听模式运行测试 |
| `pnpm test:coverage` | 生成测试覆盖率报告 |
| `pnpm lint:check` | ESLint 检查 |
| `pnpm lint:fix` | ESLint 自动修复 |
| `pnpm ts-check:*` | TypeScript 类型检查 |

## 📁 项目结构

```
electron-react-template/
├── electron/                    # Electron 主进程
│   ├── main/
│   │   ├── index.ts            # 主窗口创建逻辑
│   │   └── preload.ts          # 预加载脚本（IPC桥接）
│   └── Signal.ts               # IPC 信号枚举
├── src/                        # React 渲染进程
│   ├── store/                  # 状态管理 (Zustand)
│   │   ├── useCounterStore.ts  # 计数器状态示例
│   │   └── index.ts            # store 导出入口
│   ├── i18n/                   # 国际化模块
│   │   ├── locales/            # 语言包
│   │   ├── init.ts             # i18n 初始化
│   │   └── utils.ts            # 工具函数
│   ├── layouts/                # 布局组件
│   │   ├── App.layout.tsx      # 主布局
│   │   ├── Error.layout.tsx    # 错误页面
│   │   └── NotFound.layout.tsx # 404 页面
│   ├── App.tsx                 # 主应用组件
│   ├── router.tsx              # 路由配置
│   ├── channel.ts              # IPC 通道封装
│   └── index.css               # 全局样式
├── .env                        # 环境变量
├── vite.config.ts              # Vite 配置
├── electron-builder.json5      # 打包配置
└── tsconfig.json               # TypeScript 配置
```

## 🧩 核心模块

### IPC 通信

主进程与渲染进程通过 `Signal` 枚举定义的信号进行通信：

```typescript
// electron/Signal.ts
enum Signal {
  LanguageChanged = '0',
}
```

渲染进程通过 `channel` 发送消息：

```typescript
import { channel } from '@/channel';

channel.send(Signal.LanguageChanged, 'zh');
```

### 国际化

支持中英文切换，语言包位于 `src/i18n/locales/`：

```typescript
// 使用
import { useText, changeLanguage } from '@/i18n';

const t = useText();
changeLanguage('en'); // 切换英文
```

### 路由

使用 React Router DOM 7.x 的 HashRouter：

```typescript
// src/router.tsx
export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <App /> },
    ],
  },
]);
```

### 状态管理 (Zustand)

使用 Zustand 进行轻量级状态管理：

```typescript
// src/store/useCounterStore.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

组件中使用：

```typescript
import { useCounterStore } from '@/store';

function MyComponent() {
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## 🔧 配置说明

### Vite 配置

- 路径别名：`@` → `./src`
- 开发服务器端口：5173
- 构建输出：`dist/`

### Tailwind CSS 4.x

使用 CSS-first 配置，自定义主题变量在 `src/index.css`：

```css
@theme {
  --color-gray-900: #0f172a;
  --color-blue-600: #2563eb;
  /* ... */
}
```

## 📦 构建与发布

### 开发构建

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

### 平台特定构建

```bash
# macOS
pnpm build:mac

# Windows
pnpm build:win

# Linux
pnpm build:linux
```

## 🔒 安全

- `contextIsolation: true` - 隔离渲染进程
- `nodeIntegration: false` - 禁用 Node.js 集成
- 通过预加载脚本安全暴露 API

## 📝 代码规范

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Commitlint**: 提交信息规范（conventional commits）
- **Husky**: Git 钩子，提交前自动检查

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 PR！
