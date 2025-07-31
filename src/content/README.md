# 文案配置 (Content Configuration)

这个文件夹包含了鲸奇私域智能体应用中所有 UI 交互文案的结构化配置。

## 文件结构

### 核心文案文件

- **`app-texts.ts`** - 应用标题、描述等基础文案
- **`chat-texts.ts`** - 聊天界面相关文案（欢迎消息、提示文字等）
- **`step-texts.ts`** - 步骤指引相关文案
- **`scenario-texts.ts`** - 场景选择器文案
- **`business-texts.ts`** - 业务信息填写步骤文案
- **`content-texts.ts`** - 内容生成步骤文案
- **`user-segment-texts.ts`** - 用户分层步骤文案
- **`editor-texts.ts`** - 内容编辑器文案
- **`task-texts.ts`** - 任务详情页面文案
- **`common-texts.ts`** - 通用 UI 文案（按钮、状态、表单验证等）

### 工具文件

- **`index.ts`** - 统一导出和工具函数
- **`README.md`** - 本说明文档

## 使用方法

### 1. 导入特定模块的文案

```typescript
import { chatTexts, businessTexts } from '@/content';

// 使用静态文案
const welcomeMessage = chatTexts.welcomeMessage;
const uploadTitle = businessTexts.fileUpload.title;
```

### 2. 使用工具函数

```typescript
import { getText, chatTexts } from '@/content';

// 使用路径访问嵌套文案
const placeholder = getText(chatTexts, 'placeholders.step1');

// 调用函数类型的文案
const stepBadge = getText(chatTexts, 'messages.stepBadge', 2); // "步骤 2"
```

### 3. 动态文案函数

某些文案支持动态参数：

```typescript
// 业务信息分析结果
const analysisResult = businessTexts.analysisResponse(extractedInfo);

// 内容统计信息
const statsText = contentTexts.title.description(5, 10); // "包含 5 条内容，覆盖 10 天触达，可以编辑修改"
```

## 文案分类说明

### 1. 静态文案

直接的字符串文案，如标题、描述、按钮文字等。

### 2. 模板文案

包含占位符的文案模板，需要传入参数进行格式化。

### 3. 函数文案

返回字符串的函数，支持复杂的文案生成逻辑。

### 4. 嵌套文案

按功能模块组织的多层级文案结构。

## 维护指南

### 添加新文案

1. 确定文案所属的功能模块
2. 在对应的文件中添加文案配置
3. 更新 `index.ts` 中的导出（如需要）
4. 在组件中使用新文案

### 修改现有文案

1. 找到对应的文案配置文件
2. 修改文案内容
3. 确保所有使用该文案的地方都能正常工作

### 文案国际化准备

当前版本为中文简体，如需支持多语言：

1. 可以将当前配置作为 `zh-CN` 版本
2. 创建对应的其他语言版本文件
3. 修改工具函数支持语言切换

## 注意事项

1. **保持结构一致性** - 新增文案时保持与现有结构的一致性
2. **避免硬编码** - 所有用户可见的文字都应该通过文案配置管理
3. **函数参数类型** - 函数类型的文案要确保参数类型的正确性
4. **性能考虑** - 文案配置会在运行时加载，避免过于复杂的计算

## 示例用法

```typescript
// 在 React 组件中使用
import { chatTexts, businessTexts } from '@/content';

function MyComponent() {
  return (
    <div>
      <h1>{chatTexts.interface.title}</h1>
      <p>{businessTexts.guide.description}</p>
      <button>{businessTexts.analyzeButton.normal}</button>
    </div>
  );
}
```
