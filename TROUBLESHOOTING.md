# 故障排除文档 (Troubleshooting Guide)

本文档记录项目开发过程中遇到的所有问题和解决方案，用于积累经验和快速解决类似问题。

---

## 问题 #001: Next.js + Tailwind CSS 样式不显示

**日期**: 2024-07-28  
**严重程度**: 🔴 Critical  
**症状**:

- 页面能正常加载，内容显示正常
- HTML 中包含 Tailwind 类名，但完全没有样式效果
- 页面显示为纯文本，无任何 CSS 样式

**错误表现**:

```
- 服务器正常启动 (Next.js 14.1.0)
- 页面加载成功，但显示为纯文本
- 浏览器开发者工具显示HTML包含Tailwind类名
- 但没有对应的CSS样式生效
```

**根本原因**:
当自定义 PostCSS 配置时，Next.js 会**完全禁用**默认行为。需要手动安装和配置所有必需的 PostCSS 插件。

**解决方案**:

### 1. 安装必需的 PostCSS 插件

```bash
npm install postcss-flexbugs-fixes postcss-preset-env --save-dev
```

### 2. 正确配置 postcss.config.js

```javascript
module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
    'tailwindcss',
  ],
};
```

### 3. 清除缓存并重启

```bash
rm -rf .next
npm run dev
```

**关键知识点**:

- Next.js 官方文档警告：自定义 PostCSS 配置会完全禁用默认行为
- 必须手动安装: `postcss-flexbugs-fixes`, `postcss-preset-env`
- 配置顺序很重要：flexbugs-fixes → preset-env → tailwindcss
- 删除多余的配置文件，只保留一个 `postcss.config.js`

**相关文档**:

- [Next.js PostCSS Configuration](https://nextjs.org/docs/pages/building-your-application/configuring/post-css)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)

**预防措施**:

- 使用 Next.js 默认配置时不要创建自定义 PostCSS 配置
- 如需自定义，确保安装所有必需依赖
- 定期清除 `.next` 缓存目录

---

## 模板：新问题记录格式

```markdown
## 问题 #XXX: [问题简短描述]

**日期**: YYYY-MM-DD
**严重程度**: 🔴/🟡/🟢 Critical/Warning/Info
**症状**:
- [具体表现1]
- [具体表现2]

**错误表现**:
```

[错误信息或日志]

```

**根本原因**:
[问题的根本原因分析]

**解决方案**:
[详细的解决步骤]

**关键知识点**:
- [重要的技术要点]
- [需要注意的细节]

**相关文档**:
- [相关链接]

**预防措施**:
- [如何避免类似问题]
```

---

## 常见问题快速检查清单

### Next.js 样式问题

- [ ] 检查 `postcss.config.js` 配置
- [ ] 确认必需插件已安装
- [ ] 清除 `.next` 缓存
- [ ] 检查 `globals.css` 中的 Tailwind 指令
- [ ] 验证 `tailwind.config.js` 的 content 路径

### 服务器启动问题

- [ ] 检查端口是否被占用
- [ ] 确认 Node.js 版本兼容性
- [ ] 检查 `package.json` 中的脚本配置
- [ ] 查看是否有语法错误

### 构建问题

- [ ] 检查 TypeScript 类型错误
- [ ] 确认所有依赖已正确安装
- [ ] 检查环境变量配置
- [ ] 验证文件路径和导入语句

---

## 问题 #003: Vercel 部署失败 - TypeScript 编译错误

**日期**: 2024-07-28  
**严重程度**: 🔴 Critical  
**症状**:

- 本地开发正常，但 Vercel 部署失败
- TypeScript 编译错误：Property 'isAutoCondition' does not exist
- 构建过程中断，无法完成部署

**错误表现**:

```
Failed to compile.
./src/app/task/[id]/page.tsx:257:39
Type error: Property 'isAutoCondition' does not exist on type 'UserSegment'.
```

**根本原因**:
在简化用户分层功能时，从`UserSegment`类型中移除了`isAutoCondition`和`requirements`字段，但任务详情页面中仍然在使用这些已删除的属性。

**解决方案**:

### 1. 定位问题文件

```bash
# 搜索所有使用已删除属性的地方
grep -r "isAutoCondition" src/
grep -r "requirements" src/
```

### 2. 修复任务详情页面

```typescript
// 修复前
<Badge
  variant='outline'
  className={
    segment.isAutoCondition ? "text-green-600" : "text-orange-600"
  }>
  {segment.isAutoCondition ? "自动判定" : "手动打标签"}
</Badge>

// 修复后
<Badge
  variant='outline'
  className="text-orange-600">
  手动打标签
</Badge>
```

### 3. 验证构建

```bash
npm run build
```

**关键知识点**:

- 修改数据结构时要检查所有使用该结构的地方
- 本地开发模式不会进行严格的 TypeScript 检查
- Vercel 部署会进行完整的类型检查和构建验证
- 使用`git grep`或 IDE 全局搜索来定位所有引用

**相关文档**:

- [Next.js TypeScript Documentation](https://nextjs.org/docs/pages/building-your-application/configuring/typescript)
- [Vercel Build Process](https://vercel.com/docs/concepts/deployments/build-step)

**预防措施**:

- 提交 github 前，需要运行`npm run build`验证
- 使用 TypeScript 严格模式进行开发
- 设置 pre-commit hook 进行构建检查
- 定期进行全量构建测试

---

**文档维护说明**:

- 每次遇到新问题都要及时记录
- 问题编号按时间顺序递增
- 定期回顾和更新解决方案
- 分享给团队成员避免重复踩坑
