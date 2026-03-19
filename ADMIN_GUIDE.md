# 管理员指南 / Admin Guide

## 中文支持 / Chinese Support

网站支持中英文切换。用户可以通过导航栏右上角的语言切换按钮在英文和中文之间切换。

**The website supports both English and Chinese. Users can switch languages using the language switcher button in the top-right corner of the navigation bar.**

### 翻译文件位置 / Translation Files Location

- 英文翻译: `client/src/locales/en.json`
- 中文翻译: `client/src/locales/zh.json`

### 添加新翻译 / Adding New Translations

1. 在两个翻译文件中添加相同的键
2. 在组件中使用 `useTranslation()` hook 获取翻译

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('nav.home')}</h1>;
}
```

---

## 管理后台 / Admin Dashboard

### 访问管理后台 / Accessing Admin Dashboard

1. 登录为管理员用户（需要 `role = 'admin'`）
2. 访问 `/admin/blog` 或 `/admin/portfolio`

### 管理员认证 / Admin Authentication

- 只有 `role = 'admin'` 的用户可以访问管理页面
- 在数据库中手动设置用户角色：
  ```sql
  UPDATE users SET role = 'admin' WHERE openId = 'your-open-id';
  ```

---

## 博客管理 / Blog Management

### 访问博客管理 / Access Blog Management

导航到 `/admin/blog`

### 功能 / Features

- **列表视图**: 查看所有已发布的文章
- **创建文章**: 点击"新建文章"按钮
- **编辑文章**: 点击编辑按钮修改现有文章
- **删除文章**: 点击删除按钮（需要确认）

### 文章字段 / Article Fields

| 字段 | 类型 | 说明 |
|------|------|------|
| 文章标题 | String | 文章的标题 |
| URL别名 | String | 用于URL的唯一标识符 |
| 摘要 | String | 文章的简短描述 |
| 内容 | String | 完整的文章内容 |
| 分类 | String | 文章的分类标签 |
| 发布日期 | Date | 文章的发布日期 |

### 示例 / Example

```
标题: Getting Started with p5.js
URL别名: getting-started-p5js
摘要: Learn the basics of creative coding with p5.js
分类: Tutorial
发布日期: 2026-03-18
```

---

## 作品集管理 / Portfolio Management

### 访问作品集管理 / Access Portfolio Management

导航到 `/admin/portfolio`

### 功能 / Features

- **列表视图**: 查看所有项目
- **创建项目**: 点击"新建项目"按钮
- **编辑项目**: 点击编辑按钮修改现有项目
- **删除项目**: 点击删除按钮（需要确认）
- **标记精选**: 勾选"精选"复选框将项目显示在首页

### 项目字段 / Project Fields

| 字段 | 类型 | 说明 |
|------|------|------|
| 项目标题 | String | 项目的名称 |
| URL别名 | String | 用于URL的唯一标识符 |
| 项目描述 | String | 项目的详细描述 |
| 技术栈 | String | 使用的技术（逗号分隔） |
| 项目链接 | URL | 项目的外部链接 |
| 项目图片 | URL | 项目的缩略图URL |
| 精选 | Boolean | 是否在首页显示 |

### 示例 / Example

```
标题: Kinetic Portfolio
URL别名: kinetic-portfolio
描述: An interactive personal portfolio website featuring p5.js animations
技术栈: React, TypeScript, p5.js, WebGL, Tailwind CSS
链接: https://example.com
图片: https://cdn.example.com/project.jpg
精选: ✓
```

---

## 数据库操作 / Database Operations

### 种子数据 / Seed Data

运行以下命令添加示例数据：

```bash
pnpm seed
```

这将添加：
- 3 篇示例博客文章
- 4 个示例作品集项目

### 手动查询 / Manual Queries

查看所有博客文章：
```sql
SELECT * FROM blogPosts ORDER BY createdAt DESC;
```

查看所有作品集项目：
```sql
SELECT * FROM portfolioProjects ORDER BY createdAt DESC;
```

查看精选项目：
```sql
SELECT * FROM portfolioProjects WHERE featured = 1;
```

---

## 后端API / Backend API

### tRPC 路由 / tRPC Routes

#### 博客 / Blog

```typescript
// 获取所有文章
trpc.blog.list.useQuery()

// 按URL别名获取文章
trpc.blog.bySlug.useQuery({ slug: 'getting-started-p5js' })

// 创建文章（需要管理员权限）
trpc.blog.create.useMutation({
  title: 'New Article',
  slug: 'new-article',
  content: 'Article content...',
  date: '2026-03-18'
})

// 更新文章（需要管理员权限）
trpc.blog.update.useMutation({
  id: 1,
  title: 'Updated Title'
})

// 删除文章（需要管理员权限）
trpc.blog.delete.useMutation({ id: 1 })
```

#### 作品集 / Portfolio

```typescript
// 获取所有项目
trpc.portfolio.list.useQuery()

// 获取精选项目
trpc.portfolio.featured.useQuery()

// 按URL别名获取项目
trpc.portfolio.bySlug.useQuery({ slug: 'kinetic-portfolio' })

// 创建项目（需要管理员权限）
trpc.portfolio.create.useMutation({
  title: 'New Project',
  slug: 'new-project',
  description: 'Project description...'
})

// 更新项目（需要管理员权限）
trpc.portfolio.update.useMutation({
  id: 1,
  title: 'Updated Title'
})

// 删除项目（需要管理员权限）
trpc.portfolio.delete.useMutation({ id: 1 })
```

---

## 常见问题 / FAQ

### Q: 如何添加新的管理员？
**A:** 在数据库中执行以下SQL：
```sql
UPDATE users SET role = 'admin' WHERE openId = 'user-open-id';
```

### Q: 如何修改翻译？
**A:** 编辑 `client/src/locales/en.json` 或 `client/src/locales/zh.json` 文件，然后重启开发服务器。

### Q: 如何添加新的管理页面？
**A:** 
1. 创建新的页面组件 `client/src/pages/Admin*.tsx`
2. 使用 `AdminLayout` 包装内容
3. 在 `client/src/App.tsx` 中添加路由
4. 在 `client/src/locales/*.json` 中添加翻译

### Q: 如何备份数据？
**A:** 使用MySQL导出命令：
```bash
mysqldump -u username -p database_name > backup.sql
```

---

## 开发指南 / Development Guide

### 添加新的CRUD操作 / Adding New CRUD Operations

1. 在 `drizzle/schema.ts` 中定义表结构
2. 在 `server/db.ts` 中添加查询函数
3. 在 `server/routers.ts` 中添加tRPC路由
4. 在 `client/src/pages/Admin*.tsx` 中创建UI
5. 编写单元测试 `server/*.test.ts`

### 测试 / Testing

运行所有测试：
```bash
pnpm test
```

运行特定测试文件：
```bash
pnpm test server/blog.test.ts
```

---

## 部署注意事项 / Deployment Notes

1. 确保设置了正确的数据库连接字符串
2. 设置管理员用户的角色
3. 运行 `pnpm seed` 添加初始数据（可选）
4. 在生产环境中使用 `pnpm build && pnpm start`

---

**最后更新 / Last Updated**: 2026-03-18
