// 内容编辑器文案配置
export const editorTexts = {
  // 对话框标题
  dialog: {
    title: "编辑内容",
    description: "修改营销内容的标题、描述和正文",
  },

  // 内容类型标签
  contentTypes: {
    email: "邮件",
    sms: "短信",
    push: "推送",
    social: "社交",
    private: "私聊",
  },

  // 编辑模式按钮
  modes: {
    edit: "编辑",
    preview: "预览",
  },

  // 表单字段
  form: {
    title: {
      label: "标题",
      placeholder: "输入内容标题",
    },
    description: {
      label: "描述",
      placeholder: "输入内容描述",
    },
    days: {
      label: "发送天数",
      placeholder: "第几天发送",
    },
    time: {
      label: "发送时间",
      placeholder: "发送时间",
    },
    content: {
      label: "正文内容",
      placeholder: "输入正文内容，支持Markdown格式",
    },
  },

  // 预览模式显示
  preview: {
    dayLabel: (day: number) => `📅 第 ${day} 天`,
    timeLabel: (time: string) => `🕒 ${time}`,
    typeLabel: "💬 私聊触达",
  },

  // 底部操作按钮
  actions: {
    cancel: "取消",
    save: "保存修改",
  },
};
