// 内容生成步骤文案配置
export const contentTexts = {
  // 加载状态
  loading: {
    message: "正在生成内容序列...",
  },

  // 空状态
  empty: {
    message: "暂无生成的内容序列",
  },

  // 页面标题
  title: {
    main: "内容序列生成完成",
    description: (contentCount: number, maxDays: number) =>
      `包含 ${contentCount} 条内容，覆盖 ${maxDays} 天触达，可以编辑修改`,
  },

  // 内容项显示
  contentItem: {
    dayLabel: (day: number) => `第 ${day} 天`,
    timeLabel: (time: string) => time.slice(0, 5),
    typeLabel: "私聊触达",
    contentLength: (length: number) => `内容长度：${length} 字符`,
  },

  // 操作按钮
  buttons: {
    edit: "编辑",
    preview: "预览",
    continueGenerate: "继续生成内容",
    confirm: "确认内容，下一步",
  },

  // 统计信息
  stats: {
    totalContent: (count: number) => `📊 总计 ${count} 条内容序列`,
    totalDays: (days: number) => `📅 覆盖 ${days} 天`,
  },

  // 继续生成相关
  continueGenerate: {
    loadingMessage: `🎨 正在继续生成内容序列...

✨ 请稍等片刻...`,
    successMessage: (newCount: number, totalCount: number, totalDays: number) =>
      `✅ 已为您继续生成 ${newCount} 条内容！

现在总共有 ${totalCount} 条内容，覆盖 ${totalDays} 天。

您可以继续编辑或预览内容。准备好后，点击"确认内容"进入下一步。`,
    errorMessage: "抱歉，内容生成遇到了问题。请稍后重试。",
  },

  // 确认完成消息
  confirmMessage: (contentCount: number, maxDays: number) =>
    `🎉 内容序列搞定了！

📊 最终配置：
• 内容数量：${contentCount} 条
• 覆盖天数：${maxDays} 天

最后一步最关键：配置用户分层策略。

鲸奇服务了几百家客户，发现一个规律：

转化率高的都在做两件事——

第一种：对所有加过来的用户先培育筛选，把真客户和看热闹的分开。

第二种：对有意向的用户进一步升单转化，把小单变大单，把观望变成交。

不分层的结果是什么？好客户被当普通客户搁置，普通客户被当好客户跟进浪费时间。

分层的结果呢？该培育的培育，该转化的转化，你的效率就上去了，你的转化率就翻倍了。

来，看右边，咱把分层策略也配置了`,
};
